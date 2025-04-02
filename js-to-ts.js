/**
 * JavaScript to TypeScript Conversion Helper
 * 
 * This script helps convert a single JavaScript file to TypeScript by:
 * 1. Creating a basic TypeScript version of the file
 * 2. Adding type annotations placeholders
 * 3. Preserving the original JS file until migration is complete
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Add basic type annotations to a JavaScript file
 */
function convertToTypeScript(content) {
  // Replace React component to add React import and types
  content = content.replace(
    /import React(.*?)from ['"]react['"];?/g, 
    "import React$1from 'react';"
  );
  
  // If no React import but uses JSX, add it
  if (!content.includes("import React") && 
      (content.includes("function ") || content.includes("const ")) && 
      (content.includes("return (") || content.includes("return ("))) {
    content = "import React from 'react';\n" + content;
  }
  
  // Add basic prop types for components
  content = content.replace(
    /function ([A-Z][a-zA-Z0-9_]*)\s*\(\s*(\{[^}]*\}|\w+)\s*\)/g,
    "function $1($2: any)"
  );
  
  content = content.replace(
    /const ([A-Z][a-zA-Z0-9_]*)\s*=\s*\(\s*(\{[^}]*\}|\w+)\s*\)\s*=>/g,
    "const $1 = ($2: any) =>"
  );
  
  // Add type annotations for useState
  content = content.replace(
    /const \[(\w+), set([A-Z]\w+)\] = useState\((.*?)\);/g,
    "const [$1, set$2] = useState<any>($3);"
  );
  
  // Add type annotations for variables where possible
  content = content.replace(
    /const (\w+) = \[\];/g,
    "const $1: any[] = [];"
  );
  
  content = content.replace(
    /const (\w+) = \{\};/g,
    "const $1: Record<string, any> = {};"
  );
  
  // Add type annotations for event handlers
  content = content.replace(
    /(function |const )(\w+)\s*=\s*\((e|event)\)\s*=>/g,
    "$1$2 = ($3: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>"
  );
  
  // Add type annotations for form event handlers
  content = content.replace(
    /(function |const )(\w+)\s*=\s*\((e|event)\)\s*=>\s*\{\s*e\.preventDefault/g,
    "$1$2 = ($3: React.FormEvent<HTMLFormElement>) => {\n  $3.preventDefault"
  );
  
  // Add interface for props
  if ((content.includes("function ") || content.includes("const ")) && 
      content.match(/([A-Z][a-zA-Z0-9_]*)\s*\(\s*(\{[^}]*\}|\w+)/)) {
    const componentName = content.match(/([A-Z][a-zA-Z0-9_]*)\s*\(\s*(\{[^}]*\}|\w+)/)[1];
    
    if (content.match(/\{\s*([^{}]+?)\s*\}/)) {
      const propsMatch = content.match(/\{\s*([^{}]+?)\s*\}/);
      if (propsMatch) {
        const props = propsMatch[1].split(',').map(prop => prop.trim());
        const propsInterface = 
`interface ${componentName}Props {
  ${props.map(prop => `${prop}: any;`).join('\n  ')}
}`;
      
        // Insert interface before the component
        const componentMatch = content.match(new RegExp(`(function|const)\\s+${componentName}`));
        if (componentMatch) {
          const index = content.indexOf(componentMatch[0]);
          content = content.slice(0, index) + propsInterface + '\n\n' + content.slice(index);
          
          // Update component to use the interface
          content = content.replace(
            new RegExp(`${componentName}\\s*\\(([^)]*)\\)\\s*:\\s*any`),
            `${componentName}($1): ${componentName}Props`
          );
        }
      }
    }
  }
  
  return content;
}

/**
 * Convert a file from JavaScript to TypeScript
 */
function convertFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File ${filePath} does not exist`);
    return false;
  }
  
  const ext = path.extname(filePath);
  if (!['.js', '.jsx'].includes(ext)) {
    console.error(`File ${filePath} is not a JavaScript file`);
    return false;
  }
  
  const tsExt = ext === '.js' ? '.ts' : '.tsx';
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const outputPath = filePath.replace(ext, tsExt);
  
  // Check if TS file already exists
  if (fs.existsSync(outputPath)) {
    console.warn(`TypeScript file ${outputPath} already exists. Skipping...`);
    return false;
  }
  
  // Convert to TypeScript
  const tsContent = convertToTypeScript(fileContent);
  
  // Write to new TS file
  fs.writeFileSync(outputPath, tsContent);
  console.log(`✅ Created TypeScript file: ${outputPath}`);
  
  // Add TODO comments to help with manual conversion
  console.log('\n== Manual steps needed: ==');
  console.log('1. Add proper type annotations to replace "any" types');
  console.log('2. Fix any TS errors in the new file');
  console.log('3. Update imports to reference the TS file');
  console.log(`4. Once everything works, delete the original JS file: ${filePath}`);
  
  return true;
}

// Main function
function main() {
  if (process.argv.length < 3) {
    console.log('Please provide a JavaScript file path to convert');
    console.log('Usage: node js-to-ts.js path/to/file.js');
    rl.close();
    return;
  }
  
  const filePath = process.argv[2];
  console.log(`Converting ${filePath} to TypeScript...`);
  
  convertFile(filePath);
  rl.close();
}

main(); 