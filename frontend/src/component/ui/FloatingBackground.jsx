import { motion } from "framer-motion";

const FloatingBackground = () => {
    const shapes = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 60 + 20,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        type: Math.random() > 0.5 ? "circle" : "square",
    }));

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {shapes.map((shape) => (
                <motion.div
                    key={shape.id}
                    className={`absolute opacity-10 ${shape.type === "circle" ? "rounded-full bg-v-green-primary" : "rounded-xl bg-v-blue-primary"
                        }`}
                    style={{
                        width: shape.size,
                        height: shape.size,
                        top: `${shape.y}%`,
                        left: `${shape.x}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, 50, -50, 0],
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: shape.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: shape.delay,
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingBackground;
