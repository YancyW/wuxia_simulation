# 江湖人生 — 架构与流程文档

## 一、项目概览

```
Life_Restart/
  data/                         # 游戏数据 (TOML)
    events/                     # 事件与副本
      youth.toml                # 少年事件 (12)
      young-adult.toml          # 青年事件 (23)
      adult.toml                # 壮年事件 (12)
      middle-age.toml           # 中年事件 (15)
      dungeons.toml             # 副本大事件 (3)
    martial-arts.toml           # 武功数据 (26)
    martial-levels.toml         # 武学境界 (7)
    life-stages.toml            # 生命阶段 (4)
    sects.toml                  # 门派 (8)
    stats.toml                  # 属性名 & 出身
    npcs.toml                   # NPC 模板 (7)

  packages/
    shared/                     # @life-restart/shared
      src/types/                # TS 类型定义
      src/constants/            # 标签映射 (STAT_NAMES 等)
      src/data/                 # 武功/门派数据 (前端用)
    electron/                   # @life-restart/electron
      src/main.ts               # Electron 入口
      src/preload.js            # IPC 桥接 (CJS)
      src/database/             # SQLite + Drizzle ORM
      src/engine/               # 游戏引擎
      src/data/loader.ts        # TOML 数据加载器
      src/ipc/handlers.ts       # IPC 处理器
    frontend/                   # @life-restart/frontend
      src/views/                # 页面组件
      src/components/           # UI 组件
      src/stores/               # Zustand 状态管理
      src/api/client.ts         # IPC 调用封装
```

## 二、核心数据流

```
┌──────────────────────────────────────────────────────────────┐
│                       启动流程                                │
│                                                              │
│  main.ts                                                     │
│    │─ loadAllData()          ← 读取 data/*.toml              │
│    │─ initGameData(data)     ← 注入引擎                      │
│    │─ registerIpcHandlers()  ← 注册 IPC                      │
│    │─ createWindow()         ← 打开 Electron 窗口            │
│    │      │                                                   │
│    │      └── preload.js     ← 暴露 window.api (IPC桥)        │
│    │                                                          │
│    └── Vite dev server       ← 加载 React 前端               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      游戏循环                                 │
│                                                              │
│  前端 (React)                主进程 (Electron)               │
│  ────────                    ──────────────                   │
│  gameStore.createGame() ──IPC──→ createCharacter()           │
│       │                            │─ 生成随机属性            │
│       │                            │─ 写入 SQLite            │
│       │                            │─ 返回 Character          │
│       │ ←──────────────────────────┘                         │
│       │                                                      │
│  gameStore.advanceTurn() ──IPC──→ advanceTurn()              │
│       │                            │─ selectEvent()          │
│       │                            │   ├─ 检查活跃副本?       │
│       │                            │   ├─ 检查新副本触发?     │
│       │                            │   └─ 权重随机选事件     │
│       │                            │─ 返回 EventTemplate     │
│       │ ←──────────────────────────┘                         │
│       │                                                      │
│  EventCard 展示事件                                           │
│  玩家点击选项                                                 │
│       │                                                      │
│  gameStore.choose(idx) ──IPC──→ makeChoice()                 │
│       │                            │─ applyEffects()         │
│       │                            │─ 处理副本阶段标记        │
│       │                            │─ 学武功/入派/结关系     │
│       │                            │─ advanceAge()           │
│       │                            │─ 写入 SQLite            │
│       │                            │─ 获取下个事件            │
│       │ ←──────────────────────────┘                         │
│       │                                                      │
│  OutcomeCard 展示结果                                         │
│  点击继续 → 循环                                              │
│                                                              │
│  直到 death → LifeSummary 结局页面                            │
└──────────────────────────────────────────────────────────────┘
```

## 三、数据库 Schema (SQLite)

```
saves                 ── 存档
  id, name, character_id, created_at, updated_at

characters            ── 角色核心
  id, name, gender, age, life_stage, martial_level, sect_id,
  flags (JSON string), is_alive, died_at, death_cause, created_at,
  bone, wits, qi, technique, agility, reputation, honor, constitution

martial_arts_learned  ── 已学武功
  id, character_id, art_id, proficiency, proficiency_value, learned_at

relationships         ── 人物关系
  id, character_id, npc_name, relation_type, affinity, description

event_logs            ── 事件日志
  id, character_id, event_id, choice_index, life_stage, age, created_at
```

## 四、游戏系统

