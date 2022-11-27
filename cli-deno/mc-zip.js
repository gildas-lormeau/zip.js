#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net

/* global Deno, URL, TextEncoderStream */

import { parse as parseArgs } from "https://deno.land/std@0.147.0/flags/mod.ts";
import { normalize as normalizePath, resolve as resolvePath, extname } from "https://deno.land/std@0.147.0/path/mod.ts";
import { configure, ZipWriter, terminateWorkers, HttpReader } from "../index.js";

const args = parseArgs(Deno.args);
const stdout = getTextWriter(Deno.stdout);
main();

async function main() {
	const zipfile = args._.shift();
	const list = Array.from(args._);
	if (!zipfile || !list.length) {
		await displayUsage();
	} else {
		await runCommand(zipfile, list, getOptions());
	}
}

async function displayUsage() {
	await stdout.write("Copyright (c) 2022 Gildas Lormeau. All rights reserved.\n");
	await stdout.write("mc-zip 1.0. Usage:\n");
	await stdout.write("mc-zip [options] zipfile list\n");
	await stdout.write("  The default action is to create or overwrite zipfile entries from list of file names and URLs. Options:\n");
	await stdout.write("  --include-directories         include directories in the zip file  (default: true)\n");
	await stdout.write("  --include-sub-directories     include sub-directories in the zip file (default: true)\n");
	await stdout.write("  --max-workers                 number of workers (default: number of logical cores)\n");
	await stdout.write("  --buffered-write              compress entries in parallel with workers (default: true)\n");
	await stdout.write("  --password                    password (default: empty string)\n");
	await stdout.write("  --encryption-strength         encryption strength when using AES between 1 and 3 (default: 3)\n");
	await stdout.write("  --zip-crypto                  use ZipCrypto instead of AES (default: false)\n");
	await stdout.write("  --data-descriptor             add data descriptors (default: true)\n");
	await stdout.write("  --data-descriptor-signature   add data descriptor signatures (default: false)\n");
	await stdout.write("  --keep-order                  keep entries order (default: true)\n");
	await stdout.write("  --zip64                       use Zip64 format (default: false)\n");
	await stdout.write("  --prevent-parent-directories  remove occurences of \"../\" in filenames (default: true)\n");
	await stdout.write("\n");
	Deno.exit(-1);
}

function getOptions() {
	const options = {
		bufferedWrite: true,
		encryptionStrength: 3,
		dataDescriptor: true,
		keepOrder: true,
		includeDirectories: true,
		includeSubDirectories: true,
		preventParentDirectories: true
	};
	for (const option of Object.getOwnPropertyNames(args)) {
		if (option != "_") {
			options[toCamelCase(option)] = args[option];
		}
	}
	return options;
}

async function runCommand(zipfile, list, options) {
	list = await Promise.all(list.map(file => getFileInfo(file, options)));
	if (options.includeDirectories) {
		list = await Promise.all(list.map(file => addDirectories(file, options)));
	}
	list = list.flat();
	zipfile = await Deno.open(zipfile, { create: true, write: true });
	configure(options);
	const zipWriter = new ZipWriter(zipfile, options);
	try {
		await Promise.all(list.map(file => addFile(zipWriter, file)));
		await zipWriter.close();
	} finally {
		terminateWorkers();
	}
}

async function addFile(zipWriter, file) {
	const options = {
		onstart: () => stdout.write("  adding: " + file.name + "\n")
	};
	try {
		const reader = await getReader(file);
		if (reader) {
			await zipWriter.add(file.name, reader, options);
		}
	} catch (error) {
		await stdout.write("  error: " + error.message + ", file: " + file.url + "\n");
	}
}

async function getFileInfo(file, options) {
	let name, isFile, isDirectory, resolvedName, size;
	const remote = isRemote(file);
	if (remote) {
		const url = new URL(file, import.meta.url);
		name = url.hostname + (url.pathname == "/" ? "/index.html" : url.pathname);
		if (!extname(name)) {
			name += ".html";
		}
	} else {
		name = file;
		resolvedName = resolvePath(name);
	}
	name = normalizePath(replaceSlashes(name));
	if (resolvedName) {
		if (options.preventParentDirectories) {
			name = cleanFilename(name);
		}
		const stat = await Deno.stat(resolvedName);
		isFile = stat.isFile;
		isDirectory = stat.isDirectory;
		size = stat.size;
	}
	return {
		url: file, name, remote, isFile, size, isDirectory, resolvedName
	};
}

async function addDirectories(file, options) {
	if (file.isDirectory) {
		const result = [];
		for await (const entry of Deno.readDir(resolvePath(file.url))) {
			const fileInfo = await getFileInfo(file.url + "/" + entry.name, options);
			if (entry.isFile) {
				result.push(fileInfo);
			} else if (entry.isDirectory && options.includeSubDirectories) {
				result.push(await addDirectories(fileInfo, options));
			}
		}
		return result.flat();
	} else {
		return file;
	}
}

async function getReader(file) {
	if (file.remote) {
		return new HttpReader(file.url);
	} else if (file.isFile) {
		const { size } = file;
		const { readable } = await Deno.open(resolvePath(file.url), { read: true });
		return {
			readable,
			size
		};
	}
}

function isRemote(path) {
	return path.startsWith("http:") || path.startsWith("https:");
}

function getTextWriter(stdout) {
	const textEncoderStream = new TextEncoderStream();
	textEncoderStream.readable.pipeTo(stdout.writable);
	return textEncoderStream.writable.getWriter();
}

function replaceSlashes(url) {
	url = url.replace(/\\/g, "/");
	const match = url.match(/^(?:\/)?(.*?)(?:\/)?$/);
	if (match) {
		return match[1];
	} else {
		return url;
	}
}

function cleanFilename(name) {
	const result = replaceSlashes(("/" + name + "/").replace(/(\/|\\)+(\.+)(\/|\\)+/g, "/"));
	if (result == name) {
		return result;
	} else {
		return cleanFilename(result);
	}
}

function toCamelCase(kebabCase) {
	return kebabCase
		.split("-")
		.map((word, indexWord) => indexWord ? word.charAt(0).toUpperCase() + word.substring(1) : word)
		.join("");
}