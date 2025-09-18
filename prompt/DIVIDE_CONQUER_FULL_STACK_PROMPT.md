# DIVIDE & CONQUER FULL-STACK DEVELOPMENT PROMPT

## 🎯 **Project Vision**
Create a full-stack web application where:
- **Admins** can manage problems/solutions via API integration
- **Users** can signup/signin and work on coding problems
- **Problems/Solutions** are generated from external API
- **Scalable Architecture** supports future growth

## 🏗️ **Architecture Overview**

### **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   External API  │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Problem Gen) │
│                 │    │                 │    │                 │
│ • User Auth     │    │ • Auth Service  │    │ • Problem Data  │
│ • Problem UI    │    │ • Problem CRUD  │    │ • Solution Data │
│ • Solution UI   │    │ • Solution CRUD │    │ • Validation    │
│ • Admin Panel   │    │ • Admin API     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   File Storage  │
│   (PostgreSQL)  │    │   (AWS S3)      │
│                 │    │                 │
│ • Users         │    │ • Code Files    │
│ • Problems      │    │ • Images        │
│ • Solutions     │    │ • Assets        │
│ • Sessions      │    │                 │
└─────────────────┘    └─────────────────┘
```

## 📋 **Development Phases Breakdown**

### **Phase 1: Foundation & Authentication (Week 1-2)**

#### **1.1 Backend Foundation**
```typescript
// Project Structure
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── problem.controller.ts
│   │   └── solution.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── problem.service.ts
│   │   ├── solution.service.ts
│   │   └── external-api.service.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Problem.ts
│   │   └── Solution.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── problem.routes.ts
│   │   └── solution.routes.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── external-api.ts
│   └── utils/
│       ├── jwt.ts
│       ├── validation.ts
│       └── logger.ts
├── package.json
├── tsconfig.json
└── .env
```

#### **1.2 Database Schema**
```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);

-- Problems Table
CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255) UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    company VARCHAR(255),
    categories TEXT[],
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'draft',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);

-- Solutions Table
CREATE TABLE solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID REFERENCES problems(id),
    user_id UUID REFERENCES users(id),
    code TEXT NOT NULL,
    output TEXT,
    error TEXT,
    execution_time INTEGER,
    status VARCHAR(50) DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Solutions Table
CREATE TABLE admin_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID REFERENCES problems(id),
    code TEXT NOT NULL,
    explanation TEXT,
    time_complexity VARCHAR(100),
    space_complexity VARCHAR(100),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **1.3 Authentication System**
```typescript
// Auth Service Implementation
class AuthService {
  async register(userData: RegisterDto): Promise<User> {
    // Hash password, create user, send verification email
  }
  
  async login(credentials: LoginDto): Promise<AuthResponse> {
    // Validate credentials, generate JWT, update last login
  }
  
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Validate refresh token, generate new access token
  }
  
  async logout(userId: string): Promise<void> {
    // Invalidate tokens, clear session
  }
}

// JWT Middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Validate JWT token, attach user to request
};
```

### **Phase 2: External API Integration (Week 3)**

#### **2.1 External API Service**
```typescript
// External API Service
class ExternalApiService {
  private apiClient: AxiosInstance;
  
  async fetchProblems(params: ProblemFetchParams): Promise<ProblemData[]> {
    // Fetch problems from external API
    // Transform data to internal format
    // Handle rate limiting and errors
  }
  
  async fetchProblemDetails(problemId: string): Promise<ProblemDetails> {
    // Fetch detailed problem information
    // Include test cases and constraints
  }
  
  async fetchSolutions(problemId: string): Promise<SolutionData[]> {
    // Fetch official solutions
    // Include complexity analysis
  }
  
  async validateProblem(problemData: ProblemData): Promise<ValidationResult> {
    // Validate problem data quality
    // Check for required fields
  }
}

// API Configuration
const externalApiConfig = {
  baseURL: process.env.EXTERNAL_API_URL,
  apiKey: process.env.EXTERNAL_API_KEY,
  rateLimit: {
    requestsPerMinute: 100,
    burstLimit: 10
  },
  retryPolicy: {
    maxRetries: 3,
    backoffMultiplier: 2
  }
};
```

#### **2.2 Problem Synchronization**
```typescript
// Problem Sync Service
class ProblemSyncService {
  async syncProblems(): Promise<SyncResult> {
    // Fetch new problems from external API
    // Compare with existing problems
    // Create/update problems as needed
    // Handle conflicts and duplicates
  }
  
  async syncProblemDetails(problemId: string): Promise<void> {
    // Update problem with latest details
    // Sync test cases and constraints
  }
  
  async syncSolutions(problemId: string): Promise<void> {
    // Fetch and update official solutions
    // Validate solution quality
  }
}

// Scheduled Sync Job
const syncJob = cron.schedule('0 */6 * * *', async () => {
  // Run every 6 hours
  await problemSyncService.syncProblems();
});
```

