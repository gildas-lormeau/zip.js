/*
 Copyright (c) 2012 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function(obj) {

	var ERR_BAD_FORMAT = "File format is not recognized.";
	var ERR_ENCRYPTED = "File contains encrypted entry.";
	var ERR_ZIP64 = "File is using Zip64 (4gb+ file size).";
	var ERR_READ = "Error while reading zip file.";
	var ERR_WRITE = "Error while writing zip file.";
	var ERR_WRITE_DATA = "Error while writing file.";
	var ERR_READ_DATA = "Error while reading file.";
	var ERR_DUPLICATED_NAME = "File already exists.";
	var ERR_HTTP_RANGE = "HTTP Range not supported.";
	var CHUNK_SIZE = 512 * 1024;

	var INFLATE_JS = "inflate.js";
	var DEFLATE_JS = "deflate.js";

	var BlobBuilder = obj.WebKitBlobBuilder || obj.MozBlobBuilder || obj.MsBlobBuilder || obj.BlobBuilder;

	function blobSlice(blob, index, length) {
		if (blob.webkitSlice)
			return blob.webkitSlice(index, index + length);
		else if (blob.mozSlice)
			return blob.mozSlice(index, index + length);
		else if (blob.msSlice)
			return blob.msSlice(index, index + length);
		else
			return blob.slice(index, index + length);
	}

	function getDataHelper(byteLength, bytes) {
		var dataBuffer, dataArray;
		dataBuffer = new ArrayBuffer(byteLength);
		dataArray = new Uint8Array(dataBuffer);
		if (bytes)
			dataArray.set(bytes, 0);
		return {
			buffer : dataBuffer,
			array : dataArray,
			view : new DataView(dataBuffer)
		};
	}

	// Readers
	function Reader() {
	}
	Reader.prototype.readBlob = function(index, length, callback, onerror) {
		this.readUint8Array(index, length, function(array) {
			var data = getDataHelper(array.length, array), blobBuilder = new BlobBuilder();
			blobBuilder.append(data.buffer);
			callback(blobBuilder.getBlob());
		}, onerror);
	};

	function TextReader(text) {
		var that = this;

		function init(callback, onerror) {
			that.size = text.length;
			callback();
		}

		function readUint8Array(index, length, callback, onerror) {
			readBlob(index, length, function(blob) {
				var reader = new FileReader();
				reader.onload = function(e) {
					callback(new Uint8Array(e.target.result));
				};
				reader.onerror = onerror;
				reader.readAsArrayBuffer(blob);
			}, onerror);
		}

		function readBlob(index, length, callback, onerror) {
			var blobBuilder = new BlobBuilder();
			blobBuilder.append(text.substring(index, index + length));
			callback(blobBuilder.getBlob());
		}

		that.size = 0;
		that.init = init;
		that.readBlob = readBlob;
		that.readUint8Array = readUint8Array;
	}
	TextReader.prototype = new Reader();

	function Data64URIReader(dataURI) {
		var that = this, dataStart;

		function init(callback, onerror) {
			var dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=")
				dataEnd--;
			dataStart = dataURI.indexOf(",") + 1;
			that.size = Math.floor((dataEnd - dataStart) * 0.75);
			callback();
		}

		function readUint8Array(index, length, callback, onerror) {
			var i, data = getDataHelper(length);
			var start = Math.floor(index / 3) * 4;
			var end = Math.ceil((index + length) / 3) * 4;
			var bytes = obj.atob(dataURI.substring(start + dataStart, end + dataStart));
			var delta = index - Math.floor(start / 4) * 3;
			for (i = delta; i < delta + length; i++)
				data.array[i - delta] = bytes.charCodeAt(i);
			callback(data.array);
		}

		that.size = 0;
		that.init = init;
		that.readUint8Array = readUint8Array;
	}
	Data64URIReader.prototype = new Reader();

	function BlobReader(blob) {
		var that = this;

		function init(callback, onerror) {
			this.size = blob.size;
			callback();
		}

		function readUint8Array(index, length, callback, onerror) {
			var reader = new FileReader();
			reader.onload = function(e) {
				callback(new Uint8Array(e.target.result));
			};
			reader.onerror = onerror;
			reader.readAsArrayBuffer(blobSlice(blob, index, length));
		}

		function readBlob(index, length, callback, onerror) {
			callback(blobSlice(blob, index, length));
		}

		that.size = 0;
		that.init = init;
		that.readBlob = readBlob;
		that.readUint8Array = readUint8Array;
	}
	BlobReader.prototype = new Reader();

	function HttpReader(url) {
		var that = this;

		function getData(callback) {
			var request;
			if (!that.data) {
				request = new XMLHttpRequest();
				request.addEventListener("load", function() {
					if (!that.size)
						that.size = Number(request.getResponseHeader("Content-Length"));
					that.data = new Uint8Array(request.response);
					callback();
				}, false);
				request.addEventListener("error", onerror, false);
				request.open("GET", url);
				request.responseType = "arraybuffer";
				request.send();
			} else
				callback();
		}

		function init(callback, onerror) {
			var request = new XMLHttpRequest();
			request.addEventListener("load", function() {
				that.size = Number(request.getResponseHeader("Content-Length"));
				callback();
			}, false);
			request.addEventListener("error", onerror, false);
			request.open("HEAD", url);
			request.send();
		}

		function readUint8Array(index, length, callback, onerror) {
			getData(function() {
				callback(that.data.subarray(index, index + length));
			});
		}

		that.size = 0;
		that.init = init;
		that.readUint8Array = readUint8Array;
	}
	HttpReader.prototype = new Reader();

	function HttpRangeReader(url) {
		var that = this;

		function init(callback, onerror) {
			var request = new XMLHttpRequest();
			request.addEventListener("load", function() {
				that.size = Number(request.getResponseHeader("Content-Length"));
				if (request.getResponseHeader("Accept-Ranges") == "bytes")
					callback();
				else
					onerror(ERR_HTTP_RANGE);
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
	HttpRangeReader.prototype = new Reader();

	// Writers

	function Writer() {
	}
	Writer.prototype.getData = function(callback) {
		callback(this.data);
	};

	function TextWriter() {
		var that = this;

		function init(callback, onerror) {
			that.data = "";
			callback();
		}

		function writeUint8Array(array, callback, onerror) {
			var i;
			for (i = 0; i < array.length; i++)
				that.data += String.fromCharCode(array[i]);
			callback();
		}

		that.init = init;
		that.writeUint8Array = writeUint8Array;
	}
	TextWriter.prototype = new Writer();

	function Data64URIWriter(mimeString) {
		var that = this, data = "", pending = "";

		function init(callback, onerror) {
			data += "data:" + (mimeString || "") + ";base64,";
			callback();
		}

		function writeUint8Array(array, callback, onerror) {
			var i, delta = pending.length, dataString = pending;
			pending = "";
			for (i = 0; i < (Math.floor((delta + array.length) / 3) * 3) - delta; i++)
				dataString += String.fromCharCode(array[i]);
			for (; i < array.length; i++)
				pending += String.fromCharCode(array[i]);
			data += obj.btoa(dataString);
			callback();
		}

		function getData(callback) {
			callback(data + obj.btoa(pending));
		}

		that.init = init;
		that.writeUint8Array = writeUint8Array;
		that.getData = getData;
	}
	Data64URIWriter.prototype = new Writer();

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

		that.init = init;
		that.writeUint8Array = writeUint8Array;
		that.getData = getData;
	}
	FileWriter.prototype = new Writer();

	function BlobWriter() {
		var blobBuilder, that = this;

		function init(callback, onerror) {
			blobBuilder = new BlobBuilder();
			callback();
		}

		function writeUint8Array(array, callback, onerror) {
			var buffer = array.buffer;
			blobBuilder.append(buffer);
			callback();
		}

		function getData(callback) {
			callback(blobBuilder.getBlob());
		}

		that.init = init;
		that.writeUint8Array = writeUint8Array;
		that.getData = getData;
	}
	BlobWriter.prototype = new Writer();

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

		function readCommonHeader(entry, data, index, centralDirectory) {
			entry.versionNeeded = data.view.getUint16(index, true);
			entry.bitFlag = data.view.getUint16(index + 2, true);
			entry.compressionMethod = data.view.getUint16(index + 4, true);
			entry.timeBlob = data.view.getUint32(index + 6, true);
			if ((entry.bitFlag & 0x01) === 0x01) {
				onerror(ERR_ENCRYPTED);
				return;
			}
			if (centralDirectory || (entry.bitFlag & 0x0008) != 0x0008) {
				entry.crc32 = data.view.getUint32(index + 10, true);
				entry.compressedSize = data.view.getUint32(index + 14, true);
				entry.uncompressedSize = data.view.getUint32(index + 18, true);
			}
			if (entry.compressedSize === 0xFFFFFFFF || entry.uncompressedSize === 0xFFFFFFFF) {
				onerror(ERR_ZIP64);
				return;
			}
			entry.filenameLength = data.view.getUint16(index + 22, true);
			entry.extraLength = data.view.getUint16(index + 24, true);
		}

		function Entry() {
		}

		Entry.prototype.getData = function(writer, onend, onprogress) {
			var that = this, worker;

			function terminate(callback, param) {
				if (worker)
					worker.terminate();
				worker = null;
				if (callback)
					callback(param);
			}

			function bufferedInflate(data, onend, onerror) {
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
						writer.writeUint8Array(message.data, stepInflate);
					if (message.onflush)
						terminate(onend);
					if (message.progress && onprogress)
						onprogress(message.current + ((chunkIndex - 1) * CHUNK_SIZE), data.size);
				}

				worker = new Worker(obj.zip.workerScriptsPath + INFLATE_JS);
				worker.addEventListener("message", onmesssage, false);
				stepInflate();
			}

			function bufferedCopy(offset, size, onend, onerror) {
				var chunkIndex = 0;

				function stepCopy() {
					var index = chunkIndex * CHUNK_SIZE;
					if (onprogress)
						onprogress(index, size);
					if (index < size)
						reader.readUint8Array(offset + index, Math.min(CHUNK_SIZE, size - index), function(array) {
							writer.writeUint8Array(new Uint8Array(array), function() {
								chunkIndex++;
								stepCopy();
							});
						}, onerror);
					else
						onend();
				}

				stepCopy();
			}

			function getWriterData() {
				writer.getData(onend);
			}

			reader.readUint8Array(that.offset, 4, function(bytes) {
				reader.readUint8Array(that.offset, 30, function(bytes) {
					var data = getDataHelper(bytes.length, bytes), dataOffset;
					if (data.view.getUint32(0) != 0x504b0304) {
						onerror(ERR_BAD_FORMAT);
						return;
					}
					readCommonHeader(that, data, 4);
					dataOffset = that.offset + 30 + that.filenameLength + that.extraLength;
					writer.init(function() {
						if (that.compressionMethod === 0)
							bufferedCopy(dataOffset, that.compressedSize, getWriterData, function() {
								onerror(ERR_WRITE_DATA);
							});
						else
							reader.readBlob(dataOffset, that.compressedSize, function(data) {
								bufferedInflate(data, getWriterData, function() {
									onerror(ERR_WRITE_DATA);
								});
							}, function() {
								onerror(ERR_BAD_FORMAT);
							});
					}, function() {
						onerror(ERR_WRITE_DATA);
					});
				}, function() {
					onerror(ERR_BAD_FORMAT);
				});
			}, function() {
				onerror(ERR_READ);
			});
		};

		return {
			getEntries : function(callback) {
				if (reader.size < 22) {
					onerror(ERR_BAD_FORMAT);
					return;
				}
				reader.readUint8Array(reader.size - 22, 22, function(bytes) {
					var dataView = getDataHelper(bytes.length, bytes).view, datalength, fileslength;
					if (dataView.getUint32(0) != 0x504b0506) {
						onerror(ERR_BAD_FORMAT);
						return;
					}
					datalength = dataView.getUint32(16, true);
					fileslength = dataView.getUint16(8, true);
					reader.readUint8Array(datalength, reader.size - datalength, function(bytes) {
						var i, index = 0, entries = [], entry, filename, data = getDataHelper(bytes.length, bytes);
						for (i = 0; i < fileslength; i++) {
							entry = new Entry();
							if (data.view.getUint32(index) != 0x504b0102) {
								onerror(ERR_BAD_FORMAT);
								return;
							}
							readCommonHeader(entry, data, index + 6, true);
							entry.commentLength = data.view.getUint16(index + 32, true);
							entry.directory = ((data.view.getUint8(index + 38) & 0x10) == 0x10);
							entry.offset = data.view.getUint32(index + 42, true);
							filename = getString(data.array.subarray(index + 46, index + 46 + entry.filenameLength));
							entry.filename = ((entry.bitFlag & 0x0800) === 0x0800) ? decodeUTF8(filename) : decodeASCII(filename);
							entries.push(entry);
							index += 46 + entry.extraLength + entry.commentLength + entry.filenameLength;
						}
						callback(entries);
					}, function() {
						onerror(ERR_READ);
					});
				}, function() {
					onerror(ERR_READ);
				});
			},
			close : function() {

			}
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
		var worker, files = [], filenames = [], datalength = 0, crc32, compressedLength;

		function terminate(callback, message) {
			if (worker)
				worker.terminate();
			worker = null;
			if (callback)
				callback(message);
		}

		function onwriteError() {
			terminate(onerror, ERR_WRITE);
		}

		function writeUint8Array(array, callback) {
			compressedLength += array.length;
			writer.writeUint8Array(array, callback, onwriteError);
		}

		function bufferedDeflate(reader, level, onend, onprogress, onerror) {
			var chunkIndex = 0;

			function stepDeflate() {
				var index = chunkIndex * CHUNK_SIZE, size = reader.size;
				if (index < size) {
					if (onprogress)
						onprogress(index, size);
					reader.readUint8Array(index, Math.min(CHUNK_SIZE, size - index), function(data) {
						worker.postMessage({
							append : true,
							data : data
						});
						crc32.append(data);
						chunkIndex++;
					}, onerror);
				} else
					worker.postMessage({
						flush : true
					});
			}

			function onmessage(event) {
				var message = event.data;
				if (message.oninit)
					stepDeflate();
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

			worker = new Worker(obj.zip.workerScriptsPath + DEFLATE_JS);
			worker.addEventListener("message", onmessage, false);
			crc32 = new Crc32();
			worker.postMessage({
				init : true,
				level : level
			});
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
			add : function(name, reader, onend, onprogress, options) {
				var header, filename, date = new Date();

				function writeHeader(callback) {
					var data;
					header = getDataHelper(26);
					files[name] = {
						headerArray : header.array,
						directory : options.directory,
						filename : filename,
						offset : datalength
					};
					header.view.setUint32(0, 0x0a000808);
					if (!dontDeflate)
						header.view.setUint16(4, 0x0800);
					header.view.setUint16(6, (((date.getHours() << 6) | date.getMinutes()) << 5) | date.getSeconds() / 2, true);
					header.view.setUint16(8, ((((date.getFullYear() - 1980) << 4) | (date.getMonth() + 1)) << 5) | date.getDate(), true);
					header.view.setUint16(22, filename.length, true);
					data = getDataHelper(30 + filename.length);
					data.view.setUint32(0, 0x504b0304);
					data.array.set(header.array, 4);
					data.array.set([], 30); // FIXME: remove when chrome 19 will be stable? (chrome 14: OK, chrome 16: KO, chromium 18: OK)
					data.array.set(filename, 30);
					datalength += data.array.length;
					writer.writeUint8Array(data.array, callback, onwriteError);
				}

				function writeFooter() {
					var footer = getDataHelper(16);
					datalength += compressedLength;
					footer.view.setUint32(0, 0x504b0708, true);
					if (crc32) {
						header.view.setUint32(10, crc32.get(), true);
						footer.view.setUint32(4, crc32.get(), true);
					}
					if (reader) {
						footer.view.setUint32(8, compressedLength, true);
						header.view.setUint32(14, compressedLength, true);
						footer.view.setUint32(12, reader.size, true);
						header.view.setUint32(18, reader.size, true);
					}
					writer.writeUint8Array(footer.array, function() {
						datalength += 16;
						onend();
					}, onwriteError);
				}

				function writeFile() {
					compressedLength = 0;
					options = options || {};
					name = name.trim();
					if (options.directory)
						name += "/";
					if (files[name])
						throw ERR_DUPLICATED_NAME;
					filename = getBytes(encodeUTF8(name));
					filenames.push(name);
					writeHeader(function() {
						if (reader)
							if (dontDeflate)
								bufferedCopy(reader, writeFooter, onprogress, function() {
									terminate(onerror, ERR_READ_DATA);
								});
							else
								bufferedDeflate(reader, options.level, writeFooter, onprogress, function() {
									terminate(onerror, ERR_READ_DATA);
								});
						else
							writeFooter();
					}, onwriteError);
				}

				if (reader)
					reader.init(writeFile);
				else
					writeFile();
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
						data.view.setUint8(index + 38, 0x10);
					data.view.setUint32(index + 42, file.offset, true);
					data.array.set(file.filename, index + 46);
					index += 46 + file.filename.length;
				});
				data.view.setUint32(index, 0x504b0506);
				data.view.setUint16(index + 8, filenames.length, true);
				data.view.setUint16(index + 10, filenames.length, true);
				data.view.setUint32(index + 12, length, true);
				data.view.setUint32(index + 16, datalength, true);
				writer.writeUint8Array(data.array, function() {
					terminate(function() {
						writer.getData(callback);
					});
				}, onwriteError);
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
		HttpReader : HttpReader,
		HttpRangeReader : HttpRangeReader,
		Data64URIReader : Data64URIReader,
		TextReader : TextReader,
		BlobWriter : BlobWriter,
		FileWriter : FileWriter,
		Data64URIWriter : Data64URIWriter,
		TextWriter : TextWriter,
		createReader : createZipReader,
		createWriter : createZipWriter,
		workerScriptsPath : ""
	};

})(this);
