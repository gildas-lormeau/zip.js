/* global navigator, fetch, location, history */

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";

export { test };

async function test() {
	if (!location.search) {
		await registerServiceWorker();
		location.search = "?service-worker-registered";
	} else if (location.search == "?service-worker-registered") {
		let result;
		try {
			const response = await fetch("../data/lorem.zip#lorem.txt");
			result = await response.text();
			await unregisterServiceWorker();
		} catch (_error) {
			resetSearch();
			throw new Error();
		}
		if (TEXT_CONTENT == result) {
			location.search = "?test-ok";
		} else {
			resetSearch();
			throw new Error();
		}
	} else if (location.search == "?test-ok") {
		resetSearch();
		return true;
	}
}

function resetSearch() {
	history.replaceState(null, null, location.href.split("?")[0] + location.hash);
}

async function registerServiceWorker() {
	await navigator.serviceWorker.register("test-sw-worker.js");
	await navigator.serviceWorker.ready;
}

async function unregisterServiceWorker() {
	const registrations = await navigator.serviceWorker.getRegistrations();
	await Promise.all(registrations.map(registration => registration.unregister()));
}