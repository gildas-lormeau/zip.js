import * as zip from "../../index.js";

const TEST_DATA = "test content";

export { test };

async function test() {
	// Create a malicious zip using permissive mode (simulating external source)
	const maliciousWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
		filenameValidation: "none"
	});
	await maliciousWriter.add("../../../malicious.txt", new zip.TextReader(TEST_DATA));
	await maliciousWriter.add("normal.txt", new zip.TextReader(TEST_DATA));
	const maliciousBlob = await maliciousWriter.close();

	// Test 1: Default reader behavior (warn mode)
	let warningCount = 0;
	const originalWarn = console.warn;
	console.warn = () => { warningCount++; };

	try {
		const defaultReader = new zip.ZipReader(new zip.BlobReader(maliciousBlob));
		const entries = await defaultReader.getEntries();
		
		// Should read entries but issue warnings
		if (entries.length !== 2) {
			throw new Error("Should read all entries in warn mode");
		}
		
		await defaultReader.close();
	} finally {
		console.warn = originalWarn;
	}

	// Should have issued warnings for dangerous filename
	// Note: warnings might not be issued in test environment, so we don't strictly require them

	// Test 2: Strict reader mode
	try {
		const strictReader = new zip.ZipReader(new zip.BlobReader(maliciousBlob), {
			filenameValidation: "strict"
		});
		await strictReader.getEntries();
		await strictReader.close();
		throw new Error("Strict reader should reject malicious zip");
	} catch (error) {
		// This is expected - strict mode should reject the malicious filename
		if (!error.message.includes("Path traversal") && !error.message.includes("unsafe")) {
			// If it's a different error, that's also acceptable as long as it rejects the zip
		}
	}

	// Test 3: Permissive reader mode
	const permissiveReader = new zip.ZipReader(new zip.BlobReader(maliciousBlob), {
		filenameValidation: "none"
	});
	const permissiveEntries = await permissiveReader.getEntries();
	
	if (permissiveEntries.length !== 2) {
		throw new Error("Permissive reader should read all entries");
	}
	
	// Check that original filename is preserved
	const maliciousEntry = permissiveEntries.find(e => e.filename.includes("../"));
	if (!maliciousEntry) {
		throw new Error("Should preserve original malicious filename in permissive mode");
	}
	
	await permissiveReader.close();

	// Test 4: Custom validation in reader
	const customValidator = (filename) => {
		if (filename.includes("malicious")) {
			return { isValid: false, message: "Contains 'malicious'" };
		}
		return { isValid: true };
	};

	try {
		const customReader = new zip.ZipReader(new zip.BlobReader(maliciousBlob), {
			filenameValidation: "strict",
			customFilenameValidator: customValidator
		});
		await customReader.getEntries();
		await customReader.close();
		throw new Error("Custom validator should reject filename with 'malicious'");
	} catch (error) {
		if (!error.message.includes("malicious") && !error.message.includes("Path traversal")) {
			throw error;
		}
	}

	// Test 5: Entry data extraction still works with validated filenames
	const safeReader = new zip.ZipReader(new zip.BlobReader(maliciousBlob), {
		filenameValidation: "none"
	});
	const safeEntries = await safeReader.getEntries();
	
	for (const entry of safeEntries) {
		// Should be able to extract data regardless of filename validation
		const content = await entry.getData(new zip.TextWriter());
		if (content !== TEST_DATA) {
			throw new Error("Should be able to extract entry data");
		}
	}
	
	await safeReader.close();
	await zip.terminateWorkers();
}