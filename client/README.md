# HackDash - Modern Cybersecurity Dashboard

![HackDash Preview](https://i.imgur.com/QnmVkra.png)

A sleek, modern, and interactive cybersecurity dashboard built with React, TypeScript, and Tailwind CSS. Features real-time monitoring, threat visualization, and system resource tracking.

## 🚀 Features

- **Real-time Security Monitoring**
  - Live security score tracking
  - Dynamic threat detection
  - Interactive network visualization

- **System Resource Tracking**
  - CPU usage monitoring
  - Memory utilization
  - Storage capacity tracking

- **Interactive Components**
  - Network activity graph
  - Global threat map
  - Live terminal interface
  - Activity log with severity levels

- **Modern UI Elements**
  - Animated components
  - Responsive design
  - Dark mode optimized
  - Real-time updates

## 🛠️ Technologies

- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons
- Radix UI Components
- Canvas API for visualizations

## 🏗️ Installation

1. Clone the repository:
```bash
git clone https://github.com/belhedianwer/hackdash.git
```

2. Navigate to the project directory:
```bash
cd hackdash
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/           # UI Components
│   ├── ActivityLog.tsx   # Activity logging component
│   ├── DashboardCard.tsx # Reusable card component
│   ├── LiveAlerts.tsx    # Real-time alerts
│   ├── NetworkGraph.tsx  # Network visualization
│   ├── SecurityScore.tsx # Security metrics
│   ├── SystemResources.tsx # Resource monitoring
│   ├── Terminal.tsx      # Interactive terminal
│   └── ThreatMap.tsx    # Global threat visualization
├── lib/
│   └── utils.ts         # Utility functions
└── App.tsx              # Main application component
```

## 🎨 Customization

### Theme Colors
The dashboard uses a custom color scheme that can be modified in `index.css`:

```css
:root {
  --primary: hsl(0 0% 98%);
  --secondary: hsl(0 0% 14.9%);
  /* ... other color variables */
}
```

### Adding New Components
1. Create a new component in `src/components/`
2. Import and add to the main dashboard in `App.tsx`
3. Style using Tailwind CSS classes

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Anwer Awled Belhedi

- Website: [anwer-awled-belhedi.com](https://anwer-awled-belhedi.com)
- LinkedIn: [linkedin.com/in/aabyna](https://www.linkedin.com/in/aabyna)
- GitHub: [github.com/belhedianwer](https://github.com/belhedianwer)

Project Link: [https://github.com/aabyna/hackdash](https://github.com/belhedianwer/hackdash)
