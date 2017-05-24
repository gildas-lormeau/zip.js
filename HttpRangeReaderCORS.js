(function() {
    var ERR_HTTP_RANGE = "HTTP Range not supported.";

    window.zip = window.zip || {};
    window.zip.fs = window.zip.fs || {};

    window.zip.fs.initCORSProxyServer = function(allowedOrigin){


        //respond to events
        window.addEventListener('message',function(event) {
            if(event.origin !== allowedOrigin) {
                console.log("Error: message receive from unauthorized origin "+event.origin);
                return;
            }

            var msg = event.data;
            function onError(){
                event.source.postMessage({
                    response:'onerror',
                    error:ERR_HTTP_RANGE,
                    id:msg.id
                },event.origin);
            }

            function readArrayBuffer(callback) {
                var request = new XMLHttpRequest();
                request.open("GET", msg.url);
                request.responseType = "arraybuffer";
                request.setRequestHeader("Range", "bytes=" + msg.index + "-" + (msg.index + msg.length - 1));
                request.addEventListener("load", function() {
                    callback(request.response);
                }, false);
                request.addEventListener("error", onError, false);
                request.send();
            }

            switch (msg.method){
                case "init":
                    var request = new XMLHttpRequest();

                    request.addEventListener("load", function() {
                        if (request.getResponseHeader("Accept-Ranges") == "bytes"){
                            event.source.postMessage({
                                response:'callback',
                                size:Number(request.getResponseHeader("Content-Length")),
                                id:msg.id
                            },event.origin);
                        } else {
                            onError();
                        }
                    }, false);
                    request.addEventListener("error", onError, false);
                    request.open("HEAD", msg.url);
                    request.send();
                    break;


                case "readUint8Array":
                    readArrayBuffer(function(arraybuffer) {
                        event.source.postMessage({
                            response:'callback',
                            buffer:arraybuffer,
                            id:msg.id
                        },event.origin,[arraybuffer]);

                    });
                    break;
                default:
                    console.log("ERROR:unknown method "+msg.method);
            }



        },false);
    };

    var nextDownloadId=1;
    var currentMessages={};

    var CORSProxyClientInitialized =false;
    function initCORSProxyClient(){
        if (CORSProxyClientInitialized ) return;
        CORSProxyClientInitialized = true;
        window.addEventListener('message',function(event) {
            var msg = event.data;
            if(
                !msg.id ||
                !currentMessages[msg.id] ||
                event.origin !== currentMessages[msg.id].foreignSiteProxyURL.substring(0,event.origin.length)
                ) {
                console.log("Error: message receive from unauthorized origin "+event.origin);
                return false;
            }

            console.log('response received:  ' + JSON.stringify(msg));

            switch (msg.response){
                case "callback":
                    currentMessages[msg.id].callback(msg);
                    break;
                case "onerror":
                    currentMessages[msg.id].onerror(msg.error);
                    break;
                default:
                    console.log("ERROR:unknown response "+msg.response);
            }

            event.preventDefault();
            event.stopPropagation();
            return false;

        },false);

    }

    function HttpRangeReaderCORS(foreignSiteProxyURL,url) {
        initCORSProxyClient();
        this.corsProxyServer=null;
        var self = this;
        function init(callback, onerror) {

            var frame = document.getElementById("cors-proxy-server");
            if (!frame){
                frame = document.createElement("iframe");
                frame.setAttribute("src",foreignSiteProxyURL);
                frame.setAttribute("id","cors-proxy-server");
               // frame.setAttribute("style","display:none");
                document.body.appendChild(frame);
                frame.addEventListener('load',function(){
                    self.corsProxyServer = frame.contentWindow;
                    frame.setAttribute("ready","yes");
                });

            } else {
                if (frame.getAttribute("ready") == "yes"){
                    self.corsProxyServer = frame.contentWindow;
                }


            }

            function initDownloadInstance(){
                var id = nextDownloadId;
                nextDownloadId++;
                
                currentMessages[id ] = {
                    id: id,
                    callback: function(response){
                        self.size=response.size;
                        delete currentMessages[id];
                        callback();
                    },
                    onerror : function(err){
                        delete currentMessages[id];
                        onerror(err);
                    },
                    foreignSiteProxyURL:foreignSiteProxyURL
                };


                var msg = {
                    method: "init",
                    url: url,
                    id: id
                };
               
                self.corsProxyServer.postMessage(msg, foreignSiteProxyURL);
                

            }

            if (self.corsProxyServer){
                initDownloadInstance();
            } else {
                setTimeout(function(){
                    self.init(callback,onerror);
                },10);
            }

        }


        function readUint8Array(index, length, callback, onerror) {
            var id = nextDownloadId;
            nextDownloadId++;

            currentMessages[id ] = {
                id: id,
                callback: function(response){

                    delete currentMessages[id];
                    callback(new Uint8Array(response.buffer));
                },
                onerror : function(err){
                    delete currentMessages[id];
                    onerror(err);
                },
                foreignSiteProxyURL:foreignSiteProxyURL
            };


            var msg = {
                method: "readUint8Array",
                url: url,
                id: id ,
                foreignSiteProxyURL:foreignSiteProxyURL,
                index: index,
                length: length
            };

            self.corsProxyServer.postMessage(msg, foreignSiteProxyURL);
        }

        this.size = 0;
        this.init = init;
        this.readUint8Array = readUint8Array;

    }
    HttpRangeReaderCORS.prototype = new zip.Reader();
    HttpRangeReaderCORS.prototype.constructor = HttpRangeReaderCORS;

    zip.fs.ZipDirectoryEntry.prototype.importHttpContentCORS = function(foreignSiteProxyURL,foreignSiteURL,  onend, onerror) {
        this.importZip(new HttpRangeReaderCORS(foreignSiteProxyURL,foreignSiteURL), onend, onerror);
    };

    zip.fs.FS.prototype.importHttpContentCORS = function(foreignSiteProxyURL,foreignSiteURL, useRangeHeader, onend, onerror) {
        this.entries = [];
        this.root = new zip.fs.ZipDirectoryEntry(this);
        this.root.importHttpContentCORS(foreignSiteProxyURL,foreignSiteURL, useRangeHeader, onend, onerror);
    };



})();
