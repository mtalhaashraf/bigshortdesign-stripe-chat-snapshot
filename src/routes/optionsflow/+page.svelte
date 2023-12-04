<script>
  import { onDestroy, onMount } from 'svelte';
  import * as df from 'date-fns';
  import { goto } from '$app/navigation';

  let socket;
  let optionsFlow = [];
  let calls = 0;
  let puts = 0;
  let callPercentage = 0;
  let putPercentage = 0;
  let bears = 0;
  let bulls = 0;
  let putToCall = 0;
  let highlightIndex = -1;
  let firstLoad = false;
  let flowSentimentValue = "Neutral";
  let flowSentimentGraphValue = 50;
  onMount(() => {
    // socket = new WebSocket('ws://159.203.110.167:9001'); // tape runner server
    socket = new WebSocket('ws://167.172.231.78:9001'); // live
    // socket = new WebSocket('ws://localhost:9001');

    socket.onopen = () => {
      console.log('CONNECTED');
      socket.send(JSON.stringify({
        action: 'optionsFlow',
      }));
    }

    socket.onmessage = e => {
      let data = JSON.parse(e.data);
      // console.log(data);
        // [type, time, symbol, expiry, C/P, strike, size, avgCost, bull/bear/ spot]
      data = data.data;
      data.sort((a, b) => {return a[1]-b[1];})
      if (firstLoad) {
        highlightIndex = data.length - 1;
      }
      for (let i = 0; i < data.length; i++) {
        organizeData(data[i]);
      }
      if (!firstLoad) {
        firstLoad = true;
      }
      setProgress();
    }
  });

  const organizeData = row => {
    // [type, time, symbol, expiry, C/P, strike, size, avgCost, bull/bear/ spot]
    let tradeDateTime = df.fromUnixTime(row[1]/1000);
    let tradeDateTimeUTC = new Date(tradeDateTime.getUTCFullYear(), tradeDateTime.getUTCMonth(), tradeDateTime.getUTCDate(), tradeDateTime.getUTCHours(), tradeDateTime.getUTCMinutes(), tradeDateTime.getUTCSeconds());
    let time = df.format(tradeDateTimeUTC, 'hh:mm aaa');
    // let time = df.format(row[1], 'hh:mm aaa');
    let expiry = row[3].slice(2, 4) + '/' + row[3].slice(4) + '/' + row[3].slice(0, 2);
    let details = row[6] + '@' + row[7].toFixed(2);
    let premium = row[6] * row[7] * 100;
    optionsFlow = [[time, row[2].slice(1), expiry, row[5], row[4], row[9], details, row[0], premium, row[8]], ...optionsFlow]
    if (row[4] === 'C') {
      calls += premium;
    } else {
      puts += premium;
    }

    callPercentage = Math.round((calls/(calls + puts)) * 100);
    putPercentage = Math.round((puts/(calls + puts)) * 100);

    if (row[8] === 'bearish') {
      bears += premium;
    } else {
      bulls += premium;
    }
    flowSentimentGraphValue = Math.round((bulls/(bulls+bears)) * 100);

    if (flowSentimentGraphValue >= 60) {
      flowSentimentValue = "Bullish";
    } else if (flowSentimentGraphValue < 50) {
      flowSentimentValue = "Bearish";
    } else {
      flowSentimentValue = "Neutral";
    }

    putToCall = puts/calls;
  };


  const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];

  function abbreviateNumber(number){
      // what tier? (determines SI symbol)
      let tier = Math.log10(Math.abs(number)) / 3 | 0;

      // if zero, we don't need a suffix
      if(tier == 0) return number.toFixed(1);

      // get suffix and determine scale
      let suffix = SI_SYMBOL[tier];
      let scale = Math.pow(10, tier * 3);

      // scale the number
      let scaled = number / scale;

      // format number and add suffix
      return scaled.toFixed(1) + suffix;
  }


  function setProgress() {
    let progressSpinner = document.getElementsByClassName("progress-spinner")[0];
    let middleCircle = document.getElementsByClassName("middle-circle")[0];
    progressSpinner.style.background =
      "conic-gradient(" + progressSpinner.attributes.stroke.nodeValue + " " +
      flowSentimentGraphValue +
      "%,grey " +
      flowSentimentGraphValue +
      "%)";

    middleCircle.style.color = progressSpinner.attributes.stroke.nodeValue;
    middleCircle.innerHTML =
      flowSentimentGraphValue.toString();

    progressSpinner = document.getElementsByClassName("progress-spinner")[1];
    middleCircle = document.getElementsByClassName("middle-circle")[1];
    progressSpinner.style.background =
      "conic-gradient(" + progressSpinner.attributes.stroke.nodeValue + " " +
      putToCall +
      "%,grey " +
      putToCall +
      "%)";

    middleCircle.style.color = progressSpinner.attributes.stroke.nodeValue;
    middleCircle.innerHTML =
      putToCall.toFixed(2).toString();

    progressSpinner = document.getElementsByClassName("progress-spinner")[2];
    middleCircle = document.getElementsByClassName("middle-circle")[2];
    progressSpinner.style.background =
      "conic-gradient(" + progressSpinner.attributes.stroke.nodeValue + " " +
      putPercentage +
      "%,grey " +
      putPercentage +
      "%)";

    middleCircle.style.color = progressSpinner.attributes.stroke.nodeValue;
    middleCircle.innerHTML =
      putPercentage.toString() + "%";

    progressSpinner = document.getElementsByClassName("progress-spinner")[3];
    middleCircle = document.getElementsByClassName("middle-circle")[3];
    progressSpinner.style.background =
      "conic-gradient(" + progressSpinner.attributes.stroke.nodeValue + " " +
      callPercentage +
      "%,grey " +
      callPercentage +
      "%)";

    middleCircle.style.color = progressSpinner.attributes.stroke.nodeValue;
    middleCircle.innerHTML =
      callPercentage.toString() + '%';
  }


  onDestroy(() => {
    if (socket) {
      socket.close();
    }
  });
