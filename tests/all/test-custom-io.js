import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";

class BinaryStringReader extends zip.Reader {

	constructor(binaryString) {
		super();
		this.binaryString = binaryString;
	}

	init() {
		super.init();
		this.size = this.binaryString.length;
	}

	readUint8Array(offset, length) {
		const result = new Uint8Array(length);
		for (let indexCharacter = 0; indexCharacter < length; indexCharacter++) {
			result[indexCharacter] = this.binaryString.charCodeAt(indexCharacter + offset) & 0xFF;
		}
		return result;
	}
}

class BinaryStringWriter extends zip.Writer {

	constructor() {
		super();
		this.binaryString = "";
	}

	writeUint8Array(array) {
		super.writeUint8Array(array);
		for (let indexCharacter = 0; indexCharacter < array.length; indexCharacter++) {
			this.binaryString += String.fromCharCode(array[indexCharacter]);
		}
	}

	getData() {
		return this.binaryString;
	}
}

export { test };

async function test() {
	const binaryStringWriter = new BinaryStringWriter();
	const zipWriter = new zip.ZipWriter(binaryStringWriter);
	await zipWriter.add(FILENAME, new BinaryStringReader(TEXT_CONTENT));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new BinaryStringReader(binaryStringWriter.getData()));
	const entries = await zipReader.getEntries();
	const data = await entries[0].getData(new BinaryStringWriter());
	await zipReader.close();
	zip.terminateWorkers();
	return TEXT_CONTENT == data;
}