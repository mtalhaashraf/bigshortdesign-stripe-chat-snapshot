<script>
  import Highcharts from 'highcharts/highstock.js';
  import { onDestroy,onMount } from 'svelte';
  import { Wave } from 'svelte-loading-spinners';
  import { createChartConfig } from './shortvolConfig.js';

  let width = '100%';

  let height, chart, token, chartConfig,  indicatorOptions;
  let zoomed = false;
  let showDetails = false;
  let companyName = '';
  let placeHolderSymbol = 'SPY';
  let displaySymbol = '';
  let inputSymbol = '';
  let loaded = false;

  let chartSettings = {
    lsVolume: true,
    realVolume: false,
    shortExempt: false,
    msc: false,
    masc: false,
  }

  onMount(() => {
    let storedTheme = localStorage.getItem("theme");
    indicatorOptions = localStorage.getItem('indicators');
    chartSettings = localStorage.getItem("chartSettingsSV");
    chartConfig = createChartConfig(storedTheme);

    if (!chartSettings) {
      chartSettings = {
        lsVolume: true,
        realVolume: false,
        shortExempt: false,
        msc: false,
        masc: false,
      }
      localStorage.setItem('chartSettingsSV', JSON.stringify(chartSettings));
    } else {
      chartSettings = JSON.parse(chartSettings);
    }

    if (window && window.addEventListener) {
      height = window.innerHeight - 160;
    }
  
    window.addEventListener('resize', () => {
      height = window.innerHeight - 160;
      if (chart && chart.options && chart.options.chart) {
        chart.options.chart.height = height;
        chart.reflow();
      }
    })
    const graphs = window.document.querySelectorAll('.graph-area');
      const myObserver = new ResizeObserver(entries => {
        let widthValueHolder = '100%';
        let heightValueHolder = '100%';
        for (let entry of entries) {
          widthValueHolder = entry.contentRect.width;
          heightValueHolder = entry.contentRect.height;
        }

        if (chart) {
          chart.update({
            width: widthValueHolder,
            height: heightValueHolder,
          })
          chart.reflow();
        }
      });

      graphs.forEach(graph => {
        myObserver.observe(graph);
      })

  })

  onMount(()=>{
    getSymbolData(placeHolderSymbol);
  })

  const getSymbolData = async symbol => {
    try {
      // let shortVolData = await fetch(`http://localhost:8080/getSqueeze?token=${token}&symbol=${symbol}`, {
        let shortVolData = await fetch(`https://us-central1-auth-development-33b83.cloudfunctions.net/getSqueeze?token=${token}&symbol=${symbol}`, {
        method: 'GET',
        mode: 'cors',
      })

      shortVolData = await shortVolData.json();
      if (shortVolData.error) {
        alert(shortVolData.error);
        return;
      }
      displaySymbol = symbol;
      organizeData(shortVolData);
      
    } catch (e) {
      console.log(e)
    }

  }
  // })

  const organizeData = (shortVolData) => {
    console.log(shortVolData)
    const data = shortVolData[1][3];
    const ohlc = [];
    const longVol = [];
    const shortVol = [];
    const realVol = [];
    const shortExempt = [];
    const imsc = [];
    const masc = [];

    for (let i = 0; i < data.length; i++) {
      ohlc.push({
        x: data[i][0],
        open: data[i][1],
        high: data[i][2],
        low: data[i][3],
        close: data[i][4],
        color: data[i][4] > data[i][1] ? 'green' : "#DC143C",
      })
      realVol.push([data[i][0], data[i][5]]);
      longVol.push([data[i][0], data[i][7]]);
      shortVol.push([data[i][0], data[i][8]]);
      shortExempt.push([data[i][0], data[i][9]]);
      imsc.push([data[i][0], data[i][7] - data[i][8]])

      if (i === 0) {
        masc.push([data[i][0], data[i][8] - data[i][7]]);
      } else {
        masc.push([data[i][0], masc[i-1][1] - imsc[i][1]]);
      }

    }
    
    chartConfig.series[0].name = shortVolData[0];
    companyName = shortVolData[1][1];

    chartConfig.series[0].data = ohlc;
    chartConfig.series[1].data = longVol;
    chartConfig.series[2].data = shortVol;
    chartConfig.series[3].data = realVol;
    chartConfig.series[4].data = shortExempt;
    chartConfig.series[5].data = imsc;
    chartConfig.series[6].data = masc;
    chartConfig.chart.height = height;

    chartConfig.series[1].visible = chartSettings.lsVolume;
    chartConfig.series[2].visible = chartSettings.lsVolume;
    chartConfig.series[3].visible = chartSettings.realVolume;
    chartConfig.series[4].visible = chartSettings.shortExempt;
    chartConfig.series[5].visible = chartSettings.msc;
    chartConfig.series[6].visible = chartSettings.masc;
    chart = Highcharts.stockChart('container', chartConfig);

    chart.xAxis[0].setExtremes(data[data.length - 120][0], data[data.length - 1][0]);
    loaded = true;
  }

  const chartOptions = (option) => {
    if (option === 'lsVolume') {
      chartSettings.lsVolume = !chartSettings.lsVolume;
      chartSettings.realVolume = false;
      chartSettings.shortExempt = false;
      chartSettings.msc = false;
      chartSettings.masc = false;
      chart.series[1][chartSettings.lsVolume ? 'show' : 'hide']();
      chart.series[2][chartSettings.lsVolume ? 'show' : 'hide']();
      chart.series[3]['hide']();
      chart.series[4]['hide']();
      chart.series[5]['hide']();
      chart.series[6]['hide']();
    } else if (option === 'realVolume') {
      chartSettings.lsVolume = false;
      chartSettings.realVolume = !chartSettings.realVolume;
      chartSettings.shortExempt = false;
      chartSettings.msc = false;
      chartSettings.masc = false;
      chart.series[1]['hide']();
      chart.series[2]['hide']();
      chart.series[3][chartSettings.realVolume ? 'show' : 'hide']();
      chart.series[4]['hide']();
      chart.series[5]['hide']();
      chart.series[6]['hide']();
    } else if (option === 'shortExempt') {
      chartSettings.lsVolume = false;
      chartSettings.realVolume = false;
      chartSettings.shortExempt = !chartSettings.shortExempt;
      chartSettings.msc = false;
      chartSettings.masc = false;
      chart.series[1]['hide']();
      chart.series[2]['hide']();
      chart.series[3]['hide']();
      chart.series[4][chartSettings.shortExempt ? 'show' : 'hide']();
      chart.series[5]['hide']();
      chart.series[6]['hide']();
    } else if (option === 'msc') {
      chartSettings.lsVolume = false;
      chartSettings.realVolume = false;
      chartSettings.shortExempt = false;
      chartSettings.msc = !chartSettings.msc;
      chartSettings.masc = false;
      chart.series[1]['hide']();
      chart.series[2]['hide']();
      chart.series[3]['hide']();
      chart.series[4]['hide']();
      chart.series[5][chartSettings.msc ? 'show' : 'hide']();
      chart.series[6]['hide']();
    } else {
      chartSettings.lsVolume = false;
      chartSettings.realVolume = false;
      chartSettings.shortExempt = false;
      chartSettings.msc = false;
      chartSettings.masc = !chartSettings.masc;
      chart.series[1]['hide']();
      chart.series[2]['hide']();
      chart.series[3]['hide']();
      chart.series[4]['hide']();
      chart.series[5]['hide']();
      chart.series[6][chartSettings.masc ? 'show' : 'hide']();
    }
    localStorage.setItem('chartSettingsSV', JSON.stringify(chartSettings));
  }

  const changeEvent = e => {
    loaded = false;
    if (chart) chart.destroy;
    getSymbolData(inputSymbol);
    inputSymbol = "";
  };

  const inputEvent = e => {
    inputSymbol = e.target.value.toUpperCase();
  };

  onDestroy(() => {
    if (chart) chart.destroy();
  })
