# PassGuard — Password Security Analyzer

Privacy-first browser-based password strength analyzer and secure password generator.

## Features

- **100% Client-Side Privacy**: Passwords are never sent to any server, database, or API. All analysis happens locally in your browser.
- **Detailed Security Analysis**: Checks for length, character variety, common patterns, repeated characters, and sequential patterns.
- **Entropy & Crack Time Estimates**: Get an educational estimate on how long it would take to crack your password.
- **Actionable Recommendations**: Receive specific tips to improve your password strength.
- **Secure Password Generator**: Generate strong, unpredictable passwords up to 64 characters using cryptographically secure random number generation.
- **Cybersecurity Aesthetic**: Clean, modern, dark-first UI with responsive design.

## Password Privacy Architecture

This application is built with privacy as the top priority.
- No backend server.
- No databases.
- No analytics tracking keystrokes.
- Passwords are kept entirely in React state memory and are destroyed when the page is closed or refreshed.
- Not stored in `localStorage`, `sessionStorage`, or cookies.

## Entropy & Crack Time Methodology

The entropy is calculated based on the character pool size and the length of the password.
The crack time estimate assumes a highly optimized offline brute-force attack capable of 100 billion guesses per second.
**Disclaimer:** Crack time estimates are purely educational and based on blind brute-force guessing against fast modern hardware. Real-world cracking uses dictionaries, rules, and breached databases which are vastly faster. Never treat an estimate as a guarantee.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Deployment**: Vercel

## Local Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## License

MIT License
