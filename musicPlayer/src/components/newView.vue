<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span class="item" @click="tag = 0" :class="{ active: tag == 0 }"
        >全部</span
      >
      <span class="item" @click="tag = 7" :class="{ active: tag == 7 }"
        >华语</span
      >
      <span class="item" @click="tag = 96" :class="{ active: tag == 96 }"
        >欧美</span
      >
      <span class="item" @click="tag = 8" :class="{ active: tag == 8 }"
        >日本</span
      >
      <span class="item" @click="tag = 16" :class="{ active: tag == 16 }"
        >韩国</span
      >
    </div>
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
        <tr class="row" v-for="(item, index) in lists" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap">
              <span class="iconfont icon-bofang" @click="playMusic(item.id)"> </span>
              <img :src="item.album.picUrl" alt="" />
            </div>
          </td>
          <td class="song-wrap">
            <div class="name-wrap" >
              <span @click="playMusic(item.id)" class="name">{{ item.name }}</span>
              <!-- <span class="inconfont icon-chakanMV"></span> -->
              <span v-if="item.mvid!=0" class="iconfont icon-chakanMV" @click="toMV(item.mvid)"> </span>
            </div>
            <span v-if="item.alias.length != 0">{{ item.alias[0] }}</span>
          </td>
          <td><span class="singerName" @click="toArtist(item.artists[0].id)">{{ item.album.artists["0"].name }}</span></td>
          <td>{{ item.album.name }}</td>
          <td>{{ item.duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import "../assets/font_mv/iconfont.css"
import axios from "axios";
export default {
  data() {
    return {
      //歌曲列表
      lists: [],
      //分类
      tag: "0",
    };
  },
  methods: {
    //转跳到歌手详情页
    toArtist(id){
      this.$router.push(`/artist?q=${id}`)
    },
    //跳转到mv详情页
    toMV(id){
      this.$router.push(`/mv?q=${id}`)
    },
    playMusic(id){
      axios({
        url:'http://localhost:3000/song/url',
        params:{
          id
        }
      }).then(res=>{
        console.log(res);
        let url = res.data.data[0].url;
        this.$parent.musicUrl = url;
      })
    }
  },
  watch: {
    tag() {
      axios({
        url: "http://localhost:3000/top/song",
        params: {
          type: this.tag,
        },
      }).then((res) => {
        console.log(res);
        this.lists = res.data.data;
        //处理时长 毫秒转为分秒
        for (let i = 0; i < this.lists.length; i++) {
          //获取总的毫秒数
          let duration = this.lists[i].duration;
          let min = parseInt(duration / 1000 / 60);
          let s = parseInt((duration / 1000) % 60);
          min = min < 10 ? "0" + min : min;
          s = s < 10 ? "0" + s : s;
          this.lists[i].duration = `${min}:${s}`;
        }
      });
    },
  },
  created() {
    axios({
      url: "http://localhost:3000/top/song",
      params: {
        type: this.tag,
      },
    }).then((res) => {
      console.log(res);
      this.lists = res.data.data;
      //处理时长 毫秒转为分秒
      for (let i = 0; i < this.lists.length; i++) {
        //获取总的毫秒数
        let duration = this.lists[i].duration;
        let min = parseInt(duration / 1000 / 60);
        let s = parseInt((duration / 1000) % 60);
        min = min < 10 ? "0" + min : min;
        s = s < 10 ? "0" + s : s;
        this.lists[i].duration = `${min}:${s}`;
      }
    });
  },
};
</script>

<style lang="less" scoped>

.tab-bar {
  text-align: right;
  margin-bottom: 20px;
  .item {
    margin: 20px;
    color: #888;
    cursor: pointer;
  }
  .active {
    color: rgb(244, 128, 37);
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
    &:hover .img-wrap .icon-bofang{
      display: block;
    }
    td {
      padding: 10px;
      &:nth-child(3) {
        width: 200px;
      }
      &:nth-child(4) {
        width: 200px;
      }
      &:nth-child(5) {
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
        .name{
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
    .singerName {
      cursor: pointer;
      &:hover {
        color: #f48025;
      }
    }
  }
}
</style>