<template>
<div>
   <div class="main">
    <router-view></router-view>
  </div>
  <div class="audio">
      <audio :src="musicUrl" controls autoplay loop></audio>
  </div>
</div>
 
</template>

<script>
// import RecommendView from "./RecommendView.vue"
// import DiscoveryView from "./DiscoveryView.vue"
// import newView from "./newView.vue"
// import MVView from "./MVView.vue"

export default {
  data(){
    return{
      musicUrl:''
    }
  },
  components: {
    //  RecommendView,
    //  DiscoveryView,
    //  newView,
    //  MVView
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 1200px;
  min-height: 800px;
  margin: 50px auto;
}
.audio {
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f1f3f4;
  height: 50px;
}
audio {
  flex: 1;
}
</style>