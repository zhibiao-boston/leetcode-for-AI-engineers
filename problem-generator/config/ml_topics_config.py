"""
ML/AI Coding Topics Configuration
This file contains all available LLM coding topics for problem generation.
Version: 1.0.0
Last Updated: 2024-01-15
"""

from typing import List, Dict, Optional
from datetime import datetime
import json

class MLTopicsConfig:
    """
    Configuration class for ML/AI coding topics
    Supports version control and incremental updates
    """
    
    VERSION = "1.0.0"
    LAST_UPDATED = "2024-01-15"
    
    # Core LLM Implementation Topics organized by category
    TOPICS_BY_CATEGORY = {
        "attention_mechanisms": [
            "self-attention",
            "multi-head attention",
            "scaled dot-product attention",
            "attention weights computation",
            "attention visualization",
            "causal attention",
            "cross-attention",
            "attention patterns"
        ],
        
        "transformer_architecture": [
            "transformer block",
            "layer normalization",
            "positional encoding",
            "feed-forward network",
            "residual connections",
            "transformer decoder",
            "transformer encoder",
            "transformer variants"
        ],
        
        "tokenization": [
            "tokenizer implementation",
            "byte-pair encoding",
            "wordpiece tokenization",
            "subword tokenization",
            "vocabulary building",
            "token counting",
            "special tokens",
            "tokenization optimization"
        ],
        
        "inference_optimization": [
            "kv-cache",
            "greedy search",
            "beam search",
            "top-k sampling",
            "top-p sampling",
            "temperature scaling",
            "inference batching",
            "memory optimization"
        ],
        
        "language_modeling": [
            "next-token prediction",
            "language model training",
            "perplexity calculation",
            "cross-entropy loss",
            "teacher forcing",
            "autoregressive generation",
            "sequence modeling",
            "context window"
        ],
        
        "neural_networks": [
            "two-layer MLP",
            "multi-layer perceptron",
            "activation functions",
            "weight initialization",
            "gradient computation",
            "backpropagation",
            "neural network training",
            "parameter optimization"
        ]
    }
    
    # Topic metadata for each LLM implementation topic
    TOPIC_METADATA = {
        "self-attention": {
            "difficulty_levels": ["medium", "hard"],
            "companies": ["OpenAI", "Anthropic", "Google", "Meta"],
            "estimated_time": "45-75 minutes",
            "prerequisites": ["linear algebra", "python", "numpy"],
            "tags": ["attention", "transformer", "implementation"]
        },
        
        "kv-cache": {
            "difficulty_levels": ["medium", "hard"],
            "companies": ["OpenAI", "Anthropic", "Google"],
            "estimated_time": "45-60 minutes",
            "prerequisites": ["attention mechanisms", "memory optimization"],
            "tags": ["inference", "optimization", "memory"]
        },
        
        "greedy search": {
            "difficulty_levels": ["easy", "medium"],
            "companies": ["OpenAI", "Anthropic", "Google"],
            "estimated_time": "30-45 minutes",
            "prerequisites": ["language modeling", "generation"],
            "tags": ["generation", "search", "decoding"]
        },
        
        "tokenizer implementation": {
            "difficulty_levels": ["medium", "hard"],
            "companies": ["OpenAI", "Anthropic", "Google"],
            "estimated_time": "45-75 minutes",
            "prerequisites": ["text processing", "algorithms"],
            "tags": ["tokenization", "text processing", "vocabulary"]
        },
        
        "two-layer MLP": {
            "difficulty_levels": ["easy", "medium"],
            "companies": ["OpenAI", "Google", "Meta"],
            "estimated_time": "30-45 minutes",
            "prerequisites": ["neural networks", "linear algebra"],
            "tags": ["neural networks", "mlp", "feed-forward"]
        },
        
        "multi-head attention": {
            "difficulty_levels": ["hard"],
            "companies": ["OpenAI", "Anthropic", "Google"],
            "estimated_time": "60-90 minutes",
            "prerequisites": ["self-attention", "linear algebra"],
            "tags": ["attention", "multi-head", "transformer"]
        },
        
        "scaled dot-product attention": {
            "difficulty_levels": ["medium", "hard"],
            "companies": ["OpenAI", "Anthropic", "Google"],
            "estimated_time": "45-60 minutes",
            "prerequisites": ["attention mechanisms", "linear algebra"],
            "tags": ["attention", "scaling", "dot-product"]
        },
        
        "byte-pair encoding": {
            "difficulty_levels": ["medium", "hard"],
            "companies": ["OpenAI", "Google"],
            "estimated_time": "45-75 minutes",
            "prerequisites": ["tokenization", "algorithms"],
            "tags": ["tokenization", "bpe", "subword"]
        },
        
        "beam search": {
            "difficulty_levels": ["medium", "hard"],
            "companies": ["OpenAI", "Anthropic", "Google"],
            "estimated_time": "45-75 minutes",
            "prerequisites": ["generation", "search algorithms"],
            "tags": ["generation", "beam search", "decoding"]
        },
        
        "positional encoding": {
            "difficulty_levels": ["medium"],
            "companies": ["OpenAI", "Google", "Meta"],
            "estimated_time": "30-45 minutes",
            "prerequisites": ["transformer", "positional information"],
            "tags": ["positional encoding", "transformer", "position"]
        },
        
        "layer normalization": {
            "difficulty_levels": ["medium"],
            "companies": ["OpenAI", "Google", "Meta"],
            "estimated_time": "30-45 minutes",
            "prerequisites": ["neural networks", "normalization"],
            "tags": ["normalization", "layer norm", "transformer"]
        },
        
        "next-token prediction": {
            "difficulty_levels": ["easy", "medium"],
            "companies": ["OpenAI", "Anthropic", "Google"],
            "estimated_time": "30-45 minutes",
            "prerequisites": ["language modeling", "probability"],
            "tags": ["language modeling", "prediction", "next token"]
        }
    }
    
    # Company-specific LLM implementation topic preferences
    COMPANY_TOPIC_PREFERENCES = {
        "OpenAI": ["self-attention", "kv-cache", "greedy search", "tokenizer implementation", "multi-head attention"],
        "Anthropic": ["self-attention", "scaled dot-product attention", "layer normalization", "next-token prediction"],
        "Google": ["transformer architecture", "positional encoding", "attention mechanisms", "neural networks"],
        "Microsoft": ["attention mechanisms", "inference optimization", "language modeling", "neural networks"],
        "Meta": ["attention mechanisms", "transformer architecture", "neural networks", "inference optimization"],
        "DeepMind": ["attention mechanisms", "neural networks", "optimization", "advanced architectures"],
        "Amazon": ["inference optimization", "neural networks", "attention mechanisms"],
        "NVIDIA": ["inference optimization", "attention mechanisms", "neural networks", "performance"]
    }
    
    @classmethod
    def get_all_topics(cls) -> List[str]:
        """Get all available topics as a flat list"""
        all_topics = []
        for category_topics in cls.TOPICS_BY_CATEGORY.values():
            all_topics.extend(category_topics)
        return sorted(list(set(all_topics)))
    
    @classmethod
    def get_topics_by_category(cls, category: str) -> List[str]:
        """Get topics for a specific category"""
        return cls.TOPICS_BY_CATEGORY.get(category, [])
    
    @classmethod
    def get_topic_metadata(cls, topic: str) -> Dict:
        """Get metadata for a specific topic"""
        return cls.TOPIC_METADATA.get(topic, {})
    
    @classmethod
    def get_company_topics(cls, company: str) -> List[str]:
        """Get preferred topics for a specific company"""
        return cls.COMPANY_TOPIC_PREFERENCES.get(company, [])
    
    @classmethod
    def get_topics_by_difficulty(cls, difficulty: str) -> List[str]:
        """Get topics that support a specific difficulty level"""
        topics = []
        for topic, metadata in cls.TOPIC_METADATA.items():
            if difficulty in metadata.get("difficulty_levels", []):
                topics.append(topic)
        return topics
    
    @classmethod
    def add_topic(cls, topic: str, category: str, metadata: Dict = None):
        """Add a new topic (for incremental updates)"""
        if category not in cls.TOPICS_BY_CATEGORY:
            cls.TOPICS_BY_CATEGORY[category] = []
        
        if topic not in cls.TOPICS_BY_CATEGORY[category]:
            cls.TOPICS_BY_CATEGORY[category].append(topic)
        
        if metadata:
            cls.TOPIC_METADATA[topic] = metadata
    
    @classmethod
    def remove_topic(cls, topic: str):
        """Remove a topic from all categories"""
        for category_topics in cls.TOPICS_BY_CATEGORY.values():
            if topic in category_topics:
                category_topics.remove(topic)
        
        if topic in cls.TOPIC_METADATA:
            del cls.TOPIC_METADATA[topic]
    
    @classmethod
    def export_to_json(cls, filepath: str):
        """Export current configuration to JSON file"""
        config_data = {
            "version": cls.VERSION,
            "last_updated": cls.LAST_UPDATED,
            "topics_by_category": cls.TOPICS_BY_CATEGORY,
            "topic_metadata": cls.TOPIC_METADATA,
            "company_topic_preferences": cls.COMPANY_TOPIC_PREFERENCES
        }
        
        with open(filepath, 'w') as f:
            json.dump(config_data, f, indent=2)
    
    @classmethod
    def load_from_json(cls, filepath: str):
        """Load configuration from JSON file"""
        with open(filepath, 'r') as f:
            config_data = json.load(f)
        
        cls.VERSION = config_data.get("version", cls.VERSION)
        cls.LAST_UPDATED = config_data.get("last_updated", cls.LAST_UPDATED)
        cls.TOPICS_BY_CATEGORY = config_data.get("topics_by_category", cls.TOPICS_BY_CATEGORY)
        cls.TOPIC_METADATA = config_data.get("topic_metadata", cls.TOPIC_METADATA)
        cls.COMPANY_TOPIC_PREFERENCES = config_data.get("company_topic_preferences", cls.COMPANY_TOPIC_PREFERENCES)

