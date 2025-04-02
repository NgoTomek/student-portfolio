/**
 * TypeScript Checking Script
 * 
 * This script runs the TypeScript compiler in type-checking mode to identify
 * type errors without generating output files.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Check if tsconfig.json exists
 */
function checkTsConfig() {
  const tsConfigPath = path.join(__dirname, 'tsconfig.json');
  
  if (!fs.existsSync(tsConfigPath)) {
    console.error(`${colors.red}Error: tsconfig.json not found in project root${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.green}✓ Found tsconfig.json${colors.reset}`);
  return true;
}

/**
 * Count TypeScript files in the project
 */
function countTsFiles() {
  try {
    const { execSync } = require('child_process');
    const output = execSync('find src -type f -name "*.ts" -o -name "*.tsx" | wc -l', { encoding: 'utf8' });
    const count = parseInt(output.trim(), 10);
    
    console.log(`${colors.blue}Found ${count} TypeScript files in the project${colors.reset}`);
    return count;
  } catch (error) {
    console.error(`${colors.yellow}Warning: Could not count TypeScript files${colors.reset}`);
    return 0;
  }
}

/**
 * Run TypeScript compiler in type-check mode
 */
function runTypeCheck() {
  console.log(`${colors.cyan}Running TypeScript type checking...${colors.reset}`);
  
  try {
    // Note: --noEmit flag tells the compiler to only check types without generating output files
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log(`${colors.green}✓ TypeScript check passed. No type errors found.${colors.reset}`);
    return true;
  } catch (error) {
    // TypeScript compiler returns non-zero exit code if there are errors
    console.error(`${colors.red}✗ TypeScript check failed with errors.${colors.reset}`);
    return false;
  }
}

/**
 * Check unused exports using ts-prune if available
 */
function checkUnusedExports() {
  console.log(`${colors.cyan}Checking for unused exports...${colors.reset}`);
  
  try {
    // Check if ts-prune is installed
    execSync('npx ts-prune --version', { stdio: 'ignore' });
    
    // Run ts-prune
    const output = execSync('npx ts-prune', { encoding: 'utf8' });
    
    if (output.trim()) {
      console.log(`${colors.yellow}Unused exports found:${colors.reset}`);
      console.log(output);
      console.log(`${colors.yellow}Consider removing or using these exports${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ No unused exports found${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.blue}Note: Install ts-prune to check for unused exports: npm install -D ts-prune${colors.reset}`);
  }
}

/**
 * Add a type checking command to package.json if it doesn't exist
 */
function addTypeCheckCommand() {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check if typecheck command already exists
    if (packageJson.scripts && !packageJson.scripts.typecheck) {
      packageJson.scripts.typecheck = 'tsc --noEmit';
      
      // Add the command to package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`${colors.green}✓ Added "typecheck" command to package.json${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.yellow}Warning: Could not add typecheck command to package.json${colors.reset}`);
  }
}

/**
 * Main function
 */
function main() {
  console.log(`${colors.cyan}=== TypeScript Type Checking ===${colors.reset}`);
  
  // Check if tsconfig.json exists
  if (!checkTsConfig()) {
    process.exit(1);
  }
  
  // Count TypeScript files
  const tsFileCount = countTsFiles();
  
  if (tsFileCount === 0) {
    console.log(`${colors.yellow}No TypeScript files found in the project${colors.reset}`);
    process.exit(0);
  }
  
  // Run type checking
  const typeCheckSuccess = runTypeCheck();
  
  // Check for unused exports
  checkUnusedExports();
  
  // Add type checking command to package.json
  addTypeCheckCommand();
  
  console.log(`${colors.cyan}=== TypeScript Check Complete ===${colors.reset}`);
  
  // Exit with success or error
  process.exit(typeCheckSuccess ? 0 : 1);
}

// Run the main function
main(); 