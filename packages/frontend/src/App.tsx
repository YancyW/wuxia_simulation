import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore } from './stores/uiStore';
import { useGameStore } from './stores/gameStore';
import MainMenu from './views/MainMenu';
import CharacterCreate from './views/CharacterCreate';
import GameView from './views/GameView';
import LifeSummary from './views/LifeSummary';

function AppContent() {
  const currentView = useUiStore((s) => s.currentView);
  const died = useGameStore((s) => s.died);

  const effectiveView = (died && currentView === 'game') ? 'summary' : currentView;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={effectiveView}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full h-screen overflow-hidden bg-jianghu-bg"
      >
        {effectiveView === 'menu' && <MainMenu />}
        {effectiveView === 'create' && <CharacterCreate />}
        {effectiveView === 'game' && <GameView />}
        {effectiveView === 'summary' && <LifeSummary />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return <AppContent />;
}
