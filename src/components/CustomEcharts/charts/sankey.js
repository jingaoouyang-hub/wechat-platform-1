export default {
  tooltip: {},
  series: [
    {
      type: 'sankey',
      layout: 'none',
      emphasis: {
        focus: 'adjacency',
      },
      right: '15%',
      // draggable: false, // 不给拖拽
      label: {
        position: 'right',
        color: '#000000',
        fontSize: 14,
      },
      lineStyle: {
        color: 'gradient',
        opacity: 0.4,
      },
      data: [],
      links: [],
    },
  ],
};
