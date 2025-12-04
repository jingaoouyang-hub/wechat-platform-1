<template>
  <a-modal v-model:visible="visible" title="发布草稿箱" :width="700" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" ref="formRef" :rules="rules" :labelCol="{ style: { width: '100px' } }">
      <a-row
        :gutter="[16, 16]"
        align="middle"
        v-for="(item, index) in formState.articles"
        :key="index"
        class="draf-item"
      >
        <a-col :span="8">
          <a-select
            style="width: 100%"
            v-model:value="formState.articles[index].type"
            placeholder="请选择类型"
            :options="TemplateType"
            @change="changeType($event, index)"
          ></a-select>
        </a-col>
        <a-col :span="8">
          <a-select
            style="width: 100%"
            v-model:value="formState.articles[index].materialType"
            placeholder="请选择素材类型"
            :options="sourceList[index]"
          ></a-select>
        </a-col>
        <a-col :span="7">
          <a-select
            style="width: 100%"
            v-model:value="formState.articles[index].templateId"
            placeholder="请选择模板"
            :options="templateList[index]"
          ></a-select>
        </a-col>
        <a-col :span="1">
          <a-popover trigger="hover" placement="rightTop">
            <template #content></template>
            <div @mouseover="prewiewTemplate(index)" @mouseleave="levelEye">
              <EyeOutlined :class="{ eyeOpen: index === previewIndex }" />
            </div>
          </a-popover>
        </a-col>
        <a-col :span="12">
          <a-input-number
            style="width: 100%"
            v-model:value="formState.articles[index].widthHeightStart"
            :min="0"
            placeholder="请输入长宽比开始"
          ></a-input-number>
        </a-col>
        <a-col :span="12">
          <a-input-number
            style="width: 100%"
            v-model:value="formState.articles[index].widthHeightEnd"
            :min="0"
            placeholder="请输入长宽比结束"
          ></a-input-number>
        </a-col>
        <a-col :span="9">
          <a-radio-group v-model:value="formState.articles[index].titleOption">
            <a-radio :value="1">随机标题</a-radio>
            <a-radio :value="2" :disabled="bacthStatus">可选标题</a-radio>
          </a-radio-group>
        </a-col>
        <a-col :span="7">
          <a-select
            v-if="formState.articles[index].titleOption == 2"
            style="width: 100%"
            v-model:value="formState.articles[index].titleType"
            placeholder="请选择标题类型"
            :options="titleType"
            @change="changeTitleType($event, index)"
          ></a-select>
        </a-col>
        <a-col :span="8">
          <a-select
            v-if="formState.articles[index].titleOption == 2"
            style="width: 100%"
            v-model:value="formState.articles[index].titleId"
            placeholder="请选择标题"
            :options="titleList"
            optionFilterProp="label"
            showSearch
          ></a-select>
        </a-col>
        <a-col :span="10">
          <a-radio-group v-model:value="formState.articles[index].materialOption">
            <a-radio :value="1">随机素材</a-radio>
            <a-radio :value="2" :disabled="bacthStatus">可选素材</a-radio>
          </a-radio-group>
        </a-col>
        <a-col :span="14">
          <a-input-group compact v-if="formState.articles[index].materialOption == 2">
            <a-input
              :value="`已选择${formState.articles[index].picIds?.length || 0}个素材`"
              :readonly="true"
              placeholder="请选择素材"
              style="width: 255px"
            />
            <a-button type="primary" @click="onSelectMaterial(index)">选择素材</a-button>
          </a-input-group>
        </a-col>
        <a-col :span="8" v-if="formState.articles[index].type === 2">
          封面背景：
          <input type="color" v-model="formState.articles[index].coverColor" />
        </a-col>
        <a-col :span="16" v-if="formState.articles[index].type === 2">
          <a-radio-group v-model:value="formState.articles[index].coverType" :options="CoverType"></a-radio-group>
        </a-col>
        <a-col :span="16" v-if="formState.articles[index].type === 1">
          <a-radio-group v-model:value="formState.articles[index].coverType" :options="CoverTypeBg"></a-radio-group>
        </a-col>
        <DeleteOutlined v-if="formState.articles.length > 1" class="delete-icon" @click="onDeleteItem(index)" />
      </a-row>

      <div @click="onAddItem">
        <a-button type="dashed" style="width: 100%">
          <template #icon><PlusOutlined /></template>
          添加
        </a-button>
      </div>
      <a-row :span="24" :gutter="24">
        <a-col :span="6">
          <a-form-item label="数量" name="num" required>
            <a-input-number :min="1" :max="9999" v-model:value="formState.num"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="文案类型" name="copywriteType" required>
            <a-select
              style="width: 100%"
              v-model:value="formState.copywriteType"
              placeholder="请选择文案类型"
              :options="CopywriteType"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item label="公众号名片" name="accountCardId">
            <a-select
              v-model:value="formState.accountCardId"
              :fieldNames="{ label: 'officialName', value: 'id' }"
              :options="accountList"
              :filter-option="false"
              showSearch
              placeholder="请选择公众号名片"
              @search="handleSearch"
            ></a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <TemplateContent
      v-show="templatePreviewVisible"
      class="templateContent"
      :content="templateContent"
      @mouseover="enterTemplateContent"
      @mouseleave="leaveTemplateContent"
    ></TemplateContent>
  </a-modal>
  <MaterialSelectModal ref="materialSelectModalRef" @change="onSelectMaterialOk"></MaterialSelectModal>
  <!-- <TemplatePreview v-model:visible="templatePreviewVisible" :content="templateContent"></TemplatePreview> -->
