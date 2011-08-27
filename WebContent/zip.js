/*
 * Copyright 2011 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 * 
 * decodeUTF8 and encodeUTF8 implementations found on phpjs.org
 */
(function(obj) {

	var BlobBuilder = WebKitBlobBuilder || MozBlobBuilder || BlobBuilder;

	var WORKER_SCRIPTS_PATH = "";

	// COMMON

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

	// READER

	function decodeASCII(str) {
		var i = 0, out = "", charCode, extendedASCII = [ 'Ç', 'ü', 'é', 'â', 'ä', 'à', 'å', 'ç', 'ê', 'ë', 'è', 'ï', 'î', 'ì', 'Ä', 'Å', 'É', 'æ', 'Æ', 'ô',
				'ö', 'ò', 'û', 'ù', 'ÿ', 'Ö', 'Ü', 'ø', '£', 'Ø', '×', 'ƒ', 'á', 'í', 'ó', 'ú', 'ñ', 'Ñ', 'ª', 'º', '¿', '®', '¬', '½', '¼', '¡', '«', '»',
				'_', '_', '_', '¦', '¦', 'Á', 'Â', 'À', '©', '¦', '¦', '+', '+', '¢', '¥', '+', '+', '-', '-', '+', '-', '+', 'ã', 'Ã', '+', '+', '-', '-',
				'¦', '-', '+', '¤', 'ð', 'Ð', 'Ê', 'Ë', 'È', 'i', 'Í', 'Î', 'Ï', '+', '+', '_', '_', '¦', 'Ì', '_', 'Ó', 'ß', 'Ô', 'Ò', 'õ', 'Õ', 'µ', 'þ',
				'Þ', 'Ú', 'Û', 'Ù', 'ý', 'Ý', '¯', '´', '­', '±', '_', '¾', '¶', '§', '÷', '¸', '°', '¨', '·', '¹', '³', '²', '_', ' ' ];
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

	function createZipReader(file) {
		var worker;

		function readBlob(index, length) {
			if (file.webkitSlice)
				return file.webkitSlice(index, index + length);
			else if (file.mozSlice)
				return file.mozSlice(index, index + length);
			else
				return file.slice(index, index + length);
		}

		function readArrayBuffer(index, length, callback, onerror) {
			var reader = new FileReader();
			reader.onload = function(e) {
				callback(new Uint8Array(e.target.result));
			};
			reader.onerror = onerror;
			reader.readAsArrayBuffer(readBlob(index, length));
		}

		function terminate(callback, param) {
			if (worker)
				worker.terminate();
			worker = null;
			if (callback)
				callback(param);
		}

		function inflate(data, uncompressedSize, callback, onprogress) {
			function onmesssage(event) {
				var message = event.data;
				if (message.progress && onprogress)
					onprogress(message.current, message.total);
				if (message.end) {
					worker.removeEventListener("message", onmesssage, false);
					callback(message.data);
				}
			}

			if (!worker)
				worker = new Worker(WORKER_SCRIPTS_PATH + "inflate.js");
			worker.addEventListener("message", onmesssage, false);
			worker.postMessage({
				inflate : true,
				data : data,
				uncompressedSize : uncompressedSize
			});
		}

		function getData(entry, callback, onprogress, onerror) {
			readArrayBuffer(entry.offset, 4, function(bytes) {
				if (getDataHelper(bytes.length, bytes).view.getUint32(0) == 0x504b0304) {
					bytes = readBlob(entry.offset + 30 + entry.filenameLength + entry.extraLength, entry.compressedSize);
					if (entry.compressionMethod === 0)
						callback(bytes);
					else
						inflate(bytes, entry.uncompressedSize, function(data) {
							callback(data);
						}, onprogress);
				} else
					terminate(onerror, "File format is not recognized.");
			}, function() {
				terminate(onerror, "Error while reading zip file.");
			});
		}

		return {
			getEntries : function(callback, onerror) {
				if (file.size < 22) {
					terminate(onerror, "File format is not recognized.");
					return;
				}
				readArrayBuffer(file.size - 22, 22, function(bytes) {
					var dataView = getDataHelper(bytes.length, bytes).view, datalength, fileslength;
					if (dataView.getUint32(0) != 0x504b0506) {
						terminate(onerror, "File format is not recognized.");
						return;
					}
					datalength = dataView.getUint32(16, true);
					fileslength = dataView.getUint16(8, true);
					readArrayBuffer(datalength, file.size - datalength, function(bytes) {
						var i, signature, index = 0, entries = [], entry, filename, data = getDataHelper(bytes.length, bytes);
						for (i = 0; i < fileslength; i++) {
							entry = {};
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
							(function(entry) {
								entry.getData = function(callback, onprogress) {
									getData(entry, callback, onprogress, onerror);
								};
							})(entry);
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

	// WRITER

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

	function createZipWriter(file, dontDeflate) {
		var worker, crcWorker, writer, files = [], filenames = [], datalength = 0;

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

		function writeBlob(blob, callback, onerror) {
			if (writer) {
				writer.onwrite = callback;
				writer.onerror = onerror;
				writer.write(blob);
			} else
				file.createWriter(function(fileWriter) {
					writer = fileWriter;
					writeBlob(blob, callback, onerror);
				}, onerror);
		}

		function writeArrayBuffer(arrayBuffer, callback, onerror) {
			var blobBuilder = new BlobBuilder();
			blobBuilder.append(arrayBuffer);
			writeBlob(blobBuilder.getBlob(), callback, onerror);
		}

		return {
			add : function(name, uncompressedData, options, onend, onprogress) {
				function deflate(level, callback) {
					function onmessage(event) {
						var message = event.data;
						if (message.progress && onprogress)
							onprogress(message.current, message.total);
						if (message.end) {
							worker.removeEventListener("message", onmessage, false);
							callback(message.data);
						}
					}
					if (!worker)
						worker = new Worker(WORKER_SCRIPTS_PATH + "deflate.js");
					worker.addEventListener("message", onmessage, false);
					worker.postMessage({
						deflate : true,
						data : uncompressedData,
						level : level
					});
				}

				function writeFile(fileData, onerror) {
					function onmessage(event) {
						var crc = event.data, date = new Date(), filename = encodeUTF8(name), header = getDataHelper(26), data = getDataHelper(30 + filename.length);
						crcWorker.removeEventListener("message", onmessage, false);
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
						header.view.setUint32(14, fileData.size, true);
						header.view.setUint32(18, uncompressedData.size, true);
						header.view.setUint16(22, filename.length, true);
						data.view.setUint32(0, 0x504b0304);
						data.array.set(header.array, 4);
						data.array.set(getBytes(filename), 30);
						writeArrayBuffer(data.buffer, function() {
							writeBlob(fileData, function() {
								datalength += data.buffer.byteLength + fileData.size;
								onend();
							}, function() {
								terminate(onerror, "Error while writing zip file.");
							});
						}, function() {
							terminate(onerror, "Error while writing zip file.");
						});
					}
					if (!crcWorker)
						crcWorker = new Worker(WORKER_SCRIPTS_PATH + "crc32.js");
					crcWorker.addEventListener("message", onmessage, false);
					crcWorker.postMessage(uncompressedData);
				}

				name = name.trim();
				if (files[name])
					throw name + " already exists";
				options = options || {};
				if (dontDeflate)
					writeFile(uncompressedData);
				else
					deflate(options.level, writeFile);
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
					data.array.set(getBytes(file.filename), index + 46);
					index += 46 + file.filename.length;
				});
				data.view.setUint32(index, 0x504b0506);
				data.view.setUint16(index + 8, filenames.length, true);
				data.view.setUint16(index + 10, filenames.length, true);
				data.view.setUint32(index + 12, length, true);
				data.view.setUint32(index + 16, datalength, true);
				writeArrayBuffer(data.buffer, function() {
					terminate(callback);
				}, function() {
					terminate(onerror, "Error while writing zip file.");
				});
			}
		};
	}

	obj.zip = {
		createReader : createZipReader,
		createWriter : createZipWriter
	};

})(window);