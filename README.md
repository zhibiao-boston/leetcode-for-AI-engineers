# LLM Coding for AI Engineer

A beautiful, modern desktop web application for AI engineers to practice LLM coding challenges. Built with React, TypeScript, and Tailwind CSS.

## 🎯 Features

- **Beautiful Dark Theme**: Sophisticated dark interface with purple accents
- **Two-Panel Layout**: 40% question list, 60% question details
- **Desktop Optimized**: Designed for 1200px+ width screens
- **Question Categories**: Coding, phone, onsite interview questions
- **Rich Content**: Detailed descriptions with tags and metadata
- **Smooth Interactions**: Hover effects and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd llm-coding
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Build Tool**: Create React App
- **Icons**: Heroicons (SVG)
- **Font**: Inter

## 📋 Sample Questions

The application includes 8 sample AI/ML coding questions:

1. **Design Database** (Medium) - Database system design
2. **Array Compression** (Medium) - Compression algorithms
3. **Backend Assignment Interview** (Hard) - Backend system design
4. **Basic Calculator** (Easy) - Mathematical expression evaluation
5. **LLM Token Counter** (Medium) - Token counting for LLMs
6. **Neural Network Optimizer** (Hard) - Neural network optimization
7. **Prompt Engineering Framework** (Medium) - Prompt management system
8. **Vector Database Query** (Hard) - Vector similarity search

## 🎨 Design

- **Color Palette**: Dark gray (#1a1a1a) background with purple (#8b5cf6) accents
- **Typography**: Inter font family for clean readability
- **Layout**: Fixed two-panel design optimized for desktop
- **Interactions**: Smooth hover effects and selection states

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Top navigation header
│   ├── QuestionList.tsx    # Left panel question list
│   └── QuestionDetails.tsx # Right panel question details
├── data/
│   └── questions.ts        # Sample question data
├── App.tsx                 # Main application component
└── index.css              # Tailwind CSS imports
```

## 🚀 Deployment

Build the app for production:

```bash
npm run build
```

This builds the app for production to the `build` folder.

## 📝 Development

- **Start Development**: `npm start`
- **Run Tests**: `npm test`
- **Build Production**: `npm run build`
- **Eject**: `npm run eject` (one-way operation)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Future Enhancements

- [ ] Search and filtering functionality
- [ ] User authentication and progress tracking
- [ ] More question categories and difficulty levels
- [ ] Code editor integration
- [ ] Performance optimizations
- [ ] Mobile responsiveness

---

Built with ❤️ for AI engineers practicing LLM coding challenges.