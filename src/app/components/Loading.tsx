const CoupleLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#FF9CEE] via-[#FFD4F4] to-white animate-gradient">
      {/* Animated Couple Icons */}
      <div className="relative flex items-end gap-16 mb-12">
        {/* Boy */}
        <div className="relative w-20 h-28 animate-float-boy">
          <svg
            className="w-full h-full"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="#6EC3F4"
            />
            <circle
              cx="12"
              cy="9"
              r="2"
              fill="white"
              className="animate-twinkle"
            />
            <path
              d="M10 16h4v3h-4z"
              fill="#4A90E2"
              className="animate-pulse-slow"
            />
          </svg>
          <div className="absolute inset-0 bg-[#6EC3F4] opacity-20 rounded-full blur-md animate-pulse-slow"></div>
        </div>

        {/* Girl */}
        <div className="relative w-20 h-28 animate-float-girl">
          <svg
            className="w-full h-full"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="#FF9CEE"
            />
            <circle
              cx="12"
              cy="9"
              r="2"
              fill="white"
              className="animate-twinkle-delay"
            />
            <path
              d="M10 16h4v3h-4z"
              fill="#FF6EB4"
              className="animate-pulse-slow"
            />
          </svg>
          <div className="absolute inset-0 bg-[#FF9CEE] opacity-20 rounded-full blur-md animate-pulse-slow"></div>
        </div>

        {/* Heart between them */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 animate-heartbeat">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#FF4081"
            />
          </svg>
          <div className="absolute inset-0 bg-[#FF4081] opacity-30 rounded-full blur-sm animate-pulse"></div>
        </div>
      </div>

      {/* Text with love effect */}
      <p className="text-2xl font-semibold text-[#FF6EB4] animate-text-glow tracking-wide">
        Đang tải dữ liệu tình yêu...
      </p>

      {/* Floating hearts in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[#FF9CEE] opacity-60"
            style={{
              fontSize: `${Math.random() * 20 + 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float-up ${Math.random() * 6 + 4}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ❤
          </div>
        ))}
      </div>

      {/* Custom styles for animations */}
      <style jsx global>{`
        @keyframes float-boy {
          0%,
          100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }
        @keyframes float-girl {
          0%,
          100% {
            transform: translateY(0) rotate(2deg);
          }
          50% {
            transform: translateY(-15px) rotate(-2deg);
          }
        }
        @keyframes heartbeat {
          0% {
            transform: translate(-50%, -50%) scale(1);
          }
          25% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1);
          }
          75% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes twinkle-delay {
          0%,
          60% {
            opacity: 1;
          }
          30% {
            opacity: 0.5;
          }
        }
        @keyframes text-glow {
          0%,
          100% {
            text-shadow: 0 0 8px rgba(255, 110, 180, 0.5);
          }
          50% {
            text-shadow: 0 0 16px rgba(255, 110, 180, 0.8);
          }
        }
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-boy {
          animation: float-boy 3s ease-in-out infinite;
        }
        .animate-float-girl {
          animation: float-girl 3s ease-in-out infinite 0.5s;
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s ease infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease infinite;
        }
        .animate-twinkle-delay {
          animation: twinkle 2s ease infinite 0.5s;
        }
        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default CoupleLoading;
