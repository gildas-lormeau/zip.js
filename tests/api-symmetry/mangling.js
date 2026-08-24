// Audits the members of the public API against the two lists that decide whether minification keeps them.
//
// terser mangles every property name except those on the reserved list built by reserved-property-names.js,
// whose first and largest source is index.d.ts. A member of a public class therefore has exactly two correct
// states: declared in index.d.ts, so the minified builds keep it on purpose, or absent from index.d.ts and
// present in mangled-property-names.js, so the minified builds rename it on purpose.
//
// A member in neither list is the failure this audit exists for: it is undeclared, so nothing in the build
// intends to keep it, yet it survives anyway because its name happens to collide with a name terser protects
// on its own, i.e. a DOM property or a member of lib.dom/lib.webworker. It works today and disappears the day
// terser updates that list. ZipEntry#moveTo lived in that state for five weeks before being removed.
//
// The reverse, a member declared in index.d.ts and mangled, cannot happen while the reserved list is built
// from the declarations, so it is asserted rather than reported: it would mean the two files disagree.
//
// The audit reads the source build, where nothing is mangled, because that is the only build in which an
// internal member is still visible under its real name.
//
// A prototype is reachable from the class, but the members an instance carries are only reachable from an
// instance, so an exported class the audit never constructs is a blind spot: contentType, encoding and url
// all hid in one. Every exported class is therefore required to be instantiated here, and failing to do so
// fails the audit rather than quietly shrinking what it covers.
//
// Run with: npm run test-api-mangling

import { fileURLToPath, pathToFileURL } from "node:url";
import { collectDeclarationNames } from "../../reserved-property-names.js";
import { MANGLED_PROPERTY_NAMES } from "../../mangled-property-names.js";
import { ACCEPTED_UNDECLARED } from "./mangling-decisions.js";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const PASSWORD = "secret";
const IGNORED_MEMBERS = ["constructor", "length", "name", "prototype", "caller", "arguments"];

const zip = await import(pathToFileURL(ROOT + "index.js"));
const declared = collectDeclarationNames(ROOT + "index.d.ts");
const mangled = new Set(MANGLED_PROPERTY_NAMES);
const members = new Map();
const exportedClasses = new Map();
const instantiatedClasses = new Set();
const failures = [];
const usedExceptions = new Set();

zip.configure({ useWebWorkers: false });

collectClasses();
await collectInstances();
await zip.terminateWorkers();
classify();
checkExceptions();
checkClassesInstantiated();
summarize();

function collectClasses() {
	Object.entries(zip).forEach(([name, value]) => {
		if (name == "fs") {
			Object.entries(value).forEach(([fsName, fsValue]) => collectClass(fsValue, "zip.fs." + fsName));
		} else {
			collectClass(value, "zip." + name);
		}
	});
}

function collectClass(value, label) {
	if (typeof value != "function" || !value.prototype) {
		return;
	}
	if (value.toString().startsWith("class ")) {
		exportedClasses.set(value, label);
	}
	let prototype = value.prototype;
	while (prototype && prototype != Object.prototype) {
		Object.getOwnPropertyNames(prototype).forEach(name => record(name, label + "#" + name));
		prototype = Object.getPrototypeOf(prototype);
	}
	Object.getOwnPropertyNames(value).forEach(name => record(name, label + "." + name));
}

function collectInstance(value, label) {
	if (value && typeof value == "object") {
		instantiatedClasses.add(value.constructor);
		Object.getOwnPropertyNames(value).forEach(name => record(name, label + "." + name));
	}
}

function record(name, origin) {
	if (!IGNORED_MEMBERS.includes(name)) {
		if (!members.has(name)) {
			members.set(name, new Set());
		}
		members.get(name).add(origin);
	}
}

async function collectInstances() {
	const options = {
		comment: "entry comment",
		lastAccessDate: new Date(),
		creationDate: new Date(),
		extendedTimestamp: true,
		unixMode: 0o100755,
		uid: 501,
		gid: 20,
		extraField: new Map([[0x1234, new Uint8Array([1, 2])]]),
		localExtraField: new Map([[0x1235, new Uint8Array([3])]]),
		centralExtraField: new Map([[0x1236, new Uint8Array([4])]]),
		password: PASSWORD,
		zip64: true
	};
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 0, keepOrder: true });
	collectInstance(writer, "ZipWriter");
	collectInstance(await writer.add("file.txt", new zip.TextReader("content"), options), "ZipWriter#add");
	await writer.add("folder/", undefined, Object.assign({}, options, { directory: true }));
	await writer.add("plain.txt", new zip.TextReader("content"), { dataDescriptor: false });
	await writer.add("link", new zip.TextReader("plain.txt"), { unixMode: 0o120777 });
	const data = await writer.close(new TextEncoder().encode("archive comment"));
	const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { password: PASSWORD, checkLocalDirectory: true });
	collectInstance(reader, "ZipReader");
	const entries = await reader.getEntries();
	entries.forEach(entry => {
		collectInstance(entry, "Entry");
		collectInstance(entry.localDirectory, "Entry.localDirectory");
	});
	await entries.find(entry => entry.filename == "file.txt").getData(new zip.TextWriter());
	await reader.close();
	const filesystem = new zip.ZipFS();
	collectInstance(filesystem, "ZipFS");
	collectInstance(filesystem.addText("added.txt", "content"), "ZipFS#addText");
	collectInstance(filesystem.addDirectory("added"), "ZipFS#addDirectory");
	await filesystem.importUint8Array(data, { password: PASSWORD });
	filesystem.entries.forEach(entry => collectInstance(entry, "ZipFS entry"));
	collectInstance(new zip.Uint8ArrayWriter(), "Uint8ArrayWriter");
	collectInstance(new zip.SplitDataWriter(() => new zip.Uint8ArrayWriter()), "SplitDataWriter");
	await collectReaderWriterInstances(data);
	await collectStreamInstances(data);
	collectTempStreamInstances();
}

