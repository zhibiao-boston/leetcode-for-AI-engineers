#!/usr/bin/env python3
"""
Viewer for Generated Problems and Solutions
Provides a command-line interface to view and browse generated content
"""

import argparse
import json
from data_manager import DataManager
from config.ml_topics_config import MLTopicsConfig

class ProblemViewer:
    """Viewer for generated problems and solutions"""
    
    def __init__(self):
        self.data_manager = DataManager()
        self.topics_config = MLTopicsConfig()
    
    def list_problems(self, args):
        """List all generated problems"""
        problems = self.data_manager.get_all_problems()
        
        if not problems:
            print("📝 No generated problems found.")
            print("Run 'python main.py generate <topic>' to generate problems.")
            return
        
        print(f"📚 Generated Problems ({len(problems)} total):")
        print("=" * 60)
        
        for i, problem in enumerate(problems, 1):
            print(f"{i:2d}. {problem.get('title', 'Untitled')}")
            print(f"    Topic: {problem.get('topic', 'Unknown')}")
            print(f"    Difficulty: {problem.get('difficulty', 'Unknown')}")
            print(f"    Company: {problem.get('company', 'Unknown')}")
            print(f"    Status: {problem.get('status', 'Unknown')}")
            print(f"    Generated: {problem.get('generated_at', 'Unknown')}")
            print()
    
    def show_problem(self, args):
        """Show detailed information about a specific problem"""
        problem_id = args.problem_id
        problem = self.data_manager.get_problem(problem_id)
        
        if not problem:
            print(f"❌ Problem with ID '{problem_id}' not found.")
            return
        
        print(f"📋 Problem Details: {problem.get('title', 'Untitled')}")
        print("=" * 60)
        print(f"ID: {problem.get('id')}")
        print(f"Topic: {problem.get('topic', 'Unknown')}")
        print(f"Difficulty: {problem.get('difficulty', 'Unknown')}")
        print(f"Company: {problem.get('company', 'Unknown')}")
        print(f"Categories: {', '.join(problem.get('categories', []))}")
        print(f"Tags: {', '.join(problem.get('tags', []))}")
        print(f"Status: {problem.get('status', 'Unknown')}")
        print(f"Generated: {problem.get('generated_at', 'Unknown')}")
        print()
        
        print("Description:")
        print("-" * 20)
        print(problem.get('description', 'No description available'))
        print()
        
        # Show examples if available
        examples = problem.get('examples', [])
        if examples:
            print("Examples:")
            print("-" * 20)
            for i, example in enumerate(examples, 1):
                print(f"Example {i}:")
                print(f"  Input: {example.get('input', 'N/A')}")
                print(f"  Output: {example.get('output', 'N/A')}")
                print(f"  Explanation: {example.get('explanation', 'N/A')}")
                print()
        
        # Show constraints if available
        constraints = problem.get('constraints', [])
        if constraints:
            print("Constraints:")
            print("-" * 20)
            for constraint in constraints:
                print(f"  • {constraint}")
            print()
        
        # Show solutions
        solutions = self.data_manager.get_solutions_for_problem(problem_id)
        if solutions:
            print(f"Solutions ({len(solutions)} total):")
            print("-" * 20)
            for i, solution in enumerate(solutions, 1):
                print(f"{i}. {solution.get('title', 'Untitled Solution')}")
                print(f"   Type: {solution.get('type', 'Unknown')}")
                print(f"   Status: {solution.get('status', 'Unknown')}")
                print(f"   Generated: {solution.get('generated_at', 'Unknown')}")
                print()
        else:
            print("No solutions generated yet.")
    
    def show_solution(self, args):
        """Show detailed information about a specific solution"""
        solution_id = args.solution_id
        solutions = self.data_manager.get_all_solutions()
        
        solution = None
        for sol in solutions:
            if sol.get('id') == solution_id:
                solution = sol
                break
        
        if not solution:
            print(f"❌ Solution with ID '{solution_id}' not found.")
            return
        
        print(f"💻 Solution Details: {solution.get('title', 'Untitled')}")
        print("=" * 60)
        print(f"ID: {solution.get('id')}")
        print(f"Problem ID: {solution.get('problem_id')}")
        print(f"Type: {solution.get('type', 'Unknown')}")
        print(f"Status: {solution.get('status', 'Unknown')}")
        print(f"Generated: {solution.get('generated_at', 'Unknown')}")
        print()
        
        # Show code if available
        code = solution.get('code')
        if code:
            print("Python Code:")
            print("-" * 20)
            print(code)
            print()
        
        # Show explanation if available
        explanation = solution.get('explanation')
        if explanation:
            print("Explanation:")
            print("-" * 20)
            print(explanation)
            print()
        
        # Show complexity analysis if available
        time_complexity = solution.get('time_complexity')
        space_complexity = solution.get('space_complexity')
        if time_complexity or space_complexity:
            print("Complexity Analysis:")
            print("-" * 20)
            if time_complexity:
                print(f"Time Complexity: {time_complexity}")
            if space_complexity:
                print(f"Space Complexity: {space_complexity}")
            print()
        
        # Show key concepts if available
        key_concepts = solution.get('key_concepts', [])
        if key_concepts:
            print("Key Concepts:")
            print("-" * 20)
            for concept in key_concepts:
                print(f"  • {concept}")
            print()
    
    def filter_problems(self, args):
        """Filter problems by various criteria"""
        problems = self.data_manager.get_all_problems()
        
        if args.topic:
            problems = self.data_manager.get_problems_by_topic(args.topic)
        elif args.company:
            problems = self.data_manager.get_problems_by_company(args.company)
        elif args.difficulty:
            problems = self.data_manager.get_problems_by_difficulty(args.difficulty)
        
        if not problems:
            print("📝 No problems found matching the criteria.")
            return
        
        print(f"📚 Filtered Problems ({len(problems)} found):")
        print("=" * 60)
        
        for i, problem in enumerate(problems, 1):
            print(f"{i:2d}. {problem.get('title', 'Untitled')}")
            print(f"    Topic: {problem.get('topic', 'Unknown')}")
            print(f"    Difficulty: {problem.get('difficulty', 'Unknown')}")
            print(f"    Company: {problem.get('company', 'Unknown')}")
            print(f"    Status: {problem.get('status', 'Unknown')}")
            print()
    
    def show_statistics(self, args):
        """Show generation statistics"""
        stats = self.data_manager.get_statistics()
        
        print("📊 Generation Statistics")
        print("=" * 40)
        print(f"Total Problems: {stats['total_problems']}")
        print(f"Total Solutions: {stats['total_solutions']}")
        print(f"Last Updated: {stats['last_updated']}")
        print()
        
        if stats['problems_by_difficulty']:
            print("Problems by Difficulty:")
            for difficulty, count in stats['problems_by_difficulty'].items():
                print(f"  {difficulty}: {count}")
            print()
        
        if stats['problems_by_company']:
            print("Problems by Company:")
            for company, count in stats['problems_by_company'].items():
                print(f"  {company}: {count}")
            print()
        
        if stats['generation_history']:
            print("Recent Generation History:")
            for entry in stats['generation_history'][-5:]:  # Last 5 entries
                print(f"  {entry['timestamp']}: {entry['action']} ({entry['item_id'][:8]}...)")
    
    def export_data(self, args):
        """Export all data to a file"""
        export_file = self.data_manager.export_data(args.file)
        print(f"✅ Data exported to: {export_file}")
    
    def interactive_browse(self, args):
        """Interactive browsing mode"""
        problems = self.data_manager.get_all_problems()
        
        if not problems:
            print("📝 No generated problems found.")
            print("Run 'python main.py generate <topic>' to generate problems.")
            return
        
        while True:
            print("\n📚 Browse Generated Problems")
            print("=" * 40)
            
            for i, problem in enumerate(problems, 1):
                print(f"{i:2d}. {problem.get('title', 'Untitled')} ({problem.get('difficulty', 'Unknown')})")
            
            print(f"{len(problems) + 1:2d}. Show statistics")
            print(f"{len(problems) + 2:2d}. Export data")
            print(f"{len(problems) + 3:2d}. Exit")
            
            choice = input(f"\nSelect problem (1-{len(problems) + 3}): ").strip()
            
            try:
                choice_num = int(choice)
                if 1 <= choice_num <= len(problems):
                    # Show problem details
                    problem = problems[choice_num - 1]
                    self._show_problem_summary(problem)
                elif choice_num == len(problems) + 1:
                    self.show_statistics(None)
                elif choice_num == len(problems) + 2:
                    self.export_data(None)
                elif choice_num == len(problems) + 3:
                    print("👋 Goodbye!")
                    break
                else:
                    print("❌ Invalid choice.")
            except ValueError:
                print("❌ Please enter a valid number.")
    
    def _show_problem_summary(self, problem):
        """Show a summary of a problem"""
        print(f"\n📋 {problem.get('title', 'Untitled')}")
        print("-" * 40)
        print(f"Topic: {problem.get('topic', 'Unknown')}")
        print(f"Difficulty: {problem.get('difficulty', 'Unknown')}")
        print(f"Company: {problem.get('company', 'Unknown')}")
        print(f"Status: {problem.get('status', 'Unknown')}")
        
        description = problem.get('description', 'No description available')
        if len(description) > 200:
            description = description[:200] + "..."
        print(f"Description: {description}")
        
        # Show function signature if available
        function_sig = problem.get('function_signature')
        if function_sig:
            print(f"Function: {function_sig}")
        
        # Show solutions
        solutions = self.data_manager.get_solutions_for_problem(problem['id'])
        if solutions:
            print(f"Solutions: {len(solutions)} available")
            for solution in solutions:
                solution_type = solution.get('type', 'unknown')
                print(f"  - {solution_type}: {solution.get('title', 'Untitled')}")
        else:
            print("Solutions: None generated yet")

