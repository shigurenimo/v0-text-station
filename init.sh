#!/bin/bash

# Directory containing instruction files
INSTRUCTION_DIR=".github/instructions"

# Function to remove front matter from a file
remove_front_matter() {
    local file="$1"
    local in_frontmatter=false
    local frontmatter_count=0
    
    while IFS= read -r line; do
        if [[ "$line" == "---" ]]; then
            if [[ $frontmatter_count -eq 0 ]]; then
                in_frontmatter=true
                frontmatter_count=1
            elif [[ $frontmatter_count -eq 1 ]]; then
                in_frontmatter=false
                frontmatter_count=2
                continue
            fi
        fi
        
        if [[ $in_frontmatter == false && $frontmatter_count -ne 1 ]]; then
            echo "$line"
        fi
    done < "$file"
}

# Initialize output files
> .clinerules
> CLAUDE.md

# Process all instruction files
for file in $(find "$INSTRUCTION_DIR" -name "*.instructions.md" -type f | sort); do
    # Remove front matter and append to output files
    content=$(remove_front_matter "$file" | sed -e '/^[[:space:]]*$/d')
    
    # Only add content if it's not empty
    if [[ -n "$content" ]]; then
        echo "$content" >> .clinerules
        echo "$content" >> CLAUDE.md
    fi
done

# No need to add trailing newlines since we want no empty lines
