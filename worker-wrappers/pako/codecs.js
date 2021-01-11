/// wrapper for pako (https://github.com/nodeca/pako)

/* globals pako */

(globalThis => {

	"use strict";

	class Codec {

		constructor(isDeflater, options) {
			const newOptions = { raw: true, chunkSize: 512 * 1024 };
			if (options && typeof options.level == "number") {
				newOptions.level = options.level;
			}
			this.backEnd = isDeflater ? new pako.Deflate(newOptions) : new pako.Inflate(newOptions);
			this.chunks = [];
			this.dataLength = 0;
			this.backEnd.onData = this.onData.bind(this);
		}

		onData(chunk) {
			this.chunks.push(chunk);
			this.dataLength += chunk.length;
		}

		fetchData() {
			const backEnd = this.backEnd;
			if (backEnd.err !== 0) {
				throw new Error(backEnd.msg);
			}
			const chunks = this.chunks;
			let data;
			if (chunks.length == 1) {
				data = chunks[0];
			} else if (chunks.length > 1) {
				data = new Uint8Array(this.dataLength);
				for (let indexChunk = 0, offset = 0; indexChunk < chunks.length; indexChunk++) {
					const chunk = chunks[indexChunk];
					data.set(chunk, offset);
					offset += chunk.length;
				}
			}
			chunks.length = 0;
			this.dataLength = 0;
			return data;
		}

		append(bytes) {
			this.backEnd.push(bytes, false);
			return this.fetchData();
		}

		flush() {
			this.backEnd.push(new Uint8Array(0), true);
			return this.fetchData();
		}
	}

	class Deflater extends Codec {

		constructor(options) {
			super(true, options);
		}
	}

	class Inflater extends Codec {

		constructor() {
			super(false);
		}
	}

	globalThis.ZipDeflater = globalThis._pako_Deflater = Deflater;
	globalThis.ZipInflater = globalThis._pako_Inflater = Inflater;

})(this);