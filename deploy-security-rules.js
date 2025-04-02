/**
 * Deploy Firestore and Storage Security Rules
 * 
 * This script deploys security rules to Firebase projects for both Firestore and Storage
 * It requires Firebase CLI to be installed and the user to be logged in
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Execute a command and return the output
 */
function execute(command) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if Firebase CLI is installed
 */
function checkFirebaseCLI() {
  const result = execute('firebase --version');
  if (result.success) {
    console.log(`✅ Firebase CLI installed (${result.output.trim()})`);
    return true;
  } else {
    console.log('❌ Firebase CLI not found. Please install it using:');
    console.log('   npm install -g firebase-tools');
    return false;
  }
}

/**
 * Check if user is logged in to Firebase
 */
function checkFirebaseLogin() {
  const result = execute('firebase projects:list');
  if (result.success) {
    console.log('✅ User is logged in to Firebase');
    return true;
  } else {
    console.log('❌ Not logged in to Firebase. Please login using:');
    console.log('   firebase login');
    return false;
  }
}

/**
 * Get the current Firebase project
 */
function getCurrentProject() {
  const result = execute('firebase projects:list');
  if (result.success) {
    console.log('\nAvailable Firebase projects:');
    console.log(result.output);
    return true;
  } else {
    console.log('❌ Failed to list Firebase projects');
    return false;
  }
}

/**
 * Deploy Firestore security rules
 */
function deployFirestoreRules(projectId) {
  console.log('\n🔒 Deploying Firestore security rules...');
  
  // Make sure the rules file exists
  if (!fs.existsSync('firestore.rules')) {
    console.log('❌ firestore.rules not found');
    return false;
  }
  
  const command = `firebase deploy --only firestore:rules ${projectId ? `--project ${projectId}` : ''}`;
  console.log(`Executing: ${command}`);
  
  const result = execute(command);
  if (result.success) {
    console.log('✅ Firestore rules deployed successfully');
    return true;
  } else {
    console.log('❌ Failed to deploy Firestore rules');
    console.log(result.error);
    return false;
  }
}

/**
 * Deploy Storage security rules
 */
function deployStorageRules(projectId) {
  console.log('\n🔒 Deploying Storage security rules...');
  
  // Make sure the rules file exists
  if (!fs.existsSync('storage.rules')) {
    console.log('❌ storage.rules not found');
    return false;
  }
  
  const command = `firebase deploy --only storage ${projectId ? `--project ${projectId}` : ''}`;
  console.log(`Executing: ${command}`);
  
  const result = execute(command);
  if (result.success) {
    console.log('✅ Storage rules deployed successfully');
    return true;
  } else {
    console.log('❌ Failed to deploy Storage rules');
    console.log(result.error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('=== Firebase Security Rules Deployment ===\n');
  
  // Check prerequisites
  if (!checkFirebaseCLI() || !checkFirebaseLogin()) {
    rl.close();
    return;
  }
  
  // Get current project
  getCurrentProject();
  
  // Ask for project ID
  rl.question('\nEnter Firebase project ID (or leave empty for default project): ', (projectId) => {
    if (projectId) {
      console.log(`Using project: ${projectId}`);
    } else {
      console.log('Using default project from firebase.json');
    }
    
    // Deploy rules
    const firestoreSuccess = deployFirestoreRules(projectId);
    const storageSuccess = deployStorageRules(projectId);
    
    console.log('\n=== Deployment Summary ===');
    console.log(`Firestore Rules: ${firestoreSuccess ? '✅ Deployed' : '❌ Failed'}`);
    console.log(`Storage Rules: ${storageSuccess ? '✅ Deployed' : '❌ Failed'}`);
    
    if (firestoreSuccess && storageSuccess) {
      console.log('\n🎉 All security rules deployed successfully!');
    } else {
      console.log('\n⚠️ Some deployments failed. Check the logs above for details.');
    }
    
    rl.close();
  });
}

// Run the script
main(); 