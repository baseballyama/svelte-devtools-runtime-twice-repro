import { mount } from 'svelte';
import App from './App.svelte';
import { render_result } from './result.js';

mount(App, { target: document.getElementById('app') });
render_result(__CASE__, document.getElementById('result'));
