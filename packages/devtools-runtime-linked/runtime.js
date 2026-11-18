import { listen } from 'svelte/internal/devtools';

// Each evaluation of this module registers itself here.
const copies = ((globalThis.__repro ??= { copies: [] }).copies);
const me = { url: import.meta.url, events: 0 };
copies.push(me);

// Module-level state + a listener, like a real devtools runtime.
// `listen` replaces an existing plugin with the same name.
listen({
	name: 'my-devtools',
	componentCreated() {
		me.events++;
	}
});
