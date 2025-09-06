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

const ERR_UNSAFE_FILENAME = "Unsafe filename detected";
const ERR_ABSOLUTE_PATH = "Absolute paths are not allowed";
const ERR_PATH_TRAVERSAL = "Path traversal detected in filename";
const ERR_INVALID_CHARACTERS = "Invalid characters in filename";
const ERR_FILENAME_TOO_LONG = "Filename exceeds maximum length";

// Security validation levels
const VALIDATION_STRICT = "strict";
const VALIDATION_WARN = "warn";
const VALIDATION_NONE = "none";

// Default security options
const DEFAULT_SECURITY_OPTIONS = {
	filenameValidation: VALIDATION_STRICT,
	allowPathTraversal: false,
	allowAbsolutePaths: false,
	allowWindowsDriveLetters: false,
	maxFilenameLength: 255,
	allowedCharacters: null, // null means use default validation
	customValidator: null,
	onUnsafeFilename: null // callback for unsafe filenames
};

/**
 * Checks if a filename contains path traversal sequences
 * @param {string} filename - The filename to check
 * @returns {boolean} True if path traversal is detected
 */
function hasPathTraversal(filename) {
	return filename.includes("../") || filename.includes("..\\") || 
		   filename.includes("\\..") || filename.includes("/..") ||
		   // Encoded variations
		   filename.includes("%2e%2e%2f") || filename.includes("%2e%2e%5c") ||
		   filename.includes("%2E%2E%2F") || filename.includes("%2E%2E%5C") ||
		   // Double-encoded
		   filename.includes("%252e%252e%252f") || filename.includes("%252e%252e%255c") ||
		   // Alternative representations
		   filename.includes("....//") || filename.includes("....\\\\");
}

/**
 * Checks if a filename is an absolute path
 * @param {string} filename - The filename to check
 * @returns {boolean} True if absolute path is detected
 */
function isAbsolutePath(filename) {
	// Unix absolute paths
	if (filename.startsWith("/")) {
		return true;
	}
	
	// Windows absolute paths (C:\, D:\, etc.)
	if (/^[A-Za-z]:[\\\/]/.test(filename)) {
		return true;
	}
	
	// UNC paths (\\server\share)
	if (filename.startsWith("\\\\") || filename.startsWith("//")) {
		return true;
	}
	
	return false;
}

/**
 * Checks for invalid characters in filename
 * @param {string} filename - The filename to check
 * @returns {boolean} True if invalid characters are found
 */
function hasInvalidCharacters(filename) {
	// Windows forbidden characters: < > : " | ? * and control characters (0-31)
	// Also check for some other potentially dangerous characters
	return /[<>:"|?*\x00-\x1f\x7f]/.test(filename);
}

/**
 * Sanitizes a filename by removing or replacing dangerous elements
 * @param {string} filename - The filename to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} The sanitized filename
 */
function sanitizeFilename(filename, options = {}) {
	let sanitized = filename;
	
	// Remove or replace path traversal sequences
	sanitized = sanitized.replace(/\.\.[\\\/]/g, "__/");
	sanitized = sanitized.replace(/[\\\/]\.\./g, "/__");
	sanitized = sanitized.replace(/\.\./g, "__");
	
	// Remove leading slashes and drive letters
	sanitized = sanitized.replace(/^[\\\/]+/, "");
	sanitized = sanitized.replace(/^[A-Za-z]:/, "");
	
	// Replace invalid characters
	sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f\x7f]/g, "_");
	
	// Replace path separators with underscores if not allowing subdirectories
	if (options.flattenPaths) {
		sanitized = sanitized.replace(/[\\\/]/g, "_");
	}
	
	// Ensure it's not empty
	if (!sanitized || sanitized.trim() === "") {
		sanitized = "unnamed_file";
	}
	
	// Limit length
	const maxLength = options.maxLength || 255;
	if (sanitized.length > maxLength) {
		const ext = sanitized.lastIndexOf(".");
		if (ext > 0 && ext > maxLength - 10) {
			// Preserve extension if possible
			const extension = sanitized.substring(ext);
			const nameLength = maxLength - extension.length;
			sanitized = sanitized.substring(0, nameLength) + extension;
		} else {
			sanitized = sanitized.substring(0, maxLength);
		}
	}
	
	return sanitized;
}

/**
 * Validates a filename according to security options
 * @param {string} filename - The filename to validate
 * @param {Object} options - Security options
 * @returns {Object} Validation result with isValid, issues, and sanitized name
 */
