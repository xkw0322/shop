<template>
  <div>
    <div class="filter-wrap">
      <div class="section-wrap">
        <span class="section-type">地区：</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '全部' }"
              @click="area = '全部'"
              >全部</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '内地' }"
              @click="area = '内地'"
              >内地</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '港台' }"
              @click="area = '港台'"
              >港台</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '欧美' }"
              @click="area = '欧美'"
              >欧美</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '日本' }"
              @click="area = '日本'"
              >日本</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '韩国' }"
              @click="area = '韩国'"
              >韩国</span
            >
          </li>
        </ul>
      </div>
      <div class="section-wrap">
        <span class="section-type">类型：</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: type == '全部' }"
              @click="type = '全部'"
              >全部</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: type == '官方版' }"
              @click="type = '官方版'"
              >官方版</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: type == '原声' }"
              @click="type = '原声'"
              >原声</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: type == '现场版' }"
              @click="type = '现场版'"
              >现场版</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: type == '网易出品' }"
              @click="type = '网易出品'"
              >网易出品</span
            >
          </li>
        </ul>
      </div>
      <div class="section-wrap">
        <span class="section-type">排序：</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: order == '上升最快' }"
              @click="order = '上升最快'"
              >上升最快</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: order == '最热' }"
              @click="order = '最热'"
              >最热</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: order == '最新' }"
              @click="order = '最新'"
              >最新</span
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="mv">
      <div class="mvboxs">
        <div class="mvbox" v-for="(item, index) in list" :key="index" @click="toMV(item.id)">
          <div class="picbox">
            <div class="play">
              <span class="iconfont icon-bofang"></span>
            </div>
            <img :src="item.cover" alt="" />
            <div class="icon">
              <span class="iconfont icon-play"></span>
              <span>{{ item.playCount }}</span>
            </div>
            <div class="time">
                <span>{{item.duration}}</span>
            </div>
          </div>
          <div class="mv-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 total 总条数  current-page 当前页  page-size  每页多少条 
    current-change 页码改变事件-->
    <div class="fenye">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="10"
        :limit="limit"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      //总条数
      total: 20,
      //页码
      page: 1,
      //页容量
      limit: 12,
      //地区
      area: "全部",
      //类型
      type: "全部",
      //排序
      order: "上升最快",
      //查询结果
      list: [],
    };
  },
  //侦听器 观察数据改变
  watch: {
    area() {
      //返回首页
      this.page = 1;
      this.getList()
    },
    type() {
      //返回首页
      this.page = 1;
      this.getList()
    },
    order() {
      //返回首页
      this.page = 1;
      this.getList()
    },
  },
  created() {
    this.getList()
  },
  methods: {
    //跳转到mv详情页
    toMV(id){
      this.$router.push(`/mv?q=${id}`)
    },
    getList(){
      axios({
      url: "http://localhost:3000/mv/all",
      params: {
        area: this.area,
        type: this.type,
        order: this.order,
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      },
    }).then((res) => {
      console.log(res);
      this.list = res.data.data;
      //处理次数 如果大于100000
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].playCount =
          this.list[i].playCount > 100000
            ? parseInt(this.list[i].playCount / 10000) + "万"
            : this.list[i].playCount;
      }
      //处理时长 毫秒转为分秒
      for (let i = 0; i < this.list.length; i++) {
        //获取总的毫秒数
        let duration = this.list[i].duration;
        let min = parseInt(duration / 1000 / 60);
        let s = parseInt((duration / 1000) % 60);
        min = min < 10 ? "0" + min : min;
        s = s < 10 ? "0" + s : s;
        this.list[i].duration = `${min}:${s}`;
      }
      //保存总条数
      if(res.data.count){
        this.total = res.data.count;
      }
        
    });
    },
    //页码改变的回调函数
    handleCurrentChange(val){
      //console.log('当前页：${val}');
      //保存页面 重新获取数据
      this.page = val;
      this.getList()
    }
  },
};
</script>

<style lang="less" scoped>
@font-face {
  font-family: "iconfont"; /* Project id  */
  src: url("../assets/font_mvplay/iconfont.ttf?t=1623297425531")
    format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-bofang:before {
  content: "\e645";
}

.icon-bofang1:before {
  content: "\e66e";
}

.icon-play:before {
  content: "\e688";
}

.filter-wrap {
  .section-wrap {
    display: flex;
    padding: 10px;
    .section-type {
      display: block;
      width: 100px;
      height: 40px;
      line-height: 40px;
    }
    .tabs-wrap {
      display: flex;
      .tab {
        width: 150px;
        font-size: 14px;
        color: #888;
        .title {
          display: block;
          width: 100px;
          height: 40px;
          line-height: 40px;
          border-radius: 30px;
          text-align: center;
          cursor: pointer;
          transition: 0.5s;
          &:hover {
            background-color: #fdf6f4;
            color: rgb(244, 128, 37);
          }
        }
        .active {
          background-color: #fdf6f4;
          color: rgb(244, 128, 37);
        }
      }
    }
  }
}
.mvboxs {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  .mvbox {
    width: 250px;
    height: 200px;
    // border: 1px solid pink;
    margin: 20px;
    cursor: pointer;
    .picbox {
      width: 250px;
      height: 150px;
      position: relative;
      .play {
        position: absolute;
        display: none;
        width: 100%;
        height: 100%;
        line-height: 150px;
        text-align: center;
        span {
          font-size: 60px;
          color: #fff;
        }
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
      .icon {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 13px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.3);
        .icon-play {
          font-size: 10px;
        }
      }
      .time {
          position: absolute;
          bottom: 0;
          right: 0;
          color: #fff;
          font-size: 14px;
          background-color: rgba(0, 0, 0, 0.1);
      }
    }
    .mv-wrap {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 13px;
      color: #888;
      padding: 5px;
      .name {
        height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .singer {
        color: #ccc;
      }
    }
  }
  .mvbox:hover .play {
    display: block;
  }
  .mvbox:hover .singer {
    color: rgb(255, 94, 0);
  }
  .mvbox:hover .name {
    color: rgb(255, 94, 0);
  }
}
.fenye {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
</style>