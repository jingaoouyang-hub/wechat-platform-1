<!-- 创建用户组 -->
<template>
  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    v-model:visible="visibleModal"
    title="修改密码"
    :width="500"
    :footer="null"
    @cancel="cancel"
  >
    <div>
      <a-form layout="vertical" :colon="false" ref="formRef" :rules="rules" :model="formState">
        <a-form-item label="旧密码" name="originalPwd">
          <a-popover placement="topLeft" trigger="focus">
            <template #content>
              <div>请设置8-20位密码，英文、数字、特殊字符最少两种组合</div>
            </template>
            <a-input-password
              v-model:value="formState.originalPwd"
              :maxlength="20"
              placeholder="请输入旧密码"
              autocomplete="off"
            />
          </a-popover>
        </a-form-item>
        <a-form-item label="新密码" name="newPwd">
          <a-popover placement="topLeft" trigger="focus">
            <template #content>
              <div>请设置8-20位密码，英文、数字、特殊字符最少两种组合</div>
            </template>
            <a-input-password
              v-model:value="formState.newPwd"
              :maxlength="20"
              placeholder="请输入旧密码"
              autocomplete="off"
            />
          </a-popover>
        </a-form-item>
        <a-form-item label="确认密码" name="confirmPwd">
          <a-popover placement="topLeft" trigger="focus">
            <template #content>
              <div>请设置8-20位密码，英文、数字、特殊字符最少两种组合</div>
            </template>
            <a-input-password
              v-model:value="formState.confirmPwd"
              :maxlength="20"
              placeholder="请输入确认密码"
              autocomplete="off"
            />
          </a-popover>
        </a-form-item>
      </a-form>
    </div>
    <div class="footer_btn">
      <a-space>
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="handleOk">确定</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
// api
import { updateOwnerPwd } from '@/api/userCenter';

// 方法
import { message } from 'ant-design-vue';
import ruleMap from '@/setting/rules';
import { doEncrypt } from '@/utils/common';
import { getStore } from '@/utils/stroge';
import { SAVE_RSA_KEY } from '@/store/mutation-types';

export default defineComponent({
  name: 'PwdModal',
  props: {
    isPwdModal: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  emits: ['cancel'],
  setup(props, { emit }) {
    // const router = useRouter();
    const visibleModal = ref(props.isPwdModal);
    const formRef = ref();
    let formState = ref({
      originalPwd: '',
      newPwd: '',
      confirmPwd: '',
    });

    const rules = {
      originalPwd: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
      newPwd: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        { pattern: ruleMap.password.pattern, message: ruleMap.password.msg, trigger: 'blur' },
      ],
      confirmPwd: [
        // { required: true, message: '请再次输入新密码', trigger: 'blur' },
        {
          validator: (rule, value, cbfn) => {
            if (!value) {
              cbfn('请再次输入新密码');
            } else if (value !== formState.value.newPwd) {
              cbfn('两次密码不一致');
            }
            cbfn();
          },
          trigger: 'blur',
        },
      ],
    };

    const cancel = () => {
      visibleModal.value = false;
      emit('cancel', 'close');
    };
    // 创建、编辑
    const handleOk = () => {
      if (formState.value.newPwd !== formState.value.confirmPwd) {
        message.error('新密码与确认密码不一致！');
        return false;
      }
      formRef.value.validate().then(() => {
        let params = Object.assign({}, formState.value);
        params.originalPwd = doEncrypt(params.originalPwd, getStore(SAVE_RSA_KEY));
        params.newPwd = doEncrypt(params.newPwd, getStore(SAVE_RSA_KEY));
        params.confirmPwd = doEncrypt(params.confirmPwd, getStore(SAVE_RSA_KEY));

        updateOwnerPwd(params).then(() => {
          formRef.value.resetFields();
          message.success('密码更新成功！');
          visibleModal.value = false;
          emit('cancel', 'close');
          formState.value.originalPwd = '';
          formState.value.newPwd = '';
          formState.value.confirmPwd = '';
        });
      });
    };
    watch(
      () => props.isPwdModal,
      () => {
        visibleModal.value = props.isPwdModal;
      },
    );
    return {
      rules,
      formRef,
      cancel,
      handleOk,
      visibleModal,
      formState,
    };
  },
});
</script>
<style lang="less" scoped>
.create-modal-max {
  width: 100%;
  overflow: hidden;
  height: 200px;
  overflow-y: auto;
  padding-right: 10px;
}

.footer_btn {
  // display: flex;
  // align-items: center;
  text-align: right;
  // justify-content: center;
}
</style>