function validateFilename(filename, options = {}) {
	const securityOptions = Object.assign({}, DEFAULT_SECURITY_OPTIONS, options);
	const issues = [];
	let isValid = true;
	
	// Skip validation if set to 'none'
	if (securityOptions.filenameValidation === VALIDATION_NONE) {
		return {
			isValid: true,
			issues: [],
			sanitized: filename,
			original: filename
		};
	}
	
	// Check path traversal
	if (!securityOptions.allowPathTraversal && hasPathTraversal(filename)) {
		issues.push({
			type: "path_traversal",
			message: ERR_PATH_TRAVERSAL,
			severity: "high"
		});
		isValid = false;
	}
	
	// Check absolute paths
	if (!securityOptions.allowAbsolutePaths && isAbsolutePath(filename)) {
		issues.push({
			type: "absolute_path",
			message: ERR_ABSOLUTE_PATH,
			severity: "medium"
		});
		isValid = false;
	}
	
	// Check invalid characters
	if (hasInvalidCharacters(filename)) {
		issues.push({
			type: "invalid_characters",
			message: ERR_INVALID_CHARACTERS,
			severity: "medium"
		});
		isValid = false;
	}
	
	// Check filename length
	if (securityOptions.maxFilenameLength && filename.length > securityOptions.maxFilenameLength) {
		issues.push({
			type: "filename_too_long",
			message: ERR_FILENAME_TOO_LONG,
			severity: "low"
		});
		isValid = false;
	}
	
	// Custom validation
	if (securityOptions.customValidator) {
		try {
			const customResult = securityOptions.customValidator(filename);
			if (!customResult.isValid) {
				issues.push({
					type: "custom",
					message: customResult.message || "Custom validation failed",
					severity: customResult.severity || "medium"
				});
				isValid = false;
			}
		} catch (error) {
			issues.push({
				type: "custom_error",
				message: `Custom validator error: ${error.message}`,
				severity: "high"
			});
			isValid = false;
		}
	}
	
	// Generate sanitized version
	const sanitized = sanitizeFilename(filename, {
		maxLength: securityOptions.maxFilenameLength,
		flattenPaths: !securityOptions.allowPathTraversal && !securityOptions.allowAbsolutePaths
	});
	
	return {
		isValid,
		issues,
		sanitized,
		original: filename
	};
}

/**
 * Processes a filename according to security options, throwing errors or warnings as configured
 * @param {string} filename - The filename to process
 * @param {Object} options - Security options
 * @returns {string} The processed filename (original or sanitized)
 */
function processFilename(filename, options = {}) {
	const securityOptions = Object.assign({}, DEFAULT_SECURITY_OPTIONS, options);
	const validation = validateFilename(filename, securityOptions);
	
	// Handle validation results based on validation level
	if (!validation.isValid) {
		const highSeverityIssues = validation.issues.filter(issue => issue.severity === "high");
		
		if (securityOptions.filenameValidation === VALIDATION_STRICT) {
			// In strict mode, throw on ANY validation failure
			const error = new Error(validation.issues[0].message);
			error.code = "ERR_UNSAFE_FILENAME";
			error.filename = filename;
			error.issues = validation.issues;
			throw error;
		} else if (securityOptions.filenameValidation === VALIDATION_WARN) {
			// In warn mode, log warnings but continue
			if (typeof console !== "undefined" && console.warn) {
				validation.issues.forEach(issue => {
					console.warn(`zip.js security warning: ${issue.message} in filename "${filename}"`);
				});
			}
		}
		
		// Call custom callback if provided
		if (securityOptions.onUnsafeFilename) {
			try {
				securityOptions.onUnsafeFilename(filename, validation);
			} catch (error) {
				// Don't let callback errors break the main flow
				if (typeof console !== "undefined" && console.error) {
					console.error("Error in onUnsafeFilename callback:", error);
				}
			}
		}
	}
	
	// Return original filename unless we need to sanitize
	return validation.original;
}

/**
 * Creates a safe extraction path by validating and potentially sanitizing the filename
 * @param {string} filename - The filename from the zip entry
 * @param {string} basePath - The base extraction directory
 * @param {Object} options - Security options
 * @returns {Object} Object with safePath and fullPath properties
 */
function createSafeExtractionPath(filename, basePath, options = {}) {
	const securityOptions = Object.assign({}, DEFAULT_SECURITY_OPTIONS, options);
	const validation = validateFilename(filename, securityOptions);
	
	// Use sanitized filename for path construction
	const safeFilename = securityOptions.filenameValidation === VALIDATION_NONE ? 
		validation.original : validation.sanitized;
	
	// Construct the full path
	let fullPath;
	try {
		// Use path.join equivalent that works in browsers
		fullPath = joinPaths(basePath, safeFilename);
		
		// Additional safety check: ensure the resolved path is within basePath
		if (typeof require !== "undefined") {
			// Node.js environment
			const path = require("path");
			const resolvedPath = path.resolve(fullPath);
			const resolvedBase = path.resolve(basePath);
			
			if (!resolvedPath.startsWith(resolvedBase + path.sep) && resolvedPath !== resolvedBase) {
				throw new Error("Resolved path escapes base directory");
			}
		}
	} catch (error) {
		// Fallback to sanitized name only
		fullPath = joinPaths(basePath, `sanitized_${Date.now()}_${validation.sanitized}`);
	}
	
	return {
		safePath: safeFilename,
		fullPath: fullPath,
		wasModified: safeFilename !== validation.original,
		issues: validation.issues
	};
}

/**
 * Simple path joining that works in both Node.js and browsers
 * @param {...string} parts - Path parts to join
 * @returns {string} Joined path
 */
function joinPaths(...parts) {
	return parts
		.filter(part => part && part.length > 0)
		.map((part, index) => {
			// Remove leading slashes from all parts except the first
			if (index > 0) {
				part = part.replace(/^[\\\/]+/, "");
			}
			// Remove trailing slashes from all parts except the last
			if (index < parts.length - 1) {
				part = part.replace(/[\\\/]+$/, "");
			}
			return part;
		})
		.join("/");
}

export {
	validateFilename,
	sanitizeFilename,
	processFilename,
	createSafeExtractionPath,
	hasPathTraversal,
	isAbsolutePath,
	hasInvalidCharacters,
	joinPaths,
	VALIDATION_STRICT,
	VALIDATION_WARN,
	VALIDATION_NONE,
	DEFAULT_SECURITY_OPTIONS,
	ERR_UNSAFE_FILENAME,
	ERR_ABSOLUTE_PATH,
	ERR_PATH_TRAVERSAL,
	ERR_INVALID_CHARACTERS,
	ERR_FILENAME_TOO_LONG
};