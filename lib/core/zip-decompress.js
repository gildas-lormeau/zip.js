import { ZipReader } from "./zip-reader";

class ZipDecompressionStream {
	#readable
	#writable
	constructor (options = {}) {
		const { readable, writable } = new TransformStream();
		const gen = new ZipReader(readable, options).getEntriesGenerator();
		this.#readable = new ReadableStream({
			async pull(controller) {
				const { done, value } = await gen.next();
				if (done)
					return controller.close();
				const chunk = {
					...value,
					readable: (function () {
						const { readable, writable } = new TransformStream();
						if (value.getData) {
							value.getData(writable);
							return readable;
						}
					})()
				};
				delete chunk.getData;
				controller.enqueue(chunk);
			}
		})
		this.#writable = writable;
	}

	get readable() {
		return this.#readable;
	}

	get writable() {
		return this.#writable;
	}
}

export {
	ZipDecompressionStream
};
