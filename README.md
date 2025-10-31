# Devtective 🕵️‍♂️

![Devtective Mockup](/public/images/mockup.png)

**Devtective** is a modern GitHub analytics tool that transforms developer data into meaningful insights. Built with Next.js and TypeScript, it provides a comprehensive view of any GitHub user's coding journey through intuitive visualizations and detailed statistics.

---

## ✨ Features

### 📊 **Comprehensive Analytics**

- **User Profile Overview** - View followers, stars, contributions, and profile details at a glance
- **Repository Statistics** - Analyze repositories with sortable metrics (stars, forks, size, last pushed)
- **Language Breakdown** - Interactive charts showing programming language distribution
- **Contribution History** - Visualize commit patterns and activity over time
- **Top Contributing Repos** - Discover which repositories receive the most contributions

### 🎨 **User Experience**

- **Dark Mode Support** - Seamless theme switching for comfortable viewing
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Real-time Data** - Direct integration with GitHub's GraphQL API
- **Smart Caching** - Improved performance with intelligent data caching
- **Lazy Loading** - Load more repositories on demand for better performance

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- A GitHub Personal Access Token

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/devanup/devtective.git
   cd devtective
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your GitHub Personal Access Token:

   ```env
   GITHUB_TOKEN=your_github_token_here
   ```

   > **How to get a GitHub token:**
   >
   > 1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
   > 2. Click "Generate new token (classic)"
   > 3. Give it a name and select these scopes: `repo`, `read:user`
   > 4. Generate and copy the token
   > 5. Paste it into your `.env.local` file

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 🛠️ Technologies Used

| Technology             | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| **Next.js 14**         | React framework with App Router, server-side rendering, and API routes |
| **TypeScript**         | Type-safe code with enhanced developer experience                      |
| **Tailwind CSS**       | Utility-first CSS framework for responsive design                      |
| **Chart.js**           | Interactive and animated data visualizations                           |
| **GitHub GraphQL API** | Efficient data fetching with precise queries                           |
| **Octokit**            | Official GitHub API client for Node.js                                 |
| **next-themes**        | Dark mode support with system preference detection                     |

---

## 🔒 Security

- **Server-side token handling** - GitHub tokens are never exposed to the client
- **Environment variable validation** - Runtime checks ensure proper configuration
- **Secure API routes** - All GitHub API calls proxied through Next.js API routes
- **No vulnerabilities** - Regular dependency updates and security audits

---

## 🎯 Project Structure

```
devtective/
├── src/
│   ├── app/                  # Next.js App Router pages and API routes
│   │   ├── api/             # Server-side API endpoints
│   │   └── page.tsx         # Main application page
│   ├── components/          # React components
│   │   ├── charts/          # Chart components
│   │   ├── repository/      # Repository-related components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility functions and API calls
│   ├── types/               # TypeScript type definitions
│   └── config/              # Configuration files
├── public/                  # Static assets
└── package.json
```

---

## 🌟 Future Enhancements

- Enhanced chart visualizations with more metrics
- Performance optimizations for faster load times
- Advanced filtering and search capabilities
- Organization profile support
- Export analytics to PDF/PNG

---

## 🙏 Acknowledgements

This project was built with inspiration and help from:

- [gh-polyglot](https://www.npmjs.com/package/gh-polyglot) - Language statistics analysis
- [GitHub GraphQL API](https://docs.github.com/en/graphql) - Powerful data querying capabilities
- [Aceternity UI](https://ui.aceternity.com/) - Beautiful UI components

---

## 📝 Notes

- The app uses GitHub's GraphQL API which has rate limits. With authentication, you get 5,000 requests per hour.
- Only public repositories are displayed in the analytics.
- Data is cached for 4 hours to optimize performance and reduce API calls.

---
