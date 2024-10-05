import React from "react";

interface TaskProps {
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
}

const Card: React.FC<TaskProps> = ({ title, description, onEdit, onDelete }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default Card;

