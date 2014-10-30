(function main() {
	addEventListener("message", function(event) {
		var message = event.data, type = message.type, sn = message.sn;
		var handler = handlers[type];
		if (handler) {
			try {
				handler(message);
			} catch (e) {
				onError(type, sn, e);
			}
		}
		//for debug
		//postMessage({type: 'echo', originalType: type, sn: sn});
	});

	var handlers = {
		importScripts: doImportScripts,
		newTask: newTask,
		append: append,
		flush: flush,
	};

	// deflater/inflater objs indexed by serial numbers of tasks
	var codecs = {};

	function doImportScripts(msg) {
		if (msg.scripts && msg.scripts.length > 0)
			importScripts.apply(undefined, msg.scripts);
		postMessage({type: 'importScripts'});
	}

	function newTask(msg) {
		var CodecClass = self[msg.codecClass];
		var sn = msg.sn;
		if (codecs[sn])
			throw Error('duplicated sn');
		codecs[sn] = new CodecClass(msg.options);
		postMessage({type: 'newTask', sn: sn});
	}

	function append(msg) {
		var sn = msg.sn;
		var codec = codecs[sn];
		// allow creating codec on first append
		if (!codec && msg.codecClass) {
			newTask(msg);
			codec = codecs[sn];
		}
		process(msg.type, sn, function () {
			return codec.append(msg.data, function onprogress(loaded) {
				postMessage({type: 'progress', sn: sn, loaded: loaded});
			});
		});
	}

	function flush(msg) {
		var sn = msg.sn;
		var codec = codecs[sn];
		delete codecs[sn];
		process(msg.type, sn, codec.flush.bind(codec));
	}

	var timer = self.performance || Date; //performance may be not supported

	function process(type, sn, action) {
		var start = timer.now();
		var data = action();
		var msg = {type: type, sn: sn, time: timer.now() - start};
		var args = [msg];
		if (data) {
			msg.data = data;
			args[1] = [data.buffer];
		}
		postMessage.apply(undefined, args);
	}

	function onError(type, sn, e) {
		var msg = {
			type: type,
			sn: sn,
			error: formatError(e)
		};
		postMessage(msg);
	}

	function formatError(e) {
		return { message: e.message, stack: e.stack };
	}
})();