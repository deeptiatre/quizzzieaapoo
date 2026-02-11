import { motion } from "framer-motion";

const variants = {
    primary: "bg-v-green-primary border-v-green-shadow hover:bg-[#61e002] text-white",
    secondary: "bg-v-blue-primary border-v-blue-shadow hover:bg-[#1dbcfd] text-white",
    danger: "bg-v-red-error border-v-red-shadow hover:bg-[#ff3535] text-white",
    warning: "bg-v-yellow-warning border-v-yellow-shadow hover:bg-[#ffd900] text-black",
    outline: "bg-transparent border-2 border-v-border-color text-v-text-muted hover:bg-v-bg-card-hover"
};

const VButton = ({
    children,
    variant = "primary",
    className = "",
    onClick,
    disabled = false,
    fullWidth = false,
    type = "button"
}) => {
    const baseStyles = "relative font-bold uppercase tracking-wider rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all py-3 px-6 flex items-center justify-center gap-2";
    const variantStyles = variants[variant] || variants.primary;
    const widthStyles = fullWidth ? "w-full" : "";
    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed active:translate-y-0 active:border-b-4" : "cursor-pointer";

    return (
        <motion.button
            whileTap={!disabled ? { scale: 0.98 } : {}}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${widthStyles} ${disabledStyles} ${className}`}
        >
            {children}
        </motion.button>
    );
};

export default VButton;
