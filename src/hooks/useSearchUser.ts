/**
 * 下拉选择框搜索所有用户
 * 具体例子见组织管理新增/编辑组织
 */
import { ref } from 'vue';
import { postAccountList, postAccountSingle } from '@/api/system/accountApi';

export const useSearchUser = () => {
  // 用户列表
  const searchUserList = ref<{ label: string; value: string }[]>([]);
  // 加载loading
  const searchUserLoading = ref(true);
  // 延时id
  const timeId = ref(0);

  /**
   * 搜索事件
   * @param {string} value 用户姓名
   */
  const handleSearchUser = (value = '') => {
    clearTimeout(timeId.value);
    timeId.value = setTimeout(() => {
      getSearchUserList(value);
    }, 500);
  };

  /**
   * 获取数据事件
   * @param {string} value 用户姓名
   */
  const getSearchUserList = async (value = '') => {
    searchUserLoading.value = true;
    await postAccountList({
      current: 1,
      size: 10,
      realName: value,
    }).then(result => {
      searchUserList.value = result.data.records.map(item => {
        return {
          label: `${item.realName || '-'} （${item.phoneNumber || '-'}）`,
          value: item.id,
        };
      });
      searchUserLoading.value = false;
    });
  };

  /**
   * 设置默认下拉选项事件
   * @param {string} id 当前所选用户id
   */
  const setDefaultSearchUserList = (id: string) => {
    const index = searchUserList.value.findIndex(item => {
      return item.value === id;
    });
    if (index >= 0) {
      return;
    }
    postAccountSingle({
      id: id,
    }).then(result => {
      searchUserList.value = [
        ...searchUserList.value,
        { label: `${result.data.realName || '-'} （${result.data.userName || '-'}）`, value: result.data.id },
      ];
    });
  };

  return {
    searchUserList,
    searchUserLoading,
    handleSearchUser,
    getSearchUserList,
    setDefaultSearchUserList,
  };
};
