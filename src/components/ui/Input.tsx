import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className = "", label, error, id, ...props }, ref) => {
		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label htmlFor={id} className="text-sm font-medium text-foreground">
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={id}
					className={`w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors ${className}`}
					{...props}
				/>
				{error && <span className="text-sm text-red-500">{error}</span>}
			</div>
		);
	},
);

Input.displayName = "Input";
