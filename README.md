# Crowdsourced Cyber Threat Intelligence Platform

## Overview
The **Crowdsourced Cyber Threat Intelligence Platform** is a real-time threat reporting and analysis system. It enables users to report phishing URLs, malware, and other cyber threats while utilizing Apache Kafka for event streaming. The platform is secured with JWT authentication and integrates a gamified cyberpunk-themed frontend for an engaging user experience.

## Features
- **Threat Reporting**: Users can report cyber threats like phishing URLs, malware, and suspicious activities.
- **Real-time Streaming**: Uses Apache Kafka for real-time data streaming and threat intelligence aggregation.
- **Secure Authentication**: JWT-based authentication for secure API access.
- **Gamified UI**: XP points, badges, and user levels to encourage participation.
- **Live Cyber Threat Map**: A visual representation of reported threats.
- **Leaderboard & Missions**: Tracks top contributors and assigns mission-based challenges.
- **Real-time Notifications**: Displays alerts for newly reported threats.
- **Cyberpunk-Themed UI**: Dark mode with neon blue, green, and purple accents, glitch effects, and holographic buttons.

## Tech Stack
### Backend:
- **Spring Boot** (Java) - Core backend framework
- **Supabase** (PostgreSQL) - Database for storing reported threats
- **Apache Kafka** - Event streaming for real-time data processing
- **Spring Security** - API authentication using JWT
- **Flask** - URL detection Machine Learning Model
- **FastAPI** - Cyber Security Analyst based Chat Model

### Frontend:
- **React** - Modern UI framework
- **TypeScript** - Integration
- **Plain HTML** - structure of the frontend
- **Tailwind CSS** - Cyberpunk-themed UI with animations

### Deployment & Tools:
- **Docker** - Containerized environment for seamless deployment
- **CI/CD** - Automating build and deployment pipelines (planned)
- **Vercel** - Deployment

## Installation & Setup
### Prerequisites
- Java 17+
- Node.js 16+
- Docker
- Apache Kafka (for local development)
- PostgreSQL (Supabase)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cyberthreat-intelligence.git
   cd cyberthreat-intelligence/backend
   ```
2. Configure environment variables in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/cyberthreats
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   jwt.secret=your_jwt_secret
   kafka.bootstrap-servers=localhost:9092
   ```
3. Run the backend application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```

## API Endpoints
### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Threat Reporting
- `POST /api/threats/report` - Submit a new threat
- `GET /api/threats` - Fetch reported threats
- `GET /api/threats/{id}` - Get details of a specific threat

## Contributing
We welcome contributions! Feel free to fork the repo, submit issues, and create pull requests.

## License
This project is licensed under the **MIT License**.

## Contact
For any queries, feel free to reach out
