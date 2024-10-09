import React from "react";

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = "Enter description",
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-[250px] rounded-md border border-gray-300 px-4 py-2 focus:border-mainBcg focus:outline-none shadow-input overflow-auto resize-none"
    />
  );
};

export default TextArea;
