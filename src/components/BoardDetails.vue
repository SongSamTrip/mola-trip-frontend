<template>
  <div class="main">
    <div class="container">
      <header class="header">
        <h1 class="logo">게시글 상세</h1>
        <div class="search-profile">
          <p class="search-bar">제목: {{ post.name }}</p>
          <p class="search-bar">글쓴이: {{ post.nickname }}</p>
        </div>
      </header>
      <main class="main-content">
        <div v-html="post.content"></div>
        <div class="tags">
          <p>#nature, #hiking, #wildflowers</p>
        </div>
        <div class="like-and-comments">
          <button @click="toggleLike" class="like-button">
            <span v-if="liked">&#9829;</span>
            <span v-else>&#9825;</span>
          </button>
          <form @submit.prevent="submitComment" class="comment-form">
            <input type="text" v-model="newComment" placeholder="댓글 입력..." class="comment-input">
            <button type="submit" class="comment-submit">댓글 등록</button>
          </form>
          <ul class="comment-list">
            <li v-for="comment in comments" :key="comment.id" class="comment-item">
              <div v-if="editCommentId === comment.id">
                <input type="text" v-model="editCommentContent" class="comment-input-edit" />
                <button @click="updateComment(comment.id)" class="save-button">저장</button>
                <button @click="cancelEdit" class="cancel-button">취소</button>
              </div>
              <div v-else>
                {{ comment.memberTripPostDto.nickname }} : {{ parseContent(comment.content) }}
                <div v-if="comment.memberTripPostDto.id === user.memberId" class="comment-buttons">
                  <button @click="startEditComment(comment)" class="edit-button">수정</button>
                  <button @click="deleteComment(comment.id)" class="delete-button">삭제</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
    <div class="trip-plans">
      <h2>여행 계획 목록</h2>
      <ul>
        <li v-for="plan in tripPlans" :key="plan.tripId">
          <label>
            <input type="radio" :value="plan.tripId" v-model="selectedTripPlanId" />
            {{ plan.tripName }} - 참여인원: {{ plan.totalTripMember }}명
            <p class="dates">
              {{ formatDate(plan.startDate) }} - {{ formatDate(plan.endDate) }}
            </p>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useJwt } from '@vueuse/integrations/useJwt';
import axios from '@/commons/axios';

const route = useRoute();
const post = ref({});
const liked = ref(false);
const comments = ref([]);
const newComment = ref('');
const editCommentId = ref(null);
const editCommentContent = ref('');
const tripPlanId = ref('');
const tripPlanName = ref('');
const tripPlanList = ref('');

import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const user = userStore.$state;

onMounted(async () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('Authorization token not found');
    return;
  }

  try {
    const { header, payload } = useJwt(authToken);
    const actualPayload = payload.value;
    userStore.setUser(actualPayload.memberId, actualPayload.profileImageUrl, actualPayload.nickName);
  } catch (error) {
    console.error('Error decoding JWT:', error);
  }

  try {
    const postId = route.params.tripPostId;
    const response = await axios.get(`http://localhost:8080/tripPosts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    console.log(response.data)

    post.value = response.data;
    liked.value = post.value.like;
    comments.value = post.value.commentDtos || [];
  } catch (error) {
    console.error('게시글 상세 정보 조회 중 오류가 발생했습니다:', error);
  }
});

const toggleLike = async () => {
  if (liked.value) {
    try {
      await axios.delete(`http://localhost:8080/tripPosts/${post.value.id}/likes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      liked.value = false;
    } catch (error) {
      console.error('좋아요 취소 중 오류가 발생했습니다:', error);
    }
  } else {
    try {
      await axios.post(`http://localhost:8080/tripPosts/${post.value.id}/likes`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      liked.value = true;
    } catch (error) {
      console.error('좋아요 설정 중 오류가 발생했습니다:', error);
    }
  }
};

const submitComment = async () => {
  if (newComment.value.trim()) {
    try {
      const response = await axios.post(`http://localhost:8080/tripPosts/${post.value.id}/comments`, {
        content: newComment.value
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const savedComment = response.data;
      comments.value.push(savedComment);
      newComment.value = '';
    } catch (error) {
      console.error('댓글 저장 중 오류가 발생했습니다:', error);
    }
  }
};

const deleteComment = async (commentId) => {
  try {
    await axios.delete(`http://localhost:8080/tripPosts/${post.value.id}/comments/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    comments.value = comments.value.filter(comment => comment.id !== commentId);
  } catch (error) {
    console.error('댓글 삭제 중 오류가 발생했습니다:', error);
  }
};

const startEditComment = (comment) => {
  editCommentId.value = comment.id;
  editCommentContent.value = parseContent(comment.content);
};

const cancelEdit = () => {
  editCommentId.value = null;
  editCommentContent.value = '';
};

const updateComment = async (commentId) => {
  try {
    const response = await axios.put(`http://localhost:8080/tripPosts/${post.value.id}/comments/${commentId}`, {
      id: commentId,
      memberTripPostDto: {
        id: user.memberId,
        nickname: user.nickName
      },
      content: editCommentContent.value
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const updatedComment = response.data;
    const index = comments.value.findIndex(comment => comment.id === commentId);
    if (index !== -1) {
      comments.value[index] = updatedComment;
    }
    cancelEdit();
  } catch (error) {
    console.error('댓글 수정 중 오류가 발생했습니다:', error);
  }
};

function parseContent(content) {
  try {
    const parsed = JSON.parse(content);
    return parsed.content;
  } catch (e) {
    return content;
  }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-buttons {
  display: flex;
  gap: 10px;
}

.edit-button, .delete-button, .save-button, .cancel-button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.delete-button {
  background-color: red;
}

.save-button {
  background-color: #2ecc71;
}

.cancel-button {
  background-color: #e74c3c;
}

.comment-input-edit {
  flex-grow: 1;
  padding: 8px;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin-right: 10px;
}
</style>
