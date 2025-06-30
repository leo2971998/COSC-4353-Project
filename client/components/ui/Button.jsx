// src/components/ui/button.jsx
export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded font-medium transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
