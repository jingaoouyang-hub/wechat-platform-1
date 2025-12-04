String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};
const findEle = (parent: any, type: any) =>
  parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type);
const trigger = (el: any, type: any) => {
  // 给元素绑定事件
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
};
export default {
  install(Vue: any) {
    Vue.directive('emoji', {
      mounted: function (el: any) {
        // 指令第一次绑定到元素时调用
        // 判断是否是emoji图标
        const isEmoji = (char: string) =>
          // 表情都是2个字符
          char.length > 1;

        const emoji2empty = (
          str: string, // emoji图标都替换成空字符串‘’
        ) =>
          Array.from(str)
            .filter((c: any) => !isEmoji(c))
            .join('');

        const $inp = findEle(el, 'input') || findEle(el, 'textarea'); // 判断绑定元素是否是input输入框或者富文本输入框
        el.$inp = $inp;
        $inp.handle = function () {
          const val = $inp.value;
          $inp.value = emoji2empty(val); // 监听输入框的emoji图标转换成空
          trigger($inp, 'input');
        };
        $inp.addEventListener('keyup', $inp.handle); // el添加键盘监听事件keyup
        $inp.addEventListener('blur', $inp.handle); // el添加键盘失焦事件blur
      },
      unmounted: function (el: any) {
        // 只调用一次，指令与元素解绑时调用。
        el.$inp.removeEventListener('keyup', el.$inp.handle);
        el.$inp.removeEventListener('blur', el.$inp.handle);
      },
    });
  },
};
