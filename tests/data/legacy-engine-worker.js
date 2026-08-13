/* global self */

import "../../lib/core/web-worker-base.js";
import { CompressionStreamZlib, DecompressionStreamZlib } from "../../lib/core/streams/zlib-js/zlib-streams.min.js";

self.initModule = config => {
	config.CompressionStreamZlib = CompressionStreamZlib;
	config.DecompressionStreamZlib = DecompressionStreamZlib;
};
