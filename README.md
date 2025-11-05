# CyberThreat – Crowdsourced Cyber Threat Intelligence Platform

**CyberThreat** is a real-time, crowdsourced cyber threat intelligence platform that empowers users to report, analyze, and defend against digital threats. The platform integrates a mobile application (Securo) built with Flutter, browser extensions, and an AI assistant for unified protection across devices.

---

## Overview

CyberThreat enables individuals and organizations to:
- Report phishing URLs, malware, and suspicious domains
- Detect if their email or credentials have appeared in known data breaches
- View real-time insights via an interactive threat map showing the most reported global threats
- Receive AI-driven security alerts and voice-assisted responses
- Use the Securo mobile app for SMS-based phishing detection and instant link analysis

---

## Securo Mobile Application

**Securo** is the companion mobile application to CyberThreat, built with Flutter. It functions as an intelligent message security scanner, analyzing SMS and notifications to detect scam or phishing links.

### Key Features
- Detect phishing links directly from SMS or notifications
- Instant alerts for malicious URLs
- Web extension support for browser users
- Data breach detection for stored credentials
- AI-powered assistant with voice interaction for quick security guidance

---

## Core Features

| Feature | Description |
|---------|-------------|
| **Crowdsourced Threat Reporting** | Users can report phishing URLs, malware, or suspicious domains in real time |
| **Kafka-Powered Event Streaming** | Apache Kafka handles real-time data flow for reported threats |
| **Threat Map** | Displays the most reported cyber threats globally with visual analytics |
| **Data Breach Checker** | Instantly verifies if your email or passwords were exposed in breaches |
| **AI Security Assistant** | Smart voice-enabled chatbot trained to assist users with threat insights |
| **Email Breach Detector** | Checks if your email has appeared in public breach databases |
| **Web Extension** | Provides live website protection and URL analysis for desktop users |
| **Securo Mobile App** | Detects phishing links from SMS and notifications |

---

## AI Assistant

The built-in AI assistant, powered by a fine-tuned large language model, helps users by:
- Explaining security alerts
- Providing personalized safety advice
- Supporting voice interaction for hands-free assistance

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Spring Boot, Apache Kafka, REST API, Supabase, FastAPI, Django |
| **Frontend** | Next.js (Web), Flutter (Mobile - Securo) |
| **Database** | PostgreSQL / Supabase |
| **AI / ML** | Python, TensorFlow, NLP Models for breach and URL detection |
| **Security** | JWT Authentication, Encryption, Rate Limiting |
| **Extensions** | Browser extension for real-time link scanning |
| **Infrastructure** | Dockerized microservices |

---

## Project Structure

```
CyberThreat/
│
├── ai_assistant/          # AI-powered voice & chat assistant
├── client/                # Web client (Next.js)
├── community/             # Crowdsourced reporting system
├── community_client/      # User interface for reports
├── extension/             # Browser extension code
├── email/                 # Email breach detection service
├── models/                # Threat and user data models
├── password/              # Password leak verification module
├── server/                # Spring Boot backend (API + Kafka)
├── threatmap/             # Real-time threat map visualization
├── Securo/                # Flutter mobile app (APK)
└── README.md              # This file
```

---

## Key Capabilities

- Report and analyze phishing URLs and malware
- View global threat analytics
- Check if your email or password was breached
- Interact with the AI Security Assistant via chat or voice
- Receive instant alerts on SMS or website phishing attempts
- Use browser extension for real-time link scanning
- Manage security across all channels via the Securo mobile app

---

## Installation

### Clone the Repository
```bash
git clone https://github.com/afraa786/CyberThreat.git
cd CyberThreat
```

### Backend Setup
```bash
cd server
mvn spring-boot:run
```

### Web Client Setup
```bash
cd client
npm install
npm run dev
```

### Securo Mobile App Setup
```bash
cd Securo
flutter pub get
flutter run
```

---

## Future Enhancements

- Integration with real-time Dark Web breach APIs
- AI-based phishing URL prediction model
- Advanced gamified user leaderboard
- Multi-platform voice control for the AI assistant

---

## Contributing

Contributions are welcome. Please submit pull requests or open issues to suggest improvements or report bugs.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions or support, please open an issue on the GitHub repository.
