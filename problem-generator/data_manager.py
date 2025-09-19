#!/usr/bin/env python3
"""
Data Manager for ML/AI Problem Generation System
Handles storage, retrieval, and management of generated problems and solutions
"""

import json
import os
from typing import Dict, List, Optional
from datetime import datetime
import uuid

class DataManager:
    """Manages generated problems and solutions data"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.problems_file = os.path.join(data_dir, "generated_problems.json")
        self.solutions_file = os.path.join(data_dir, "generated_solutions.json")
        self.metadata_file = os.path.join(data_dir, "generation_metadata.json")
        
        # Ensure data directory exists
        os.makedirs(data_dir, exist_ok=True)
        
        # Initialize data files if they don't exist
        self._initialize_data_files()
    
    def _initialize_data_files(self):
        """Initialize data files with empty structures if they don't exist"""
        if not os.path.exists(self.problems_file):
            self._save_problems([])
        
        if not os.path.exists(self.solutions_file):
            self._save_solutions([])
        
        if not os.path.exists(self.metadata_file):
            self._save_metadata({
                "total_problems": 0,
                "total_solutions": 0,
                "last_updated": datetime.now().isoformat(),
                "generation_history": []
            })
    
    def save_problem(self, problem: Dict) -> str:
        """Save a generated problem and return its ID"""
        problems = self._load_problems()
        
        # Add generation metadata
        problem["generated_at"] = datetime.now().isoformat()
        problem["status"] = "generated"
        
        # Convert datetime objects to strings
        problem_copy = self._convert_datetime_to_string(problem)
        
        problems.append(problem_copy)
        self._save_problems(problems)
        
        # Update metadata
        self._update_metadata("problem_added", problem["id"])
        
        return problem["id"]
    
    def save_solution(self, solution: Dict, problem_id: str) -> str:
        """Save a generated solution and return its ID"""
        solutions = self._load_solutions()
        
        # Add generation metadata
        solution["generated_at"] = datetime.now().isoformat()
        solution["problem_id"] = problem_id
        solution["status"] = "generated"
        
        # Convert datetime objects to strings
        solution_copy = self._convert_datetime_to_string(solution)
        
        solutions.append(solution_copy)
        self._save_solutions(solutions)
        
        # Update metadata
        self._update_metadata("solution_added", solution["id"])
        
        return solution["id"]
    
    def get_problem(self, problem_id: str) -> Optional[Dict]:
        """Get a specific problem by ID"""
        problems = self._load_problems()
        for problem in problems:
            if problem["id"] == problem_id:
                return problem
        return None
    
    def get_solutions_for_problem(self, problem_id: str) -> List[Dict]:
        """Get all solutions for a specific problem"""
        solutions = self._load_solutions()
        return [sol for sol in solutions if sol.get("problem_id") == problem_id]
    
    def get_all_problems(self) -> List[Dict]:
        """Get all generated problems"""
        return self._load_problems()
    
    def get_all_solutions(self) -> List[Dict]:
        """Get all generated solutions"""
        return self._load_solutions()
    
    def get_problems_by_topic(self, topic: str) -> List[Dict]:
        """Get problems for a specific topic"""
        problems = self._load_problems()
        return [p for p in problems if topic.lower() in p.get("title", "").lower() or 
                topic.lower() in p.get("tags", [])]
    
    def get_problems_by_company(self, company: str) -> List[Dict]:
        """Get problems for a specific company"""
        problems = self._load_problems()
        return [p for p in problems if p.get("company", "").lower() == company.lower()]
    
    def get_problems_by_difficulty(self, difficulty: str) -> List[Dict]:
        """Get problems for a specific difficulty level"""
        problems = self._load_problems()
        return [p for p in problems if p.get("difficulty", "").lower() == difficulty.lower()]
    
    def update_problem_status(self, problem_id: str, status: str):
        """Update the status of a problem"""
        problems = self._load_problems()
        for problem in problems:
            if problem["id"] == problem_id:
                problem["status"] = status
                problem["updated_at"] = datetime.now().isoformat()
                break
        self._save_problems(problems)
    
    def delete_problem(self, problem_id: str) -> bool:
        """Delete a problem and its associated solutions"""
        problems = self._load_problems()
        solutions = self._load_solutions()
        
        # Remove problem
        original_count = len(problems)
        problems = [p for p in problems if p["id"] != problem_id]
        
        if len(problems) < original_count:
            # Remove associated solutions
            solutions = [s for s in solutions if s.get("problem_id") != problem_id]
            
            self._save_problems(problems)
            self._save_solutions(solutions)
            self._update_metadata("problem_deleted", problem_id)
            return True
        
        return False
    
    def get_statistics(self) -> Dict:
        """Get generation statistics"""
        metadata = self._load_metadata()
        problems = self._load_problems()
        solutions = self._load_solutions()
        
        return {
            "total_problems": len(problems),
            "total_solutions": len(solutions),
            "problems_by_difficulty": self._count_by_field(problems, "difficulty"),
            "problems_by_company": self._count_by_field(problems, "company"),
            "last_updated": metadata.get("last_updated"),
            "generation_history": metadata.get("generation_history", [])[-10:]  # Last 10 entries
        }
    
    def export_data(self, export_file: str = None) -> str:
        """Export all data to a single JSON file"""
        if not export_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            export_file = os.path.join(self.data_dir, f"export_{timestamp}.json")
        
        export_data = {
            "exported_at": datetime.now().isoformat(),
            "problems": self._load_problems(),
            "solutions": self._load_solutions(),
            "metadata": self._load_metadata()
        }
        
        with open(export_file, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        return export_file
    
    def _load_problems(self) -> List[Dict]:
        """Load problems from file"""
        try:
            with open(self.problems_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def _save_problems(self, problems: List[Dict]):
        """Save problems to file"""
        with open(self.problems_file, 'w') as f:
            json.dump(problems, f, indent=2)
    
    def _load_solutions(self) -> List[Dict]:
        """Load solutions from file"""
        try:
            with open(self.solutions_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def _save_solutions(self, solutions: List[Dict]):
        """Save solutions to file"""
        with open(self.solutions_file, 'w') as f:
            json.dump(solutions, f, indent=2)
    
    def _load_metadata(self) -> Dict:
        """Load metadata from file"""
        try:
            with open(self.metadata_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def _save_metadata(self, metadata: Dict):
        """Save metadata to file"""
        with open(self.metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
    
    def _update_metadata(self, action: str, item_id: str):
        """Update metadata with new action"""
        metadata = self._load_metadata()
        
        metadata["last_updated"] = datetime.now().isoformat()
        metadata["total_problems"] = len(self._load_problems())
        metadata["total_solutions"] = len(self._load_solutions())
        
        # Add to generation history
        if "generation_history" not in metadata:
            metadata["generation_history"] = []
        
        metadata["generation_history"].append({
            "timestamp": datetime.now().isoformat(),
            "action": action,
            "item_id": item_id
        })
        
        self._save_metadata(metadata)
    
    def _count_by_field(self, items: List[Dict], field: str) -> Dict:
        """Count items by a specific field"""
        counts = {}
        for item in items:
            value = item.get(field, "unknown")
            counts[value] = counts.get(value, 0) + 1
        return counts
    
    def _convert_datetime_to_string(self, obj):
        """Convert datetime objects to strings recursively"""
        if isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, dict):
            return {key: self._convert_datetime_to_string(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self._convert_datetime_to_string(item) for item in obj]
        else:
            return obj

def main():
    """Demo the data manager"""
    dm = DataManager()
    
    print("📊 Data Manager Demo")
    print("=" * 40)
    
    # Show current statistics
    stats = dm.get_statistics()
    print(f"Total Problems: {stats['total_problems']}")
    print(f"Total Solutions: {stats['total_solutions']}")
    
    if stats['total_problems'] > 0:
        print(f"\nProblems by Difficulty:")
        for difficulty, count in stats['problems_by_difficulty'].items():
            print(f"  {difficulty}: {count}")
        
        print(f"\nProblems by Company:")
        for company, count in stats['problems_by_company'].items():
            print(f"  {company}: {count}")
    
    print(f"\nLast Updated: {stats['last_updated']}")

if __name__ == "__main__":
    main()
