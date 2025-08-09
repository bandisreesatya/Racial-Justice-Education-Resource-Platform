// Global variables
let currentUser = null;
let experiences = [];
let users = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    updateAuthSection();
    setupNavigation();
    
    // Load experiences if on experiences page
    if (window.location.pathname.includes('experiences.html')) {
        loadExperiences();
    }
});

// Load user data from localStorage
function loadUserData() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    
    const savedExperiences = localStorage.getItem('experiences');
    if (savedExperiences) {
        experiences = JSON.parse(savedExperiences);
    }
}

// Update authentication section in navigation
function updateAuthSection() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;
    
    if (currentUser) {
        authSection.innerHTML = `
            <div class="user-info">
                <span class="user-name">${currentUser.name}</span>
                <button onclick="logout()" class="logout-btn">Logout</button>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <a href="login.html" class="nav-link login-btn">Login</a>
        `;
    }
}

// Setup mobile navigation
function setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthSection();
    
    // Redirect to home if on restricted page
    if (window.location.pathname.includes('experiences.html')) {
        window.location.href = 'index.html';
    }
}

// Login function
function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

// Register function
function register(name, email, password) {
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return false;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        joinDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

// Experience functions
function loadExperiences() {
    const experiencesList = document.getElementById('experiences-list');
    if (!experiencesList) return;
    
    if (experiences.length === 0) {
        experiencesList.innerHTML = `
            <div class="card">
                <p style="text-align: center; color: #6b7280;">No experiences shared yet. Be the first to share your story!</p>
            </div>
        `;
        return;
    }
    
    experiencesList.innerHTML = experiences
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(exp => `
            <div class="experience-card">
                <div class="experience-header">
                    <span class="experience-author">${exp.anonymous ? 'Anonymous' : exp.userName}</span>
                    <span class="experience-date">${formatDate(exp.timestamp)}</span>
                </div>
                <div class="experience-content">${exp.content}</div>
            </div>
        `).join('');
}

function submitExperience(content, isAnonymous) {
    if (!currentUser) {
        showAlert('Please log in to share your experience.', 'error');
        return false;
    }
    
    if (!content.trim()) {
        showAlert('Please write your experience before submitting.', 'error');
        return false;
    }
    
    const experience = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        content: content.trim(),
        timestamp: new Date().toISOString(),
        anonymous: isAnonymous
    };
    
    experiences.push(experience);
    localStorage.setItem('experiences', JSON.stringify(experiences));
    
    loadExperiences();
    showAlert('Your experience has been shared successfully!', 'success');
    return true;
}

