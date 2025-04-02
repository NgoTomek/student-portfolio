# Student Portfolio Deployment Guide

This guide covers the deployment process for the Student Portfolio application, including important security considerations.

## Prerequisites

1. Node.js and npm installed
2. Firebase CLI: `npm install -g firebase-tools`
3. Firebase account with a configured project
4. Proper environment variables set up

## Environment Setup

1. **Create Environment Variables**

   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Fill in your actual Firebase configuration values in the `.env` file:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

   **WARNING: Never commit your .env file to version control!**

2. **Login to Firebase CLI**
   ```bash
   firebase login
   ```

3. **Select Firebase Project**
   ```bash
   firebase use your_project_id
   # Or to use the default project configured in .firebaserc
   firebase use default
   ```

## Security Configuration

1. **Deploy Security Rules Using Script**
   We've created a script to make this process easier:
   ```bash
   npm run deploy:rules
   ```
   
   This script will:
   - Check if Firebase CLI is installed
   - Verify you're logged in to Firebase
   - List available projects
   - Allow you to select a project ID
   - Deploy both Firestore and Storage rules

2. **Manual Security Rules Deployment**
   If you prefer manual deployment:

   **Deploy Firestore Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

   **Deploy Storage Security Rules**
   ```bash
   firebase deploy --only storage:rules
   ```

3. **Verify Security Rules**
   - Go to Firebase Console > Firestore > Rules
   - Go to Firebase Console > Storage > Rules
   - Ensure the rules match what's in your `firestore.rules` and `storage.rules` files

4. **Security Audit**
   Run the security audit script to check for potential issues:
   ```bash
   npm run security
   ```
   Review the results in `security-audit-results.json` and address any critical issues.

5. **Set Up Authentication Methods**
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable Email/Password authentication
   - Configure any other auth providers you want to use

## Application Deployment

1. **Run TypeScript Migration (if needed)**
   If you have JavaScript files that need to be migrated:
   ```bash
   # Analyze which files need to be converted
   npm run analyze
   
   # Fix duplicate files (files with both JS and TS versions)
   npm run fix-duplicates
   
   # Convert a specific file from JS to TS
   npm run convert src/components/YourComponent.jsx
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```
   This creates optimized production files in the `build` directory.

3. **Deploy to Firebase Hosting**
   
   Deploy everything (hosting, security rules, etc.):
   ```bash
   npm run deploy
   ```
   
   Or deploy only the hosting:
   ```bash
   npm run deploy:hosting
   ```

4. **Verify Deployment**
   - Open the deployed URL (shown in the console after deployment)
   - Test all critical functionality
   - Check for any console errors

## Post-Deployment

1. **Set Up Custom Domain (optional)**
   - Go to Firebase Console > Hosting > Add custom domain
   - Follow the instructions to verify domain ownership
   - Configure DNS settings

2. **Enable Analytics (optional)**
   - Go to Firebase Console > Analytics
   - Follow the setup instructions

3. **Set Up Monitoring**
   - Go to Firebase Console > Crashlytics
   - Enable crash reporting
   - Set up alerts for critical issues

## CI/CD Setup (Advanced)

1. **GitHub Actions Setup**
   Create a `.github/workflows/firebase-deploy.yml` file:

   ```yaml
   name: Deploy to Firebase
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build_and_deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '16'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Create env file
           run: |
             echo "REACT_APP_FIREBASE_API_KEY=${{ secrets.FIREBASE_API_KEY }}" >> .env
             echo "REACT_APP_FIREBASE_AUTH_DOMAIN=${{ secrets.FIREBASE_AUTH_DOMAIN }}" >> .env
             echo "REACT_APP_FIREBASE_PROJECT_ID=${{ secrets.FIREBASE_PROJECT_ID }}" >> .env
             echo "REACT_APP_FIREBASE_STORAGE_BUCKET=${{ secrets.FIREBASE_STORAGE_BUCKET }}" >> .env
             echo "REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}" >> .env
             echo "REACT_APP_FIREBASE_APP_ID=${{ secrets.FIREBASE_APP_ID }}" >> .env
             echo "REACT_APP_FIREBASE_MEASUREMENT_ID=${{ secrets.FIREBASE_MEASUREMENT_ID }}" >> .env
           
         - name: Build
           run: npm run build
           
         - name: Deploy to Firebase
           uses: FirebaseExtended/action-hosting-deploy@v0
           with:
             repoToken: '${{ secrets.GITHUB_TOKEN }}'
             firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
             channelId: live
             projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
   ```

2. **Configure GitHub Secrets**
   - Go to your GitHub repository > Settings > Secrets and variables > Actions
   - Add all the required environment variables and Firebase service account key

## Troubleshooting

1. **Deployment Fails**
   - Check Firebase CLI is up to date: `npm install -g firebase-tools`
   - Verify you're logged in: `firebase login`
   - Check for build errors: `npm run build`
   - Check Firebase project exists and you have permissions

2. **Security Rules Rejected**
   - Check syntax in your rules files
   - Ensure rules follow Firebase security rules format
   - Test your rules in the Firebase Console rules playground

3. **Environment Variables Not Working**
   - Ensure `.env` file is in the root directory
   - Verify variable names start with `REACT_APP_`
   - Rebuild the application: `npm run build`
   - Check that variables are properly referenced in your code

## Support

If you encounter issues with deployment:
1. Refer to the [Firebase CLI documentation](https://firebase.google.com/docs/cli)
2. Check the [Firebase Hosting documentation](https://firebase.google.com/docs/hosting)
3. Review the [Firebase Security Rules documentation](https://firebase.google.com/docs/rules)
4. Ask for help in the [Firebase Community](https://firebase.google.com/community) 