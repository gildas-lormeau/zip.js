var TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";

function onerror(message) {
	console.error(message);
}

function zipBlobs(blobs, callback) {
	zip.createWriter(new zip.BlobWriter("application/zip"), function(zipWriter) {
		var index = 0;

		function next() {
			if (index < blobs.length)
				zipWriter.add(blobs[index].name, new zip.BlobReader(blobs[index].blob), function() {
					index++;
					next();
				});
			else
				zipWriter.close(callback);
		}

		next();
	}, onerror);
}

function unzipBlob(blob) {
	zip.createReader(new zip.BlobReader(blob), function(zipReader) {
		zipReader.getEntries(function(entries) {
			var i;
			for (i = 0; i < entries.length; i++)
				entries[i].getData(new zip.TextWriter(), function(text) {
					logText(text);
				});
		});
	}, onerror);
}

function getBlob() {
	return new Blob([ TEXT_CONTENT ], {
		type : "text/plain"
	});
}

function logText(text) {
	console.log(text);
	console.log("--------------");
}

zip.workerScriptsPath = "../";

var blobs = [ {
	name : "lorem1.txt",
	blob : getBlob()
}, {
	name : "lorem2.txt",
	blob : getBlob()
} ];

zipBlobs(blobs, function(zippedBlob) {
	unzipBlob(zippedBlob);
});
