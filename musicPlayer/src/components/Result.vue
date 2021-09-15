<template>
  <div class="result-con">
    <div class="title-wrap">
      <h2 class="title">{{ $route.query.q }}</h2>
      <span class="sub-title">找到{{ count }}个结果</span>
    </div>
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="歌曲" name="songs">
          <table class="table">
            <thead>
              <th></th>
              <th>音乐标题</th>
              <th>歌手</th>
              <th>专辑</th>
              <th>时长</th>
            </thead>
            <tbody>
              <tr class="row" v-for="(item, index) in songList" :key="index">
                <td>{{ index + 1 }}</td>
                <td class="song-wrap">
                  <div class="name-wrap">
                    <span @dblclick="playMusic(item.id)">{{ item.name }}</span>
                    <span
                      v-if="item.mvid != 0"
                      class="iconfont icon-chakanMV"
                      @click="toMV(item.mvid)"
                    ></span>
                  </div>
                  <!-- 二级标题 -->
                  <span v-if="item.alias.length != 0">{{ item.alias[0] }}</span>
                </td>
                <td><span class="singerName" @click="toArtist(item.artists[0].id)">{{ item.artists[0].name }}</span></td>
                <td>{{ item.album.name }}</td>
                <td>{{ item.duration }}</td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="歌单" name="lists">
          <div class="items">
            <div
              class="item"
              v-for="(item, index) in playlists"
              :key="index"
              @click="toPlaylist(item.id)"
            >
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
        </el-tab-pane>
        <el-tab-pane label="mv" name="mv">
          <div class="mv">
            <div class="mvboxs">
              <div class="mvbox" v-for="(item, index) in mv" :key="index" @click="toMV(item.id)">
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
                    <span>{{ item.duration }}</span>
                  </div>
                </div>
                <div class="mv-wrap">
                  <div class="name">{{ item.name }}</div>
                  <div class="singer">{{ item.artistName }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "../assets/font_mv/iconfont.css";
export default {
  data() {
    return {
      //tab栏切换时会改变的数据
      activeName: "songs",
      //保存 查询歌曲
      songList: [],
      //保存歌单
      playlists: [],
      //保存mv
      mv: [],
      //搜索结果总数
      count: 0,
    };
  },
  watch: {
    activeName() {
      let type = 1;
      //获取个数
      let limit = 10;
      switch (this.activeName) {
        case "songs":
          type = 1;
          limit = 10;
          break;
        case "lists":
          type = 1000;
          limit = 10;
          break;
        case "mv":
          type = 1004;
          limit = 8;
          break;
        default:
          break;
      }
      axios({
        url: "http://localhost:3000/search",
        params: {
          keywords: this.$route.query.q,
          type, //type:type
          //获取数据量
          limit, //limit:limit
        },
      }).then((res) => {
        console.log(res);
        if (type == 1) {
          this.songList = res.data.result.songs;
          //处理时长 毫秒转为分秒
          for (let i = 0; i < this.songList.length; i++) {
            //获取总的毫秒数
            let duration = this.songList[i].duration;
            let min = parseInt(duration / 1000 / 60);
            let s = parseInt((duration / 1000) % 60);
            min = min < 10 ? "0" + min : min;
            s = s < 10 ? "0" + s : s;
            this.songList[i].duration = `${min}:${s}`;
          }
          this.count = res.data.result.songCount;
        } else if (type == 1000) {
          this.playlists = res.data.result.playlists;
          this.count = res.data.result.playlistCount;
          //处理次数 如果大于100000
          for (let i = 0; i < this.playlists.length; i++) {
            this.playlists[i].playCount =
              this.playlists[i].playCount > 100000
                ? parseInt(this.playlists[i].playCount / 10000) + "万"
                : this.playlists[i].playCount;
          }
        } else {
          this.mv = res.data.result.mvs;
          this.count = res.data.result.mvCount;
          //处理时长 毫秒转为分秒
          for (let i = 0; i < this.mv.length; i++) {
            //获取总的毫秒数
            let duration = this.mv[i].duration;
            let min = parseInt(duration / 1000 / 60);
            let s = parseInt((duration / 1000) % 60);
            min = min < 10 ? "0" + min : min;
            s = s < 10 ? "0" + s : s;
            this.mv[i].duration = `${min}:${s}`;
          }
          //处理次数 如果大于100000
          for (let i = 0; i < this.mv.length; i++) {
            this.mv[i].playCount =
              this.mv[i].playCount > 100000
                ? parseInt(this.mv[i].playCount / 10000) + "万"
                : this.mv[i].playCount;
          }
        }
      });
    },
    //在搜索结果页面中再次搜索时，需要观察地址的变化，如果地址发生变化，开始重新加载页面
    $route() {
      let type = 1;
      //获取个数
      let limit = 10;
      switch (this.activeName) {
        case "songs":
          type = 1;
          limit = 10;
          break;
        case "lists":
          type = 1000;
          limit = 10;
          break;
        case "mv":
          type = 1004;
          limit = 8;
          break;
        default:
          break;
      }
      axios({
        url: "http://localhost:3000/search",
        params: {
          keywords: this.$route.query.q,
          type, //type:type
          //获取数据量
          limit, //limit:limit
        },
      }).then((res) => {
        console.log(res);
        if (type == 1) {
          this.songList = res.data.result.songs;
          //处理时长 毫秒转为分秒
          for (let i = 0; i < this.songList.length; i++) {
            //获取总的毫秒数
            let duration = this.songList[i].duration;
            let min = parseInt(duration / 1000 / 60);
            let s = parseInt((duration / 1000) % 60);
            min = min < 10 ? "0" + min : min;
            s = s < 10 ? "0" + s : s;
            this.songList[i].duration = `${min}:${s}`;
          }
          this.count = res.data.result.songCount;
        } else if (type == 1000) {
          this.playlists = res.data.result.playlists;
          this.count = res.data.result.playlistCount;
          //处理次数 如果大于100000
          for (let i = 0; i < this.playlists.length; i++) {
            this.playlists[i].playCount =
              this.playlists[i].playCount > 100000
                ? parseInt(this.playlists[i].playCount / 10000) + "万"
                : this.playlists[i].playCount;
          }
        } else {
          this.mv = res.data.result.mvs;
          this.count = res.data.result.mvCount;
          //处理时长 毫秒转为分秒
          for (let i = 0; i < this.mv.length; i++) {
            //获取总的毫秒数
            let duration = this.mv[i].duration;
            let min = parseInt(duration / 1000 / 60);
            let s = parseInt((duration / 1000) % 60);
            min = min < 10 ? "0" + min : min;
            s = s < 10 ? "0" + s : s;
            this.mv[i].duration = `${min}:${s}`;
          }
          //处理次数 如果大于100000
          for (let i = 0; i < this.mv.length; i++) {
            this.mv[i].playCount =
              this.mv[i].playCount > 100000
                ? parseInt(this.mv[i].playCount / 10000) + "万"
                : this.mv[i].playCount;
          }
        }
      });
    },
  },
  methods: {
    //跳转到歌手详情页
    toArtist(id){
      this.$router.push(`/artist?q=${id}`)
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
        console.log(this.$parent);
        //设置给父组件的播放地址
        this.$parent.musicUrl = url;
      });
    },
  },
  created() {
    axios({
      url: "http://localhost:3000/search",
      params: {
        keywords: this.$route.query.q,
        type: 1,
        //获取数据量
        limit: 10,
      },
    }).then((res) => {
      console.log(res);
      this.songList = res.data.result.songs;
      //处理时长 毫秒转为分秒
      for (let i = 0; i < this.songList.length; i++) {
        //获取总的毫秒数
        let duration = this.songList[i].duration;
        let min = parseInt(duration / 1000 / 60);
        let s = parseInt((duration / 1000) % 60);
        min = min < 10 ? "0" + min : min;
        s = s < 10 ? "0" + s : s;
        this.songList[i].duration = `${min}:${s}`;
      }
      this.count = res.data.result.songCount;
    });
  },
};
</script>

