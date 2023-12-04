<script>
	import Highcharts from 'highcharts/highstock.js';
	import moment from 'moment-timezone';
	import { onDestroy, onMount } from 'svelte';
	import { createChartConfig } from '../smartFlowConfig.js';

	import ModelLayout from '../../../shared/ModelLayout.svelte';

	import * as df from 'date-fns';
	import indicatorsAll from 'highcharts/indicators/indicators-all.js';
	import annotationsAdvanced from 'highcharts/modules/annotations-advanced.js';
	import fullScreen from 'highcharts/modules/full-screen.js';
	import priceIndicator from 'highcharts/modules/price-indicator.js';
	import { Wave } from 'svelte-loading-spinners';
	// import '../lib/DatePickerX.min.css';
	let zoomed = false;
	let showDetails = false;
	let chart;
	let socket;
	let historical = false;
	let rth = true;
	let scale = true;
	let height = '100%';
	let lastUpdated;
	let currentPrice = 0;
	let circleAction = 'neutral';

	// let displaySymbol = 'QQQ';
	// let symbol = 'QQQ';
	let displaySymbol = null;
	let symbol = null;
	let placeholderSymbol = null;
	let inputSymbol = '';

	let interval = '5m';

	let loaded = false;
	let firstLoad = false;
	let historicalLoad = false;
	let checkNonDataDays = 5;

	let chartConfig;
	let currentSmartFlow = 0;
	let currentSFTally = 0;

	let secondaryFive = { action: '', color: 'black' };
	let five = { action: '', color: 'black' };
	let secondaryUpdate = { action: '', color: 'black' };
	let update = { action: '', color: 'black' };

	let prevClose = null;
	let prevSmartFlow = null;
	let marketClose = null;
	let yesterdayClose = null;
	let priceChange = 0;
	let allPriceChange = 0;

	const today = new Date();
	// const today = new Date(2022, 7, 10);
	let currentDate = today;
	let minDate = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	let maxDate = null;
	let optionsFlowDesc = [];

	let chartSettings = {
		optionsVol: true,
		optionsFlow: true,
		vol: false,
		dp: true
	};

	let optionsFlowDescCounter = 0;

	let sfThreshold = null;
	let manipulationThreshold = null;

	const sfCollection = 'smartFlowLive';
	const ofCollection = 'optionsFlowLive';
	// const sfCollection = 'smartFlowLiveTest';
	// const ofCollection = 'optionsFlowLiveTest';

	let indicatorOptions, storedTheme;

	const actionCodes = {
		'0': 'Neutral. ',
		'1': 'Momo Buying. ',
		'2': 'Momo Selling. ',
		'3': 'Smart Money Buying. ',
		'4': 'Smart Money Selling. ',
		'5': 'Smart Money Retreating.',
		'6': 'Smart Money Holding Firm.'
	};

	const actionColorCodes = {
		'0': 'inherit',
		'1': 'green',
		'2': 'red',
		'3': 'lightblue',
		'4': 'pink'
	};

	const getDisplayDate = (dateToFormat) => {
		dateToFormat = new Date(dateToFormat);
		const year = dateToFormat.getFullYear();
		let month = dateToFormat.getMonth() + 1;
		let day = dateToFormat.getDate();

		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		return `${year}-${month}-${day}`;
	};

	let displayDate = getDisplayDate(today);

	onMount(async () => {
		Highcharts.setOptions({
			lang: {
				thousandsSep: ','
			}
		});
		lastUpdated = new Proxy(
			{},
			{
				set: (target, property, value) => {
					target[property] = value;
					if (property === 'tradeTS') {
						target['time'] = df.format(target['dateTime'], 'hh:mm:ss aaa');
						let tradeDateTime = df.fromUnixTime(target['tradeTS'] / 1000);
						// let tradeDateTime = new Date();
						let tradeDateTimeUTC = new Date(
							tradeDateTime.getUTCFullYear(),
							tradeDateTime.getUTCMonth(),
							tradeDateTime.getUTCDate(),
							tradeDateTime.getUTCHours(),
							tradeDateTime.getUTCMinutes(),
							tradeDateTime.getUTCSeconds()
						);
						let tradeTime = Number(df.format(tradeDateTimeUTC, 'HHmmss'));
						let startTime = 150500;
						let endTime = 151000;

						// let startTime = 163500;
						// let endTime = 164000;
						if (tradeTime >= startTime && tradeTime < endTime && !target['playedAudio']) {
							const audio = new Audio('/assets/media/powerhour.ogg');
							audio.volume = 0.75;
							audio.play();
							target['playedAudio'] = true;
						}

						if (tradeTime >= endTime) {
							target['playedAudio'] = false;
						}
					}
					return true;
				}
			}
		);

		lastUpdated.dateTime = new Date();

		indicatorOptions = localStorage.getItem('indicators');
		chartSettings = localStorage.getItem('chartSettingsSF');
		let storedSymbol = localStorage.getItem('symbol');
		symbol = storedSymbol || symbol;
		displaySymbol = symbol;
		placeholderSymbol = symbol;
		localStorage.removeItem('symbol');
		if (!chartSettings) {
			chartSettings = {
				optionsVol: true,
				optionsFlow: true,
				vol: false,
				dp: true
			};
			localStorage.setItem('chartSettingsSF', JSON.stringify(chartSettings));
		} else {
			chartSettings = JSON.parse(chartSettings);
		}
		// chartConfig = createChartConfig();
		if (!indicatorOptions) {
			indicatorOptions = {
				bb: {
					enabled: false,
					params: {
						period: 20,
						standardDeviation: 2
					}
				}
			};
		} else {
			indicatorOptions = JSON.parse(indicatorOptions);
		}

		document.addEventListener('visibilitychange', function () {
			if (window.innerWidth <= 991) {
				if (!document.hidden) {
					window.location.reload(true);
				} else {
					localStorage.setItem('symbol', symbol);
					socket.close();
					socket = null;
				}
			}
		});
		indicatorsAll(Highcharts);
		annotationsAdvanced(Highcharts);
		priceIndicator(Highcharts);
		fullScreen(Highcharts);

		// socket = new WebSocket('ws://159.203.110.167:9001'); // tape runner server
		socket = new WebSocket('ws://167.172.231.78:9001'); // live
		// socket = new WebSocket('ws://localhost:9001');
		prettifyUrl();

		socket.onopen = () => {
			console.log('CONNECTED');
			socket.send(
				JSON.stringify({
					action: 'live',
					symbol: `e${symbol}`,
					date: minDate,
					ofCollection: ofCollection,
					sfCollection: sfCollection,
					subscribe: true,
					timeFrame: interval
				})
			);
		};

		socket.onmessage = (e) => {
			let data = JSON.parse(e.data);
			// console.log(data);
			if (data.action && data.action === 'historical' && !data.data[0].length) {
				if (!checkNonDataDays) {
					alert('There is no data for this symbol/date combination');
					firstLoad = true;
					displaySymbol = symbol;
					placeholderSymbol = symbol;
					prettifyUrl();
				} else {
					checkNonDataDays--;
					displayDate = getDisplayDate(minDate);
					minDate = df.subBusinessDays(minDate, 1);
					currentDate = minDate;
					socket.send(
						JSON.stringify({
							action: 'live',
							symbol: `e${symbol}`,
							timeFrame: interval,
							date: minDate,
							ofCollection: ofCollection,
							sfCollection: sfCollection,
							subscribe: currentDate === today
						})
					);
				}
			}

			if (!loaded && firstLoad && today === currentDate) {
				organizeSmartFlow(data);
				checkNonDataDays = 5;
				displaySymbol = symbol;
				placeholderSymbol = symbol;
				prettifyUrl();
			}

			if (!loaded && data.action && data.action === 'historical' && data.data[0].length > 0) {
				checkNonDataDays = 5;
				historicalLoad = true;
				displaySymbol = symbol;
				placeholderSymbol = symbol;
				sfThreshold = data.data[8] || 0;
				manipulationThreshold = data.data[9] || 0;
				prettifyUrl();
				organizeSmartFlow(data.data);
			} else if (data.action === 'historical') {
				return;
			} else {
				checkNonDataDays = 5;
				if (loaded && data[0].length) {
					addPoint(data);
				}
			}
		};

		// document.getElementById('datepicker').DatePickerX.init({
		//   format: "yyyymmdd",
		// });

		if (window && window.addEventListener) {
			height = window.innerHeight - 160;
		}

		window.addEventListener('resize', () => {
			height = window.innerHeight - 160;
			if (chart && chart.options && chart.options.chart) {
				chart.options.chart.height = height;
				chart.reflow();
			}
		});

		const graphs = window.document.querySelectorAll('.top');
		let trackingInterval = null;
		let lastResize = null;
		let widthValueHolder = '100%';
		let heightValueHolder = '100%';
		const myObserver = new ResizeObserver((entries) => {
			lastResize = Date.now();
			if (!trackingInterval) {
				trackingInterval = setInterval(() => {
					if (Date.now() - lastResize >= 25) {
						clearInterval(trackingInterval);
						trackingInterval = null;
						lastResize = null;
						if (chart) {
							chart.update({
								width: widthValueHolder,
								height: heightValueHolder
							});
							chart.reflow();
							widthValueHolder = '100%';
							heightValueHolder = '100%';
						}
					}
				}, 1);
			}
			widthValueHolder = '100%';
			heightValueHolder = '100%';
			for (let entry of entries) {
				widthValueHolder = entry.contentRect.width;
				heightValueHolder = entry.contentRect.height;
			}
		});

		graphs.forEach((graph) => {
			myObserver.observe(graph);
		});
	});

	const prettifyUrl = () => {
		let url = window.location.href;
		url = url.split('/');
		if (url.length === 4) {
			if (!symbol) {
				symbol = 'SPY';
			}
			url.push(symbol);
		} else {
			if (!symbol) {
				symbol = url[4];
			} else {
				url[4] = symbol;
			}
		}
		url = url.join('/');
		window.history.pushState('', symbol, url);
		displaySymbol = symbol;
	};

	const getTally = (smartFlow) => {
		let rthTally = 0;
		let totalTally = 0;
		let tallySeed = [];
		for (let i = 0; i < smartFlow.length; i++) {
			if (
				Number(moment.utc(smartFlow[i].x).format('HHmm')) >= 935 &&
				Number(moment.utc(smartFlow[i].x).format('HHmm')) <= 1600
			) {
				rthTally += smartFlow[i].y;
			} else {
				rthTally = 0;
			}
			totalTally += smartFlow[i].y;
			tallySeed.push([smartFlow[i].x, rth ? rthTally : totalTally]);
		}
		return tallySeed;
	};

	const getSmartFlowColor = (smartFlow, ohlc) => {
		let color = 'grey';
		if (Number(smartFlow[1]) < 0) {
			if (ohlc[4] < ohlc[1]) {
				color = 'red';
			} else if (ohlc[4] > ohlc[1]) {
				color = 'lightgreen';
			}
		} else if (Number(smartFlow[1]) > 0) {
			if (ohlc[4] < ohlc[1]) {
				color = 'pink';
			} else if (ohlc[4] > ohlc[1]) {
				color = 'green';
			}
		}
		return color;
	};

	const addPoint = (data) => {
		const extremes = chart.xAxis[0].getExtremes();
		const smartFlow = data[0];
		const ohlc = data[1];
		const actions = data[2];
		const putVol = data[3] || [];
		const callVol = data[4] || [];
		let optionsFlow = data[5] || [];
		let optionsFlowCopy = [...optionsFlow];

		const ohlcSeries = chartConfig.series[0].data;
		let tallySeries = chartConfig.series[1].data;
		const smartFlowSeries = chartConfig.series[2].data;
		const vwapLongSeries = chartConfig.series[3].data;
		const vwapShortSeries = chartConfig.series[4].data;
		const volumeSeries = chartConfig.series[5].data;
		const netStrengthBarSeries = chartConfig.series[6].data;
		let dpSeries = chartConfig.series[7].data;
		const callVolSeries = chartConfig.series[8].data;
		const putVolSeries = chartConfig.series[9].data;
		const unusualCallPremSeries = chartConfig.series[10].data;
		const unusualPutPremSeries = chartConfig.series[11].data;

		const resizedDpSeries = [];
		let maxDPVolume = 0;
		let prevOHLC = ohlcSeries[ohlcSeries.length - 1];
		let ofHistogram = {
			blockC: 0,
			sweepC: 0,
			splitC: 0,
			blockP: 0,
			sweepP: 0,
			splitP: 0
		};

		for (let i = 0; i < dpSeries.length; i++) {
			maxDPVolume = dpSeries[i].volume > maxDPVolume ? dpSeries[i].volume : maxDPVolume;
		}

		if (!historicalLoad) {
			prevOHLC = ohlcSeries.pop();
			tallySeries.pop();
			volumeSeries.pop();
			vwapLongSeries.pop();
			vwapShortSeries.pop();
			smartFlowSeries.pop();
			netStrengthBarSeries.pop();
			dpSeries.pop();

			if (putVol.length) {
				callVolSeries.pop();
				putVolSeries.pop();
			}

			if (optionsFlow.length > 1) {
				unusualCallPremSeries.pop();
				unusualPutPremSeries.pop();
			}
			if (optionsFlow.length < optionsFlowDescCounter) {
				optionsFlowDescCounter = 0;
			}
		} else {
			historicalLoad = false;
			if (window.innerWidth <= 991) {
				chart.xAxis[0].setExtremes(extremes.min, smartFlow[smartFlow.length - 1][0]);
			}
		}

		for (let i = 0; i < smartFlow.length; i++) {
			if (interval === '1d') {
				smartFlow[i][0] -= 1000 * 60 * 60 * 24;
				ohlc[i][0] -= 1000 * 60 * 60 * 24;
				putVol[i][0] -= 1000 * 60 * 60 * 24;
				callVol[i][0] -= 1000 * 60 * 60 * 24;
			}

			let volColor = ohlc[i][1] < ohlc[i][4] ? 'green' : '#DC143C';

			if (!ohlc[i].length) {
				ohlc[i] = [smartFlow[i][0], prevOHLC.close, prevOHLC.close, prevOHLC.close, prevOHLC.close];
			}

			let color = getSmartFlowColor(smartFlow[i], ohlc[i]);

			ohlcSeries.push({
				x: ohlc[i][0],
				open: ohlc[i][1],
				high: ohlc[i][2],
				low: ohlc[i][3],
				close: ohlc[i][4],
				color: ohlc[i][4] > ohlc[i][1] ? 'green' : '#DC143C'
			});
			// smart flow data: [ts, smartflow, rth tally, total tally, short vwap, long vwap, netStrengthBar]

			smartFlowSeries.push({ x: smartFlow[i][0], y: Number(smartFlow[i][1]), color });
			// tallySeries.push([smartFlow[i][0], rth ? smartFlow[2] : smartFlow[3]]);
			tallySeries = [...getTally(smartFlowSeries)];
			// vwapShortSeries.push({x: smartFlow[i][0], y: Number(smartFlow[i][4])});
			// vwapLongSeries.push({x: smartFlow[i][0], y: Number(smartFlow[i][5])});
			volumeSeries.push({ x: ohlc[i][0], y: ohlc[i][5], color: volColor });

			netStrengthBarSeries.push([ohlc[i][0], smartFlow[i][6]]);

			if (smartFlow[i][8][2]) {
				dpSeries.push({
					x: smartFlow[i][0],
					y: smartFlow[i][8][2],
					volume: smartFlow[i][8][1],
					marker: {
						radius:
							(smartFlow[i][8][1] / maxDPVolume) * 6 >= 2
								? (smartFlow[i][8][1] / maxDPVolume) * 6
								: 2
					}
				});
			}

			currentSmartFlow = smartFlow[i][1];

			let unusualCallPrem = 0;
			let unusualPutPrem = 0;
			let uaCounter = 0;
			for (let j = 0; j < optionsFlow.length; j++) {
				if (optionsFlow[j][1] <= smartFlow[i][0]) {
					if (optionsFlow[j][4] === 'C') {
						unusualCallPrem += Number((optionsFlow[j][6] * optionsFlow[j][7] * 100).toFixed(0));
					} else {
						unusualPutPrem += Number((optionsFlow[j][6] * optionsFlow[j][7] * 100).toFixed(0));
					}
					uaCounter++;
				}
				if (optionsFlow[j][1] > smartFlow[i][0] || uaCounter === optionsFlow.length) {
					unusualCallPremSeries.push({ x: smartFlow[i][0], y: unusualCallPrem });
					unusualPutPremSeries.push({ x: smartFlow[i][0], y: unusualPutPrem });
					unusualCallPrem = 0;
					unusualPutPrem = 0;
					optionsFlow = optionsFlow.slice(uaCounter);
					break;
				}
			}
		}

		for (let i = optionsFlowDescCounter; i < optionsFlowCopy.length; i++) {
			let tradeDateTime = df.fromUnixTime(optionsFlowCopy[i][1] / 1000);
			let tradeDateTimeUTC = new Date(
				tradeDateTime.getUTCFullYear(),
				tradeDateTime.getUTCMonth(),
				tradeDateTime.getUTCDate(),
				tradeDateTime.getUTCHours(),
				tradeDateTime.getUTCMinutes(),
				tradeDateTime.getUTCSeconds()
			);
			if (optionsFlowCopy[i][4] === 'C') {
				optionsFlowDesc = [
					[
						'C',
						optionsFlowCopy[i][0],
						df.format(tradeDateTimeUTC, 'h:mm:ssaaa'),
						`${optionsFlowCopy[i][3].slice(2, 4)}/${optionsFlowCopy[i][3].slice(
							4,
							6
						)}/${optionsFlowCopy[i][3].slice(0, 2)}`,
						optionsFlowCopy[i][5],
						optionsFlowCopy[i][6],
						optionsFlowCopy[i][7],
						optionsFlowCopy[i][8]
					],
					...optionsFlowDesc
				];
			} else {
				optionsFlowDesc = [
					[
						'P',
						optionsFlowCopy[i][0],
						df.format(tradeDateTimeUTC, 'h:mm:ssaaa'),
						`${optionsFlowCopy[i][3].slice(2, 4)}/${optionsFlowCopy[i][3].slice(
							4,
							6
						)}/${optionsFlowCopy[i][3].slice(0, 2)}`,
						optionsFlowCopy[i][5],
						optionsFlowCopy[i][6],
						optionsFlowCopy[i][7],
						optionsFlowCopy[i][8]
					],
					...optionsFlowDesc
				];
			}
		}

		optionsFlowDescCounter = optionsFlowCopy.length;
		optionsFlowDesc = optionsFlowDesc.slice(0, 300);

		if (putVol && putVol.length) {
			for (let i = 0; i < putVol.length; i++) {
				if (putVol[i]) {
					putVolSeries.push(putVol[i]);
				}
			}
		}

		if (callVol && callVol.length) {
			for (let i = 0; i < callVol.length; i++) {
				if (callVol[i]) {
					callVolSeries.push(callVol[i]);
				}
			}
		}

		for (let i = 0; i < dpSeries.length; i++) {
			resizedDpSeries.push({
				x: dpSeries[i].x,
				y: dpSeries[i].y,
				volume: dpSeries[i].volume,
				marker: {
					radius:
						(dpSeries[i].volume / maxDPVolume) * 6 >= 2 ? (dpSeries[i].volume / maxDPVolume) * 6 : 2
				}
			});
		}

		// chartConfig.series[7].data = resizedDpSeries;
		chart.series[0].update({}, false);
		chart.series[1].update(
			{
				data: tallySeries
			},
			false
		);
		chart.series[2].update({}, false);
		// chart.series[3].update({}, false);
		// chart.series[4].update({}, false);
		chart.series[5].update({}, false);
		chart.series[6].update({}, false);
		chart.series[7].update(
			{
				data: resizedDpSeries
			},
			false
		);
		chart.series[8].update({}, false);
		chart.series[9].update({}, false);
		chart.series[10].update(
			{
				data: unusualCallPremSeries
			},
			false
		);
		chart.series[11].update(
			{
				data: unusualPutPremSeries
			},
			false
		);

		chart.series[12] && chart.series[12].update({}, false);
		if (smartFlow.length > 1) {
			const extremes = chart.xAxis[0].getExtremes();
			chart.xAxis[0].setExtremes(extremes.min, tallySeries.slice(-1)[0][0]);
		}

		chart.redraw();
		currentSFTally = (tallySeries.slice(-1)[0] && tallySeries.slice(-1)[0][1]) || 0;
		lastUpdated.dateTime = new Date();
		lastUpdated.tradeTS = smartFlow[smartFlow.length - 1][0];

		if (ohlc[ohlc.length - 1][4] && currentSmartFlow !== prevSmartFlow) {
			currentPrice = ohlc[ohlc.length - 1][4];

			circleAction = getCircleAction(
				smartFlow[smartFlow.length - 1][1],
				currentPrice,
				prevSmartFlow,
				prevClose
			);

			prevClose = currentPrice;
			if (yesterdayClose) {
				priceChange = (
					(((marketClose || currentPrice) - yesterdayClose) / yesterdayClose) *
					100
				).toFixed(2);
				allPriceChange = (((currentPrice - yesterdayClose) / yesterdayClose) * 100).toFixed(2);
			}
			prevSmartFlow = smartFlow[smartFlow.length - 1][1];
		}

		five = { action: actionCodes[actions.f[0]], color: actionColorCodes[actions.f[1]] };
		secondaryFive = { action: actionCodes[actions.sf[0]], color: actionColorCodes[actions.sf[1]] };
		update = { action: actionCodes[actions.u[0]], color: actionColorCodes[actions.u[1]] };
		secondaryUpdate = {
			action: actionCodes[actions.su[0]],
			color: actionColorCodes[actions.su[1]]
		};
	};

	const organizeSmartFlow = (data) => {
		chartConfig = createChartConfig(sfThreshold, manipulationThreshold, scale);
		optionsFlowDesc = [];
		let ohlcData = data[1];
		let smartFlowData = data[0];
		let actions = data[2];
		let putVolData = data[3] || [];
		let callVolData = data[4] || [];
		let optionsFlow = data[5] || [];
		yesterdayClose = data[6];
		marketClose = data[7];
		const ohlcSeed = [];
		const smartFlowSeed = [];
		const vwapLongSeed = [];
		const vwapShortSeed = [];
		const volumeSeed = [];
		const tallySeed = [];
		const netStrengthBarSeed = [];
		const dpSeed = [];
		const putVolSeed = [];
		const callVolSeed = [];
		// odd lot to regular ratio odd lot/ regular
		// intermarket sweep to regular ratio intermarket sweep/regular
		const oddToRegSeed = [];
		const sweepToRegSeed = [];
		let rthTally = 0,
			totalTally = 0;

		const unusualPutPremSeed = [];
		const unusualCallPremSeed = [];

		let cleansedSmartFlowData = [];
		let cleansedOhlcData = [];
		let cleansedPutVolData = [];
		let cleansedCallVolData = [];

		putVolData.sort((a, b) => {
			return a[0] - b[0];
		});
		callVolData.sort((a, b) => {
			return a[0] - b[0];
		});

		for (let i = 0; i < putVolData.length; i++) {
			if (putVolData[i]) {
				if (interval === '1d') {
					putVolData[i][0] -= 1000 * 60 * 60 * 24;
					callVolData[i][0] -= 1000 * 60 * 60 * 24;
				}
				cleansedPutVolData.push(putVolData[i]);
				cleansedCallVolData.push(callVolData[i]);
			}
		}

		putVolData = [...cleansedPutVolData];
		callVolData = [...cleansedCallVolData];
		cleansedCallVolData = [];
		cleansedPutVolData = [];

		let index = 0;
		if (interval !== '1d' && interval !== '1h') {
			let compareTime = null;
			while (true) {
				if (index === smartFlowData.length) {
					break;
				}

				if (!compareTime) {
					compareTime = smartFlowData[index][0];
				}

				if (compareTime !== smartFlowData[index][0]) {
					cleansedSmartFlowData.push([compareTime, 0, 0, 0, 0, 0, 0, 0, [0, 0, 0], {}, '']);
					let prevOhlcData = cleansedOhlcData[cleansedOhlcData.length - 1];
					cleansedOhlcData.push([
						compareTime,
						prevOhlcData[4],
						prevOhlcData[4],
						prevOhlcData[4],
						prevOhlcData[4],
						0
					]);
				} else {
					cleansedSmartFlowData.push(smartFlowData[index]);
					if (ohlcData[index].length) {
						cleansedOhlcData.push(ohlcData[index]);
					} else {
						let prevOhlcData = cleansedOhlcData[cleansedOhlcData.length - 1];
						if (!prevOhlcData) {
							let tryIndex = 0;
							while (!prevOhlcData || !prevOhlcData.length) {
								prevOhlcData = ohlcData[tryIndex];
								tryIndex++;
							}
						}
						cleansedOhlcData.push([
							compareTime,
							prevOhlcData[4],
							prevOhlcData[4],
							prevOhlcData[4],
							prevOhlcData[4],
							0
						]);
					}
					index++;
				}
				compareTime += 300000;
			}

			smartFlowData = [...cleansedSmartFlowData];
			ohlcData = [...cleansedOhlcData];
		}

		cleansedSmartFlowData = [];
		cleansedOhlcData = [];

		for (let i = 0; i < smartFlowData.length; i++) {
			if (smartFlowData[i]) {
				if (interval === '1d') {
					smartFlowData[i][0] -= 1000 * 60 * 60 * 24;
					ohlcData[i][0] -= 1000 * 60 * 60 * 24;
				}
				cleansedSmartFlowData.push(smartFlowData[i]);
				cleansedOhlcData.push(ohlcData[i]);

				if (putVolData[0] && putVolData[0][0] !== smartFlowData[i][0]) {
					if (interval === '1d') {
						putVolData.shift();
						callVolData.shift();
						cleansedPutVolData.push(putVolData[0]);
						cleansedCallVolData.push(callVolData[0]);
						putVolData.shift();
						callVolData.shift();
						continue;
					}
					cleansedPutVolData.push([smartFlowData[i][0], null]);
					cleansedCallVolData.push([smartFlowData[i][0], null]);
				} else {
					cleansedPutVolData.push(putVolData[0]);
					cleansedCallVolData.push(callVolData[0]);
					putVolData.shift();
					callVolData.shift();
				}
			}
		}

		smartFlowData = [...cleansedSmartFlowData];
		ohlcData = [...cleansedOhlcData];
		putVolData = cleansedPutVolData;
		callVolData = cleansedCallVolData;

		// quick bug fix
		index = 0;
		if (!ohlcData[0].length) {
			while (!ohlcData[index].length) {
				index++;
			}
			ohlcData[0] = [...ohlcData[index]];
			ohlcData[0][0] = smartFlowData[0][0];
		}

		let currentDay = moment.utc(smartFlowData[0][0]).format('YYYYMMDD');

		if (interval !== '1d') {
			for (let i = 0; i < chartConfig.xAxis.length; i += 2) {
				chartConfig.xAxis[i].plotLines.push({
					color: 'green',
					dashStyle: 'dot',
					width: 1,
					value: Number(moment.utc(`${currentDay} 093500`).format('x')),
					acrossPanes: false
				});
				chartConfig.xAxis[i].plotLines.push({
					color: 'red',
					dashStyle: 'dot',
					width: 1,
					value: Number(moment.utc(`${currentDay} 160000`).format('x')),
					acrossPanes: false
				});
			}
		}

		// get max volume
		let maxDPVolume = 0;
		for (let i = 0; i < smartFlowData.length; i++) {
			maxDPVolume = smartFlowData[i][8][1] > maxDPVolume ? smartFlowData[i][8][1] : maxDPVolume;
		}

		for (let i = 0; i < smartFlowData.length; i++) {
			if (interval !== '1d') {
				if (
					moment.utc(smartFlowData[i][0]).format('YYYYMMDD') !== currentDay ||
					!chartConfig.xAxis[0].plotLines.length
				) {
					for (let j = 0; j < chartConfig.xAxis.length; j += 2) {
						chartConfig.xAxis[j].plotLines.push({
							dashStyle: 'dot',
							width: 1,
							value: Number(moment.utc(`${currentDay} 093500`).format('x')),
							acrossPanes: false
						});
						chartConfig.xAxis[j].plotLines.push({
							dashStyle: 'dot',
							width: 1,
							value: Number(moment.utc(`${currentDay} 160000`).format('x')),
							acrossPanes: false
						});
						chartConfig.xAxis[j].plotLines.push({
							dashStyle: 'solid',
							width: 1,
							value: Number(moment.utc(smartFlowData[i][0]).format('x')),
							acrossPanes: false
						});
					}
				}
			}
			currentDay = moment.utc(smartFlowData[i][0]).format('YYYYMMDD');

			// if (ohlcData[i].length === 0) {
			//   let prevOHLC = ohlcSeed[ohlcSeed.length - 1];
			//   ohlcData[i] = [smartFlowData[i][0], prevOHLC.close, prevOHLC.close, prevOHLC.close, prevOHLC.close];
			// }
			let color = getSmartFlowColor(smartFlowData[i], ohlcData[i]);

			ohlcSeed.push({
				x: ohlcData[i][0],
				open: ohlcData[i][1],
				high: ohlcData[i][2],
				low: ohlcData[i][3],
				close: ohlcData[i][4],
				color: ohlcData[i][4] > ohlcData[i][1] ? 'green' : '#DC143C'
			});

			// smart flow data: [ts, smartflow, rth tally, total tally, short vwap, long vwap, netStrengthBar]

			smartFlowSeed.push({ x: smartFlowData[i][0], y: Number(smartFlowData[i][1]), color });
			// vwapShortSeed.push({x: smartFlowData[i][0], y: Number(smartFlowData[i][4])})
			// vwapLongSeed.push({x: smartFlowData[i][0], y: Number(smartFlowData[i][5])})
			netStrengthBarSeed.push([smartFlowData[i][0], smartFlowData[i][6]]);

			if (smartFlowData[i][8][2]) {
				dpSeed.push({
					x: smartFlowData[i][0],
					y: smartFlowData[i][8][2],
					volume: smartFlowData[i][8][1],
					marker: {
						radius:
							(smartFlowData[i][8][1] / maxDPVolume) * 6 >= 2
								? (smartFlowData[i][8][1] / maxDPVolume) * 6
								: 2
					}
				});
			}
			// tallySeed.push([Number(moment(smartFlowData[i][0]).format('x')), rth ? smartFlowData[i][2] : smartFlowData[i][3]])
			let row = ohlcData[i];
			let volColor = row[1] < row[4] ? 'green' : '#DC143C';
			volumeSeed.push({ x: Number(row[0]), y: Number(row[5] || 0), color: volColor });
			if (
				Number(moment.utc(smartFlowData[i][0]).format('HHmm')) >= 935 &&
				Number(moment.utc(smartFlowData[i][0]).format('HHmm')) <= 1600
			) {
				rthTally += smartFlowData[i][1];
			} else {
				rthTally = 0;
			}
			totalTally += smartFlowData[i][1];
			tallySeed.push([
				Number(moment(smartFlowData[i][0]).format('x')),
				rth ? rthTally : totalTally
			]);

			let uaCounter = 0;
			let unusualCallPrem = 0;
			let unusualPutPrem = 0;
			for (let j = 0; j < optionsFlow.length; j++) {
				if (!optionsFlow[j]) continue;
				if (Number(optionsFlow[j][1]) <= Number(smartFlowData[i][0])) {
					let tradeDateTime = df.fromUnixTime(optionsFlow[j][1] / 1000);
					let tradeDateTimeUTC = new Date(
						tradeDateTime.getUTCFullYear(),
						tradeDateTime.getUTCMonth(),
						tradeDateTime.getUTCDate(),
						tradeDateTime.getUTCHours(),
						tradeDateTime.getUTCMinutes(),
						tradeDateTime.getUTCSeconds()
					);
					if (optionsFlow[j][4] === 'C') {
						// call/put, expiry, strike, size, cost
						optionsFlowDesc = [
							[
								'C',
								optionsFlow[j][0],
								df.format(tradeDateTimeUTC, 'h:mm:ssaaa'),
								`${optionsFlow[j][3].slice(2, 4)}/${optionsFlow[j][3].slice(4, 6)}/${optionsFlow[
									j
								][3].slice(0, 2)}`,
								optionsFlow[j][5],
								optionsFlow[j][6],
								optionsFlow[j][7],
								optionsFlow[j][8]
							],
							...optionsFlowDesc
						];
						unusualCallPrem += Number((optionsFlow[j][6] * optionsFlow[j][7] * 100).toFixed(0));
					} else {
						optionsFlowDesc = [
							[
								'P',
								optionsFlow[j][0],
								df.format(tradeDateTimeUTC, 'h:mm:ssaaa'),
								`${optionsFlow[j][3].slice(2, 4)}/${optionsFlow[j][3].slice(4, 6)}/${optionsFlow[
									j
								][3].slice(0, 2)}`,
								optionsFlow[j][5],
								optionsFlow[j][6],
								optionsFlow[j][7],
								optionsFlow[j][8]
							],
							...optionsFlowDesc
						];
						unusualPutPrem += Number((optionsFlow[j][6] * optionsFlow[j][7] * 100).toFixed(0));
					}
					uaCounter++;
					optionsFlowDesc = optionsFlowDesc.slice(0, 300);
				}
				if (optionsFlow[j][1] > smartFlowData[i][0] || uaCounter === optionsFlow.length) {
					unusualCallPremSeed.push({ x: smartFlowData[i][0], y: unusualCallPrem });
					unusualPutPremSeed.push({ x: smartFlowData[i][0], y: unusualPutPrem });

					unusualCallPrem = 0;
					unusualPutPrem = 0;
					optionsFlow = optionsFlow.slice(uaCounter);
					break;
				}
			}
		}

		if (putVolData.length) {
			for (let i = 0; i < putVolData.length; i++) {
				if (interval === '1h') {
					putVolSeed.push(putVolData[i]);
				} else {
					if (putVolData[i] && putVolData[i][1]) {
						putVolSeed.push(putVolData[i]);
					}
				}
			}
		}

		if (callVolData.length) {
			for (let i = 0; i < callVolData.length; i++) {
				if (interval === '1h') {
					callVolSeed.push(callVolData[i]);
				} else {
					if (callVolData[i] && callVolData[i][1]) {
						callVolSeed.push(callVolData[i]);
					}
				}
			}
		}

		putVolSeed.sort((a, b) => {
			return a[0] - b[0];
		});
		callVolSeed.sort((a, b) => {
			return a[0] - b[0];
		});

		if (interval !== '1d') {
			for (let j = 0; j < chartConfig.xAxis.length; j += 2) {
				chartConfig.xAxis[j].plotLines.push({
					dashStyle: 'dot',
					width: 1,
					value: Number(moment.utc(`${currentDay} 093500`).format('x')),
					acrossPanes: false
				});
				chartConfig.xAxis[j].plotLines.push({
					dashStyle: 'dot',
					width: 1,
					value: Number(moment.utc(`${currentDay} 160000`).format('x')),
					acrossPanes: false
				});
			}
		}

		// for (let i  = 0; i < putVolData.length; i++) {
		//   putVolSeed.push(putVolData[i]);
		//   callVolSeed.push(callVolData[i]);
		// }

		currentSmartFlow = smartFlowSeed[smartFlowSeed.length - 1].y;

		currentSFTally = tallySeed.slice(-1)[0][1];

		// action codes:
		// 0 - neutral
		// 1 - momo buying
		// 2 - momo selling
		// 3 - smart money buying
		// 4 - smart money selling

		// secondary action codes:
		// 5 - smart money retreating
		// 6 - smart money holding firm

		// color codes:
		// 0 - black
		// 1 - green
		// 2 - red
		// 3 - light blue
		// 4 - pink

		// five = [actionCodes[actions.f[0]], actionColorCodes[actions.f[1]]];
		// update = [actionCodes[actions.u[0]], actionColorCodes[actions.u[1]]];
		// secondaryFive = [actionCodes[actions.sf[0]], actionColorCodes[actions.sf[1]]];
		// secondaryUpdate = [actionCodes[actions.su[0]], actionColorCodes[actions.su[1]]];

		for (let key in indicatorOptions) {
			if (indicatorOptions[key].enabled) {
				chartConfig.series.push({
					id: key,
					type: key,
					linkedTo: 'ohlc',
					params: {
						...indicatorOptions[key].params
					}
				});
			}
		}

		if (smartFlowData.length >= 2) {
			circleAction = getCircleAction(
				smartFlowData[smartFlowData.length - 1][1],
				ohlcData[ohlcData.length - 1][4],
				smartFlowData[smartFlowData.length - 2][1],
				ohlcData[ohlcData.length - 2][4]
			);
		}

		chartConfig.series[0].data = ohlcSeed;
		chartConfig.series[1].data = tallySeed;
		chartConfig.series[2].data = smartFlowSeed;
		// chartConfig.series[3].data = vwapLongSeed;
		// chartConfig.series[4].data = vwapShortSeed;
		chartConfig.series[5].data = volumeSeed;
		chartConfig.series[6].data = netStrengthBarSeed;
		chartConfig.series[7].data = dpSeed;
		chartConfig.series[8].data = callVolSeed;
		chartConfig.series[9].data = putVolSeed;
		chartConfig.series[10].data = unusualCallPremSeed;
		chartConfig.series[11].data = unusualPutPremSeed;
		chartConfig.chart.height = height;

		chartConfig.series[5].visible = chartSettings.vol;
		chartConfig.series[7].visible = chartSettings.dp;
		chartConfig.series[8].visible = chartSettings.optionsVol;
		chartConfig.series[9].visible = chartSettings.optionsVol;
		chartConfig.series[10].visible = chartSettings.optionsFlow;
		chartConfig.series[11].visible = chartSettings.optionsFlow;

		lastUpdated.dateTime = new Date();

		chart = Highcharts.stockChart('container', chartConfig);
		if (window.innerWidth <= 991) {
			let lowerIndex = smartFlowData.length > 30 ? 30 : smartFlowData.length - 1;
			chart.xAxis[0].setExtremes(
				smartFlowData[smartFlowData.length - 1 - lowerIndex][0],
				smartFlowData[smartFlowData.length - 1][0]
			);
		}
		currentPrice = ohlcData[ohlcData.length - 1][4];
		prevClose = currentPrice;
		if (yesterdayClose) {
			priceChange = (
				(((marketClose || currentPrice) - yesterdayClose) / yesterdayClose) *
				100
			).toFixed(2);
			allPriceChange = (((currentPrice - yesterdayClose) / yesterdayClose) * 100).toFixed(2);
		}
		prevSmartFlow = smartFlowData[smartFlowData.length - 1][1];
		loaded = true;
	};

	const getCircleAction = (sf, close, prevSf, prevClose) => {
		if (sf < prevSf) {
			// if (close < prevClose) {
			//   // smart money selling
			// } else if (close > prevClose) {
			//   // momo buying
			// }
			return 'negative';
		} else if (sf > prevSf) {
			// if (close < prevClose) {
			//   // momo selling
			// } else if (close > prevClose) {
			//   // smart money buying
			// }
			return 'positive';
		} else {
			return 'neutral';
		}
	};

	const handleSwitch = (type, e) => {
		if (type === 'rth') {
			rth = !rth;
			const smartFlowSeries = chartConfig.series[2].data;
			// recalculate tally
			let tallies = getTally(smartFlowSeries);
			// insert only the last tally
			currentSFTally = tallies.slice(-1)[0][1];
			chart.series[1].update({
				data: tallies
			});
		} else if (type === 'scale') {
			scale = !scale;
			loaded = false;
			firstLoad = false;
			historicalLoad = false;
			const subscribe =
				today.getFullYear() === currentDate.getFullYear() &&
				today.getMonth() === currentDate.getMonth() &&
				today.getDate() === currentDate.getDate();

			socket.send(
				JSON.stringify({
					action: 'live',
					symbol: `e${symbol}`,
					timeFrame: interval,
					date: minDate,
					maxdate: maxDate ? df.addBusinessDays(maxDate, 1) : maxDate,
					ofCollection: ofCollection,
					sfCollection: sfCollection,
					subscribe: historical ? false : subscribe
				})
			);
		} else {
			historical = !historical;
			loaded = false;
			firstLoad = false;
			historicalLoad = false;
			// chartConfig = createChartConfig();

			const subscribe =
				today.getFullYear() === currentDate.getFullYear() &&
				today.getMonth() === currentDate.getMonth() &&
				today.getDate() === currentDate.getDate();

			if (historical) {
				maxDate = maxDate ? maxDate : minDate;
				minDate = df.subBusinessDays(maxDate, 5);
				interval = '5m';
			} else {
				minDate = maxDate ? maxDate : minDate;
				maxDate = null;
			}

			socket.send(
				JSON.stringify({
					action: 'live',
					symbol: `e${symbol}`,
					timeFrame: interval,
					date: minDate,
					maxdate: maxDate ? df.addBusinessDays(maxDate, 1) : maxDate,
					ofCollection: ofCollection,
					sfCollection: sfCollection,
					subscribe: historical ? false : subscribe
				})
			);
		}
	};

	const handleChange = (e) => {
		loaded = false;
		firstLoad = false;
		historicalLoad = false;
		// chartConfig = createChartConfig();
		const year = e.target.value.slice(0, 4);
		const month = e.target.value.slice(5, 7);
		const day = e.target.value.slice(8);
		// date = year + month + day;
		currentDate = new Date(year, month - 1, day);
		displayDate = getDisplayDate(currentDate);
		minDate = Date.UTC(year, String(Number(month) - 1), day);
		if (interval === '1h') {
			maxDate = minDate;
			minDate = df.subBusinessDays(maxDate, 10);
			historical = false;
		} else if (interval === '1d') {
			maxDate = minDate;
			minDate = df.subBusinessDays(maxDate, 60);
			historical = false;
		} else {
			// if (!historical) {
			//   minDate = maxDate ? maxDate : minDate;
			//   maxDate = null;
			// }
			if (historical) {
				interval = '5m';
				maxDate = minDate;
				minDate = df.subBusinessDays(maxDate, 5);
			}
		}

		const subscribe =
			today.getFullYear() === currentDate.getFullYear() &&
			today.getMonth() === currentDate.getMonth() &&
			today.getDate() === currentDate.getDate();
		socket.send(
			JSON.stringify({
				action: 'live',
				symbol: `e${symbol}`,
				timeFrame: interval,
				date: minDate,
				maxdate: maxDate ? df.addBusinessDays(maxDate, 1) : maxDate,
				ofCollection: ofCollection,
				sfCollection: sfCollection,
				subscribe: historical ? false : subscribe
			})
		);
	};

	const addIndicator = (name) => {
		indicatorOptions[name].enabled = !indicatorOptions[name].enabled;
		const series = chart.get(name);
		if (series) series.remove();

		if (indicatorOptions[name].enabled) {
			chart.addSeries(
				{
					id: name,
					type: name,
					linkedTo: 'ohlc',
					params: {
						...indicatorOptions[name].params
					}
				},
				true
			);
		}
		localStorage.setItem('indicators', JSON.stringify(indicatorOptions));
	};

	const handleClick = (type, newVal) => {
		loaded = false;
		firstLoad = false;
		historicalLoad = false;
		// chartConfig = createChartConfig();
		interval = newVal;
		historical = false;

		if (interval === '1h') {
			maxDate = maxDate ? maxDate : minDate;
			minDate = df.subBusinessDays(maxDate, 10);
		} else if (interval === '1d') {
			maxDate = maxDate ? maxDate : minDate;
			minDate = df.subBusinessDays(maxDate, 60);
		} else {
			minDate = maxDate ? maxDate : minDate;
			maxDate = null;
		}

		const subscribe =
			today.getFullYear() === currentDate.getFullYear() &&
			today.getMonth() === currentDate.getMonth() &&
			today.getDate() === currentDate.getDate();
		socket.send(
			JSON.stringify({
				action: 'live',
				symbol: `e${symbol}`,
				date: minDate,
				timeFrame: interval,
				maxdate: maxDate ? df.addBusinessDays(maxDate, 1) : maxDate,
				ofCollection: ofCollection,
				sfCollection: sfCollection,
				subscribe: historical ? false : subscribe
			})
		);
	};

	const handleIndicatorOptionsChange = (e, name, type, isOverlay = true) => {
		e.preventDefault();
		let value = Number(e.target.value);
		if (value === 0 || (!(value > 0) && value < 0)) {
			value = 0;
		}
		if (value === 0) return;
		chart.get(name).remove();
		indicatorOptions[name].params[type] = Number(value);
		chart.addSeries(
			{
				id: name,
				type: name,
				linkedTo: 'ohlc',
				params: {
					...indicatorOptions[name].params
				}
			},
			true
		);
		localStorage.setItem('indicators', JSON.stringify(indicatorOptions));
	};

	let hidden = true;
	const toggleModal = () => {
		return (hidden = !hidden);
	};

	const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

	function abbreviateNumber(number) {
		// what tier? (determines SI symbol)
		let tier = (Math.log10(Math.abs(number)) / 3) | 0;

		// if zero, we don't need a suffix
		if (tier == 0) return number;

		// get suffix and determine scale
		let suffix = SI_SYMBOL[tier];
		let scale = Math.pow(10, tier * 3);

		// scale the number
		let scaled = number / scale;

		// format number and add suffix
		return scaled.toFixed(1) + suffix;
	}

	const inputEvent = (e) => {
		inputSymbol = e.target.value.toUpperCase();
	};

	const changeEvent = (e) => {
		loaded = false;
		firstLoad = false;
		historicalLoad = false;
		// chartConfig = createChartConfig();
		const subscribe =
			today.getFullYear() === currentDate.getFullYear() &&
			today.getMonth() === currentDate.getMonth() &&
			today.getDate() === currentDate.getDate();

		symbol = inputSymbol;
		placeholderSymbol = symbol;
		inputSymbol = '';
		socket.send(
			JSON.stringify({
				action: 'live',
				timeFrame: interval,
				symbol: `e${symbol}`,
				date: minDate,
				maxdate: maxDate ? df.addBusinessDays(maxDate, 1) : maxDate,
				ofCollection: ofCollection,
				sfCollection: sfCollection,
				subscribe: historical ? false : subscribe
			})
		);
	};

	const chartOptions = (option) => {
		if (option === 'optionsFlow') {
			chartSettings.optionsFlow = !chartSettings.optionsFlow;
			chart.series[10][chartSettings.optionsFlow ? 'show' : 'hide']();
			chart.series[11][chartSettings.optionsFlow ? 'show' : 'hide']();
		} else if (option === 'optionsVol') {
			chartSettings.optionsVol = !chartSettings.optionsVol;
			chart.series[8][chartSettings.optionsVol ? 'show' : 'hide']();
			chart.series[9][chartSettings.optionsVol ? 'show' : 'hide']();
		} else if (option === 'dp') {
			chartSettings.dp = !chartSettings.dp;
			chart.series[7][chartSettings.dp ? 'show' : 'hide']();
		} else {
			chartSettings.vol = !chartSettings.vol;
			chart.series[5][chartSettings.vol ? 'show' : 'hide']();
		}
		localStorage.setItem('chartSettingsSF', JSON.stringify(chartSettings));
	};

	onDestroy(() => {
		if (socket) {
			socket.close();
		}
	});
