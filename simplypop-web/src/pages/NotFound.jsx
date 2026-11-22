// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function NotFound() {
  const [balloonCount, setBalloonCount] = useState(5);

  // Add more balloons on click for fun interaction
  const addBalloon = () => {
    if (balloonCount < 20) {
      setBalloonCount(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white relative overflow-hidden">
      {/* Floating Balloons Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(balloonCount)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              left: `${(i * 15 + Math.random() * 10)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${8 + (i % 4)}s`,
              fontSize: `${2 + (i % 3)}rem`,
              opacity: 0.6,
            }}
          >
            {['🎈', '🎉', '✨', '🎊'][i % 4]}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl">
          {/* Animated 404 */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-pulse-slow mb-4">
              404
            </h1>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>

          {/* Fun Message */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
            <div className="text-7xl mb-6 animate-bounce-slow">🎈</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! This Balloon Floated Away
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Looks like this page decided to pop off to another dimension! 
              Don't worry though — we've got plenty more where that came from.
            </p>
            
            {/* Playful Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y-2 border-gray-100">
              <div>
                <div className="text-3xl font-bold text-pink-600">∞</div>
                <div className="text-sm text-gray-500 mt-1">Balloons Left</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-500 mt-1">Pages Here</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">100%</div>
                <div className="text-sm text-gray-500 mt-1">Still Awesome</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>🏠</span>
                <span>Go Home</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                to="/gallery"
                className="bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>🎨</span>
                <span>View Gallery</span>
              </Link>
            </div>

            {/* Easter Egg */}
            <div className="mt-8">
              <button
                onClick={addBalloon}
                className="text-sm text-gray-400 hover:text-pink-500 transition-colors"
              >
                Click here to release more balloons 🎈
              </button>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
            <p className="text-gray-700 font-semibold mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-pink-100 hover:text-pink-700 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/gallery"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-pink-100 hover:text-pink-700 transition-colors"
              >
                Gallery
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-pink-100 hover:text-pink-700 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-pink-100 hover:text-pink-700 transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default NotFound;