# Convenience functions for easy access
def get_all_ml_topics() -> List[str]:
    """Get all available ML/AI coding topics"""
    return MLTopicsConfig.get_all_topics()

def get_topics_by_category(category: str) -> List[str]:
    """Get topics for a specific category"""
    return MLTopicsConfig.get_topics_by_category(category)

def get_topic_info(topic: str) -> Dict:
    """Get detailed information about a specific topic"""
    return MLTopicsConfig.get_topic_metadata(topic)

def get_company_topics(company: str) -> List[str]:
    """Get preferred topics for a specific company"""
    return MLTopicsConfig.get_company_topics(company)

# Version control utilities
class TopicVersionControl:
    """Version control for topic configuration changes"""
    
    @staticmethod
    def create_changelog_entry(action: str, topic: str, details: Dict = None):
        """Create a changelog entry for topic modifications"""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "action": action,  # "add", "remove", "modify"
            "topic": topic,
            "details": details or {}
        }
        return entry
    
    @staticmethod
    def backup_config(backup_dir: str = "problem-generator/backups"):
        """Create a backup of current configuration"""
        import os
        import shutil
        
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = f"{backup_dir}/ml_topics_config_v{MLTopicsConfig.VERSION}_{timestamp}.py"
        
        shutil.copy2(__file__, backup_file)
        return backup_file

if __name__ == "__main__":
    # Example usage and testing
    print("Available ML/AI Topics:")
    print("=" * 50)
    
    for category, topics in MLTopicsConfig.TOPICS_BY_CATEGORY.items():
        print(f"\n{category.upper().replace('_', ' ')}:")
        for topic in topics:
            metadata = MLTopicsConfig.get_topic_metadata(topic)
            difficulty = ", ".join(metadata.get("difficulty_levels", []))
            print(f"  - {topic} ({difficulty})")
    
    print(f"\nTotal topics: {len(MLTopicsConfig.get_all_topics())}")
    print(f"Configuration version: {MLTopicsConfig.VERSION}")
    print(f"Last updated: {MLTopicsConfig.LAST_UPDATED}")
