/* global self */

import { initWorker } from "../../lib/core/web-worker-base.js";
import { CompressionStreamZlib as CompressionStreamFallback, DecompressionStreamZlib as DecompressionStreamFallback } from "../../lib/core/streams/zlib-js/zlib-streams.min.js";

// the platform codec is removed so that the engine below is the only one able to do the work: without it
// the entry cannot be written or read, and test-custom-engine.js fails instead of passing on a silent
// fallback, which is what it used to do
self.CompressionStream = undefined;
self.DecompressionStream = undefined;

initWorker({
	CompressionStreamFallback,
	DecompressionStreamFallback
});
