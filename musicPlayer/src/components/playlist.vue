<template>
  <div class="playlist-con">
    <div class="top-wrap">
      <div class="img-wrap">
        <!-- 封面 -->
        <img :src="playlist.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <!-- 名字 -->
        <p class="title">{{ playlist.name }}</p>
        <div class="author-wrap">
          <img :src="playlist.creator.avatarUrl" alt="" class="avatar" />
          <span class="name">{{ playlist.creator.nickname }}</span>
          <span class="time">{{ playlist.createTime }} 创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签：</span>
          <ul>
            <li v-for="(item, index) in playlist.tags" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介：</span>
          <span class="desc">{{ playlist.description }}</span>
        </div>
      </div>
    </div>
    <div class="tab">
      <el-tabs v-model="activeName">
        <el-tab-pane label="歌曲列表" name="songs">
          <table class="table">
            <thead>
              <th></th>
              <th></th>
              <th>音乐标题</th>
              <th>歌手</th>
              <th>专辑</th>
              <th>时长</th>
            </thead>
            <tbody>
              <tr class="row" v-for="(item, index) in tracks" :key="index">
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
                    <span @dblclick="playMusic(item.id)" class="name">{{ item.name }}</span>
                    <span
                      v-if="item.mv != 0"
                      class="iconfont icon-chakanMV"
                      @click="toMV(item.mv)"
                    ></span>
                  </div>
                  <!-- 二级标题 -->
                  <span v-if="item.alia.length != 0"> {{ item.alia[0] }} </span>
                </td>
                <td>{{ item.ar[0].name }}</td>
                <td>{{ item.al.name }}</td>
                <td>{{ item.dt }}</td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="评论" name="comments">
          <div class="comment">
            <div class="wonderful">
              <h2>
                精彩评论<span>({{ hotCount }})</span>
              </h2>
              <div
                class="won-box"
                v-for="(item, index) in hotComment"
                :key="index"
              >
                <div class="img">
                  <img :src="item.user.avatarUrl" alt="" />
                </div>
                <div class="con">
                  <div class="combox">
                    <span class="author1">{{ item.user.nickname }}： </span>
                    <div class="com1">
                      {{ item.content }}
                    </div>
                  </div>
                  <div class="re-combox" v-if="item.beReplied.length != 0  && item.beReplied[0].content!=null">
                    <span class="author2">
                      {{ item.beReplied[0].user.nickname }}
                    </span>
                    <div class="com2">
                      {{ item.beReplied[0].content }}
                    </div>
                  </div>
                  <div class="time">{{ item.time }}</div>
                </div>
              </div>
            </div>
            <div class="new">
              <h2>
                最新评论<span>({{ total }})</span>
              </h2>
              <div
                class="new-box"
                v-for="(item, index) in comments"
                :key="index"
              >
                <div class="img">
                  <img :src="item.user.avatarUrl" alt="" />
                </div>
                <div class="con">
                  <div class="combox">
                    <span class="author1"> {{ item.user.nickname }}： </span>
                    <div class="com1">
                      {{ item.content }}
                    </div>
                  </div>
                  <div class="re-combox" v-if="item.beReplied.length != 0 && item.beReplied[0].content!=null">
                    <span class="author2">
                      {{ item.beReplied[0].user.nickname }}：
                    </span>
                    <div class="com2">
                      {{ item.beReplied[0].content }}
                    </div>
                  </div>
                  <div class="time">{{ item.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 分页器 total 总条数  current-page 当前页  page-size  每页多少条 
    current-change 页码改变事件-->
    <div class="fenye">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "../assets/font_mv/iconfont.css";
export default {
  data() {
    return {
      //总条数
      total: 0,
      //页码
      page: 1,
      //歌单详情数据
      playlist: {
        creator: {},
      },
      activeName: "songs",
      //歌曲列表
      tracks: [],
      //热门评论
      hotComment: [],
      //热门评论个数
      hotCount: 0,
      //普通评论
      comments: [],
    };
  },
  methods: {
    //跳转到mv详情页
    toMV(id){
      this.$router.push(`/mv?q=${id}`)
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
    handleCurrentChange(val) {
      console.log(`当前页:${val}`);
      //保存页码
      this.page = val;
      //重新获取数据
      //获取最新评论
      axios({
        url: "http://localhost:3000/comment/playlist",
        params: {
          id: this.$route.query.q,
          limit: 10,
          //根据页码计算
          offset: (this.page - 1) * 10,
        },
      }).then((res) => {
        console.log(res);
        //总个数
        this.total = res.data.total;
        //评论数
        this.comments = res.data.comments;
      });
    },
    // 时间戳转换
    getDate(value) {
      var time = new Date(value);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hour = time.getHours();
      var minute = time.getMinutes();
      var second = time.getSeconds();
      month = month < 10 ? "0" + month : month;
      date = date < 10 ? "0" + date : date;
      hour = hour < 10 ? "0" + hour : hour;
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
    },
  },
  created() {
    //获取歌单详情
    axios({
      url: "http://localhost:3000/playlist/detail",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      console.log(res);
      this.playlist = res.data.playlist;
      this.tracks = res.data.playlist.tracks;
      console.log(this.tracks);
      //处理时长 毫秒转为分秒
      for (let i = 0; i < this.tracks.length; i++) {
        //获取总的毫秒数
        let duration = this.tracks[i].dt;
        let min = parseInt(duration / 1000 / 60);
        let s = parseInt((duration / 1000) % 60);
        min = min < 10 ? "0" + min : min;
        s = s < 10 ? "0" + s : s;
        this.tracks[i].dt = `${min}:${s}`;
      }
    });
    //获取热门评论
    axios({
      url: "http://localhost:3000/comment/hot",
      params: {
        id: this.$route.query.q,
        //传递类型
        type: 2,
      },
    }).then((res) => {
      console.log(res);
      this.hotComment = res.data.hotComments;
      //保存个数
      this.hotCount = res.data.total;
      //处理时间
      for(let i = 0;i<this.hotComment.length;i++){
        let time = this.getDate(this.hotComment[i].time);
        // console.log(time);
        this.hotComment[i].time = time;
      }
      // let time = this.getDate(this.hotComment[0].time);
      //   console.log(time);
      // res.data.hotComments.time = time;
    });
    //获取最新评论
    axios({
      url: "http://localhost:3000/comment/playlist",
      params: {
        id: this.$route.query.q,
        limit: 10,
        offset: 0,
      },
    }).then((res) => {
      console.log(res);
      //总个数
      this.total = res.data.total;
      //评论数
      this.comments = res.data.comments;
      //处理时间
      for(let i = 0;i<this.comments.length;i++){
        let time = this.getDate(this.comments[i].time);
        // console.log(time);
        this.comments[i].time = time;
      }
    });
  },
};
</script>

<style lang="less" scoped>
.playlist-con {
  .top-wrap {
    display: flex;
    .img-wrap {
      width: 250px;
      height: 250px;
      border: 1px solid pink;
      margin-right: 30px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info-wrap {
      height: 250px;
      width: 800px;
      .title {
        font-size: 20px;
        margin-bottom: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .author-wrap {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .avatar {
          margin-right: 10px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-right: 10px;
          font-size: 16px;
        }
        .time {
          font-size: 12px;
        }
      }
      .play-wrap {
        height: 30px;
        width: 100px;
        background-image: linear-gradient(
          45deg,
          #ff9a9e 0%,
          #fad0c4 99%,
          #fad0c4 100%
        );
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      .tag-wrap {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .title {
          font-size: 18px;
          margin-bottom: 0;
        }
        ul {
          display: flex;
          li {
            margin-right: 10px;
            font-size: 14px;
          }
        }
      }
      .desc-wrap {
        height: 78px;
        padding: 5px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        .title {
          font-size: 18px;
        }
        .desc {
          font-size: 14px;
          line-height: 23px;
        }
      }
    }
  }
  .tab {
    margin-top: 30px;
    //歌曲列表
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
        .img-wrap {
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .name-wrap {
            display: flex;
            span {
              font-size: 14px;
              color: #9a9a9a;
              cursor: pointer;
            }
            .name:hover {
              color: #f48025;
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
      }
    }
  }
  .comment {
    .wonderful {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 80px;
      h2 {
        font-weight: normal;
        margin-bottom: 20px;
      }
      .won-box {
        width: 100%;
        // height: 150px;
        // border: 1px solid pink;
        display: flex;
        .img {
          width: 70px;
          height: 100%;
          // border: 1px solid blue;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50% 50%;
          }
        }
        .con {
          margin-left: 20px;
          // border: 1px solid purple;
          width: 100%;
          padding: 15px;
          .combox {
            // display: flex;
            // justify-content: space-between;
            // height: 30px;
            margin-bottom: 10px;
            // border: 1px solid red;
            font-size: 14px;
            line-height: 30px;
            .author1 {
              display: inline;
              // height: 30px;
              color: #5acbf8;
            }
            .com1 {
              display: inline;
            }
          }
          .re-combox {
            background-color: #e5e5e5;
            padding: 10px;
            font-size: 14px;
            line-height: 30px;
            margin-bottom: 10px;
            border-radius: 10px;
            .author2 {
              display: inline;
              // height: 30px;
              color: #5acbf8;
            }
            .com2 {
              display: inline;
            }
          }
          .time {
            font-size: 14px;
            color: #ccc;
          }
        }
      }
    }
    .new {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      h2 {
        font-weight: normal;
        margin-bottom: 20px;
      }
      .new-box {
        margin-bottom: 20px;
        width: 100%;
        // height: 150px;
        // border: 1px solid pink;
        display: flex;
        .img {
          width: 70px;
          height: 100%;
          // border: 1px solid blue;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50% 50%;
          }
        }
        .con {
          margin-left: 20px;
          // border: 1px solid purple;
          width: 100%;
          padding: 15px;
          border-bottom: 1px solid #ccc;
          .combox {
            // display: flex;
            // justify-content: space-between;
            // height: 30px;
            margin-bottom: 10px;
            // border: 1px solid red;
            font-size: 14px;
            line-height: 30px;
            .author1 {
              display: inline;
              // height: 30px;
              color: #5acbf8;
            }
            .com1 {
              display: inline;
            }
          }
          .re-combox {
            background-color: #e5e5e5;
            padding: 10px;
            font-size: 14px;
            line-height: 30px;
            margin-bottom: 10px;
            border-radius: 10px;
            .author2 {
              display: inline;
              // height: 30px;
              color: #5acbf8;
            }
            .com2 {
              display: inline;
            }
          }
          .time {
            font-size: 14px;
            color: #ccc;
          }
        }
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