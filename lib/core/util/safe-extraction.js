/*
 Copyright (c) 2024 zip.js contributors. All rights reserved.

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

import {
	createSafeExtractionPath,
	validateFilename,
	sanitizeFilename,
	joinPaths,
	VALIDATION_STRICT,
	DEFAULT_SECURITY_OPTIONS
} from "./filename-security.js";

const ERR_EXTRACTION_OUTSIDE_TARGET = "Entry would extract outside target directory";
const ERR_INVALID_BASE_PATH = "Invalid base path for extraction";
const ERR_ENTRY_FILENAME_REQUIRED = "Entry filename is required";

/**
 * Safely extracts a zip entry to a target directory with security validation
 * @param {Object} entry - The zip entry to extract
 * @param {string} basePath - The base directory for extraction
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} Extraction result with path information
 */
async function extractSafely(entry, basePath, options = {}) {
	if (!entry || !entry.filename) {
		throw new Error(ERR_ENTRY_FILENAME_REQUIRED);
	}
	
	if (!basePath || typeof basePath !== "string") {
		throw new Error(ERR_INVALID_BASE_PATH);
	}
	
	// Merge with default security options
	const securityOptions = Object.assign({}, DEFAULT_SECURITY_OPTIONS, {
		filenameValidation: VALIDATION_STRICT // Always strict for extraction
	}, options.security || {});
	
	// Create safe extraction path
	const pathInfo = createSafeExtractionPath(entry.filename, basePath, securityOptions);
	
	// Additional safety check using path resolution if available
	if (typeof require !== "undefined") {
		try {
			const path = require("path");
			const resolvedPath = path.resolve(pathInfo.fullPath);
			const resolvedBase = path.resolve(basePath);
			
			if (!resolvedPath.startsWith(resolvedBase + path.sep) && resolvedPath !== resolvedBase) {
				throw new Error(ERR_EXTRACTION_OUTSIDE_TARGET);
			}
		} catch (error) {
			if (error.message === ERR_EXTRACTION_OUTSIDE_TARGET) {
				throw error;
			}
			// If path module is not available, continue with our validation
		}
	}
	
	return {
		entry,
		originalFilename: entry.filename,
		safeFilename: pathInfo.safePath,
		fullPath: pathInfo.fullPath,
		wasModified: pathInfo.wasModified,
		issues: pathInfo.issues,
		basePath
	};
}

/**
 * Extracts multiple entries safely to a target directory
 * @param {Array} entries - Array of zip entries to extract
 * @param {string} basePath - The base directory for extraction
 * @param {Object} options - Extraction options
 * @returns {Promise<Array>} Array of extraction results
 */
async function extractMultipleSafely(entries, basePath, options = {}) {
	const results = [];
	const usedPaths = new Set();
	
	for (const entry of entries) {
		try {
			const result = await extractSafely(entry, basePath, options);
			
			// Check for filename conflicts after sanitization
			if (usedPaths.has(result.safeFilename.toLowerCase())) {
				// Generate a unique filename
				const timestamp = Date.now();
				const lastDot = result.safeFilename.lastIndexOf(".");
				if (lastDot > 0) {
					const name = result.safeFilename.substring(0, lastDot);
					const ext = result.safeFilename.substring(lastDot);
					result.safeFilename = `${name}_${timestamp}${ext}`;
				} else {
					result.safeFilename = `${result.safeFilename}_${timestamp}`;
				}
				result.fullPath = joinPaths(basePath, result.safeFilename);
				result.wasModified = true;
			}
			
			usedPaths.add(result.safeFilename.toLowerCase());
			results.push(result);
		} catch (error) {
			if (options.continueOnError) {
				results.push({
					entry,
					error: error.message,
					originalFilename: entry.filename,
					failed: true
				});
			} else {
				throw error;
			}
		}
	}
	
	return results;
}

/**
 * Validates that all entries in a zip file are safe for extraction
 * @param {Array} entries - Array of zip entries to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation summary
 */
function validateEntriesForExtraction(entries, options = {}) {
	const securityOptions = Object.assign({}, DEFAULT_SECURITY_OPTIONS, options);
	const results = {
		safe: [],
		unsafe: [],
		issues: [],
		summary: {
			totalEntries: entries.length,
			safeEntries: 0,
			unsafeEntries: 0,
			hasHighRiskIssues: false
		}
	};
	
	for (const entry of entries) {
		const validation = validateFilename(entry.filename, securityOptions);
		
		if (validation.isValid) {
			results.safe.push({
				entry,
				filename: entry.filename
			});
			results.summary.safeEntries++;
		} else {
			const highRiskIssues = validation.issues.filter(issue => issue.severity === "high");
			if (highRiskIssues.length > 0) {
				results.summary.hasHighRiskIssues = true;
			}
			
			results.unsafe.push({
				entry,
				filename: entry.filename,
				issues: validation.issues,
				sanitized: validation.sanitized
			});
			results.summary.unsafeEntries++;
			results.issues.push(...validation.issues);
		}
	}
	
	return results;
}

/**
 * Creates a safe extraction configuration for common use cases
 * @param {string} level - Security level: 'strict', 'balanced', or 'permissive'
 * @returns {Object} Security configuration
 */
function createExtractionConfig(level = "balanced") {
	const configs = {
		strict: {
			filenameValidation: "strict",
			allowPathTraversal: false,
			allowAbsolutePaths: false,
			maxFilenameLength: 255,
			customValidator: null
		},
		balanced: {
			filenameValidation: "warn",
			allowPathTraversal: false,
			allowAbsolutePaths: false,
			maxFilenameLength: 512,
			customValidator: null
		},
		permissive: {
			filenameValidation: "warn",
			allowPathTraversal: true,
			allowAbsolutePaths: true,
			maxFilenameLength: 1024,
			customValidator: null
		}
	};
	
	return configs[level] || configs.balanced;
}

export {
	extractSafely,
	extractMultipleSafely,
	validateEntriesForExtraction,
	createExtractionConfig,
	ERR_EXTRACTION_OUTSIDE_TARGET,
	ERR_INVALID_BASE_PATH,
	ERR_ENTRY_FILENAME_REQUIRED
};