import { ZipWriter } from "./zip-writer";

class ZipCompressionStream {
	#readable
	#zipWriter
	constructor (options = {}) {
		const { readable, writable } = new TransformStream();
		this.#readable = readable;
		this.#zipWriter = new ZipWriter(writable, options);
	}

	get readable() {
		return this.#readable;
	}

	transform(path) {
		const { readable, writable } = new TransformStream({
			flush: () => { this.#zipWriter.close(); }
		});
		this.#zipWriter.add(path, readable);
		return { readable: this.#readable, writable };
	}

	writable(path) {
		const { readable, writable } = new TransformStream();
		this.#zipWriter.add(path, readable);
		return writable;
	}

	close(comment = undefined, options = {}) {
		return this.#zipWriter.close(comment, options);
	}
}

export {
	ZipCompressionStream
};
