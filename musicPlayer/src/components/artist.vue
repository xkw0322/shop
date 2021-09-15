<template>
  <div class="singerbox">
    <div class="box-hd">
      <div class="img">
        <img :src="singer.cover" alt="" />
      </div>
      <div class="des">
        <h2>{{ singer.name }}</h2>
        <span>{{ singer.briefDesc }}</span>
      </div>
    </div>
    <div class="box-con">
      <el-tabs v-model="activeName">
        <el-tab-pane label="歌曲" name="songs">
          <table class="table">
            <thead>
              <th></th>
              <th></th>
              <th>音乐标题</th>
              <th>专辑</th>
              <th>时长</th>
            </thead>
            <tbody>
              <tr class="row" v-for="(item, index) in hotSongs" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <div class="img-wrap">
                    <span
                      class="iconfont icon-bofang"
                      @click="playMusic(item.id)"
                    >
                    </span>
                    <img :src="item.al.picUrl" alt="" />
                  </div>
                </td>
                <td class="song-wrap">
                  <div class="name-wrap">
                    <span @click="playMusic(item.id)" class="name">{{
                      item.name
                    }}</span>
                    <!-- <span class="inconfont icon-chakanMV"></span> -->
                    <span
                      v-if="item.mv != 0"
                      class="iconfont icon-chakanMV"
                      @click="toMV(item.mv)"
                    >
                    </span>
                  </div>
                  <span v-if="item.alia.length != 0">{{ item.alia[0] }}</span>
                </td>
                <td>{{ item.al.name }}</td>
                <td>{{ item.dt }}</td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="mv" name="mv">
          <div class="mvboxs">
            <div
              class="mvbox"
              v-for="(item, index) in mvs"
              :key="index"
              @click="toMV(item.id)"
            >
              <div class="picbox">
                <div class="play">
                  <span class="iconfont icon-bofang"></span>
                </div>
                <img :src="item.imgurl" alt="" />
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/font_mv/iconfont.css";
import axios from "axios";
export default {
  data() {
    return {
      //获取歌手详情数据
      singer: [],
      //控制tab栏
      activeName: "songs",
      //获取歌手热门歌曲
      hotSongs: [],
      //获取歌手mv
      mvs: [],
    };
  },
  methods: {
    //跳转到mv详情页
    toMV(id) {
      this.$router.push(`/mv?q=${id}`);
    },
    playMusic(id) {
      axios({
        url: "http://localhost:3000/song/url",
        params: {
          id,
        },
      }).then((res) => {
        console.log(res);
        let url = res.data.data[0].url;
        this.$parent.musicUrl = url;
      });
    },
  },
  created() {
    //获取歌手详情
    axios({
      url: "http://localhost:3000/artist/detail",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      console.log(res);
      this.singer = res.data.data.artist;
    });
    //获取歌手歌曲
    axios({
      url: "http://localhost:3000/artists",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      console.log(res);
      this.hotSongs = res.data.hotSongs;
      //处理时长 毫秒转为分秒
      for (let i = 0; i < this.hotSongs.length; i++) {
        //获取总的毫秒数
        let duration = this.hotSongs[i].dt;
        let min = parseInt(duration / 1000 / 60);
        let s = parseInt((duration / 1000) % 60);
        min = min < 10 ? "0" + min : min;
        s = s < 10 ? "0" + s : s;
        this.hotSongs[i].dt = `${min}:${s}`;
      }
    });
    //获取歌手mv
    axios({
      url: "http://localhost:3000/artist/mv",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      console.log(res);
      this.mvs = res.data.mvs;
      //处理次数 如果大于100000
      for (let i = 0; i < this.mvs.length; i++) {
        this.mvs[i].playCount =
          this.mvs[i].playCount > 100000
            ? parseInt(this.mvs[i].playCount / 10000) + "万"
            : this.mvs[i].playCount;
      }
      //处理时长 毫秒转为分秒
      for (let i = 0; i < this.mvs.length; i++) {
        //获取总的毫秒数
        let duration = this.mvs[i].duration;
        let min = parseInt(duration / 1000 / 60);
        let s = parseInt((duration / 1000) % 60);
        min = min < 10 ? "0" + min : min;
        s = s < 10 ? "0" + s : s;
        this.mvs[i].duration = `${min}:${s}`;
      }
    });
  },
};
</script>

<style lang="less" scoped>
.singerbox {
  display: flex;
  flex-direction: column;
  .box-hd {
    width: 100%;
    height: 400px;
    display: flex;
    .img {
      width: 800px;
      height: 370px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .des {
      width: 400px;
      height: 370px;
      overflow: hidden;
      h2 {
        font-weight: normal;
        margin-bottom: 20px;
      }
      span {
        line-height: 30px;
      }
    }
  }
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
        padding: 10px;
        &:nth-child(3) {
          width: 300px;
        }
        &:nth-child(4) {
          width: 300px;
        }
      }
      .img-wrap {
        cursor: pointer;
        position: relative;
        width: 80px;
        height: 80px;
        // border: 1px solid blue;
        border-radius: 5px;
        // margin: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
        .icon-bofang {
          position: absolute;
          display: none;
          color: #ccc;
          width: 80px;
          height: 80px;
          text-align: center;
          line-height: 80px;
          font-size: 40px;
          background-color: rgba(0, 0, 0, 0.3);
        }
      }
      .song-wrap {
        height: 100px;
        padding: 20px 10px;
        .name-wrap {
          display: flex;
          .name {
            cursor: pointer;
            &:hover {
              color: #f48025;
            }
          }
          span {
            font-size: 14px;
            color: #9a9a9a;
          }
          .icon-chakanMV {
            color: rgb(244, 128, 37);
            padding-top: 3px;
            margin-left: 5px;
            cursor: pointer;
          }
        }
        span {
          display: block;
          margin-top: 10px;
          font-size: 12px;
          color: #ccc;
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
}
</style>