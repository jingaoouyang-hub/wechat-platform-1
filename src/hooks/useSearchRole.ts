/**
 * 下拉选择框搜索所有角色
 * 具体例子见用户管理新增/编辑用户
 */
import { ref } from 'vue';
import { postAllRole, postRoleDetail } from '@/api/system/roleApi';

export const useSearchRole = () => {
  // 角色列表
  const searchRoleList = ref<{ label: string; value: string }[]>([]);
  // 加载loading
  const searchRoleLoading = ref(true);
  // 延时id
  const timeId = ref(0);

  /**
   * 搜索事件
   * @param {string} value 角色名
   */
  const handleSearchRole = (value = '') => {
    clearTimeout(timeId.value);
    timeId.value = setTimeout(() => {
      getSearchRoleList(value);
    }, 500);
  };

  /**
   * 获取数据事件
   * @param {string} value 角色名
   */
  const getSearchRoleList = async (value = '') => {
    searchRoleLoading.value = true;
    await postAllRole({
      name: value,
    }).then(result => {
      searchRoleList.value = result.data.map(item => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      searchRoleLoading.value = false;
    });
  };

  /**
   * 设置默认下拉选项事件
   * @param {string} id 当前所选角色id
   */
  const setDefaultSearchUserList = (id: string) => {
    const index = searchRoleList.value.findIndex(item => {
      return item.value === id;
    });
    if (index >= 0) {
      return;
    }
    postRoleDetail({
      id: id,
    }).then(result => {
      searchRoleList.value = [
        ...searchRoleList.value,
        { label: `${result.data.realName || '-'} （${result.data.userName || '-'}）`, value: result.data.id },
      ];
    });
  };

  return {
    searchRoleList,
    searchRoleLoading,
    handleSearchRole,
    getSearchRoleList,
    setDefaultSearchUserList,
  };
};
