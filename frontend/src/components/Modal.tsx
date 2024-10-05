import React, { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  initialTitle?: string;
  initialDescription?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialTitle, initialDescription }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
    if (initialDescription) {
      setDescription(initialDescription);
    }
  }, [initialTitle, initialDescription]);

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a title for the task.');
      return;
    }

    setError('');
    onSave(title, description);
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialTitle ? "Edit Task" : "Add New Task"}</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
        />
        {error && <p className="error-message">{error}</p>}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
        />
        <button type='button' onClick={handleSave}>{initialTitle ? "Update Task" : "Save Task"}</button>
        <button type='button' onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
