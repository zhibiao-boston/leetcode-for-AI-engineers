#!/usr/bin/env python3
"""
Main execution script for ML/AI Problem Generation System
"""

import argparse
import sys
import os
from ml_problem_generator import MLProblemGenerator
from config.ml_topics_config import MLTopicsConfig

def list_topics(args):
    """List available LLM implementation topics"""
    config = MLTopicsConfig()
    
    if args.category:
        topics = config.get_topics_by_category(args.category)
        print(f"\n📚 Topics in '{args.category}' category:")
    elif args.company:
        topics = config.get_company_topics(args.company)
        print(f"\n🏢 Topics for '{args.company}' company:")
    elif args.difficulty:
        topics = config.get_topics_by_difficulty(args.difficulty)
        print(f"\n⚡ Topics with '{args.difficulty}' difficulty:")
    else:
        topics = config.get_all_topics()
        print(f"\n📚 All available LLM implementation topics ({len(topics)} total):")
    
    for i, topic in enumerate(topics, 1):
        metadata = config.get_topic_metadata(topic)
        if metadata:
            difficulty = ", ".join(metadata.get("difficulty_levels", []))
            companies = ", ".join(metadata.get("companies", []))
            time_est = metadata.get("estimated_time", "N/A")
            print(f"{i:2d}. {topic}")
            print(f"    Difficulty: {difficulty}")
            print(f"    Companies: {companies}")
            print(f"    Time: {time_est}")
        else:
            print(f"{i:2d}. {topic}")

def generate_problem(args):
    """Generate a problem for a specific topic"""
    generator = MLProblemGenerator()
    
    # Validate topic exists
    all_topics = generator.topics_config.get_all_topics()
    if args.topic not in all_topics:
        print(f"❌ Error: Topic '{args.topic}' not found.")
        print(f"Available topics: {', '.join(all_topics[:10])}...")
        return
    
    print(f"🚀 Generating problem for: {args.topic}")
    print("=" * 60)
    
    # Generate problem
    problem = generator.generate_problem(args.topic)
    
    # Generate solutions
    full_solution = generator.generate_full_solution(problem)
    practice_solution = generator.generate_practice_solution(problem)
    
    # Integrate to database
    generator.integrate_to_database(problem, full_solution, practice_solution)
    
    print(f"\n✅ Successfully generated problem: {problem['title']}")

def generate_batch(args):
    """Generate problems for multiple topics"""
    generator = MLProblemGenerator()
    
    if args.topics:
        topics = [t.strip() for t in args.topics.split(',')]
    elif args.category:
        topics = generator.topics_config.get_topics_by_category(args.category)
    elif args.company:
        topics = generator.topics_config.get_company_topics(args.company)
    else:
        print("❌ Error: Please specify topics, category, or company")
        return
    
    print(f"🚀 Generating problems for {len(topics)} topics...")
    print("=" * 60)
    
    for i, topic in enumerate(topics, 1):
        print(f"\n📝 [{i}/{len(topics)}] Generating problem for: {topic}")
        print("-" * 40)
        
        try:
            problem = generator.generate_problem(topic)
            full_solution = generator.generate_full_solution(problem)
            practice_solution = generator.generate_practice_solution(problem)
            generator.integrate_to_database(problem, full_solution, practice_solution)
            print(f"✅ Completed: {problem['title']}")
        except Exception as e:
            print(f"❌ Error generating problem for {topic}: {e}")
    
    print(f"\n🎉 Batch generation completed! Processed {len(topics)} topics.")

def show_categories(args):
    """Show all available categories"""
    config = MLTopicsConfig()
    print("\n📂 Available LLM Implementation Categories:")
    print("=" * 50)
    
    for category, topics in config.TOPICS_BY_CATEGORY.items():
        print(f"{category.replace('_', ' ').title()}: {len(topics)} topics")
        for topic in topics[:3]:  # Show first 3 topics
            print(f"  - {topic}")
        if len(topics) > 3:
            print(f"  ... and {len(topics) - 3} more")

def show_companies(args):
    """Show all supported companies"""
    config = MLTopicsConfig()
    print("\n🏢 Supported Companies:")
    print("=" * 30)
    
    for company, topics in config.COMPANY_TOPIC_PREFERENCES.items():
        print(f"{company}: {len(topics)} preferred topics")

