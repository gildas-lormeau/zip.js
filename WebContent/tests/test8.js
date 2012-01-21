var FILENAME = "lorem.txt";

var zipFs = new zip.fs.FS();

function onerror(message) {
	console.error(message);
}

function zipText(callback) {
	zipFs.root.addChild(new zip.fs.FileHTTP(FILENAME, "lorem.txt"));
	zipFs.exportZip(new zip.BlobWriter(), callback, null, onerror);
}

function unzipBlob(blob, callback) {
	zipFs.importZip(new zip.BlobReader(blob), function() {
		var firstEntry = zipFs.root.children[0];
		firstEntry.file.getData(new zip.TextWriter(), callback);
	}, null, onerror);
}

function logText(text) {
	console.log(text);
	console.log("--------------");
}

zip.workerScriptsPath = "../";
zipText(function(zippedBlob) {
	unzipBlob(zippedBlob, function(unzippedText) {
		logText(unzippedText);
	});
});
