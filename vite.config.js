import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';

// What we pass to `experimental.devtools` in each case
const specifiers = {
	// an absolute path to a file outside node_modules
	abs: path.resolve('packages/devtools-runtime/runtime.js'),
	// a bare specifier of a package installed in node_modules (pre-bundled by Vite)
	bare: 'devtools-runtime/runtime.js',
	// a bare specifier of a linked package (like `workspace:*`, not pre-bundled)
	linked: 'devtools-runtime-linked/runtime.js',
	// same as `abs`, but the runtime keeps its state on globalThis
	'abs-fixed': path.resolve('packages/devtools-runtime/runtime-fixed.js')
};

const devtools = specifiers[process.env.CASE ?? 'abs'];
console.log(`\n  experimental.devtools = ['${devtools}']\n`);

export default defineConfig({
	define: { __CASE__: JSON.stringify(process.env.CASE ?? 'abs') },
	plugins: [svelte({ compilerOptions: { experimental: { devtools: [devtools] } } })]
});
