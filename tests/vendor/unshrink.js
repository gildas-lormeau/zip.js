/* global Uint8Array, Uint16Array, Uint32Array */

// JavaScript port of the Shrink decompression ("unshrink") code of hwzip 2.4
// by Hans Wennborg (https://www.hanshq.net/zip.html), placed in the public domain.

const MIN_CODE_SIZE = 9;
const MAX_CODE_SIZE = 13;
const MAX_CODE = (1 << MAX_CODE_SIZE) - 1;
const INVALID_CODE = 0xffff;
const CONTROL_CODE = 256;
const INC_CODE_SIZE = 1;
const PARTIAL_CLEAR = 2;
const UNKNOWN_LENGTH = 0xffff;
const END_OF_STREAM = -1;
const ERR_INVALID_DATA = "Invalid shrunk data";

class BitReader {

	constructor(data) {
		this.data = data;
		this.bitPosition = 0;
		this.bitEnd = data.length * 8;
	}

	peekBits(count) {
		const { data } = this;
		const byteIndex = this.bitPosition >> 3;
		const bitOffset = this.bitPosition & 7;
		const value = (data[byteIndex] || 0) | ((data[byteIndex + 1] || 0) << 8) | ((data[byteIndex + 2] || 0) << 16);
		return (value >>> bitOffset) & ((1 << count) - 1);
	}

	tryAdvanceBits(count) {
		if (this.bitEnd - this.bitPosition < count) {
			return false;
		}
		this.bitPosition += count;
		return true;
	}

	get bytesRead() {
		return Math.ceil(this.bitPosition / 8);
	}
}

function unshrink(input, uncompressedSize) {
	const reader = new BitReader(input);
	const prefixCodes = new Uint16Array(MAX_CODE + 1);
	const extensionBytes = new Uint8Array(MAX_CODE + 1);
	const lengths = new Uint16Array(MAX_CODE + 1);
	const lastPositions = new Uint32Array(MAX_CODE + 1);
	const queue = new Uint16Array(MAX_CODE - CONTROL_CODE + 1);
	const output = new Uint8Array(uncompressedSize);
	let queueIndex = 0;
	let codeSize = MIN_CODE_SIZE;
	let position = 0;
	for (let code = 0; code <= 0xff; code++) {
		prefixCodes[code] = code;
		extensionBytes[code] = code;
		lengths[code] = 1;
	}
	for (let code = 0x100; code <= MAX_CODE; code++) {
		prefixCodes[code] = INVALID_CODE;
	}
	let queueSize = 0;
	for (let code = CONTROL_CODE + 1; code <= MAX_CODE; code++) {
		queue[queueSize++] = code;
	}
	queue[queueSize] = INVALID_CODE;

	function partialClear() {
		const isPrefix = new Uint8Array(MAX_CODE + 1);
		for (let code = CONTROL_CODE + 1; code <= MAX_CODE; code++) {
			if (prefixCodes[code] != INVALID_CODE) {
				isPrefix[prefixCodes[code]] = 1;
			}
		}
		let size = 0;
		for (let code = CONTROL_CODE + 1; code <= MAX_CODE; code++) {
			if (!isPrefix[code]) {
				prefixCodes[code] = INVALID_CODE;
				queue[size++] = code;
			}
		}
		queue[size] = INVALID_CODE;
		queueIndex = 0;
	}

	function readCode() {
		while (true) {
			const code = reader.peekBits(codeSize);
			if (!reader.tryAdvanceBits(codeSize)) {
				return END_OF_STREAM;
			}
			if (code != CONTROL_CODE) {
				return code;
			}
			const controlCode = reader.peekBits(codeSize);
			if (!reader.tryAdvanceBits(codeSize)) {
				return INVALID_CODE;
			}
			if (controlCode == INC_CODE_SIZE && codeSize < MAX_CODE_SIZE) {
				codeSize++;
			} else if (controlCode == PARTIAL_CLEAR) {
				partialClear();
			} else {
				return INVALID_CODE;
			}
		}
	}

	function copyBytes(from, to, count) {
		for (let index = 0; index < count; index++) {
			output[to + index] = output[from + index];
		}
	}

	function outputCode(code, prevCode, firstByte) {
		if (code <= 0xff) {
			output[position] = code;
			return { firstByte: code, length: 1 };
		}
		if (prefixCodes[code] == INVALID_CODE || prefixCodes[code] == code) {
			throw new Error(ERR_INVALID_DATA);
		}
		if (lengths[code] != UNKNOWN_LENGTH) {
			const length = lengths[code];
			if (uncompressedSize - position < length) {
				throw new Error(ERR_INVALID_DATA);
			}
			copyBytes(lastPositions[code], position, length);
			return { firstByte: output[position], length };
		}
		const prefixCode = prefixCodes[code];
		if (prefixCode == queue[queueIndex]) {
			prefixCodes[prefixCode] = prevCode;
			extensionBytes[prefixCode] = firstByte;
			lengths[prefixCode] = lengths[prevCode] + 1;
			lastPositions[prefixCode] = lastPositions[prevCode];
			output[position] = firstByte;
		} else if (prefixCodes[prefixCode] == INVALID_CODE) {
			throw new Error(ERR_INVALID_DATA);
		}
		const length = lengths[prefixCode] + 1;
		if (uncompressedSize - position < length) {
			throw new Error(ERR_INVALID_DATA);
		}
		copyBytes(lastPositions[prefixCode], position, lengths[prefixCode]);
		output[position + length - 1] = extensionBytes[code];
		lengths[code] = length;
		lastPositions[code] = position;
		return { firstByte: output[position], length };
	}

	let currentCode = readCode();
	if (currentCode == END_OF_STREAM) {
		return { output: output.slice(0, 0), bytesRead: reader.bytesRead };
	}
	if (currentCode > 0xff) {
		throw new Error(ERR_INVALID_DATA);
	}
	if (uncompressedSize == 0) {
		throw new Error(ERR_INVALID_DATA);
	}
	let firstByte = currentCode;
	output[position] = currentCode;
	lastPositions[currentCode] = position;
	position++;
	let previousCode = currentCode;
	while ((currentCode = readCode()) != END_OF_STREAM) {
		if (currentCode == INVALID_CODE) {
			throw new Error(ERR_INVALID_DATA);
		}
		if (position == uncompressedSize) {
			throw new Error(ERR_INVALID_DATA);
		}
		if (currentCode == queue[queueIndex]) {
			if (prefixCodes[previousCode] == INVALID_CODE) {
				throw new Error(ERR_INVALID_DATA);
			}
			prefixCodes[currentCode] = previousCode;
			extensionBytes[currentCode] = firstByte;
			lengths[currentCode] = lengths[previousCode] + 1;
			lastPositions[currentCode] = lastPositions[previousCode];
			output[position] = firstByte;
		}
		const result = outputCode(currentCode, previousCode, firstByte);
		firstByte = result.firstByte;
		const newCode = queue[queueIndex];
		if (newCode != INVALID_CODE) {
			queueIndex++;
			prefixCodes[newCode] = previousCode;
			extensionBytes[newCode] = firstByte;
			lengths[newCode] = prefixCodes[previousCode] == INVALID_CODE ? UNKNOWN_LENGTH : lengths[previousCode] + 1;
			lastPositions[newCode] = lastPositions[previousCode];
		}
		lastPositions[currentCode] = position;
		position += result.length;
		previousCode = currentCode;
	}
	return { output: position == uncompressedSize ? output : output.slice(0, position), bytesRead: reader.bytesRead };
}

export { unshrink };
