export const FLAG_NAMES: Record<string, string> = {
  // 出身
  street_orphan: '市井孤儿',
  martial_family: '武林世家',
  scholar_family: '书香门第',
  merchant_family: '商贾之家',
  noble_family: '官宦之后',

  // 少年经历
  met_mysterious_elder: '遇神秘老人',
  promised_to_elder: '承诺寻访老人',
  sect_trial_passed: '通过门派测试',
  beggar_rhyme: '老乞丐口诀',

  // 青年经历
  independent_path: '独自修行',
  met_romance: '邂逅红颜',
  romance_confirmed: '情定终身',
  met_wandering_swordsman: '遇游侠',
  poet_warrior: '诗酒风流',
  joined_alliance: '加入联盟',
  found_elder: '找到老人',
  helped_mingjiao: '救助明教中人',
  understood_sword_intent: '悟得剑意',

  // 壮年经历
  undercover: '卧底身份',
  exposed_org: '瓦解组织',
  betrayed_brother: '同门相残',
  avenged: '大仇得报',
  let_go: '放下执念',
  founded_sect: '开宗立派',
  has_child: '子女在侧',
  child_trained: '子女习武',
  adopted_child: '收养义女',
  learned_mechanism: '学会机关术',

  // 中年经历
  has_disciple: '收有弟子',
  has_disciple_name: '弟子凌云',
  retired: '归隐山林',
  became_leader: '武林领袖',
  became_sect_leader: '接任掌门',
  learned_heritage: '知晓身世',
  taohua_legacy: '桃花岛传承',
  alliance_leader: '联盟盟主',
  gave_map_away: '赠图后辈',
  spawned_demon_leader: '饶恕魔头',

  // 副本完成
  completed_ancient_tomb: '通关古墓',
  completed_tournament: '通关武林大会',
  completed_raid_demon_sect: '通关围剿魔教',
  completed_guangming_siege: '通关光明顶',
  completed_xiake_island: '通关侠客岛',
  completed_chuangwang_treasure: '通关闯王宝藏',
  completed_sword_graveyard: '通关剑冢',
  completed_tianlong_temple: '通关天龙寺',
  completed_xiangyang_defense: '通关襄阳保卫战',
  joined_orthodox_side: '加入正派联军',
  joined_mingjiao_side: '加入明教一方',
  spared_demon_leader: '饶恕魔教教主',
  has_dragon_sword: '龙渊剑主',
  understood_martial_truth: '参悟武学真谛',
  honored_ancestor: '光耀门楣',

  // 主线一：血仇
  ms_revenge_stage_0: '血仇·开端',
  ms_revenge_stage_1: '血仇·追查',
  ms_revenge_forgive: '血仇·宽恕',
  ms_revenge_avenge: '血仇·复仇',
  ms_revenge_complete: '血仇·了结',

  // 主线二：盟主
  ms_leader_stage_0: '盟主·初显',
  ms_leader_stage_1: '盟主·调停',
  ms_leader_stage_2: '盟主·建盟',
  ms_leader_stage_3: '盟主·考验',
  ms_leader_complete: '盟主·功成',
  founded_alliance: '建立联盟',

  // 主线三：传承
  ms_legacy_stage_0: '传承·残篇',
  ms_legacy_stage_1: '传承·寻经',
  ms_legacy_stage_2: '传承·重现',
  ms_legacy_complete: '传承·传灯',

  // 主线四：正邪
  ms_moral_stage_0: '正邪·疑云',
  ms_moral_stage_1: '正邪·抉择',
  ms_moral_light: '正邪·光明',
  ms_moral_dark: '正邪·暗路',
  ms_moral_stage_2: '正邪·分岔',
  ms_moral_complete: '正邪·终判',

  // 主线五：天下第一
  ms_champion_stage_0: '武道·初露',
  ms_champion_stage_1: '武道·逐鹿',
  ms_champion_stage_2: '武道·夺魁',
  ms_champion_won: '武道·冠军',
  ms_champion_complete: '武道·巅峰',

  // 主线六：铸剑
  ms_swordsmith_stage_0: '铸剑·残剑',
  ms_swordsmith_stage_1: '铸剑·寻材',
  ms_swordsmith_stage_2: '铸剑·龙渊',
  ms_swordsmith_complete: '铸剑·剑成',

  // 主线七：商路
  ms_trade_stage_0: '商路·启程',
  ms_trade_stage_1: '商路·除障',
  ms_trade_stage_2: '商路·通衢',
  ms_trade_complete: '商路·传奇',

  // 主线八：师徒
  ms_disciple_stage_0: '师徒·收徒',
  ms_disciple_stage_1: '师徒·试炼',
  ms_disciple_stage_2: '师徒·决裂',
  ms_disciple_complete: '师徒·传承',

  // 主线九：家族
  ms_family_stage_0: '家族·信物',
  ms_family_stage_1: '家族·日记',
  ms_family_complete: '家族·遗志',

  // 主线十：秘闻
  ms_spy_stage_0: '秘闻·窃听',
  ms_spy_stage_1: '秘闻·入影',
  joined_shadow: '加入影子',
  ms_spy_stage_2: '秘闻·天机',
  ms_spy_complete: '秘闻·守密',
};

export function flagName(key: string): string {
  return FLAG_NAMES[key] || key;
}
