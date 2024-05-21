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
      props: true,
      meta: { requiresAuth: true } // 인증 필요 표시
    },
    {
      path: '/',
      name: 'main',
      component: MainPage,
      meta: { guestOnly: true } // 로그인하지 않은 사용자만 접근 가능
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
      meta: { requiresAuth: true } // 인증 필요 표시
    },
    {
      path: '/tripPosts',
      name: 'tripPosts',
      component: Notice,
      meta: { requiresAuth: true }, // 인증 필요 표시
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
});

// 전역 가드 추가
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);
  const authToken = localStorage.getItem('authToken');

  if (requiresAuth && !authToken) {
    next({ name: 'main' }); // 인증이 필요한데 토큰이 없으면 메인 페이지로 리다이렉트
  } else if (guestOnly && authToken) {
    next({ name: 'land' }); // 로그인한 사용자가 메인 페이지에 접근하려고 할 때
  } else {
    next(); // 그 외에는 요청된 경로로 정상 이동
  }
});

export default router;