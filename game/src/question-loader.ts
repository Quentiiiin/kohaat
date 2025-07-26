import type { QuizQuestion } from "../../shared/schema";

export function getRandomQuestions(amount: number): QuizQuestion[] {
    if (allQuestions.length === 0) return [];
    let availableQuestions = [...allQuestions];
    const outputQuestions: QuizQuestion[] = [];
    for (let i = 0; i < amount; i++) {
        if (availableQuestions.length === 0) {
            availableQuestions = [...allQuestions];
        }
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const q = availableQuestions.splice(randomIndex, 1)[0];
        if (q) outputQuestions.push(q);
    }
    return outputQuestions;
}

export const allQuestions: QuizQuestion[] = [
    {
        question: 'What does "IMO" stand for in internet slang?',
        answers: [
            'In My Opinion',
            'I Mean Only',
            'It Might Operate',
            'Immediate Message Out',
        ],
        correctAnswer: 0,
    },
    {
        question: 'Which programming language is often used for web development?',
        answers: ['Python', 'Java', 'JavaScript', 'C++'],
        correctAnswer: 2,
    },
    {
        question: 'What is the most popular video game genre?',
        answers: ['RPG', 'Strategy', 'FPS', 'Puzzle'],
        correctAnswer: 2,
    },
    {
        question: 'What is a "meme"?',
        answers: [
            'A type of online game',
            'An image, video, or piece of text, etc., that is copied (often with slight variations) and spread rapidly by Internet users',
            'A social media platform',
            'A programming language feature',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What does "HTTP" stand for?',
        answers: [
            'HyperText Transfer Protocol',
            'High Technology Transfer Program',
            'Home Tool Transfer Process',
            'Hyperlink Text Transmission Point',
        ],
        correctAnswer: 0,
    },
    {
        question: 'Which game studio developed "The Witcher" series?',
        answers: ['BioWare', 'CD Projekt Red', 'Ubisoft', 'Blizzard Entertainment'],
        correctAnswer: 1,
    },
    {
        question: 'What is "phishing" in internet security?',
        answers: [
            'A type of online fishing game',
            'The fraudulent attempt to obtain sensitive information by disguising oneself as a trustworthy entity in a digital communication',
            'A method for sharing large files',
            'A new social media trend',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is the primary function of a "compiler"?',
        answers: [
            'To display web pages',
            'To translate source code into machine code',
            'To manage network connections',
            'To create graphical interfaces',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What does "DLC" stand for in gaming?',
        answers: [
            'Downloadable Content',
            'Digital Limited Collection',
            'Direct Link Connection',
            'Dynamic Level Creator',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What does "URL" stand for?',
        answers: [
            'Uniform Resource Locator',
            'Universal Register Link',
            'Unified Remote Logic',
            'User Response Language',
        ],
        correctAnswer: 0,
    },
    {
        question: 'Which data structure follows a Last-In, First-Out (LIFO) principle?',
        answers: ['Queue', 'Tree', 'Stack', 'Array'],
        correctAnswer: 2,
    },
    {
        question: 'Which game is known for its "battle royale" genre?',
        answers: ['Minecraft', 'Tetris', 'Fortnite', 'Super Mario Bros.'],
        correctAnswer: 2,
    },
    {
        question: 'What is "clickbait"?',
        answers: [
            'A type of fishing lure',
            'Content whose main purpose is to attract attention and encourage visitors to click on a link to a particular web page',
            'A method for securing online transactions',
            'A programming design pattern',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is "debugging"?',
        answers: [
            'Cleaning a computer keyboard',
            'The process of finding and resolving defects or problems within a computer program, software, or system',
            'Installing new software',
            'Creating a new program',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is "PvP" in gaming?',
        answers: [
            'Player versus Player',
            'Program versus Program',
            'Puzzle versus Problem',
            'Platform versus Platform',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What does "TL;DR" mean?',
        answers: [
            'Too Long; Didn\'t Read',
            'Total Loss; Disaster Recovery',
            'True Lies; Dangerous Rumors',
            'Type Less; Do Research',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What is a "variable" in programming?',
        answers: [
            'A type of computer virus',
            'A storage location paired with an associated symbolic name, which contains some known or unknown quantity of information or a value',
            'A graphic design tool',
            'A networking protocol',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What console did Nintendo release in 2006?',
        answers: ['Nintendo 64', 'GameCube', 'Wii', 'Switch'],
        correctAnswer: 2,
    },
    {
        question: 'What is "spoofing" in cybersecurity?',
        answers: [
            'Sending a funny email',
            'A technique where an attacker disguises themselves as a legitimate entity or device to gain unauthorized access or trick users',
            'Creating a backup of data',
            'Optimizing network speed',
        ],
        correctAnswer: 1,
    },
    {
        question: 'Which company developed the Android operating system?',
        answers: ['Apple', 'Microsoft', 'Google', 'Samsung'],
        correctAnswer: 2,
    },
    {
        question: 'What is "esports"?',
        answers: [
            'A new type of physical exercise',
            'Competitive video gaming',
            'A genre of sports games',
            'A online shopping platform',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What does "AFK" mean?',
        answers: [
            'Away From Keyboard',
            'Always Following Knowledge',
            'Active For Kicking',
            'Any Fine Key',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What is an "API" in programming?',
        answers: [
            'Application Program Interface',
            'Advanced Personal Information',
            'Automated Process Integration',
            'Actual Program Instructions',
        ],
        correctAnswer: 0,
    },
    {
        question: 'Which game is known for its "open world" environment?',
        answers: ['Pong', 'Super Mario Bros.', 'Grand Theft Auto V', 'Pac-Man'],
        correctAnswer: 2,
    },
    {
        question: 'What is "doxing"?',
        answers: [
            'Documenting code',
            'Publishing private or identifying information about an individual on the internet, typically without their consent and with malicious intent',
            'Creating online surveys',
            'Sharing research papers',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is "GitHub"?',
        answers: [
            'A social media platform',
            'A web-based platform for version control and collaboration, primarily used for software development',
            'A video streaming service',
            'An online gaming community',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What does "MMORPG" stand for?',
        answers: [
            'Massively Multiplayer Online Role-Playing Game',
            'Massive Mobile Online Racing Game',
            'Modern Military Operations Real-Time Game',
            'Multiplayer Mobile Online Racing Playgroup',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What is "viral content"?',
        answers: [
            'Content that causes computer viruses',
            'Content that spreads rapidly and widely from one Internet user to another',
            'Content that is difficult to find',
            'Content that is very old',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What does "IDE" stand for?',
        answers: [
            'Integrated Development Environment',
            'Internet Data Exchange',
            'Independent Design Engine',
            'Interactive Display Editor',
        ],
        correctAnswer: 0,
    },
    {
        question: 'Which game features characters like Link and Zelda?',
        answers: ['Pokémon', 'The Legend of Zelda', 'Final Fantasy', 'Halo'],
        correctAnswer: 1,
    },
    {
        question: 'What is "cyberbullying"?',
        answers: [
            'A type of online game',
            'Using electronic communication to bully a person, typically by sending messages of an intimidating or threatening nature',
            'Learning to program online',
            'Participating in online debates',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is "frontend" development?',
        answers: [
            'Developing the server-side logic of a website',
            'Developing the user interface and user experience of a website or application',
            'Managing databases',
            'Networking and security',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is a "mod" in gaming?',
        answers: [
            'A moderator in a forum',
            'A modification to a video game, made by players rather than the game developers',
            'A type of game controller',
            'A new game release',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is "netiquette"?',
        answers: [
            'A type of internet connection',
            'The correct or acceptable way of communicating on the Internet',
            'A tool for network analysis',
            'A programming language',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is "backend" development?',
        answers: [
            'Developing the visual elements of a website',
            'Developing the server-side logic, databases, and APIs of a website or application',
            'Creating graphic designs',
            'Writing user manuals',
        ],
        correctAnswer: 1,
    },
    {
        question: 'Which platform is known for live-streaming video games?',
        answers: ['Netflix', 'YouTube', 'Twitch', 'Vimeo'],
        correctAnswer: 2,
    },
    {
        question: 'What does "SaaS" stand for?',
        answers: [
            'Software as a Service',
            'System and Application Security',
            'Secure Authentication and Authorization System',
            'Standardized Application Architecture System',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What is "cross-platform" development?',
        answers: [
            'Developing for only one specific operating system',
            'Developing software that can run on multiple operating systems or devices',
            'Developing games with complex graphics',
            'Developing small, simple applications',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is a "boss" in a video game?',
        answers: [
            'The main character of the game',
            'A powerful enemy that a player must defeat to progress in the game',
            'A friendly NPC',
            'A game developer',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is "cloud computing"?',
        answers: [
            'Computing that involves the use of clouds in the sky',
            'The delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ("the cloud")',
            'A type of weather simulation',
            'A method for increasing computer memory',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What does "UX" stand for in web design?',
        answers: [
            'User Experience',
            'Unified Xylography',
            'Universal Xchange',
            'Underground Xylophone',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What is "ray tracing" in gaming graphics?',
        answers: [
            'A technique for drawing lines on a screen',
            'A rendering technique that simulates the physical behavior of light to produce highly realistic images',
            'A method for tracking player movements',
            'A type of game animation',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is "Two-Factor Authentication (2FA)"?',
        answers: [
            'A security process in which a user provides two different authentication factors to verify themselves',
            'A method for sending two emails at once',
            'A type of network cable',
            'A programming concept',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What is "version control" in software development?',
        answers: [
            'Controlling the speed of a program',
            'A system that records changes to a file or set of files over time so that you can recall specific versions later',
            'A method for virus detection',
            'A way to organize game files',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What does "NPC" stand for in gaming?',
        answers: [
            'Non-Player Character',
            'New Player Controller',
            'Next Programmed Challenge',
            'Notable Playable Character',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What is a "chatbot"?',
        answers: [
            'A small boat for chat rooms',
            'A computer program designed to simulate conversation with human users, especially over the Internet',
            'A new type of instant messaging',
            'A tool for online shopping',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is "Object-Oriented Programming (OOP)"?',
        answers: [
            'A programming paradigm based on the concept of "objects", which can contain data and code',
            'A method for organizing physical objects',
            'A type of network protocol',
            'A graphic design technique',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What is "VR" in gaming?',
        answers: [
            'Virtual Reality',
            'Video Review',
            'Variable Resolution',
            'Visual Rendering',
        ],
        correctAnswer: 0,
    },
    {
        question: 'What is a "cookie" in web terms?',
        answers: [
            'A small baked good',
            'A small piece of data sent from a website and stored on the user\'s computer by the user\'s web browser while the user is browsing',
            'A type of online game',
            'A social media filter',
        ],
        correctAnswer: 1,
    },
    {
        question: 'What is "responsive web design"?',
        answers: [
            'Designing websites that only work on desktop computers',
            'An approach to web design that makes web pages render well on a variety of devices and window or screen sizes',
            'Designing websites that respond quickly to user input',
            'Designing websites with a lot of animations',
        ],
        correctAnswer: 1,
    },
];
