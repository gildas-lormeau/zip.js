import { initWorker } from "../../lib/core/web-worker-base.js";
import { CompressionStreamZlib as CompressionStreamFallback, DecompressionStreamZlib as DecompressionStreamFallback } from "../../lib/core/streams/zlib-js/zlib-streams.min.js";

initWorker({
	CompressionStreamFallback,
	DecompressionStreamFallback
});
