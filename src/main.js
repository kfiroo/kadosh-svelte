import './firebase'
import App from './App.svelte';
import {stats} from './stores/statsStore'

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;