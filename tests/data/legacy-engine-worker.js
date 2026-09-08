/* global self */

import "../../lib/core/web-worker-base.js";
import { CompressionStreamZlib, DecompressionStreamZlib } from "../../lib/core/streams/zlib-js/zlib-streams.min.js";

// same as custom-engine-worker.js, and it matters more here: this fixture is the only cover for the
// deprecated CompressionStreamZlib/DecompressionStreamZlib keys read from the config, and a fallback to the
// platform codec once made those keys look like dead code
self.CompressionStream = undefined;
self.DecompressionStream = undefined;

self.initModule = config => {
	config.CompressionStreamZlib = CompressionStreamZlib;
	config.DecompressionStreamZlib = DecompressionStreamZlib;
};
