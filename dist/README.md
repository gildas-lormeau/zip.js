# Build scripts of zip.js

## Main script
 
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

## Web worker script

|                     | `zip` API | `zip.fs` API | deflate | inflate | usage                                      |
|---------------------|-----------|--------------|---------|---------|-----------------------------------------------------|
| z-worker-pako.js    |           |              |         |         | compression/decompression with web workers and Pako |