const http = require('http');

const jobs = [
    { title: "Senior React Developer", description: "Looking for an expert in React, hooks, state management (Redux/Zustand), and performance optimization. Minimum 5 years experience.", requiredSkills: ["React", "JavaScript", "Redux", "CSS"] },
    { title: "Backend Node.js Engineer", description: "Design and implement scalable REST APIs using Node.js, Express, and MongoDB. Experience with Redis caching is a plus.", requiredSkills: ["Node.js", "Express", "MongoDB", "REST"] },
    { title: "Full Stack Engineer", description: "Join our agile team to build features end-to-end using React on the frontend and Python/Django on the backend.", requiredSkills: ["React", "Python", "Django", "PostgreSQL"] },
    { title: "DevOps Engineer", description: "Own our CI/CD pipelines, containerization with Docker, and orchestration using Kubernetes on AWS.", requiredSkills: ["Docker", "Kubernetes", "AWS", "CI/CD"] },
    { title: "Frontend Vue.js Developer", description: "Build interactive user interfaces using Vue 3 and the Composition API. TailwindCSS experience highly desirable.", requiredSkills: ["Vue.js", "JavaScript", "TailwindCSS"] },
    { title: "Data Scientist", description: "Analyze large datasets, build predictive models using Python, pandas, scikit-learn, and TensorFlow.", requiredSkills: ["Python", "Machine Learning", "TensorFlow", "Pandas"] },
    { title: "Java Backend Developer", description: "Develop enterprise financial applications using Java 17, Spring Boot, and Hibernate.", requiredSkills: ["Java", "Spring Boot", "SQL", "Hibernate"] },
    { title: "Machine Learning Engineer", description: "Deploy LLMs and computer vision models to production. Strong understanding of PyTorch and cloud infrastructure required.", requiredSkills: ["PyTorch", "Python", "AWS", "Deep Learning"] },
    { title: "iOS Developer", description: "Create native mobile applications using Swift and SwiftUI. Experience with CoreData and REST API integration.", requiredSkills: ["Swift", "iOS", "SwiftUI"] },
    { title: "Android Engineer", description: "Build scalable Android apps using Kotlin and Jetpack Compose. Strong knowledge of MVVM architecture.", requiredSkills: ["Kotlin", "Android", "Jetpack Compose"] },
    { title: "Cybersecurity Analyst", description: "Monitor network traffic for security breaches, perform vulnerability assessments and penetration testing.", requiredSkills: ["Security", "Networking", "Penetration Testing"] },
    { title: "Cloud Architect", description: "Design cloud-native solutions on Azure. Define best practices for security, high availability, and disaster recovery.", requiredSkills: ["Azure", "Architecture", "Cloud native"] },
    { title: "Database Administrator", description: "Manage and optimize PostgreSQL and MySQL databases. Handle backups, replication, and performance tuning.", requiredSkills: ["PostgreSQL", "MySQL", "Database Tuning"] },
    { title: "QA Automation Engineer", description: "Write automated end-to-end tests using Cypress or Playwright. Set up automated test pipelines.", requiredSkills: ["Testing", "Cypress", "JavaScript", "QA"] },
    { title: "Go Developer", description: "Build high-performance microservices using Go. Experience with gRPC and Protocol Buffers is strongly preferred.", requiredSkills: ["Go", "gRPC", "Microservices"] },
    { title: "C++ Systems Engineer", description: "Develop low-latency trading systems. Deep understanding of memory management and multithreading in C++.", requiredSkills: ["C++", "Multithreading", "Algorithms"] },
    { title: "UI/UX Designer", description: "Design beautiful, intuitive interfaces. Create wireframes, prototypes, and high-fidelity mockups in Figma.", requiredSkills: ["Figma", "Design", "User Experience"] },
    { title: "Technical Product Manager", description: "Work closely with engineering teams to define product roadmaps, write technical PRDs, and prioritize backlog.", requiredSkills: ["Product Management", "Agile", "Scrum"] },
    { title: "Ruby on Rails Developer", description: "Maintain and scale our core legacy monolith written in Ruby on Rails. Upgrade gems and optimize Active Record queries.", requiredSkills: ["Ruby", "Rails", "PostgreSQL"] },
    { title: "Blockchain Developer", description: "Write smart contracts using Solidity for Ethereum. Develop DApps integrating web3.js.", requiredSkills: ["Solidity", "Blockchain", "Web3"] }
];

const postJob = (job) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            ...job,
            location: ['Remote', 'New York', 'San Francisco', 'London', 'Berlin'][Math.floor(Math.random() * 5)]
        });

        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/jobs',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 201) resolve(body);
                else reject(new Error(`Status ${res.statusCode}: ${body}`));
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
};

async function seed() {
    console.log(`Seeding ${jobs.length} jobs via API...`);
    let success = 0;
    for (let i = 0; i < jobs.length; i++) {
        try {
            await postJob(jobs[i]);
            success++;
            process.stdout.write('.');
        } catch (e) {
            console.error(`\nFailed to post job ${i+1}:`, e.message);
        }
    }
    console.log(`\nSuccessfully seeded ${success} jobs!`);
}

seed();
