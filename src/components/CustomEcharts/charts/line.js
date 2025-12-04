const color = ['#3E86E5', '#63C2DE', '#F6C142', '#48C6A1', '#F86C6B', '#FF7D43'];
const series = color.map(() => {
  return {
    type: 'line',
    smooth: true,
    symbolSize: 4,
    emphasis: {
      scale: 2.5,
    },
    // areaStyle: {
    //   opacity: 0.07,
    // },
    // showSymbol: false,
  };
});

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
  grid: {
    left: '2%',
    top: '20%',
    right: '2%',
    bottom: '5%',
    containLabel: true,
  },
  color,
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
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisTick: {
      show: true,
      lineStyle: {
        color: '#E9E9E9',
      },
    },
    axisLabel: {
      fontSize: 12,
      color: 'rgba(0,0,0,0.65)',
      margin: 18,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#E9E9E9',
      },
    },
    data: [],
  },
  yAxis: {
    type: 'value',
    splitNumber: 3,
    nameTextStyle: {
      fontSize: 12,
      color: '#2C3542',
      align: 'left',
    },
    axisLabel: {
      fontSize: 12,
      color: 'rgba(0,0,0,0.65)',
    },
    splitLine: {
      lineStyle: {
        color: '#E9E9E9',
        type: 'dashed',
      },
    },
  },
  series,
};
