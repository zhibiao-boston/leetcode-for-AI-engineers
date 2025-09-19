#!/usr/bin/env python3
"""
ML Problem Generator
Main script for generating LLM implementation problems using Cursor's AI
"""

import json
import os
from typing import Dict, List
import uuid
from datetime import datetime
from config.ml_topics_config import MLTopicsConfig
from data_manager import DataManager

class MLProblemGenerator:
    def __init__(self):
        self.problem_prompts_dir = "../prompt/problem_prompts"
        self.solution_prompts_dir = "../prompt/solution_prompts"
        self.topics_config = MLTopicsConfig()
        self.data_manager = DataManager()
        
    def generate_problem(self, topic: str) -> Dict:
        """Generate a problem from LLM implementation topic using Cursor's AI"""
        prompt = self._load_problem_prompt(topic)
        
        # This prompt would be used with Cursor's AI interface
        print("=" * 80)
        print("PROBLEM GENERATION PROMPT")
        print("=" * 80)
        print(prompt)
        print("=" * 80)
        print("\n📋 INSTRUCTIONS:")
        print("1. Copy the above prompt to Cursor's AI interface")
        print("2. Generate the problem using Cursor's AI")
        print("3. Copy the generated JSON response back here")
        print("4. The system will process and integrate it into the database")
        print("=" * 80)
        
        # For now, return a placeholder structure
        return self._get_problem_placeholder(topic)
    
    def generate_full_solution(self, problem: Dict) -> Dict:
        """Generate full solution using Cursor's AI"""
        prompt = self._load_full_solution_prompt(problem)
        
        # This prompt would be used with Cursor's AI interface
        print("=" * 80)
        print("FULL SOLUTION GENERATION PROMPT")
        print("=" * 80)
        print(prompt)
        print("=" * 80)
        print("\n📋 INSTRUCTIONS:")
        print("1. Copy the above prompt to Cursor's AI interface")
        print("2. Generate the full solution using Cursor's AI")
        print("3. Copy the generated JSON response back here")
        print("4. The system will process and integrate it into the database")
        print("=" * 80)
        
        # For now, return a placeholder structure
        return self._get_full_solution_placeholder(problem)
    
    def generate_practice_solution(self, problem: Dict) -> Dict:
        """Generate practice snippet using Cursor's AI"""
        prompt = self._load_practice_solution_prompt(problem)
        
        # This prompt would be used with Cursor's AI interface
        print("=" * 80)
        print("PRACTICE SOLUTION GENERATION PROMPT")
        print("=" * 80)
        print(prompt)
        print("=" * 80)
        print("\n📋 INSTRUCTIONS:")
        print("1. Copy the above prompt to Cursor's AI interface")
        print("2. Generate the practice solution using Cursor's AI")
        print("3. Copy the generated JSON response back here")
        print("4. The system will process and integrate it into the database")
        print("=" * 80)
        
        # For now, return a placeholder structure
        return self._get_practice_solution_placeholder(problem)
    
    def integrate_to_database(self, problem: Dict, full_solution: Dict, practice_solution: Dict):
        """Update database with generated content"""
        print("\n🔄 INTEGRATING TO DATABASE...")
        
        # Save to data manager
        problem_id = self.data_manager.save_problem(problem)
        full_solution_id = self.data_manager.save_solution(full_solution, problem_id)
        practice_solution_id = self.data_manager.save_solution(practice_solution, problem_id)
        
        print(f"📝 Saved problem: {problem_id}")
        print(f"💻 Saved full solution: {full_solution_id}")
        print(f"🎯 Saved practice solution: {practice_solution_id}")
        
        # Update mock database
        self._update_mock_database(problem, full_solution, practice_solution)
        
        # Update frontend data
        self._update_frontend_data(problem, full_solution, practice_solution)
        
        # Update admin solutions
        self._update_admin_solutions(problem, full_solution, practice_solution)
        
        print("✅ Database integration completed!")
    
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
        
        # Convert datetime objects to strings for JSON serialization
        problem_copy = problem.copy()
        for key, value in problem_copy.items():
            if isinstance(value, datetime):
                problem_copy[key] = value.isoformat()
        
        return template.format(GENERATED_PROBLEM=json.dumps(problem_copy, indent=2))
    
    def _load_practice_solution_prompt(self, problem: Dict) -> str:
        """Load and format practice solution generation prompt"""
        prompt_file = os.path.join(self.solution_prompts_dir, "practice_solution_generation_template.txt")
        with open(prompt_file, 'r') as f:
            template = f.read()
        
        # Convert datetime objects to strings for JSON serialization
        problem_copy = problem.copy()
        for key, value in problem_copy.items():
            if isinstance(value, datetime):
                problem_copy[key] = value.isoformat()
        
        return template.format(GENERATED_PROBLEM=json.dumps(problem_copy, indent=2))
    
    def _get_problem_placeholder(self, topic: str) -> Dict:
        """Return placeholder problem structure"""
        metadata = self.topics_config.get_topic_metadata(topic)
        
        return {
            "id": str(uuid.uuid4()),
            "topic": topic,
            "title": f"LLM Implementation: {topic.replace('_', ' ').title()}",
            "description": f"This is a placeholder problem for {topic}. Use Cursor's AI to generate the actual problem.",
            "difficulty": metadata.get("difficulty_levels", ["medium"])[0],
            "company": metadata.get("companies", ["OpenAI"])[0],
            "categories": ["coding", "phone"],
            "tags": metadata.get("tags", [topic]),
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
            "type": "full_solution",
            "title": f"Complete Solution for {problem['title']}",
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
            "type": "practice_solution",
            "title": f"Practice Solution for {problem['title']}",
            "description": "This is a placeholder. Use Cursor's AI to generate the actual practice solution.",
            "created_by": "1",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    
    def _update_mock_database(self, problem: Dict, full_solution: Dict, practice_solution: Dict):
        """Update mock database with generated content"""
        print("📝 Updating mock database...")
        # This would update backend/src/config/database-mock.ts
        # Implementation would go here
    
    def _update_frontend_data(self, problem: Dict, full_solution: Dict, practice_solution: Dict):
        """Update frontend data with generated content"""
        print("🎨 Updating frontend data...")
        # This would update src/data/questions.ts
        # Implementation would go here
    
    def _update_admin_solutions(self, problem: Dict, full_solution: Dict, practice_solution: Dict):
        """Update admin solutions with generated content"""
        print("👨‍💼 Updating admin solutions...")
        # This would update admin solution models
        # Implementation would go here

def main():
    """Main function to demonstrate the problem generation system"""
    print("🚀 ML/AI Problem Generation System")
    print("=" * 50)
    
    generator = MLProblemGenerator()
    
    # Get available topics
    print("\n📚 Available LLM Implementation Topics:")
    all_topics = generator.topics_config.get_all_topics()
    for i, topic in enumerate(all_topics[:10], 1):  # Show first 10 topics
        metadata = generator.topics_config.get_topic_metadata(topic)
        difficulty = ", ".join(metadata.get("difficulty_levels", []))
        print(f"{i:2d}. {topic} ({difficulty})")
    
    print(f"\nTotal topics available: {len(all_topics)}")
    
    # Example: Generate problem for self-attention
    print("\n" + "=" * 50)
    print("EXAMPLE: Generating problem for 'self-attention'")
    print("=" * 50)
    
    topic = "self-attention"
    problem = generator.generate_problem(topic)
    
    print(f"\n✅ Generated problem placeholder for: {problem['title']}")
    print(f"   Difficulty: {problem['difficulty']}")
    print(f"   Company: {problem['company']}")
    print(f"   Tags: {', '.join(problem['tags'])}")
    
    # Generate solutions
    full_solution = generator.generate_full_solution(problem)
    practice_solution = generator.generate_practice_solution(problem)
    
    print(f"\n✅ Generated solution placeholders:")
    print(f"   Full solution: {full_solution['title']}")
    print(f"   Practice solution: {practice_solution['title']}")
    
    # Integrate to database
    generator.integrate_to_database(problem, full_solution, practice_solution)
    
    print("\n🎉 Problem generation workflow completed!")
    print("\n📋 Next Steps:")
    print("1. Use the generated prompts with Cursor's AI")
    print("2. Copy the AI-generated content back to the system")
    print("3. The system will automatically integrate the content")

if __name__ == "__main__":
    main()