</script>

<div class="graph-area" class:info-active={showDetails} id="graph-area">
	<div class="boxed-layout">
		<div class="graph-top">
			<div class="filter-block">
				<div class="input-fields">
					<div class="search">
						<input
							placeholder={placeholderSymbol}
							on:focus={() => {
								placeholderSymbol = '';
							}}
							on:focusout={() => (placeholderSymbol = displaySymbol)}
							value={inputSymbol}
							on:input={(e) => {
								inputEvent(e);
							}}
							on:keypress={(e) => {
								if (e.key === 'Enter') {
									changeEvent(e);
								}
							}}
							type="text"
							class="search-input with-icon"
						/>
					</div>
					<div class="calender">
						<input
							value={displayDate}
							type="date"
							class="calendar-input with-icon"
							onclick="this.showPicker()"
							on:change={(e) => {
								handleChange(e);
							}}
						/>
					</div>
				</div>
			</div>
			<!-- Filter block ends here -->
			<div class="data-block">
				<div class="ranges-data">
					<div class="content-block">
						<br />
						<p class=""><span class="higlight-number1">{displaySymbol}</span></p>
						<div class="outer-wrapper">
							<div class="box">
								<p class="description">
									<span class="higlight-number shade1">
										{(marketClose || currentPrice).toFixed(2)}
									</span>&nbsp;&nbsp;
									<span
										style="font-size: 16px; color: {priceChange > 0
											? '#00873c'
											: priceChange === 0
											? 'orange'
											: '#eb0f29'}"
									>
										{((marketClose || currentPrice) - yesterdayClose).toFixed(
											2
										)}&nbsp;&nbsp;({priceChange}%)
									</span>
								</p>
								<p class="price">
									Last Update: {(lastUpdated && lastUpdated.time) || 'Market Closed'}
								</p>
							</div>
							{#if marketClose}
								<div class="box">
									<p class="description">
										<span class="higlight-number1">
											{currentPrice}
										</span>&nbsp;&nbsp;
										<span
											style="font-size: 16px; color: {allPriceChange > 0
												? '#00873c'
												: allPriceChange === 0
												? 'orange'
												: '#eb0f29'}"
										>
											{(currentPrice - yesterdayClose).toFixed(2)}&nbsp;&nbsp;({allPriceChange}%)
										</span>
									</p>
									<p class="price">After Hours</p>
								</div>
							{/if}
						</div>
					</div>
					<!-- <div class="graph-ranges">
                      <div class="range-graph shade2">
                          <div class="legends">
                              <span>157.26</span>
                              <span>DAYS RANGE</span>
                              <span>166.02</span>
                          </div>
                          <div class="line">
                              <span style="width: 40%;left: 10%;" />
                          </div>
                      </div>
                      <div class="range-graph shade3">
                          <div class="legends">
                              <span>157.26</span>
                              <span>DAYS RANGE</span>
                              <span>166.02</span>
                          </div>
                          <div class="line">
                              <span style="width: 50%;left: 30%;" />
                          </div>
                      </div>
                      <div class="range-graph shade4">
                          <div class="legends">
                              <span>157.26</span>
                              <span>DAYS RANGE</span>
                              <span>166.02</span>
                          </div>
                          <div class="line">
                              <span style="width: 20%;left: 40%;" />
                          </div>
                      </div>
                  </div> -->
				</div>
				<div class="graphs">
					<div class="live-updates-graph {circleAction}">
						<!-- <div class="live-updates-graph {currentSmartFlow > 0 ? 'positive' : currentSmartFlow === 0  ? 'neutral' : 'negative'}"> -->
						<div class="heading">
							<svg viewBox="0 0 200 200">
								<path
									d="M0.999999 12C13.5289 5.0936 29.1118 1 46 1C62.8882 1 78.4711 5.0936 91 12"
									stroke="rgba(0,0,0,0)"
									fill="rgba(0,0,0,0)"
									stroke-opacity="0.26"
									stroke-width="2"
									stroke-linejoin="round"
									id="curve"
								/>

								<text width="100" style="transform: translate(25px, 30px);">
									<textPath xlink:href="#curve" class="fill-class"> Smart Flow </textPath>
								</text>
							</svg>
						</div>
						<div class="graph-block">
							<span class="value">{abbreviateNumber(currentSmartFlow)}</span>
							<span class="normal-line lines line1" />
							<span class="bg-line lines line2" />
							<span class="bg-line lines line3" />
							<span class="bg-line lines line4" />
							<span class="bg-line lines line5" />
						</div>
					</div>
					<div
						class="live-updates-graph {currentSFTally > 0
							? 'positive'
							: currentSFTally === 0
							? 'neutral'
							: 'negative'}"
					>
						<div class="heading">
							<svg viewBox="0 0 200 200">
								<path
									d="M0.999996 12C12.4152 5.0936 26.6129 1 42 1C57.3871 1 71.5848 5.0936 83 12"
									stroke="rgba(0,0,0,0)"
									fill="rgba(0,0,0,0)"
									stroke-opacity="0.26"
									stroke-width="2"
									stroke-linejoin="round"
									id="curve1"
								/>
								<text width="100" style="transform: translate(40px, 28px) rotate(7deg);">
									<textPath xlink:href="#curve1" class="fill-class"> SF Tally </textPath>
								</text>
							</svg>
						</div>
						<div class="graph-block">
							<span class="value">{abbreviateNumber(currentSFTally)}</span>
							<span class="normal-line lines line1" />
							<span class="bg-line lines line2" />
							<span class="bg-line lines line3" />
							<span class="bg-line lines line4" />
							<span class="bg-line lines line5" />
						</div>
					</div>
				</div>
			</div>
			<!-- Data Block ends here -->
		</div>
	</div>

	<div class="main-graph-block" class:zoomed id="main-graph-block">
		<div class="top">
			<div class="handles">
				<div class="tabs">
					<div
						on:click={() => handleClick('interval', '5m')}
						class="tab {interval === '5m' ? 'active' : ''}"
					>
						5 Min
					</div>
					<div
						on:click={() => handleClick('interval', '1h')}
						class="tab {interval === '1h' ? 'active' : ''}"
					>
						Hourly
					</div>
					<div
						on:click={() => handleClick('interval', '1d')}
						class="tab {interval === '1d' ? 'active' : ''}"
					>
						Daily
					</div>
				</div>
				<div>
					<div class="heading" on:click={() => (zoomed = !zoomed)}>
						<i class="icofont-ui-zoom-in" />
						<i class="icofont-ui-zoom-out" />
					</div>
					<div class="button-with-dropdown">
						<div on:click={toggleModal} class="heading">Indicators</div>
						<!-- <div class="drop-down">
                      <div class="search-bar">
                          <input type="text" class="search-input with-icon" placeholder="Search..." />
                      </div>
                      <div class="search-result">
                          <div class="tags">
                              <div class="tag">ABC</div>
                              <div class="tag">ABC Result</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC Result</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC Result</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC Result</div>
                              <div class="tag">ABC Result</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC</div>
                              <div class="tag">ABC</div>
                          </div>
                      </div>
                  </div> -->
					</div>
					<!--  onclick="showDetailedData()" -->
					<div class="heading hide-in-lg" on:click={() => (showDetails = !showDetails)}>
						Details
					</div>
				</div>
			</div>
			<div class="legends">
				<div class="checkbox-group">
					<div class="group">
						<input
							on:change={(e) => {
								handleSwitch('rth', e);
							}}
							checked={rth}
							type="checkbox"
							name=""
							id=""
						/>
						<div class="data">RTH</div>
					</div>
					<div class="group">
						<input
							on:change={(e) => {
								handleSwitch('historical', e);
							}}
							checked={historical}
							type="checkbox"
							name=""
							id=""
						/>
						<div class="data">Historical</div>
					</div>
					<div class="group">
						<input
							on:change={(e) => {
								handleSwitch('scale', e);
							}}
							checked={scale}
							type="checkbox"
							name=""
							id=""
						/>
						<div class="data">7-Day Scale</div>
					</div>
				</div>
				<div>
					<div class="checkbox-group">
						<div class="group">
							<input
								on:click={() => {
									chartOptions('optionsFlow');
								}}
								checked={chartSettings.optionsFlow}
								type="checkbox"
								name="optionsflow"
								id="optionsflow"
							/>
							<div class="data">Options Flow</div>
						</div>
						<div class="group">
							<input
								on:click={() => {
									chartOptions('optionsVol');
								}}
								checked={chartSettings.optionsVol}
								type="checkbox"
								name="optionsvol"
								id="optionsvol"
							/>
							<div class="data">Options Volume</div>
						</div>
						<div class="group">
							<input
								on:click={() => {
									chartOptions('vol');
								}}
								checked={chartSettings.vol}
								type="checkbox"
								name="vol"
								id="vol"
							/>
							<div class="data">Volume</div>
						</div>
						<div class="group">
							<input
								on:click={() => {
									chartOptions('dp');
								}}
								checked={chartSettings.dp}
								type="checkbox"
								name="dp"
								id="dp"
							/>
							<div class="data">Dark Pool</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		{#if !loaded}
			<div
				style="margin-top: 200px; align-items: center; justify-content: center; display: flex; position: relative;"
			>
				<Wave size="30" color="#FF3E00" unit="px" duration="1s" />
			</div>
		{/if}
		<!-- <div style='width: {width}px; {!loaded ? 'display: none;' : ''}' class="boxed-layout candle-graph-area"> -->
		<div style="display: {loaded ? '' : 'none'}" id="container" />
		<!-- </div> -->
	</div>
	<!-- main-graph-block ends here -->
</div>
<!-- graph-area ends here -->
<div class="other-data-area" class:active={showDetails} id="other-data-area">
	<div class="boxed-layout">
		<div class="numeric-data">
			<!-- call/put, type, expiry, strike, size, cost -->
			<div class="boxed-layout-60">
				<p>
					<span>Time&nbsp;Sentiment&nbsp;Put/Call&nbsp;Type</span>
				</p>
				<p>
					<span>Premium&nbsp;|&nbsp;Strike&nbsp;|&nbsp;Expiry</span>
				</p>
			</div>
			{#each optionsFlowDesc as flow}
				<div class="boxed-layout-60 {flow[6] * flow[5] * 100 > 1000000 ? 'green-highlighted' : ''}">
					<p>
						<span style="font-size: 1em;"
							>{flow[2]}&nbsp;<i
								style="font-size: 1.15em;"
								class="{!flow[7]
									? 'options-flow-icon-orange'
									: flow[7] === 'bullish'
									? 'options-flow-icon-green '
									: 'options-flow-icon-red '} {!flow[7]
									? 'icofont-monkey-face'
									: flow[7] === 'bullish'
									? 'icofont-cow-head'
									: 'icofont-bear-face'}"
							/>&nbsp;<span style="color: {flow[0] === 'C' ? '#548ac0' : '#976b97'}"
								>{flow[0] === 'C' ? 'Call' : 'Put'}</span
							>&nbsp;{flow[1].charAt(0).toUpperCase() + flow[1].slice(1)}</span
						>
					</p>
					<p>
						<span style="font-size: 1em"
							>${abbreviateNumber(
								flow[6] * flow[5] * 100
							)}&nbsp;|&nbsp;${flow[4]}&nbsp;|&nbsp;{flow[3]}</span
						>
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>
<!-- other-data-area ends here -->
<div>
	<ModelLayout enableClose={true} title="Indicators" bind:hidden>
		<div class="bg-black w-full">
			<div>
				<label for="c2">Bollinger Bands</label>
				<input
					id="c2"
					type="checkbox"
					checked={indicatorOptions && indicatorOptions.bb.enabled}
					on:change={() => addIndicator('bb')}
				/>
			</div>

			<div class=" flex flex-col items-center justify-center">
				<label for="c2">period</label>
				<input
					type="text"
					name="text"
					id="bb-period"
					disabled={indicatorOptions && !indicatorOptions.bb.enabled}
					value={indicatorOptions && indicatorOptions.bb.params.period}
					on:input={(e) => handleIndicatorOptionsChange(e, 'bb', 'period')}
				/>
				<br />
				<label for="c2">std. dev</label>
				<input
					type="text"
					name="text"
					disabled={indicatorOptions && !indicatorOptions.bb.enabled}
					value={indicatorOptions && indicatorOptions.bb.params.standardDeviation}
					on:input={(e) => handleIndicatorOptionsChange(e, 'bb', 'standardDeviation')}
					id="bb-stddev"
					style="width: 50px;"
				/>
			</div>
		</div>
	</ModelLayout>

	<!-- <Modal class="modal-dialog modal-dialog-centered" isOpen={open} {toggleModal}>
		<ModalHeader {toggleModal}>Indicators</ModalHeader>
		<ModalBody>
			<Row>
				<Col xs="4">
					<FormGroup>
						<Input
							id="c2"
							type="checkbox"
							label="Bollinger Bands"
							checked={indicatorOptions.bb.enabled}
							on:change={() => addIndicator('bb')}
						/>
					</FormGroup>
				</Col>
				<Col xs="8">
					<FormGroup>
						<div style="display: inline-flex;">
							<Label>period</Label>&nbsp;&nbsp;
							<Input
								type="text"
								name="text"
								id="bb-period"
								disabled={!indicatorOptions.bb.enabled}
								value={indicatorOptions.bb.params.period}
								on:input={(e) => handleIndicatorOptionsChange(e, 'bb', 'period')}
								style="width: 50px;"
							/>&nbsp;&nbsp;
							<Label>{' std. dev'}</Label>&nbsp;&nbsp;
							<Input
								type="text"
								name="text"
								disabled={!indicatorOptions.bb.enabled}
								value={indicatorOptions.bb.params.standardDeviation}
								on:input={(e) => handleIndicatorOptionsChange(e, 'bb', 'standardDeviation')}
								id="bb-stddev"
								style="width: 50px;"
							/>
						</div>
					</FormGroup>
				</Col>
			</Row>
		</ModalBody>
		<ModalFooter>
			<Button color="primary" on:click={toggleModal}>Close</Button>
		</ModalFooter>
	</Modal> -->
</div>
