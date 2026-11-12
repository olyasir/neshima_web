#!/bin/sh
set -eu

stylesheet="$1"
shift

for page in "$@"; do
  awk -v css="$stylesheet" '
    /<link rel="stylesheet" href="styles.css" \/>/ {
      print "  <style>"
      while ((getline line < css) > 0) print line
      close(css)
      print "  </style>"
      inlined = 1
      next
    }
    { print }
    END { if (!inlined) exit 1 }
  ' "$page" > "$page.inlined" || { echo "inline-styles: no styles.css link in $page" >&2; exit 1; }
  mv "$page.inlined" "$page"
done
