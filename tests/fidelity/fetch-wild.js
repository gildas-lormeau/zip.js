const corpusDirectory = new URL("./corpus/", import.meta.url).pathname;
const wildDirectory = `${corpusDirectory}wild/`;
const cacheDirectory = `${corpusDirectory}.cache/`;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const FETCH_TIMEOUT = 45000;
const LETTERS = "abcdefghijklmnopqrstuvwxyz";

const countPerSource = Number(Deno.args.find(argument => argument.startsWith("--count="))?.slice(8) || 4);
const seedArgument = Deno.args.find(argument => argument.startsWith("--seed="))?.slice(7);
const seed = seedArgument ? Number(seedArgument) : Math.floor(Math.random() * 0xffffffff);
const random = mulberry32(seed);
console.log(`seed: ${seed}`);

const SOURCES = [
	{ name: "gutenberg-epub", candidates: gutenbergCandidates },
	{ name: "maven-jar", candidates: mavenCandidates },
	{ name: "pypi-wheel", candidates: pypiCandidates },
	{ name: "nuget-nupkg", candidates: nugetCandidates },
	{ name: "ia-office", candidates: officeCandidates },
	{ name: "archive-zip", candidates: archiveCandidates },
	{ name: "github-release", candidates: githubCandidates }
];
const sourceFilter = Deno.args.find(argument => argument.startsWith("--sources="))?.slice(10).split(",");
const activeSources = sourceFilter ? SOURCES.filter(source => sourceFilter.includes(source.name)) : SOURCES;

await Deno.mkdir(wildDirectory, { recursive: true });
await Deno.mkdir(cacheDirectory, { recursive: true });
const manifestPath = `${wildDirectory}manifest.json`;
const manifest = await Deno.readTextFile(manifestPath).then(JSON.parse).catch(() => []);
const knownUrls = new Set(manifest.map(item => item.url));

for (const source of activeSources) {
	let fetched = 0;
	try {
		const candidates = await source.candidates();
		for (const candidate of candidates) {
			if (fetched >= countPerSource) {
				break;
			}
			if (knownUrls.has(candidate.url)) {
				continue;
			}
			const data = await download(candidate.url);
			if (!data) {
				continue;
			}
			const fileName = `${source.name}-${manifest.length}-${sanitize(candidate.name)}`;
			await Deno.writeFile(wildDirectory + fileName, data);
			const digest = await sha256(data);
			manifest.push({ file: fileName, source: source.name, url: candidate.url, size: data.length, sha256: digest, seed });
			knownUrls.add(candidate.url);
			fetched++;
			console.log(`  ${fileName} (${data.length} bytes)`);
		}
	} catch (error) {
		console.error(`${source.name} failed: ${error.message}`);
	}
	console.log(`${source.name}: ${fetched} files`);
}
await Deno.writeTextFile(manifestPath, JSON.stringify(manifest, null, "\t") + "\n");
console.log(`\n${manifest.length} files in ${wildDirectory}`);

async function gutenbergCandidates() {
	const candidates = [];
	for (let indexCandidate = 0; indexCandidate < countPerSource * 4; indexCandidate++) {
		const bookId = 1 + Math.floor(random() * 70000);
		candidates.push({ url: `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.epub`, name: `pg${bookId}.epub` });
	}
	return candidates;
}

async function mavenCandidates() {
	const query = LETTERS[Math.floor(random() * 26)] + LETTERS[Math.floor(random() * 26)];
	const response = await fetchJson(`https://search.maven.org/solrsearch/select?q=${query}&rows=50&wt=json`);
	const documents = shuffle(response.response.docs.filter(document => document.p == "jar"));
	return documents.map(document => {
		const path = `${document.g.replaceAll(".", "/")}/${document.a}/${document.latestVersion}`;
		const file = `${document.a}-${document.latestVersion}.jar`;
		return { url: `https://repo1.maven.org/maven2/${path}/${file}`, name: file };
	});
}

async function pypiCandidates() {
	const cachePath = `${cacheDirectory}pypi-simple.txt`;
	let index = await Deno.readTextFile(cachePath).catch(() => null);
	if (!index) {
		index = await (await timedFetch("https://pypi.org/simple/")).text();
		await Deno.writeTextFile(cachePath, index);
	}
	const names = [...index.matchAll(/href="\/simple\/([^/"]+)\//g)].map(match => match[1]);
	const candidates = [];
	for (let indexCandidate = 0; indexCandidate < countPerSource * 4; indexCandidate++) {
		const name = names[Math.floor(random() * names.length)];
		try {
			const metadata = await fetchJson(`https://pypi.org/pypi/${name}/json`);
			const wheel = Object.values(metadata.releases ?? {}).flat().reverse().find(file => file.packagetype == "bdist_wheel");
			if (wheel) {
				candidates.push({ url: wheel.url, name: wheel.filename });
			}
		} catch {
			continue;
		}
	}
	return candidates;
}

async function nugetCandidates() {
	const query = LETTERS[Math.floor(random() * 26)] + LETTERS[Math.floor(random() * 26)];
	const response = await fetchJson(`https://azuresearch-usnc.nuget.org/query?q=${query}&take=40`);
	return shuffle(response.data).map(packageData => {
		const id = packageData.id.toLowerCase();
		const version = packageData.version.toLowerCase();
		return {
			url: `https://api.nuget.org/v3-flatcontainer/${id}/${version}/${id}.${version}.nupkg`,
			name: `${id}.${version}.nupkg`
		};
	});
}

