<template>
  <div class="main">
    <div class="container">
      <header class="header">
        <h1 class="logo">게시글 목록</h1>
        <div class="sort-buttons">
          <button @click="setSortField('like')" class="sort-button">
            좋아요
            <span v-if="sortField === 'like'">
              <i :class="sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'"></i>
            </span>
          </button>
          <button @click="setSortField('date')" class="sort-button">
            날짜
            <span v-if="sortField === 'date'">
              <i :class="sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'"></i>
            </span>
          </button>
          <button @click="fetchMyPosts" class="my-posts-button">내가 쓴 글 조회</button>
        </div>
      </header>
      <main class="main-content">
        <div v-for="post in posts" :key="post.id" 
             :class="['post-item', { 'private-post': post.tripPostStatus === 'PRIVATE' }]" 
             @click="getDetails(post.id)">
          <div class="post-image">
            <img :src="!post.imageUrl || post.imageUrl.trim() === '' ? 'https://via.placeholder.com/100' : post.imageUrl" alt="게시글 이미지">
          </div>
          <div class="post-details">
            <h2>{{ post.name }}</h2>
            <p>댓글 수: {{ post.commentCount }} | 좋아요 수: {{ post.likeCount }}</p>
            <p>작성일: {{ formatDate(post.createdDate) }}</p>
            <p>글쓴이: {{ post.writer }}</p>
          </div>
        </div>
        <div class="pagination">
          <button
            v-for="n in totalPages"
            :key="n"
            @click="fetchPosts(n - 1)"
            :class="{ 'active-page': currentPage === n - 1 }"
            class="page-number"
          >
            {{ n }}
          </button>
        </div>
      </main>
    </div>
  </div>
  <div class="underlay-photo"></div>
  <div class="underlay-black"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/commons/axios';

const posts = ref([]);
const currentPage = ref(0);
const totalPages = ref(0);
const sortField = ref('like'); // 초기 정렬 필드: 좋아요 수
const sortOrder = ref('desc'); // 초기 정렬 순서: 내림차순
const router = useRouter();

onMounted(() => {
  fetchPosts(currentPage.value);
});

async function fetchPosts(page) {
  const pageSize = 10; // 한 페이지당 항목 수 고정
  const sort = `${sortField.value},${sortOrder.value}`;
  try {
    const response = await axios.get(`http://localhost:8080/tripPosts?page=${page}&size=${pageSize}&sort=${sort}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });

    posts.value = response.data.content;
    currentPage.value = response.data.number;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('게시글 목록을 불러오는 중 오류가 발생했습니다:', error);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

function setSortField(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'desc';
  }
  fetchPosts(0); // 정렬을 변경한 후 첫 페이지부터 다시 조회
}

async function fetchMyPosts() {
  const sort = `${sortField.value},${sortOrder.value}`;
  try {
    const response = await axios.get(`http://localhost:8080/tripPosts/myPosts?sort=${sort}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });

    posts.value = response.data.content;
    currentPage.value = response.data.number;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('내 게시물을 불러오는 중 오류가 발생했습니다:', error);
  }
}

function getDetails(tripPostId) {
  router.push({ name: 'boardDetails', params: { tripPostId } });
}
</script>

<style scoped>

.sort-buttons {
  display: flex;
  align-items: center;
}

.sort-button {
  margin-right: 10px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  position: relative;
}

.sort-button i {
  margin-left: 5px;
}

.arrow-up::before {
  content: '↑';
}

.arrow-down::before {
  content: '↓';
}

.main {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
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

.my-posts-button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.main-content {
  padding-top: 20px;
}

.post-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.private-post {
  background-color: #f2dede; /* 연한 빨간색 배경 */
}

.post-image img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  object-position: center;
  border-radius: 10px;
  margin-right: 15px;
}

.post-details h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.post-details p {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.page-number {
  padding: 5px 10px;
  margin: 0 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f7f7f7;
  transition: background-color 0.3s, color 0.3s;
}

.page-number:hover {
  background-color: #3498db;
  color: white;
}

.active-page {
  background-color: #3498db;
  color: white;
}

[class*="underlay"] {
  left: 0;
  min-height: 100%;
  min-width: 100%;
  position: fixed;
  top: 0;
}

.underlay-photo {
  animation: hue-rotate 6s infinite;
  background: url('https://cdn.pixabay.com/photo/2016/12/21/07/43/korea-1922376_1280.jpg') no-repeat center center;
  background-size: cover;
  filter: grayscale(30%);
  z-index: -1;
}

.underlay-black {
  background: rgba(0, 0, 0, 0.7);
  z-index: -1;
}
</style>
