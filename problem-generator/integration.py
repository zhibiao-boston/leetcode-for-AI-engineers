#!/usr/bin/env python3
"""
Integration script to update backend and frontend with generated problems and solutions
"""

import json
import os
from datetime import datetime
from data_manager import DataManager

class IntegrationManager:
    """Manages integration of generated content with backend and frontend"""
    
    def __init__(self):
        self.data_manager = DataManager()
        self.backend_dir = "../backend/src/config"
        self.frontend_dir = "../frontend/src/data"
        
    def integrate_with_backend(self):
        """Update backend mock database with generated problems"""
        print("🔄 Integrating with backend...")
        
        # Load generated problems
        problems = self.data_manager.get_all_problems()
        solutions = self.data_manager.get_all_solutions()
        
        # Read current backend mock data
        backend_file = os.path.join(self.backend_dir, "database-mock.ts")
        
        try:
            with open(backend_file, 'r') as f:
                content = f.read()
            
            # Find the mockProblems array and add our generated problems
            new_problems = self._convert_to_backend_format(problems)
            new_solutions = self._convert_to_backend_solutions_format(solutions)
            
            # Update the file
            updated_content = self._update_backend_content(content, new_problems, new_solutions)
            
            with open(backend_file, 'w') as f:
                f.write(updated_content)
            
            print(f"✅ Updated backend: {len(new_problems)} problems, {len(new_solutions)} solutions")
            
        except Exception as e:
            print(f"❌ Error updating backend: {e}")
    
    def integrate_with_frontend(self):
        """Update frontend data with generated problems"""
        print("🔄 Integrating with frontend...")
        
        # Load generated problems
        problems = self.data_manager.get_all_problems()
        
        # Read current frontend data
        frontend_file = os.path.join(self.frontend_dir, "questions.ts")
        
        try:
            with open(frontend_file, 'r') as f:
                content = f.read()
            
            # Convert to frontend format
            new_questions = self._convert_to_frontend_format(problems)
            
            # Update the file
            updated_content = self._update_frontend_content(content, new_questions)
            
            with open(frontend_file, 'w') as f:
                f.write(updated_content)
            
            print(f"✅ Updated frontend: {len(new_questions)} questions")
            
        except Exception as e:
            print(f"❌ Error updating frontend: {e}")
    
    def _convert_to_backend_format(self, problems):
        """Convert generated problems to backend format"""
        backend_problems = []
        
        for problem in problems:
            backend_problem = {
                "id": problem["id"],
                "title": problem["title"],
                "description": problem["description"],
                "difficulty": problem["difficulty"],
                "company": problem["company"],
                "categories": problem["categories"],
                "tags": problem["tags"],
                "status": "published",
                "created_by": "1",
                "created_at": "new Date()",
                "updated_at": "new Date()",
                "published_at": "new Date()"
            }
            backend_problems.append(backend_problem)
        
        return backend_problems
    
    def _convert_to_backend_solutions_format(self, solutions):
        """Convert generated solutions to backend format"""
        backend_solutions = []
        
        for solution in solutions:
            if solution.get("code"):  # Only include solutions with actual code
                backend_solution = {
                    "id": solution["id"],
                    "problem_id": solution["problem_id"],
                    "title": solution["title"],
                    "code": solution["code"],
                    "language": "python",
                    "status": "Accepted",
                    "explanation": solution.get("explanation", ""),
                    "time_complexity": solution.get("time_complexity", ""),
                    "space_complexity": solution.get("space_complexity", ""),
                    "created_by": "1",
                    "created_at": "new Date()",
                    "updated_at": "new Date()"
                }
                backend_solutions.append(backend_solution)
        
        return backend_solutions
    
    def _convert_to_frontend_format(self, problems):
        """Convert generated problems to frontend format"""
        frontend_questions = []
        
        for problem in problems:
            frontend_question = {
                "id": problem["id"],
                "title": problem["title"],
                "categories": problem["categories"],
                "lastReported": "Just generated",
                "description": problem["description"],
                "difficulty": problem["difficulty"],
                "company": problem["company"],
                "tags": problem["tags"]
            }
            frontend_questions.append(frontend_question)
        
        return frontend_questions
    
    def _update_backend_content(self, content, new_problems, new_solutions):
        """Update backend TypeScript content"""
        # This is a simplified approach - in practice, you'd want to parse and modify the TypeScript AST
        # For now, we'll append to the existing arrays
        
        # Add new problems to mockProblems array
        problems_ts = ",\n  ".join([self._dict_to_ts_object(p) for p in new_problems])
        
        # Add new solutions (we'll add them as a new mockSolutions array)
        solutions_ts = ",\n  ".join([self._dict_to_ts_object(s) for s in new_solutions])
        
        # Insert before the closing bracket of mockProblems
        if "];" in content:
            content = content.replace("];", f",\n  {problems_ts}\n];")
        
        # Add mockSolutions export if it doesn't exist
        if "export const mockSolutions" not in content:
            solutions_export = f"\n\nexport const mockSolutions = [\n  {solutions_ts}\n];"
            content += solutions_export
        
        return content
    
    def _update_frontend_content(self, content, new_questions):
        """Update frontend TypeScript content"""
        # Convert questions to TypeScript format
        questions_ts = ",\n  ".join([self._dict_to_ts_object(q) for q in new_questions])
        
        # Insert before the closing bracket of sampleQuestions
        if "];" in content:
            content = content.replace("];", f",\n  {questions_ts}\n];")
        
        return content
    
    def _dict_to_ts_object(self, obj):
        """Convert Python dict to TypeScript object string"""
        ts_parts = []
        for key, value in obj.items():
            if isinstance(value, str):
                ts_parts.append(f'    {key}: "{value}"')
            elif isinstance(value, list):
                if all(isinstance(item, str) for item in value):
                    items = ", ".join([f'"{item}"' for item in value])
                    ts_parts.append(f'    {key}: [{items}]')
                else:
                    ts_parts.append(f'    {key}: {json.dumps(value)}')
            else:
                ts_parts.append(f'    {key}: {json.dumps(value)}')
        
        return "{\n" + ",\n".join(ts_parts) + "\n  }"
    
    def run_integration(self):
        """Run complete integration"""
        print("🚀 Starting integration with backend and frontend...")
        print("=" * 60)
        
        # Get current statistics
        stats = self.data_manager.get_statistics()
        print(f"📊 Current data: {stats['total_problems']} problems, {stats['total_solutions']} solutions")
        
        # Integrate with backend
        self.integrate_with_backend()
        
        # Integrate with frontend
        self.integrate_with_frontend()
        
        print("\n✅ Integration completed!")
        print("🎯 Next steps:")
        print("   1. Start the backend server")
        print("   2. Start the frontend development server")
        print("   3. Test the integration")

def main():
    """Main integration function"""
    integrator = IntegrationManager()
    integrator.run_integration()

if __name__ == "__main__":
    main()