### **Phase 3: Admin Panel Backend (Week 4)**

#### **3.1 Admin API Endpoints**
```typescript
// Admin Problem Management
@Controller('/admin/problems')
class AdminProblemController {
  @Post('/')
  async createProblem(@Body() data: CreateProblemDto): Promise<Problem> {
    // Create new problem
    // Validate admin permissions
    // Set created_by field
  }
  
  @Put('/:id')
  async updateProblem(@Param('id') id: string, @Body() data: UpdateProblemDto): Promise<Problem> {
    // Update existing problem
    // Validate ownership
    // Update timestamps
  }
  
  @Delete('/:id')
  async deleteProblem(@Param('id') id: string): Promise<void> {
    // Soft delete problem
    // Archive related data
  }
  
  @Post('/:id/publish')
  async publishProblem(@Param('id') id: string): Promise<Problem> {
    // Publish problem
    // Set published_at timestamp
    // Validate completeness
  }
  
  @Post('/sync')
  async syncFromExternalApi(): Promise<SyncResult> {
    // Trigger manual sync
    // Return sync statistics
  }
}

// Admin Solution Management
@Controller('/admin/solutions')
class AdminSolutionController {
  @Post('/')
  async createSolution(@Body() data: CreateSolutionDto): Promise<AdminSolution> {
    // Create official solution
    // Validate problem exists
    // Set complexity analysis
  }
  
  @Put('/:id')
  async updateSolution(@Param('id') id: string, @Body() data: UpdateSolutionDto): Promise<AdminSolution> {
    // Update solution
    // Validate ownership
  }
  
  @Delete('/:id')
  async deleteSolution(@Param('id') id: string): Promise<void> {
    // Delete solution
    // Update problem status
  }
}
```

#### **3.2 Admin Dashboard API**
```typescript
// Admin Dashboard Service
class AdminDashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    return {
      totalProblems: await this.countProblems(),
      publishedProblems: await this.countPublishedProblems(),
      totalUsers: await this.countUsers(),
      totalSolutions: await this.countSolutions(),
      recentActivity: await this.getRecentActivity(),
      syncStatus: await this.getSyncStatus()
    };
  }
  
  async getProblemAnalytics(): Promise<ProblemAnalytics> {
    return {
      difficultyDistribution: await this.getDifficultyDistribution(),
      companyDistribution: await this.getCompanyDistribution(),
      categoryDistribution: await this.getCategoryDistribution(),
      popularityRanking: await this.getPopularityRanking()
    };
  }
}
```

### **Phase 4: Frontend Admin Panel (Week 5-6)**

#### **4.1 Admin Authentication**
```typescript
// Admin Auth Context
interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Admin Route Protection
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAdmin) return <Navigate to="/login" />;
  
  return <>{children}</>;
};
```

#### **4.2 Admin Dashboard Components**
```typescript
// Admin Dashboard
const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<ProblemAnalytics | null>(null);
  
  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <StatCard title="Total Problems" value={stats?.totalProblems} />
        <StatCard title="Published Problems" value={stats?.publishedProblems} />
        <StatCard title="Total Users" value={stats?.totalUsers} />
        <StatCard title="Total Solutions" value={stats?.totalSolutions} />
      </div>
      
      <div className="analytics-section">
        <DifficultyChart data={analytics?.difficultyDistribution} />
        <CompanyChart data={analytics?.companyDistribution} />
        <PopularityTable data={analytics?.popularityRanking} />
      </div>
    </div>
  );
};

// Problem Management Table
const ProblemManagementTable: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  
  return (
    <div className="problem-management">
      <div className="table-header">
        <h2>Problem Management</h2>
        <div className="actions">
          <button onClick={handleSyncFromAPI}>Sync from API</button>
          <button onClick={handleCreateProblem}>Create New</button>
        </div>
      </div>
      
      <DataTable
        data={problems}
        columns={problemColumns}
        onRowClick={setSelectedProblem}
        onEdit={handleEditProblem}
        onDelete={handleDeleteProblem}
        onPublish={handlePublishProblem}
      />
      
      {selectedProblem && (
        <ProblemEditor
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onSave={handleSaveProblem}
        />
      )}
    </div>
  );
};
```

