# Student Portfolio Application

A modern, responsive web application for students to showcase their portfolios, projects, leadership experiences, and skills.

## Key Features

- User authentication
- Portfolio creation and management
- Project showcase
- Skills display
- Leadership experience tracking
- Contact information management
- Responsive design for all devices

## Security Improvements

This application has been secured with the following measures:

1. **Secure Firebase Configuration**
   - Environment variables for sensitive credentials
   - No hardcoded API keys or credentials
   - Proper Firebase security rules for databases and storage

2. **Data Security**
   - User-specific data access controls
   - Content validation before storage
   - Protection against unauthorized access

3. **Frontend Security**
   - Input validation
   - Protection against XSS attacks
   - Secure authentication flows

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase account with Firestore database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/student-portfolio.git
cd student-portfolio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Fill in your Firebase credentials in the `.env` file

5. Start the development server
```bash
npm start
```

## Deployment

### Deploying to Firebase

1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

2. Login to Firebase
```bash
firebase login
```

3. Build the application
```bash
npm run build
```

4. Deploy the application
```bash
npm run deploy
```

### Security Rules Deployment

The application includes custom security rules for Firestore and Storage. Deploy them separately:

```bash
npm run deploy:rules
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Security Considerations

For a comprehensive security plan and ongoing improvements, refer to [SECURITY-PLAN.md](./SECURITY-PLAN.md).

## Architecture

The application uses:

- React with TypeScript for frontend
- Firebase Authentication, Firestore, and Storage
- React Router for navigation
- Formik and Yup for form validation
- Zustand for state management
- TailwindCSS for styling

## Contributing

1. Follow the TypeScript migration plan in [migrate-to-ts.js](./migrate-to-ts.js)
2. Adhere to the security guidelines in [SECURITY-PLAN.md](./SECURITY-PLAN.md)
3. Ensure all new code has proper TypeScript typings
4. Write tests for new functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.
