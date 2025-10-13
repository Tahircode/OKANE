
import { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "outlined" | "gradient";
};

export function Card({
  title,
  subtitle,
  footer,
  children,
  className,
  variant = "default",
}: CardProps) {
  return (
    <div
      className={clsx(
        "relative p-6 rounded-xl transition-all",
        {
          "bg-white shadow-md border border-gray-200": variant === "default",
          "border border-gray-300 bg-transparent": variant === "outlined",
          "text-white": variant === "gradient",
        },
        className
      )}
    >
      {/* Title */}
      {title && (
        <h3
          className={clsx("text-lg font-bold mb-2", {
            "text-gray-900": variant !== "gradient",
          })}
        >
          {title}
        </h3>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p
          className={clsx("mb-4 text-sm", {
            "text-gray-600": variant === "default" || variant === "outlined",
            "opacity-90": variant === "gradient",
          })}
        >
          {subtitle}
        </p>
      )}

      {/* Custom Content */}
      {children && <div className="mb-4">{children}</div>}

      {/* Footer */}
      {footer && <div className="pt-2">{footer}</div>}
    </div>
  );
}
