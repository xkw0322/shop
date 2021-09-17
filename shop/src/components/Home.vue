<template>
  <div>
      <el-button type="info" @click="quitBtn">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    quitBtn () {
      // 清除token
      window.sessionStorage.clear()
      // replace不会向history里面添加新的记录，不能后退
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
