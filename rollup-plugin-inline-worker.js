import { rollup } from "rollup";
import { deflateRawSync } from "node:zlib";
import { Buffer } from "node:buffer";
import { inflateRaw } from "./lib/core/util/inflate.js";

const SPECIFIER_PREFIX = "inline-worker:";
const RESOLVED_SPECIFIER_PREFIX = "\0" + SPECIFIER_PREFIX;

export { inlineWorker, deflatePayload };

function inlineWorker({ intro, createPlugins, deflate = true }) {
	return {
		name: "inline-worker",
		async resolveId(id, importer) {
			if (id.startsWith(SPECIFIER_PREFIX)) {
				const resolved = await this.resolve(id.slice(SPECIFIER_PREFIX.length), importer);
				if (!resolved) {
					this.error("cannot resolve " + JSON.stringify(id) + " from " + JSON.stringify(importer));
				}
				return RESOLVED_SPECIFIER_PREFIX + resolved.id;
			}
		},
		async load(id) {
			if (id.startsWith(RESOLVED_SPECIFIER_PREFIX)) {
				const input = id.slice(RESOLVED_SPECIFIER_PREFIX.length);
				const bundle = await rollup({ input });
				try {
					const { output } = await bundle.generate({
						format: "umd",
						intro,
						plugins: createPlugins ? createPlugins() : []
					});
					const [chunk] = output;
					for (const file of bundle.watchFiles) {
						this.addWatchFile(file);
					}
					return "export default " + JSON.stringify(deflate ? deflatePayload(chunk.code) : chunk.code) + ";";
				} finally {
					await bundle.close();
				}
			}
		}
	};
}

function deflatePayload(data) {
	const deflated = deflateRawSync(data, { level: 9 });
	const restored = Buffer.from(inflateRaw(new Uint8Array(deflated)));
	if (Buffer.compare(restored, Buffer.from(data)) != 0) {
		throw new Error("deflated payload round-trip failed");
	}
	return deflated.toString("base64");
}
