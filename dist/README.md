# Built scripts of zip.js
 
- for production (minified):

|                     | `zip` API | `zip.fs` API | Web Workers | No Web Workers | Usage                                                 |
|---------------------|-----------|--------------|-------------|----------------|-------------------------------------------------------|
| zip.min.js          |         x |              |           x |                | compression/decompression with web workers            |
| zip-full.min.js     |         x |              |           x |              x | compression/decompression with or without web workers |
| zip-fs.min.js       |         x |            x |           x |                | compression/decompression with web workers            |
| zip-fs-full.min.js  |         x |            x |           x |              x | compression/decompression with or without web workers |

- for development/debugging:

|                     | `zip` API | `zip.fs` API | Web Workers | No Web Workers | 
|---------------------|-----------|--------------|-------------|----------------|
| zip.js              |         x |              |           x |                |
| zip-full.js         |         x |              |           x |              x |
| zip-fs.js           |         x |            x |           x |                |
| zip-fs-full.js      |         x |            x |           x |              x |

- z-worker.js can be used as a web worker script if the CSP don't allow to load it with a Blob URI
- z-worker-pako.js is the web worker script for using pako
