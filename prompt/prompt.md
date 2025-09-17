# LLM Coding for AI Engineer

## Project Vision
Create a stunning, modern desktop web application that replicates the beautiful InterviewDB interface shown in the reference image. The application should feature a sophisticated dark theme with clean typography, intuitive navigation, and a professional layout optimized for desktop screens that provides an excellent user experience for technical interview preparation.

## UI/UX Design Requirements

### 1. **Overall Design Aesthetic**
- **Dark Theme**: Sophisticated dark background (#1a1a1a or similar) with high contrast
- **Typography**: Clean, modern sans-serif fonts (Inter, Roboto, or similar)
- **Color Palette**: 
  - Primary: Purple/violet accents (#8b5cf6 or similar)
  - Text: Pure white (#ffffff) for main content
  - Secondary: Light gray (#9ca3af) for metadata
  - Accents: Green (#10b981) for content indicators
- **Spacing**: Generous whitespace and consistent padding/margins
- **Shadows**: Subtle drop shadows for depth and hierarchy

### 2. **Header Design**
- **Logo**: Purple rabbit/stylized "ID" logo on the left
- **Brand Name**: "InterviewDB" in clean typography
- **Navigation**: Centered dropdown menu "Interview Resources"
- **Layout**: Full-width header with proper spacing and alignment

### 3. **Main Layout Structure**
- **Two-Panel Design**: 
  - Left panel: Question list (40% width)
  - Right panel: Question details (60% width)
- **Desktop Optimized**: Fixed layout designed for desktop screens (1200px+ width)
- **Smooth Transitions**: Elegant animations between states

### 4. **Left Panel - Question List**

#### Filter Section
- **Glean Logo**: Circular 'g' logo with clean styling
- **Filter Text**: "Updated within the last month" with info icon
- **Visual Hierarchy**: Clear separation from question list

#### Question Table
- **Table Headers**: "Title", "Categories", "Last Reported"
- **Row Design**: 
  - Hover effects with subtle background changes
  - Selected state with darker blue highlight (#1e40af)
  - Clean borders and spacing
- **Status Icons**:
  - Green briefcase icon for all content
- **Typography**: Clear hierarchy with proper font weights

#### Question Entries
- **Title**: Bold, readable question titles
- **Categories**: Tag-style categories with rounded corners
- **Timestamps**: Relative time display ("2 weeks ago", "1 week ago")
- **Interactive States**: Smooth hover and selection animations

### 5. **Right Panel - Question Details**

#### Tab Navigation
- **Active Tab**: "DESCRIPTION" with clear visual indication
- **Tab Styling**: Clean, minimal design with proper spacing
- **Content Area**: Well-formatted question description with:
  - Clear bullet points
  - Proper line spacing
  - Readable typography
  - Consistent indentation

### 6. **Technical Implementation**

#### Frontend Stack
- **Framework**: React.js with TypeScript for type safety
- **Styling**: Tailwind CSS for rapid, consistent styling
- **State Management**: Zustand or Redux Toolkit
- **Icons**: Lucide React or Heroicons for consistent iconography
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite for fast development and optimized builds

#### Component Architecture
```typescript
// Core components structure
App
├── Header
│   ├── Logo
│   └── Navigation
├── MainLayout
│   ├── LeftPanel
│   │   ├── FilterSection
│   │   └── QuestionList
│   └── RightPanel
│       ├── TabNavigation
│       └── QuestionContent
└── Footer (optional)
```

#### Styling Approach
- **CSS-in-JS**: Styled-components or Emotion for component-specific styles
- **Design System**: Consistent spacing, colors, and typography scales
- **Desktop-First Design**: Optimized for desktop screens (1200px+ width)
- **Accessibility**: WCAG 2.1 compliance with proper contrast ratios

### 7. **Interactive Features**

#### Question Selection
- **Click to Select**: Smooth selection with visual feedback
- **Keyboard Navigation**: Arrow keys for accessibility
- **URL State**: Browser history integration for direct linking

#### Filtering & Search
- **Real-time Search**: Instant filtering as user types
- **Category Filters**: Multi-select category filtering
- **Date Filters**: Time-based filtering options
- **Clear Filters**: Easy reset functionality

#### Desktop Behavior
- **Fixed Layout**: Consistent two-panel layout for all desktop screen sizes
- **Panel Resizing**: Optional ability to adjust panel widths within desktop constraints
- **Full Screen**: Optimized for desktop monitors (1200px+ width)

### 8. **Performance & Optimization**

#### Loading States
- **Skeleton Screens**: Elegant loading placeholders
- **Progressive Loading**: Load content as needed
- **Smooth Transitions**: No jarring state changes

#### Data Management
- **Virtual Scrolling**: For large question lists
- **Lazy Loading**: Load question details on demand
- **Caching**: Smart caching for frequently accessed data

### 9. **Content Structure**

#### Question Data Model
```typescript
interface Question {
  id: string;
  title: string;
  categories: string[];
  lastReported: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company?: string;
  tags: string[];
}
```

#### Sample Data
- **Array Compression**: Coding/phone/onsite categories
- **Backend Assignment Interview**: Coding/onsite content
- **Basic Calculator**: Coding/phone/onsite content
- **Design Database**: Coding/phone/onsite content (featured)

### 10. **Development Phases**

#### Phase 1: UI Foundation (Week 1)
- Set up project structure and design system
- Implement header and basic layout
- Create core components with proper styling
- Establish dark theme and color palette

#### Phase 2: Question List (Week 2)
- Build left panel with question table
- Implement filtering and search functionality
- Add status icons and category tags
- Create smooth selection interactions

#### Phase 3: Question Details (Week 3)
- Develop right panel with tab navigation
- Implement question content display
- Add desktop-specific optimizations
- Polish animations and transitions

#### Phase 4: Enhancement & Polish (Week 4)
- Add advanced features (bookmarking, notes)
- Implement performance optimizations
- Conduct thorough testing and bug fixes
- Final UI/UX refinements

### 11. **Success Criteria**

#### Visual Excellence
- **Pixel-Perfect**: Match reference design exactly
- **Consistent**: Uniform spacing, colors, and typography
- **Professional**: Clean, modern, and polished appearance
- **Accessible**: Proper contrast ratios and keyboard navigation

#### User Experience
- **Intuitive**: Clear navigation and interaction patterns
- **Desktop Optimized**: Seamless experience on desktop screens
- **Fast**: Smooth animations and quick loading times
- **Engaging**: Pleasant to use and visually appealing

#### Technical Quality
- **Maintainable**: Clean, well-documented code
- **Scalable**: Architecture that supports future growth
- **Performant**: Optimized for speed and efficiency
- **Robust**: Proper error handling and edge cases

### 12. **Additional Considerations**

#### Accessibility
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Blindness**: Sufficient contrast and alternative indicators
- **Focus Management**: Clear focus indicators and logical tab order

#### Browser Support
- **Desktop Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Screen Resolution**: Optimized for 1200px+ width screens
- **Progressive Enhancement**: Graceful degradation for older desktop browsers

#### Future Enhancements
- **Themes**: Light/dark mode toggle
- **Customization**: User preferences for layout and colors
- **Advanced Features**: Bookmarking, progress tracking
- **Integration**: API endpoints for external integrations

## Deliverables
1. **Beautiful Desktop Web Application**: Pixel-perfect recreation of the InterviewDB interface
2. **Desktop Optimized Design**: Seamless experience on desktop screens (1200px+ width)
3. **Clean Codebase**: Well-structured, documented, and maintainable code
4. **Performance**: Fast loading times and smooth interactions
5. **Accessibility**: WCAG 2.1 compliant design and implementation

This project will showcase expertise in modern web design, React development, and creating beautiful, user-friendly interfaces that prioritize both aesthetics and functionality.
