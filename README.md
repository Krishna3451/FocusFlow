# Wise Owl Coach - AI-Powered Mental Wellness Companion

![Wise Owl Coach](public/owl-avatar.png)

Wise Owl Coach is a modern, web-based mental wellness application that combines AI-powered therapy with personal journaling to support your emotional well-being journey.

## 🌟 Features

### 🤖 AI Therapy Support
- Engage in meaningful conversations with our AI therapist
- Get personalized emotional support and guidance
- Available 24/7 for when you need someone to talk to
- Powered by Google's Gemini AI for natural, empathetic interactions

### 📔 Daily Reflections
- Structured daily journaling with guided prompts
- Track your activities, emotions, and personal wins
- Document your spiritual, mental, and physical achievements
- Capture memorable moments with photo attachments

### 📊 Growth Journey
- Visualize your emotional progress over time
- Review past journal entries and reflections
- Track patterns in your mental well-being
- Celebrate your personal growth milestones

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/wise-owl-coach.git
cd wise-owl-coach
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Add your Gemini API key to the `.env` file:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:8081](http://localhost:8081) in your browser

## 🛠️ Built With

- **Frontend Framework**: React + TypeScript
- **Styling**: TailwindCSS
- **AI Integration**: Google Gemini API
- **Routing**: React Router
- **State Management**: React Context + Hooks
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui

## 📱 Features in Detail

### AI Therapy Sessions
- Natural language conversations
- Emotional support and guidance
- Progress tracking
- Session history

### Daily Reflection Journal
- Structured daily entries
- Mood tracking
- Activity logging
- Gratitude journaling
- Personal wins documentation
- Photo memories

## 🤝 Contributing

We welcome contributions to Wise Owl Coach! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powering our therapy conversations
- The open-source community for the amazing tools and libraries
- Our users for their trust and feedback

## 🔒 Privacy & Security

- All conversations with the AI therapist are private and not stored permanently
- Journal entries are stored locally in your browser
- No personal data is transmitted to external servers
- Optional data export/backup functionality
