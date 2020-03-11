let zipFS = new zip.fs.FS();

function addFiles() {
  let rootDir = zipFS.root.addDirectory('root');
  for (let i = 0; i < 3000; i++) {
    rootDir.addBlob(`file${i}`, new Blob(['']));
  }
}

function exportFile() {
  try {
    zipFS.exportBlob( function () {
      document.getElementById('result').textContent = 'Succeeded';
    }, null, function (err) {
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