export default {
  title: [
    {
      text: '0',
      textStyle: {
        color: 'rgba(0,0,0,0.85)',
        fontSize: 30,
        fontWeight: 'normal',
      },
      textAlign: 'center',
      left: '30%',
      top: '43%',
    },
    // {
    //   text: '维保任务',
    //   textStyle: {
    //     color: 'rgba(0,0,0,0.85)',
    //     fontSize: 16,
    //     fontWeight: 'normal',
    //   },
    //   textAlign: 'center',
    //   left: '70%',
    //   top: '10%',
    // },
  ],
  tooltip: {},
  legend: {
    // type: 'scroll',
    left: '65%',
    y: 'center',
    orient: 'vertical',
    height: '40%',
    itemWidth: 10,
    itemHeight: 10,
    icon: 'circle',
    formatter: params => {
      return `{c|${params}} {a| | }{b|85}{d|}`;
    },
    textStyle: {
      rich: {
        a: {
          color: '#D9D9D9',
        },
        b: {
          color: 'rgba(0,0,0,1)',
          fontSize: 14,
        },
        c: {
          color: 'rgba(0,0,0,0.45)',
          fontSize: 14,
        },
        d: {
          padding: 20,
        },
      },
    },
    pageIconColor: 'rgba(0,0,0,0.25)',
    pageIconSize: 10,
    pageTextStyle: {
      fontSize: 12,
      color: 'rgba(0,0,0,0.45)',
    },
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['30%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 4,
      },
      label: {
        show: false,
        position: 'center',
      },
      data: [
        {
          value: 10,
          percentage: 45,
          name: '电耗-排放',
        },
        {
          value: 10,
          percentage: 45,
          name: '水耗-排放',
        },
      ],
    },
    {
      type: 'pie',
      radius: ['0%', '45%'],
      center: ['30%', '50%'],
      avoidLabelOverlap: false,
      silent: true,
      itemStyle: {
        color: '#F1F6FA',
      },
      label: {
        show: false,
      },
      showEmptyCircle: true,
      emptyCircleStyle: {
        color: '#F1F6FA',
      },
    },
  ],
};
