/*
 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright 
 notice, this list of conditions and the following disclaimer in 
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const MINIMUM_CHUNK_SIZE = 64;
const ERR_ABORT = "Abort error";

export {
	ERR_ABORT,
	processData
};

async function processData(codec, reader, writer, offset, inputLengthGetter, config, options) {
	const chunkSize = Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
	return processChunk();

	async function processChunk(chunkOffset = 0, outputLength = 0) {
		const signal = options.signal;
		const inputLength = inputLengthGetter();
		if (chunkOffset < inputLength) {
			testAborted(signal, codec);
			const inputData = await reader.readUint8Array(chunkOffset + offset, Math.min(chunkSize, inputLength - chunkOffset));
			const chunkLength = inputData.length;
			testAborted(signal, codec);
			const data = await codec.append(inputData);
			testAborted(signal, codec);
			outputLength += await writeData(writer, data);
			if (options.onprogress) {
				try {
					options.onprogress(chunkOffset + chunkLength, inputLength);
				} catch (error) {
					// ignored
				}
			}
			return processChunk(chunkOffset + chunkSize, outputLength);
		} else {
			const result = await codec.flush();
			outputLength += await writeData(writer, result.data);
			return { signature: result.signature, length: outputLength };
		}
	}
}

function testAborted(signal, codec) {
	if (signal && signal.aborted) {
		codec.abort();
		throw new Error(ERR_ABORT);
	}
}

async function writeData(writer, data) {
	if (data.length) {
		await writer.writeUint8Array(data);
	}
	return data.length;
}