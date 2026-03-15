# SyncChat - Frontend

A modern, feature-rich real-time chat application built with React and Socket.io. SyncChat provides a seamless messaging experience with extensive customization options and WhatsApp-like features.

🔗 **Live Demo:** [https://synqchatapp.vercel.app/](https://synqchatapp.vercel.app/)

## ✨ Features

### 🗨️ Messaging
- **Real-time Communication** - Instant message delivery using Socket.io
- **One-to-One Chat** - Private conversations with other users
- **Group Chats** - Create and manage group conversations
- **File Sharing** - Share any type of file (images, videos, documents, code files, music, etc.)
- **In-App File Viewer** - Preview files directly within the app
- **Emoji Support** - Express yourself with emoji picker and reactions
- **Message Reactions** - React to messages with emojis
- **Typing Indicators** - See when someone is typing
- **Message Status** - Single tick (sent), double tick (delivered), blue tick (read)
- **Delete Options** - Delete for me or delete for everyone

### 👥 User Features
- **User Authentication** - Secure login and registration
- **Username-Based** - Identify users by username (not phone numbers)
- **Profile Avatars** - Personalized user profiles with avatar support
- **Online Status Indicators** - See who's online in real-time
- **Contact Search** - Quickly find and connect with users

### 👨‍👩‍👧‍👦 Group Management
- **Create Groups** - Start group conversations
- **Invite Members** - Add friends to groups
- **Remove Members** - Manage group participants
- **Transfer Ownership** - Pass group admin rights to other members

### 🎨 Customization
- **Theme Switching** - Choose between light and dark themes
- **Accent Colors** - Personalize your chat interface with custom colors
- **Message Bubble Shapes** - Customize message appearance
- **Time Format** - Toggle between 12-hour and 24-hour format

### 🔔 Notifications
- **Toast Notifications** - Real-time updates for new messages and events
- **Read Receipts** - Know when your messages are read

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Socket.io Client** - Real-time bidirectional communication
- **Axios** - HTTP client for API requests
- **Zustand** - State management
- **React Hook Form** - Form handling and validation
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library
- **Lucide React** - Icon library
- **Moment.js** - Date and time formatting
- **Emoji Picker React** - Emoji selection interface
- **React Hot Toast** - Toast notifications
- **React Syntax Highlighter** - Code file syntax highlighting

## 📸 Screenshots

**Sign up Page**
![Sign up page](./assets/signuppage.png)

**Login Page**
![Login page](./assets/loginpage.png)

**Home page and Dark mode interface**
![Home page & Dark Mode](./assets/homepage.png)

**Delivered & Read tick**
![Double tick & Blue tick](./assets/bluetickdoubletick.png)

**Media in a Chat**
![Chat media](./assets/chatmedia.png)

**Listing of selected media**
![Media selection](./assets/selectedmediafiles.png)

**Group chat interface**
![Group chat interface](./assets/groupchat.png)

**View group members**
![Dark mode](./assets/darkmode.png)

**Form to create group**
![Creating Group](./assets/creatingGroup.png)

**Find people already on SyncChat**
![Finding people](./assets/findingpeople.png)

**Media selection popup**
![File Sending](./assets/filesending.png)

**Emojis popup**
![Emoji panel](./assets/emoji.png)


## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/syncchat-frontend.git
   cd syncchat-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SERVER=http://localhost:8080
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🏗️ Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── store/          # Zustand state management
│   ├── utils/          # Utility functions
│   ├── constants/      # Constants and config
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── .env                # Environment variables
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🔌 API Integration

The frontend communicates with the backend API using:
- **Axios** for REST API calls (authentication, user data, etc.)
- **Socket.io** for real-time features (messaging, online status, typing indicators)

Base API URL is configured via `VITE_SERVER` environment variable.

## 🎨 Customization Options

### Themes
- Light Mode
- Dark Mode

### Accent Colors
Users can choose from multiple accent color options to personalize their chat interface.

### Message Bubbles
Multiple bubble shape options available for message display.

### Time Format
Toggle between 12-hour (AM/PM) and 24-hour format.

## 📱 Responsive Design

SyncChat is fully responsive and works seamlessly across:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 🌐 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import project in Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Configure environment variables**
   - Add `VITE_SERVER` with your backend URL

4. **Deploy**
   - Vercel will automatically build and deploy

### Environment Variables for Production

```env
VITE_SERVER=https://your-backend-url.onrender.com
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Rahul Sharma - [RahulSBytes](https://github.com/RahulSBytes)

## 🙏 Acknowledgments

- Built with ❤️ using React and modern web technologies
- Inspired by popular messaging apps like WhatsApp

---

⭐ If you like this project, please give it a star on GitHub!