def main():
    parser = argparse.ArgumentParser(description="View Generated Problems and Solutions")
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # List problems command
    list_parser = subparsers.add_parser('list', help='List all generated problems')
    list_parser.set_defaults(func=ProblemViewer().list_problems)
    
    # Show problem command
    show_parser = subparsers.add_parser('show', help='Show detailed problem information')
    show_parser.add_argument('problem_id', help='Problem ID')
    show_parser.set_defaults(func=ProblemViewer().show_problem)
    
    # Show solution command
    solution_parser = subparsers.add_parser('solution', help='Show detailed solution information')
    solution_parser.add_argument('solution_id', help='Solution ID')
    solution_parser.set_defaults(func=ProblemViewer().show_solution)
    
    # Filter problems command
    filter_parser = subparsers.add_parser('filter', help='Filter problems by criteria')
    filter_parser.add_argument('--topic', help='Filter by topic')
    filter_parser.add_argument('--company', help='Filter by company')
    filter_parser.add_argument('--difficulty', help='Filter by difficulty')
    filter_parser.set_defaults(func=ProblemViewer().filter_problems)
    
    # Statistics command
    stats_parser = subparsers.add_parser('stats', help='Show generation statistics')
    stats_parser.set_defaults(func=ProblemViewer().show_statistics)
    
    # Export command
    export_parser = subparsers.add_parser('export', help='Export all data')
    export_parser.add_argument('--file', help='Output file path')
    export_parser.set_defaults(func=ProblemViewer().export_data)
    
    # Interactive browse command
    browse_parser = subparsers.add_parser('browse', help='Interactive browsing mode')
    browse_parser.set_defaults(func=ProblemViewer().interactive_browse)
    
    args = parser.parse_args()
    
    if args.command:
        args.func(args)
    else:
        # Default: show help and run interactive mode
        parser.print_help()
        print("\n" + "=" * 50)
        ProblemViewer().interactive_browse(None)

if __name__ == "__main__":
    main()
