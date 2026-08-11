/* global Uint8Array */

// JavaScript port of the Reduce decompression ("expand") code of hwzip 2.4
// by Hans Wennborg (https://www.hanshq.net/zip.html), placed in the public domain.

const DLE_BYTE = 144;
const MAX_FOLLOWER_SET_SIZE = 32;
const ERR_INVALID_DATA = "Invalid reduced data";

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

	readBits(count) {
		if (this.bitEnd - this.bitPosition < count) {
			throw new Error(ERR_INVALID_DATA);
		}
		const value = this.peekBits(count);
		this.bitPosition += count;
		return value;
	}

	get bytesRead() {
		return Math.ceil(this.bitPosition / 8);
	}
}

function followerIndexBitCount(size) {
	if (size > 16) {
		return 5;
	}
	if (size > 8) {
		return 4;
	}
	if (size > 4) {
		return 3;
	}
	if (size > 2) {
		return 2;
	}
	if (size > 0) {
		return 1;
	}
	return 0;
}

function readFollowerSets(reader) {
	const followerSets = new Array(256);
	for (let byteValue = 255; byteValue >= 0; byteValue--) {
		const size = reader.readBits(6);
		if (size > MAX_FOLLOWER_SET_SIZE) {
			throw new Error(ERR_INVALID_DATA);
		}
		const followers = new Uint8Array(size);
		for (let followerIndex = 0; followerIndex < size; followerIndex++) {
			followers[followerIndex] = reader.readBits(8);
		}
		followerSets[byteValue] = { followers, indexBitCount: followerIndexBitCount(size) };
	}
	return followerSets;
}

function readNextByte(reader, previousByte, followerSets) {
	const { followers, indexBitCount } = followerSets[previousByte];
	if (!followers.length) {
		return reader.readBits(8);
	}
	if (reader.readBits(1)) {
		return reader.readBits(8);
	}
	const followerIndex = reader.readBits(indexBitCount);
	if (followerIndex >= followers.length) {
		throw new Error(ERR_INVALID_DATA);
	}
	return followers[followerIndex];
}

function expand(input, uncompressedSize, compressionFactor) {
	const reader = new BitReader(input);
	const followerSets = readFollowerSets(reader);
	const lengthBitCount = 8 - compressionFactor;
	const maxBaseLength = (1 << lengthBitCount) - 1;
	const output = new Uint8Array(uncompressedSize);
	let position = 0;
	let currentByte = 0;
	while (position < uncompressedSize) {
		currentByte = readNextByte(reader, currentByte, followerSets);
		if (currentByte != DLE_BYTE) {
			output[position++] = currentByte;
			continue;
		}
		currentByte = readNextByte(reader, currentByte, followerSets);
		if (currentByte == 0) {
			output[position++] = DLE_BYTE;
			continue;
		}
		const lengthByte = currentByte;
		let length = lengthByte & maxBaseLength;
		if (length == maxBaseLength) {
			currentByte = readNextByte(reader, currentByte, followerSets);
			length += currentByte;
		}
		length += 3;
		currentByte = readNextByte(reader, currentByte, followerSets);
		const distance = (lengthByte >> lengthBitCount) * 256 + currentByte + 1;
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

export { expand };
