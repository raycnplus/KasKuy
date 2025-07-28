import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const AccordionFAQ = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          {...item}
          index={index}
          isActive={activeIndex === index}
          onClick={() =>
            setActiveIndex(activeIndex === index ? null : index)
          }
        />
      ))}
    </div>
  );
};

const AccordionItem = ({ question, answer, index, isActive, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1, delay: index * 0.05 }}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div
        className="flex justify-between items-center p-5 cursor-pointer"
        onClick={onClick}
      >
        <p className="text-lg font-semibold text-pink-600">{question}</p>
        <span className="bg-gray-100 p-2 rounded-full">
          {isActive ? (
            <Minus size={20} strokeWidth={2} className="text-pink-600" />
          ) : (
            <Plus size={20} strokeWidth={2} className="text-pink-600" />
          )}
        </span>
      </div>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="answer"
            layout
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 1000 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut", type: "tween" }}
            className="overflow-hidden px-5 pb-5"
          >
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccordionFAQ;
