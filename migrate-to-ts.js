/**
 * TypeScript Migration Analysis Script
 * 
 * This script analyzes the project to identify:
 * 1. Files that need to be migrated from JavaScript to TypeScript
 * 2. Duplicate files (both JS and TS versions exist)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Helper function to get base name without extension
function getBaseName(filePath) {
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, parsed.name);
}

// Find all JavaScript and TypeScript files
const jsFiles = glob.sync('src/**/*.js?(x)');
const tsFiles = glob.sync('src/**/*.ts?(x)');

console.log(`Found ${jsFiles.length} JavaScript files`);
console.log(`Found ${tsFiles.length} TypeScript files`);

// Map files by their base name (without extension)
const jsMap = jsFiles.reduce((acc, file) => {
  acc[getBaseName(file)] = file;
  return acc;
}, {});

const tsMap = tsFiles.reduce((acc, file) => {
  acc[getBaseName(file)] = file;
  return acc;
}, {});

// Find duplicates (files that exist in both JS and TS)
const duplicateBaseNames = Object.keys(jsMap).filter(base => tsMap[base]);

console.log(`\nFound ${duplicateBaseNames.length} duplicate files (both JS and TS versions exist):`);

const duplicates = duplicateBaseNames.map(base => ({
  baseName: base,
  js: jsMap[base],
  ts: tsMap[base]
}));

duplicates.forEach((dup, index) => {
  console.log(`${index + 1}. ${dup.baseName}`);
  console.log(`   JS: ${dup.js}`);
  console.log(`   TS: ${dup.ts}`);
});

// List JS files that need to be migrated (excluding duplicates)
const jsToMigrate = jsFiles.filter(file => !duplicateBaseNames.includes(getBaseName(file)));

console.log(`\nJavaScript files to migrate (${jsToMigrate.length}):`);
jsToMigrate.forEach(file => console.log(`- ${file}`));

// Save analysis to JSON file for other scripts to use
const analysisData = {
  jsFiles,
  tsFiles,
  duplicates,
  jsToMigrate
};

fs.writeFileSync('migration-analysis.json', JSON.stringify(analysisData, null, 2));
console.log('\nAnalysis saved to migration-analysis.json');

// Provide summary
console.log('\nSummary:');
console.log(`- Total JavaScript files: ${jsFiles.length}`);
console.log(`- Total TypeScript files: ${tsFiles.length}`);
console.log(`- Duplicate files: ${duplicateBaseNames.length}`);
console.log(`- Files to migrate: ${jsToMigrate.length}`);
console.log('\nNext steps:');
console.log('1. Remove duplicate JavaScript files where TypeScript versions exist');
console.log('2. Convert remaining JavaScript files to TypeScript');
console.log('3. Update imports throughout the project'); 