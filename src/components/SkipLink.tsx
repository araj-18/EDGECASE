import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="skip-to-content focus:outline-none shadow-xl"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};
