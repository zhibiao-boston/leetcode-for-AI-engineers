import React, { useState, useRef, useEffect } from 'react';

interface EditableTagProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const EditableTag: React.FC<EditableTagProps> = ({
  value,
  onChange,
  placeholder = "Add custom tag...",
  maxLength = 50
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
    setInputValue(value);
  };

  const handleSave = () => {
    if (inputValue.trim()) {
      onChange(inputValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        maxLength={maxLength}
        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-600 border-2 border-primary text-white placeholder-gray-400 outline-none min-w-24 transition-colors duration-200"
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors duration-200 min-w-24"
    >
      {value || placeholder}
    </span>
  );
};

export default EditableTag;
