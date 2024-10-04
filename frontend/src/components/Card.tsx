// Card.tsx
import React from 'react';

interface TaskProps {
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
}

const Card: React.FC<TaskProps> = ({ title, description, onEdit, onDelete }) => {
  return (
    <li>
      <span>{title}</span>
      <p>{description}</p>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </li>
  );
};

export default Card;
