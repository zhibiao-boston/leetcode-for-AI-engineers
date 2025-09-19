# ML/AI Problem Generation System Prompt

## Overview
This document outlines the design and implementation of an automated ML/AI problem generation system that creates coding problems, generates solutions, and integrates them into the existing LeetCode for AI Engineers platform.

## System Architecture

### 1. Directory Structure
```
leetcode-for-AI-engineers/
├── prompt/                      # Prompt templates directory
│   ├── problem_prompts/         # Problem generation prompts
│   │   └── problem_generation_template.txt
│   └── solution_prompts/        # Solution generation prompts
│       ├── full_solution_generation_template.txt
│       └── practice_solution_generation_template.txt
├── problem-generator/           # New directory for ML/AI problem generation
│   ├── ml_problem_generator.py  # Main Python script
│   ├── data/                    # Generated data
│   │   ├── ml_problems.json     # Generated ML/AI problems
│   │   ├── ml_solutions.json    # Generated ML/AI solutions
│   │   └── ml_test_cases.json   # Generated test cases
│   ├── utils/                   # Utility functions
│   │   ├── complexity_analyzer.py
│   │   ├── ml_difficulty_calculator.py
│   │   └── data_exporter.py
│   ├── config/                  # Configuration
│   │   ├── ml_topics_config.py     # ML/AI topics configuration with version control
│   │   ├── topic_manager.py        # Command-line topic management tool
│   │   ├── CHANGELOG.md            # Version control changelog
│   │   ├── ml_generator_config.py
│   │   └── ml_company_tags.py
│   ├── main.py                  # Main script to run ML generator
│   └── requirements.txt         # Python dependencies
```

### 2. Problem Generation Flow
```
LLM Topic Placeholder → Problem Generation Prompt → Generated Problem → Full Solution Generation Prompt → Practice Solution Generation Prompt → Database Integration
```

### 3. Components

#### A. Problem Generation Prompt
- **Input**: LLM coding topic placeholder (e.g., "tokenization", "prompt engineering", "model optimization")
- **Output**: Complete problem with title, description, and category tags
- **Integration**: Automatically populates both user and admin interfaces

#### B. Solution Generation Prompts
- **Input**: Generated problem
- **Output**: Two separate code versions:
  1. **Full Solution**: Complete code with detailed comments (for solution button)
  2. **Practice Snippet**: High-level code with hints/comments (for practice)

#### C. Python Script Integration
- Reads prompts from template files
- Uses Cursor's built-in AI for generation
- Processes generated content
- Updates database automatically
- Maintains data consistency across user/admin interfaces

## Detailed Implementation

### 1. Problem Generation Prompt Template

The problem generation prompt is stored in `prompt/problem_generation_template.txt` and contains:

- Comprehensive requirements for ML/AI problem generation
- JSON output format specification
- Guidelines for creating realistic, industry-relevant problems
- Instructions for appropriate difficulty levels and company selection

**Template File**: `prompt/problem_prompts/problem_generation_template.txt`
**Placeholder**: `{LLM_CODING_TOPIC}` - replaced with the specific ML/AI topic

### 2. Solution Generation Prompt Templates

The solution generation prompts are stored in the `prompt/solution_prompts/` directory and contain:

#### A. Full Solution Generation Template
- Requirements for generating complete, production-ready solutions
- JSON output format for comprehensive solutions
- Guidelines for detailed explanations and complexity analysis
- Instructions for ML/AI specific considerations

**Template File**: `prompt/solution_prompts/full_solution_generation_template.txt`
**Placeholder**: `{GENERATED_PROBLEM}` - replaced with the generated problem data

#### B. Practice Solution Generation Template
- Requirements for generating educational practice materials
- JSON output format for practice snippets with hints
- Guidelines for creating learning-focused content
- Instructions for step-by-step guidance

**Template File**: `prompt/solution_prompts/practice_solution_generation_template.txt`
**Placeholder**: `{GENERATED_PROBLEM}` - replaced with the generated problem data

### 3. LLM Coding Topics Management

The system includes a comprehensive topic management system with version control:

