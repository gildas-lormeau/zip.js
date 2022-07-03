# Built scripts of zip.js
 
- for production (minified):

|                                | [`ZipReader`](https://gildas-lormeau.github.io/zip.js/core-api.html#zip-reading) API | [`ZipWriter`](https://gildas-lormeau.github.io/zip.js/core-api.html#zip-writing) API | [`zip.fs`](https://gildas-lormeau.github.io/zip.js/fs-api.html#fs-constructor) API | Web Workers | No Web Workers | Usage                                                 |
|--------------------------------|-----------------|-----------------|--------------|-------------|----------------|-------------------------------------------------------|
| `zip.min.js`                   |               x |               x |              |           x |                | compression/decompression with web workers            |
| `zip-no-worker.min.js`         |               x |               x |              |             |              x | compression/decompression without web workers         |
| `zip-no-worker-inflate.min.js` |               x |                 |              |             |              x | decompression without web workers                     |
| `zip-no-worker-deflate.min.js` |                 |               x |              |             |              x | compression without web workers                       |
| `zip-full.min.js`              |               x |               x |              |           x |              x | compression/decompression with or without web workers |
| `zip-fs.min.js`                |               x |               x |            x |           x |                | compression/decompression with web workers            |
| `zip-fs-full.min.js`           |               x |               x |            x |           x |              x | compression/decompression with or without web workers |

- for development/debugging:

|                       | [`zip`](https://gildas-lormeau.github.io/zip.js/core-api.html) API | [`zip.fs`](https://gildas-lormeau.github.io/zip.js/fs-api.html#fs-constructor) API | Web Workers | No Web Workers | 
|-----------------------|-----------|--------------|-------------|----------------|
| `zip.js`              |         x |              |           x |                |
| `zip-full.js`         |         x |              |           x |              x |
| `zip-fs.js`           |         x |            x |           x |                |
| `zip-fs-full.js`      |         x |            x |           x |              x |

- `z-worker.js` can be used as a web worker script if the [CSP](https://developer.mozilla.org/docs/Web/HTTP/CSP) does not allow to load it with a Blob URI
- `z-worker-fflate.js` is the web worker script for using [fflate](https://gildas-lormeau.github.io/zip.js/core-api.html#alternative-codec-fflate)
- `z-worker-pako.js` is the web worker script for using [pako](https://gildas-lormeau.github.io/zip.js/core-api.html#alternative-codec-pako)
- The same files are available for older browsers supporting only ECMAScript 5, the name of these files are suffixed with `-es5` (e.g. `zip-es5.js`)
