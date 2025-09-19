#!/usr/bin/env python3
"""
ML Topics Manager
Command-line tool for managing ML/AI coding topics configuration
"""

import argparse
import json
from datetime import datetime
from ml_topics_config import MLTopicsConfig, TopicVersionControl

def list_topics(args):
    """List all available topics"""
    if args.category:
        topics = MLTopicsConfig.get_topics_by_category(args.category)
        print(f"\nTopics in '{args.category}' category:")
    elif args.company:
        topics = MLTopicsConfig.get_company_topics(args.company)
        print(f"\nTopics for '{args.company}' company:")
    elif args.difficulty:
        topics = MLTopicsConfig.get_topics_by_difficulty(args.difficulty)
        print(f"\nTopics with '{args.difficulty}' difficulty:")
    else:
        topics = MLTopicsConfig.get_all_topics()
        print(f"\nAll available topics ({len(topics)} total):")
    
    for i, topic in enumerate(topics, 1):
        metadata = MLTopicsConfig.get_topic_metadata(topic)
        if metadata:
            difficulty = ", ".join(metadata.get("difficulty_levels", []))
            companies = ", ".join(metadata.get("companies", []))
            print(f"{i:2d}. {topic}")
            print(f"    Difficulty: {difficulty}")
            print(f"    Companies: {companies}")
            print(f"    Time: {metadata.get('estimated_time', 'N/A')}")
        else:
            print(f"{i:2d}. {topic}")

def show_topic_info(args):
    """Show detailed information about a specific topic"""
    topic = args.topic
    metadata = MLTopicsConfig.get_topic_metadata(topic)
    
    if not metadata:
        print(f"Topic '{topic}' not found in configuration.")
        return
    
    print(f"\nDetailed information for '{topic}':")
    print("=" * 50)
    print(f"Difficulty levels: {', '.join(metadata.get('difficulty_levels', []))}")
    print(f"Companies: {', '.join(metadata.get('companies', []))}")
    print(f"Estimated time: {metadata.get('estimated_time', 'N/A')}")
    print(f"Prerequisites: {', '.join(metadata.get('prerequisites', []))}")
    print(f"Tags: {', '.join(metadata.get('tags', []))}")

def add_topic(args):
    """Add a new topic"""
    topic = args.topic
    category = args.category
    difficulty = args.difficulty.split(',') if args.difficulty else ['medium']
    companies = args.companies.split(',') if args.companies else []
    time = args.time or "45-60 minutes"
    prerequisites = args.prerequisites.split(',') if args.prerequisites else []
    tags = args.tags.split(',') if args.tags else []
    
    metadata = {
        "difficulty_levels": difficulty,
        "companies": companies,
        "estimated_time": time,
        "prerequisites": prerequisites,
        "tags": tags
    }
    
    # Create backup before changes
    backup_file = TopicVersionControl.backup_config()
    print(f"Backup created: {backup_file}")
    
    # Add the topic
    MLTopicsConfig.add_topic(topic, category, metadata)
    
    # Update company preferences
    for company in companies:
        if company not in MLTopicsConfig.COMPANY_TOPIC_PREFERENCES:
            MLTopicsConfig.COMPANY_TOPIC_PREFERENCES[company] = []
        if topic not in MLTopicsConfig.COMPANY_TOPIC_PREFERENCES[company]:
            MLTopicsConfig.COMPANY_TOPIC_PREFERENCES[company].append(topic)
    
    print(f"Successfully added topic '{topic}' to category '{category}'")
    
    # Update changelog
    changelog_entry = TopicVersionControl.create_changelog_entry(
        "add", topic, {"category": category, "metadata": metadata}
    )
    print(f"Changelog entry: {changelog_entry}")

def remove_topic(args):
    """Remove a topic"""
    topic = args.topic
    
    # Create backup before changes
    backup_file = TopicVersionControl.backup_config()
    print(f"Backup created: {backup_file}")
    
    # Remove the topic
    MLTopicsConfig.remove_topic(topic)
    
    print(f"Successfully removed topic '{topic}'")
    
    # Update changelog
    changelog_entry = TopicVersionControl.create_changelog_entry("remove", topic)
    print(f"Changelog entry: {changelog_entry}")

def export_config(args):
    """Export configuration to JSON file"""
    filepath = args.file or f"ml_topics_config_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    MLTopicsConfig.export_to_json(filepath)
    print(f"Configuration exported to: {filepath}")

def show_categories(args):
    """Show all available categories"""
    print("\nAvailable categories:")
    print("=" * 30)
    for category, topics in MLTopicsConfig.TOPICS_BY_CATEGORY.items():
        print(f"{category}: {len(topics)} topics")

def show_companies(args):
    """Show all supported companies"""
    print("\nSupported companies:")
    print("=" * 30)
    for company, topics in MLTopicsConfig.COMPANY_TOPIC_PREFERENCES.items():
        print(f"{company}: {len(topics)} preferred topics")

def main():
    parser = argparse.ArgumentParser(description="ML Topics Manager")
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # List topics command
    list_parser = subparsers.add_parser('list', help='List topics')
    list_parser.add_argument('--category', help='Filter by category')
    list_parser.add_argument('--company', help='Filter by company')
    list_parser.add_argument('--difficulty', help='Filter by difficulty')
    list_parser.set_defaults(func=list_topics)
    
    # Show topic info command
    info_parser = subparsers.add_parser('info', help='Show topic information')
    info_parser.add_argument('topic', help='Topic name')
    info_parser.set_defaults(func=show_topic_info)
    
    # Add topic command
    add_parser = subparsers.add_parser('add', help='Add new topic')
    add_parser.add_argument('topic', help='Topic name')
    add_parser.add_argument('category', help='Category name')
    add_parser.add_argument('--difficulty', help='Difficulty levels (comma-separated)')
    add_parser.add_argument('--companies', help='Companies (comma-separated)')
    add_parser.add_argument('--time', help='Estimated time')
    add_parser.add_argument('--prerequisites', help='Prerequisites (comma-separated)')
    add_parser.add_argument('--tags', help='Tags (comma-separated)')
    add_parser.set_defaults(func=add_topic)
    
    # Remove topic command
    remove_parser = subparsers.add_parser('remove', help='Remove topic')
    remove_parser.add_argument('topic', help='Topic name')
    remove_parser.set_defaults(func=remove_topic)
    
    # Export command
    export_parser = subparsers.add_parser('export', help='Export configuration')
    export_parser.add_argument('--file', help='Output file path')
    export_parser.set_defaults(func=export_config)
    
    # Show categories command
    categories_parser = subparsers.add_parser('categories', help='Show categories')
    categories_parser.set_defaults(func=show_categories)
    
    # Show companies command
    companies_parser = subparsers.add_parser('companies', help='Show companies')
    companies_parser.set_defaults(func=show_companies)
    
    args = parser.parse_args()
    
    if args.command:
        args.func(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
