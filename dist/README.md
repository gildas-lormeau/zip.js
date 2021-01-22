# Build scripts of zip.js

## Main script
 
- for development/debugging:

|                     | `zip` API | `zip.fs` API | deflate | inflate | `zip.getMimeType` API |
|---------------------|-----------|--------------|---------|---------|-----------------------|
| zip.js              |         x |              |       x |       x |                       |
| zip-fs.js           |         x |            x |       x |       x |                       |

- for production (minified):

|                     | `zip` API | `zip.fs` API | deflate | inflate | `zip.getMimeType` API |
|---------------------|-----------|--------------|---------|---------|-----------------------|
| zip-workers.min.js  |         x |              |         |         |                       |
| zip.deflate.min.js  |         x |              |       x |         |                       |
| zip.inflate.min.js  |         x |              |         |       x |                       |
| zip.min.js          |         x |              |       x |       x |                       |
| zip-fs.min.js       |         x |            x |       x |       x |                       |
| zip-fs-full.min.js  |         x |            x |       x |       x |                     x |

## Web worker script

|                     | `zip` API | `zip.fs` API | deflate | inflate | `zip.getMimeType` API |
|---------------------|-----------|--------------|---------|---------|-----------------------|
| z-worker-deflate.js |           |              |       x |         |                       |
| z-worker-inflate.js |           |              |         |       x |                       |
| z-worker.js         |           |              |       x |       x |                       |
| z-worker-pako.js    |           |              |         |         |                       |