</template>

<script setup>
import MaterialSelectModal from './material-select-modal.vue';
// import TemplatePreview from './template-preview.vue';
import TemplateContent from './template-content.vue';
import {
  postAccountPublish,
  postTemplateQuery,
  postMaterialTypeList,
  postPublishBatch,
  postAccountList,
} from '@/api/wechat-manage/index';
import { postTitleData } from '@/api/wechat-manage/title';
import { message } from 'ant-design-vue';
import { TemplateType, CoverType, CoverTypeBg, CopywriteType } from '@/views/constant';
import { debounce } from '@/utils/common';
import { postTitleTypeList } from '@/api/wechat-manage/title';

const emit = defineEmits(['ok']);
const titleType = ref([]);
const visible = ref(false);
const formRef = ref(null);
const wechatInfo = ref({});
const bacthStatus = ref(false);
const accountIds = ref([]);
const sourceList = ref([]);
const templateList = ref([]);
const materialSelectModalRef = ref(null);
const checkIndex = ref(0);
const templatePreviewVisible = ref(false);
const previewIndex = ref(null);
const templateContent = ref('');
const formState = reactive({
  num: 1,
  articles: [
    {
      materialType: undefined, // 素材类型
      templateId: undefined, // 模版id
      type: undefined, // 类型 1:壁纸 2:头像 3:表情包（必选）
      titleOption: undefined, // 1:随机标题 2:可选标题
      titleId: undefined,
      materialOption: undefined, // 1:随机素材 2:可选素材
      picIds: undefined, // 素材列表ID
      widthHeightStart: undefined, // 长宽比开始
      widthHeightEnd: undefined, // 长宽比结束
      coverColor: '#ffffff',
      coverType: 1,
    },
  ],
  accountCardId: undefined,
  copywriteType: undefined,
});

const rules = ref({
  num: [
    {
      required: true,
      message: '请输入数量',
      trigger: 'blur',
      type: 'number',
    },
  ],
});
0;

const titleList = ref([]);
const timer = ref(null);
const accountList = ref([]);

onMounted(() => {
  getAccountList();
  postTitleTypeList().then(result => {
    titleType.value = result.data.map(t => {
      return {
        label: t,
        value: t,
      };
    });
  });
});

const getAccountList = (officialName = '') => {
  postAccountList({ officialName }).then(result => {
    accountList.value = result.data.records;
  });
};

const prewiewTemplate = index => {
  let templateId = formState.articles[index].templateId;
  templateContent.value = templateList.value[index].find(t => t.id == templateId)?.templateContent;
  previewIndex.value = index;
  if (templateId) {
    templatePreviewVisible.value = true;
  }
};

const levelEye = () => {
  timer.value = setTimeout(() => {
    previewIndex.value = null;
    templatePreviewVisible.value = false;
  }, 500);
};

