import React from 'react';

interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company: string;
  categories: string[];
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  solution_count?: number;
}

interface AdminSolution {
  id: string;
  problem_id: string;
  language: string;
  created_at: string;
}

interface AnalyticsTabProps {
  problems: Problem[];
  solutions: AdminSolution[];
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ problems, solutions }) => {
  // Calculate statistics
  const totalProblems = problems.length;
  const publishedProblems = problems.filter(p => p.status === 'published').length;
  const draftProblems = problems.filter(p => p.status === 'draft').length;
  const archivedProblems = problems.filter(p => p.status === 'archived').length;

  const difficultyStats = {
    easy: problems.filter(p => p.difficulty === 'easy').length,
    medium: problems.filter(p => p.difficulty === 'medium').length,
    hard: problems.filter(p => p.difficulty === 'hard').length
  };

  const categoryStats = problems.reduce((acc, problem) => {
    problem.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const companyStats = problems.reduce((acc, problem) => {
    if (problem.company) {
      acc[problem.company] = (acc[problem.company] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCompanies = Object.entries(companyStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // const languageStats = solutions.reduce((acc, solution) => {
  //   acc[solution.language] = (acc[solution.language] || 0) + 1;
  //   return acc;
  // }, {} as Record<string, number>);

  const totalSolutions = solutions.length;
  const problemsWithSolutions = problems.filter(p => (p.solution_count || 0) > 0).length;
  const problemsWithoutSolutions = totalProblems - problemsWithSolutions;

  const recentProblems = problems
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-600';
      case 'draft': return 'bg-yellow-600';
      case 'archived': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-3xl font-bold text-white mb-2">{totalProblems}</div>
          <div className="text-gray-400">Total Problems</div>
          <div className="text-sm text-gray-500 mt-1">
            {publishedProblems} published, {draftProblems} draft, {archivedProblems} archived
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-3xl font-bold text-green-400 mb-2">{totalSolutions}</div>
          <div className="text-gray-400">Total Solutions</div>
          <div className="text-sm text-gray-500 mt-1">
            Across {problemsWithSolutions} problems
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {problemsWithSolutions}
          </div>
          <div className="text-gray-400">Problems with Solutions</div>
          <div className="text-sm text-gray-500 mt-1">
            {Math.round((problemsWithSolutions / totalProblems) * 100)}% coverage
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {problemsWithoutSolutions}
          </div>
          <div className="text-gray-400">Problems without Solutions</div>
          <div className="text-sm text-gray-500 mt-1">
            Need attention
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Difficulty Distribution */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Difficulty Distribution</h3>
          <div className="space-y-4">
            {Object.entries(difficultyStats).map(([difficulty, count]) => (
              <div key={difficulty} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${getDifficultyColor(difficulty).replace('text-', 'bg-')}`}></div>
                  <span className="text-gray-300 capitalize">{difficulty}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white font-semibold mr-2">{count}</span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getDifficultyColor(difficulty).replace('text-', 'bg-')}`}
                      style={{ width: `${(count / totalProblems) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3 bg-green-600"></div>
                <span className="text-gray-300">Published</span>
              </div>
              <div className="flex items-center">
                <span className="text-white font-semibold mr-2">{publishedProblems}</span>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-600"
                    style={{ width: `${(publishedProblems / totalProblems) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3 bg-yellow-600"></div>
                <span className="text-gray-300">Draft</span>
              </div>
              <div className="flex items-center">
                <span className="text-white font-semibold mr-2">{draftProblems}</span>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-yellow-600"
                    style={{ width: `${(draftProblems / totalProblems) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3 bg-gray-600"></div>
                <span className="text-gray-300">Archived</span>
              </div>
              <div className="flex items-center">
                <span className="text-white font-semibold mr-2">{archivedProblems}</span>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gray-600"
                    style={{ width: `${(archivedProblems / totalProblems) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
          <div className="space-y-3">
            {topCategories.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-300">{category}</span>
                <div className="flex items-center">
                  <span className="text-white font-semibold mr-2">{count}</span>
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-purple-600"
                      style={{ width: `${(count / Math.max(...Object.values(categoryStats))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Companies</h3>
          <div className="space-y-3">
            {topCompanies.map(([company, count]) => (
              <div key={company} className="flex items-center justify-between">
                <span className="text-gray-300">{company}</span>
                <div className="flex items-center">
                  <span className="text-white font-semibold mr-2">{count}</span>
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${(count / Math.max(...Object.values(companyStats))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Problems */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Problems</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-400">Title</th>
                <th className="text-left py-2 text-gray-400">Difficulty</th>
                <th className="text-left py-2 text-gray-400">Status</th>
                <th className="text-left py-2 text-gray-400">Solutions</th>
                <th className="text-left py-2 text-gray-400">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentProblems.map((problem) => (
                <tr key={problem.id} className="border-b border-gray-700">
                  <td className="py-2 text-white">{problem.title}</td>
                  <td className={`py-2 ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(problem.status)}`}>
                      {problem.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300">{problem.solution_count || 0}</td>
                  <td className="py-2 text-gray-400 text-sm">
                    {new Date(problem.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