// the readers and the writers keep their state on the instance, so each one is reached through an
// instance, the writers after a write since some of their members only exist once data went through
async function collectReaderWriterInstances(data) {
	Object.entries({
		BlobReader: new zip.BlobReader(new Blob([data])),
		TextReader: new zip.TextReader("content"),
		Data64URIReader: new zip.Data64URIReader("data:;base64,AAAA"),
		Uint8ArrayReader: new zip.Uint8ArrayReader(data),
		HttpReader: new zip.HttpReader("https://example.com/"),
		HttpRangeReader: new zip.HttpRangeReader("https://example.com/")
	}).forEach(([label, reader]) => collectInstance(reader, label));
	const splitDataReader = new zip.SplitDataReader([new zip.Uint8ArrayReader(data)]);
	await splitDataReader.init();
	collectInstance(splitDataReader, "SplitDataReader");
	Object.entries({
		Reader: new zip.Reader(),
		Writer: new zip.Writer()
	}).forEach(([label, stream]) => {
		stream.init();
		collectInstance(stream, label);
	});
	for (const [label, writer] of Object.entries({
		BlobWriter: new zip.BlobWriter("text/plain"),
		Data64URIWriter: new zip.Data64URIWriter("text/plain"),
		TextWriter: new zip.TextWriter()
	})) {
		await writer.init(3);
		const streamWriter = writer.writable.getWriter();
		await streamWriter.write(new Uint8Array([1, 2, 3]));
		await streamWriter.close();
		await writer.getData();
		collectInstance(writer, label);
	}
}

// the stream classes only hold the members the transformation needs, so each one is driven end to end
// and the entries the reader stream emits are collected too since they are a shape of their own
async function collectStreamInstances(data) {
	const readerStream = new zip.ZipReaderStream({ password: PASSWORD });
	collectInstance(readerStream, "ZipReaderStream");
	const readerStreamWritten = new Blob([data]).stream().pipeTo(readerStream.writable);
	for await (const entry of readerStream.readable) {
		collectInstance(entry, "ZipReaderStream entry");
		await entry.readable.pipeTo(new WritableStream());
	}
	await readerStreamWritten;
	const writerStream = new zip.ZipWriterStream();
	collectInstance(writerStream, "ZipWriterStream");
	const writerStreamRead = writerStream.readable.pipeTo(new WritableStream());
	await new Blob(["content"]).stream().pipeTo(writerStream.writable("streamed.txt"));
	await writerStream.close();
	await writerStreamRead;
}

// the temporary streams are factories, so the object a call returns is what the archive holds. the two
// storage-backed ones get a directory that is never opened, since nothing here writes enough to spill
function collectTempStreamInstances() {
	const options = { getDirectory: () => { throw new Error("the audit must not spill to storage"); } };
	Object.entries({
		createBlobTempStream: zip.createBlobTempStream(),
		createOPFSTempStream: zip.createOPFSTempStream(options),
		createSyncAccessHandleTempStream: zip.createSyncAccessHandleTempStream(options)
	}).forEach(([label, createTempStream]) => collectInstance(createTempStream(), label));
}

function classify() {
	const counts = { declared: 0, mangled: 0, accepted: 0 };
	[...members.keys()].sort().forEach(name => {
		const origins = [...members.get(name)].sort().join(", ");
		if (declared.has(name)) {
			counts.declared++;
			if (mangled.has(name)) {
				failures.push(`${name} is declared in index.d.ts and listed in mangled-property-names.js (${origins})`);
			}
		} else if (mangled.has(name)) {
			counts.mangled++;
		} else if (isAccepted(name)) {
			counts.accepted++;
		} else {
			failures.push(`${name} is undeclared and unmangled, so it survives minification only by name collision (${origins})`);
		}
	});
	console.log(`${members.size} members reached: ${counts.declared} declared, ${counts.mangled} mangled, ${counts.accepted} accepted`);
}

function isAccepted(name) {
	if (ACCEPTED_UNDECLARED[name] !== undefined) {
		usedExceptions.add(name);
		return true;
	}
	return false;
}

function checkExceptions() {
	Object.keys(ACCEPTED_UNDECLARED).forEach(name => {
		if (!usedExceptions.has(name)) {
			failures.push(`the exception recorded for ${name} no longer applies`);
		}
	});
}

// a base class is covered by an instance of any of its subclasses, since the fields its constructor sets are
// own properties of that instance, so only a class no instance derives from is a blind spot
function checkClassesInstantiated() {
	exportedClasses.forEach((label, exportedClass) => {
		const covered = [...instantiatedClasses].some(instantiatedClass =>
			instantiatedClass == exportedClass || Object.prototype.isPrototypeOf.call(exportedClass, instantiatedClass));
		if (!covered) {
			failures.push(`${label} is never instantiated, so the members its instances carry stay invisible here`);
		}
	});
}

function summarize() {
	if (failures.length) {
		failures.forEach(failure => console.log(`FAIL ${failure}`));
		console.log(`\n${failures.length} problem(s) in what the minified builds keep`);
		process.exit(1);
	}
	console.log("every member of the public API is either declared in index.d.ts or mangled on purpose");
}
