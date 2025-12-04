import { ref, onMounted } from 'vue';

import { isFunction, isBoolean } from '@/utils/is.ts';

export function usePagination(config) {
  const loading = ref(false); // table加载状态
  const dataSource = ref([]); // table数据
  const resultData = ref({}); // 后端返回数据

  const getConfig = {
    apiFetch: null, // api请求Promise
    pagination: null, // ant分页参数
    queryParams: {}, // 查询参数
    beforeFetch: null, // 请求之前回调
    afterFetch: null, // 请求之后回调
    fetchSuccess: null, // 请求成功回调
    fetchError: null, // 请求错误回调
    immediate: true, // 初始是否调用接口
    pageSize: 10,
    ...config,
  };

  const { immediate, pagination, pageSize } = getConfig;

  onMounted(() => {
    setTimeout(() => {
      immediate && fetch();
    }, 500);
  });

  // 页码参数
  const pageOptions = ref(
    Object.assign(
      {
        current: 1,
        pageSize: pageSize || 0,
        total: 0,
        size: 'small',
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        showQuickJumper: true,
        showSizeChanger: true, // 显示可改变每页数量
        showTotal: total => `共 ${total} 条`, // 显示总数,
        onChange: (current, pageSize) => {
          pageOptions.value.current = current;
          pageOptions.value.pageSize = pageSize;
          fetch();
        },
        onShowSizeChange: (current, pageSize) => {
          pageOptions.value.current = current;
          pageOptions.value.pageSize = pageSize;
          fetch();
        },
      },
      pagination,
    ),
  );

  const fetch = async opt => {
    const { apiFetch, pagination, queryParams, beforeFetch, afterFetch, fetchSuccess, fetchError } = getConfig;
    if (!apiFetch) {
      return;
    }
    try {
      loading.value = true;
      let pageParams = {};
      if (isBoolean(pagination) && !pagination) {
        pageParams = {};
      } else {
        pageParams['current'] = pageOptions.value.current;
        pageParams['size'] = pageOptions.value.pageSize;
      }
      let params = {
        ...pageParams,
        ...queryParams,
        ...(opt?.queryParams ?? {}),
      };
      // 请求之前对数据操作
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      const res = await apiFetch(params);
      resultData.value = res;

      // 判断返回值是否为数组
      const isArrayResult = Array.isArray(res.data);

      let resultItems = isArrayResult ? res.data : res.data['records'];
      const resultTotal = isArrayResult ? 0 : Number(res.data['total']);

      // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
      if (resultTotal) {
        const currentTotalPage = Math.ceil(resultTotal / pageOptions.value.pageSize);
        if (pageOptions.value.current > currentTotalPage) {
          pageOptions.value.current = currentTotalPage;
          return fetch(opt);
        }
      }

      // 对列表数据操作
      if (afterFetch && isFunction(afterFetch)) {
        resultItems = (await afterFetch(resultItems)) || resultItems;
      }
      // 表格数据赋值
      dataSource.value = resultItems;

      // 表格总数
      pageOptions.value.total = resultTotal;

      // 列表请求成功回调
      if (fetchSuccess && isFunction(fetchSuccess)) {
        fetchSuccess({
          items: resultItems,
          total: resultTotal,
        });
      }
      loading.value = false;
    } catch (error) {
      // 列表请求错误回调
      if (fetchError && isFunction(fetchError)) {
        fetchError(error);
      }
      dataSource.value = [];
      pageOptions.value.total = 0;
      loading.value = false;
    }
    return dataSource.value;
  };

  async function reloadList(opt = {}) {
    pageOptions.value.current = 1;
    return await fetch(opt);
  }

  return {
    fetch,
    reloadList,
    pageOptions,
    loading,
    dataSource,
  };
}