#### A. Topics Configuration (`problem-generator/config/ml_topics_config.py`)
- **48 core LLM implementation topics** organized into 6 categories
- **Topic metadata** including difficulty levels, company preferences, prerequisites
- **Company-specific preferences** for 8 major AI companies
- **Version control** with backup and changelog system

#### B. LLM Implementation Topic Categories
1. **Attention Mechanisms**: self-attention, multi-head attention, scaled dot-product attention, etc.
2. **Transformer Architecture**: transformer block, layer normalization, positional encoding, etc.
3. **Tokenization**: tokenizer implementation, byte-pair encoding, subword tokenization, etc.
4. **Inference Optimization**: kv-cache, greedy search, beam search, etc.
5. **Language Modeling**: next-token prediction, language model training, perplexity calculation, etc.
6. **Neural Networks**: two-layer MLP, multi-layer perceptron, activation functions, etc.

#### C. Core LLM Topics (Similar to Stanford CS336)
- **Self-attention**: Core attention mechanism implementation
- **KV-cache**: Memory optimization for inference
- **Greedy search**: Basic text generation algorithm
- **Tokenizer implementation**: Text tokenization algorithms
- **Two-layer MLP**: Basic neural network architecture
- **Multi-head attention**: Advanced attention mechanism
- **Scaled dot-product attention**: Attention computation
- **Byte-pair encoding**: Subword tokenization
- **Beam search**: Advanced text generation
- **Positional encoding**: Position information in transformers
- **Layer normalization**: Neural network normalization
- **Next-token prediction**: Core language modeling task

#### D. Topic Management Tools
- **Command-line tool** (`topic_manager.py`) for easy topic management
- **Version control** with automatic backups before changes
- **Changelog tracking** for all modifications
- **Export/import** functionality for configuration sharing

#### E. Usage Examples
```bash
# List all LLM implementation topics
python topic_manager.py list

# List topics by category
python topic_manager.py list --category attention_mechanisms

# List topics by company
python topic_manager.py list --company OpenAI

# Show topic details
python topic_manager.py info self-attention

# Add new LLM topic
python topic_manager.py add rotary_positional_encoding transformer_architecture --difficulty medium --companies OpenAI,Google

# Export configuration
python topic_manager.py export --file llm_topics_backup.json
```

### 4. Python Script Structure

