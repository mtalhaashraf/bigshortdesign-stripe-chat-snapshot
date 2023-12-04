export const createChartConfig =  (storedTheme) => {
  return {
     chart: {
       height: '',
       events: {
         load: function() {
           this.renderer.globalAnimation = false;
         }
       },
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
      labels: {
        align: 'left',
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
      labels: {
        align: 'left',
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
      // strength
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
      labels: {
          align: 'left',
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
                     y: point.plotY + 100
                 };
             } else {
                 if (point.series.name === 'OHLC' || point.series.name === 'Real Volume') {
                   position = {
                       x: point.series.chart.plotLeft,
                       y: point.series.yAxis.top - chart.plotTop
                   };
                  } else if (point.series.name === 'Squeeze MSC') {
                      console.log(point.yAxis);
                      position = {
                        x: point.series.chart.plotLeft,
                        y: point.series.yAxis.top - chart.plotTop + 60
                      };
                  // } else if (point.series.name === 'Squeeze Long Vol') {
                  //   console.log(point.yAxis);
                  //   position = {
                  //     x: point.series.chart.plotLeft,
                  //     y: point.series.yAxis.top - chart.plotTop + 30
                  //   };
                  } else {
                    position = {
                      x: point.series.chart.plotLeft,
                      y: point.series.yAxis.top - chart.plotTop + 30
                  };
                }
             }
 
             return position;
         }
     },
     plotOptions: {
       series: {
         // animation: false,
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
     rangeSelector: {
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
      height: '0%',
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
     series: [{
       type: 'candlestick',
       id: 'ohlc',
       name: 'OHLC',
       yAxis: 0,
       xAxis: 0,
       data: [],
     }, {
       type: 'line',
       id: 'BSSA',
       name: 'Honey Badger All',
       yAxis: 2,
       xAxis: 2,
       color: '#7a7a7a',
       data: [],
     }, {
       type: 'line',
       id: 'BSSSP500',
       name: 'Honey Badger SP500',
       yAxis: 2,
       xAxis: 2,
       data: [],
       color: 'green',
     }, {
       type: 'column',
       id: 'BSLV',
       name: 'Squeeze Long Vol',
       yAxis: 4,
       xAxis: 4,
       color: 'green',
       data: [],
     }, {
       type: 'column',
       id: 'BSSV',
       name: 'Squeeze Short Vol',
       yAxis: 4,
       xAxis: 4,
       data: [],
       color: '#DC143C',
     }, {
       type: 'column',
       id: 'BSVIMSC',
       name: 'Squeeze MSC',
       yAxis: 6,
       xAxis: 6,
       data: [],
       color: 'orange',
     }, {
       type: 'column',
       id: 'Real Volume',
       name: 'Real Volume',
       yAxis: 8,
       xAxis: 8,
       data: [],
       color: '#DC143C',
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