"use strict";

class Crc32 {

	constructor() {
		this.crc = -1;
		this.table = (() => {
			const table = [];
			for (let i = 0; i < 256; i++) {
				let t = i;
				for (let j = 0; j < 8; j++) {
					if (t & 1) {
						t = (t >>> 1) ^ 0xEDB88320;
					} else {
						t = t >>> 1;
					}
				}
				table[i] = t;
			}
			return table;
		})();
	}

	append(data) {
		const table = this.table;
		let crc = this.crc | 0;
		for (let offset = 0, length = data.length | 0; offset < length; offset++) {
			crc = (crc >>> 8) ^ table[(crc ^ data[offset]) & 0xFF];
		}
		this.crc = crc;
	}

	get() {
		return ~this.crc;
	}
}

export default Crc32;