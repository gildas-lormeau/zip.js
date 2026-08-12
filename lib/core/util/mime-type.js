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

import { getMimeType as getDefaultMimeType } from "./default-mime-type.js";
import { encodedMimeTypes } from "./mime-type-data.js";

let mimeTypes;

export {
	getMimeType,
	decodeMimeTypes
};

function getMimeType(filename) {
	return filename && getMimeTypes()[filename.split(".").pop().toLowerCase()] || getDefaultMimeType();
}

function getMimeTypes() {
	if (!mimeTypes) {
		mimeTypes = decodeMimeTypes(encodedMimeTypes);
	}
	return mimeTypes;
}

function decodeMimeTypes(data) {
	const mimeTypes = Object.create(null);
	for (const block of data.split(";")) {
		const colonIndex = block.indexOf(":");
		const type = block.slice(0, colonIndex);
		let previousSubtype = "";
		for (const entry of block.slice(colonIndex + 1).split(",")) {
			const tokens = entry.split(" ");
			const subtype = previousSubtype.slice(0, Number.parseInt(tokens[0][0], 36)) + tokens[0].slice(1);
			previousSubtype = subtype;
			const expandedSubtype = subtype.replace(/!/g, "+xml");
			const extensions = tokens.length > 1 ? tokens.slice(1) : [expandedSubtype.split("+")[0]];
			for (const extension of extensions) {
				mimeTypes[extension] = type + "/" + expandedSubtype;
			}
		}
	}
	return mimeTypes;
}
