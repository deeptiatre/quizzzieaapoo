const VInput = ({
    type = "text",
    placeholder,
    value,
    onChange,
    className = "",
    label,
    icon,
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && <label className="font-bold text-v-text-muted uppercase text-sm">{label}</label>}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-v-text-muted pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full bg-v-bg-card border-2 border-v-border-color rounded-xl py-3 ${icon ? 'pl-11 pr-4' : 'px-4'} text-white font-bold placeholder-v-text-muted focus:outline-none focus:border-v-blue-primary focus:bg-v-bg-card-hover transition-colors`}
                    {...props}
                />
            </div>
        </div>
    );
};

export default VInput;
