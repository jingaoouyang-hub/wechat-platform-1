<!--  -->
<template>
  <PageLayout>
    <PageTitle title="个人信息"></PageTitle>
    <div class="info-warp flex-start">
      <div class="flex-1">
        <div class="font-20 text-main font-weight-7 mb-24">基本信息</div>
        <a-form labelAlign="left" :label-col="{ style: { width: '80px' } }">
          <a-form-item label="用户名称">
            {{ formState.userName || '--' }}
          </a-form-item>
          <a-form-item label="姓名">
            {{ formState.realName }}
            <!-- <EditOutlined @click="editName" class="font-16 ml-12 text-primary" /> -->
          </a-form-item>
          <a-form-item label="登录密码">
            **********
            <EditOutlined @click="editPwd" class="font-16 ml-12 text-primary" />
          </a-form-item>
        </a-form>
      </div>
    </div>
  </PageLayout>
  <PwdModal v-if="isPwdModal" :is-pwd-modal="isPwdModal" @cancel="closeModal"></PwdModal>
  <UserModal ref="userModalRef" @saveHandle="getUserInfo"></UserModal>
  <CopperModal ref="copperModalRef" @uploadSuccess="uploadSuccess"></CopperModal>
</template>

<script setup>
import { EditOutlined } from '@ant-design/icons-vue';
import PwdModal from './components/pwdModal.vue';
import UserModal from './components/userModal.vue';
import CopperModal from '@/components/Cropper/src/CopperModal.vue';

// api
import { userInfo, uploadAvatar } from '@/api/userCenter';

// 仓库数据
import { useStoreUser } from '@/store';

const storeUser = useStoreUser();
const isPwdModal = ref(false);
const userModalRef = ref(null);
const copperModalRef = ref(null);

const formState = ref({
  nickName: '',
  userPassword: '123456789',
  avatarUrl: '',
  realName: '',
  companyName: '',
  department: [],
  reasearchCenter: [],
});
// 关闭
const closeModal = () => {
  isPwdModal.value = false;
};
// 修改密码
const editPwd = () => {
  isPwdModal.value = true;
};

// 头像修改成功回调
const uploadSuccess = ({ data }) => {
  uploadAvatar({ avatarUrl: data.url }).then(() => {
    formState.value = Object.assign(formState.value, { avatarUrl: data.url });
    storeUser.setUserInfo({ avatarUrl: data.url });
  });
};

// 查询个人信息
const getUserInfo = () => {
  userInfo().then(res => {
    if (res.code === 200) {
      let { data } = res;
      storeUser.setUserInfo(data);
      formState.value = Object.assign(formState.value, data);
    }
  });
};

getUserInfo();
</script>
<style lang="less" scoped>
.info-warp {
  width: 582px;
  margin: 100px auto;
}
</style>
