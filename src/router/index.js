import {
  createRouter,
  createWebHistory
} from 'vue-router'
import common from './routers/common'
import demo from './routers/demo'

import rank from './routers/rank'

const routes = [{
    path: '/',
    redirect: '/index'
  },
  ...common,
  ...demo,
  ...rank
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router