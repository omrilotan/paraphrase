#!/usr/bin/env bash

esbuild src/index.ts --outfile=index.js --bundle --platform=node --format=cjs --sourcemap
esbuild src/index.ts --outfile=index.mjs --bundle --platform=node --format=esm --sourcemap
tsc src/index.ts --emitDeclarationOnly --declaration --declarationDir types
