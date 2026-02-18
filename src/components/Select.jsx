import { forwardRef, useId } from "react";

function Select({
    options,
    label,
    className,
    ...props
}, ref) {
    const id = useId();

    return (
        <div className="w-full">
            {label && <label htmlFor={id} className="inline-block mb-1 pl-1 text-sm font-medium text-foreground">{label}</label>}
            <select
                {...props}
                id={id}
                ref={ref}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            >
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default forwardRef(Select);