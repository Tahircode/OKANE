"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
}

export const Button = ({
  children,
  variant = "default",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(
        "font-medium rounded-lg text-sm px-5 py-2.5 transition",
        {
          "text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300":
            variant === "default",
          "border border-gray-300 text-gray-700 hover:bg-gray-100":
            variant === "outline",
          "text-gray-600 hover:bg-gray-100": variant === "ghost",
        },
        className // allows overrides
      )}
      {...props} // brings in onClick, disabled, etc.
    >
      {children}
    </button>
  );
};
