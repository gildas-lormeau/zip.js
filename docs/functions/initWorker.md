[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / initWorker

# Function: initWorker()

> **initWorker**(`options?`): `void`

Defined in: [index.d.ts:468](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L468)

Initializes a custom web worker script. This function is exposed by the `@zip.js/zip.js/worker` entry point and must be called
in the worker script created by [Configuration#createWorker](../interfaces/Configuration.md#createworker) or referenced by [Configuration#workerURI](../interfaces/Configuration.md#workeruri).

Here is a complete example of a worker script using fflate as the compression engine, e.g. to reduce the bundle size:
```
import { initWorker } from "@zip.js/zip.js/worker";
import { Deflate, Inflate } from "fflate";

const FORMAT_DEFLATE_RAW = "deflate-raw";

class FflateStream extends TransformStream {
  constructor(codec) {
    super({
      start(controller) {
        codec.ondata = chunk => {
          if (chunk.length) {
            controller.enqueue(chunk);
          }
        };
      },
      transform(chunk) {
        codec.push(chunk);
      },
      flush() {
        codec.push(new Uint8Array(0), true);
      }
    });
  }
}

class CompressionStreamFallback extends FflateStream {
  constructor(format, { level } = {}) {
    checkFormat(format);
    super(new Deflate(level === undefined ? {} : { level }));
  }
}

class DecompressionStreamFallback extends FflateStream {
  constructor(format) {
    checkFormat(format);
    super(new Inflate());
  }
}

function checkFormat(format) {
  if (format != FORMAT_DEFLATE_RAW) {
    throw new TypeError("Unsupported compression format: " + format);
  }
}

initWorker({ CompressionStreamFallback, DecompressionStreamFallback });
```

## Parameters

### options?

#### CompressionStreamFallback?

*typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

The stream implementation used to compress data when `useCompressionStream` is set to `false` or when `CompressionStream` is unsupported.

#### DecompressionStreamFallback?

*typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

The stream implementation used to decompress data when `useCompressionStream` is set to `false` or when `DecompressionStream` is unsupported.

#### init?

## Returns

`void`
