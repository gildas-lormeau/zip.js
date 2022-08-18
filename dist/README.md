# Built scripts of zip.js

**Warning**: These files are not compatible with ES modules, i.e. they cannot be imported with `import`. Instead, import `index.js` in the root folder of the project or one of the files prefixed with `zip-` in the [`/lib`](../lib) folder (e.g. `/lib/zip-no-worker-inflate.js`).

- for production (minified):

|                                | [`ZipReader`](https://gildas-lormeau.github.io/zip.js/api/classes/ZipReader.html) API | [`ZipWriter`](https://gildas-lormeau.github.io/zip.js/api/classes/ZipWriter.html) API | [`zip.fs`](https://gildas-lormeau.github.io/zip.js/api/classes/FS.html) API | Web Workers | No Web Workers | Usage                                                 |
|--------------------------------|-----------------|-----------------|--------------|-------------|----------------|-------------------------------------------------------|
| `zip.min.js`                   |               x |               x |              |           x |                | compression/decompression with web workers            |
| `zip-no-worker.min.js`         |               x |               x |              |             |              x | compression/decompression without web workers         |
| `zip-no-worker-inflate.min.js` |               x |                 |              |             |              x | decompression without web workers                     |
| `zip-no-worker-deflate.min.js` |                 |               x |              |             |              x | compression without web workers                       |
| `zip-full.min.js`              |               x |               x |              |           x |              x | compression/decompression with or without web workers |
| `zip-fs.min.js`                |               x |               x |            x |           x |                | compression/decompression with web workers            |
| `zip-fs-full.min.js`           |               x |               x |            x |           x |              x | compression/decompression with or without web workers |

- for development/debugging:

|                       | `zip` API | [`zip.fs`](https://gildas-lormeau.github.io/zip.js/api/classes/FS.html) API | Web Workers | No Web Workers | 
|-----------------------|-----------|--------------|-------------|----------------|
| `zip.js`              |         x |              |           x |                |
| `zip-full.js`         |         x |              |           x |              x |
| `zip-fs.js`           |         x |            x |           x |                |
| `zip-fs-full.js`      |         x |            x |           x |              x |

- `z-worker.js` can be used as a web worker script if the [Content Security Policy](https://developer.mozilla.org/docs/Web/HTTP/CSP) blocks scripts loaded with a `blob:` scheme
- `z-worker-fflate.js` is the web worker script for using [fflate](https://gildas-lormeau.github.io/zip.js/core-api.html#alternative-codec-fflate)
- `z-worker-pako.js` is the web worker script for using [pako](https://gildas-lormeau.github.io/zip.js/core-api.html#alternative-codec-pako)
