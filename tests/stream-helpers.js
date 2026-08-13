/* global ReadableStream, TextEncoder, TextDecoder */

export {
	readableFromText,
	readTextFromReadable
};

function readableFromText(text) {
	return new ReadableStream({
		start(controller) {
			controller.enqueue(new TextEncoder().encode(text));
			controller.close();
		}
	});
}

async function readTextFromReadable(readable) {
	const reader = readable.getReader();
	const decoder = new TextDecoder();
	let text = "";
	for (;;) {
		const { value, done } = await reader.read();
		if (done) {
			break;
		}
		text += decoder.decode(value, { stream: true });
	}
	return text + decoder.decode();
}
