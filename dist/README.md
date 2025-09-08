# Prebuilt zip.js bundles

**Note**: These bundles are not ES module compatible (you cannot `import` them directly). Use `index.js` at the project root or one of the `zip-*.js` files in [`/lib`](../lib) (e.g. `/lib/zip-core.js`) for ESM usage.

Contents:

- `zip.js` / `zip.min.js`: Full `ZipWriter` / `ZipReader` bundles with embedded Web Worker code and WASM.
- `zip-fs.js` / `zip-fs.min.js`: Full `ZipWriter` / `ZipReader` plus virtual file system (`fs`), with embedded Web Worker code and WASM.
- `zip-core.js` / `zip-core.min.js`: Minimal `ZipWriter` / `ZipReader`.
- `zip-fs-core.js` / `zip-fs-core.min.js`: Minimal `ZipWriter` / `ZipReader` plus virtual file system (`fs`).