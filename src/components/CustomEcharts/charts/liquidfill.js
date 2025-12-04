export default {
  title: {
    show: true,
    left: 'center',
    top: '25%',
    textStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontFamily: 'SourceHanSansSC-Regular',
      // eslint-disable-next-line new-cap
      fontSize: window.CALCULATE_SIZE(14),
      fontWeight: 500,
    },
    text: '实时负载率',
  },
  series: [
    {
      type: 'liquidFill',
      // name: '负荷率',
      // data: [0.6, 0.5],
      radius: '100%',
      color: ['#0081E9', '#18E6FF'],
      label: {
        show: true,
        top: '80%',
        color: '#fff',
        position: ['50%', '65%'],
        // insideColor: '#fff',
        // eslint-disable-next-line new-cap
        fontSize: window.CALCULATE_SIZE(30),
        fontFamily: 'PangMenZhengDao',
        fontWeight: 'bold',
        align: 'center',
        baseline: 'middle',
      },
      waveLength: '90%',
      outline: {
        show: true,
        borderDistance: 1,
        itemStyle: {
          color: 'none',
          borderColor: '#294D99',
          borderWidth: 0,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
        },
      },
      period: 10000,
      animationDurationUpdate: 0,
      backgroundStyle: {
        color: 'transparent',
      },
    },
  ],
};
