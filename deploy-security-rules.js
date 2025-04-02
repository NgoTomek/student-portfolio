/**
 * Security Rules Deployment Script
 * 
 * This script deploys Firestore and Storage security rules to Firebase.
 * It also performs a basic validation check before deployment.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Paths to rule files
const FIRESTORE_RULES_PATH = path.join(__dirname, 'firestore.rules');
const STORAGE_RULES_PATH = path.join(__dirname, 'storage.rules');

/**
 * Basic validation of security rules
 * 
 * @param {string} rulesPath Path to the rules file
 * @param {string} type Type of rules (firestore or storage)
 * @returns {boolean} Whether the rules are valid
 */
function validateRules(rulesPath, type) {
  try {
    const rules = fs.readFileSync(rulesPath, 'utf8');
    
    if (!rules || rules.trim().length === 0) {
      console.error(`${colors.red}Error: ${type} rules file is empty${colors.reset}`);
      return false;
    }
    
    if (type === 'firestore' && !rules.includes('service cloud.firestore')) {
      console.error(`${colors.red}Error: Firestore rules are missing required 'service cloud.firestore' declaration${colors.reset}`);
      return false;
    }
    
    if (type === 'storage' && !rules.includes('service firebase.storage')) {
      console.error(`${colors.red}Error: Storage rules are missing required 'service firebase.storage' declaration${colors.reset}`);
      return false;
    }
    
    // Simple check for syntax errors in rules
    if (!rules.includes('match /')) {
      console.error(`${colors.red}Error: Rules file is missing match statements${colors.reset}`);
      return false;
    }
    
    console.log(`${colors.green}✓ ${type} rules passed basic validation${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error validating ${type} rules: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Deploy security rules to Firebase
 */
function deployRules() {
  console.log(`${colors.cyan}=== Deploying Security Rules ===${colors.reset}`);
  
  // Validate rules before deployment
  const firestoreRulesValid = validateRules(FIRESTORE_RULES_PATH, 'firestore');
  const storageRulesValid = validateRules(STORAGE_RULES_PATH, 'storage');
  
  if (!firestoreRulesValid || !storageRulesValid) {
    console.error(`${colors.yellow}⚠️ Rules validation failed. Aborting deployment.${colors.reset}`);
    process.exit(1);
  }
  
  try {
    // Check if the user is logged in to Firebase
    try {
      const loginStatus = execSync('firebase login:list').toString();
      if (!loginStatus.includes('✔')) {
        console.log(`${colors.yellow}You need to log in to Firebase first${colors.reset}`);
        execSync('firebase login', { stdio: 'inherit' });
      }
    } catch (error) {
      console.log(`${colors.yellow}You need to log in to Firebase first${colors.reset}`);
      execSync('firebase login', { stdio: 'inherit' });
    }
    
    // Deploy Firestore rules
    console.log(`${colors.cyan}Deploying Firestore security rules...${colors.reset}`);
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Firestore rules deployed successfully${colors.reset}`);
    
    // Deploy Storage rules
    console.log(`${colors.cyan}Deploying Storage security rules...${colors.reset}`);
    execSync('firebase deploy --only storage:rules', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Storage rules deployed successfully${colors.reset}`);
    
    console.log(`${colors.green}=== Security rules deployment completed successfully ===${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error deploying security rules: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Execute the deployment
deployRules(); 