# LLM Coding for AI Engineer - MVP Version

## 🎯 **MVP Scope (2-3 weeks)**

### **Core Features Only**
- **Static Question List**: Hardcoded sample questions
- **Basic Two-Panel Layout**: Left list, right details
- **Question Selection**: Click to view details
- **Dark Theme**: Simple dark styling
- **Desktop Only**: Fixed 1200px+ layout

### **MVP Technical Stack**
- **Frontend**: React + TypeScript + Tailwind CSS
- **State**: React useState (no complex state management)
- **Data**: Static JSON data (no backend)
- **Icons**: Simple SVG icons or basic icon library
- **Animations**: CSS transitions only (no Framer Motion)

## 📋 **MVP Requirements**

### **1. Basic Layout (Week 1)**
```typescript
// Simple component structure
App
├── Header (logo + title)
├── MainLayout
│   ├── LeftPanel (question list)
│   └── RightPanel (question details)
```

### **2. Static Data**
```typescript
const sampleQuestions = [
  {
    id: "1",
    title: "Design Database",
    categories: ["coding", "phone", "onsite"],
    lastReported: "2 weeks ago",
    description: "You need to design a simple database system..."
  },
  {
    id: "2", 
    title: "Array Compression",
    categories: ["coding", "phone", "onsite"],
    lastReported: "1 week ago",
    description: "Implement an array compression algorithm..."
  },
  // ... 5-10 more questions
];
```

### **3. Core Functionality**
- **Question List**: Display all questions in a simple table
- **Question Selection**: Click to show details in right panel
- **Basic Styling**: Dark theme with purple accents
- **Hover Effects**: Simple CSS hover states

### **4. MVP Features Checklist**
- [ ] Header with logo and title
- [ ] Two-panel layout (40% / 60%)
- [ ] Question list with titles and categories
- [ ] Question selection (click to view)
- [ ] Question details display
- [ ] Dark theme styling
- [ ] Basic hover effects
- [ ] Desktop-optimized layout

## 🚫 **MVP Exclusions**
- ❌ Search and filtering
- ❌ Complex animations
- ❌ Backend integration
- ❌ User authentication
- ❌ Advanced state management
- ❌ Performance optimizations
- ❌ Accessibility features
- ❌ Mobile responsiveness

## 📅 **MVP Timeline**

### **Week 1: Foundation**
- Day 1-2: Project setup and basic layout
- Day 3-4: Question list component
- Day 5: Question details component

### **Week 2: Styling & Polish**
- Day 1-2: Dark theme implementation
- Day 3-4: Hover effects and transitions
- Day 5: Final polish and testing

### **Week 3: Refinement (Optional)**
- Day 1-2: Bug fixes and improvements
- Day 3-4: Additional sample data
- Day 5: Final testing and deployment

## 🎨 **MVP Design Specifications**

### **Colors**
- Background: `#1a1a1a`
- Text: `#ffffff`
- Accent: `#8b5cf6` (purple)
- Secondary: `#9ca3af` (gray)
- Hover: `#374151` (dark gray)

### **Layout**
- Header: 60px height
- Left Panel: 40% width, scrollable
- Right Panel: 60% width, scrollable
- Min Width: 1200px

### **Typography**
- Font: Inter or system fonts
- Headers: 18px, bold
- Body: 14px, regular
- Small: 12px, regular

## 🚀 **Getting Started**

### **1. Project Setup**
```bash
npx create-react-app llm-coding --template typescript
cd llm-coding
npm install tailwindcss
```

### **2. Basic Structure**
```typescript
// App.tsx
function App() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <MainLayout 
        selectedQuestion={selectedQuestion}
        onSelectQuestion={setSelectedQuestion}
      />
    </div>
  );
}
```

### **3. Sample Data**
Create a `data/questions.ts` file with 8-10 sample questions

## ✅ **MVP Success Criteria**
- [ ] Application loads and displays question list
- [ ] Clicking a question shows its details
- [ ] Dark theme is applied consistently
- [ ] Layout works on desktop screens (1200px+)
- [ ] Basic hover effects work
- [ ] Code is clean and well-structured

## 🔄 **Post-MVP Roadmap**
After MVP completion, consider adding:
1. **Search functionality** (Week 4)
2. **Category filtering** (Week 5)
3. **More sample data** (Week 6)
4. **Advanced animations** (Week 7)
5. **Backend integration** (Week 8+)

## 💡 **MVP Tips**
- Start with the simplest possible implementation
- Use CSS Grid or Flexbox for layout
- Keep components small and focused
- Test frequently on desktop browsers
- Don't over-engineer - keep it simple!

This MVP approach will give you a working application in 2-3 weeks that demonstrates the core concept and can be iteratively improved.
