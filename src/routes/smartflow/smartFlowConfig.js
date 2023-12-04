import Highcharts from 'highcharts/highstock.js';

export const createChartConfig =  (sfThreshold, manipulationThreshold, scale) => {
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
        if (scale) {
          max = max > sfThreshold ? max : sfThreshold;
        }
        var maxDeviation = Number(max.toFixed(2));
        var halfMaxDeviation = Number((maxDeviation / 2).toFixed(2));
        var onePercent = Number((maxDeviation/10).toFixed(2));
        
        if (scale) {
          onePercent = 0;
        }

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
        if (scale) {
          max = max > manipulationThreshold ? max : manipulationThreshold;
        }
        var maxDeviation = Number(max.toFixed(2));
        var halfMaxDeviation = Number((maxDeviation / 2).toFixed(2));
        var onePercent = Number((maxDeviation/10).toFixed(2));
        
        if (scale) {
          onePercent = 0;
        }

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
        formatter: function (tooltip) {
          // if (this.x && this.y) {
            // console.log(this);
            if (this.series && this.series.name === 'Dark Pool') {
              let date = new Date(this.x);
              let hours = date.getHours() + 7;
              let minutes = date.getMinutes();
              let amPm = 'am';
              hours = hours < 10 ? '0' + hours : hours;
              minutes = minutes < 10 ? '0' + minutes : minutes;
              if (hours >= 12) {
                amPm = 'pm';
                if (hours > 12) {
                  hours - 12;
                }
              }
              this.point.x = `${hours}:${minutes} ${amPm}`;
              this.point.y = this.y ? Number(this.y).toFixed(2) : this.y;
              return `
                <div><span style="color:${this.point.color}">\u25CF</span>&nbsp;<b>${this.series.name}</b></div><br />
                <div>Time: ${this.point.x}</div><br />
                <div>Price: ${this.point.y}</div><br />
                <div>Volume: ${Highcharts.numberFormat(this.point.volume, 0)}</div>
              `
            }
            if (this.points) {
              this.points.map(function (point) {
                if (typeof point.key !== 'number') {
                  point.series.name = point.key;
                }
              });
            }
            return tooltip.defaultFormatter.call(this, tooltip);
          // }
        },
        positioner: function (width, height, point) {
          // if (point) {
            var chart = this.chart,
                position;
            // console.log(point)
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
            } else if (point.negative === false && !point.series) {
              let side = -100;
              if (chart.chartWidth/2 > point.plotX) {
                side = 20;
              }

              position = {
                x: chart.plotLeft,
                // x: 10,
                y: chart.plotTop 
                // x: point.plotX + side,
                // // x: 10,
                // y: point.plotY - 20
            };
            } else {
                position = {
                    x: point.series && point.series.chart.plotLeft,
                    // x: 10,
                    y: point.series && point.series.yAxis.top - chart.plotTop
                };
            }
  
            return position;
          }
        // }
    },
    plotOptions: {
      // column: {
      //   grouping: false,
      // },
      scatter: {
        states: {
          inactive: {
            opacity: 0.6
          }
        },
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
      id: 'SFTally',
      name: 'SF Tally',
      color: '#75ca9b',
      data: [],
      showInLegend: false,
      xAxis: 2,
      yAxis: 2,
    }, {
      type: 'column',
      id: 'smartFlow',
      name: 'Smart Flow',
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
      visible: false,
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
    // }, {
    //   type: 'column',
    //   id: 'sweepsCalls',
    //   name: 'Sweeps (Calls)',
    //   data: [],
    //   xAxis: 8,
    //   yAxis: 9,
    //   color: '#87CEEB',
    //   borderColor: 'green',
    //   borderWidth: 0.5,
    //   visible: true,
    //   stacking: 'normal',
    //   stack: 'calls',
    //   groupPadding: 0.15,
    //   showInLegend: false,
    //   pointPadding: 0.2,
    //   zIndex: -1,
    // }, {
    //   type: 'column',
    //   id: 'blocksCalls',
    //   name: 'Blocks (Calls)',
    //   data: [],
    //   xAxis: 8,
    //   yAxis: 9,
    //   visible: true,
    //   showInLegend: false,
    //   borderColor: 'green',
    //   zIndex: -1,
    //   stack: 'calls',
    //   groupPadding: 0.15,
    //   pointPadding: 0.2,
    //   borderWidth: 0.5,
    //   color: '#FFFFF0',
    //   stacking: 'normal',
    //   stack: 'calls',
    // }, {
    //   type: 'column',
    //   id: 'splitsCalls',
    //   name: 'Splits (Calls)',
    //   data: [],
    //   xAxis: 8,
    //   stack: 'calls',
    //   borderColor: 'green',
    //   yAxis: 9,
    //   groupPadding: 0.15,
    //   pointPadding: 0.2,
    //   borderWidth: 0.5,
    //   color: '#DDA0DD',
    //   visible: true,
    //   showInLegend: false,
    //   stacking: 'normal',
    //   zIndex: -1,
    // }, {
    //   type: 'column',
    //   id: 'sweepsPuts',
    //   name: 'Sweeps (Puts)',
    //   data: [],
    //   xAxis: 8,
    //   groupPadding: 0.15,
    //   stack: 'puts',
    //   borderColor: 'red',
    //   borderWidth: 0.5,
    //   pointPadding: 0.2,
    //   yAxis: 9,
    //   color: '#87CEEB',
    //   visible: true,
    //   stacking: 'normal',
    //   showInLegend: false,
    //   zIndex: -1,
    // }, {
    //   type: 'column',
    //   id: 'blocksPuts',
    //   name: 'Blocks (Puts)',
    //   data: [],
    //   xAxis: 8,
    //   borderWidth: 0.5,
    //   yAxis: 9,
    //   visible: true,
    //   showInLegend: false,
    //   stack: 'puts',
    //   zIndex: -1,
    //   groupPadding: 0.15,
    //   borderColor: 'red',
    //   pointPadding: 0.2,
    //   color: '#FFFFF0',
    //   stacking: 'normal',
    // }, {
    //   type: 'column',
    //   id: 'splitsPuts',
    //   name: 'Splits (Puts)',
    //   data: [],
    //   borderWidth: 0.5,
    //   xAxis: 8,
    //   stack: 'puts',
    //   borderColor: 'red',
    //   yAxis: 9,
    //   groupPadding: 0.15,
    //   pointPadding: 0.2,
    //   color: '#DDA0DD',
    //   visible: true,
    //   showInLegend: false,
    //   stacking: 'normal',
    //   zIndex: -1,
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