<template>
  <div>
    Handling OAuth callback...
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

onMounted(() => {
  const router = useRouter()
  const route = useRoute()
  const token = route.params.token

  if (token) {
    localStorage.setItem('authToken', token)
    router.push('/land')  // Redirect to the map page
  } else {
    console.error('Token is missing from the callback URL')
    router.push('/')  // Redirect to the home page or error page
  }
})
</script>
