#!/bin/sh
# Builds the game: joins the source parts, in load order, into one self-contained index.html.
set -e
cd "$(dirname "$0")"
cat src/00_head.html src/05_data.js src/10_px.js src/20_world.js src/30_tiles.js src/40_objs.js \
    src/50_chars.js src/60_content.js src/66_jump.js src/70_game.js src/99_tail.html > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
