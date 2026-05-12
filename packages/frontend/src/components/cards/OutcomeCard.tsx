import { motion } from 'framer-motion';

interface OutcomeCardProps {
  choiceText: string;
  outcomeText: string;
  effects: Record<string, number>;
  onContinue: () => void;
}

export default function OutcomeCard({ choiceText, outcomeText, effects, onContinue }: OutcomeCardProps) {
  const significantEffects = Object.entries(effects).filter(([, v]) => v !== 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="panel max-w-lg w-full mx-auto text-center"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-jianghu-ink/50 text-sm mb-3"
      >
        「{choiceText}」
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-jianghu-ink/80 leading-relaxed mb-4"
      >
        {outcomeText}
      </motion.p>

      {significantEffects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {significantEffects.map(([stat, val], i) => (
            <motion.span
              key={stat}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
              className={`px-2 py-0.5 rounded text-sm ${
                val > 0 ? 'text-jianghu-jade bg-jianghu-jade/10' : 'text-jianghu-red bg-jianghu-red/10'
              }`}
            >
              {stat} {val > 0 ? `+${val}` : val}
            </motion.span>
          ))}
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="btn-primary"
        onClick={onContinue}
      >
        继续
      </motion.button>
    </motion.div>
  );
}
