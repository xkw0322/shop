<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="quitBtn">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleBtn">{{isCollapseShow}}</div>
        <!-- unique-opened表示子菜单是否保存一个打开 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- index是string类型，在每一个一级菜单中是唯一的，如果相同，展开一个其余都展开 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+childItem.path" v-for="childItem in item.children" :key="childItem.id" @click="saveNavState('/'+childItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{childItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      isCollapseShow: '<—',
      activePath: ''
    }
  },
  created () {
    this.getmenuList()
  },
  methods: {
    quitBtn () {
      // 清除token
      window.sessionStorage.clear()
      // replace不会向history里面添加新的记录，不能后退
      this.$router.replace('/login')
    },
    async getmenuList () {
      const res = await this.axios({
        url: '/menus'
      })
      console.log(res)
      if (res.data.meta.status !== 200) {
        return this.$message.error(res.data.meta.msg)
      } else {
        this.menuList = res.data.data
      }
    },
    toggleBtn () {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.isCollapseShow = '—>'
      } else {
        this.isCollapseShow = '<—'
      }
    },
    saveNavState (activeState) {
      this.activePath = activeState
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div {
      letter-spacing: 5px;
      margin-left: 20px;
    }
  }
  .el-aside {
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    background-color: #333744;
    .toggle-btn {
      background-color: #4a5064;
      font-size: 20px;
      color: #fff;
      text-align: center;
      letter-spacing: 5px;
      cursor: pointer;
    }
    .iconfont {
      margin-right: 10px;
    }
    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background-color: #eaedf1;
    position: absolute;
    left: 200px;
    right: 0;
    bottom: 0;
    top: 60px;
    overflow-y: scroll;
  }
}
</style>
