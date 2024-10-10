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
      className="h-[250px] w-full resize-none overflow-auto rounded-md border border-gray-300 px-4 py-2 shadow-input focus:border-mainBcg focus:outline-none"
    />
  );
};

export default TextArea;
