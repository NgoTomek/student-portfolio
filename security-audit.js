/**
 * Security Audit Script
 * 
 * This script scans the codebase for potential security issues:
 * - Firebase API keys exposed in client-side code
 * - Missing authentication checks
 * - Insecure data validation
 * - Insecure direct object references
 * - Cross-site scripting vulnerabilities
 * - Missing Content Security Policy
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const SCAN_DIRECTORIES = ['src', 'public'];
const IGNORE_DIRECTORIES = ['node_modules', 'build', 'dist'];
const ISSUES_OUTPUT_FILE = 'security-audit-results.json';

// Define security checks and patterns
const securityChecks = [
  {
    name: 'Exposed API Keys',
    description: 'API keys or secrets should not be hardcoded in the source code',
    patterns: [
      /apiKey:\s*["'][\w-]{20,}["']/g,
      /key:\s*["'][\w-]{20,}["']/g,
      /secret:\s*["'][\w-]{20,}["']/g,
      /password:\s*["'][\w-]{8,}["']/g,
      /AIza[\w-]{35}/g // Google API key pattern
    ],
    severity: 'Critical',
    remediation: 'Use environment variables (.env) to store sensitive data and make sure to add .env to .gitignore'
  },
  {
    name: 'Missing Authentication',
    description: 'Database or storage operations without auth checks',
    patterns: [
      /firestore\(\)\.collection\(.*\)\.get\(\)/g,
      /firestore\(\)\.collection\(.*\)\.set\(\)/g,
      /firestore\(\)\.collection\(.*\)\.add\(\)/g,
      /firestore\(\)\.collection\(.*\)\.delete\(\)/g,
      /firebase\.storage\(\)\.ref\(\)/g
    ],
    severity: 'High',
    remediation: 'Add authentication checks before database operations and implement security rules in Firebase'
  },
  {
    name: 'Insecure Data Validation',
    description: 'Using data without proper validation',
    patterns: [
      /(?<!validateWith)\(JSON\.parse\((.*?)\)\)/g,
      /(?<!validateWith)\(eval\((.*?)\)\)/g,
      /\.innerHTML\s*=/g,
      /dangerouslySetInnerHTML/g,
    ],
    severity: 'High',
    remediation: 'Implement proper data validation, sanitize all user input, and avoid using innerHTML/dangerouslySetInnerHTML'
  },
  {
    name: 'Cross-Site Scripting (XSS)',
    description: 'Potential XSS vulnerabilities',
    patterns: [
      /document\.write\(/g,
      /\.innerHTML\s*=/g,
      /dangerouslySetInnerHTML/g,
      /href\s*=\s*{.*}/g
    ],
    severity: 'High',
    remediation: 'Sanitize user input, avoid using innerHTML/dangerouslySetInnerHTML, and use proper encoding'
  },
  {
    name: 'Insecure Direct Object References',
    description: 'Accessing resources directly by user-controlled input',
    patterns: [
      /params\.id/g,
      /useParams\(\)/g,
      /params\['.*'\]/g,
      /params\[".*"\]/g,
    ],
    severity: 'Medium',
    remediation: 'Add authorization checks to ensure users can only access their own resources'
  },
  {
    name: 'Missing Content Security Policy',
    description: 'No Content Security Policy found',
    patterns: [],
    fileCheck: (filePath, content) => {
      if (filePath.includes('public/index.html')) {
        return !content.includes('<meta http-equiv="Content-Security-Policy"');
      }
      return false;
    },
    severity: 'Medium',
    remediation: 'Add a Content Security Policy to your HTML or as HTTP headers'
  },
  {
    name: 'Insecure Firebase Rules',
    description: 'Overly permissive Firebase rules',
    fileCheck: (filePath, content) => {
      if (filePath.endsWith('firestore.rules') || filePath.endsWith('storage.rules')) {
        return content.includes('allow read, write: if true') || 
               content.includes('allow read: if true') && content.includes('allow write: if true');
      }
      return false;
    },
    severity: 'Critical',
    remediation: 'Implement proper security rules for Firestore and Storage'
  }
];

// Found issues
const issues = [];

/**
 * Scan a file for security issues
 */
function scanFile(filePath) {
  // Skip ignored directories
  if (IGNORE_DIRECTORIES.some(dir => filePath.includes(dir))) {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Run pattern-based checks
    securityChecks.forEach(check => {
      if (check.patterns) {
        check.patterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => {
              const lineNumber = getLineNumber(content, match);
              issues.push({
                check: check.name,
                description: check.description,
                file: filePath,
                line: lineNumber,
                match: match,
                severity: check.severity,
                remediation: check.remediation
              });
            });
          }
        });
      }
      
      // Run custom file checks
      if (check.fileCheck && check.fileCheck(filePath, content)) {
        issues.push({
          check: check.name,
          description: check.description,
          file: filePath,
          line: null,
          match: null,
          severity: check.severity,
          remediation: check.remediation
        });
      }
    });
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error.message);
  }
}

/**
 * Get the line number for a matched string in content
 */
function getLineNumber(content, match) {
  const index = content.indexOf(match);
  if (index === -1) return -1;
  
  const lines = content.substring(0, index).split('\n');
  return lines.length;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Starting security audit...');
  
  // Get all files to scan
  let filesToScan = [];
  SCAN_DIRECTORIES.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = glob.sync(`${dir}/**/*`, { nodir: true });
      filesToScan = filesToScan.concat(files);
    }
  });
  
  console.log(`Found ${filesToScan.length} files to scan`);
  
  // Scan each file
  filesToScan.forEach(filePath => {
    scanFile(filePath);
  });
  
  // Group issues by severity
  const criticalIssues = issues.filter(issue => issue.severity === 'Critical');
  const highIssues = issues.filter(issue => issue.severity === 'High');
  const mediumIssues = issues.filter(issue => issue.severity === 'Medium');
  
  // Print summary
  console.log('\n--- Security Audit Results ---');
  console.log(`🔴 Critical issues: ${criticalIssues.length}`);
  console.log(`🟠 High issues: ${highIssues.length}`);
  console.log(`🟡 Medium issues: ${mediumIssues.length}`);
  console.log(`🟢 Total issues: ${issues.length}`);
  
  // Print critical issues
  if (criticalIssues.length > 0) {
    console.log('\n--- Critical Issues ---');
    criticalIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.check} - ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
      console.log(`   ${issue.description}`);
      if (issue.match) console.log(`   Match: ${issue.match}`);
      console.log(`   Remediation: ${issue.remediation}`);
      console.log();
    });
  }
  
  // Save all issues to file
  fs.writeFileSync(ISSUES_OUTPUT_FILE, JSON.stringify({
    summary: {
      critical: criticalIssues.length,
      high: highIssues.length,
      medium: mediumIssues.length,
      total: issues.length
    },
    issues: issues
  }, null, 2));
  
  console.log(`\nFull results saved to ${ISSUES_OUTPUT_FILE}`);
  console.log('\nNext steps:');
  console.log('1. Address all critical issues immediately');
  console.log('2. Plan to fix high and medium issues');
  console.log('3. Run this audit regularly to check for new issues');
}

main(); 