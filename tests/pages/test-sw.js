/* eslint-disable no-console */
/* global document navigator, fetch, location, history */

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";

"use strict";

test().catch(error => console.error(error));

async function test() {
	document.body.innerHTML = "...";
	if (!location.search) {
		await navigator.serviceWorker.register("./test-sw-worker.js");
		await navigator.serviceWorker.ready;
		location.search = "?reload";
	} else if (location.search == "?reload") {
		const response = await fetch("./../data/lorem.zip#lorem.txt");
		const result = await response.text();
		const registrations = await navigator.serviceWorker.getRegistrations();
		registrations.forEach(registration => registration.unregister());
		if (TEXT_CONTENT == result) {
			location.search = "?done";
		}
	} else if (location.search == "?done") {
		document.body.innerHTML = "ok";
		history.replaceState(null, null, location.href.split("?done")[0]);
	}
}