```python
# ml_problem_generator.py
import json
import os
from typing import Dict, List
import uuid
from datetime import datetime
from config.ml_topics_config import MLTopicsConfig

class MLProblemGenerator:
    def __init__(self):
        self.problem_prompts_dir = "prompt/problem_prompts"
        self.solution_prompts_dir = "prompt/solution_prompts"
        self.topics_config = MLTopicsConfig()
        
    def generate_problem(self, topic: str) -> Dict:
        """Generate a problem from ML/AI topic using Cursor's AI"""
        prompt = self._load_problem_prompt(topic)
        
        # This prompt would be used with Cursor's AI interface
        print("=== PROBLEM GENERATION PROMPT ===")
        print(prompt)
        print("=== END PROMPT ===")
        print("\nCopy the above prompt to Cursor's AI interface to generate the problem.")
        
        # For now, return a placeholder structure
        return self._get_problem_placeholder(topic)
    
    def generate_full_solution(self, problem: Dict) -> Dict:
        """Generate full solution using Cursor's AI"""
        prompt = self._load_full_solution_prompt(problem)
        
        # This prompt would be used with Cursor's AI interface
        print("=== FULL SOLUTION GENERATION PROMPT ===")
        print(prompt)
        print("=== END PROMPT ===")
        print("\nCopy the above prompt to Cursor's AI interface to generate the full solution.")
        
        # For now, return a placeholder structure
        return self._get_full_solution_placeholder(problem)
    
    def generate_practice_solution(self, problem: Dict) -> Dict:
        """Generate practice snippet using Cursor's AI"""
        prompt = self._load_practice_solution_prompt(problem)
        
        # This prompt would be used with Cursor's AI interface
        print("=== PRACTICE SOLUTION GENERATION PROMPT ===")
        print(prompt)
        print("=== END PROMPT ===")
        print("\nCopy the above prompt to Cursor's AI interface to generate the practice solution.")
        
        # For now, return a placeholder structure
        return self._get_practice_solution_placeholder(problem)
    
    def integrate_to_database(self, problem: Dict, solution: Dict):
        """Update database with generated content"""
        # Update mock database
        self._update_mock_database(problem, solution)
        
        # Update frontend data
        self._update_frontend_data(problem, solution)
        
        # Update admin solutions
        self._update_admin_solutions(problem, solution)
    
    def _load_problem_prompt(self, topic: str) -> str:
        """Load and format problem generation prompt"""
        prompt_file = os.path.join(self.problem_prompts_dir, "problem_generation_template.txt")
        with open(prompt_file, 'r') as f:
            template = f.read()
        return template.format(LLM_CODING_TOPIC=topic)
    
    def _load_full_solution_prompt(self, problem: Dict) -> str:
        """Load and format full solution generation prompt"""
        prompt_file = os.path.join(self.solution_prompts_dir, "full_solution_generation_template.txt")
        with open(prompt_file, 'r') as f:
            template = f.read()
        return template.format(GENERATED_PROBLEM=json.dumps(problem, indent=2))
    
    def _load_practice_solution_prompt(self, problem: Dict) -> str:
        """Load and format practice solution generation prompt"""
        prompt_file = os.path.join(self.solution_prompts_dir, "practice_solution_generation_template.txt")
        with open(prompt_file, 'r') as f:
            template = f.read()
        return template.format(GENERATED_PROBLEM=json.dumps(problem, indent=2))
    
    def _get_problem_placeholder(self, topic: str) -> Dict:
        """Return placeholder problem structure"""
        return {
            "id": str(uuid.uuid4()),
            "title": f"Generated Problem for {topic}",
            "description": "This is a placeholder. Use Cursor's AI to generate the actual problem.",
            "difficulty": "medium",
            "company": "OpenAI",
            "categories": ["coding", "phone"],
            "tags": [topic, "ml", "ai"],
            "status": "draft",
            "created_by": "1",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    
    def _get_full_solution_placeholder(self, problem: Dict) -> Dict:
        """Return placeholder full solution structure"""
        return {
            "id": str(uuid.uuid4()),
            "problem_id": problem["id"],
            "title": "Generated Full Solution",
            "description": "This is a placeholder. Use Cursor's AI to generate the actual full solution.",
            "created_by": "1",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    
    def _get_practice_solution_placeholder(self, problem: Dict) -> Dict:
        """Return placeholder practice solution structure"""
        return {
            "id": str(uuid.uuid4()),
            "problem_id": problem["id"],
            "title": "Generated Practice Solution",
            "description": "This is a placeholder. Use Cursor's AI to generate the actual practice solution.",
            "created_by": "1",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
```

### 4. Database Integration Strategy

#### A. Mock Database Update
```typescript
// Update backend/src/config/database-mock.ts
export const mockProblems = [
  // ... existing problems
  ...generatedProblems.map(problem => ({
    id: problem.id,
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    company: problem.company,
    categories: problem.categories,
    tags: problem.tags,
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  }))
];
```

#### B. Admin Solutions Update
```typescript
// Update AdminSolution model
export const mockAdminSolutions = [
  // ... existing solutions
  ...generatedSolutions.map(solution => ({
    id: solution.id,
    problem_id: solution.problem_id,
    title: solution.title,
    code: solution.full_solution.code,
    explanation: solution.full_solution.explanation,
    time_complexity: solution.full_solution.time_complexity,
    space_complexity: solution.full_solution.space_complexity,
    is_published: true,
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date()
  }))
];
```

### 5. Frontend Integration

#### A. Practice Mode Component
```typescript
// New component: PracticeMode.tsx
interface PracticeModeProps {
  problem: Problem;
  practiceSnippet: PracticeSnippet;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ problem, practiceSnippet }) => {
  return (
    <div className="practice-mode">
      <h3>Practice Version</h3>
      <CodeEditor 
        initialCode={practiceSnippet.code}
        hints={practiceSnippet.hints}
        learningObjectives={practiceSnippet.learning_objectives}
      />
      <HintPanel hints={practiceSnippet.hints} />
    </div>
  );
};
```

