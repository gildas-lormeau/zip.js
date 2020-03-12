let zipFS = new zip.fs.FS();

function findMaxDepth() {
  var depth = 0;
  try {
    (function next() { ++depth; next(); })();
  } catch (e) {}
  return depth;
}

function addFiles() {
  var rootDir = zipFS.root.addDirectory('root');
  var maxDepth = findMaxDepth();
  console.log('Testing depth: ', maxDepth);
  for (var i = 0; i < maxDepth; i++) {
    rootDir.addBlob(`file${i}`, new Blob(['']));
  }
  console.log('Added blobs');
}

function exportFile() {
  try {
    console.log('Exporting zip');
    zipFS.exportBlob( function () {
      document.getElementById('result').textContent = 'Succeeded';
    }, function(current, total) {
      console.log(current, total);
    }, function (err) {
      document.getElementById('result').textContent = err;
      throw err;
    });
  } catch (err) {
    document.getElementById('result').textContent = err;
    throw err;
  }
}

addFiles();
exportFile();