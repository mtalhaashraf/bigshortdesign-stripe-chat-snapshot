<script>
	import { topTenSmartFlowTickers } from '../../data/dashboard_data';
	import TickersDropDown from './TickersDropDown.svelte';

	let dropdown = false;
</script>

<div class="list">
	<div class="table-wrapper">
		<div class="table-header">
			<div class="title">Top 10 SmartFlow Tickers</div>
			<div class="btn-block">
				<div class="button-with-dropdown {dropdown ? 'active' : ''}" id="setting-dropdown">
					<button on:click={() => (dropdown = !dropdown)}>
						<i class="icofont-gear" />
					</button>
					<TickersDropDown />
				</div>
			</div>
		</div>
		<div class="main-table">
			<table>
				<thead>
					<tr>
						<td>Symbol</td>
						<td>% Change</td>
						<td>Indicatior</td>
					</tr>
				</thead>
				<tbody>
					{#each topTenSmartFlowTickers as data}
						<tr>
							<td>{data.symbol}</td>
							<td><span class="positive-value">{data.change} </span></td>
							<td>{data.indicatior}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
