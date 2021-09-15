<template>
  <div id="app">
    <HdView/>
    <MainView/>
  </div>
</template>

<script>
import HdView from "./components/HdView.vue"
import MainView from "./components/MainView.vue"
export default {
  components: {
    HdView,
    MainView,
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "微软雅黑";
}
a {
  text-decoration: none;
}
ul li {
  list-style: none;
}
</style>