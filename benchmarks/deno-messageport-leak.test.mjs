// Reported upstream: https://github.com/denoland/deno/issues/36015
//
// Minimal reproduction (no dependencies) of a Deno test resource-sanitizer report:
//
//   Leaks detected:
//     - A message port was created during the test, but not closed during the test.
//       Close the message port by calling `messagePort.close()`.
//
// Trigger: cancelling a ReadableStream that was transferred to a Worker while it is still OPEN
// (its underlying source has not reached its end) leaves the transfer's internal MessagePort open.
// Draining the transferred stream to completion does NOT leak, and cancelling one that has already
// reached its end does NOT leak. Only the readable side is affected — aborting a transferred
// WritableStream is fine. The port is never closed afterwards (a delay before the test ends does not
// clear it), and there is no MessagePort exposed to JS to close() manually.
//
// deno --version : still reproduced with deno 2.9.5, reported with deno 2.9.2
// Run           : deno test --allow-read --no-config benchmarks/deno-messageport-leak.test.mjs
//                 (--no-config because deno.json excludes benchmarks/ from the published package)
const workerCode = `
self.onmessage = async (e) => {
	const { readable, action, reads } = e.data;
	const reader = readable.getReader();
	if (action === "drain") {
		for (; ;) { const { done } = await reader.read(); if (done) break; }
	} else { // "cancel"
		for (let i = 0; i < reads; i++) { const { done } = await reader.read(); if (done) break; }
		await reader.cancel("stop");
	}
	self.postMessage("done");
};
`;
const WORKER_URL = "data:text/javascript," + encodeURIComponent(workerCode);

// infinite: never closes (always has data pending). finite: closes after `count` chunks.
function makeReadable({ infinite = false, count = 4 } = {}) {
	let pulls = 0;
	return new ReadableStream({
		pull(controller) {
			controller.enqueue(new Uint8Array(16));
			if (!infinite && ++pulls >= count) { controller.close(); }
		}
	});
}

async function run({ action, infinite, count, reads }) {
	const worker = new Worker(WORKER_URL, { type: "module" });
	const readable = makeReadable({ infinite, count });
	const done = new Promise(resolve => { worker.onmessage = resolve; });
	worker.postMessage({ readable, action, reads }, [readable]);
	await done;
	worker.terminate();
}

// control: drain to end -> the port closes on end-of-stream -> no leak
Deno.test({ name: "drain a transferred ReadableStream to completion (no leak)", sanitizeResources: true, fn: () => run({ action: "drain", count: 4 }) });
// bug: cancel while still open (source never closes) -> MessagePort leaks
Deno.test({ name: "cancel a still-open transferred ReadableStream (leaks a MessagePort)", sanitizeResources: true, fn: () => run({ action: "cancel", infinite: true, reads: 1 }) });
// cancelling one that already reached its end is a no-op -> no leak
Deno.test({ name: "cancel a fully-read transferred ReadableStream (no leak)", sanitizeResources: true, fn: () => run({ action: "cancel", count: 4, reads: 5 }) });
