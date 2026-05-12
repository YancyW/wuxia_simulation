import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUiStore } from '../stores/uiStore';
import { useGameStore } from '../stores/gameStore';
import * as api from '../api/client';
import type { SaveEntry } from '../global';

export default function MainMenu() {
  const setView = useUiStore((s) => s.setView);
  const setSelectedSave = useUiStore((s) => s.setSelectedSave);
  const loadGame = useGameStore((s) => s.loadGame);
  const [saves, setSaves] = useState<SaveEntry[]>([]);
  const [showSaves, setShowSaves] = useState(false);

  useEffect(() => {
    api.getSaveList().then(setSaves).catch(() => {});
  }, []);

  const handleLoad = async (saveId: string) => {
    try {
      await loadGame(saveId);
      setSelectedSave(saveId);
      setView('game');
    } catch {
      // ignore
    }
  };

  const handleDelete = async (saveId: string) => {
    await api.deleteSave(saveId);
    setSaves((prev) => prev.filter((s) => s.id !== saveId));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.h1
          animate={{ textShadow: ['0 0 20px rgba(201,169,110,0.3)', '0 0 40px rgba(201,169,110,0.6)', '0 0 20px rgba(201,169,110,0.3)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl font-serif font-bold text-jianghu-gold tracking-widest mb-2"
        >
          江湖人生
        </motion.h1>
        <p className="text-jianghu-ink/50 text-lg">一入江湖，岁月如歌</p>
      </motion.div>

      {/* Menu buttons */}
      {!showSaves ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-4 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary w-48 text-lg"
            onClick={() => setView('create')}
          >
            初入江湖
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-ghost w-48"
            onClick={() => {
              api.getSaveList().then(setSaves);
              setShowSaves(true);
            }}
          >
            再续前缘
          </motion.button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3 items-center w-80 max-h-64 overflow-y-auto">
          <h3 className="text-jianghu-gold font-serif text-lg">存档</h3>
          {saves.length === 0 ? (
            <p className="text-jianghu-ink/50">暂无存档</p>
          ) : (
            saves.map((save) => (
              <div key={save.id} className="panel w-full flex items-center justify-between">
                <div>
                  <p className="text-jianghu-ink">{save.name}</p>
                  <p className="text-jianghu-ink/40 text-sm">{save.updatedAt.slice(0, 10)}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary text-sm px-3 py-1" onClick={() => handleLoad(save.id)}>
                    载入
                  </button>
                  <button className="btn-danger text-sm px-3 py-1" onClick={() => handleDelete(save.id)}>
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
          <button className="btn-ghost mt-2" onClick={() => setShowSaves(false)}>返回</button>
        </div>
      )}
    </div>
  );
}
