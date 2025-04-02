/**
 * This script helps clean up duplicate files by analyzing imports and redirecting them to the TypeScript versions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read the migration analysis
const migrationData = JSON.parse(fs.readFileSync('migration-analysis.json', 'utf8'));
const { duplicates } = migrationData;

console.log('\n=== Resolving Duplicate Files ===\n');

// Create a map of JS files to their TS counterparts
const redirectMap = duplicates.reduce((map, dup) => {
  const jsPath = dup.js.replace(/^src\//, '');
  const tsPath = dup.ts.replace(/^src\//, '');
  map[path.basename(jsPath)] = tsPath;
  map[jsPath] = tsPath;
  return map;
}, {});

// Find .js and .jsx files that import the duplicate files
let filesToUpdate = [];
const tsFiles = fs.readdirSync('src', { recursive: true })
  .filter(file => file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx'))
  .map(file => path.join('src', file));

// Check each file for imports that need to be updated
for (const file of tsFiles) {
  let needsUpdate = false;
  let fileContent = fs.readFileSync(file, 'utf8');
  
  // For each known duplicate, check if this file imports it
  for (const [jsPath, tsPath] of Object.entries(redirectMap)) {
    const baseName = path.basename(jsPath, path.extname(jsPath));
    const baseNameTs = path.basename(tsPath, path.extname(tsPath));
    
    // Check for various import patterns
    const importPatterns = [
      `from './${baseName}'`,
      `from "../${baseName}"`,
      `from './${baseName}.js'`,
      `from './${baseName}.jsx'`,
      `from "${jsPath}"`,
      `from './${path.dirname(jsPath)}/${baseName}'`
    ];
    
    for (const pattern of importPatterns) {
      if (fileContent.includes(pattern)) {
        needsUpdate = true;
        break;
      }
    }
  }
  
  if (needsUpdate) {
    filesToUpdate.push(file);
  }
}

console.log(`Found ${filesToUpdate.length} files that need import updates.`);

// For each duplicate file, delete the JS version
for (const dup of duplicates) {
  console.log(`Deleting duplicate file: ${dup.js}`);
  try {
    if (fs.existsSync(dup.js)) {
      fs.unlinkSync(dup.js);
      console.log(`✅ Successfully deleted ${dup.js}`);
    } else {
      console.log(`⚠️ File ${dup.js} not found to delete`);
    }
  } catch (error) {
    console.error(`❌ Error deleting ${dup.js}:`, error.message);
  }
}

// Add a .gitignore rule to ignore migration files
const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
if (!gitignoreContent.includes('migration-analysis.json')) {
  fs.appendFileSync('.gitignore', '\n# Migration files\nmigration-analysis.json\n');
  console.log('Added migration-analysis.json to .gitignore');
}

// Generate a script to manually update the imports
const updateScript = `
# Update imports in these files manually:
${filesToUpdate.map(file => `echo "Checking ${file} for import updates"`).join('\n')}

# Redirect map:
${Object.entries(redirectMap).map(([js, ts]) => `# ${js} -> ${ts}`).join('\n')}
`;

fs.writeFileSync('update-imports.sh', updateScript);
console.log('\nCreated update-imports.sh with instructions for updating imports');

console.log('\nNext steps:');
console.log('1. Run linting to see if deletion caused any issues: npm run lint');
console.log('2. Check the files in update-imports.sh and update imports manually');
console.log('3. Run tests to ensure functionality still works: npm test');
console.log('4. Continue with the TypeScript migration for remaining JS files'); 