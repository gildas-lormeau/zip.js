/* global Worker, TextEncoder, ReadableStream, WritableStream */

import * as zip from "../zip-lib.js";
import { WORKER_MESSAGE_PROPERTY_NAMES } from "../../worker-message-property-names.js";

// every property name crossing postMessage must be declared, otherwise the two independent terser
// passes (main bundle and worker bundle) mangle it to two different names and the worker silently
// reads undefined
const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, ".repeat(200);
const FILENAME = "lorem.txt";
const PASSWORD = "secret";
const MAXIMUM_RECORDED_DEPTH = 3;

export { test };

async function test() {
	const recordedNames = new Set();
	const NativeWorker = Worker;
	await zip.terminateWorkers();
	globalThis.Worker = class extends NativeWorker {
		constructor(...parameters) {
			super(...parameters);
			super.addEventListener("message", ({ data }) => recordNames(recordedNames, data));
		}
		postMessage(message, transfer) {
			recordNames(recordedNames, message);
			return super.postMessage(message, transfer);
		}
	};
	try {
		for (const options of [
			{ level: 9, checkCrc32: true },
			{ password: PASSWORD, encryptionStrength: 3 },
			{ password: PASSWORD, encryptionStrength: 1 },
			{ password: PASSWORD, zipCrypto: true },
			{ rawPassword: new TextEncoder().encode(PASSWORD) }
		]) {
			await testEntry(options, true);
			await testEntry(options, false);
		}
		await testCheckPasswordOnly();
	} finally {
		globalThis.Worker = NativeWorker;
		await zip.terminateWorkers();
		zip.resetConfiguration();
	}
	if (!recordedNames.size) {
		throw new Error("no worker message recorded");
	}
	const undeclaredNames = [...recordedNames].filter(name => !WORKER_MESSAGE_PROPERTY_NAMES.includes(name));
	if (undeclaredNames.length) {
		throw new Error("undeclared worker message properties: " + undeclaredNames.join(", "));
	}
}

async function testEntry(options, transferStreams) {
	const data = await writeEntry(options, transferStreams);
	const text = await readEntry(data, {
		password: options.password,
		rawPassword: options.rawPassword,
		checkCrc32: options.checkCrc32
	}, transferStreams);
	if (text != TEXT_CONTENT) {
		throw new Error();
	}
}

async function testCheckPasswordOnly() {
	const data = await writeEntry({ password: PASSWORD }, true);
	configure(true);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	try {
		const entries = await zipReader.getEntries();
		await entries[0].getData(new zip.Uint8ArrayWriter(), { password: PASSWORD, checkPasswordOnly: true });
	} finally {
		await zipReader.close();
	}
}

async function writeEntry(options, transferStreams) {
	configure(transferStreams);
	const uint8ArrayWriter = new zip.Uint8ArrayWriter();
	const zipWriter = new zip.ZipWriter(uint8ArrayWriter);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), options);
	await zipWriter.close();
	return uint8ArrayWriter.getData();
}

async function readEntry(data, options, transferStreams) {
	configure(transferStreams);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	try {
		const entries = await zipReader.getEntries();
		return await entries[0].getData(new zip.TextWriter(), options);
	} finally {
		await zipReader.close();
	}
}

function configure(transferStreams) {
	zip.configure({ chunkSize: 1024, maxWorkers: 1, useWebWorkers: true, transferStreams });
}

function recordNames(names, value, depth = 0) {
	if (!value || typeof value != "object" || depth > MAXIMUM_RECORDED_DEPTH || Array.isArray(value) ||
		value instanceof Uint8Array || value instanceof ArrayBuffer ||
		value instanceof ReadableStream || value instanceof WritableStream) {
		return;
	}
	for (const name of Object.getOwnPropertyNames(value)) {
		names.add(name);
		try {
			recordNames(names, value[name], depth + 1);
		} catch {
			// ignored
		}
	}
}