### 4.1 属性 (8项)
| 属性 | 英文 | 范围 | 说明 |
|------|------|------|------|
| 根骨 | bone | 1-100 | 武学天赋，影响练武速度和武功上限 |
| 悟性 | wits | 1-100 | 领悟力，影响学习新武功的速度 |
| 内力 | qi | 1-100 | 内功修为深浅，影响战斗续航 |
| 招式 | technique | 1-100 | 外功招式熟练度，影响实战发挥 |
| 轻功 | agility | 1-100 | 身法轻灵，影响追击、逃脱和探索 |
| 声望 | reputation | 0-100 | 江湖名望，影响高级事件触发 |
| 侠义 | honor | -100~100 | 正邪倾向，影响结局路线 |
| 体质 | constitution | 1-100 | 身体根基，影响受伤恢复和寿命 |

### 4.2 武学境界 (7级)
初窥门径 → 略有小成 → 登堂入室 → 炉火纯青 → 出神入化 → 一代宗师 → 天下第一

由 `bone + wits + qi + technique` 总和决定

### 4.3 生命阶段 (4个)
| 阶段 | 年龄 | 回合数 |
|------|------|--------|
| 少年 | 10-16 | ~7回 |
| 青年 | 17-30 | ~14回 |
| 壮年 | 31-45 | ~15回 |
| 中年 | 46-60 | ~14回 |

死亡判定从 46 岁开始，概率随年龄递增、随体质递减

### 4.4 武功体系 (26种)
6 类：内功 ×5, 拳掌 ×4, 剑法 ×5, 刀法 ×3, 轻功 ×3, 奇门 ×6

熟练度：初学(1-25) → 熟练(26-50) → 精通(51-75) → 化境(76-100)

### 4.5 门派 (8个)
少林、武当、丐帮、华山、峨眉、逍遥、日月神教、散修

各有入门条件和专属武功

### 4.6 事件系统

**普通事件**：基于生命阶段筛选 → 条件匹配 → 权重随机

**副本事件**：多阶段大事件，通过 flags 追踪进度
- 触发：满足条件 → 显示副本入口事件
- 进行：`dungeon_{id}_active` 标记激活，每回合返回下一阶段
- 完成：所有阶段通过 → `dungeon_{id}_completed`，发放奖励

### 4.7 结局类型
| 结局 | 条件 |
|------|------|
| 武林盟主 | 侠义>60, 声望≥10 |
| 一代大侠 | 侠义>60 |
| 一代宗师 | 武学境界≥一代宗师 |
| 魔教教主 | 侠义<-60, 声望≥10 |
| 身败名裂 | 侠义<-60 |
| 江湖传说 | 声望≥15 |
| 归隐高人 | 默认 |

## 五、IPC 通道

| 通道 | 方向 | 说明 |
|------|------|------|
| `game:create` | 前端→后端 | 创建角色 (CharacterCreateInput) |
| `game:state` | 前端→后端 | 获取存档状态 |
| `game:next` | 前端→后端 | 推进回合，返回事件 |
| `game:choose` | 前端→后端 | 做出选择 (choiceIndex) |
| `game:list` | 前端→后端 | 存档列表 |
| `game:delete` | 前端→后端 | 删除存档 |

## 六、扩展指南

### 新增普通事件
在 `data/events/{stage}.toml` 中添加：
```toml
[[events]]
id = "unique_id"
title = "事件标题"
description = "事件描述"
life_stages = ["young_adult"]
rarity = 3
min_wits = 5           # 可选条件

[[events.choices]]
text = "选项文字"
outcome_text = "结果描述"
bone = 1               # 属性变化
wits = 2
set_flags = ["flag1"]  # 可选标记
learn_art = "art_id"   # 可选学武功
```

### 新增副本
在 `data/events/dungeons.toml` 中添加：
```toml
[[dungeons]]
id = "new_dungeon"
title = "副本名称"
summary = "副本简介"
life_stages = ["adult"]
rarity = 1
min_reputation = 10     # 触发条件

[[dungeons.stages]]
id = "stage1"
title = "[副本] 阶段1标题"
description = "阶段描述"

[[dungeons.stages.choices]]
text = "选项"
outcome_text = "结果"

[dungeons.reward]       # 完成全部阶段后的奖励
reputation = 3
set_flags = ["completed_new_dungeon"]
```

### 新增武功
在 `data/martial-arts.toml` 中添加：
```toml
[[arts]]
id = "new_art"
name = "武功名称"
type = "internal"       # internal/palm/sword/blade/movement/special
description = "武功描述"
rarity = 3
min_bone = 4
sect_only = "shaolin"   # 可选：限定门派
```

### 新增门派
在 `data/sects.toml` 中添加：
```toml
[[sects]]
id = "new_sect"
name = "门派名称"
description = "门派描述"
condition_wits_min = 5
exclusive_arts = ["art1", "art2"]
```

## 七、启动与构建

```bash
pnpm dev          # 一键启动 (构建 + Vite + Electron)
pnpm typecheck    # TypeScript 类型检查
launch.bat        # Windows 双击启动
./launch.sh       # Bash 启动
```