#### **4.3 Problem Editor Component**
```typescript
// Problem Editor
const ProblemEditor: React.FC<ProblemEditorProps> = ({ problem, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProblemFormData>(problem);
  const [solutions, setSolutions] = useState<AdminSolution[]>([]);
  
  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="problem-editor">
        <div className="editor-header">
          <h3>{problem ? 'Edit Problem' : 'Create Problem'}</h3>
          <div className="status-indicators">
            <StatusBadge status={formData.status} />
            <LastSyncBadge lastSync={formData.lastSync} />
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label>Title</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="form-section">
            <label>Description</label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({...formData, description: value})}
            />
          </div>
          
          <div className="form-row">
            <div className="form-section">
              <label>Difficulty</label>
              <Select
                value={formData.difficulty}
                onChange={(value) => setFormData({...formData, difficulty: value})}
                options={difficultyOptions}
              />
            </div>
            
            <div className="form-section">
              <label>Company</label>
              <input
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-section">
            <label>Tags</label>
            <TagInput
              tags={formData.tags}
              onChange={(tags) => setFormData({...formData, tags})}
            />
          </div>
          
          <div className="solutions-section">
            <h4>Official Solutions</h4>
            <SolutionList
              solutions={solutions}
              onAdd={handleAddSolution}
              onEdit={handleEditSolution}
              onDelete={handleDeleteSolution}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save Problem</button>
            <button type="button" onClick={handlePublish}>Publish</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
```

### **Phase 5: User Frontend (Week 7-8)**

#### **5.1 User Authentication**
```typescript
// User Auth Context
interface UserAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Auth Components
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="auth-modal">
        <div className="auth-tabs">
          <button
            className={!isRegistering ? 'active' : ''}
            onClick={() => setIsRegistering(false)}
          >
            Login
          </button>
          <button
            className={isRegistering ? 'active' : ''}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </button>
        </div>
        
        {isRegistering ? (
          <RegisterForm onSubmit={handleRegister} />
        ) : (
          <LoginForm onSubmit={handleLogin} />
        )}
      </div>
    </Modal>
  );
};
```

#### **5.2 Enhanced Problem Interface**
```typescript
// Enhanced QuestionDetails with User Features
const QuestionDetails: React.FC<QuestionDetailsProps> = ({ question }) => {
  const { user, isAuthenticated } = useAuth();
  const [userSolutions, setUserSolutions] = useState<UserSolution[]>([]);
  const [currentSolution, setCurrentSolution] = useState<UserSolution | null>(null);
  
  return (
    <div className="question-details">
      {/* Problem Header */}
      <div className="problem-header">
        <h2>{question.title}</h2>
        <div className="problem-meta">
          <DifficultyBadge difficulty={question.difficulty} />
          <CompanyBadge company={question.company} />
          <LastReportedBadge lastReported={question.lastReported} />
        </div>
      </div>
      
      {/* Problem Description */}
      <div className="problem-description">
        <div className="description-content">
          {question.description}
        </div>
      </div>
      
      {/* User Solution Status */}
      {isAuthenticated && (
        <div className="solution-status">
          <SolutionStatus
            problemId={question.id}
            userSolutions={userSolutions}
            onSaveSolution={handleSaveSolution}
          />
        </div>
      )}
      
      {/* Python Editor */}
      <div className="python-editor-section">
        <div className="editor-header">
          <h3>Python Editor</h3>
          <div className="editor-actions">
            <button onClick={handleRun}>Run</button>
            <button onClick={handleClear}>Clear</button>
            {isAuthenticated && (
              <button onClick={handleSaveSolution}>Save Solution</button>
            )}
          </div>
        </div>
        
        <PythonEditor
          initialCode={getDefaultTemplate(question)}
          onCodeChange={handleCodeChange}
          onRun={handleRun}
          onSave={isAuthenticated ? handleSaveSolution : undefined}
        />
      </div>
      
      {/* Solution History */}
      {isAuthenticated && userSolutions.length > 0 && (
        <div className="solution-history">
          <h4>Your Solutions</h4>
          <SolutionHistory
            solutions={userSolutions}
            onLoadSolution={handleLoadSolution}
            onDeleteSolution={handleDeleteSolution}
          />
        </div>
      )}
    </div>
  );
};
```

