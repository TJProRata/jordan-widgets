#!/bin/bash

# Update all HTML files in pages directory to move logo to right side

for file in /Users/tjmcgovern/jordan_widgets/pages/*.html; do
    echo "Updating $file..."

    # Create a temporary file
    temp_file="${file}.tmp"

    # Read the file and make replacements
    awk '
    /<div class="nav-left">/ {
        print "                <div class=\"nav-left\">"
        in_nav_left = 1
        next
    }

    in_nav_left && /<a href="\.\.\/index\.html" class="logo-link">/ {
        # Skip the logo link and following lines until closing </a>
        skip_logo = 1
        next
    }

    skip_logo && /<\/a>/ {
        skip_logo = 0
        next
    }

    skip_logo {
        next
    }

    /<div class="nav-right">/ {
        in_nav_left = 0
        print "                <div class=\"nav-right\">"
        print "                    <a href=\"../index.html\" class=\"logo-link\">"
        print "                        <div class=\"logo\">"
        print "                            <img src=\"../assets/images/theatlantic.png\" alt=\"The Atlantic\" class=\"logo-image\">"
        print "                        </div>"
        print "                    </a>"
        next
    }

    {print}
    ' "$file" > "$temp_file"

    # Replace the original file
    mv "$temp_file" "$file"
done

echo "All HTML files updated!"