async function officeCandidates() {
	const page = 1 + Math.floor(random() * 100);
	const search = await fetchJson(`https://archive.org/advancedsearch.php?q=format%3A%28%22Microsoft%20Excel%22%20OR%20%22Word%20Document%22%29&fl%5B%5D=identifier&rows=10&page=${page}&output=json`);
	const candidates = [];
	for (const document of shuffle(search.response.docs)) {
		try {
			const metadata = await fetchJson(`https://archive.org/metadata/${document.identifier}`);
			const officeFiles = (metadata.files || []).filter(file =>
				/\.(xlsx|docx|pptx)$/i.test(file.name) && Number(file.size || 0) > 0 && Number(file.size || 0) < MAX_FILE_SIZE);
			if (officeFiles.length) {
				const file = officeFiles[Math.floor(random() * officeFiles.length)];
				candidates.push({
					url: `https://archive.org/download/${document.identifier}/${encodeURIComponent(file.name)}`,
					name: file.name.split("/").pop()
				});
			}
		} catch {
			continue;
		}
	}
	return candidates;
}

async function archiveCandidates() {
	const page = 1 + Math.floor(random() * 500);
	const search = await fetchJson(`https://archive.org/advancedsearch.php?q=format%3A%28%22ZIP%22%29&fl%5B%5D=identifier&rows=10&page=${page}&output=json`);
	const candidates = [];
	for (const document of shuffle(search.response.docs)) {
		try {
			const metadata = await fetchJson(`https://archive.org/metadata/${document.identifier}`);
			const zipFiles = (metadata.files || []).filter(file =>
				file.name.toLowerCase().endsWith(".zip") && Number(file.size || 0) > 0 && Number(file.size || 0) < MAX_FILE_SIZE);
			if (zipFiles.length) {
				const file = zipFiles[Math.floor(random() * zipFiles.length)];
				candidates.push({
					url: `https://archive.org/download/${document.identifier}/${encodeURIComponent(file.name)}`,
					name: file.name.split("/").pop()
				});
			}
		} catch {
			continue;
		}
	}
	return candidates;
}

async function githubCandidates() {
	const starsFloor = 100 + Math.floor(random() * 5000);
	const page = 1 + Math.floor(random() * 10);
	const repositories = await githubApi(`search/repositories?q=stars:${starsFloor}..${starsFloor * 3}&per_page=30&page=${page}`);
	const candidates = [];
	const zipballCandidates = [];
	for (const repository of shuffle(repositories.items || [])) {
		if (candidates.length >= countPerSource * 2) {
			break;
		}
		try {
			const releases = await githubApi(`repos/${repository.full_name}/releases?per_page=3`);
			for (const release of releases) {
				const assets = (release.assets || []).filter(asset =>
					asset.name.toLowerCase().endsWith(".zip") && asset.size > 0 && asset.size < MAX_FILE_SIZE);
				if (assets.length) {
					const asset = assets[Math.floor(random() * assets.length)];
					candidates.push({ url: asset.browser_download_url, name: asset.name });
					break;
				}
				if (release.zipball_url && zipballCandidates.length < 2) {
					zipballCandidates.push({ url: release.zipball_url, name: `${repository.name}-${release.tag_name}-zipball.zip` });
				}
			}
		} catch {
			continue;
		}
	}
	return candidates.concat(zipballCandidates);
}

async function githubApi(path) {
	const { success, stdout } = await new Deno.Command("gh", { args: ["api", path], stdout: "piped", stderr: "null" }).output();
	if (!success) {
		throw new Error(`gh api ${path} failed`);
	}
	return JSON.parse(new TextDecoder().decode(stdout));
}

async function download(url) {
	try {
		const response = await timedFetch(url);
		if (!response.ok) {
			return null;
		}
		const contentLength = Number(response.headers.get("content-length") || 0);
		if (contentLength > MAX_FILE_SIZE) {
			await response.body?.cancel();
			return null;
		}
		const data = new Uint8Array(await response.arrayBuffer());
		if (data.length < 22 || data.length > MAX_FILE_SIZE || data[0] != 0x50 || data[1] != 0x4b) {
			return null;
		}
		return data;
	} catch {
		return null;
	}
}

function timedFetch(url) {
	return fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT), redirect: "follow" });
}

async function fetchJson(url) {
	return (await timedFetch(url)).json();
}

async function sha256(data) {
	const hash = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hash)).map(value => value.toString(16).padStart(2, "0")).join("");
}

function sanitize(name) {
	return name.replaceAll(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

function shuffle(array) {
	const result = [...array];
	for (let indexItem = result.length - 1; indexItem > 0; indexItem--) {
		const swapIndex = Math.floor(random() * (indexItem + 1));
		[result[indexItem], result[swapIndex]] = [result[swapIndex], result[indexItem]];
	}
	return result;
}

function mulberry32(state) {
	return () => {
		state |= 0;
		state = (state + 0x6d2b79f5) | 0;
		let value = Math.imul(state ^ (state >>> 15), 1 | state);
		value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}
