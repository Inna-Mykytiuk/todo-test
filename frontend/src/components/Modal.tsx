import React, { useCallback, useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

import InputField from "./InputField";
import TextArea from "./TextArea";

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
      className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="modal-content relative w-96 rounded-md bg-white p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-[30px] w-[30px] items-center justify-center text-4xl text-gray-400 transition-all duration-300 ease-out hover:text-red-400"
        >
          <IoCloseOutline />
        </button>
        <h2 className="mb-4 text-2xl">
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
            className="mt-4 rounded bg-gradient px-4 py-2 font-bold text-white transition-all duration-300 ease-out hover:bg-mainColor"
          >
            {initialTitle ? "Update Task" : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
