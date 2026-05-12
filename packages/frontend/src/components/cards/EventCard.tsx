import type { EventTemplate } from '@life-restart/shared';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: EventTemplate;
  onChoose: (index: number) => void;
  disabled?: boolean;
}

export default function EventCard({ event, onChoose, disabled }: EventCardProps) {
  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="panel max-w-lg w-full mx-auto"
    >
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-xl font-serif text-jianghu-gold mb-3 text-center"
      >
        {event.title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-jianghu-ink/80 leading-relaxed mb-6 text-center px-4"
      >
        {event.description}
      </motion.p>
      <div className="flex flex-col gap-3">
        {event.choices.map((choice, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
            className="w-full text-left p-3 rounded border border-jianghu-gold/20
                       hover:border-jianghu-gold hover:bg-jianghu-gold/5
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onChoose(i)}
            disabled={disabled}
          >
            <span className="text-jianghu-ink">{choice.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
