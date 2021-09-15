<template>
  <div class="mv-box">
    <div class="mv-info">
      <h2 class="info-hd">mv详情</h2>
      <div class="info-con">
        <video :src="mv.url" loop controls></video>
        <div class="singer-info">
          <img :src="icon" alt="" />
          <span class="name">{{ mvData.artistName }}</span>
        </div>
        <div class="mv-des">
          <h2 class="title">{{ mvData.name }}</h2>
          <div class="attr">
            <span class="time">发布时间：{{ mvData.publishTime }}</span>
            <span class="num">播放：{{ mvData.playCount }}次</span>
          </div>
          <div class="con" v-if="mvData.desc != ''">
            {{ mvData.desc }}
          </div>
        </div>
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
                <div
                  class="re-combox"
                  v-if="
                    item.beReplied.length != 0 &&
                    item.beReplied[0].content != null
                  "
                >
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
            <div class="new-box" v-for="(item, index) in comments" :key="index">
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
                <div
                  class="re-combox"
                  v-if="
                    item.beReplied.length != 0 &&
                    item.beReplied[0].content != null
                  "
                >
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
    </div>
    <div class="mv-recommend">
      <h2 class="rec-hd">相关详情</h2>
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
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // 页码数
      page: 1,
      //热门评论
      hotComment: [],
      //最新评论
      comments: [],
      //热门评论个数
      hotCount: 0,
      //最新评论个数
      total: 0,
      //mv地址
      mv: [],
      //mv数据信息
      mvData: [],
      //歌手封面
      icon: "",
      //获取相关的mv
      mvs: [],
    };
  },
  watch: {
    $route() {
      //获取mv地址
      axios({
        url: "http://localhost:3000/mv/url",
        params: {
          id: this.$route.query.q,
        },
      }).then((res) => {
        //   console.log(res);
        this.mv = res.data.data;
      });
      //获取mv数据
      axios({
        url: "http://localhost:3000/mv/detail",
        params: {
          mvid: this.$route.query.q,
        },
      }).then((res) => {
        console.log(res);
        this.mvData = res.data.data;
        //获取歌手信息
        axios({
          url: "http://localhost:3000/artists",
          params: {
            id: this.mvData.artists[0].id,
          },
        }).then((res) => {
          console.log(res);
          //歌手的封面信息
          this.icon = res.data.artist.picUrl;
        });
      });

      //获取热门评论
      axios({
        url: "http://localhost:3000/comment/mv",
        params: {
          id: this.$route.query.q,
          limit: 10,
          offset: 0,
        },
      }).then((res) => {
        console.log(res);
        this.hotComment = res.data.hotComments;
        this.comments = res.data.comments;
        this.total = res.data.total;
        this.hotCount = res.data.hotComments.length;
        //处理时间
        for (let i = 0; i < this.hotComment.length; i++) {
          let time = this.getDate(this.hotComment[i].time);
          // console.log(time);
          this.hotComment[i].time = time;
        }
        //处理时间
        for (let i = 0; i < this.comments.length; i++) {
          let time = this.getDate(this.comments[i].time);
          // console.log(time);
          this.comments[i].time = time;
        }
      });

      //相关mv
      axios({
        url: "http://localhost:3000/simi/mv",
        params: {
          mvid: this.$route.query.q,
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
  },
  methods: {
    //跳转mv详情页
    toMV(id) {
      this.$router.push(`/mv?q=${id}`);
    },
    //分页方法
    handleCurrentChange(val) {
      console.log(`当前页:${val}`);
      //保存页码
      this.page = val;
      //重新获取数据
      //获取最新评论
      axios({
        url: "http://localhost:3000/comment/mv",
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
        //处理时间
        for (let i = 0; i < this.comments.length; i++) {
          let time = this.getDate(this.comments[i].time);
          // console.log(time);
          this.comments[i].time = time;
        }
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
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
  },
  created() {
    //获取mv地址
    axios({
      url: "http://localhost:3000/mv/url",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      //   console.log(res);
      this.mv = res.data.data;
    });
    //获取mv数据
    axios({
      url: "http://localhost:3000/mv/detail",
      params: {
        mvid: this.$route.query.q,
      },
    }).then((res) => {
      console.log(res);
      this.mvData = res.data.data;
      //获取歌手信息
      axios({
        url: "http://localhost:3000/artists",
        params: {
          id: this.mvData.artists[0].id,
        },
      }).then((res) => {
        console.log(res);
        //歌手的封面信息
        this.icon = res.data.artist.picUrl;
      });
    });

    //获取热门评论
    axios({
      url: "http://localhost:3000/comment/mv",
      params: {
        id: this.$route.query.q,
        limit: 10,
        offset: 0,
      },
    }).then((res) => {
      console.log(res);
      this.hotComment = res.data.hotComments;
      this.comments = res.data.comments;
      this.total = res.data.total;
      this.hotCount = res.data.hotComments.length;
      //处理时间
      for (let i = 0; i < this.hotComment.length; i++) {
        let time = this.getDate(this.hotComment[i].time);
        // console.log(time);
        this.hotComment[i].time = time;
      }
      //处理时间
      for (let i = 0; i < this.comments.length; i++) {
        let time = this.getDate(this.comments[i].time);
        // console.log(time);
        this.comments[i].time = time;
      }
    });

    //相关mv
    axios({
      url: "http://localhost:3000/simi/mv",
      params: {
        mvid: this.$route.query.q,
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
.mv-box {
  display: flex;
  .mv-info {
    width: 850px;
    .info-hd {
      font-size: 18px;
      margin-bottom: 10px;
    }
    .info-con {
      width: 820px;
      padding: 10px;
      //   border: 1px solid pink;
      video {
        width: 800px;
      }
      .singer-info {
        margin-top: 10px;
        display: flex;
        align-items: center;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50% 50%;
          margin-right: 10px;
        }
        .name {
          font-size: 14px;
        }
      }
      .mv-des {
        margin-top: 20px;
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          font-size: 25px;
          margin-bottom: 20px;
        }
        .attr {
          font-size: 12px;
          color: #888;
          margin-bottom: 20px;
          .time {
            margin-right: 20px;
          }
        }
        .con {
          font-size: 14px;
          line-height: 20px;
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
      .fenye {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
      }
    }
  }
  .mv-recommend {
    .rec-hd {
      font-size: 20px;
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
}
</style>