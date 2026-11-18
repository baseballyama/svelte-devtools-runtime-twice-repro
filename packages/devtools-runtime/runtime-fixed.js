import { listen } from 'svelte/internal/devtools';

const copies = (globalThis.__repro ??= { copies: [] }).copies;
const me = { url: import.meta.url, events: 0 };
copies.push(me);

// Fix: only the first evaluation owns the state and subscribes.
// Later copies reuse it instead of replacing the listener.
const shared = (globalThis.__my_devtools ??= { owner: me });
if (shared.owner === me) {
	listen({
		name: 'my-devtools',
		componentCreated() {
			shared.owner.events++;
		}
	});
}
