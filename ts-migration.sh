#!/bin/bash

# TypeScript Migration Script
# This script automates the TypeScript migration process for the Student Portfolio app

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===== Student Portfolio TypeScript Migration =====${NC}"
echo -e "${YELLOW}This script will help migrate your project to TypeScript${NC}"

# Step 1: Analyze the current state of the codebase
echo -e "\n${GREEN}Step 1: Analyzing codebase for migration...${NC}"
node migrate-to-ts.js

# Step 2: Fix duplicate files by keeping TypeScript versions
echo -e "\n${GREEN}Step 2: Resolving duplicate JavaScript/TypeScript files...${NC}"
node fix-duplicate-files.js

# Step 3: Check for TypeScript errors
echo -e "\n${GREEN}Step 3: Running TypeScript check...${NC}"
npx tsc --noEmit

# Create a list of files to convert
echo -e "\n${GREEN}Step 4: Creating list of files to convert to TypeScript...${NC}"
FILES_TO_CONVERT=$(jq -r '.jsToMigrate[]' migration-analysis.json)

# Step 5: Convert each file one by one
echo -e "\n${GREEN}Step 5: Converting files to TypeScript...${NC}"
echo -e "${YELLOW}This process will convert one file at a time.${NC}"

# Count how many files need conversion
FILE_COUNT=$(echo "$FILES_TO_CONVERT" | wc -l)
echo -e "${BLUE}Found $FILE_COUNT files to convert${NC}"

# Process each file
i=1
for file in $FILES_TO_CONVERT; do
  echo -e "\n${BLUE}[$i/$FILE_COUNT] Converting: $file${NC}"
  node js-to-ts.js "$file"
  
  # Prompt user to continue
  if [ $i -lt $FILE_COUNT ]; then
    read -p "Press Enter to continue with the next file or Ctrl+C to stop..."
  fi
  
  i=$((i+1))
done

# Step 6: Run TypeScript check again
echo -e "\n${GREEN}Step 6: Running TypeScript check after conversion...${NC}"
npx tsc --noEmit

echo -e "\n${BLUE}===== Migration process completed! =====${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Resolve any remaining TypeScript errors"
echo -e "2. Update imports to reference TypeScript files"
echo -e "3. Run 'npm run lint' to check for any linting issues"
echo -e "4. Run 'npm test' to ensure functionality still works"
