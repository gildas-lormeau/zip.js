#!/bin/sh

rollup lib/zip.js --file dist/zip.js --format umd --name "zip"
rollup lib/zip-fs.js --file dist/zip-fs.js --format umd --name "zip"

rollup lib/zip.js --file dist/zip.min.js --format umd --name "zip" --plugin terser
rollup lib/zip-fs.js --file dist/zip-fs.min.js --format umd --name "zip" --plugin terser
terser lib/z-worker.js > dist/z-worker.js --compress --mangle
terser lib/deflate.js > dist/deflate.js --compress --mangle
terser lib/inflate.js > dist/inflate.js --compress --mangle
terser lib/crypto.js > dist/crypto.js --compress --mangle

rollup lib/z-worker-pako.js --file dist/z-worker-pako.js --format umd --plugin terser
rollup lib/z-worker-zlib.js --file dist/z-worker-zlib.js --format umd --plugin terser