import * as zip from "../zip-lib.js";

export { test };

const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

async function test() {
	if (typeof zip.VERSION != "string" || !VERSION_PATTERN.test(zip.VERSION)) {
		throw new Error("unexpected VERSION value " + zip.VERSION);
	}
}
