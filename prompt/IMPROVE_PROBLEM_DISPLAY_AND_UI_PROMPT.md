# 🎨 Improve Problem Display and UI Layout

## 🎯 Objectives

Enhance the user interface and problem display to provide a cleaner, more professional appearance with better usability and responsive design.

## 📋 Current Issues Identified

### ❌ **Issue 1: Redundant "LLM Implementation:" Prefix**
- **Problem**: All problem titles show "LLM Implementation: Self-Attention", "LLM Implementation: Kv-Cache"
- **Impact**: Redundant text clutters the interface
- **Goal**: Clean titles like "Self-Attention", "Kv-Cache", "Greedy Search"

### ❌ **Issue 2: UUID Display in Problem Headers**
- **Problem**: Problem headers show full UUID "207c7383-c2b8-48eb-b8af-9bc9478e333e. LLM Implementation: Kv-Cache"
- **Impact**: UUIDs make the interface look unprofessional and cluttered
- **Goal**: Clean problem headers without UUID display

### ❌ **Issue 3: Fixed Layout Proportions**
- **Problem**: Current layout uses fixed 30%/70% split
- **Impact**: No flexibility for different screen sizes or user preferences
- **Goal**: Adjustable divisor for responsive card sizing

### ❌ **Issue 4: Missing Page-Level Scrolling**
- **Problem**: Only code editor has scroll, but page content may overflow
- **Impact**: Poor user experience on smaller screens or long content
- **Goal**: Add scroll window bar for the entire page content

## 🔧 Implementation Goals

### Goal 1: Clean Problem Titles ✨
**Remove "LLM Implementation:" prefix from all problem titles**

#### Backend Changes (`backend/api-demo.js`):
```javascript
// Current title generation
title: generatedProblem.title, // "LLM Implementation: Self-Attention"

// Updated title generation
title: generatedProblem.title.replace('LLM Implementation: ', ''), // "Self-Attention"
```

#### Implementation:
```javascript
const transformProblemStructure = (generatedProblem, solutions) => {
  // Clean title by removing "LLM Implementation:" prefix
  const cleanTitle = generatedProblem.title.replace(/^LLM Implementation:\s*/, '');
  
  return {
    id: generatedProblem.id,
    title: cleanTitle, // Clean title without prefix
    description: generateRichDescription(generatedProblem),
    // ... rest of the structure
  };
};
```

### Goal 2: Remove UUID from Display 🧹
**Remove UUID from problem headers and navigation**

#### Frontend Changes (`frontend/src/components/QuestionDetails.tsx`):
```javascript
// Current header display
<span className="text-lg font-semibold">{question.id}. {question.title}</span>

// Updated header display (remove question.id)
<span className="text-lg font-semibold">{question.title}</span>
```

#### Implementation:
1. **Remove UUID from Problem Headers**:
   - Update `QuestionDetails.tsx` header section
   - Remove `{question.id}.` prefix from title display

2. **Update Problem List Display** (`QuestionList.tsx`):
   - Remove UUID from problem list items
   - Use clean titles only

3. **Update URL Structure** (Optional):
   - Consider using problem titles or indices instead of UUIDs in URLs
   - Update routing logic if needed

### Goal 3: Adjustable Layout Divisor 📏
**Make the layout proportions adjustable and responsive**

#### Current Layout Issue:
```css
/* Fixed 30%/70% split in QuestionDetails.tsx */
<div style={{ width: '30%' }}>  {/* Left panel - fixed */}
<div style={{ width: '70%' }}>  {/* Right panel - fixed */}
```

#### Proposed Solution:
```javascript
// Add state for layout control
const [leftPanelWidth, setLeftPanelWidth] = useState(30); // Percentage
const rightPanelWidth = 100 - leftPanelWidth;

// Responsive breakpoints
const getResponsiveWidth = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) return { left: 100, right: 0 }; // Mobile: stack vertically
  if (screenWidth < 1024) return { left: 40, right: 60 }; // Tablet: 40/60
  return { left: leftPanelWidth, right: rightPanelWidth }; // Desktop: adjustable
};
```

#### Implementation Features:
1. **Draggable Divider**:
   ```javascript
   const ResizableDivider = () => {
     const handleMouseDown = (e) => {
       // Add drag functionality to resize panels
     };
     
     return (
       <div 
         className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400"
         onMouseDown={handleMouseDown}
       />
     );
   };
   ```

2. **Preset Layout Options**:
   ```javascript
   const layoutPresets = {
     balanced: { left: 50, right: 50 },
     codefocused: { left: 25, right: 75 },
     descriptionFocused: { left: 60, right: 40 },
     current: { left: 30, right: 70 }
   };
   ```

