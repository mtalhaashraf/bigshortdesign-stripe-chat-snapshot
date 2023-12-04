export const createChartConfig = (storedTheme) => {
  return {
    legend: {
      enabled: false,
      // layout: 'vertical',
      // align: 'left',
      // verticalAlign: 'top',
      // y: 249,
      // x: -9,
      // padding: 3,
      // itemMarginTop: 5,
      // itemMarginBottom: 5
    },

    credits: {
      enabled: false
    },

    tooltip: {
      shape: 'square',
      headerShape: 'callout',
      borderWidth: 0,
      shadow: false,
      className: 'custom-tooltip',
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
            if (point.series.name === 'Long Volume' || point.series.name === 'Short Volume') {
              position = {
                x: point.series.chart.plotLeft,
                y: point.series.yAxis.top - chart.plotTop + 30
            };
            } else {
              position = {
                  x: point.series.chart.plotLeft,
                  y: point.series.yAxis.top - chart.plotTop
              };
            }
          }

          return position;
      }
  },

    chart: {
      height: '',
      events: {
        load: function() {
          this.renderer.globalAnimation = false;
        }
      },
    },

    scrollbar: {
      liveRedraw: false
    },

    rangeSelector: {
      enabled: false,
    },

    plotOptions: {
      series: {
        events: {
          legendItemClick: function() {
            if (this.index === 1 || this.index === 2) {
              this.chart.series[1].show();
              this.chart.series[2].show();
              this.chart.series[3].hide();
              this.chart.series[4].hide();
              this.chart.series[5].hide();
              this.chart.series[6].hide();
            } else if (this.index > 2 && this.index < 7) {
              this.chart.series[1].hide();
              this.chart.series[2].hide();
              this.chart.series[3].hide();
              this.chart.series[4].hide();
              this.chart.series[5].hide();
              this.chart.series[6].hide();
              this.show();
            }
            return false;
          }
        },
        turboThreshold: 0,
        connectNulls: true,
        dataGrouping: {
          enabled: false
        },
        states: {
          inactive: {
              opacity: 1
          }
        }
      }
    },

    colors: [
      '#2f7ed8',
      '#009933',
      '#cc0000',
      '#910000',
      '#1aadce',
      '#492970',
      '#f28f43',
      '#c42525',
      '#a6c96a'
     ],

     yAxis: [{
      // ohlc data
      labels: {
          align: 'left'
      },
      height: '68%',
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
      height: '68%',
      opposite: false,
      labels: {
        enabled: false,
      }
    }, {
      // indicators
      labels: {
        align: 'left',
      },
      top: '70%',
      height: '30%',
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
      lineWidth: 0.75,
      lineColor: 'darkgrey',
      top: '70%',
      height: '30%',
      opposite: false,
      labels: {
        enabled: false,
      }
    }, {
      // navigator
      labels: {
          align: 'left'
      },
      offset: 0
    }],

    xAxis: [{
      ordinal: true,
      plotLines: [],
      height: '68%',
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
      top: '70%',
      height: '30%',
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
      top: '70%',
      height: '0%',
      lineWidth: 0.75,
      lineColor: 'darkgrey',
    }],

    series: [{
      showInLegend: false,
      id: 'ohlc',
      type: 'candlestick',
    }, {
      type: 'column',
      name: 'Long Volume',
      yAxis: 2,
    }, {
      type: 'column',
      name: 'Short Volume',
      yAxis: 2,
    }, {
      type: 'column',
      name: "Real Volume",
      yAxis: 2,
      visible: false
    }, {
      type: 'column',
      name: 'Short Exempt',
      yAxis: 2,
      visible: false
    }, {
      type: 'column',
      name: 'MSC (Inverse)',
      yAxis: 2,
      visible: false
    }, {
      type: 'column',
      name: 'MASC',
      yAxis: 2,
      visible: false
    }]
  }
}