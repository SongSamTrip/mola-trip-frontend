<template>
  <div class="main">
    <div class="container">
      <header class="header">
        <h1 class="logo">게시글 목록</h1>
      </header>
      <main class="main-content">
        <div v-for="post in posts" :key="post.id" class="post-item" @click="getDetails(post.id)">
          <h2>{{ post.name }}</h2>
          <p>댓글 수: {{ post.commentCount }} | 좋아요 수: {{ post.likeCount }}</p>
        </div>
        <div class="pagination">
          <button @click="fetchPosts(currentPage - 1)" :disabled="currentPage <= 0">이전</button>
          <button @click="fetchPosts(currentPage + 1)" :disabled="currentPage >= totalPages - 1">다음</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/commons/axios';

const posts = ref([]);
const currentPage = ref(0);
const totalPages = ref(0);
const router = useRouter();

onMounted(() => {
  fetchPosts(currentPage.value);
});

async function fetchPosts(page) {
  try {
    const response = await axios.get(`http://localhost:8080/tripPosts?page=${page}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
    posts.value = response.data.content;
    currentPage.value = response.data.number;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('게시글 목록을 불러오는 중 오류가 발생했습니다:', error);
  }
}

function getDetails(tripPostId) {
  router.push({ name: 'boardDetails', params: { tripPostId } });
}
</script>

<style scoped>
.main {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  width: 800px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.main-content {
  padding-top: 20px;
}

.post-item {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.post-item h2 {
  margin: 0;
}

.post-item p {
  color: #666;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
}

.pagination button:disabled {
  color: #ccc;
  cursor: not-allowed;
}
</style>
