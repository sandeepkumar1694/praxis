import React from 'react';

const BoltBadge: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        className="block group transition-all duration-300 hover:scale-110"
        aria-label="Powered by Bolt"
      >
        <img
          src="/bolt-badge.png"
          alt="Made with Bolt"
          className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-80 hover:opacity-100"
        />
      </a>
    </div>
  );
};

export default BoltBadge;