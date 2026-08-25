// Type-level test: the classes compressing and decompressing data must stay assignable wherever the
// configuration and the codec definitions expect one, with the options they really receive.
// The declared classes carry a constructor, so a codec class taking the format and its options is
// accepted; without it they had an implicit zero-argument constructor and every custom codec class
// was rejected, including the one documented on initWorker.
// Compile with: npm run test-types
import { configure, registerCodec, getRegisteredCodecs, VERSION } from "../../index.js";
// initWorker is exported from the "./worker" entry point, not from index.js, so it is imported the way
// a user would import it; every entry point maps to the same index.d.ts, which is why the wrong import
// used to type-check
import { initWorker } from "@zip.js/zip.js/worker";
import type { CompressionStreamOptions, DecompressionStreamOptions } from "../../index.js";

// the classes of the environment must stay assignable
configure({ CompressionStream, DecompressionStream, baseURI: "https://example.com/" });

// a codec class reads the options through the declared interfaces
class ZstdCompressionStream extends TransformStream {
	constructor(format: string, { level, chunkSize, compressionMethod, uncompressedSize }: CompressionStreamOptions = {}) {
		super();
		void [format, level, chunkSize, compressionMethod, uncompressedSize];
	}
}

class ZstdDecompressionStream extends TransformStream {
	constructor(format: string, { chunkSize, compressionMethod, rawBitFlag, uncompressedSize }: DecompressionStreamOptions = {}) {
		super();
		void [format, chunkSize, compressionMethod, rawBitFlag, uncompressedSize];
	}
}

registerCodec({
	compressionMethod: 93,
	format: "zstd",
	versionNeeded: 63,
	CompressionStream: ZstdCompressionStream,
	DecompressionStream: ZstdDecompressionStream
});

// a class reading a subset of the options, as in the example documented on initWorker
class DeflateCompressionStream extends TransformStream {
	constructor(format: string, { level }: { level?: number } = {}) {
		super();
		void [format, level];
	}
}

// a class reading the format only
class DeflateDecompressionStream extends TransformStream {
	constructor(format: string) {
		super();
		void format;
	}
}

initWorker({ CompressionStreamFallback: DeflateCompressionStream, DecompressionStreamFallback: DeflateDecompressionStream });
configure({ CompressionStreamFallback: DeflateCompressionStream, DecompressionStreamFallback: DeflateDecompressionStream });

// the registry snapshot exposes the codec definitions, and the version is a string
const registeredFormats: string[] = getRegisteredCodecs().map(codec => codec.format);
const version: string = VERSION;
void [registeredFormats, version];

export { ZstdCompressionStream, ZstdDecompressionStream, DeflateCompressionStream, DeflateDecompressionStream };
