#!/usr/bin/env bash

node scripts/create-index.js src
node scripts/create-index.js src/behavior
node scripts/create-index.js src/converter
node scripts/create-index.js src/factory
node scripts/create-index.js src/font
node scripts/create-index.js src/gesture
node scripts/create-index.js src/layout
node scripts/create-index.js src/parser
node scripts/create-index.js src/view

tsc --project src
