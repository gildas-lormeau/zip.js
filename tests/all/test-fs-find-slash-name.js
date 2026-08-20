import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";

export { test };

// find(fullname) must locate an entry from its full filename (as returned by getFullname()), even
// when the entry was added with a name that contains "/" verbatim (add* methods do not split the
// name into path segments, so such a name is stored on a single entry).
async function test() {
	zip.configure({ useWebWorkers: false });
	const fs = new zip.ZipFS();

	// entry added with a literal "/" in its name, directly under the root
	const flat = fs.addText("dir/file.txt", TEXT_CONTENT);
	if (flat.getFullname() != "dir/file.txt") {
		throw new Error("unexpected full name for verbatim slashed entry");
	}
	if (fs.find("dir/file.txt") != flat) {
		throw new Error("entry with a verbatim '/' in its name could not be found");
	}

	// verbatim slashed name nested under a real directory: find must still resolve the full name
	const sub = fs.addDirectory("sub");
	const nested = sub.addText("a/b.txt", TEXT_CONTENT);
	if (nested.getFullname() != "sub/a/b.txt" || fs.find("sub/a/b.txt") != nested) {
		throw new Error("nested entry with a verbatim '/' in its name could not be found");
	}

	// the regular path-segment lookup must keep working
	const inner = sub.addText("inner.txt", TEXT_CONTENT);
	if (fs.find("sub") != sub || fs.find("sub/inner.txt") != inner) {
		throw new Error("path-segment lookup regressed");
	}

	// a genuinely missing entry must still return undefined
	if (fs.find("missing/entry.txt") !== undefined) {
		throw new Error("missing entry should not be found");
	}

	await zip.terminateWorkers();
}
