<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import RecentPost from '../components/blog/RecentPost.svelte';
	let socket;
	let topTen1 = [
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0]
	];
	let topTen2 = [
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0]
	];
	let topTen3 = [
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0],
		['--', 0, 0]
	];

	export let data;

	console.log(data);

	onMount(() => {
		// socket = new WebSocket('ws://159.203.110.167:9001'); // tape runner server
		socket = new WebSocket('ws://167.172.231.78:9001'); // live
		// socket = new WebSocket('ws://localhost:9001');

		socket.onopen = () => {
			console.log('CONNECTED');
			socket.send(
				JSON.stringify({
					action: 'dashboard'
				})
			);
		};

		socket.onmessage = (e) => {
			let data = JSON.parse(e.data);
			//   console.log(data);
			if (data.type === 'posDSF') {
				if (data.data.length === 10) {
					topTen2 = [...data.data];
					const combinedDSF = topTen2.concat(topTen3);
					combinedDSF.sort((a, b) => {
						return Math.abs(b[1]) - Math.abs(a[1]);
					});
					topTen1 = combinedDSF.slice(0, 10);
				}
			} else if (data.type === 'negDSF') {
				if (data.data.length === 10) {
					topTen3 = [...data.data];
					const combinedDSF = topTen2.concat(topTen3);
					combinedDSF.sort((a, b) => {
						return Math.abs(b[1]) - Math.abs(a[1]);
					});
					topTen1 = combinedDSF.slice(0, 10);
				}
				//   } else if (data.type === 'posPC') {
				//     if (data.data.length) {
				//       topTen3 = [...data.data];
				//     }
			} else if (data.action && data.action === 'firstTop10') {
				topTen2 = (data.data.posDSF.length && data.data.posDSF) || topTen2;
				topTen3 = (data.data.negDSF.length && data.data.negDSF) || topTen3;
				//   topTen3 = data.data.posPC;
				const combinedDSF = topTen2.concat(topTen3);
				combinedDSF.sort((a, b) => {
					return Math.abs(b[1]) - Math.abs(a[1]);
				});
				topTen1 = combinedDSF.slice(0, 10);
			}
		};
	});

	onDestroy(() => {
		if (socket) {
			socket.close();
		}
	});
</script>

