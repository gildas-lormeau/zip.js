import * as zip from "../../index.js";

const TEST_DATA = "test content";

export { test };

async function test() {
	// Create a zip with potentially dangerous filenames using permissive mode
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
		filenameValidation: "none"
	});
	await zipWriter.add("../../../dangerous.txt", new zip.TextReader(TEST_DATA));
	await zipWriter.add("safe.txt", new zip.TextReader(TEST_DATA));
	await zipWriter.add("/etc/passwd", new zip.TextReader(TEST_DATA));
	const testBlob = await zipWriter.close();

	// Read the zip
	const zipReader = new zip.ZipReader(new zip.BlobReader(testBlob), {
		filenameValidation: "none" // Allow reading dangerous zip
	});
	const entries = await zipReader.getEntries();

	// Test 1: validateEntriesForExtraction
	const validation = zip.validateEntriesForExtraction(entries);
	
	if (validation.summary.totalEntries !== 3) {
		throw new Error("Should find 3 entries");
	}
	
	if (validation.summary.safeEntries !== 1) {
		throw new Error("Should find 1 safe entry");
	}
	
	if (validation.summary.unsafeEntries !== 2) {
		throw new Error("Should find 2 unsafe entries");
	}
	
	if (!validation.summary.hasHighRiskIssues) {
		throw new Error("Should detect high risk issues");
	}

	// Test 2: extractSafely blocks dangerous extractions
	const dangerousEntry = entries.find(e => e.filename.includes("../../../"));
	
	try {
		await zip.extractSafely(dangerousEntry, "./test_extract");
		// If we get here, it should be because the filename was sanitized
		const result = await zip.extractSafely(dangerousEntry, "./test_extract");
		if (result.originalFilename === result.safeFilename) {
			throw new Error("Dangerous filename should have been sanitized");
		}
	} catch (error) {
		// This is expected if strict validation blocks it entirely
		if (!error.message.includes("Path traversal") && !error.message.includes("unsafe")) {
			throw error;
		}
	}

	// Test 3: extractSafely allows safe extractions
	const safeEntry = entries.find(e => e.filename === "safe.txt");
	const safeResult = await zip.extractSafely(safeEntry, "./test_extract");
	
	if (safeResult.originalFilename !== "safe.txt") {
		throw new Error("Safe filename should be preserved");
	}
	
	if (safeResult.wasModified) {
		throw new Error("Safe filename should not be modified");
	}

	// Test 4: Utility functions work correctly
	if (!zip.hasPathTraversal("../../../test")) {
		throw new Error("Should detect path traversal");
	}
	
	if (zip.hasPathTraversal("safe/file.txt")) {
		throw new Error("Should not detect path traversal in safe path");
	}
	
	if (!zip.isAbsolutePath("/etc/passwd")) {
		throw new Error("Should detect absolute path");
	}
	
	if (zip.isAbsolutePath("relative/path.txt")) {
		throw new Error("Should not detect absolute path in relative path");
	}

	// Test 5: Filename sanitization
	const sanitized = zip.sanitizeFilename("../../../dangerous.txt");
	if (sanitized.includes("../")) {
		throw new Error("Sanitization should remove path traversal");
	}

	const validation2 = zip.validateFilename("../../../test.txt");
	if (validation2.isValid) {
		throw new Error("Should mark dangerous filename as invalid");
	}
	
	if (validation2.issues.length === 0) {
		throw new Error("Should report issues for dangerous filename");
	}

	const validation3 = zip.validateFilename("safe.txt");
	if (!validation3.isValid) {
		throw new Error("Should mark safe filename as valid");
	}

	await zipReader.close();
	await zip.terminateWorkers();
}