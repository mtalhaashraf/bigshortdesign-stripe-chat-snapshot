import { writable } from 'svelte/store';
import { browser } from '$app/env';

export const history = writable(browser && (JSON.parse(localStorage.getItem('history')) || []));

export const setHistory = (path) => {
	history.set();
	if (data) localStorage.setItem('user', JSON.stringify(data));
	else localStorage.removeItem('user');
};