3. **Responsive Breakpoints**:
   ```javascript
   const useResponsiveLayout = () => {
     const [screenSize, setScreenSize] = useState('desktop');
     
     useEffect(() => {
       const handleResize = () => {
         const width = window.innerWidth;
         if (width < 768) setScreenSize('mobile');
         else if (width < 1024) setScreenSize('tablet');
         else setScreenSize('desktop');
       };
       
       window.addEventListener('resize', handleResize);
       handleResize();
       
       return () => window.removeEventListener('resize', handleResize);
     }, []);
     
     return screenSize;
   };
   ```

### Goal 4: Add Page-Level Scrolling 📜
**Implement proper scrolling for the entire page content**

#### Current Scrolling Issues:
- Only code editor has internal scrolling
- Page content can overflow without scrolling
- Poor mobile experience

#### Implementation:

1. **Main Layout Scrolling** (`App.tsx`):
```javascript
// Update main container with proper scrolling
<div className="min-h-screen max-h-screen overflow-hidden">
  <Header />
  <div className="flex-1 overflow-auto"> {/* Add scrollable container */}
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Other routes */}
    </Routes>
  </div>
</div>
```

2. **Problem Details Scrolling** (`QuestionDetails.tsx`):
```javascript
// Add scrolling to main content area
<div className="flex-1 flex overflow-hidden h-full">
  {/* Left Panel with scrolling */}
  <div 
    style={{ width: `${leftPanelWidth}%` }}
    className="border-r overflow-y-auto h-full" // Add overflow-y-auto
  >
    {/* Description content */}
  </div>
  
  {/* Right Panel with scrolling */}
  <div 
    style={{ width: `${rightPanelWidth}%` }}
    className="flex flex-col overflow-hidden h-full"
  >
    {/* Code editor area */}
    <div className="flex-1 overflow-auto"> {/* Scrollable code area */}
      <PythonEditor />
    </div>
  </div>
</div>
```

3. **Custom Scrollbar Styling**:
```css
/* Add to index.css or component styles */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #6B7280 #F3F4F6;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #F3F4F6;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #6B7280;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4B5563;
}
```

## 📝 Detailed Implementation Steps

### Step 1: Backend Title Cleanup
**File**: `backend/api-demo.js`

```javascript
// Update the transformProblemStructure function
const transformProblemStructure = (generatedProblem, solutions) => {
  // Clean title by removing "LLM Implementation:" prefix
  const cleanTitle = generatedProblem.title
    .replace(/^LLM Implementation:\s*/, '')
    .replace(/^Llm Implementation:\s*/, '') // Handle different cases
    .trim();
  
  return {
    id: generatedProblem.id,
    title: cleanTitle,
    description: generateRichDescription(generatedProblem),
    difficulty: generatedProblem.difficulty,
    company: generatedProblem.company || 'OpenAI',
    categories: generatedProblem.categories || ['coding', 'phone'],
    tags: generatedProblem.tags || [],
    status: 'published',
    lastReported: 'Recently generated',
    examples: generateExamples(generatedProblem),
    testCases: generateTestCases(generatedProblem),
    template: generateTemplate(generatedProblem),
    created_at: generatedProblem.created_at
  };
};
```

### Step 2: Frontend UUID Removal
**File**: `frontend/src/components/QuestionDetails.tsx`

```javascript
// Update problem header display
<div className="flex items-center space-x-3">
  <span className="text-lg font-semibold">{question.title}</span> {/* Remove {question.id}. */}
  <span className={`px-2 py-1 text-xs rounded font-medium ${
    question.difficulty === 'easy' 
      ? 'bg-green-100 text-green-800' 
      : question.difficulty === 'medium'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800'
    }`}>
    {question.difficulty}
  </span>
  {/* Rest of the header components */}
</div>
```

**File**: `frontend/src/components/QuestionList.tsx`

```javascript
// Update question list item display
<div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <h3 className="font-medium text-gray-900 dark:text-white">
        {question.title} {/* Remove question.id prefix */}
      </h3>
      {/* Rest of the question item */}
    </div>
  </div>
</div>
```

### Step 3: Adjustable Layout Implementation
**File**: `frontend/src/components/QuestionDetails.tsx`

