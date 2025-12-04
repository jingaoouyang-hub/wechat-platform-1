// import { ref, onUnmounted, unref, watch } from 'vue';

export function useTable(tableProps) {
  const tableRef = ref(null);
  const loadedRef = ref(false);

  let stopWatch;

  function register(instance) {
    onUnmounted(() => {
      tableRef.value = null;
      loadedRef.value = null;
    });

    if (unref(loadedRef) && instance === unref(tableRef)) {
      return;
    }

    tableRef.value = instance;
    tableProps && instance.setProps(tableProps);
    loadedRef.value = true;
    stopWatch?.();
    stopWatch = watch(
      () => tableProps,
      () => {
        tableProps && instance.setProps(tableProps);
      },
      {
        immediate: true,
        deep: true,
      },
    );

    return instance;
  }

  function getTableInstance() {
    const table = unref(tableRef);
    if (!table) {
      console.error(
        'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!',
      );
    }
    return table || {};
  }

  const methods = {
    reloadTable: async opt => {
      await getTableInstance().reloadTable(opt);
    },
    fetch: async opt => {
      await getTableInstance().fetch(opt);
    },

    redoHeight: () => {
      getTableInstance().redoHeight();
    },
    setProps: props => {
      getTableInstance().setProps(props);
    },
  };

  return [register, methods];
}
