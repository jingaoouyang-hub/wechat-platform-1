export default {
  grid: {
    top: 20,
    left: 0,
    right: 40,
    bottom: 20,
    containLabel: true,
  },
  xAxis: {
    max: 100,
    type: 'value',
    axisLine: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: [
    {
      type: 'category',
      inverse: true,
      data: ['111'],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
  ],
  series: [
    {
      type: 'pictorialBar',
      itemStyle: {
        normal: {
          color: '#13C2C2',
        },
      },
      emphasis: {
        disabled: true,
      },
      markPoint: {
        symbolOffset: [100, 100],
        symbol: 'circle',
        symbolSize: 20,
        itemStyle: {
          color: 'red',
        },
      },
      // label: {
      //   show: true,
      //   position: 'right',
      //   // offset: [-10, 0],
      //   formatter: [
      //     '{a|}',
      //     '{b|}',
      //   ].join('\n'),

      //   rich: {
      //     a: {
      //       color: 'red',
      //       backgroundColor: {
      //         image: zm,
      //         color:'red'
      //       },
      //       // width:20,
      //       // backgroundColor:'red',
      //       // height: 20
      //     },
      //   }
      // },
      symbol: 'rect',
      symbolRepeat: true,
      symbolMargin: -1,
      symbolClip: true,
      symbolSize: [4, 12],
      symbolPosition: 'start',
      symbolOffset: [0, 0],
      data: [50],
      z: 2,
    },
    {
      type: 'pictorialBar',
      itemStyle: {
        normal: {
          color: '#F0F2F5',
        },
      },
      emphasis: {
        disabled: true,
      },
      label: {
        show: true,
        position: 'right',
        offset: [10, 0],
        formatter: function (o) {
          return o.value + '%';
        },
      },
      symbolRepeat: 'fixed',
      animationDuration: 0,
      symbolMargin: -1,
      symbol: 'rect',
      symbolSize: [4, 12],
      symbolPosition: 'start',
      symbolOffset: [0, 0],
      data: [50],
      z: 1,
    },
  ],
};
