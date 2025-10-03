# Prebuilt zip.js bundles

**Note**: These bundles are not ES module compatible (you cannot `import` them directly). Use `index.js` at the project root or one of the `zip-*.js` files in [`/lib`](../lib) (e.g. `/lib/zip-core.js`) for ESM usage.

Contents:

- `zip.js` / `zip.min.js`: Full `ZipWriter` / `ZipReader` bundles with embedded Web Worker code and WASM.
- `zip-fs.js` / `zip-fs.min.js`: Full `ZipWriter` / `ZipReader` plus virtual file system (`fs`), with embedded Web Worker code and WASM.
- `zip-core.js` / `zip-core.min.js`: Minimal `ZipWriter` / `ZipReader`.
- `zip-fs-core.js` / `zip-fs-core.min.js`: Minimal `ZipWriter` / `ZipReader` plus virtual file system (`fs`).

Notes:
- Files suffixed with `-native` rely on a pure JavaScript implementation of Compression Streams instead of a WASM module.
- `zip-legacy.min.js` is the equivalent of `zip.min.js` before the version `2.8`, it relies on a JavaScript implementation of Compression Streams (if used) but only in web workers. Alternatively `zip-native.min.js` includes the Compression Streams implementation in the main environment and the web workers.