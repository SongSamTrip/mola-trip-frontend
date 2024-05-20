import { createRouter, createWebHistory } from 'vue-router'
import MapPage from '@/views/Map.vue'
import Notice from '@/views/Notice.vue'
import BoardList from '@/components/BoardList.vue'
import BoardForm from '@/components/BoardForm.vue'
import MainPage from '@/views/Main.vue'
import OAuthCallback from '../views/OAuthCallback.vue'
import Land from '../views/Land.vue'
import BoardDetails from '@/components/BoardDetails.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/map/:tripId',
      name: 'map',
      component: MapPage,
      props: true
    },
    {
      path: '/',
      name: 'main',
      component: MainPage
    },
    {
      path: '/auth/oauth-response/:token',
      name: 'OAuthCallback',
      component: OAuthCallback,
      props: true
    },
    {
      path: '/land',
      name: 'land',
      component: Land,
    },
    {
      path: '/tripPosts',
      name: 'tripPosts',
      component: Notice,
      children: [
        {
          path: 'boardList',
          name: 'boardList',
          component: BoardList
        },
        {
          path: 'boardForm',
          name: 'boardForm',
          component: BoardForm
        },
        {
          path: 'boardDetails/:tripPostId',
          name: 'boardDetails',
          component: BoardDetails,
          props: true
        }
      ]
    }
  ]
})

export default router
