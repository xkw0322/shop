import Vue from 'vue'
import VueRouter from 'vue-router'
import RecommendView from "@/components/RecommendView.vue"
import DiscoveryView from "@/components/DiscoveryView.vue"
import newView from "@/components/newView.vue"
import MVView from "@/components/MVView.vue"
import Result from "@/components/Result.vue"
import playlist from "@/components/playlist.vue"
import mv from "@/components/mv.vue"
import artist from "@/components/artist.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: DiscoveryView
  },{
    path: '/discovery',
    component: DiscoveryView
  },{
    path: '/recommend',
    component: RecommendView
  },{
    path: '/newmusic',
    component: newView
  },{
    path: '/MVView',
    component: MVView
  },{
    path: '/result',
    component: Result
  },{
    path: '/playlist',
    component: playlist
  },{
    path: '/mv',
    component: mv
  },{
    path: '/artist',
    component: artist
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