</script>

<div class="option-flow-summary">
	<div class="input-fields">
		<div class="search">
			<input type="text" class="search-input with-icon" placeholder="Symbol Lookup" />
		</div>
	</div>
	<div class="summary">
		<div class="row">

      <div class="col-xl-3 col-lg-6">
        <div class="boxed-layout">
          <div class="content">
            <div class="title">Flow Sentiment</div>
            <div class="value">{flowSentimentValue}</div>
          </div>
          <div class="graph">
            <div
              style="
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div stroke="#12F3D3" class="middle-circle"></div>
              <div stroke="#12F3D3" class="progress-spinner"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-lg-6">
        <div class="boxed-layout">
          <div class="content">
            <div class="title">Put To Call</div>
            <div class="value">{putToCall.toFixed(3)}</div>
          </div>
          <div class="graph">
            <div
              style="
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div stroke="rgb(129, 95, 255)" class="middle-circle"></div>
              <div stroke="rgb(129, 95, 255)" class="progress-spinner"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-lg-6">
        <div class="boxed-layout">
          <div class="content">
            <div class="title">Put Flow</div>
            <div class="value">{abbreviateNumber(puts)}</div>
          </div>
          <div class="graph">
            <div
              style="
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div stroke="#FF5C93" class="middle-circle"></div>
              <div stroke="#FF5C93" class="progress-spinner"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-lg-6">
        <div class="boxed-layout">
          <div class="content">
            <div class="title">Call Flow</div>
            <div class="value">{abbreviateNumber(calls)}</div>
          </div>
          <div class="graph">
            <div
              style="
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div stroke="#12F3D3" class="middle-circle"></div>
              <div stroke="#12F3D3" class="progress-spinner"></div>
            </div>
          </div>
        </div>
      </div>
		</div>
	</div>
</div>
<div class="option-flow-table">
	<div class="row">
		<div class="col-xl-12">
			<div class="table-wrapper">
				<div class="table-header">
					<div class="title">Realtime Option Flow</div>
					<div class="btn-block">
						<button>
							<i class="icofont-download" />
						</button>
						<button>
							<i class="icofont-question" />
						</button>
						<button>
							<i class="icofont-close" />
						</button>
					</div>
				</div>
				<div class="main-table">
					<table>
						<thead>
							<tr>
								<td>Time</td>
								<td>Ticker</td>
								<td>Exp</td>
								<td>Strike</td>
								<td>C/P</td>
								<td>Spot</td>
								<td>Details</td>
								<td>Type</td>
								<td>Prem</td>
								<td>Sentiment</td>
							</tr>
						</thead>
						<tbody>
							{#each optionsFlow as item, index}
								<tr class={(firstLoad && index <= highlightIndex ? "new-data-fade " : "") + (item[8] > 10000000 ? "green-highlighted" : "")} on:click={() => {
                  goto("/smartflow/" + item[1]), false
              }}>
									<td>{item[0]}</td>
									<td><span class="tag {item[4] === 'C' ? 'calls' : 'puts'}">{item[1]}</span></td>
									<td>{item[2]}</td>
									<td>{item[3]}</td>
									<td>{item[4]}</td>
									<td>{item[5]}</td>
									<td><span class="detail-value">{item[6]}</span></td>
									<td>{item[7]}</td>
									<td><span class="{item[4] === 'C' ? 'premium-calls' : 'premium-puts'}">{abbreviateNumber(item[8])}</span></td>
									
									<td><span class="tag {item[9] === 'bullish' ? 'calls' : 'puts'}">{item[9]}</span></td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<!-- <div class="col-xl-4">
			<div class="table-wrapper">
				<div class="table-header">
					<div class="title">Realtime Option Flow</div>
					<div class="btn-block">
						<button>
							<i class="icofont-download" />
						</button>
						<button>
							<i class="icofont-question" />
						</button>
						<button>
							<i class="icofont-close" />
						</button>
					</div>
				</div>
				<div class="main-table">
					<table>
						<thead>
							<tr>
								<td>Time</td>
								<td>Ticker</td>
								<td>Quantity</td>
								<td>Spot</td>
								<td>$MM</td>
								<td />
							</tr>
						</thead>
						<tbody>
							{#each [...new Array(20)] as item, index}
								<tr>
									<td>04:05 PM</td>
									<td><span class="tag dal">DAL</span></td>
									<td>1,672,920</td>
									<td>$42.36 </td>
									<td class="mm-value">$68M</td>
									<td>
										<svg
											width="22"
											height="6"
											viewBox="0 0 22 6"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<circle
												r="2.35714"
												transform="matrix(1 0 0 -1 19.6433 2.99979)"
												fill="#7D7D7D"
											/>
											<circle
												r="2.35714"
												transform="matrix(1 0 0 -1 10.9997 2.99979)"
												fill="#7D7D7D"
											/>
											<circle
												r="2.35714"
												transform="matrix(1 0 0 -1 2.35714 2.99979)"
												fill="#7D7D7D"
											/>
										</svg>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div> -->
	</div>
</div>