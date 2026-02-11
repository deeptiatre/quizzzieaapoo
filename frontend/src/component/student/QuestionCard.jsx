import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";

const QuestionCard = ({ question, selected, onSelect }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white leading-relaxed">
        {question.questiontext}
      </h2>

      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const isSelected = selected === opt._id;
          return (
            <motion.button
              key={opt._id}
              onClick={() => onSelect(opt._id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group
                  ${isSelected
                  ? "bg-v-blue-primary/20 border-v-blue-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  : "bg-v-bg-main border-v-border-color hover:border-v-blue-primary hover:bg-v-bg-card-hover"
                }`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-v-blue-primary border-v-blue-primary' : 'border-v-text-muted group-hover:border-v-blue-primary'}`}>
                {isSelected && <CheckCircle size={16} className="text-white" />}
              </div>

              <span className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-v-text-muted group-hover:text-white'}`}>
                {opt.text}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
