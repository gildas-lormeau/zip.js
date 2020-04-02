// This tests https://github.com/gildas-lormeau/zip.js/issues/188, which has to do with zips with many files
var zipFS = new zip.fs.FS();
var testDepth = 35000; // without the 188 fix, 60000 should break on Chrome version <=80, Firefox version <=74, and Safari <=13.1
var numFiles = Math.ceil(testDepth / 3); // There are at least 3 function calls that are added to the stack for each file that is added (this is somehow different between browsers)

/**
 * This tests the depth used against the max call stack of the browser.
 * @param {Number} depthToTest
 */
function testMaxDepth(depthToTest) {
  var depth = 0;
  try {
    (function next() {
      ++depth;
      if (depth < depthToTest)
        return next();

      console.log('Would not break in this browser version');
    })();
  } catch (e) {
    console.log('Would still break in this browser version');
  }
}

function addFiles() {
  var rootDir = zipFS.root.addDirectory('root');
  for (var i = 0; i < numFiles; i++) { // test might hang here a little bit
    rootDir.addBlob(`file${i}`, new Blob(['']));
  }
  console.log('Added blobs');
}

function exportFile() {
  try {
    console.log('Exporting zip');
    let processed = 0;
    zipFS.exportBlob( function () {
      document.getElementById('result').textContent = 'Succeeded';
    }, function() {
      processed++; // after processing the first file, this is already successful because it's the reading part that currently recurses
      if (processed % 1000 === 0) {
        console.log(processed, numFiles);
      }
    }, function (err) {
      document.getElementById('result').textContent = err;
      throw err;
    });
  } catch (err) {
    document.getElementById('result').textContent = err;
    throw err;
  }
}

console.log('Testing depth: ', testDepth);
testMaxDepth(testDepth);
addFiles();
exportFile();