#### B. Solution Button Enhancement
```typescript
// Enhanced solution display
const SolutionDisplay: React.FC<{ solution: AdminSolution }> = ({ solution }) => {
  return (
    <div className="solution-display">
      <h3>{solution.title}</h3>
      <CodeBlock code={solution.code} language="python" />
      <ComplexityAnalysis 
        time={solution.time_complexity}
        space={solution.space_complexity}
      />
      <Explanation text={solution.explanation} />
    </div>
  );
};
```

### 6. Configuration Files

#### A. ML Topics Configuration
```python
# config/ml_topics.py
ML_TOPICS = [
    "tokenization",
    "prompt engineering", 
    "model fine-tuning",
    "inference optimization",
    "neural network optimization",
    "hyperparameter tuning",
    "gradient descent variants",
    "regularization techniques",
    "model compression",
    "distributed training",
    "ml pipeline design",
    "model serving",
    "feature engineering",
    "data preprocessing",
    "model evaluation"
]

COMPANIES = [
    "OpenAI",
    "Anthropic", 
    "Google",
    "Microsoft",
    "Meta",
    "DeepMind",
    "Pinecone"
]
```

#### B. Generation Settings
```python
# config/generation_settings.py
GENERATION_SETTINGS = {
    "max_problems_per_topic": 3,
    "difficulty_distribution": {
        "easy": 0.3,
        "medium": 0.5, 
        "hard": 0.2
    },
    "company_distribution": "random",
    "auto_publish": True,
    "include_practice_mode": True
}
```

### 7. Usage Workflow

#### A. Manual Generation
```bash
# Generate problems for specific topics
python problem-generator/ml_problem_generator.py --topics "tokenization,prompt engineering" --count 5

# Generate problems for all topics
python problem-generator/ml_problem_generator.py --all-topics --count 20
```

#### B. Automated Generation
```python
# Scheduled generation
from apscheduler.schedulers.blocking import BlockingScheduler

scheduler = BlockingScheduler()

@scheduler.scheduled_job('cron', hour=0, minute=0)  # Daily at midnight
def daily_problem_generation():
    generator = MLProblemGenerator()
    topics = random.sample(ML_TOPICS, 3)  # Generate 3 random topics
    
    for topic in topics:
        problem = generator.generate_problem(topic)
        full_solution = generator.generate_full_solution(problem)
        practice_solution = generator.generate_practice_solution(problem)
        generator.integrate_to_database(problem, full_solution, practice_solution)

scheduler.start()
```

### 8. Quality Assurance

#### A. Problem Validation
- Check problem completeness
- Validate examples and constraints
- Ensure appropriate difficulty level
- Verify company relevance

#### B. Solution Validation
- Test code compilation
- Verify complexity analysis
- Check comment quality
- Validate practice snippet effectiveness

#### C. Integration Testing
- Test database updates
- Verify frontend display
- Check admin interface
- Validate user experience

### 9. Monitoring and Analytics

#### A. Generation Metrics
- Problems generated per day/week
- Topic distribution
- Difficulty distribution
- Company distribution

#### B. Quality Metrics
- User engagement with generated problems
- Solution completion rates
- Practice mode usage
- Feedback scores

### 10. Future Enhancements

#### A. Advanced Features
- Multi-language support
- Interactive problem generation
- Adaptive difficulty adjustment
- Community-driven problem suggestions

#### B. Integration Improvements
- Real-time problem updates
- Advanced filtering and search
- Personalized problem recommendations
- Collaborative problem solving

## Implementation Priority

1. **Phase 1**: Core problem generation system
2. **Phase 2**: Solution generation and practice mode
3. **Phase 3**: Database integration and frontend updates
4. **Phase 4**: Quality assurance and monitoring
5. **Phase 5**: Advanced features and optimizations

This system provides a comprehensive, automated approach to generating high-quality ML/AI coding problems while maintaining the existing platform's functionality and user experience.