<style lang="less" scoped>
.result-con {
  .title-wrap {
    display: flex;
    height: 40px;
    margin-bottom: 50px;
    .title {
      display: block;
      font-size: 30px;
      margin-right: 10px;
    }
    .sub-title {
      text-align: center;
      font-size: 13px;
      color: #888;
      line-height: 60px;
    }
  }
}

//歌曲
.table {
  border-collapse: collapse;
  width: 1200px;
  th {
    height: 50px;
    color: #888;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    padding: 10px;
  }
  .row {
    height: 100px;
    // border: 1px solid pink;
    font-size: 14px;
    &:nth-child(odd) {
      background-color: #fff;
    }
    &:nth-child(even) {
      background-color: #fafafa;
    }
    &:hover {
      background-color: #f5f7fb;
    }
    &:hover .img-wrap .icon-bofang {
      display: block;
    }
    td {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 10px;
      &:nth-child(2) {
        width: 300px;
      }
      &:nth-child(3) {
        width: 250px;
      }
      &:nth-child(4) {
        width: 450px;
      }
    }
    .song-wrap {
      height: 100px;
      padding: 20px 10px;
      .name-wrap {
        display: flex;
        span {
          font-size: 14px;
          color: #9a9a9a;
          cursor: pointer;
          &:hover {
            color: #f48025;
          }
        }
        .icon-chakanMV {
          color: rgb(244, 128, 37);
          padding-top: 3px;
          margin-left: 5px;
        }
      }
      span {
        display: block;
        margin-top: 10px;
        font-size: 12px;
        color: #ccc;
      }
    }
    .singerName {
        cursor: pointer;
        &:hover {
          color: #f48025;
        }
      }
  }
}

//歌单
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

//mv
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
</style>