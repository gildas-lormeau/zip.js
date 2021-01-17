#!/bin/sh

rollup -c
terser lib/deflate.js --compress --mangle --output dist/deflate.js 
terser lib/inflate.js --compress --mangle --output dist/inflate.js