#!/usr/bin/env python3
"""
Simple integration script to add generated problems to backend
"""

import json
from data_manager import DataManager

def add_problems_to_backend():
    """Add generated problems to backend mock data"""
    
    # Load generated problems
    dm = DataManager()
    problems = dm.get_all_problems()
    
    # Convert to backend format
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
    
    # Create TypeScript code
    ts_code = "// Generated LLM Problems\n"
    ts_code += "export const generatedProblems = [\n"
    
    for i, problem in enumerate(backend_problems):
        ts_code += "  {\n"
        ts_code += f'    id: "{problem["id"]}",\n'
        ts_code += f'    title: "{problem["title"]}",\n'
        ts_code += f'    description: "{problem["description"]}",\n'
        ts_code += f'    difficulty: "{problem["difficulty"]}",\n'
        ts_code += f'    company: "{problem["company"]}",\n'
        ts_code += f'    categories: {json.dumps(problem["categories"])},\n'
        ts_code += f'    tags: {json.dumps(problem["tags"])},\n'
        ts_code += f'    status: "published",\n'
        ts_code += f'    created_by: "1",\n'
        ts_code += "    created_at: new Date(),\n"
        ts_code += "    updated_at: new Date(),\n"
        ts_code += "    published_at: new Date()\n"
        ts_code += "  }"
        if i < len(backend_problems) - 1:
            ts_code += ","
        ts_code += "\n"
    
    ts_code += "];\n"
    
    # Write to file
    with open("../backend/src/config/generated-problems.ts", "w") as f:
        f.write(ts_code)
    
    print(f"✅ Created generated-problems.ts with {len(backend_problems)} problems")
    print("📝 Next step: Import and merge with existing mockProblems in database-mock.ts")

def add_solutions_to_backend():
    """Add generated solutions to backend"""
    
    # Load generated solutions
    dm = DataManager()
    solutions = dm.get_all_solutions()
    
    # Filter solutions with actual code
    solutions_with_code = [s for s in solutions if s.get("code")]
    
    if not solutions_with_code:
        print("⚠️  No solutions with code found")
        return
    
    # Convert to backend format
    backend_solutions = []
    for solution in solutions_with_code:
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
    
    # Create TypeScript code
    ts_code = "// Generated LLM Solutions\n"
    ts_code += "export const generatedSolutions = [\n"
    
    for i, solution in enumerate(backend_solutions):
        ts_code += "  {\n"
        ts_code += f'    id: "{solution["id"]}",\n'
        ts_code += f'    problem_id: "{solution["problem_id"]}",\n'
        ts_code += f'    title: "{solution["title"]}",\n'
        # Escape the code properly
        code_escaped = solution["code"].replace('"', '\\"').replace('\n', '\\n')
        ts_code += f'    code: "{code_escaped}",\n'
        ts_code += f'    language: "{solution["language"]}",\n'
        ts_code += f'    status: "{solution["status"]}",\n'
        explanation_escaped = solution["explanation"].replace('"', '\\"').replace('\n', '\\n')
        ts_code += f'    explanation: "{explanation_escaped}",\n'
        ts_code += f'    time_complexity: "{solution["time_complexity"]}",\n'
        ts_code += f'    space_complexity: "{solution["space_complexity"]}",\n'
        ts_code += f'    created_by: "{solution["created_by"]}",\n'
        ts_code += "    created_at: new Date(),\n"
        ts_code += "    updated_at: new Date()\n"
        ts_code += "  }"
        if i < len(backend_solutions) - 1:
            ts_code += ","
        ts_code += "\n"
    
    ts_code += "];\n"
    
    # Write to file
    with open("../backend/src/config/generated-solutions.ts", "w") as f:
        f.write(ts_code)
    
    print(f"✅ Created generated-solutions.ts with {len(backend_solutions)} solutions")

def main():
    """Main integration function"""
    print("🚀 Creating separate TypeScript files for generated content...")
    print("=" * 60)
    
    add_problems_to_backend()
    add_solutions_to_backend()
    
    print("\n✅ Integration files created!")
    print("📝 Manual steps needed:")
    print("   1. Import generatedProblems in database-mock.ts")
    print("   2. Merge with existing mockProblems array")
    print("   3. Import generatedSolutions if needed")
    print("   4. Restart backend server")

if __name__ == "__main__":
    main()
