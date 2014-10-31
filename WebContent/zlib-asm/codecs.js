/// wrapper for zlib-asm (https://github.com/ukyo/zlib-asm)

(function(obj) {
	function Codec(isDeflater, options) {
		this._isDeflater = isDeflater;
		if (options && typeof options.level === 'number')
			this.level = options.level;
		this._inputLength = 0;
		this._input = [];
	}
	Codec.prototype.append = function append(bytes, onprogress) {
		this._inputLength += bytes.length;
		this._input.push(bytes);
	};
	Codec.prototype.flush = function flush() {
		var bytes;
		var input = this._input;
		if (input.length === 1)
			bytes = input[0];
		else {
			bytes = new Uint8Array(this._inputLength);
			for (var i = 0, n = input.length, off = 0; i < n; i++) {
				var slice = input[i];
				bytes.set(slice, off);
				off += slice.length;
			}
		}
		return this._isDeflater ?
			zlib.rawDeflate(bytes, this.level) :
			zlib.rawInflate(bytes);
	};

	function Deflater(options) {
		Codec.call(this, true, options);
	}
	Deflater.prototype = Object.create(Codec.prototype);
	function Inflater() {
		Codec.call(this, false);
	}
	Inflater.prototype = Object.create(Codec.prototype);

	if (obj.zip) {// in main doc
		obj.zip.Deflater = Deflater;
		obj.zip.Inflater = Inflater;
	} else {// in z-worker
		obj.Deflater = Deflater;
		obj.Inflater = Inflater;
	}
})(this);