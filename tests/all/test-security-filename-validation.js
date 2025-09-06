import * as zip from "../../index.js";

const TEST_DATA = "test content";

export { test };

async function test() {
	// Test 1: Default strict validation blocks path traversal
	try {
		const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
		await zipWriter.add("../../../malicious.txt", new zip.TextReader(TEST_DATA));
		await zipWriter.close();
		throw new Error("Should have rejected path traversal");
	} catch (error) {
		if (!error.message.includes("Path traversal detected")) {
			throw error;
		}
	}

	// Test 2: Default strict validation blocks absolute paths
	try {
		const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
		await zipWriter.add("/etc/passwd", new zip.TextReader(TEST_DATA));
		await zipWriter.close();
		throw new Error("Should have rejected absolute path");
	} catch (error) {
		if (!error.message.includes("Absolute paths are not allowed")) {
			throw error;
		}
	}

	// Test 3: Permissive mode allows dangerous filenames (legacy compatibility)
	const permissiveWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
		filenameValidation: "none"
	});
	await permissiveWriter.add("../../../legacy.txt", new zip.TextReader(TEST_DATA));
	const permissiveBlob = await permissiveWriter.close();
	
	if (permissiveBlob.size === 0) {
		throw new Error("Permissive mode should create valid zip");
	}

	// Test 4: Warning mode allows but warns
	let warningIssued = false;
	const originalWarn = console.warn;
	console.warn = () => { warningIssued = true; };
	
	try {
		const warnWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
			filenameValidation: "warn"
		});
		await warnWriter.add("../warning.txt", new zip.TextReader(TEST_DATA));
		await warnWriter.close();
	} finally {
		console.warn = originalWarn;
	}
	
	if (!warningIssued) {
		throw new Error("Warning mode should issue warnings");
	}

	// Test 5: Safe filenames work normally
	const safeWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
	await safeWriter.add("safe.txt", new zip.TextReader(TEST_DATA));
	await safeWriter.add("subdir/safe2.txt", new zip.TextReader(TEST_DATA));
	const safeBlob = await safeWriter.close();
	
	if (safeBlob.size === 0) {
		throw new Error("Safe filenames should work normally");
	}

	// Test 6: Custom validator
	const customValidator = (filename) => {
		if (filename.includes("forbidden")) {
			return { isValid: false, message: "Forbidden word" };
		}
		return { isValid: true };
	};
	
	try {
		const customWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
			customFilenameValidator: customValidator
		});
		await customWriter.add("forbidden_file.txt", new zip.TextReader(TEST_DATA));
		await customWriter.close();
		throw new Error("Custom validator should have rejected filename");
	} catch (error) {
		if (!error.message.includes("Forbidden word")) {
			throw error;
		}
	}

	await zip.terminateWorkers();
}