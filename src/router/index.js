import { createRouter, createWebHistory } from 'vue-router'
import MapPage from '@/views/Map.vue'
import Notice from '@/views/Notice.vue'
import Board from '@/components/Board.vue'
import BoardForm from '@/components/BoardForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/map',
      name: 'map',
      component: MapPage
    },
    {
      path: '/notice',
      name: 'notice',
      component: Notice,
      children: [
        {
          path: 'boardList',
          name: 'boardList',
          component: Board
        },
        {
          path: 'boardForm',
          name: 'boardForm',
          component: BoardForm
        }
      ]
    }
  ]
})

export default router
