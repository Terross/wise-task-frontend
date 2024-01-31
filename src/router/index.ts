/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { useProfileStore } from '@/store/profile'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  extendRoutes: (routes: any) => [
    ...setupLayouts(routes),
    {
      path: '/*',
      redirect: () => {
        const { activeUser } = useProfileStore()
        return activeUser == null ? 
          'auth/signIn' : 
          'profiles'
      },
    },
  ],
})

export default router