</script>

<div class="graph-area" class:info-active={showDetails} id="graph-area">
  <div class="main-graph-block1" class:zoomed id="main-graph-block1">
      <div class="top-left">
          <div class="legends">
            <div class="input-fields">
              <div class="search">
                <input value="{inputSymbol}" placeholder="{placeHolderSymbol}" on:focus={() => { placeHolderSymbol = "" }} on:focusout={() => placeHolderSymbol=displaySymbol} on:input={e => {
                  inputEvent(e)
                }} on:keypress={(e) => {
                  if (e.key === 'Enter') {
                    changeEvent(e)
                  }
                }} type="text" class="search-input with-icon" />
                </div>
              </div>
              <p class=""><span style="font-size: 2em;" class="higlight-number1">{displaySymbol}</span></p>
              <div style="align-items: center;" class="handles">
                <div class="heading" on:click={() => (zoomed = !zoomed)}>
                    <i class="icofont-ui-zoom-in" />
                    <i class="icofont-ui-zoom-out" />
                </div>
            </div>
        </div>
      </div>
      <div class="top-left">
        <div class="legends2">
            <div class="checkboxes">
                <div class="checkbox-group">
                    <div class="group">
                        <input on:click={() => chartOptions('lsVolume')} checked={chartSettings.lsVolume} type="checkbox" name="" id="" />
                        <div class="data">Long/Short Volume <span style="background-color: #0A4A0E;" /></div>
                    </div>
                </div>
            </div>

            <div class="checkboxes">
                <div class="checkbox-group">
                    <div class="group">
                        <input on:click={() => chartOptions('realVolume')} checked={chartSettings.realVolume} type="checkbox" name="" id="" />
                        <div class="data">Real Volume</div>
                    </div>
                </div>
            </div>
            <div class="checkboxes">
                <div class="checkbox-group">
                    <div class="group">
                        <input on:click={() => chartOptions('shortExempt')} checked={chartSettings.shortExempt} type="checkbox" name="" id="" />
                        <div class="data">Short Exempt</div>
                    </div>
                </div>
            </div>
            <div class="checkboxes">
                <div class="checkbox-group">
                    <div class="group">
                        <input on:click={() => chartOptions('msc')} checked={chartSettings.msc} type="checkbox" name="" id="" />
                        <div class="data">MSC (Inverse)</div>
                    </div>
                </div>
            </div>
            <div class="checkboxes">
                <div class="checkbox-group">
                    <div class="group">
                        <input on:click={() => chartOptions('masc')} checked={chartSettings.masc} type="checkbox" name="" id="" />
                        <div class="data">MASC</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    {#if !loaded}
      <div style='margin-top: 200px; align-items: center; justify-content: center; display: flex; position: relative;'>
        <Wave size="30" color="#FF3E00" unit='px' duration="1s"></Wave>
      </div>
    {/if}
    <div style="display: {loaded ? "" : 'none'}" id='container'></div>
  </div>
  <!-- main-graph-block ends here -->
</div>
