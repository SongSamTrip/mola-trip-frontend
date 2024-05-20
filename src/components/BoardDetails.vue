<template>
  <div class="main">
    <div class="container">
      <header class="header">
        <h1 class="logo">게시글 상세</h1>
        <div class="search-profile">
          <p type="text" class="search-bar">제목 : {{ post.name }}</p>
          <p type="text" class="search-bar">글쓴이 : {{ post.nickname }}</p>
        </div>
      </header>
      <main class="main-content">
        <div v-html="post.content"></div>
        <div class="tags">
          <p>#nature, #hiking, #wildflowers</p>
        </div>
        <div class="like-and-comments">
          <button @click="toggleLike" class="like-button">
            <span v-if="liked">&#9829;</span> <!-- Filled heart -->
            <span v-else>&#9825;</span> <!-- Empty heart -->
          </button>
          <form @submit.prevent="submitComment" class="comment-form">
            <input type="text" v-model="newComment" placeholder="댓글 입력..." class="comment-input">
            <button type="submit" class="comment-submit">댓글 등록</button>
          </form>
          <ul class="comment-list">
            <li v-for="comment in comments" :key="comment.id" class="comment-item">
              {{ comment.content }}
            </li>
          </ul>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/commons/axios';

const route = useRoute();
const post = ref({});
const liked = ref(false);
const comments = ref([]);
const newComment = ref('');

onMounted(async () => {
  try {
    const postId = route.params.tripPostId;
    const response = await axios.get(`http://localhost:8080/tripPosts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    post.value = response.data;
    // 데이터를 받아서 좋아요 상태와 댓글 목록을 초기화합니다.
    liked.value = post.value.like;
    comments.value = post.value.commentDtos || [];
  } catch (error) {
    console.error('게시글 상세 정보 조회 중 오류가 발생했습니다:', error);
  }
});

// Toggle like state
const toggleLike = () => {
  liked.value = !liked.value;
  // 서버에 좋아요 상태를 업데이트하기 위한 로직을 추가할 수 있습니다.
};

const submitComment = async () => {
  console.log(post.value.id);
  if (newComment.value.trim()) {
    // 댓글 데이터를 서버에 전송합니다.
    try {
      const response = await axios.post(`http://localhost:8080/tripPosts/${post.value.id}/comments`, {

        content: newComment.value
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      // 서버에서 처리된 댓글 데이터를 받아옵니다.
      const savedComment = response.data;
      
      // 화면의 댓글 목록에 추가합니다.
      comments.value.push(savedComment);

      // 입력 창을 비웁니다.
      newComment.value = '';
    } catch (error) {
      console.error('댓글 저장 중 오류가 발생했습니다:', error);
    }
  }
};
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

.search-profile {
  display: flex;
  align-items: center;
}

.search-bar {
  padding: 8px;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin-left: 10px;
  margin-right: 10px;
  width: 200px;
}

.main-content {
  padding-top: 20px;
}

.like-and-comments {
  margin-top: 20px;
  text-align: left;
}

.like-button {
  font-size: 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: #e74c3c;
}

.comment-form {
  display: flex;
  margin-top: 10px;
}

.comment-input {
  flex-grow: 1;
  padding: 8px;
  border-radius: 20px;
  border: 1px solid #ccc;
}

.comment-submit {
  padding: 8px 16px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 20px;
  margin-left: 10px;
  cursor: pointer;
}

.comment-list {
  margin-top: 10px;
  list-style: none;
  padding: 0;
}

.comment-item {
  margin-bottom: 5px;
  padding: 8px;
  background-color: #ecf0f1;
  border-radius: 10px;
}
</style>
