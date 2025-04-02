/**
 * Security Audit Script
 * 
 * This script performs a basic security audit of the codebase to identify
 * potential security issues and vulnerabilities.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

// ANSI color codes
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

// Config
const config = {
  srcDir: path.join(__dirname, 'src'),
  publicDir: path.join(__dirname, 'public'),
  excludeDirs: ['node_modules', 'build', 'dist', 'coverage'],
  securityFiles: ['firestore.rules', 'storage.rules', '.env.example'],
  patterns: {
    // Security patterns to check in code
    hardcodedSecrets: [
      /['"`].*(?:password|passwd|pass|pwd|secret|key|token|auth|credential).*?=.*?['"`]/i,
      /const\s+(?:apiKey|authKey|secretKey|tokenKey|appKey).*?=/i,
    ],
    insecureRandomness: [
      /Math\.random\(\)/g,
    ],
    potentialXss: [
      /(?:dangerouslySetInnerHTML|\{\s*__html\s*:)/,
      /document\.write\(/,
      /\.innerHTML\s*=/,
    ],
    insecureStorage: [
      /localStorage\.|sessionStorage\./,
    ],
    // Find console.log statements that might leak sensitive data
    consoleStatements: [
      /console\.(log|info|error|warn|debug)\(/,
    ],
    // Check for eval() and similar dangerous functions
    dangerousFunctions: [
      /eval\(|Function\(|new Function\(|setTimeout\(\s*['"`]/,
    ],
    // Check for CDN resources loaded over HTTP
    insecureUrls: [
      /http:\/\/(?!localhost)/,
    ],
  }
};

// Results storage
const results = {
  issues: [],
  warnings: [],
  suggestions: [],
  fileCount: 0,
  issueCount: 0,
  warningCount: 0,
  suggestionCount: 0,
};

/**
 * Run npm audit
 */
function runNpmAudit() {
  console.log(`${colors.cyan}Running npm audit...${colors.reset}`);
  
  try {
    const output = execSync('npm audit --json', { encoding: 'utf8' });
    const auditResults = JSON.parse(output);
    
    const { vulnerabilities } = auditResults;
    
    if (!vulnerabilities) {
      console.log(`${colors.green}No vulnerabilities found.${colors.reset}`);
      return;
    }
    
    // Count by severity
    const severityCounts = {
      info: 0,
      low: 0,
      moderate: 0,
      high: 0,
      critical: 0,
    };
    
    Object.values(vulnerabilities).forEach(vuln => {
      severityCounts[vuln.severity] = (severityCounts[vuln.severity] || 0) + 1;
    });
    
    // Report findings
    if (severityCounts.critical > 0) {
      results.issues.push(`Found ${severityCounts.critical} critical vulnerabilities in dependencies`);
      results.issueCount += severityCounts.critical;
    }
    
    if (severityCounts.high > 0) {
      results.issues.push(`Found ${severityCounts.high} high severity vulnerabilities in dependencies`);
      results.issueCount += severityCounts.high;
    }
    
    if (severityCounts.moderate > 0) {
      results.warnings.push(`Found ${severityCounts.moderate} moderate severity vulnerabilities in dependencies`);
      results.warningCount += severityCounts.moderate;
    }
    
    if (severityCounts.low > 0) {
      results.suggestions.push(`Found ${severityCounts.low} low severity vulnerabilities in dependencies`);
      results.suggestionCount += severityCounts.low;
    }
    
    console.log(`${colors.yellow}Run 'npm audit fix' to attempt automatic fixes${colors.reset}`);
    
  } catch (error) {
    if (error.status === 1 && error.stdout) {
      try {
        const auditResults = JSON.parse(error.stdout);
        const vulns = auditResults.vulnerabilities || {};
        const vulnCount = Object.keys(vulns).length;
        
        if (vulnCount > 0) {
          results.issues.push(`Found ${vulnCount} vulnerabilities in dependencies`);
          results.issueCount += vulnCount;
        }
      } catch (parseError) {
        results.warnings.push('Failed to parse npm audit results');
        results.warningCount++;
      }
    } else {
      results.warnings.push('Failed to run npm audit');
      results.warningCount++;
    }
  }
}

/**
 * Check for security issues in a file
 * 
 * @param {string} filePath Path to the file
 */
