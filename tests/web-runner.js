/* global document */

import tests from "./tests-data.js";

const table = document.createElement("table");
tests.forEach(test => {
	const row = document.createElement("tr");
	const cellTest = document.createElement("td");
	const cellLink = document.createElement("td");
	const iframe = document.createElement("iframe");
	const link = document.createElement("a");
	link.textContent = test.title;
	link.target = test.script;
	iframe.dataset.script = test.script;
	link.href = iframe.src = (test.env || "all") + "/loader.html#" + encodeURIComponent(JSON.stringify({ script: test.script }));
	cellTest.appendChild(iframe);
	cellLink.appendChild(link);
	row.appendChild(cellLink);
	row.appendChild(cellTest);
	table.appendChild(row);
});
document.body.appendChild(table);