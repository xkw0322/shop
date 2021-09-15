<template>
  <div>
    <div class="top-card">
      <div class="pic">
        <img :src="topList.coverImgUrl" alt=""  @click="toPlaylist(topList.id)"/>
      </div>
      <img :src="topList.coverImgUrl" alt="" class="bg" />
      <div class="tab-con">
        <div class="name">
          <span @click="toPlaylist(topList.id)">{{ topList.name }}</span>
        </div>
        <div class="con">{{ topList.description }}</div>
      </div>
    </div>
    <div class="content">
      <div class="con-tag">
        <span
          class="tag"
          :class="{ active: tag == '全部' }"
          @click="tag = '全部'"
          >全部</span
        >
        <span
          class="tag"
          :class="{ active: tag == '欧美' }"
          @click="tag = '欧美'"
          >欧美</span
        >
        <span
          class="tag"
          :class="{ active: tag == '华语' }"
          @click="tag = '华语'"
          >华语</span
        >
        <span
          class="tag"
          :class="{ active: tag == '流行' }"
          @click="tag = '流行'"
          >流行</span
        >
        <span
          class="tag"
          :class="{ active: tag == '说唱' }"
          @click="tag = '说唱'"
          >说唱</span
        >
        <span
          class="tag"
          :class="{ active: tag == '摇滚' }"
          @click="tag = '摇滚'"
          >摇滚</span
        >
        <span
          class="tag"
          :class="{ active: tag == '民谣' }"
          @click="tag = '民谣'"
          >民谣</span
        >
        <span
          class="tag"
          :class="{ active: tag == '电子' }"
          @click="tag = '电子'"
          >电子</span
        >
        <span
          class="tag"
          :class="{ active: tag == '电子' }"
          @click="tag = '轻音乐'"
          >轻音乐</span
        >
        <span
          class="tag"
          :class="{ active: tag == '影视原声' }"
          @click="tag = '影视原声'"
          >影视原声</span
        >
        <span class="tag" :class="{ active: tag == 'ACG' }" @click="tag = 'ACG'"
          >ACG</span
        >
        <span
          class="tag"
          :class="{ active: tag == '怀旧' }"
          @click="tag = '怀旧'"
          >怀旧</span
        >
        <span
          class="tag"
          :class="{ active: tag == '治愈' }"
          @click="tag = '治愈'"
          >治愈</span
        >
        <span
          class="tag"
          :class="{ active: tag == '旅行' }"
          @click="tag = '旅行'"
          >旅行</span
        >
      </div>
      <div class="items">
        <div class="item" v-for="(item, index) in list" :key="index" @click="toPlaylist(item.id)">
          <div class="img-wrap">
            <div class="num-wrap">
              播放量：
              <span class="num">{{ item.playCount }}</span>
            </div>
            <img :src="item.coverImgUrl" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <div>
            <p class="tuijian">{{ item.name }}</p>
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
      total: 0,
      //页码
      page: 1,
      //顶部推荐歌单
      topList: [],
      //精品歌单
      list: [],
      //当前选择的tag
      tag: "全部",
    };
  },
  methods: {
    //去歌单详情页
    toPlaylist(id) {
      console.log(id);
      this.$router.push(`/playlist?q=${id}`);
    },
    //页码改变事件
    handleCurrentChange(val) {
      // 保存页码
      this.page = val;
      // 重新获取数据
      //歌单列表
      axios({
        url: "http://localhost:3000/top/playlist",
        params: {
          limit: 10,
          offset: (this.page - 1) * 10,
          cat: this.tag,
        },
      }).then((res) => {
        console.log(res);
        this.list = res.data.playlists;
        this.total = res.data.total;
      });
    },
  },
  watch: {
    tag() {
      //重置页码
      this.page = 1;
      // 顶部 精品歌单
      axios({
        url: "http://localhost:3000/top/playlist/highquality",
        params: {
          limit: 1,
          cat: this.tag,
        },
      }).then((res) => {
        console.log(res);
        this.topList = res.data.playlists[0];
      });
      //歌单列表
      axios({
        url: "http://localhost:3000/top/playlist",
        params: {
          limit: 10,
          offset: 0,
          cat: this.tag,
        },
      }).then((res) => {
        console.log(res);
        this.list = res.data.playlists;
        this.total = res.data.total;
      });
    },
  },
  created() {
    // 顶部 精品歌单
    axios({
      url: "http://localhost:3000/top/playlist/highquality",
      params: {
        limit: 1,
        cat: "全部",
      },
    }).then((res) => {
      console.log(res);
      this.topList = res.data.playlists[0];
    });
    //歌单列表
    axios({
      url: "http://localhost:3000/top/playlist",
      params: {
        limit: 10,
        offset: 0,
        cat: "全部",
      },
    }).then((res) => {
      console.log(res);
      this.list = res.data.playlists;
      this.total = res.data.total;
    });
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

.top-card {
  padding: 20px;
  height: 200px;
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  // border: 1px solid pink;
  .pic {
    width: 160px;
    height: 160px;
    margin-right: 20px;
    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    filter: blur(20px);
  }
  .tab-con {
    width: 880px;
    height: 160px;
    // border: 1px solid blue;
    padding: 10px;
    .name {
      height: 60px;
      line-height: 60px;
      color: #fff;
      font-size: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span{
        &:hover {
        color: rgb(244, 128, 37);
        cursor: pointer;
      }
      }
    }
    .con {
      font-size: 14px;
      height: 80px;
      color: #ccc;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
    }
  }
}
.content {
  width: 100%;
  margin-top: 20px;
  .con-tag {
    margin-top: 30px;
    margin-bottom: 10px;
    text-align: right;
    font-size: 16px;
    .tag {
      margin-left: 15px;
      color: #888;
      cursor: pointer;
    }
    .active {
      color: rgb(244, 128, 37);
    }
  }
  .items {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      cursor: pointer;
      position: relative;
      margin: 20px;
      width: 200px;
      height: 250px;
      // border: 1px solid pink;
      overflow: hidden;
      &:hover .tuijian {
        color: rgb(244, 128, 37);
      }
      .img-wrap {
        position: relative;
        width: 100%;
        height: 220px;
        &:hover .num-wrap {
          top: 0;
        }
        &:hover .icon-play {
          display: block;
        }
        .num-wrap {
          width: 100%;
          height: 30px;
          position: absolute;
          top: -40px;
          transition: all 0.6s ease-in-out;
          font-size: 14px;
          background-color: rgba(0, 0, 0, 0.3);
          color: #fff;
          text-align: right;
          padding: 5px;
        }
        img {
          width: 100%;
          height: 100%;
        }
        .icon-play {
          display: none;
          position: absolute;
          bottom: 0;
          right: 0;
          font-size: 30px;
          margin: 5px;
          color: #fff;
        }
      }
      .tuijian {
        font-size: 14px;
        padding: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.fenye {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
</style>