function checkFile(filePath) {
  const relPath = path.relative(__dirname, filePath);
  results.fileCount++;
  
  // Skip excluded directories
  if (config.excludeDirs.some(dir => filePath.includes(dir))) {
    return;
  }
  
  // Skip binary files
  const ext = path.extname(filePath).toLowerCase();
  if (['.png', '.jpg', '.gif', '.ico', '.pdf', '.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Check each pattern
    for (const [category, patterns] of Object.entries(config.patterns)) {
      for (const pattern of patterns) {
        const matches = content.match(pattern);
        
        if (matches) {
          for (const match of matches) {
            // Find the line number
            let lineNumber = 0;
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes(match)) {
                lineNumber = i + 1;
                break;
              }
            }
            
            const issue = `${relPath} (line ${lineNumber}): ${getCategoryMessage(category)} - ${match.trim()}`;
            
            switch (category) {
              case 'hardcodedSecrets':
              case 'potentialXss':
              case 'dangerousFunctions':
              case 'insecureUrls':
                results.issues.push(issue);
                results.issueCount++;
                break;
                
              case 'insecureRandomness':
              case 'insecureStorage':
                results.warnings.push(issue);
                results.warningCount++;
                break;
                
              case 'consoleStatements':
                if (process.env.NODE_ENV === 'production' || filePath.includes('production')) {
                  results.warnings.push(issue);
                  results.warningCount++;
                } else {
                  results.suggestions.push(issue);
                  results.suggestionCount++;
                }
                break;
                
              default:
                results.suggestions.push(issue);
                results.suggestionCount++;
            }
          }
        }
      }
    }
  } catch (err) {
    results.warnings.push(`Failed to check file ${relPath}: ${err.message}`);
    results.warningCount++;
  }
}

/**
 * Get a human-readable message for a category
 * 
 * @param {string} category Category name
 * @returns {string} Human-readable message
 */
function getCategoryMessage(category) {
  const messages = {
    hardcodedSecrets: 'Potential hardcoded secret',
    insecureRandomness: 'Insecure randomness',
    potentialXss: 'Potential XSS vulnerability',
    insecureStorage: 'Insecure storage API usage',
    consoleStatements: 'Console statement',
    dangerousFunctions: 'Dangerous function',
    insecureUrls: 'Insecure HTTP URL',
  };
  
  return messages[category] || category;
}

/**
 * Check if Firebase security rules exist
 */
function checkSecurityRules() {
  for (const file of config.securityFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      results.warnings.push(`Missing security file: ${file}`);
      results.warningCount++;
    }
  }
}

/**
 * Print a summary of the audit results
 */
function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.cyan}SECURITY AUDIT SUMMARY${colors.reset}`);
  console.log('='.repeat(80));
  
  console.log(`\n${colors.white}Files scanned: ${results.fileCount}${colors.reset}`);
  console.log(`${colors.red}Issues found: ${results.issueCount}${colors.reset}`);
  console.log(`${colors.yellow}Warnings found: ${results.warningCount}${colors.reset}`);
  console.log(`${colors.blue}Suggestions found: ${results.suggestionCount}${colors.reset}\n`);
  
  if (results.issues.length > 0) {
    console.log(`${colors.red}ISSUES:${colors.reset}`);
    results.issues.forEach(issue => console.log(`❌ ${issue}`));
    console.log('');
  }
  
  if (results.warnings.length > 0) {
    console.log(`${colors.yellow}WARNINGS:${colors.reset}`);
    results.warnings.forEach(warning => console.log(`⚠️ ${warning}`));
    console.log('');
  }
  
  if (results.suggestions.length > 0) {
    console.log(`${colors.blue}SUGGESTIONS:${colors.reset}`);
    results.suggestions.forEach(suggestion => console.log(`ℹ️ ${suggestion}`));
    console.log('');
  }
  
  console.log('='.repeat(80));
  
  if (results.issueCount > 0) {
    console.log(`${colors.red}❌ Security audit found ${results.issueCount} issues that need to be addressed.${colors.reset}`);
    process.exit(1);
  } else if (results.warningCount > 0) {
    console.log(`${colors.yellow}⚠️ Security audit found ${results.warningCount} warnings to review.${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.green}✅ Security audit passed with ${results.suggestionCount} suggestions to consider.${colors.reset}`);
    process.exit(0);
  }
}

/**
 * Run the security audit
 */
function runAudit() {
  console.log(`${colors.cyan}Starting security audit...${colors.reset}`);
  
  // Run npm audit
  runNpmAudit();
  
  // Check security rules
  checkSecurityRules();
  
  // Scan source files
  console.log(`${colors.cyan}Scanning source files...${colors.reset}`);
  
  // Get all relevant files
  const srcFiles = glob.sync(`${config.srcDir}/**/*.{js,jsx,ts,tsx,json,html,css}`);
  const publicFiles = glob.sync(`${config.publicDir}/**/*.{js,jsx,html,css,json}`);
  const rootFiles = glob.sync(`./*.{js,jsx,ts,tsx,json,html,css}`);
  
  const allFiles = [...srcFiles, ...publicFiles, ...rootFiles];
  
  // Check each file
  allFiles.forEach(checkFile);
  
  // Print summary
  printSummary();
}

// Run the audit
runAudit(); 