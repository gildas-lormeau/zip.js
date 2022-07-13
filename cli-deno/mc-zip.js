#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net

/* global Deno, fetch, URL, TextEncoderStream */

import { parse as parseArgs } from "https://deno.land/std@0.147.0/flags/mod.ts";
import { fromFileUrl, normalize as normalizePath, resolve as resolvePath, extname } from "https://deno.land/std@0.147.0/path/mod.ts";
import { configure, ZipWriter, ReadableStreamReader, WritableStreamWriter, terminateWorkers } from "../index.js";

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
	await stdout.write("  --max-workers                 number of workers (default: number of logical cores)\n");
	await stdout.write("  --buffered-write              compress entries in parallel with workers (default: true)\n");
	await stdout.write("  --password                    password (default: empty string)\n");
	await stdout.write("  --encryption-strength         encryption strength when using AES between 1 and 3 (default: 3)\n");
	await stdout.write("  --zip-crypto                  use ZipCrypto instead of AES (default: false)\n");
	await stdout.write("  --data-descriptor             add data descriptors (default: true)\n");
	await stdout.write("  --data-descriptor-signature   add data descriptor signatures (default: false)\n");
	await stdout.write("  --keep-order                  keep entries order (default: true)\n");
	await stdout.write("  --zip64                       use Zip64 format (default: false)\n");
	await stdout.write("\n");
	Deno.exit(-1);
}

function getOptions() {
	const options = {
		bufferedWrite: true,
		encryptionStrength: 3,
		dataDescriptor: true,
		keepOrder: true
	};
	for (const option of Object.getOwnPropertyNames(args)) {
		if (option != "_") {
			options[toCamelCase(option)] = args[option];
		}
	}
	return options;
}

async function runCommand(zipfile, list, options) {
	list = await Promise.all(list.map(getFileInfo));
	list = await Promise.all(list.map(file => addDirectories(file)));
	list = list.flat();
	zipfile = await Deno.open(zipfile, { create: true, write: true });
	configure(options);
	const zipWriter = new ZipWriter(new WritableStreamWriter(zipfile.writable), options);
	try {
		await Promise.all(list.map(file => addFile(zipWriter, file)));
		await zipWriter.close();
	} finally {
		terminateWorkers();
	}
}

async function addFile(zipWriter, file) {
	try {
		const readable = await getReadable(file);
		if (readable) {
			await zipWriter.add(file.name, new ReadableStreamReader(readable), {
				onstart: () => stdout.write("  adding: " + file.name + "\n")
			});
		}
	} catch (error) {
		await stdout.write("  error: " + error.message + ", file: " + file.url + "\n");
	}
}

async function getFileInfo(file) {
	let name, isFile, isDirectory, resolvedName;
	const remote = isRemote(file);
	if (remote) {
		const url = new URL(file, import.meta.url);
		name = url.hostname + (url.pathname == "/" ? "/index.html" : url.pathname);
		if (!extname(name)) {
			name += ".html";
		}
	} else if (file.startsWith("file:")) {
		name = fromFileUrl(file);
	} else {
		name = file;
		resolvedName = resolvePath(name);
	}
	name = normalizePath(trimSlashes(name));
	if (resolvedName) {
		const stat = await Deno.stat(resolvedName);
		isFile = stat.isFile;
		isDirectory = stat.isDirectory;
	}
	return {
		url: file, name, remote, isFile, isDirectory, resolvedName
	};
}

async function addDirectories(file, recursive) {
	if (file.isDirectory) {
		const result = [];
		for await (const entry of Deno.readDir(resolvePath(file.url))) {
			const fileInfo = await getFileInfo(file.url + "/" + entry.name);
			if (entry.isFile) {
				result.push(fileInfo);
			} else if (entry.isDirectory) {
				result.push(await addDirectories(fileInfo, recursive));
			}
		}
		return result.flat();
	} else {
		return file;
	}
}

async function getReadable(file) {
	return file.remote ?
		(await fetch(file.url)).body :
		file.isFile ?
			(await Deno.open(resolvePath(file.url), { read: true })).readable :
			null;
}

function isRemote(path) {
	return path.startsWith("http:") || path.startsWith("https:");
}

function getTextWriter(stdout) {
	const textEncoderStream = new TextEncoderStream();
	textEncoderStream.readable.pipeTo(stdout.writable);
	return textEncoderStream.writable.getWriter();
}

function trimSlashes(url) {
	const match = url.match(/^(?:\/|\\)?(.*?)(?:\/|\\)?$/);
	if (match) {
		return match[1];
	} else {
		return url;
	}
}

function toCamelCase(kebabCase) {
	return kebabCase
		.split("-")
		.map((word, indexWord) => indexWord ? word.charAt(0).toUpperCase() + word.substring(1) : word)
		.join("");
}