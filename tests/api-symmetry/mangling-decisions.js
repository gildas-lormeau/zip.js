// Members of the public API that are absent from index.d.ts, are not mangled, and are kept that way on
// purpose. The value is the reason. An entry that stops applying fails the audit, so this file cannot
// accumulate rows that no longer describe anything.

const ACCEPTED_UNDECLARED = {};

// Property names lib/ assigns on objects it does not own, so the name has to be the host's and stays
// unmangled on purpose. The value is the reason, and an entry that stops applying fails the audit too.
const ACCEPTED_HOST_ASSIGNMENTS = {
	length: "arrays are emptied by assigning their length",
	responseType: "XMLHttpRequest, in the fetch fallback of the HTTP readers",
	onmessage: "MessagePort, the macrotask scheduler of the gzip route",
	kind: "the FileSystemHandle shape ZipFS builds for the File System Access export",
	getFile: "the FileSystemHandle shape ZipFS builds for the File System Access export",
	values: "the FileSystemHandle shape ZipFS builds for the File System Access export",
	in: "the codec state of the vendored zlib-streams module, kept byte-identical to its dist file"
};

export { ACCEPTED_UNDECLARED, ACCEPTED_HOST_ASSIGNMENTS };