```javascript
import React, { useState, useEffect, useCallback } from 'react';

const QuestionDetails = ({ question, onToggleQuestionList, isQuestionListVisible }) => {
  // Layout state
  const [leftPanelWidth, setLeftPanelWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  
  // Responsive layout hook
  const useResponsiveLayout = () => {
    const [screenSize, setScreenSize] = useState('desktop');
    
    useEffect(() => {
      const handleResize = () => {
        const width = window.innerWidth;
        if (width < 768) setScreenSize('mobile');
        else if (width < 1024) setScreenSize('tablet');
        else setScreenSize('desktop');
      };
      
      window.addEventListener('resize', handleResize);
      handleResize();
      
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return screenSize;
  };
  
  const screenSize = useResponsiveLayout();
  
  // Get responsive widths
  const getLayoutWidths = () => {
    if (screenSize === 'mobile') return { left: 100, right: 0 };
    if (screenSize === 'tablet') return { left: 40, right: 60 };
    return { left: leftPanelWidth, right: 100 - leftPanelWidth };
  };
  
  const { left: leftWidth, right: rightWidth } = getLayoutWidths();
  
  // Drag handler for resizable divider
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    
    const handleMouseMove = (e) => {
      if (isDragging) {
        const containerRect = e.currentTarget.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setLeftPanelWidth(Math.min(Math.max(newLeftWidth, 20), 80)); // Limit between 20% and 80%
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isDragging]);
  
  // Layout preset buttons
  const LayoutControls = () => (
    <div className="flex space-x-2 mb-4">
      <button onClick={() => setLeftPanelWidth(25)} className="text-xs px-2 py-1 bg-gray-200 rounded">
        Code Focus
      </button>
      <button onClick={() => setLeftPanelWidth(50)} className="text-xs px-2 py-1 bg-gray-200 rounded">
        Balanced
      </button>
      <button onClick={() => setLeftPanelWidth(60)} className="text-xs px-2 py-1 bg-gray-200 rounded">
        Description Focus
      </button>
    </div>
  );
  
  return (
    <div className="flex-1 flex overflow-hidden h-full">
      {/* Left Panel */}
      <div 
        style={{ width: `${leftWidth}%` }}
        className="border-r overflow-y-auto h-full custom-scrollbar"
      >
        {/* Panel content */}
      </div>
      
      {/* Resizable Divider - only show on desktop */}
      {screenSize === 'desktop' && (
        <div 
          className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors"
          onMouseDown={handleMouseDown}
        />
      )}
      
      {/* Right Panel */}
      <div 
        style={{ width: `${rightWidth}%` }}
        className="flex flex-col overflow-hidden h-full"
      >
        <LayoutControls />
        {/* Code editor area */}
      </div>
    </div>
  );
};
```

### Step 4: Page-Level Scrolling Implementation
**File**: `frontend/src/App.tsx`

```javascript
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ProblemProvider>
            <NotificationProvider>
              <Router>
                <div className="min-h-screen max-h-screen overflow-hidden flex flex-col">
                  <Header />
                  <div className="flex-1 overflow-auto custom-scrollbar">
                    <Routes>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/profile" element={<UserProfilePage />} />
                      <Route path="/" element={<HomePage />} />
                    </Routes>
                  </div>
                </div>
              </Router>
            </NotificationProvider>
          </ProblemProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

**File**: `frontend/src/index.css`

```css
/* Add custom scrollbar styles */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #6B7280 #F3F4F6;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #F3F4F6;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #6B7280;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4B5563;
}

/* Dark theme scrollbar */
.dark .custom-scrollbar {
  scrollbar-color: #9CA3AF #374151;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #374151;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #9CA3AF;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}
```

## 🎯 Expected Results

### ✅ **After Implementation:**

1. **Clean Problem Titles**:
   - "Self-Attention" instead of "LLM Implementation: Self-Attention"
   - "Kv-Cache" instead of "LLM Implementation: Kv-Cache"
   - "Greedy Search" instead of "LLM Implementation: Greedy Search"

2. **No UUID Display**:
   - Problem headers show clean titles without UUIDs
   - URLs can still use UUIDs internally for routing
   - Professional, clean interface

3. **Adjustable Layout**:
   - Draggable divider between panels (desktop)
   - Preset layout buttons (Code Focus, Balanced, Description Focus)
   - Responsive breakpoints for mobile/tablet
   - 20%-80% adjustment range

4. **Proper Scrolling**:
   - Page-level scrolling for all content
   - Custom styled scrollbars matching theme
   - Smooth scrolling experience
   - Mobile-friendly scrolling

## 🔧 Testing Checklist

- [ ] Problem titles display without "LLM Implementation:" prefix
- [ ] Problem headers don't show UUIDs
- [ ] Layout divider can be dragged to resize panels
- [ ] Layout preset buttons work correctly
- [ ] Mobile layout stacks panels vertically
- [ ] Tablet layout uses 40%/60% split
- [ ] Page scrolling works on all content
- [ ] Custom scrollbars display correctly
- [ ] Dark theme scrollbars work properly
- [ ] No layout breaking on different screen sizes

## 📱 Mobile Considerations

- **Vertical Stacking**: On mobile, panels stack vertically instead of side-by-side
- **Touch-Friendly**: All interactive elements are touch-friendly
- **Scrolling**: Smooth native scrolling on mobile devices
- **Responsive Text**: Font sizes adjust appropriately for mobile screens

---

**This implementation will provide a much cleaner, more professional, and user-friendly interface while maintaining all existing functionality.**