<div class="top-lists-block">
	<div class="top-section" />
	<div class="top-lists">
		<div class="list">
			<div class="table-wrapper">
				<div class="table-header">
					<div class="title">Top 10 Smart Flow Tickers</div>
					<div class="btn-block">
						<div class="button-with-dropdown" id="setting-dropdown">
							<!-- onclick="settingDropdown()" -->
							<button>
								<i class="icofont-gear" />
							</button>
							<div class="drop-down">
								<div class="checkboxes">
									<div class="checkbox-group">
										<div class="group">
											<input type="checkbox" name="" id="" checked />
											<div class="data">Top List of Smartflow</div>
										</div>
										<div class="group">
											<input type="checkbox" name="" id="" checked />
											<div class="data">Top 10 Smart Money Reversals</div>
										</div>
										<div class="group">
											<input type="checkbox" name="" id="" checked />
											<div class="data">Top 10 Momo Scanner</div>
										</div>
										<div class="group">
											<input type="checkbox" name="" id="" />
											<div class="data">Top 10 Momo Scanner</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="main-table">
					<table>
						<thead>
							<tr>
								<td>Symbol</td>
								<td>% Change</td>
								<td>Indicator</td>
							</tr>
						</thead>
						<tbody>
							{#each topTen1 as point}
								<tr
									on:click={() => {
										if (point[0] === '--') return;
										goto('/smartflow/' + point[0].slice(1)), false;
									}}
								>
									<td>{point[0].slice(1)}</td>
									<td
										><span
											class={point[2] > 0
												? 'positive-value'
												: point[2] < 0
												? 'negative-value'
												: 'neutral-value'}
											>{Number(point[2]).toFixed(2)}%{point[2] < 0
												? ' ▼'
												: point[2] > 0
												? ' ▲'
												: ''}</span
										></td
									>
									<td>{Number(Number(point[1]).toFixed(2)).toLocaleString('en-US')}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="list">
			<div class="table-wrapper">
				<div class="table-header">
					<div class="title">Top 10 Smart Flow Tickers [+]</div>
					<div class="btn-block">
						<div class="button-with-dropdown" id="setting-dropdown">
							<button>
								<i class="icofont-gear" />
							</button>
							<div class="drop-down">
								<div class="checkboxes">
									<div class="checkbox-group">
										<div class="group">
											<input type="checkbox" name="" id="" checked />
											<div class="data">Top List of Smartflow</div>
										</div>
										<div class="group">
											<input type="checkbox" name="" id="" checked />
											<div class="data">Top 10 Smart Money Reversals</div>
										</div>
										<div class="group">
											<input type="checkbox" name="" id="" checked />
											<div class="data">Top 10 Momo Scanner</div>
										</div>
										<div class="group">
											<input type="checkbox" name="" id="" />
											<div class="data">Top 10 Momo Scanner</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="main-table">
					<table>
						<thead>
							<tr>
								<td>Symbol</td>
								<td>% Change</td>
								<td>Indicator</td>
							</tr>
						</thead>
						<tbody>
							{#each topTen2 as point}
								<tr
									on:click={() => {
										if (point[0] === '--') return;
										goto('/smartflow/' + point[0].slice(1)), false;
									}}
								>
									<td>{point[0].slice(1)}</td>
									<td
										><span
											class={point[2] > 0
												? 'positive-value'
												: point[2] < 0
												? 'negative-value'
												: 'neutral-value'}
											>{Number(point[2]).toFixed(2)}%{point[2] < 0
												? ' ▼'
												: point[2] > 0
												? ' ▲'
												: ''}</span
										></td
									>
									<td>{Number(Number(point[1]).toFixed(2)).toLocaleString('en-US')}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="list">
			<div class="table-wrapper">
				<div class="table-header">
					<div class="title">Top 10 Smart Flow Tickers [-]</div>
					<div class="btn-block">
						<div class="button-with-dropdown" id="setting-dropdown">
							<button>
								<i class="icofont-gear" />
							</button>
							<div class="drop-down">
								<div class="checkboxes">
									<div class="checkbox-group">
										<div class="group">
											<input type="checkbox" name="" id="" />
											<div class="data">Top List of Smartflow</div>
										</div>
										<div class="group">
											<input type="checkbox" name="" id="" />
											<div class="data">Top 10 Smart Money Reversals</div>
										</div>
										<div class="group">
											<input type="checkbox" name="" id="" />
											<div class="data">Top 10 Momo Scanner</div>
										</div>
										<div class="group">
											<input type="checkbox" name="" id="" />
											<div class="data">Top 10 Momo Scanner</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="main-table">
					<table>
						<thead>
							<tr>
								<td>Symbol</td>
								<td>% Change</td>
								<td>Indicator</td>
							</tr>
						</thead>
						<tbody>
							{#each topTen3 as point}
								<tr
									on:click={() => {
										if (point[0] === '--') return;
										goto('/smartflow/' + point[0].slice(1)), false;
									}}
								>
									<td>{point[0].slice(1)}</td>
									<td
										><span
											class={point[2] > 0
												? 'positive-value'
												: point[2] < 0
												? 'negative-value'
												: 'neutral-value'}
											>{Number(point[2]).toFixed(2)}%{point[2] < 0
												? ' ▼'
												: point[2] > 0
												? ' ▲'
												: ''}</span
										></td
									>
									<td>{Number(Number(point[1]).toFixed(2)).toLocaleString('en-US')}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="blog-section boxed-layout">
	<div class="heading">Recent Blog Posts</div>
	<div class="row">
		<div class="col-lg-8">
			<div class="recent-post">
				<h2 class="blog-title">{data?.blogs?.shift()?.title || ''}</h2>
				{@html data?.blogs?.shift()?.description || ''}
			</div>
		</div>

		<RecentPost blogs={data.blogs} />
	</div>
</div>
