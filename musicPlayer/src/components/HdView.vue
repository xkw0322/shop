<template>
  <div class="header">
    <div class="list">
      <ul>
        <li>
          <router-link to="/discovery">发现音乐</router-link>  
        </li>
        <li>
          <router-link to="/recommend">推荐歌单</router-link>
        </li>
        <li>
          <router-link to="/newmusic">最新音乐</router-link>
        </li>
        <li>
          <router-link to="/MVView">最新MV</router-link>
        </li>
      </ul>
    </div>
    <div class="search">
      <input type="text" placeholder="搜索歌曲" class="input" @keyup.enter="toResult"
      v-model="inputValue"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // listArr: ["发现音乐", "推荐歌单", "最新音乐", "最新MV"],
      inputValue:''
    };
  },
  methods: {
    toResult(){
      if(this.inputValue==''){
        this.$message.warning('请输入内容');
      }else {
        this.$router.push('/result?q='+this.inputValue)
      }
    }
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  background-color: rgb(241, 236, 236);
  display: flex;
  justify-content: space-between;
  ul {
    display: flex;
    justify-content: center;
    li {
      height: 50px;
      margin-left: 30px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      &:hover {
          border-bottom: 2px solid rgb(244, 128, 37);
        }
      a {
        display: block;
        color: #888;
        // height: 50px;
        // &:hover {
        //   border-bottom: 2px solid rgb(244, 128, 37);
        // }
      }
    }
  }
  .search {
    display: flex;
    align-items: center;
    .input {
      height: 30px;
      width: 180px;
      margin-right: 20px;
      padding: 10px;
      border: 1px solid #fff;
      outline: none;
      font-size: 12px;
      &:focus {
          border: 1px solid rgb(244, 128, 37);
      }
    }
  }
}
</style>
