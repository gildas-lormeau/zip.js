/* global Uint8Array, Uint16Array, Uint32Array, Int32Array */

// JavaScript port of the Implode decompression ("explode") code of hwzip 2.4
// by Hans Wennborg (https://www.hanshq.net/zip.html), placed in the public domain.

const MAX_CODEWORD_LENGTH = 16;
const LENGTH_EXTRA_BYTE_SYMBOL = 63;
const ERR_INVALID_DATA = "Invalid imploded data";

const REVERSED_BYTES = new Uint8Array(256);
for (let value = 0; value < 256; value++) {
	let reversed = 0;
	for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
		reversed = (reversed << 1) | ((value >> bitIndex) & 1);
	}
	REVERSED_BYTES[value] = reversed;
}

class BitReader {

	constructor(data) {
		this.data = data;
		this.bitPosition = 0;
	}

	peekBits(count) {
		const { data } = this;
		const byteIndex = this.bitPosition >> 3;
		const bitOffset = this.bitPosition & 7;
		const value = (data[byteIndex] || 0) | ((data[byteIndex + 1] || 0) << 8) | ((data[byteIndex + 2] || 0) << 16);
		return (value >>> bitOffset) & ((1 << count) - 1);
	}

	advanceBits(count) {
		this.bitPosition += count;
		if (this.bitPosition > this.data.length * 8) {
			throw new Error(ERR_INVALID_DATA);
		}
	}

	readBits(count) {
		const value = this.peekBits(count);
		this.advanceBits(count);
		return value;
	}

	get bytesRead() {
		return Math.ceil(this.bitPosition / 8);
	}
}

function reverse16(value) {
	return (REVERSED_BYTES[value & 0xff] << 8) | REVERSED_BYTES[value >> 8];
}

class CanonicalDecoder {

	constructor(codewordLengths) {
		const counts = new Uint16Array(MAX_CODEWORD_LENGTH + 1);
		for (const length of codewordLengths) {
			counts[length]++;
		}
		counts[0] = 0;
		const codes = new Uint16Array(MAX_CODEWORD_LENGTH + 1);
		const symbolIndexes = new Uint16Array(MAX_CODEWORD_LENGTH + 1);
		this.sentinelBits = new Uint32Array(MAX_CODEWORD_LENGTH + 1);
		this.symbolOffsets = new Int32Array(MAX_CODEWORD_LENGTH + 1);
		for (let length = 1; length <= MAX_CODEWORD_LENGTH; length++) {
			codes[length] = (codes[length - 1] + counts[length - 1]) << 1;
			if (counts[length] && codes[length] + counts[length] - 1 > (1 << length) - 1) {
				throw new Error(ERR_INVALID_DATA);
			}
			this.sentinelBits[length] = (codes[length] + counts[length]) << (MAX_CODEWORD_LENGTH - length);
			symbolIndexes[length] = symbolIndexes[length - 1] + counts[length - 1];
			this.symbolOffsets[length] = symbolIndexes[length] - codes[length];
		}
		this.symbols = new Uint16Array(codewordLengths.length);
		for (let symbol = 0; symbol < codewordLengths.length; symbol++) {
			const length = codewordLengths[symbol];
			if (length) {
				this.symbols[symbolIndexes[length]++] = symbol;
			}
		}
	}

	decode(reader) {
		const bits = reverse16(~reader.peekBits(MAX_CODEWORD_LENGTH) & 0xffff);
		for (let length = 1; length <= MAX_CODEWORD_LENGTH; length++) {
			if (bits < this.sentinelBits[length]) {
				const value = bits >>> (MAX_CODEWORD_LENGTH - length);
				reader.advanceBits(length);
				return this.symbols[(this.symbolOffsets[length] + value) & 0xffff];
			}
		}
		throw new Error(ERR_INVALID_DATA);
	}
}

function readCodewordLengths(reader, count) {
	const codewordLengths = new Uint8Array(count);
	const counts = new Uint16Array(MAX_CODEWORD_LENGTH + 1);
	const byteCount = reader.readBits(8) + 1;
	let codewordIndex = 0;
	for (let byteIndex = 0; byteIndex < byteCount; byteIndex++) {
		const byte = reader.readBits(8);
		const codewordLength = (byte & 0xf) + 1;
		const runLength = (byte >> 4) + 1;
		counts[codewordLength] += runLength;
		if (codewordIndex + runLength > count) {
			throw new Error(ERR_INVALID_DATA);
		}
		for (let runIndex = 0; runIndex < runLength; runIndex++) {
			codewordLengths[codewordIndex++] = codewordLength;
		}
	}
	if (codewordIndex < count) {
		throw new Error(ERR_INVALID_DATA);
	}
	let availableCodewords = 1;
	for (let length = 1; length <= MAX_CODEWORD_LENGTH; length++) {
		availableCodewords = availableCodewords * 2 - counts[length];
		if (availableCodewords < 0) {
			throw new Error(ERR_INVALID_DATA);
		}
	}
	if (availableCodewords != 0) {
		throw new Error(ERR_INVALID_DATA);
	}
	return new CanonicalDecoder(codewordLengths);
}

function explode(input, uncompressedSize, largeWindow, literalTree, pk101BugCompat) {
	const reader = new BitReader(input);
	const literalDecoder = literalTree ? readCodewordLengths(reader, 256) : null;
	const lengthDecoder = readCodewordLengths(reader, 64);
	const distanceDecoder = readCodewordLengths(reader, 64);
	const minLength = pk101BugCompat ? (largeWindow ? 3 : 2) : (literalTree ? 3 : 2);
	const distanceBitCount = largeWindow ? 7 : 6;
	const output = new Uint8Array(uncompressedSize);
	let position = 0;
	while (position < uncompressedSize) {
		if (reader.readBits(1)) {
			output[position++] = literalDecoder ? literalDecoder.decode(reader) : reader.readBits(8);
			continue;
		}
		let distance = reader.readBits(distanceBitCount);
		distance = (distance | (distanceDecoder.decode(reader) << distanceBitCount)) + 1;
		const lengthSymbol = lengthDecoder.decode(reader);
		let length = lengthSymbol + minLength;
		if (lengthSymbol == LENGTH_EXTRA_BYTE_SYMBOL) {
			length += reader.readBits(8);
		}
		if (length > uncompressedSize - position) {
			throw new Error(ERR_INVALID_DATA);
		}
		for (let index = 0; index < length; index++) {
			output[position] = distance > position ? 0 : output[position - distance];
			position++;
		}
	}
	return { output, bytesRead: reader.bytesRead };
}

export { explode };
