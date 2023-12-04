<script>
	import Highcharts from 'highcharts/highstock.js';
	import { onDestroy, onMount } from 'svelte';
	import { Wave } from 'svelte-loading-spinners';
	import { createChartConfig } from './squeezeChartConfig.js';

	let width = '100%';

	let height, chart, loggedIn, chartConfig, indicatorOptions, token;
	let zoomed = false;
	let showDetails = false;
	let loaded = false;
	onMount(() => {
		indicatorOptions = localStorage.getItem('indicators');
		chartConfig = createChartConfig();
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

	onMount(() => {
		getData();
	});

	const getData = async () => {
		try {
			// let squeezeData = await fetch(`http://localhost:8080/getSqueeze?token=${token}`, {
			let squeezeData = await fetch(
				`https://us-central1-auth-development-33b83.cloudfunctions.net/getSqueeze?token=${token}`,
				{
					method: 'GET',
					mode: 'cors'
				}
			);

			squeezeData = await squeezeData.json();
			if (squeezeData.error) {
				alert(squeezeData.error);
				return;
			}

			organizeData(squeezeData);
		} catch (e) {
			console.log(e);
		}
	};

	const organizeData = (squeezeData) => {
		const ohlcSeed = [];
		const realVolSeed = [];
		const allShortVolChartSeed = [];
		const allLongVolChartSeed = [];
		const allImscVolChartSeed = [];
		const sentimentDataSP500 = [];
		const sentimentDataAll = [];
		for (let i = 0; i < squeezeData.length; i++) {
			ohlcSeed.push({
				x: squeezeData[i][0],
				open: squeezeData[i][1],
				high: squeezeData[i][2],
				low: squeezeData[i][3],
				close: squeezeData[i][4],
				color: squeezeData[i][4] > squeezeData[i][1] ? 'green' : '#DC143C'
			});

			realVolSeed.push({
				x: squeezeData[i][0],
				y: squeezeData[i][5],
				color: squeezeData[i][4] > squeezeData[i][1] ? 'green' : '#DC143C'
			});

			allLongVolChartSeed.push([squeezeData[i][0], squeezeData[i][6]]);
			allShortVolChartSeed.push([squeezeData[i][0], squeezeData[i][7]]);
			allImscVolChartSeed.push([squeezeData[i][0], squeezeData[i][8]]);

			if (squeezeData[i].length > 8) {
				sentimentDataSP500.push([squeezeData[i][0], squeezeData[i][9]]);
				sentimentDataAll.push([squeezeData[i][0], squeezeData[i][10]]);
			}
		}
		chartConfig.series[0].data = ohlcSeed;
		chartConfig.series[1].data = sentimentDataAll;
		chartConfig.series[2].data = sentimentDataSP500;
		chartConfig.series[3].data = allShortVolChartSeed;
		chartConfig.series[4].data = allLongVolChartSeed;
		chartConfig.series[5].data = allImscVolChartSeed;
		chartConfig.series[6].data = realVolSeed;
		chartConfig.chart.height = height;
		chart = Highcharts.stockChart('container', chartConfig);

		chart.xAxis[0].setExtremes(
			squeezeData[squeezeData.length - 120][0],
			squeezeData[squeezeData.length - 1][0]
		);
		loaded = true;
	};

	onDestroy(() => {
		if (chart) chart.destroy();
	});
</script>

<div class="graph-area" class:info-active={showDetails} id="graph-area">
	<div class="main-graph-block1" class:zoomed id="main-graph-block1">
		<div class="top-right">
			<div class="handles">
				<div class="heading" on:click={() => (zoomed = !zoomed)}>
					<i class="icofont-ui-zoom-in" />
					<i class="icofont-ui-zoom-out" />
				</div>
			</div>
		</div>
		{#if !loaded}
			<div
				style="margin-top: {window.innerHeight / 2 -
					200}px; align-items: center; justify-content: center; display: flex; position: relative;"
			>
				<Wave size="30" color="#FF3E00" unit="px" duration="1s" />
			</div>
		{/if}
		<div id="container" />
	</div>
	<!-- main-graph-block ends here -->
</div>
