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

## Testing & Quality Assurance

### Running Tests
The application includes automated tests to ensure quality and stability. To run the tests:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage
```

### Manual Testing Checklist
Before deploying new features, go through this testing checklist:

1. **Authentication Testing**
   - [ ] User registration with email validation
   - [ ] User login/logout
   - [ ] Password reset functionality
   - [ ] Authentication redirects working properly

2. **Portfolio Management**
   - [ ] Create and edit personal information
   - [ ] Add/edit/delete projects
   - [ ] Add/edit/delete skills and categories
   - [ ] Add/edit/delete leadership experiences
   - [ ] Update contact information
   - [ ] Toggle portfolio publication status

3. **Public Portfolio Views**
   - [ ] Public portfolio displays correctly
   - [ ] Portfolio directory shows published portfolios
   - [ ] Contact form works on public portfolios
   - [ ] Navigation between sections works

4. **Security Testing**
   - [ ] Unauthorized users cannot access protected routes
   - [ ] Users cannot modify other users' portfolios
   - [ ] URL validation prevents XSS attacks
   - [ ] Input sanitization works properly

5. **Responsive Design**
   - [ ] Test on mobile devices (or using browser dev tools)
   - [ ] Test on tablets (or using browser dev tools)
   - [ ] Test on desktop browsers

6. **Offline Functionality**
   - [ ] Test application behavior when going offline
   - [ ] Verify offline notification appears
   - [ ] Check that data is preserved when reconnecting

7. **Performance**
   - [ ] Load time is reasonable
   - [ ] Scrolling and interactions are smooth
   - [ ] Images are properly optimized

### Browser Compatibility
Ensure the application works properly on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

#### Firebase Connection Issues
If you experience issues connecting to Firebase:
1. Check your environment variables to ensure Firebase configuration is correct
2. Verify your Firebase project is active and services (Authentication, Firestore, Storage) are enabled
3. Test your network connection and ensure Firebase domains are not blocked

#### TypeScript Errors
If you encounter TypeScript errors:
1. Run `npm install` to ensure all dependencies are properly installed
2. Check for type definition issues and update as needed
3. Run `npx tsc --noEmit` to verify TypeScript compilation

#### Deployment Issues
If deployment fails:
1. Ensure you're logged in to Firebase CLI with `firebase login`
2. Check your Firebase project permissions
3. Verify your project has the necessary services enabled
4. Review the firebase.json configuration

For more help, refer to the [Firebase documentation](https://firebase.google.com/docs) or open an issue in the project repository.
