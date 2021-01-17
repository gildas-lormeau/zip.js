#!/bin/sh

rollup -c
terser lib/codecs/deflate.js --compress --mangle --output dist/deflate.js 
terser lib/codecs/inflate.js --compress --mangle --output dist/inflate.js