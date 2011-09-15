/*
 * Copyright 2011 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 * 
 * decodeUTF8 and encodeUTF8 implementations found on phpjs.org
 */
(function(obj) {

	var WORKER_SCRIPTS_PATH = "";

	var BlobBuilder = obj.WebKitBlobBuilder || obj.MozBlobBuilder || obj.BlobBuilder;

	function blobSlice(blob, index, length) {
		if (blob.webkitSlice)
			return blob.webkitSlice(index, index + length);
		else if (blob.mozSlice)
			return blob.mozSlice(index, index + length);
		else
			return blob.slice(index, index + length);
	}

	function getDataHelper(size, bytes) {
		var dataBuffer, dataArray, dataView;
		dataBuffer = new ArrayBuffer(size);
		dataArray = new Uint8Array(dataBuffer);
		dataView = new DataView(dataBuffer);
		if (bytes)
			dataArray.set(bytes, 0);
		return {
			buffer : dataBuffer,
			array : dataArray,
			view : dataView
		};
	}

	// BlobReader

	function BlobReader(blob) {
		var that = this;

		function init(callback, onerror) {
			that.size = blob.size;
			callback();
		}

		function readUint8Array(index, length, callback, onerror) {
			var slice = blobSlice(blob, index, length), reader = new FileReader();
			reader.onload = function(e) {
				callback(new Uint8Array(e.target.result));
			};
			reader.onerror = onerror;
			reader.readAsArrayBuffer(slice);
		}

		function readBlob(index, length, callback, onerror) {
			callback(blobSlice(blob, index, length));
		}

		function getBlob() {
			return blob;
		}

		that.size = 0;
		that.init = init;
		that.readBlob = readBlob;
		that.readUint8Array = readUint8Array;
		that.getBlob = getBlob;
	}

	// HttpRangeReader

	function HttpRangeReader(url) {
		var that = this;

		function init(callback, onerror) {
			var request = new XMLHttpRequest();
			url = initUrl;
			request.addEventListener("load", function() {
				that.size = Number(request.getResponseHeader("Content-Length"));
				if (request.getResponseHeader("Accept-Ranges") == "bytes")
					callback();
				else
					onerror("HTTP Range not supported!");
			}, false);
			request.addEventListener("error", onerror, false);
			request.open("HEAD", url);
			request.send();
		}

		function readArrayBuffer(index, length, callback, onerror) {
			var request = new XMLHttpRequest();
			request.open("GET", url);
			request.responseType = "arraybuffer";
			request.setRequestHeader("Range", "bytes=" + index + "-" + (index + length - 1));
			request.addEventListener("load", function() {
				callback(request.response);
			}, false);
			request.addEventListener("error", onerror, false);
			request.send();
		}

		function readUint8Array(index, length, callback, onerror) {
			readArrayBuffer(index, length, function(arraybuffer) {
				callback(new Uint8Array(arraybuffer));
			}, onerror);
		}

		function readBlob(index, length, callback, onerror) {
			readArrayBuffer(index, length, function(arraybuffer) {
				var blobBuilder = new BlobBuilder();
				blobBuilder.append(arraybuffer);
				callback(blobBuilder.getBlob());
			}, onerror);
		}

		function getBlob() {
			throw "HttpRangeReader does not support getBlob method.";
		}

		that.size = 0;
		that.init = init;
		that.readBlob = readBlob;
		that.readUint8Array = readUint8Array;
	}

	// FileWriter

	function FileWriter(file) {
		var writer, that = this;

		function init(callback, onerror) {
			file.createWriter(function(fileWriter) {
				writer = fileWriter;
				callback();
			}, onerror);
		}

		function appendArrayBuffer(arrayBuffer, callback, onerror) {
			var blobBuilder = new BlobBuilder();
			blobBuilder.append(arrayBuffer);
			appendBlob(blobBuilder.getBlob(), callback, onerror);
		}

		function appendBlob(blob, callback, onerror) {
			writer.onwrite = function() {
				writer.onwrite = null;
				callback();
			};
			writer.onerror = onerror;
			writer.write(blob);
		}

		function getBlob() {
			return file;
		}

		function seek(offset, callback, onerror) {
			if (offset > writer.length) {
				writer.onwrite = function() {
					writer.onwrite = null;
					writer.seek(offset);
					callback();
				};
				writer.onerror = onerror;
				writer.truncate(offset + 1);
			} else {
				writer.seek(offset);
				callback();
			}
		}

		that.init = init;
		that.appendBlob = appendBlob;
		that.appendArrayBuffer = appendArrayBuffer;
		that.getBlob = getBlob;
		that.seek = seek;
	}

	// BlobWriter

	function BlobWriter() {
		var blobBuilder, that = this;

		function init(callback, onerror) {
			blobBuilder = new BlobBuilder();
			callback();
		}

		function appendArrayBuffer(arrayBuffer, callback, onerror) {
			blobBuilder.append(arrayBuffer);
			callback();
		}

		function appendBlob(blob, callback, onerror) {
			blobBuilder.append(blob);
			callback();
		}

		function getBlob() {
			return blobBuilder.getBlob();
		}

		// TODO
		function seek(offset, callback, onerror) {
			throw "BlobWriter does not support seek method.";
		}

		that.init = init;
		that.appendBlob = appendBlob;
		that.appendArrayBuffer = appendArrayBuffer;
		that.getBlob = getBlob;
		that.seek = seek;
	}

	// ZipReader

	function decodeASCII(str) {
		var i, out = "", charCode, extendedASCII = [ 'Ç', 'ü', 'é', 'â', 'ä', 'à', 'å', 'ç', 'ê', 'ë', 'è', 'ï', 'î', 'ì', 'Ä', 'Å', 'É', 'æ', 'Æ', 'ô', 'ö',
				'ò', 'û', 'ù', 'ÿ', 'Ö', 'Ü', 'ø', '£', 'Ø', '×', 'ƒ', 'á', 'í', 'ó', 'ú', 'ñ', 'Ñ', 'ª', 'º', '¿', '®', '¬', '½', '¼', '¡', '«', '»', '_',
				'_', '_', '¦', '¦', 'Á', 'Â', 'À', '©', '¦', '¦', '+', '+', '¢', '¥', '+', '+', '-', '-', '+', '-', '+', 'ã', 'Ã', '+', '+', '-', '-', '¦',
				'-', '+', '¤', 'ð', 'Ð', 'Ê', 'Ë', 'È', 'i', 'Í', 'Î', 'Ï', '+', '+', '_', '_', '¦', 'Ì', '_', 'Ó', 'ß', 'Ô', 'Ò', 'õ', 'Õ', 'µ', 'þ', 'Þ',
				'Ú', 'Û', 'Ù', 'ý', 'Ý', '¯', '´', '­', '±', '_', '¾', '¶', '§', '÷', '¸', '°', '¨', '·', '¹', '³', '²', '_', ' ' ];
		for (i = 0; i < str.length; i++) {
			charCode = str.charCodeAt(i) & 0xFF;
			if (charCode > 127)
				out += extendedASCII[charCode - 128];
			else
				out += String.fromCharCode(charCode);
		}
		return out;
	}

	function decodeUTF8(str_data) {
		var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;

		str_data += '';

		while (i < str_data.length) {
			c1 = str_data.charCodeAt(i);
			if (c1 < 128) {
				tmp_arr[ac++] = String.fromCharCode(c1);
				i++;
			} else if (c1 > 191 && c1 < 224) {
				c2 = str_data.charCodeAt(i + 1);
				tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = str_data.charCodeAt(i + 1);
				c3 = str_data.charCodeAt(i + 2);
				tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}

		return tmp_arr.join('');
	}

	function getString(bytes) {
		var i, str = "";
		for (i = 0; i < bytes.length; i++)
			str += String.fromCharCode(bytes[i]);
		return str;
	}

	function createZipReader(reader, callback, onerror) {
		reader.init(function() {
			callback(createZipReaderCore(reader, onerror));
		}, onerror);
	}

	function createZipReaderCore(reader, onerror) {
		var worker, CHUNK_SIZE = 512 * 1024;

		function terminate(callback, param) {
			if (worker)
				worker.terminate();
			worker = null;
			if (callback)
				callback(param);
		}

		function Entry() {
		}

		Entry.prototype.getData = function(writer, onend, onprogress) {
			var entry = this;
			reader.readUint8Array(entry.offset, 4, function(bytes) {
				if (getDataHelper(bytes.length, bytes).view.getUint32(0) == 0x504b0304) {
					reader.readBlob(entry.offset + 30 + entry.filenameLength + entry.extraLength, entry.compressedSize, function(data) {
						var chunkIndex = 0;

						function stepInflate() {
							var index = chunkIndex * CHUNK_SIZE, size = data.size;

							if (onprogress)
								onprogress(index, size);
							if (index < size) {
								worker.postMessage({
									append : true,
									data : blobSlice(data, index, Math.min(CHUNK_SIZE, size - index))
								});
								chunkIndex++;
							} else
								worker.postMessage({
									flush : true
								});
						}

						function inflate(callback) {
							function onmesssage(event) {
								var message = event.data;
								if (message.onappend) {
									writer.appendBlob(message.data, function() {
										stepInflate();
									});
								}
								if (message.onflush) {
									worker.terminate();
									worker = null;
									callback(writer.getBlob());
								}

								if (message.debug) {
									console.log("message", message.value);
								}
							}

							worker = new Worker(WORKER_SCRIPTS_PATH + "inflate.js");
							worker.addEventListener("message", onmesssage, false);
							stepInflate();
						}

						writer.init(function() {
							if (entry.compressionMethod === 0)
								onend(data);
							else
								inflate(onend);
						}, function() {
							terminate(onerror, "Error while writing uncompressed file.");
						});
					}, function() {
						terminate(onerror, "File format is not recognized.");
					});
				} else
					terminate(onerror, "File format is not recognized.");
			}, function() {
				terminate(onerror, "Error while reading zip file.");
			});
		};

		return {
			getEntries : function(callback) {

				if (reader.size < 22) {
					terminate(onerror, "File format is not recognized.");
					return;
				}
				reader.readUint8Array(reader.size - 22, 22, function(bytes) {
					var dataView = getDataHelper(bytes.length, bytes).view, datalength, fileslength;
					if (dataView.getUint32(0) != 0x504b0506) {
						terminate(onerror, "File format is not recognized.");
						return;
					}
					datalength = dataView.getUint32(16, true);
					fileslength = dataView.getUint16(8, true);
					reader.readUint8Array(datalength, reader.size - datalength, function(bytes) {
						var i, signature, index = 0, entries = [], entry, filename, data = getDataHelper(bytes.length, bytes);
						for (i = 0; i < fileslength; i++) {
							entry = new Entry();
							signature = data.view.getUint32(index);
							entry.versionNeeded = data.view.getUint16(index + 6, true);
							entry.bitFlag = data.view.getUint16(index + 8, true);
							entry.compressionMethod = data.view.getUint16(index + 10, true);
							entry.timeBlob = data.view.getUint32(index + 12, true);
							if ((entry.bitFlag & 0x01) === 0x01) {
								terminate(onerror, "File contains encrypted entry.");
								return;
							}
							if ((entry.bitFlag & 0x0008) === 0x0008) {
								terminate(onerror, "File is using bit 3 trailing data descriptor.");
								return;
							}
							entry.crc32 = data.view.getUint32(index + 16, true);
							entry.compressedSize = data.view.getUint32(index + 20, true);
							entry.uncompressedSize = data.view.getUint32(index + 24, true);

							if (entry.compressedSize === 0xFFFFFFFF || entry.uncompressedSize === 0xFFFFFFFF) {
								terminate(onerror, "File is using Zip64 (4gb+ file size).");
								return;
							}
							entry.filenameLength = data.view.getUint16(index + 28, true);
							entry.extraLength = data.view.getUint16(index + 30, true);
							entry.extra = getString(data.array.subarray(index + 32, index + 32 + entry.extraLength));
							entry.directory = data.view.getUint8(index + 37 + entry.extraLength) == 1;
							entry.offset = data.view.getUint32(index + 42 + entry.extraLength, true);
							filename = getString(data.array.subarray(index + 46 + entry.extraLength, index + 46 + entry.extraLength + entry.filenameLength));
							entry.filename = ((entry.bitFlag & 0x0800) === 0x0800) ? decodeUTF8(filename) : decodeASCII(filename);
							entries.push(entry);
							index += 46 + entry.extraLength + entry.filenameLength;
						}
						callback(entries);
					}, function() {
						terminate(onerror, "Error while reading zip file.");
					});
				}, function() {
					terminate(onerror, "Error while reading zip file.");
				});
			},
			close : terminate
		};
	}

	// ZipWriter

	function encodeUTF8(argString) {
		if (argString === null || typeof argString === "undefined") {
			return "";
		}

		var string = (argString + '');
		var utftext = [], start, end, stringl = 0;

		start = end = 0;
		stringl = string.length;
		for ( var n = 0; n < stringl; n++) {
			var c1 = string.charCodeAt(n);
			var enc = null;

			if (c1 < 128) {
				end++;
			} else if (c1 > 127 && c1 < 2048) {
				enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
			} else {
				enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
			}
			if (enc !== null) {
				if (end > start) {
					utftext += string.slice(start, end);
				}
				utftext += enc;
				start = end = n + 1;
			}
		}

		if (end > start) {
			utftext += string.slice(start, stringl);
		}

		return utftext;
	}

	function getBytes(str) {
		var i, array = [];
		for (i = 0; i < str.length; i++)
			array.push(str.charCodeAt(i));
		return array;
	}

	function createZipWriter(writer, dontDeflate, callback, onerror) {
		writer.init(function() {
			callback(createZipWriterCore(writer, dontDeflate, onerror));
		}, onerror);
	}

	function createZipWriterCore(writer, dontDeflate, onerror) {
		var worker, crcWorker, files = [], filenames = [], datalength = 0, CHUNK_SIZE = 512 * 1024;

		function terminate(callback, message) {
			if (worker)
				worker.terminate();
			if (crcWorker)
				crcWorker.terminate();
			worker = null;
			crcWorker = null;
			if (callback)
				callback(message);
		}

		function onWriteError() {
			terminate(onerror, "Error while writing zip file.");
		}

		return {
			add : function(name, reader, options, onend, onprogress) {
				var filename = getBytes(encodeUTF8(name)), compressedDataSize = 0, chunkIndex = 0;

				function stepDeflate(level) {
					var index = chunkIndex * CHUNK_SIZE, size = reader.size;
					if (onprogress)
						onprogress(index, size);
					if (index < size) {
						reader.readBlob(index, Math.min(CHUNK_SIZE, size - index), function(blob) {
							worker.postMessage({
								append : true,
								data : blob,
								level : level
							});
							chunkIndex++;
						});
					} else
						worker.postMessage({
							flush : true
						});
				}

				function appendBlob(blob, callback) {
					compressedDataSize += blob.size;
					writer.appendBlob(blob, function() {
						callback();
					}, onWriteError);
				}

				function deflate(level, callback) {
					function onmessage(event) {
						var blob, message = event.data;
						if (message.onappend) {
							appendBlob(message.data, function() {
								stepDeflate(level);
							});
						}
						if (message.onflush) {
							appendBlob(message.data, function() {
								worker.terminate();
								worker = null;
								callback();
							});
						}
					}
					worker = new Worker(WORKER_SCRIPTS_PATH + "deflate.js");
					worker.addEventListener("message", onmessage, false);
					stepDeflate(level);
				}

				function writeFile() {
					function onmessage(event) {
						var crc = event.data, date = new Date(), header = getDataHelper(26), data = getDataHelper(30 + filename.length);
						crcWorker.terminate();
						crcWorker = null;
						filenames.push(name);
						files[name] = {
							headerArray : header.array,
							directory : options.directory,
							filename : filename,
							offset : datalength
						};
						header.view.setUint32(0, 0x0a000008);
						if (!dontDeflate)
							header.view.setUint16(4, 0x0800);
						header.view.setUint16(6, (((date.getHours() << 6) | date.getMinutes()) << 5) | date.getSeconds() / 2, true);
						header.view.setUint16(8, ((((date.getFullYear() - 1980) << 4) | (date.getMonth() + 1)) << 5) | date.getDate(), true);
						header.view.setUint32(10, crc, true);
						header.view.setUint32(14, compressedDataSize, true);
						header.view.setUint32(18, reader.size, true);
						header.view.setUint16(22, filename.length, true);
						data.view.setUint32(0, 0x504b0304);
						data.array.set(header.array, 4);
						data.array.set(filename, 30);
						writer.seek(datalength, function() {
							writer.appendArrayBuffer(data.buffer, function() {
								datalength += data.buffer.byteLength + compressedDataSize;
								onend();
							}, onWriteError);
						}, onWriteError);
					}
					crcWorker = new Worker(WORKER_SCRIPTS_PATH + "crc32.js");
					crcWorker.addEventListener("message", onmessage, false);
					// TODO : buffered read instead of getBlob call in order to support HttpRangeReader
					crcWorker.postMessage(reader.getBlob());
				}

				name = name.trim();
				if (files[name])
					throw "File " + name + " already exists.";
				options = options || {};
				writer.seek(datalength + 30 + filename.length, function() {
					// TODO : buffered read instead of getBlob call in order to support HttpRangeReader
					reader.init(function() {
						if (dontDeflate)
							writeFile(reader.getBlob());
						else
							deflate(options.level, writeFile);
					}, onerror);
				}, onWriteError);
			},
			close : function(callback) {
				var data, length = 0, index = 0;
				filenames.forEach(function(name) {
					length += 46 + files[name].filename.length;
				});
				data = getDataHelper(length + 22);
				filenames.forEach(function(name) {
					var file = files[name];
					data.view.setUint32(index, 0x504b0102);
					data.view.setUint16(index + 4, 0x1400);
					data.array.set(file.headerArray, index + 6);
					if (file.directory)
						data.view.setUint16(index + 38, 0x0100);
					data.view.setUint32(index + 42, file.offset, true);
					data.array.set(file.filename, index + 46);
					index += 46 + file.filename.length;
				});
				data.view.setUint32(index, 0x504b0506);
				data.view.setUint16(index + 8, filenames.length, true);
				data.view.setUint16(index + 10, filenames.length, true);
				data.view.setUint32(index + 12, length, true);
				data.view.setUint32(index + 16, datalength, true);
				writer.seek(datalength, function() {
					writer.appendArrayBuffer(data.buffer, function() {
						terminate(callback);
					}, onWriteError);
				}, onWriteError);
			}
		};
	}

	obj.zip = {
		BlobReader : BlobReader,
		HttpRangeReader : HttpRangeReader,
		BlobWriter : BlobWriter,
		FileWriter : FileWriter,
		createReader : createZipReader,
		createWriter : createZipWriter
	};

})(this);
