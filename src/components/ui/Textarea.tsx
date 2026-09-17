import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className = "", label, error, id, ...props }, ref) => {
		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label htmlFor={id} className="text-sm font-medium text-foreground">
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					id={id}
					className={`w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none ${className}`}
					{...props}
				/>
				{error && <span className="text-sm text-red-500">{error}</span>}
			</div>
		);
	},
);

Textarea.displayName = "Textarea";
