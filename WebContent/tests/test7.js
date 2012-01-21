var zipFs = new zip.fs.FS();

function onerror(message) {
	console.error(message);
}

function logText(text) {
	console.log(text);
	console.log("--------------");
}

zip.workerScriptsPath = "../";
zipFs.importZip(new zip.HttpReader("lorem.zip"), function() {
	var firstEntry = zipFs.root.children[0];
	firstEntry.file.getData(new zip.TextWriter(), function(data) {
		logText(data);
	});
}, null, onerror);