def interactive_mode(args):
    """Interactive mode for problem generation"""
    generator = MLProblemGenerator()
    config = MLTopicsConfig()
    
    print("🎯 Interactive LLM Problem Generation")
    print("=" * 40)
    
    while True:
        print("\n📋 Available options:")
        print("1. List topics by category")
        print("2. List topics by company")
        print("3. Generate problem for specific topic")
        print("4. Show topic details")
        print("5. Exit")
        
        choice = input("\nEnter your choice (1-5): ").strip()
        
        if choice == "1":
            print("\n📂 Available categories:")
            for i, category in enumerate(config.TOPICS_BY_CATEGORY.keys(), 1):
                print(f"{i}. {category.replace('_', ' ').title()}")
            
            cat_choice = input("\nEnter category number: ").strip()
            try:
                cat_index = int(cat_choice) - 1
                categories = list(config.TOPICS_BY_CATEGORY.keys())
                if 0 <= cat_index < len(categories):
                    category = categories[cat_index]
                    topics = config.get_topics_by_category(category)
                    print(f"\nTopics in {category}:")
                    for topic in topics:
                        print(f"  - {topic}")
                else:
                    print("❌ Invalid category number")
            except ValueError:
                print("❌ Please enter a valid number")
        
        elif choice == "2":
            print("\n🏢 Available companies:")
            for i, company in enumerate(config.COMPANY_TOPIC_PREFERENCES.keys(), 1):
                print(f"{i}. {company}")
            
            comp_choice = input("\nEnter company number: ").strip()
            try:
                comp_index = int(comp_choice) - 1
                companies = list(config.COMPANY_TOPIC_PREFERENCES.keys())
                if 0 <= comp_index < len(companies):
                    company = companies[comp_index]
                    topics = config.get_company_topics(company)
                    print(f"\nTopics for {company}:")
                    for topic in topics:
                        print(f"  - {topic}")
                else:
                    print("❌ Invalid company number")
            except ValueError:
                print("❌ Please enter a valid number")
        
        elif choice == "3":
            topic = input("\nEnter topic name: ").strip()
            if topic in config.get_all_topics():
                print(f"\n🚀 Generating problem for: {topic}")
                problem = generator.generate_problem(topic)
                print(f"✅ Generated: {problem['title']}")
            else:
                print(f"❌ Topic '{topic}' not found")
        
        elif choice == "4":
            topic = input("\nEnter topic name: ").strip()
            metadata = config.get_topic_metadata(topic)
            if metadata:
                print(f"\n📊 Details for '{topic}':")
                print(f"  Difficulty: {', '.join(metadata.get('difficulty_levels', []))}")
                print(f"  Companies: {', '.join(metadata.get('companies', []))}")
                print(f"  Time: {metadata.get('estimated_time', 'N/A')}")
                print(f"  Prerequisites: {', '.join(metadata.get('prerequisites', []))}")
                print(f"  Tags: {', '.join(metadata.get('tags', []))}")
            else:
                print(f"❌ Topic '{topic}' not found")
        
        elif choice == "5":
            print("👋 Goodbye!")
            break
        
        else:
            print("❌ Invalid choice. Please enter 1-5.")

def main():
    parser = argparse.ArgumentParser(description="ML/AI Problem Generation System")
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # List topics command
    list_parser = subparsers.add_parser('list', help='List available topics')
    list_parser.add_argument('--category', help='Filter by category')
    list_parser.add_argument('--company', help='Filter by company')
    list_parser.add_argument('--difficulty', help='Filter by difficulty')
    list_parser.set_defaults(func=list_topics)
    
    # Generate problem command
    generate_parser = subparsers.add_parser('generate', help='Generate problem for specific topic')
    generate_parser.add_argument('topic', help='Topic name')
    generate_parser.set_defaults(func=generate_problem)
    
    # Generate batch command
    batch_parser = subparsers.add_parser('batch', help='Generate problems for multiple topics')
    batch_parser.add_argument('--topics', help='Comma-separated list of topics')
    batch_parser.add_argument('--category', help='Generate for all topics in category')
    batch_parser.add_argument('--company', help='Generate for all topics for company')
    batch_parser.set_defaults(func=generate_batch)
    
    # Show categories command
    categories_parser = subparsers.add_parser('categories', help='Show all categories')
    categories_parser.set_defaults(func=show_categories)
    
    # Show companies command
    companies_parser = subparsers.add_parser('companies', help='Show all companies')
    companies_parser.set_defaults(func=show_companies)
    
    # Interactive mode command
    interactive_parser = subparsers.add_parser('interactive', help='Interactive mode')
    interactive_parser.set_defaults(func=interactive_mode)
    
    args = parser.parse_args()
    
    if args.command:
        args.func(args)
    else:
        # Default: show help and run interactive mode
        parser.print_help()
        print("\n" + "=" * 50)
        interactive_mode(args)

if __name__ == "__main__":
    main()
