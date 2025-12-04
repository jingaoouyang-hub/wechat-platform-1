import { isBoolean } from '@/utils/is.ts';
import { getViewportOffset } from '@/utils/domUtils.ts';
import { useDebounceFn } from '@vueuse/core';
import { useWindowSizeFn } from '@/hooks/event/useWindowSizeFn.ts';

// import {
//   ref,
//   unref,
//   watch,
//   onMounted,
//   computed,
//   nextTick,
// } from 'vue';

export function useTableScroll(propsRef, tableElRef, getDataSourceRef, wrapRef) {
  const tableHeightRef = ref(null);

  // Greater than animation time 280
  const debounceRedoHeight = useDebounceFn(redoHeight, 100);

  const getCanResize = computed(() => {
    const { canResize, scroll } = unref(propsRef);
    return canResize && !(scroll || {}).y;
  });

  watch(
    () => [unref(getCanResize), getDataSourceRef.value?.length],
    () => {
      setTimeout(() => {
        debounceRedoHeight();
      }, 500);
    },
    {
      flush: 'post',
    },
  );

  function redoHeight() {
    nextTick(() => {
      calcTableHeight();
    });
  }

  function setHeight(heigh) {
    tableHeightRef.value = heigh;
  }

  // No need to repeat queries
  let paginationEl = null;
  let footerEl = null;
  let bodyEl = null;

  async function calcTableHeight() {
    const { resizeHeightOffset, pagination, maxHeight, isCanResizeParent } = unref(propsRef);
    const tableData = unref(getDataSourceRef);

    const table = unref(tableElRef);
    if (!table) {
      return;
    }
    await nextTick();
    const tableEl = table.$el;
    if (!tableEl) {
      return;
    }

    if (!bodyEl) {
      bodyEl = tableEl.querySelector('.ant-table-tbody');
    }
    // console.log(bodyEl, 'bodyEl');
    // console.log(tableEl, 'tableEl');
    // console.log(tableEl.classList, 'tableEl.classList');
    const hasScrollBarY = bodyEl.scrollHeight > bodyEl.clientHeight;
    const hasScrollBarX = bodyEl.scrollWidth > bodyEl.clientWidth;
    if (hasScrollBarY) {
      tableEl.classList.contains('hide-scrollbar-y') && tableEl.classList.remove('hide-scrollbar-y');
    } else {
      !tableEl.classList.contains('hide-scrollbar-y') && tableEl.classList.add('hide-scrollbar-y');
    }

    if (hasScrollBarX) {
      tableEl.classList.contains('hide-scrollbar-x') && tableEl.classList.remove('hide-scrollbar-x');
    } else {
      !tableEl.classList.contains('hide-scrollbar-x') && tableEl.classList.add('hide-scrollbar-x');
    }

    // bodyEl.style.cssText = 'height:unset';

    // if (!unref(getCanResize) || tableData.length === 0) {
    if (!unref(getCanResize)) {
      return;
    }

    // Add a delay to get the correct bottomIncludeBody paginationHeight footerHeight headerHeight

    const headEl = tableEl.querySelector('.ant-table-thead');

    if (!headEl) {
      return;
    }

    const paddingHeight = 0;
    // Pager height
    let paginationHeight = 24;
    // 判断pagination是否是Boolean值
    if (!pagination) {
      paginationEl = tableEl.querySelector('.ant-pagination');
      if (paginationEl) {
        const offsetHeight = paginationEl.offsetHeight;
        paginationHeight += offsetHeight || 0;
      } else {
        // 如果有分页需要增加分页的上下margin 16*2=32
        paginationHeight = 0;
      }
    } else {
      // 如果有分页需要增加分页的上下margin 16*2=32
      paginationHeight += 32;
    }

    let footerHeight = 0;
    if (!footerEl) {
      footerEl = tableEl.querySelector('.ant-table-footer');
    } else {
      const offsetHeight = footerEl.offsetHeight;
      footerHeight += offsetHeight || 0;
    }
    // console.log(footerHeight, 'footerHeight');

    let headerHeight = 0;
    if (headEl) {
      headerHeight = headEl.offsetHeight;
    }

    let bottomIncludeBody = 0;
    // Table height from bottom
    if (unref(wrapRef) && isCanResizeParent) {
      const tablePadding = 12;
      let paginationMargin = 10;
      const wrapHeight = unref(wrapRef)?.offsetHeight ?? 0;
      if (isBoolean(pagination) && !pagination) {
        paginationMargin = 0;
      }
      const headerCellHeight = tableEl.querySelector('.ant-table-title')?.offsetHeight ?? 0;
      bottomIncludeBody = wrapHeight - headerCellHeight - tablePadding - paginationMargin;
    } else {
      // Table height from bottom
      bottomIncludeBody = getViewportOffset(headEl).bottomIncludeBody;
    }
    // console.log(bottomIncludeBody, 'bottomIncludeBody');
    // console.log(paddingHeight, 'paddingHeight');
    // console.log(paginationHeight, 'paginationHeight');
    // console.log(footerHeight, 'footerHeight');
    // console.log(headerHeight, 'headerHeight');
    // console.log(resizeHeightOffset, 'resizeHeightOffset');

    let height =
      bottomIncludeBody - (resizeHeightOffset || 0) - paddingHeight - paginationHeight - footerHeight - headerHeight;

    height = (height > maxHeight ? maxHeight : height) ?? height;

    setHeight(height);
    if (tableData && tableData.length === 0) {
      let emptyEl = tableEl.querySelector('.ant-empty');
      if (emptyEl) {
        // emptyEl.style.cssText = emptyEl.style.cssText + `height:${height - 40}px;`;
        // emptyEl.classList.add('flex-center');
        // bodyEl.style.cssText = bodyEl.style.cssText + `height:${0}px;`;
      }

      return;
    }
    // let tableBody = tableEl.querySelector('.ant-table-body');
    // if (tableBody) {
    //   tableBody.style.cssText = tableBody.style.cssText + `min-height:${height}px;`;
    // }
  }
  useWindowSizeFn(calcTableHeight, 280);
  onMounted(() => {
    calcTableHeight();
    nextTick(() => {
      debounceRedoHeight();
    });
  });

  const getScrollRef = computed(() => {
    const tableHeight = unref(tableHeightRef);
    const { canResize, scroll } = unref(propsRef);

    // console.log(tableHeight, 'tableHeight');
    return {
      x: 'calc(100%)',
      y: canResize ? tableHeight : null,
      scrollToFirstRowOnChange: false,
      ...scroll,
    };
  });

  return {
    getScrollRef,
    redoHeight,
  };
}
