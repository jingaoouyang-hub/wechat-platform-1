<template>
  <div :id="chartBoxid" class="w-100 h-100 flex-center"></div>
</template>

<script>
/**
 * 组件说明
 * */
import * as echarts from 'echarts';
import defaultOption from './defaultOption';
import * as lodash from 'lodash';

// import 'echarts-liquidfill';
const fixOption = {
  title: {
    show: true,
    left: 0,
    top: 0,
    padding: 0,
    textStyle: {
      color: 'rgba(0,0,0,0.65)',
      fontFamily: 'SourceHanSansSC-Regular',
      fontSize: 14,
      fontWeight: 500,
    },
    text: '',
  },
  xAxis: {
    // boundaryGap: false,
    axisLabel: {
      fontSize: 12,
      color: 'rgba(0,0,0,0.65)',
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#E9E9E9',
      },
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#E9E9E9',
      },
    },
  },
  legend: {
    top: '5%',
    x: 'center',
    icon: 'rect',
    itemWidth: 10,
    itemHeight: 3,
    textStyle: {
      fontSize: 12,
      color: 'rgba(0,0,0,0.65)',
    },
  },
  tooltip: {
    trigger: 'axis',
  },
  yAxis: {
    type: 'value',
    nameTextStyle: {
      fontSize: 12,
      color: '#2C3542',
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
};
import emptyImg from '@/assets/icons/common/empty.png';

// const emptyImg = require('@/assets/icons/common/empty.png');
// const emptyImg = '';
const emptyOption = {
  title: {
    show: false,
    left: 0,
    top: 0,
    padding: 0,
    textStyle: {
      color: '#fff',
      fontFamily: 'SourceHanSansSC-Regular',
      fontSize: 14,
      fontWeight: 500,
    },
    text: 'CO₂',
  },
  grid: {
    show: true,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    containLabel: true,
    borderColor: '#ccc',
    borderWidth: 0,
  },
  xAxis: {
    show: false,
  },
  yAxis: {
    show: false,
  },
  graphic: {
    elements: [
      {
        type: 'image',
        left: 'center',
        top: 'center',
        style: {
          image: emptyImg,
          width: 120,
          height: 130,
        },
      },
      // {
      //   type: 'text',
      //   left: 'center',
      //   top: '85%',
      //   style: {
      //     text: '暂无数据',
      //     fill: 'rgba(0,0,0,0.85)',
      //   },
      // },
    ],
  },
};
// 导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
export default {
  // import引入的组件需要注入到对象中才能使用
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Chart',
  components: {},
  // 过滤器
  filters: {},
  props: {
    id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    notMerge: {
      // 图表的配置项和数据
      type: Boolean,
      default: true,
    },
    defalutOption: {
      type: Object,
      default: () => {
        return {};
      },
    },
    fixOption: {
      type: Boolean,
      default: false,
    },
    // 配置参数
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    this.nowChart = null;
    // 这里存放数据
    return {
      chartBoxid: '',
      // 保存chart元素
      chartDom: '',
    };
  },
  // 计算属性
  computed: {
    getType() {
      if (this.type) {
        return this.type.trim();
      }
      return null;
    },
  },
  // 监控data中的数据变化
  watch: {
    loading: {
      handler(newVal) {
        if (newVal) {
          this.handleShowLoading();
        } else {
          this.handleHideLoading();
        }
      },
      immediate: true,
    },
    option: {
      handler() {
        this.init(this.getOption());
      },
      immediate: true,
      deep: true,
    },
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getBoxId();
    // this.$nextTick(() => {
    //   if (!this.chartDom) this.chartDom = document.getElementById(this.chartBoxid)
    //   if (!this.nowChart) this.nowChart = echarts.init(this.chartDom)
    // })
    // this.init(this.getOption())
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.nowChart.resize);
  }, // 生命周期 - 销毁之前
  unmounted() {
    if (!this.nowChart) {
      return;
    }
    this.nowChart.clear();
    this.nowChart.dispose();
    this.nowChart = null;
  }, // 生命周期 - 销毁完成
  activated() {
    if (!this.nowChart) {
      return;
    }
    this.nowChart.resize();
  },
  // 方法集合
  methods: {
    setEmpty() {
      if (!this.nowChart) {
        return;
      }
      const copyEmpty = lodash.cloneDeep(emptyOption);
      this.nowChart.setOption(copyEmpty, true);
    },
    // 获取随机id
    getBoxId() {
      if (this.chartBoxid) {
        return this.chartBoxid;
      }
      if (this.id) {
        this.chartBoxid = this.id;
        return this.id;
      }
      const idText = 'chart' + Date.now() + parseInt(Math.random() * 10000000000);
      this.chartBoxid = idText;
    },

    /**
     * 打开加载loading
     */
    handleShowLoading() {
      if (!this.nowChart) {
        return;
      }
      this.nowChart.showLoading({
        text: 'loading',
        maskColor: 'rgba(0, 0, 0, 0.05)',
      });
    },

    /**
     * 关闭加载loading
     */
    handleHideLoading() {
      if (!this.nowChart) {
        return;
      }
      this.nowChart.hideLoading();
    },

    // 获取配置option
    getOption() {
      const cloneOption = defaultOption[this.getType]
        ? lodash.cloneDeep(defaultOption[this.getType])
        : lodash.cloneDeep(this.defalutOption);
      return lodash.merge(cloneOption, this.fixOption ? fixOption : {}, this.option);
    },
    // 初始化echart
    init(option) {
      this.$nextTick(() => {
        if (!option) {
          return;
        }
        if (!this.chartDom) {
          this.chartDom = document.getElementById(this.chartBoxid);
        }
        if (!this.nowChart) {
          this.nowChart = echarts.init(this.chartDom);
        }
        let emptyFlag = false;
        if (lodash.isEmpty(option.series)) {
          emptyFlag = true;
        } else {
          const filterList = option.series.filter(item => {
            return !lodash.isEmpty(item.data);
          });
          if (filterList.length === 0) {
            emptyFlag = true;
          }
        }
        if (emptyFlag) {
          const copyEmpty = lodash.cloneDeep(emptyOption);
          copyEmpty.title.text = option.title && option.title.text;
          this.nowChart.setOption(copyEmpty, true);
        } else {
          // this.nowChart.clear()
          this.nowChart.setOption(option, this.notMerge);
          // this.handleHideLoading()
        }
        window.addEventListener('resize', this.nowChart.resize);
        // this.chartDom.innerHTML = emptyHtml
      });
    },
  }, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
