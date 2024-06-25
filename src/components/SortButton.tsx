// SortButton.tsx
import React from 'react';

interface SortButtonProps {
  onClick: () => void;
  label: string;
}

const SortButton: React.FC<SortButtonProps> = ({ onClick, label }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};

export default SortButton;
