#!/bin/bash

TARGET_DIR="/root/lofton"

declare -A replacements
replacements=(
    # Backgrounds
    ["bg-white"]="bg-background"
    ["bg-gray-50"]="bg-accent"
    ["bg-gray-100"]="bg-muted"
    ["bg-gray-200"]="bg-muted"
    ["bg-gray-900"]="bg-background"
    ["bg-slate-50"]="bg-accent"
    ["bg-slate-100"]="bg-muted"
    ["bg-charcoal-dark"]="bg-background"
    ["bg-charcoal"]="bg-foreground"
    
    # Text
    ["text-charcoal"]="text-foreground"
    ["text-charcoal-dark"]="text-foreground"
    ["text-gray-900"]="text-foreground"
    ["text-gray-800"]="text-foreground"
    ["text-gray-700"]="text-foreground"
    ["text-gray-600"]="text-muted-foreground"
    ["text-gray-500"]="text-muted-foreground"
    ["text-gray-400"]="text-muted-foreground/60"
    
    # Borders
    ["border-gray-100"]="border-border"
    ["border-gray-200"]="border-border"
    ["border-gray-500/30"]="border-border/50"
    ["border-gray-800"]="border-border/50"
    
    # Combinations
    ["bg-brand text-white"]="bg-primary text-primary-foreground"
    ["bg-charcoal text-white"]="bg-foreground text-background"
)

for old in "${!replacements[@]}"; do
    new="${replacements[$old]}"
    echo "Replacing '$old' with '$new'..."
    find "$TARGET_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) -not -path "*/node_modules/*" -exec sed -i "s#$old#$new#g" {} +
done

echo "Transformation complete."
