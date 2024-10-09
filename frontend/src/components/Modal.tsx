import React, { useState, useEffect, useCallback } from "react";
import InputField from "./InputField";
import TextArea from "./TextArea";
import { IoCloseOutline } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  initialTitle?: string;
  initialDescription?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTitle,
  initialDescription,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

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
      setError("Please enter a title for the task.");
      return;
    }

    setError("");
    onSave(title, description);
    setTitle("");
    setDescription("");
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="modal-content relative bg-white p-6 rounded-md w-96">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="flex items-center justify-center w-[30px] h-[30px] text-gray-400 hover:text-red-400 transition-all duration-300 ease-out text-4xl absolute top-4 right-4"
        >
          <IoCloseOutline />
        </button>
        <h2 className="text-2xl mb-4">
          {initialTitle ? "Edit Task" : "Add New Task"}
        </h2>
        <div className="flex flex-col gap-2">
          <InputField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />
          {error && <p className="error-message">{error}</p>}
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
          />
          <button
            type="button"
            onClick={handleSave}
            className="mt-4 bg-gradient text-white font-bold py-2 px-4 rounded hover:bg-mainColor transition-all duration-300 ease-out"
          >
            {initialTitle ? "Update Task" : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
