// Shows how many times the devtools runtime was evaluated,
// and how many `componentCreated` events each copy received.
export function render_result(name, target) {
	const { copies } = globalThis.__repro;

	// copy #1 is the one imported by the app's own components (src/*.svelte)
	const status =
		copies.length === 1
			? 'OK: the runtime was evaluated once.'
			: copies[0].events > 0
				? `OK: the runtime was evaluated ${copies.length} times, but copy #1 still receives the events.`
				: `BROKEN: the runtime was evaluated ${copies.length} times, and copy #1 receives no events.`;

	target.innerHTML = `
		<h2>case: ${name}</h2>
		<p><b>${status}</b></p>
		<table border="1" cellpadding="4">
			<tr><th>#</th><th>loaded from</th><th>componentCreated events received</th></tr>
			${copies
				.map((c, i) => `<tr><td>${i + 1}</td><td><code>${c.url}</code></td><td>${c.events}</td></tr>`)
				.join('')}
		</table>`;
	console.table(copies);
}
