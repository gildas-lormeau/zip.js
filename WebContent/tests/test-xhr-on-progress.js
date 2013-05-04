var testXhrOnProgress = (function () {

    /**
     * opts:
     *  maxEntries - Limit the number of entries passed to onEntryData.
     *  onEntryData - Callback for entry data. Args [entry, data].
     *  progressListener - Callback for XHR progress. Args [evt], where evt is defined here "http://www.w3.org/TR/progress-events/#interface-progressevent".
     */

    function download(url, opts) {
        opts = opts || {};
        opts.maxEntries = +opts.maxEntries;

        var httpReader = new zip.HttpReader(url);

        if ("function" === typeof opts.progressListener) {
            httpReader.addProgressListener(opts.progressListener);
        }

        function handleEntries(entries) {
            var count = 0;
            entries.forEach(function (entry) {
                if (entry.directory || count >= opts.maxEntries) {
                    return;
                }
                count++;
                // get entry content as text
                entry.getData(new zip.TextWriter("UTF-8"), function (data) {
                    opts.onEntryData(entry, data);
                }, function (current, total) {
                    // onprogress callback
                    //console.log("onprogress", entry.filename, current, " of ", total);
                });
            });
        }

        // use a BlobReader to read the zip from a Blob object
        zip.createReader(httpReader, function (reader) {
            try {
                // get all entries from the zip
                reader.getEntries(handleEntries);
            } finally {
                // close the zip reader
                reader.close(function () {
                    //onclose callback
                    console.log("closed");
                });
            }
        }, function (error) {
            // onerror callback
            console.log("error", error);
        });
    }

    function setupUi(parentEl, url) {
        var entryContents = window["entryContents"] = {};

        function createOpts() {
            var opts = {};

            opts.maxEntries = 20;

            opts.onEntryData = function (entry, data) {
                console.log(entry.filename, entry.lastModDate);
                entryContents[entry.filename] = data;
                addTab(entry.filename);
            };

            opts.progressListener = (function () {
                // report after each 10%
                var reportingThreshold = 0.1;
                var nextReportAt = 0;
                return function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        if (percentComplete < nextReportAt) {
                            return;
                        }
                        console.log(evt, percentComplete);

                        // update the new report value
                        nextReportAt = Math.min(1.0, nextReportAt + reportingThreshold);

                        var str = "" + (percentComplete * 100);
                        str = str.substring(0, 5) + "%";
                        parentEl.find("#downloadProgress").html(str);
                    }
                };
            }());

            return opts;
        }

        function addTab(name) {
            var displayName = name;
            var idx = displayName.lastIndexOf("/");
            if (idx > -1) {
                displayName = displayName.substring(idx + 1);
            }
            var tab = $("<span>").attr("data-content-id", name);
            var a = $("<a>").html(displayName).attr("href", "#");
            tab.append(a);
            parentEl.find("#tabs").append(tab).append(" ");
        }

        parentEl.find("button").click(function () {
            // init
            entryContents = window["entryContents"] = {};

            var url = $("#downloadUrl").val();
            download(url, createOpts());
        });

        parentEl.find("#tabs").on("click", "a", function (evt) {
            evt.stopPropagation();
            var id = $(evt.target).closest("[data-content-id]").attr("data-content-id");
            console.log(evt, id);
            parentEl.find("#entryName").html(id);
            parentEl.find("#content").val(entryContents[id]);
        });

        parentEl.find("#downloadUrl").val(url);
    }

    return {
        setupUi: setupUi
    };

}());