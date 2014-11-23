// configure all test cases.

zip.useWebWorkers = true;

zip.workerScripts = {
	// default zip.js implementation
	deflater: ['deflate.js'],
	inflater: ['inflate.js'],

	// zlib-asm
	// deflater: ['zlib-asm/zlib.js', 'zlib-asm/codecs.js'],
	// inflater: ['zlib-asm/zlib.js', 'zlib-asm/codecs.js'],

	// pako
	// deflater: ['pako/pako.min.js', 'pako/codecs.js'],
	// inflater: ['pako/pako.min.js', 'pako/codecs.js'],
};