const enterTemplateContent = () => {
  clearTimeout(timer.value);
  templatePreviewVisible.value = true;
};

const leaveTemplateContent = () => {
  previewIndex.value = null;
  templatePreviewVisible.value = false;
};

const changeTitleType = (titleType, index) => {
  formState.articles[index].titleId = undefined;
  getTitleByWechatAccount(titleType);
};

const getTitleByWechatAccount = titleType => {
  postTitleData({ id: wechatInfo.value.id, titleType: titleType }).then(result => {
    titleList.value = result.data.map(t => {
      return {
        value: t.id,
        label: t.title,
      };
    });
  });
};

const changeType = (type, index) => {
  postMaterialTypeList({ type }).then(result => {
    sourceList.value[index] = result.data.map(t => {
      return {
        value: t,
        label: t,
      };
    });
  });
  postTemplateQuery({ type }).then(result => {
    templateList.value[index] = result.data.map(t => {
      return {
        ...t,
        value: t.id,
        label: t.templateName,
      };
    });
  });
  formState.articles[index].coverType = 1;
  formState.articles[index].type = type;
  formState.articles[index].templateId = undefined;
};

const handleSearch = debounce(val => {
  getAccountList(val);
}, 500);

const handleOk = () => {
  let status = formState.articles.some(
    t =>
      !t.type || !t.titleOption || (t.titleOption == 2 && !t.titleId) || (t.materialOption == 2 && !t.picIds?.length),
  );
  if (!status) {
    formRef.value.validate().then(() => {
      if (bacthStatus.value) {
        postPublishBatch({ ...formState, accountIds: accountIds.value }).then(() => {
          visible.value = false;
          clearFormState();
          message.success('发布成功');
          emit('ok');
        });
      } else {
        postAccountPublish({ ...formState, accountId: wechatInfo.value.id }).then(() => {
          visible.value = false;
          clearFormState();
          message.success('发布成功');
          emit('ok');
        });
      }
    });
  } else {
    message.error('请完善表单填写');
  }
};

const onAddItem = () => {
  formState.articles.push({
    materialType: undefined,
    templateId: undefined,
    type: undefined,
    titleOption: undefined, // 1:随机标题 2:可选标题
    titleId: undefined,
    materialOption: undefined, // 1:随机素材 2:可选素材
    picIds: undefined, // 素材列表ID
    coverColor: '#ffffff',
    coverType: 1,
  });
};

const onDeleteItem = index => {
  formState.articles.splice(index, 1);
};

const clearFormState = () => {
  Object.assign(formState, {
    num: 1,
    articles: [
      {
        materialType: undefined, // 素材类型
        templateId: undefined, // 模版id
        type: undefined, // 类型 1:壁纸 2:头像 3:表情包（必选）
        titleOption: undefined, // 1:随机标题 2:可选标题
        titleId: undefined,
        materialOption: undefined, // 1:随机素材 2:可选素材
        picIds: undefined, // 素材列表ID
        coverColor: '#ffffff',
        coverType: 1,
      },
    ],
  });
};

const showModal = (data, batch) => {
  bacthStatus.value = batch;
  if (batch) {
    accountIds.value = data;
  } else {
    wechatInfo.value = data;
    getTitleByWechatAccount();
  }

  visible.value = true;
};

const onSelectMaterial = index => {
  checkIndex.value = index;
  materialSelectModalRef.value.showModal(formState.articles[index]);
};

const onSelectMaterialOk = item => {
  formState.articles[checkIndex.value].picIds = item;
};

const handleCancel = () => {
  visible.value = false;
  clearFormState();
};

defineExpose({
  showModal,
  visible,
});
</script>

<style lang="less" scoped>
.draf-item {
  padding-bottom: 16px;
  border-bottom: 1px dashed #ccc;
  margin-bottom: 16px;
  position: relative;
  .delete-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -16px;
    font-size: 18px;
    :hover {
      color: #ff2222;
    }
  }
}
.templateContent {
  position: absolute;
  top: 0;
  left: 720px;
  background: #fff;
}
.eyeOpen {
  color: @primary-color;
}
</style>
