<template>
  <router-view v-slot="{ Component }">
    <Transition name="fade">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </Transition>
  </router-view>
</template>

<script name="CommonLayout" setup></script>

<style scoped lang="less"></style>