#### **5.3 Solution Management**
```typescript
// Solution Status Component
const SolutionStatus: React.FC<SolutionStatusProps> = ({ problemId, userSolutions, onSaveSolution }) => {
  const latestSolution = userSolutions[0];
  const completionStatus = getCompletionStatus(userSolutions);
  
  return (
    <div className="solution-status">
      <div className="status-header">
        <h4>Your Progress</h4>
        <CompletionBadge status={completionStatus} />
      </div>
      
      <div className="status-details">
        <div className="status-item">
          <span className="label">Solutions:</span>
          <span className="value">{userSolutions.length}</span>
        </div>
        
        <div className="status-item">
          <span className="label">Last Updated:</span>
          <span className="value">{formatDate(latestSolution?.updatedAt)}</span>
        </div>
        
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`status-badge ${completionStatus}`}>
            {completionStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

// Solution History Component
const SolutionHistory: React.FC<SolutionHistoryProps> = ({ solutions, onLoadSolution, onDeleteSolution }) => {
  return (
    <div className="solution-history">
      <div className="history-list">
        {solutions.map((solution) => (
          <div key={solution.id} className="solution-item">
            <div className="solution-info">
              <div className="solution-meta">
                <span className="created-at">
                  {formatDate(solution.createdAt)}
                </span>
                <StatusBadge status={solution.status} />
              </div>
              
              <div className="solution-preview">
                <code>{solution.code.substring(0, 100)}...</code>
              </div>
            </div>
            
            <div className="solution-actions">
              <button onClick={() => onLoadSolution(solution)}>
                Load
              </button>
              <button onClick={() => onDeleteSolution(solution.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### **Phase 6: Testing & Deployment (Week 9-10)**

#### **6.1 Testing Strategy**
```typescript
// Backend Tests
describe('Auth Service', () => {
  test('should register new user', async () => {
    const userData = { email: 'test@example.com', password: 'password123', name: 'Test User' };
    const user = await authService.register(userData);
    expect(user.email).toBe(userData.email);
  });
  
  test('should authenticate user', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    const result = await authService.login(credentials);
    expect(result.accessToken).toBeDefined();
  });
});

// Frontend Tests
describe('QuestionDetails Component', () => {
  test('should display problem information', () => {
    render(<QuestionDetails question={mockProblem} />);
    expect(screen.getByText(mockProblem.title)).toBeInTheDocument();
  });
  
  test('should show save button for authenticated users', () => {
    const mockAuth = { user: mockUser, isAuthenticated: true };
    render(
      <AuthContext.Provider value={mockAuth}>
        <QuestionDetails question={mockProblem} />
      </AuthContext.Provider>
    );
    expect(screen.getByText('Save Solution')).toBeInTheDocument();
  });
});
```

#### **6.2 Deployment Configuration**
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/codingapp
      - REDIS_URL=redis://redis:6379
      - EXTERNAL_API_URL=https://api.example.com
      - EXTERNAL_API_KEY=your-api-key
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=codingapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## 🎯 **Task Division Strategy**

### **Backend Team (2-3 developers)**
1. **Developer 1**: Authentication & User Management
2. **Developer 2**: Problem Management & External API Integration
3. **Developer 3**: Solution System & Database Design

### **Frontend Team (2-3 developers)**
1. **Developer 1**: Admin Panel & Problem Management UI
2. **Developer 2**: User Interface & Solution Management
3. **Developer 3**: Authentication UI & Dashboard Components

### **DevOps Team (1 developer)**
1. **Developer 1**: Infrastructure, Deployment & Monitoring

## 📊 **Success Metrics**

### **Phase 1-2 (Foundation)**
- Authentication system working
- Database schema implemented
- External API integration functional

### **Phase 3-4 (Admin System)**
- Admin can create/edit/delete problems
- External API sync working
- Admin dashboard functional

### **Phase 5-6 (User System)**
- Users can signup/signin
- Users can save solutions
- Full system deployed and tested

## 🚀 **Implementation Timeline**

### **Week 1-2: Foundation**
- Backend setup and authentication
- Database schema and migrations
- Basic API endpoints

### **Week 3-4: External Integration**
- External API service
- Problem synchronization
- Admin API endpoints

### **Week 5-6: Admin Frontend**
- Admin authentication
- Problem management UI
- Dashboard and analytics

### **Week 7-8: User Frontend**
- User authentication
- Enhanced problem interface
- Solution management

### **Week 9-10: Testing & Deployment**
- Comprehensive testing
- Performance optimization
- Production deployment

## 🔄 **Future Enhancements**

### **Advanced Features**
1. **Real-time Collaboration**: Live problem editing
2. **Advanced Analytics**: User behavior tracking
3. **AI Integration**: Code analysis and suggestions
4. **Mobile App**: React Native implementation
5. **API Rate Limiting**: Advanced throttling
6. **Caching Strategy**: Redis implementation
7. **File Storage**: AWS S3 integration
8. **Monitoring**: Application performance monitoring

---

## 🎉 **Expected Outcome**

After implementing this divide & conquer approach:

1. **Scalable Backend**: Robust API with external integration
2. **Admin System**: Complete problem management capabilities
3. **User System**: Full authentication and solution tracking
4. **External Integration**: Seamless API synchronization
5. **Production Ready**: Deployed and monitored application
6. **Team Collaboration**: Clear task division and responsibilities
7. **Future Proof**: Architecture ready for scaling

This approach ensures each team can work independently while maintaining clear interfaces and dependencies between components.
