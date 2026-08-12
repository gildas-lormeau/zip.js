# Prebuilt zip.js bundles

**Note**: These bundles are not ES module compatible (you cannot `import` them directly), except the files suffixed with `-external` which are ES modules. Use `index.js` at the project root or one of the `zip-*.js` files in [`/lib`](../lib) (e.g. `/lib/zip-core.js`) for ESM usage.

**Note**: These bundles are standalone and always contain both `ZipReader` and `ZipWriter`, they are not tree-shaken. With a bundler, importing named identifiers from `index.js` already removes the direction you do not use.

Contents:

- `zip.js` / `zip.min.js`: Full `ZipWriter` / `ZipReader` bundles with embedded Web Worker code and WASM.
- `zip-fs.js` / `zip-fs.min.js`: Full `ZipWriter` / `ZipReader` plus virtual file system (`fs`), with embedded Web Worker code and WASM.
- `zip-core.js` / `zip-core.min.js`: Minimal `ZipWriter` / `ZipReader`.
- `zip-fs-core.js` / `zip-fs-core.min.js`: Minimal `ZipWriter` / `ZipReader` plus virtual file system (`fs`).
- `zip-fs-external.js` / `zip-fs-external.min.js`: ES module equivalent of `zip-fs.min.js` which references `zip-web-worker.js` and `zip-module.wasm` as external files instead of embedding them. The worker runs from a real file URL, which avoids `blob:` restrictions on pages and browser extensions with a strict Content Security Policy.
- `zip-fs-core-external.js` / `zip-fs-core-external.min.js`: Same as `zip-fs-external.min.js` without the MIME type table, `getMimeType()` returns `"application/octet-stream"`.
- `zip-core-external.js` / `zip-core-external.min.js`: Same as `zip-fs-core-external.min.js` without the virtual file system.
- `zip-native.js` / `zip-native.min.js`, `zip-fs-native.js` / `zip-fs-native.min.js`: Equivalents of `zip.min.js` and `zip-fs.min.js` embedding a JavaScript implementation of the Compression Streams API instead of the WASM module (see the notes below).
- `zip-legacy.js` / `zip-legacy.min.js`: Equivalent of `zip.min.js` before the version `2.8` (see the notes below).
- `zip-web-worker.js`, `zip-web-worker-native.js`: Web Worker scripts embedding the codecs, referenced by the `-external` bundles or passed manually via the `workerURI` option of `configure()`.
- `zip-module.wasm`: The WASM module (zlib), referenced by the `-external` bundles or passed manually via the `wasmURI` option of `configure()`.

The `-external` bundles resolve `zip-web-worker.js` and `zip-module.wasm` relative to their own location, the files must be deployed in the same directory.

Online builder:

Alternatively, you can build your own version of zip.js with the online builder, see https://gildas-lormeau.github.io/zip.js/builder.

Notes:
- Every bundle uses the native `CompressionStream`/`DecompressionStream` APIs when the environment supports them. What differs is the implementation embedded for everything else, i.e. custom compression levels, Deflate64 decompression, and environments lacking these APIs: a WASM module by default, or a pure JavaScript implementation of the Compression Streams API in the files suffixed with `-native`. The suffix names that implementation, it does not mean that these bundles rely more on the native APIs than the others.
- `zip-legacy.min.js` is the equivalent of `zip.min.js` before the version `2.8`, it relies on a JavaScript implementation of Compression Streams (if used) but only in web workers. Alternatively `zip-native.min.js` includes the Compression Streams implementation in the main environment and the web workers.