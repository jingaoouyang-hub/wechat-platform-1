export default {
  title: {
    show: true,
    left: 10,
    top: '2%',
    textStyle: {
      color: 'rgba(44, 53, 66, 0.65)',
      fontSize: 12,
      fontWeight: 500,
    },
    text: '',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    // valueFormatter: (value) => `${value}台`,
  },
  legend: {
    x: 'right',
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      fontSize: 14,
      color: 'rgba(0, 0, 0, 0.65)',
    },
  },
  dataZoom: {
    // dataZoom 组件 用于区域缩放，
    type: 'inside',
    show: true,
  },
  grid: {
    top: '20%',
    left: '5%',
    right: '5%',
    bottom: '15%',
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      fontSize: 12,
      color: 'rgba(0,0,0,0.65)',
      margin: 18,
    },
    axisTick: {
      show: true,
      alignWithLabel: true,
      lineStyle: {
        color: '#D9D9D9',
      },
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#D9D9D9',
      },
    },
  },
  yAxis: [
    {
      type: 'value',
      splitNumber: 3,
    },
  ],
  series: [
    // {
    //   type: 'bar',
    //   data: [],
    //   barMaxWidth: '35%',
    //   itemStyle: {
    //     borderRadius: [100, 100, 0, 0],
    //   },
    //   color: new echarts.graphic.LinearGradient(
    //     0,
    //     0,
    //     0,
    //     1, // 0,0,1,0表示从左向右    0,0,0,1表示从右向左
    //     [
    //       { offset: 0, color: 'rgba(62, 134, 229, 1)' },
    //       { offset: 1, color: 'rgba(114, 169, 238, 1)' },
    //     ],
    //   ),
    // }
  ],
};
