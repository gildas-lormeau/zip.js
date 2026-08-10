const corpusDirectory = new URL("./corpus/", import.meta.url).pathname;
const inputDirectory = corpusDirectory + ".input";
const FIXED_TIME = new Date(2023, 4, 15, 10, 20, 30);
const WORDS = ["central", "directory", "record", "deflate", "stored", "entry", "archive", "stream", "payload", "header"];

const TOOLS = [
	{ tool: "infozip", variant: "default", command: file => ["zip", "-r", "-q", file, "."] },
	{ tool: "infozip", variant: "store", command: file => ["zip", "-r", "-q", "-0", file, "."] },
	{ tool: "infozip", variant: "best", command: file => ["zip", "-r", "-q", "-9", file, "."] },
	{ tool: "infozip", variant: "no-extra", command: file => ["zip", "-r", "-q", "-X", file, "."] },
	{ tool: "infozip", variant: "symlinks", command: file => ["zip", "-r", "-q", "-y", file, "."] },
	{ tool: "infozip", variant: "zipcrypto", command: file => ["zip", "-r", "-q", "-P", "correct horse", file, "."] },
	{ tool: "infozip", variant: "comment", command: file => ["sh", "-c", `printf 'archive comment from infozip' | zip -r -q -z ${JSON.stringify(file)} .`] },
	{ tool: "ditto", variant: "default", command: file => ["ditto", "-c", "-k", "--norsrc", ".", file] },
	{ tool: "7zz", variant: "default", command: file => ["7zz", "a", "-tzip", "-bso0", file, "."] },
	{ tool: "7zz", variant: "store", command: file => ["7zz", "a", "-tzip", "-mx=0", "-bso0", file, "."] },
	{ tool: "7zz", variant: "best", command: file => ["7zz", "a", "-tzip", "-mx=9", "-bso0", file, "."] },
	{ tool: "7zz", variant: "aes", command: file => ["7zz", "a", "-tzip", "-pcorrect horse", "-mem=AES256", "-bso0", file, "."] },
	{ tool: "7zz", variant: "zipcrypto", command: file => ["7zz", "a", "-tzip", "-pcorrect horse", "-mem=ZipCrypto", "-bso0", file, "."] },
	{ tool: "jar", variant: "default", command: file => ["jar", "cfM", file, "-C", ".", "."] },
	{ tool: "jar", variant: "store", command: file => ["jar", "cfM0", file, "-C", ".", "."] },
	{ tool: "jar", variant: "manifest", command: file => ["jar", "cf", file, "-C", ".", "."] },
	{ tool: "python", variant: "default", command: file => ["python3", "-c", pythonScript(file, "zipfile.ZIP_DEFLATED")] },
	{ tool: "python", variant: "store", command: file => ["python3", "-c", pythonScript(file, "zipfile.ZIP_STORED")] },
	{ tool: "python", variant: "bzip2", command: file => ["python3", "-c", pythonScript(file, "zipfile.ZIP_BZIP2")] },
	{ tool: "python", variant: "lzma", command: file => ["python3", "-c", pythonScript(file, "zipfile.ZIP_LZMA")] },
	{
		tool: "python", variant: "comments",
		command: file => ["python3", "-c", `import zipfile\nzf = zipfile.ZipFile(${JSON.stringify(file)}, "w", zipfile.ZIP_DEFLATED)\nzf.comment = b"archive comment from python"\nzf.write("readme.txt")\ninfo = zf.getinfo("readme.txt")\ninfo.comment = b"entry comment from python"\nzf.write("data.bin")\nzf.close()`]
	},
	{ tool: "python", variant: "empty", command: file => ["python3", "-c", `import zipfile\nzipfile.ZipFile(${JSON.stringify(file)}, "w").close()`] }
];

function pythonScript(file, method) {
	return `import zipfile, os\nzf = zipfile.ZipFile(${JSON.stringify(file)}, "w", ${method})\nfor root, dirs, files in os.walk("."):\n\tfor name in sorted(dirs) + sorted(files):\n\t\tzf.write(os.path.join(root, name))\nzf.close()`;
}

const ODD_TIME = new Date(2023, 4, 15, 10, 20, 31);

await Deno.remove(inputDirectory, { recursive: true }).catch(() => void 0);
await Deno.mkdir(inputDirectory, { recursive: true });
await writeInputFile("readme.txt", pseudoText(1));
await writeInputFile("data.bin", pseudoBinary(2, 4096));
await writeInputFile("empty.txt", new Uint8Array(0));
await writeInputFile("with space.txt", pseudoText(4));
await writeInputFile("naïve.txt", pseudoText(5));
await writeInputFile("odd.txt", pseudoText(6), ODD_TIME);
await writeInputFile("script.sh", new TextEncoder().encode("#!/bin/sh\necho fidelity\n"));
await Deno.chmod(`${inputDirectory}/script.sh`, 0o755);
await Deno.mkdir(`${inputDirectory}/sub`, { recursive: true });
await writeInputFile("sub/nested.txt", pseudoText(3));
await Deno.symlink("readme.txt", `${inputDirectory}/link.txt`);
await Deno.utime(`${inputDirectory}/sub`, FIXED_TIME, FIXED_TIME);

const manifest = [];
for (const { tool, variant, command } of TOOLS) {
	const file = `${corpusDirectory}${tool}-${variant}.zip`;
	try {
		await Deno.remove(file);
	} catch {
		void 0;
	}
	const commandArguments = command(file);
	const process = new Deno.Command(commandArguments[0], {
		args: commandArguments.slice(1),
		cwd: inputDirectory,
		stdout: "null",
		stderr: "piped"
	});
	const { success, stderr } = await process.output();
	if (success) {
		manifest.push({ file: `${tool}-${variant}.zip`, tool, variant, command: commandArguments.join(" ") });
		console.log(`generated ${tool}-${variant}.zip`);
	} else {
		console.error(`FAILED ${tool}-${variant}: ${new TextDecoder().decode(stderr)}`);
	}
}
await Deno.writeTextFile(`${corpusDirectory}corpus.json`, JSON.stringify(manifest, null, "\t") + "\n");
console.log(`\n${manifest.length} archives in ${corpusDirectory}`);

async function writeInputFile(name, data, time = FIXED_TIME) {
	const path = `${inputDirectory}/${name}`;
	await Deno.writeFile(path, data);
	await Deno.utime(path, time, time);
}

function pseudoText(seed) {
	const random = mulberry32(seed);
	const parts = [];
	for (let indexWord = 0; indexWord < 300; indexWord++) {
		parts.push(WORDS[Math.floor(random() * WORDS.length)]);
	}
	return new TextEncoder().encode(parts.join(" ") + "\n");
}

function pseudoBinary(seed, length) {
	const random = mulberry32(seed);
	const data = new Uint8Array(length);
	for (let indexByte = 0; indexByte < length; indexByte++) {
		data[indexByte] = Math.floor(random() * 256);
	}
	return data;
}

function mulberry32(seed) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}
