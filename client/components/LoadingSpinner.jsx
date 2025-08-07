export function LoadingSpinner({ size = "default", text, fullScreen = false }) {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-10 h-10",
    large: "w-16 h-16",
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-2 border-gray-600/30`}
        />
        {/* Spinning gradient ring */}
        <div
          className={`${sizeClasses[size]} absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 animate-spin`}
          style={{
            background:
              "conic-gradient(from 0deg, transparent, transparent, #3b82f6, #8b5cf6, transparent)",
            borderRadius: "50%",
            mask: "radial-gradient(circle, transparent 60%, black 61%)",
            WebkitMask: "radial-gradient(circle, transparent 60%, black 61%)",
          }}
        />
        {/* Inner pulsing dot */}
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div
            className={`${
              size === "small"
                ? "w-1.5 h-1.5"
                : size === "large"
                ? "w-3 h-3"
                : "w-2 h-2"
            } bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse`}
          />
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <p
          className={`${textSizeClasses[size]} text-gray-300 font-medium animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#1a2035] rounded-xl p-8 border border-gray-700/50 shadow-2xl">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return <LoadingContent />;
}
