# Build scripts of zip.js

## Main script
 
- for development/debugging:

|                     | `zip` API | `zip.fs` API | deflate | inflate | `zip.getMimeType` API |
|---------------------|-----------|--------------|---------|---------|-----------------------|
| zip.js              |         x |              |       x |       x |                       | 
| zip-fs.js           |         x |            x |       x |       x |                       |

- for production (minified):

|                     | `zip` API | `zip.fs` API | deflate | inflate | `zip.getMimeType` API | usage                                                 |
|---------------------|-----------|--------------|---------|---------|-----------------------|-------------------------------------------------------|
| zip-workers.min.js  |         x |              |         |         |                       | compression/decompression with web workers            |
| zip.deflate.min.js  |         x |              |       x |         |                       | compression with or without web workers               |
| zip.inflate.min.js  |         x |              |         |       x |                       | decompression with or without web workers             |
| zip.min.js          |         x |              |       x |       x |                       | compression/decompression with or without web workers |
| zip-fs.min.js       |         x |            x |         |         |                       | compression/decompression with                        |
| zip-fs-full.min.js  |         x |            x |       x |       x |                     x | compression/decompression with or without web workers |

## Web worker script

|                     | `zip` API | `zip.fs` API | deflate | inflate | usage                                      |
|---------------------|-----------|--------------|---------|---------|--------------------------------------------|
| z-worker-deflate.js |           |              |       x |         | compression with web workers               |
| z-worker-inflate.js |           |              |         |       x | decompression with web workers             |
| z-worker.js         |           |              |       x |       x | compression/decompression with web workers |
| z-worker-pako.js    |           |              |         |         | compression/decompression with web workers |