import { error, json } from '@sveltejs/kit';
import {
	andThen,
	assoc,
	complement,
	curry,
	identity,
	isEmpty,
	otherwise,
	pipe,
	prop,
	__
} from 'ramda';

const useJSONResponse = (status, jsondata) => json(jsondata, { status });

const useError = (status, message) => {
	throw error(status, message);
};

const useServerError = (e) => {
	console.log(e);
	return useError(e?.status || 500, e?.message || 'Server error');
};

const useRequestBody = (request) => request.json();

const getHandler = curry((req, fn) => pipe(otherwise(useServerError), andThen(identity))(fn(req)));

const postHandler = curry((req, fn) =>
	pipe(
		prop('request'),
		useRequestBody,
		andThen(pipe(assoc('data', __, req), fn, otherwise(useServerError), andThen(identity))),
		otherwise(pipe(() => req, fn, otherwise(useServerError), andThen(identity)))
	)(req)
);

const getIpAddress = async () => {
	try {
		let ipAddress;
		ipAddress = localStorage.getItem('ipAddress') || '';

		if (isEmpty(ipAddress)) {
			const { ip } = await fetch('https://api.ipify.org/?format=json', {
				method: 'GET'
			}).then((res) => res.json());

			ipAddress = ip;
			localStorage.setItem('ipAddress', ip);
		}

		return ipAddress;
	} catch (error) {
		console.log(error);
		return null;
	}
	return null;
};

export { getHandler, postHandler, useError, useJSONResponse, useServerError, getIpAddress };
