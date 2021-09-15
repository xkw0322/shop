<template>
  <div>
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="(item, index) in bannerArr" :key="index">
        <img :src="item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3>推荐歌单</h3>
      <div class="items">
        <div class="item" v-for="(item, index) in listArr" :key="index" @click="toPlaylist(item.id)">
          <div class="name">
            <span>{{ item.name }}</span>
          </div>
          <img :src="item.picUrl" alt="" />
          <div class="copywrite">
            <span>{{ item.copywriter }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="new">
      <h3>最新音乐</h3>
      <div class="songs">
        <div class="song" v-for="(item, index) in songsArr" :key="index">
          <div class="imgbox">
            <div class="play">
              <span
                class="iconfont icon-bofang"
                @click="playMusic(item.id)"
              ></span>
            </div>
            <img :src="item.picUrl" alt="" class="songImg" />
          </div>
          <div class="introductory">
            <span class="songName" @click="playMusic(item.id)">{{ item.name }}</span>
            <span class="author" @click="toArtist(item.song.artists[0].id)">{{ item.song.artists[0].name }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mv">
      <h3>推荐mv</h3>
      <div class="mvboxs">
        <div class="mvbox" v-for="(item, index) in mvsArr" :key="index" @click="toMV(item.id)">
          <div class="picbox">
            <div class="play">
              <span class="iconfont icon-bofang"></span>
            </div>
            <img :src="item.picUrl" alt="" />
            <div class="icon">
              <span class="iconfont icon-play"></span>
              <span>{{ item.playCount }}</span>
            </div>
          </div>
          <div class="mv-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // 轮播图
      bannerArr: [],
      // 推荐歌单
      listArr: [],
      //最新音乐
      songsArr: [],
      //推荐mv
      mvsArr: [],
    };
  },
  created() {
    axios({
      url: "http://localhost:3000/banner",
    }).then((res) => {
      console.log(res);
      this.bannerArr = res.data.banners;
    });
    axios({
      url: "http://localhost:3000/personalized",
      params: {
        limit: 10,
      },
    }).then((res) => {
      console.log(res);
      this.listArr = res.data.result;
    });
    axios({
      url: "http://localhost:3000/personalized/newsong",
    }).then((res) => {
      console.log(res);
      this.songsArr = res.data.result;
    });
    axios({
      url: "http://localhost:3000/personalized/mv",
    }).then((res) => {
      console.log(res);
      this.mvsArr = res.data.result;
    });
  },
  methods: {
    //转跳到歌手详情页
    toArtist(id){
      this.$router.push(`/artist?q=${id}`)
    },
    //播放音乐
    playMusic(id) {
      console.log(id);
      axios({
        url: "http://localhost:3000/song/url",
        params: {
          id,
        },
      }).then((res) => {
        console.log(res);
        let url = res.data.data[0].url;
        //设置给父组件的播放地址
        this.$parent.musicUrl = url;
      });
    },
    //去mv详情
    toMV(id){
      console.log(id);
      this.$router.push(`/mv?q=${id}`)
    },
    //去歌单详情页
    toPlaylist(id) {
      console.log(id);
      this.$router.push(`/playlist?q=${id}`);
    },
  },
};
</script>

<style lang="less" scoped>
@font-face {
  font-family: "iconfont"; /* Project id  */
  src: url("../assets/font_mvplay/iconfont.ttf?t=1623297425531") format("truetype");
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


.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.recommend {
  height: 650px;
}
.new {
  height: 780px;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}
.items {
  width: 1200px;
  display: flex;
  flex-wrap: wrap;
  .item {
    overflow: hidden;
    position: relative;
    // border: 1px solid pink;
    width: 200px;
    height: 250px;
    margin: 20px;
    img {
      cursor: pointer;
      width: 200px;
      height: 200px;
      &:hover +.copywrite span {
        color: rgb(244, 128, 37);
      }
    }
    .name {
      display: block;
      width: 100%;
      position: absolute;
      top: -100px;
      background-color: rgba(0, 0, 0, 0.3);
      color: #fff;
      transition: all 0.6s ease-in-out;
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
      padding: 10px;
      span {
        font-size: 14px;
      }
    }
    .copywrite {
      margin-top: 20px;
      span {
        display: block;
        width: 200px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          color: rgb(244, 128, 37);
        }
      }
    }
  }
}
.item:hover .name {
  top: 0;
}
.songs {
  width: 1200px;
  display: flex;
  flex-wrap: wrap;
  .song {
    position: relative;
    width: 550px;
    margin: 20px;
    display: flex;
    .imgbox {
      width: 100px;
      height: 100px;
      &:hover .play span {
        display: block;
      }
    }
    .play {
      position: absolute;
      span {
        display: none;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        border-radius: 15px;
        font-size: 50px;
        z-index: 999;
        color: #ccc;
        background-color: rgba(0, 0, 0, 0.3);
        cursor: pointer;
      }
    }
    .songImg {
      width: 100px;
      height: 100px;
    }
    .introductory {
      // border: 1px solid pink;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      font-size: 15px;
      margin-left: 15px;
      padding: 10px;
      .author {
        color: rgb(109, 104, 104);
        font-size: 12px;
        cursor: pointer;
        &:hover {
          color: rgb(244, 128, 37);
        }
      }
      .songName{
        &:hover {
          cursor: pointer;
          color: rgb(244, 128, 37);
        }
      }
    }
  }
}
.song:hover {
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
}
.mvboxs {
  display: flex;
  justify-content: space-between;
  .mvbox {
    width: 250px;
    height: 200px;
    // border: 1px solid pink;
    margin: 20px; 
    cursor: pointer;
    .picbox {
      width: 100%;
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
    }
    .mv-wrap {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 13px;
      color: #888;
      padding: 5px;
      .name {
        height: 40px;
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
</style>