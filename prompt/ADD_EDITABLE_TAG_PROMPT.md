# Add Editable Text Card Under Tags - Feature Request

## 🎯 **Goal**
Add a new editable text card under the existing Tags section that allows users to type and edit custom text content.

## 📋 **Requirements**

### **1. Visual Design**
- **Location**: Position directly under the existing Tags section
- **Style**: Match the existing tag design with dark gray background (`#1f2937`)
- **Size**: Similar to existing tags but slightly larger to accommodate text input
- **Border**: Rounded corners consistent with existing tags
- **Text Color**: White text (`#ffffff`) for visibility

### **2. Functionality**
- **Click to Edit**: Click on the card to enter edit mode
- **Text Input**: Allow typing and editing of custom text
- **Save on Enter**: Press Enter to save the text
- **Cancel on Escape**: Press Escape to cancel editing
- **Click Outside**: Click outside the card to save changes
- **Character Limit**: Optional 50-character limit for clean display

### **3. User Experience**
- **Placeholder Text**: Show "Add custom tag..." when empty
- **Visual States**: 
  - Default: Dark gray background with white text
  - Hover: Slightly lighter background (`#374151`)
  - Edit Mode: Focused input with border highlight
- **Smooth Transitions**: CSS transitions for state changes

## 🛠️ **Technical Implementation**

### **Component Structure**
```typescript
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
  // Implementation details
};
```

### **State Management**
- **Local State**: Use `useState` for edit mode and input value
- **Parent State**: Pass value and onChange handler from parent component
- **Edit Mode**: Track whether user is currently editing

### **Styling Classes**
```css
/* Default state */
.editable-tag {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300 cursor-pointer transition-colors duration-200;
}

/* Hover state */
.editable-tag:hover {
  @apply bg-gray-600;
}

/* Edit mode */
.editable-tag.edit-mode {
  @apply bg-gray-600 border-2 border-primary-600;
}

/* Input field */
.editable-tag input {
  @apply bg-transparent border-none outline-none text-white placeholder-gray-400;
}
```

## 📍 **Integration Points**

### **1. QuestionDetails Component**
- Add the `EditableTag` component after the existing tags
- Position it in the Tags section below the current tag list
- Maintain consistent spacing and alignment

### **2. Data Structure**
- Extend the `Question` interface to include custom tags
- Store custom tags in the question data
- Persist changes (localStorage or state management)

### **3. Layout Integration**
```typescript
// In QuestionDetails.tsx
<div className="mt-8 pt-6 border-t border-gray-700">
  <h3 className="text-sm font-medium text-gray-400 mb-3">Tags</h3>
  <div className="flex flex-wrap gap-2">
    {/* Existing tags */}
    {question.tags.map((tag, index) => (
      <span key={index} className="tag-style">
        {tag}
      </span>
    ))}
    
    {/* New editable tag */}
    <EditableTag
      value={customTag}
      onChange={setCustomTag}
      placeholder="Add custom tag..."
    />
  </div>
</div>
```

## 🎨 **Design Specifications**

### **Visual Hierarchy**
- **Size**: Slightly larger than existing tags for better usability
- **Spacing**: Consistent gap with existing tags (`gap-2`)
- **Alignment**: Align with existing tag row
- **Typography**: Same font size and weight as existing tags

### **Color Scheme**
- **Background**: `bg-gray-700` (matches existing tags)
- **Hover**: `bg-gray-600` (slightly lighter)
- **Edit Mode**: `bg-gray-600` with `border-primary-600`
- **Text**: `text-white` for visibility
- **Placeholder**: `text-gray-400` for subtlety

### **Interactive States**
1. **Default**: Dark gray background, white text
2. **Hover**: Lighter background, cursor pointer
3. **Edit Mode**: Border highlight, focused input
4. **Empty State**: Placeholder text, same styling

## 🚀 **Implementation Steps**

### **Phase 1: Basic Component (Day 1)**
- Create `EditableTag` component
- Implement basic click-to-edit functionality
- Add placeholder text support
- Style to match existing tags

### **Phase 2: Enhanced UX (Day 2)**
- Add keyboard navigation (Enter/Escape)
- Implement click-outside-to-save
- Add hover and focus states
- Smooth transitions and animations

### **Phase 3: Integration (Day 3)**
- Integrate with `QuestionDetails` component
- Add to question data structure
- Implement state persistence
- Test with existing question data

## ✅ **Success Criteria**

### **Functional Requirements**
- [ ] Click on card enters edit mode
- [ ] Text input works smoothly
- [ ] Enter key saves changes
- [ ] Escape key cancels editing
- [ ] Click outside saves changes
- [ ] Placeholder text displays when empty

### **Visual Requirements**
- [ ] Matches existing tag design
- [ ] Consistent spacing and alignment
- [ ] Smooth hover transitions
- [ ] Clear edit mode indication
- [ ] Responsive to different screen sizes

### **Technical Requirements**
- [ ] TypeScript types defined
- [ ] Component is reusable
- [ ] State management works correctly
- [ ] No console errors or warnings
- [ ] Performance optimized

## 🔧 **Code Example**

### **Complete Component Implementation**
```typescript
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
        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-600 border-2 border-primary-600 text-white placeholder-gray-400 outline-none min-w-24"
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
```

This prompt provides a comprehensive guide for implementing an editable text card under the Tags section that matches the existing design and provides a smooth user experience.
