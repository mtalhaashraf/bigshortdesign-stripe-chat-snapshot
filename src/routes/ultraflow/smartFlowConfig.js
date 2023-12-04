import Highcharts from 'highcharts/highstock.js';

export const createChartConfig =  (sfThreshold, manipulationThreshold) => {
  return {
    chart: {
      style: {
        cursor: 'crosshair',
      },
      height: '',
      events: {
        load: function() {
          this.renderer.globalAnimation = false;
        },
        
      }
    },
    credits: {
      enabled: false,
    },
    yAxis: [{
      // ohlc data
      labels: {
          align: 'left'
      },
      height: '40%',
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      gridLineWidth: 1,
      opposite: true,
      crosshair: {
        snap: false,
        enabled: true
      },
    }, {
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      height: '40%',
      opposite: false,
      labels: {
        enabled: false,
      }
    }, {
      // tally
      tickPositioner: function () {

        var maxDeviation = Number((Math.max(Math.abs(this.dataMax), Math.abs(this.dataMin))).toFixed(2));
        var halfMaxDeviation = Number((maxDeviation / 2).toFixed(2));
        var onePercent = Number((maxDeviation/10).toFixed(2));

        if (!maxDeviation) {
          maxDeviation = 1;
          halfMaxDeviation = 0.5;
        }
        return [-maxDeviation-onePercent, -halfMaxDeviation, 0, halfMaxDeviation, maxDeviation+onePercent];
      },
      labels: {
        align: 'left',
        formatter: function() {
          if (this.value > 1000000 || this.value < -1000000) {
            return Highcharts.numberFormat(this.value / 1000000, 1) + "M"
          } else if (this.value > 1000 || this.value < -1000) {
            return Highcharts.numberFormat(this.value / 1000, 1) + "K";
          } else {
            return this.value
          }
        }
      },
      top: '42%',
      height: '13%',
      offset: 0,
      alignTicks: true,
      showLastLabel: true,
      plotLines: [{
        value: 0,
        color: 'dodgerblue',
        width: 0.60,
        zIndex: 1
      }],
      opposite: true,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      gridLineWidth: 1,
      crosshair: {
        snap: false,
        enabled: true
      },
    }, {
      labels: {
        enabled: false,
      },
      opposite: false,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      top: '42%',
      height: '13%',
    }, {
      // smart flow
      tickPositioner: function () {
        let max = Math.max(Math.abs(this.dataMax), Math.abs(this.dataMin));
        max = max > sfThreshold ? max : sfThreshold;
        var maxDeviation = Number(max.toFixed(2));
        var halfMaxDeviation = Number((maxDeviation / 2).toFixed(2));
        // var onePercent = Number((maxDeviation/10).toFixed(2));
        let onePercent = 0;

        if (!maxDeviation) {
          maxDeviation = 1;
          halfMaxDeviation = 0.5;
        }
        return [Number((-maxDeviation-onePercent).toFixed(2)), -halfMaxDeviation, 0, halfMaxDeviation, Number((maxDeviation+onePercent).toFixed(2))];
      },
      labels: {
        align: 'left',
        formatter: function() {
          if (this.value > 1000000 || this.value < -1000000) {
            return Highcharts.numberFormat(this.value / 1000000, 1) + "M"
          } else if (this.value > 1000 || this.value < -1000) {
            return Highcharts.numberFormat(this.value / 1000, 1) + "K";
          } else {
            return this.value
          }
        }
      },
      top: '57%',
      height: '13%',
      offset: 0,
      alignTicks: true,
      showLastLabel: true,
      plotLines: [{
        value: 0,
        color: 'dodgerblue',
        width: 0.60,
        zIndex: 1
      }],
      opposite: true,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      gridLineWidth: 1,
      crosshair: {
        snap: false,
        enabled: true
      },

    }, {
      labels: {
        enabled: false,
      },
      opposite: false,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      top: '57%',
      height: '13%',
    }, {
      // manipulation
      tickPositioner: function () {
        let max = Math.max(Math.abs(this.dataMax), Math.abs(this.dataMin));
        max = max > manipulationThreshold ? max : manipulationThreshold;
        var maxDeviation = Number(max.toFixed(2));
        var halfMaxDeviation = Number((maxDeviation / 2).toFixed(2));
        // var onePercent = Number((maxDeviation/10).toFixed(2));
        let onePercent = 0;

        if (!maxDeviation) {
          maxDeviation = 1;
          halfMaxDeviation = 0.5;
        }
        return [Number((-maxDeviation-onePercent).toFixed(2)), -halfMaxDeviation, 0, halfMaxDeviation, Number((maxDeviation+onePercent).toFixed(2))];
      },
      labels: {
          align: 'left'
      },
      top: '72%',
      height: '13%',
      offset: 0,
      alignTicks: true,
      showLastLabel: true,
      plotLines: [{
        value: 0,
        color: 'dodgerblue',
        width: 0.60,
        zIndex: 1
      }],
      opposite: true,
      gridLineWidth: 1,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      crosshair: {
        snap: false,
        enabled: true
      },
    }, {
      labels: {
        enabled: false,
      },
      opposite: false,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      top: '72%',
      height: '13%',
    }, {
      // volume
      tickPositioner: function () {

        var maxDeviation = Number((Math.max(Math.abs(this.dataMax), Math.abs(this.dataMin))).toFixed(2));
        var halfMaxDeviation = Number((maxDeviation / 2).toFixed(2));
        var onePercent = Number((maxDeviation/10).toFixed(2));

        if (!maxDeviation) {
          maxDeviation = 1;
          halfMaxDeviation = 0.5;
        }
        return [0, 0, 0, 0, Number((maxDeviation+onePercent).toFixed(2))];
      },
      labels: {
          align: 'left',
          formatter: function() {
            if (this.value > 1000000 || this.value < -1000000) {
              return Highcharts.numberFormat(this.value / 1000000000, 1) + "B"
            } else if (this.value > 100000000 || this.value < -100000000) {
              return Highcharts.numberFormat(this.value / 1000000000, 1) + "B";
            } else if (this.value > 1000000 || this.value < -1000000) {
              return Highcharts.numberFormat(this.value / 1000000, 1) + "M";
            } else if (this.value > 100000 || this.value < -100000) {
              return Highcharts.numberFormat(this.value / 1000000, 1) + "M";
            } else if (this.value > 1000 || this.value < -1000) {
              return Highcharts.numberFormat(this.value / 1000, 1) + "K";
            } else if (this.value > 100 || this.value < -100) {
              return Highcharts.numberFormat(this.value / 1000, 1) + "K";
            } else {
              return this.value;
            }
          }
      },
      top: '87%',
      height: '13%',
      offset: 0,
      opposite: true,
      gridLineWidth: 1,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      crosshair: {
        snap: false,
        enabled: true
      },
    }, {
      labels: {
        enabled: false,
      },
      opposite: false,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      top: '87%',
      height: '13%',
    }, {
      // navigator
      labels: {
          align: 'left'
      },
      offset: 0
    }],
    tooltip: {
        shape: 'square',
        headerShape: 'callout',
        borderWidth: 0,
        shadow: false,
        className: 'custom-tooltip',
        callVolToolTip: null,
        putVolToolTip: null,
        formatter: function (tooltip) {
          if (this.points) {
            this.points.map(function (point) {
              if (typeof point.key !== 'number') {
                point.series.name = point.key;
              }
            });
          }
          return tooltip.defaultFormatter.call(this, tooltip);
        },
        positioner: function (width, height, point) {
            var chart = this.chart,
                position;
            if (point.isHeader) {
                position = {
                    x: Math.max(
                        chart.plotLeft,
                        Math.min(
                            point.plotX + chart.plotLeft - width / 2,
                            chart.chartWidth - width - chart.marginRight
                        )
                    ),
                    y: point.plotY
                };
            } else {
                position = {
                    x: point.series && point.series.chart.plotLeft,
                    y: point.series && point.series.yAxis.top - chart.plotTop
                };
            }
  
            return position;
        }
    },
    plotOptions: {
      scatter: {
        states: {
          inactive: {
            opacity: 0.6
          }
        }
      },
      series: {
        events: {
          legendItemClick: function () {
            if (this.index === 8) {
              this.chart.series[5].hide();
            } else if (this.index === 5) {
              this.chart.series[8].hide();
            }
          }
        },
        turboThreshold: 0,
        connectNulls: false,
        dataGrouping: {
          enabled: false
        },
        states: {
          inactive: {
              opacity: 1
          },
        },
        animation: false,
      }
    },
    rangeSelector: {
      inputEnabled: false,
      enabled: false,
    },
    xAxis: [{
      ordinal: true,
      plotLines: [],
      height: '40%',
      tickLength: 0,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      labels: {
        enabled: false,
      }
    }, { 
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      height: '0%' 
    }, {  
      top: '42%',
      height: '13%',
      ordinal: true,
      plotLines: [],
      tickLength: 0,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      labels: {
        enabled: false,
      },
      linkedTo: 0,
    }, {  
      top: '42%',
      height: '0',
      lineWidth: 0.75,
      lineColor: 'darkgrey',
    }, {  
      top: '57%',
      height: '13%',
      ordinal: true,
      plotLines: [],
      tickLength: 0,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      labels: {
        enabled: false,
      },
      linkedTo: 0,
    }, {  
      top: '57%',
      height: '0%',
      lineWidth: 0.75,
      lineColor: 'darkgrey',
    }, {
      top: '72%',
      height: '13%',
      ordinal: true,
      plotLines: [],
      tickLength: 0,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      labels: {
        enabled: false,
      },
      linkedTo: 0,
    }, {  
      top: '72%',
      height: '0%',
      lineWidth: 0.75,
      lineColor: 'darkgrey',
    }, {  
      top: '87%',
      height: '13%',
      ordinal: true,
      plotLines: [],
      tickLength: 0,
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      labels: {
        enabled: false,
      },
      linkedTo: 0,
    }, {  
      top: '87%',
      height: '0%',
      lineWidth: 0.75,
      lineColor: 'darkgrey',
    }],
    legend: {
      enabled: true
    },
    series: [{
      type: 'candlestick',
      id: 'ohlc',
      name: 'Stock Price',
      xAxis: 0,
      yAxis: 0,
      data: [],
      showInLegend: false,
      lastVisiblePrice: {
        enabled: true,
        label: {
          shape: 'square',
          enabled: true,
          backgroundColor: 'black',
          align: 'left',
          padding: 5,
        },
        line: {
          enabled: false
        }
      }
    }, {
      type: 'column',
      id: 'UFTally',
      name: 'UF Tally',
      color: '#75ca9b',
      data: [],
      showInLegend: false,
      xAxis: 2,
      yAxis: 2,
    }, {
      type: 'column',
      id: 'ultraFlow',
      name: 'Ultra Flow',
      data: [],
      showInLegend: false,
      xAxis: 4,
      yAxis: 4,
    }, {
      type: 'line',
      id: 'SVWAPL',
      name: 'SVWAP (L)',
      data: [],
      xAxis: 0,
      yAxis: 0,
      lineWidth: 0.75,
      color: 'green',
      showInLegend: false,
    }, {
      type: 'line',
      id: 'SVWAPS',
      name: 'SVWAP (S)',
      data: [],
      xAxis: 0,
      yAxis: 0,
      lineWidth: 0.75,
      color: 'red',
      showInLegend: false,
    }, {
      type: 'column',
      id: 'volume',
      name: 'Volume',
      data: [],
      xAxis: 8,
      yAxis: 8,
      visible: true,
      showInLegend: false,
      legendIndex: 1,
    }, {
      type: 'line',
      id: 'manipulation',
      name: 'Manipulation',
      data: [],
      xAxis: 6,
      yAxis: 6,
      lineWidth: 0.75,
      color: 'orange',
      visible: true,
      showInLegend: false,
    }, {
      type: 'scatter',
      id: 'darkpool',
      name: 'Dark Pool',
      className: 'darkpool',
      data: [],
      xAxis: 0,
      yAxis: 0,
      visible: true,
      showInLegend: false,
      tooltip: {
        followPointer: true,
      },
      opacity: 0.5,
      marker: {
        symbol: 'circle',
      },
      legendIndex: 8,
    }, {
      type: 'line',
      id: 'callVol',
      name: 'Call Volume',
      data: [],
      className: 'callvol',
      xAxis: 8,
      yAxis: 8,
      lineWidth: 0.75,
      color: 'blue',
      visible: true,
      // linkedTo: 'putVol',
      showInLegend: false,
      legendIndex: 2,
      zIndex: 1,
    }, {
      type: 'line',
      id: 'putVol',
      name: 'Put Volume',
      className: 'putvol',
      data: [],
      xAxis: 8,
      yAxis: 8,
      linkedTo: ':previous',
      lineWidth: 0.75,
      color: 'purple',
      visible: true,
      showInLegend: false,
      zIndex: 1,
    }, {
      type: 'column',
      id: 'unusualCallPrem',
      name: 'Unusual Call Premium',
      data: [],
      xAxis: 8,
      yAxis: 9,
      color: "#548ac0",
      visible: true,
      showInLegend: false,
      legendIndex: 1,
    }, {
      type: 'column',
      id: 'unusualPutPrem',
      name: 'Unusual Put Premium',
      data: [],
      xAxis: 8,
      yAxis: 9,
      // color: '#CC0000',
      color: '#976b97',
      visible: true,
      showInLegend: false,
      legendIndex: 1,
    }],
    responsive: {
      rules: [{
        condition: {
            maxWidth: 800
        },
        chartOptions: {
            rangeSelector: {
                inputEnabled: false
            }
        }
      }]
    }
  }
}