export interface AdminSolution {
  id: string;
  problem_id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  complexity?: string;
  explanation?: string;
  time_complexity?: string;
  space_complexity?: string;
  created_by?: string;
  created_by_name?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAdminSolutionData {
  problem_id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  complexity?: string;
  explanation?: string;
  time_complexity?: string;
  space_complexity?: string;
  created_by?: string;
}

export interface UpdateAdminSolutionData {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  complexity?: string;
  explanation?: string;
  time_complexity?: string;
  space_complexity?: string;
}

export class AdminSolutionModel {
  // Mock data storage (replace with actual database calls)
  private static solutions: AdminSolution[] = [
    {
      id: '1',
      problem_id: '1',
      title: 'Basic Implementation',
      description: 'A simple dictionary-based implementation',
      code: `class Database:
    def __init__(self):
        self.data = {}
    
    def insert(self, key, value):
        self.data[key] = value
    
    def remove(self, key):
        if key in self.data:
            del self.data[key]
            return True
        return False
    
    def retrieve(self, key):
        return self.data.get(key, None)`,
      language: 'python',
      complexity: 'O(1)',
      explanation: 'This solution uses a simple dictionary to store key-value pairs. Insert and retrieve operations are O(1), while remove is O(1) on average.',
      time_complexity: 'O(1)',
      space_complexity: 'O(n)',
      created_by: '1',
      created_by_name: 'Admin User',
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  static async findAll(): Promise<AdminSolution[]> {
    return this.solutions;
  }

  static async findById(id: string): Promise<AdminSolution | null> {
    return this.solutions.find(solution => solution.id === id) || null;
  }

  static async findByProblemId(problemId: string): Promise<AdminSolution[]> {
    return this.solutions.filter(solution => solution.problem_id === problemId);
  }

  static async create(data: CreateAdminSolutionData): Promise<AdminSolution> {
    const newSolution: AdminSolution = {
      id: (this.solutions.length + 1).toString(),
      ...data,
      created_by_name: 'Admin User', // This would come from user lookup in real implementation
      created_at: new Date(),
      updated_at: new Date()
    };

    this.solutions.push(newSolution);
    return newSolution;
  }

  static async update(id: string, data: UpdateAdminSolutionData): Promise<AdminSolution | null> {
    const solutionIndex = this.solutions.findIndex(solution => solution.id === id);
    
    if (solutionIndex === -1) {
      return null;
    }

    this.solutions[solutionIndex] = {
      ...this.solutions[solutionIndex],
      ...data,
      updated_at: new Date()
    };

    return this.solutions[solutionIndex];
  }

  static async delete(id: string): Promise<boolean> {
    const solutionIndex = this.solutions.findIndex(solution => solution.id === id);
    
    if (solutionIndex === -1) {
      return false;
    }

    this.solutions.splice(solutionIndex, 1);
    return true;
  }
}
