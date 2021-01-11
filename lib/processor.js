"use strict";

const MINIMUM_CHUNK_SIZE = 64;

export default processData;

async function processData(codec, reader, writer, offset, inputLength, config, options) {
	const chunkSize = Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
	return processChunk();

	async function processChunk(chunkIndex = 0, length = 0) {
		const chunkOffset = chunkIndex * chunkSize;
		if (chunkOffset < inputLength) {
			const inputData = await reader.readUint8Array(chunkOffset + offset, Math.min(chunkSize, inputLength - chunkOffset));
			const data = await codec.append(inputData);
			length += await writeData(writer, data);
			if (options.onprogress) {
				options.onprogress(chunkOffset + inputData.length, inputLength);
			}
			return processChunk(chunkIndex + 1, length);
		} else {
			const result = await codec.flush();
			length += await writeData(writer, result.data);
			return { signature: result.signature, length };
		}
	}
}

async function writeData(writer, data) {
	if (data.length) {
		await writer.writeUint8Array(data);
	}
	return data.length;
}