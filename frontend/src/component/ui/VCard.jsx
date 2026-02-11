import { motion } from "framer-motion";

const VCard = ({ children, className = "", hoverEffect = false, onClick }) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -2 } : {}}
            onClick={onClick}
            className={`bg-v-bg-card border-2 border-v-border-color rounded-2xl p-6 shadow-sm ${hoverEffect ? 'cursor-pointer hover:bg-v-bg-card-hover' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default VCard;
