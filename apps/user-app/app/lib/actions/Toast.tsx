import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "error" | "success" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); 
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    error: "bg-red-500",
    success: "bg-green-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div

      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform ${
      
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}

        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex items-center">
          {type === "error" && (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {type === "success" && (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {message}
        </div>
      </div>
    </div>
  );
}