// Utility functions
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Quiz functionality
class QuizManager {
    constructor() {
        this.quizzes = {
            'basic-concepts': {
                title: 'Basic Concepts of Racial Justice',
                description: 'Test your understanding of fundamental racial justice concepts.',
                questions: [
                    {
                        question: 'What does systemic racism refer to?',
                        options: [
                            'Individual acts of racism',
                            'Institutional policies and practices that disadvantage racial minorities',
                            'Reverse racism',
                            'Only historical discrimination'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Which article of the Indian Constitution prohibits discrimination?',
                        options: ['Article 14', 'Article 15', 'Article 16', 'All of the above'],
                        correct: 3
                    },
                    {
                        question: 'What is intersectionality?',
                        options: [
                            'The crossing of roads',
                            'How different forms of discrimination overlap and compound',
                            'A mathematical concept',
                            'None of the above'
                        ],
                        correct: 1
                    },
                    {
                        question: 'What does equity mean in the context of racial justice?',
                        options: [
                            'Treating everyone exactly the same',
                            'Providing fair treatment and opportunities based on individual needs',
                            'Ignoring differences',
                            'Segregation'
                        ],
                        correct: 1
                    },
                    {
                        question: 'What is unconscious bias?',
                        options: [
                            'Deliberate discrimination',
                            'Automatic mental associations and stereotypes we may not be aware of',
                            'Legal discrimination',
                            'Positive stereotypes only'
                        ],
                        correct: 1
                    }
                ]
            },
            'indian-constitution': {
                title: 'Indian Constitution and Equality',
                description: 'Learn about constitutional provisions for equality and justice.',
                questions: [
                    {
                        question: 'Which article guarantees Right to Equality?',
                        options: ['Article 12', 'Article 14', 'Article 16', 'Article 18'],
                        correct: 1
                    },
                    {
                        question: 'Article 15 prohibits discrimination on which grounds?',
                        options: [
                            'Religion and race only',
                            'Caste and sex only',
                            'Religion, race, caste, sex, or place of birth',
                            'Economic status only'
                        ],
                        correct: 2
                    },
                    {
                        question: 'What does Article 17 of the Constitution abolish?',
                        options: ['Slavery', 'Untouchability', 'Child labor', 'Bonded labor'],
                        correct: 1
                    },
                    {
                        question: 'Which article provides for equality of opportunity in public employment?',
                        options: ['Article 14', 'Article 15', 'Article 16', 'Article 17'],
                        correct: 2
                    },
                    {
                        question: 'The Constitution allows for special provisions for which groups?',
                        options: [
                            'No special provisions allowed',
                            'Socially and educationally backward classes',
                            'Only religious minorities',
                            'Only linguistic minorities'
                        ],
                        correct: 1
                    }
                ]
            },
            'social-justice': {
                title: 'Social Justice Principles',
                description: 'Understanding principles of social justice and equality.',
                questions: [
                    {
                        question: 'What is social justice?',
                        options: [
                            'Equal treatment regardless of circumstances',
                            'Fair distribution of resources and opportunities',
                            'Majority rule',
                            'Economic prosperity'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Which of these is NOT a principle of social justice?',
                        options: ['Fairness', 'Equality', 'Dignity', 'Discrimination'],
                        correct: 3
                    },
                    {
                        question: 'What is the goal of affirmative action?',
                        options: [
                            'To create reverse discrimination',
                            'To level the playing field for historically disadvantaged groups',
                            'To eliminate all differences',
                            'To maintain status quo'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Human dignity means:',
                        options: [
                            'Economic status',
                            'Inherent worth of every person',
                            'Social position',
                            'Educational achievement'
                        ],
                        correct: 1
                    },
                    {
                        question: 'What is inclusive society?',
                        options: [
                            'Society that excludes minorities',
                            'Society where everyone has equal opportunities to participate',
                            'Society based on majority preferences',
                            'Economically stratified society'
                        ],
                        correct: 1
                    }
                ]
            },
            'civil-rights': {
                title: 'Civil Rights Movement',
                description: 'Knowledge about civil rights movements and their impact.',
                questions: [
                    {
                        question: 'What was the main goal of civil rights movements?',
                        options: [
                            'Economic prosperity',
                            'Equal rights and treatment for all citizens',
                            'Political power',
                            'Cultural dominance'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Which method is commonly associated with peaceful civil rights activism?',
                        options: ['Violence', 'Non-violent resistance', 'Isolation', 'Silence'],
                        correct: 1
                    },
                    {
                        question: 'What does "separate but equal" refer to?',
                        options: [
                            'A fair policy',
                            'A discriminatory practice that was legally challenged',
                            'Modern policy',
                            'Economic policy'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Civil disobedience means:',
                        options: [
                            'Following all laws',
                            'Peaceful refusal to obey unjust laws',
                            'Violent protest',
                            'Political campaigning'
                        ],
                        correct: 1
                    },
                    {
                        question: 'What is the significance of grassroots movements?',
                        options: [
                            'They are ineffective',
                            'They bring change from the community level up',
                            'They only work in rural areas',
                            'They are government-led'
                        ],
                        correct: 1
                    }
                ]
            },
            'modern-challenges': {
                title: 'Modern Challenges in Racial Justice',
                description: 'Contemporary issues and challenges in achieving racial justice.',
                questions: [
                    {
                        question: 'What is implicit bias?',
                        options: [
                            'Obvious discrimination',
                            'Unconscious attitudes that affect our actions',
                            'Legal discrimination',
                            'Intentional prejudice'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Microaggressions are:',
                        options: [
                            'Major acts of discrimination',
                            'Small, everyday slights based on race or identity',
                            'Legal violations',
                            'Physical violence'
                        ],
                        correct: 1
                    },
                    {
                        question: 'What is cultural competency?',
                        options: [
                            'Knowing only your own culture',
                            'Understanding and respectfully interacting across cultures',
                            'Avoiding other cultures',
                            'Imposing your culture on others'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Digital divide in the context of racial justice refers to:',
                        options: [
                            'Technology preferences',
                            'Unequal access to technology and digital resources',
                            'Social media usage',
                            'Computer skills'
                        ],
                        correct: 1
                    },
                    {
                        question: 'What is allyship?',
                        options: [
                            'Being neutral',
                            'Actively supporting marginalized communities',
                            'Avoiding difficult conversations',
                            'Only helping when asked'
                        ],
                        correct: 1
                    }
                ]
            }
        };
        
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.answers = [];
    }
    
    startQuiz(quizId) {
        if (!currentUser) {
            showAlert('Please log in to take quizzes.', 'error');
            return;
        }
        
        this.currentQuiz = quizId;
        this.currentQuestion = 0;
        this.answers = [];
        this.showQuestion();
    }
    
    showQuestion() {
        const quiz = this.quizzes[this.currentQuiz];
        const question = quiz.questions[this.currentQuestion];
        
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = `
            <div class="quiz-header">
                <h2>${quiz.title}</h2>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((this.currentQuestion + 1) / quiz.questions.length) * 100}%"></div>
                </div>
                <p>Question ${this.currentQuestion + 1} of ${quiz.questions.length}</p>
            </div>
            <div class="quiz-content">
                <div class="question-container">
                    <h3 class="question-title">${question.question}</h3>
                    <div class="options-container">
                        ${question.options.map((option, index) => `
                            <button class="option-button" onclick="quizManager.selectAnswer(${index})">
                                ${String.fromCharCode(65 + index)}. ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <button onclick="quizManager.showQuizList()" class="btn btn-secondary">Back to Quizzes</button>
                </div>
            </div>
        `;
    }
    
    selectAnswer(answerIndex) {
        this.answers[this.currentQuestion] = answerIndex;
        
        if (this.currentQuestion < this.quizzes[this.currentQuiz].questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion();
        } else {
            this.showResults();
        }
    }
    
    showResults() {
        const quiz = this.quizzes[this.currentQuiz];
        const score = this.answers.reduce((acc, answer, index) => {
            return acc + (answer === quiz.questions[index].correct ? 1 : 0);
        }, 0);
        
        const percentage = Math.round((score / quiz.questions.length) * 100);
        
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = `
            <div class="quiz-header">
                <h2>Quiz Complete!</h2>
            </div>
            <div class="quiz-content" style="text-align: center;">
                <div style="margin-bottom: 2rem;">
                    <div style="font-size: 4rem; color: ${percentage >= 80 ? '#16a34a' : percentage >= 60 ? '#eab308' : '#dc2626'}; margin-bottom: 1rem;">
                        ${percentage}%
                    </div>
                    <h3>You scored ${score} out of ${quiz.questions.length} questions correctly.</h3>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    ${percentage >= 80 ? 
                        '<p style="color: #16a34a; font-weight: 500;">Excellent work! You have a strong understanding of the topic.</p>' :
                        percentage >= 60 ?
                        '<p style="color: #eab308; font-weight: 500;">Good job! Consider reviewing the material to strengthen your knowledge.</p>' :
                        '<p style="color: #dc2626; font-weight: 500;">Keep learning! Review the resources and try again.</p>'
                    }
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="quizManager.showQuizList()" class="btn btn-primary">Take Another Quiz</button>
                    <button onclick="quizManager.startQuiz('${this.currentQuiz}')" class="btn btn-secondary">Retake This Quiz</button>
                </div>
            </div>
        `;
        
        // Save result
        this.saveQuizResult(score, quiz.questions.length);
    }
    
    saveQuizResult(score, total) {
        const result = {
            quiz: this.currentQuiz,
            score: score,
            total: total,
            percentage: Math.round((score / total) * 100),
            timestamp: new Date().toISOString()
        };
        
        let quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
        if (!quizResults[currentUser.id]) {
            quizResults[currentUser.id] = [];
        }
        quizResults[currentUser.id].push(result);
        localStorage.setItem('quizResults', JSON.stringify(quizResults));
    }
    
    showQuizList() {
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = `
            <div class="quiz-header">
                <h2>Interactive Quizzes</h2>
                <p>Test your knowledge and understanding of racial justice topics.</p>
            </div>
            <div class="quiz-content">
                ${!currentUser ? `
                    <div class="alert alert-info">
                        <p>Please <a href="login.html">log in</a> to take quizzes and track your progress.</p>
                    </div>
                ` : ''}
                <div class="quiz-grid">
                    ${Object.entries(this.quizzes).map(([id, quiz]) => `
                        <div class="quiz-card">
                            <h3>${quiz.title}</h3>
                            <p>${quiz.description}</p>
                            <div class="quiz-info">${quiz.questions.length} questions</div>
                            <button onclick="quizManager.startQuiz('${id}')" class="btn btn-primary" ${!currentUser ? 'disabled' : ''}>
                                Start Quiz
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Initialize quiz manager
const quizManager = new QuizManager();