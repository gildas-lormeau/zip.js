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

	function getDataHelper(byteLength, bytes) {
		var dataBuffer, dataArray, dataView;
		dataBuffer = new ArrayBuffer(byteLength);
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

	// Readers

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

		that.size = 0;
		that.init = init;
		that.readBlob = readBlob;
		that.readUint8Array = readUint8Array;
	}

	function HttpRangeReader(url) {
		var that = this;

		function init(callback, onerror) {
			var request = new XMLHttpRequest();
			request.addEventListener("load", function() {
				that.size = Number(request.getResponseHeader("Content-Length"));
				if (request.getResponseHeader("Accept-Ranges") == "bytes")
					callback();
				else
					onerror("HTTP Range not supported.");
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

		that.size = 0;
		that.init = init;
		that.readBlob = readBlob;
		that.readUint8Array = readUint8Array;
	}

	// Writers

	function FileWriter(fileEntry) {
		var writer, that = this;

		function init(callback, onerror) {
			fileEntry.createWriter(function(fileWriter) {
				writer = fileWriter;
				callback();
			}, onerror);
		}

		function writeUint8Array(array, callback, onerror) {
			var blobBuilder = new BlobBuilder();
			blobBuilder.append(array.buffer);
			writer.onwrite = function() {
				writer.onwrite = null;
				callback();
			};
			writer.onerror = onerror;
			writer.write(blobBuilder.getBlob());
		}

		function getData(callback) {
			fileEntry.file(callback);
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
		that.writeUint8Array = writeUint8Array;
		that.getData = getData;
		that.seek = seek;
	}

	function BlobWriter() {
		var blobBuilder, that = this, index = 0, size = 0;

		function init(callback, onerror) {
			blobBuilder = new BlobBuilder();
			setTimeout(callback, 1);
		}

		function writeUint8Array(array, callback, onerror) {
			var blob, startBlob, endBlob, paddingLength, buffer = array.buffer, byteLength = buffer.byteLength;

			if (index == size) {
				blobBuilder.append(buffer);
				size += byteLength;
				index += byteLength;
			} else {
				if (index + byteLength > size) {
					paddingLength = index + byteLength - size;
					blobBuilder.append(new Uint8Array(paddingLength).buffer);
					size += paddingLength;
				}
				blob = blobBuilder.getBlob();
				if (index)
					startBlob = blobSlice(blob, 0, index);
				index += byteLength;
				if (size - index)
					endBlob = blobSlice(blob, index, size - index);
				blobBuilder = new BlobBuilder();
				if (startBlob)
					blobBuilder.append(startBlob);
				blobBuilder.append(buffer);
				if (endBlob)
					blobBuilder.append(endBlob);
			}

			setTimeout(callback, 1);
		}

		function getData(callback) {
			setTimeout(function() {
				callback(blobBuilder.getBlob());
			}, 1);
		}

		function seek(offset, callback, onerror) {
			index = offset;
			setTimeout(callback, 1);
		}

		that.init = init;
		that.writeUint8Array = writeUint8Array;
		that.getData = getData;
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

	function createZipReaderCore(reader, onerror) {
		var worker, CHUNK_SIZE = 512 * 1024;

		function terminate(callback, param) {
			if (worker)
				worker.terminate();
			worker = null;
			if (callback)
				callback(param);
		}

		function bufferedInflate(data, writer, onend, onprogress, onerror) {
			var chunkIndex = 0;

			function stepInflate() {
				var fileReader = new FileReader(), index = chunkIndex * CHUNK_SIZE, size = data.size;

				if (index < size) {
					if (onprogress)
						onprogress(index, size);
					fileReader.onerror = onerror;
					fileReader.onload = function(event) {
						worker.postMessage({
							append : true,
							data : new Uint8Array(event.target.result)
						});
						chunkIndex++;
					};
					fileReader.readAsArrayBuffer(blobSlice(data, index, Math.min(CHUNK_SIZE, size - index)));
				} else
					worker.postMessage({
						flush : true
					});
			}

			function onmesssage(event) {
				var message = event.data;
				if (message.onappend)
					writer.writeUint8Array(message.data, function() {
						stepInflate();
					});
				if (message.onflush)
					terminate(function() {
						onend();
					});
				if (message.progress && onprogress)
					onprogress(message.current + ((chunkIndex - 1) * CHUNK_SIZE), data.size);
			}

			worker = new Worker(WORKER_SCRIPTS_PATH + "inflate.js");
			worker.addEventListener("message", onmesssage, false);
			stepInflate();
		}

		function Entry() {
		}

		Entry.prototype.getData = function(writer, onend, onprogress) {
			var that = this;

			function getWriterData() {
				writer.getData(function(data) {
					onend(data);
				});
			}

			reader.readUint8Array(that.offset, 4, function(bytes) {
				if (getDataHelper(bytes.length, bytes).view.getUint32(0) == 0x504b0304) {
					reader.readBlob(that.offset + 30 + that.filenameLength + that.extraLength, that.compressedSize, function(data) {
						writer.init(function() {
							if (that.compressionMethod === 0)
								getWriterData();
							else
								bufferedInflate(data, writer, getWriterData, onprogress, onerror);
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

	function createZipReader(reader, callback, onerror) {
		reader.init(function() {
			callback(createZipReaderCore(reader, onerror));
		}, onerror);
	}

	// ZipWriter

	function Crc32() {
		var crc = -1, that = this, table = [ 0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324,
				3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603,
				4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886,
				3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101,
				3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024,
				3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215,
				2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866,
				2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977,
				2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996,
				2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635,
				3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646,
				62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013,
				167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920,
				282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999,
				1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842,
				628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625,
				752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692,
				2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115,
				1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406,
				1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829,
				1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456,
				1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117 ];

		that.append = function(data) {
			var offset;
			for (offset = 0; offset < data.length; offset++)
				crc = (crc >>> 8) ^ table[(crc ^ data[offset]) & 0xFF];
		};

		that.get = function() {
			return crc ^ (-1);
		};
	}

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

	function createZipWriterCore(writer, onerror, dontDeflate) {
		var worker, files = [], filenames = [], datalength = 0, CHUNK_SIZE = 512 * 1024, crc32, compressedLength;

		function terminate(callback, message) {
			if (worker)
				worker.terminate();
			worker = null;
			if (callback)
				callback(message);
		}

		function onWriteError() {
			terminate(onerror, "Error while writing zip file.");
		}

		function writeUint8Array(array, callback) {
			compressedLength += array.length;
			writer.writeUint8Array(array, callback, onWriteError);
		}

		function bufferedDeflate(reader, level, onend, onprogress, onerror) {
			var chunkIndex = 0;

			function stepDeflate() {
				var index = chunkIndex * CHUNK_SIZE, size = reader.size;
				if (index < size) {
					if (onprogress)
						onprogress(index, size);
					reader.readUint8Array(index, Math.min(CHUNK_SIZE, size - index), function(data) {
						crc32.append(data);
						worker.postMessage({
							append : true,
							data : data,
							level : level
						});
						chunkIndex++;
					}, onerror);
				} else
					worker.postMessage({
						flush : true
					});
			}

			function onmessage(event) {
				var message = event.data;
				if (message.onappend)
					writeUint8Array(message.data, stepDeflate);
				if (message.onflush)
					writeUint8Array(message.data, function() {
						worker.removeEventListener("message", onmessage, false);
						terminate(onend);
					});
				if (message.progress && onprogress)
					onprogress(message.current + ((chunkIndex - 1) * CHUNK_SIZE), reader.size);
			}

			worker = new Worker(WORKER_SCRIPTS_PATH + "deflate.js");
			worker.addEventListener("message", onmessage, false);
			crc32 = new Crc32();
			stepDeflate();
		}

		function bufferedCopy(reader, onend, onprogress, onerror) {
			var chunkIndex = 0;

			function stepCopy() {
				var index = chunkIndex * CHUNK_SIZE, size = reader.size;
				if (onprogress)
					onprogress(index, size);
				if (index < size)
					reader.readUint8Array(index, Math.min(CHUNK_SIZE, size - index), function(array) {
						writeUint8Array(array, function() {
							crc32.append(array);
							chunkIndex++;
							stepCopy();
						});
					}, onerror);
				else
					onend();
			}

			crc32 = new Crc32();
			stepCopy();
		}

		return {
			add : function(name, reader, options, onend, onprogress) {
				var filename = getBytes(encodeUTF8(name));

				function writeMetadata() {
					var date = new Date(), header = getDataHelper(26), data = getDataHelper(30 + filename.length);
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
					header.view.setUint32(10, crc32.get(), true);
					header.view.setUint32(14, compressedLength, true);
					header.view.setUint32(18, reader.size, true);
					header.view.setUint16(22, filename.length, true);
					data.view.setUint32(0, 0x504b0304);
					data.array.set(header.array, 4);
					data.array.set([], 30); // FIXME: isolate and report this regression (chrome 14 : OK, chromium 16 : KO)
					data.array.set(filename, 30);
					writer.seek(datalength, function() {
						writer.writeUint8Array(data.array, function() {
							datalength += data.array.length + compressedLength;
							onend();
						}, onWriteError);
					}, onWriteError);
				}

				compressedLength = 0;
				name = name.trim();
				if (files[name])
					throw "File " + name + " already exists.";
				options = options || {};
				writer.seek(datalength + 30 + filename.length, function() {
					reader.init(function() {
						if (dontDeflate)
							bufferedCopy(reader, writeMetadata, onprogress, onerror);
						else
							bufferedDeflate(reader, options.level, writeMetadata, onprogress, onerror);
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
					writer.writeUint8Array(data.array, function() {
						terminate(function() {
							writer.getData(callback);
						});
					}, onWriteError);
				}, onWriteError);
			}
		};
	}

	function createZipWriter(writer, callback, onerror, dontDeflate) {
		writer.init(function() {
			callback(createZipWriterCore(writer, onerror, dontDeflate));
		}, onerror);
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
