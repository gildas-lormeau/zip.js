var TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
var FILENAME = "lorem.txt";
var arrayBuffer;

function ArrayBufferReader(arrayBuffer) {
	var that = this;

	function init(callback, onerror) {
		this.size = arrayBuffer.length;
		callback();
	}

	function readUint8Array(index, length, callback, onerror) {
		return arrayBuffer.slice(index, index + length);
	}

	that.size = 0;
	that.init = init;
	that.readUint8Array = readUint8Array;
}
ArrayBufferReader.prototype = new zip.Reader();
ArrayBufferReader.prototype.constructor = ArrayBufferReader;

function ArrayBufferWriter() {
	var array, that = this;

	function init(callback, onerror) {
		array = new Uint8Array();
		callback();
	}

	function writeUint8Array(arr, callback, onerror) {
		array.set(array.length, arr);
		callback();
	}

	function getData(callback) {
		callback(array.arrayBuffer);
	}

	that.init = init;
	that.writeUint8Array = writeUint8Array;
	that.getData = getData;
}
ArrayBufferWriter.prototype = new zip.Writer();
ArrayBufferWriter.prototype.constructor = ArrayBufferWriter;

function onerror(message) {
	console.error(message);
}

function zipArrayBuffer(arrayBuffer) {
	zip.createWriter(new ArrayBufferWriter(), function(zipWriter) {
		zipWriter.add(FILENAME, new ArrayBufferReader(arrayBuffer), function() {
			zipWriter.close(callback);
		});
	}, onerror);
}

function unzipArrayBuffer(arrayBuffer, callback) {
	zip.createReader(new ArrayBufferReader(arrayBuffer), function(zipReader) {
		zipReader.getEntries(function(entries) {
			entries[0].getData(new ArrayBufferReader(zip.getMimeType(entries[0].filename)), function(data) {
				zipReader.close();
				callback(data);
			});
		});
	}, onerror);
}

function logBlobText(blob) {
	var reader = new FileReader();
	reader.onload = function(e) {
		console.log(e.target.result);
		console.log("--------------");
	};
	reader.readAsText(blob);
}

zip.workerScriptsPath = "../";
arrayBuffer = [];
logArrayBufferText(arrayBuffer);
zipArrayBuffer(arrayBuffer, function(zippedArrayBuffer) {
	unzipArrayBuffer(zippedArrayBuffer, function(unzippedArrayBuffer) {
		logArrayBufferText(unzippedArrayBuffer);
	});
});
