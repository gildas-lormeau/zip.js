/*
 * Copyright 2011 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 * 
 */
(function(obj) {

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
		// Converts a UTF-8 encoded string to ISO-8859-1
		// 
		// version: 1107.2516
		// discuss at: http://phpjs.org/functions/decodeUTF8
		// + original by: Webtoolkit.info (http://www.webtoolkit.info/)
		// + input by: Aman Gupta
		// + improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// + improved by: Norman "zEh" Fuchs
		// + bugfixed by: hitwork
		// + bugfixed by: Onno Marsman
		// + input by: Brett Zamir (http://brett-zamir.me)
		// + bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// * example 1: decodeUTF8('Kevin van Zonneveld');
		// * returns 1: 'Kevin van Zonneveld'
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
		var worker = new Worker(WORKER_SCRIPTS_PATH + "inflate.js");

		function readFile(fileIndex, length, callback) {
			var blob, reader = new FileReader();
			if (file.slice)
				blob = file.slice(fileIndex, fileIndex + length);
			else if (file.webkitSlice)
				blob = file.webkitSlice(fileIndex, fileIndex + length);
			else if (file.mozSlice)
				blob = file.mozSlice(fileIndex, fileIndex + length);
			reader.onload = function(e) {
				callback(new Uint8Array(e.target.result));
			};
			reader.onerror = callback;
			reader.readAsArrayBuffer(blob);
		}

		function terminate(entry, message, callback) {
			callback(entry, message);
			worker.terminate();
		}

		function inflate(data, uncompressedSize, callback, callbackProgress) {
			function onmesssage(event) {
				var message = event.data;
				if (message.progress && callbackProgress)
					callbackProgress(message.current, message.total);
				if (message.end) {
					worker.removeEventListener("message", onmesssage, false);
					callback(message.data);
				}
			}

			worker.addEventListener("message", onmesssage, false);
			worker.postMessage({
				inflate : true,
				data : data,
				uncompressedSize : uncompressedSize
			});
		}

		function getData(entry, callback, callbackProgress) {
			readFile(entry.offset, 4, function(bytes) {
				if (getDataHelper(bytes.length, bytes).view.getUint32(0) == 0x504b0304)
					readFile(entry.offset + 30 + entry.filenameLength + entry.extraLength, entry.compressedSize, function(bytes) {
						if (entry.compressionMethod == 0)
							callback(bytes);
						else
							inflate(bytes, entry.uncompressedSize, function(data) {
								callback(data);
							}, callbackProgress);
					});
				else
					terminate(null, "File format is not recognized.", callback);
			});
		}

		return {
			getEntries : function(callback) {
				if (file.size < 22) {
					terminate(null, "File format is not recognized.", callback);
					return;
				}
				readFile(file.size - 22, 22, function(bytes) {
					var dataView = getDataHelper(bytes.length, bytes).view, datalength, fileslength;
					if (dataView.getUint32(0) != 0x504b0506) {
						terminate(null, "File format is not recognized.", callback);
						return;
					}
					datalength = dataView.getUint32(16, true);
					fileslength = dataView.getUint16(8, true);
					readFile(datalength, file.size - datalength, function(bytes) {
						var i, index = 0, entries = [], entry, filename, data = getDataHelper(bytes.length, bytes);
						for (i = 0; i < fileslength; i++) {
							entry = {}, signature = data.view.getUint32(index);
							entry.versionNeeded = data.view.getUint16(index + 6, true);
							entry.bitFlag = data.view.getUint16(index + 8, true);
							entry.compressionMethod = data.view.getUint16(index + 10, true);
							entry.timeBlob = data.view.getUint32(index + 12, true);
							if ((entry.bitFlag & 0x01) === 0x01) {
								terminate(entry, "File contains encrypted entry.", callback);
								return;
							}
							if ((entry.bitFlag & 0x0008) === 0x0008) {
								terminate(entry, "File is using bit 3 trailing data descriptor.", callback);
								return;
							}
							entry.crc32 = data.view.getUint32(index + 16, true);
							entry.compressedSize = data.view.getUint32(index + 20, true);
							entry.uncompressedSize = data.view.getUint32(index + 24, true);

							if (entry.compressedSize === 0xFFFFFFFF || entry.uncompressedSize === 0xFFFFFFFF) {
								terminate(entry, "File is using Zip64 (4gb+ file size).", callback);
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
								entry.getData = function(callback, callbackProgress) {
									getData(entry, callback, callbackProgress);
								};
							})(entry);
							entries.push(entry);
							index += 46 + entry.extraLength + entry.filenameLength;
						}
						callback(entries);
					});
				});
			},
			close : function(callback) {
				worker.terminate();
				callback();
			}
		};
	}

	// WRITER

	function crc32(data) {
		var i, crc = -1, table = [ 0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230,
				2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753,
				2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332,
				2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759,
				2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930,
				2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253,
				3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368,
				4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323,
				4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462,
				3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913,
				3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068,
				1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743,
				2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626,
				1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381,
				1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408,
				1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403,
				1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622,
				213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001,
				414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612,
				956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863,
				817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746,
				711928724, 3020668471, 3272380065, 1510334235, 755167117 ];
		if (data.length) {
			for (i = 0; i < data.length; i++)
				crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
			return crc ^ (-1);
		}
		return 0;
	}

	function encodeUTF8(argString) {
		// Encodes an ISO-8859-1 string to UTF-8
		// 
		// version: 1107.2516
		// discuss at: http://phpjs.org/functions/encodeUTF8
		// + original by: Webtoolkit.info (http://www.webtoolkit.info/)
		// + improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// + improved by: sowberry
		// + tweaked by: Jack
		// + bugfixed by: Onno Marsman
		// + improved by: Yves Sucaet
		// + bugfixed by: Onno Marsman
		// + bugfixed by: Ulrich
		// + bugfixed by: Rafal Kukawski
		// * example 1: encodeUTF8('Kevin van Zonneveld');
		// * returns 1: 'Kevin van Zonneveld'
		if (argString === null || typeof argString === "undefined") {
			return "";
		}

		var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
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
		var worker = new Worker(WORKER_SCRIPTS_PATH + "deflate.js"), writer, files = [], filenames = [], datalength = 0;

		function writeDataBuffer(dataBuffer, callback) {
			var blobBuilder;
			if (writer) {
				blobBuilder = new (WebKitBlobBuilder || MozBlobBuilder || BlobBuilder)();
				blobBuilder.append(dataBuffer);
				writer.onwrite = callback;
				writer.onerror = callback;
				writer.write(blobBuilder.getBlob());
			} else
				file.createWriter(function(fileWriter) {
					writer = fileWriter;
					writeDataBuffer(dataBuffer, callback);
				});
		}

		return {
			add : function(name, uncompressedData, options, callback, callbackProgress) {
				function deflate(data, level, callback) {
					function onmessage(event) {
						var message = event.data;
						if (message.progress && callbackProgress)
							callbackProgress(message.current, message.total);
						if (message.end) {
							worker.removeEventListener("message", onmessage, false);
							callback(message.data);
						}
					}

					worker.addEventListener("message", onmessage, false);
					worker.postMessage({
						deflate : true,
						data : data,
						level : level
					});
				}

				function writeFile(fileData) {
					var date = new Date(), filename = encodeUTF8(name), header = getDataHelper(26), data = getDataHelper(30 + filename.length + fileData.length);
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
					header.view.setUint32(10, crc32(uncompressedData), true);
					header.view.setUint32(14, fileData.length, true);
					header.view.setUint32(18, uncompressedData.length, true);
					header.view.setUint16(22, filename.length, true);
					data.view.setUint32(0, 0x504b0304);
					data.array.set(header.array, 4);
					data.array.set(getBytes(filename), 30);
					data.array.set(fileData, 30 + filename.length);
					writeDataBuffer(data.buffer, callback);
					datalength += data.buffer.byteLength;
				}

				name = name.trim();
				if (files[name])
					throw name + " already exists";
				options = options || {};
				if (dontDeflate)
					writeFile(uncompressedData);
				else
					deflate(uncompressedData, options.level, writeFile);
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
				writeDataBuffer(data.buffer, callback);
				worker.terminate();
			}
		};
	}

	obj.zip = {
		createReader : createZipReader,
		createWriter : createZipWriter
	};

})(window);