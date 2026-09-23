import { initWorker } from "../../lib/core/web-worker-base.js";

// the codec of this worker cannot allocate its state and says so the way the WASM driver does, with the
// Z_MEM_ERROR code on the error; test-worker-cause-code.js checks that the code reaches the main scope
const MEMORY_ERROR_CODE = "Z_MEM_ERROR";
const MEMORY_ERROR_MESSAGE = "simulated allocation failure";

class UnstartableStream {
	constructor() {
		const error = new Error(MEMORY_ERROR_MESSAGE);
		error.code = MEMORY_ERROR_CODE;
		throw error;
	}
}

initWorker({
	CompressionStreamFallback: UnstartableStream,
	DecompressionStreamFallback: UnstartableStream
});
