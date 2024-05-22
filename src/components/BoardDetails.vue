<template>
  <div class="main">
    <div class="container">
      <header class="header">
        <h1 class="logo">게시글 상세</h1>
        <div class="search-profile">
          <p class="search-bar">제목: {{ post.name }}</p>
          <p class="search-bar">글쓴이: {{ post.nickname }}</p>
        </div>
        <div v-if="user.memberId === post.memberId && !isEditing" class="post-controls">
          <button @click="updatePost(post.id, user.memberId)" class="edit-button">수정</button>
          <button @click="confirmDelete()" class="delete-button">삭제</button>
        </div>
      </header>
      <main class="main-content">
        <div v-html="post.content"></div>
<!--        <div class="tags">-->
<!--          <p>#nature, #hiking, #wildflowers</p>-->
<!--        </div>-->
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
                <input type="text" v-model="editCommentContent" class="comment-input-edit"/>
                <button @click="updateComment(comment.id)" class="save-button">저장</button>
                <button @click="cancelEdit()" class="cancel-button">취소</button>
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
          <div class="pagination">
            <button
                v-for="n in totalPages"
                :key="n"
                @click="fetchComments(n)"
                :class="{ 'active-page': currentPage === n }"
                class="page-number"
            >
              {{ n }}
            </button>
          </div>
        </div>
      </main>
    </div>
    <div class="place-list">
        <h2 style="margin-left: 14px; font-size: 30px">{{ tripName }}</h2>

      <div class="container2">
        <div class="row">
          <div class="col-lg-4" v-for="item in mainListItems" :key="item.id">
            <div class="card card-margin">
              <div class="card-header no-border">
                <h5 class="card-title" style=" font-size: 16px">{{ item.name }}</h5>
              </div>
              <div class="card-body pt-0">
                <div class="widget-49">
                  <div class="widget-49-title-wrapper">
                    <div class="widget-49-date-primary">
                    </div>
                    <div class="widget-49-meeting-info">
                      <span class="widget-49-pro-title">{{ item.road_address }}</span>
                      <span class="widget-49-meeting-time">{{ item.address }}</span>
                      <span>{{ item.phone }}</span>
                    </div>
                  </div>
                  <div class="widget-49-meeting-action">
                    <a :href="item.url" target="_blank" class="btn btn-sm btn-flash-border-primary">More Info</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--      <ul>-->
<!--        <li v-for="item in mainListItems" :key="item.id" class="place-item">-->
<!--          <h4>{{ item.name }}</h4>-->
<!--          <p class="address">{{ item.road_address }} - {{ item.address }}</p>-->
<!--          <a :href="item.url" target="_blank" class="more-info">More Info</a>-->
<!--          <p class="phone">Phone: {{ item.phone }}</p>-->
<!--        </li>-->
<!--      </ul>-->
    </div>

  </div>
</template>


<script setup>
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import axios from '@/commons/axios';
import {useUserStore} from '@/stores/userStore';
import {useJwt} from '@vueuse/integrations/useJwt';

const route = useRoute();
const post = ref({});
const liked = ref(false);
const comments = ref([]);
const newComment = ref('');
const editCommentId = ref(null);
const editCommentContent = ref('');
const mainListItems = ref([]);
const tripName = ref('');
const isEditing = ref(false);
const editablePost = ref({});
const router = useRouter();
const userStore = useUserStore();
const user = userStore.$state;
const currentPage = ref(1);
const totalPages = ref(0);

onMounted(async () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('Authorization token not found');
    return;
  }

  try {
    const {payload} = useJwt(authToken);
    userStore.setUser(payload.value.memberId, payload.value.profileImageUrl, payload.value.nickName);

    const postId = route.params.tripPostId;
    const response = await axios.get(`http://localhost:8080/tripPosts/${postId}`, {
      headers: {'Authorization': `Bearer ${authToken}`}
    });

    post.value = response.data;
    liked.value = post.value.like;
    comments.value = post.value.commentDtos.content || [];
    totalPages.value = post.value.commentDtos.totalPages;
    tripName.value = post.value.tripName;
    mainListItems.value = JSON.parse(post.value.mainList).items; // Parse mainList from the post
    post.value.content = addStyleToImages(post.value.content);
  } catch (error) {
    console.error('Error loading post details:', error);
  }
});

function addStyleToImages(htmlContent) {
  // HTML 문자열을 DOM 요소로 변환
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // 모든 <img> 태그 찾기
  const images = doc.querySelectorAll('img');
  images.forEach(img => {
    // 이미지에 스타일 속성 추가
    img.style.maxWidth = '700px';
    img.style.maxHeight = '700px';
  });

  // 변경된 HTML을 문자열로 다시 변환
  return doc.body.innerHTML;
}

const fetchComments = async (page) => {
  currentPage.value = page;
  try {
    // 서버로부터 현재 페이지의 댓글 데이터 가져오기
    const response = await axios.get(`http://localhost:8080/tripPosts/${post.value.id}/comments?page=${page - 1}`, {
      headers: {'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
    });
    comments.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

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
      // 댓글을 서버에 저장
      const response = await axios.post(`http://localhost:8080/tripPosts/${post.value.id}/comments`, {
        content: newComment.value
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const savedComment = response.data;

      // 새 댓글 추가 후 현재 페이지의 댓글 목록을 다시 불러오기
      fetchComments(currentPage.value);

      // 입력 필드 초기화
      newComment.value = '';
    } catch (error) {
      console.error('댓글 저장 중 오류가 발생했습니다:', error);
    }
  }
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

const deleteComment = async (commentId) => {
  try {
    await axios.delete(`http://localhost:8080/tripPosts/${post.value.id}/comments/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    comments.value = comments.value.filter(comment => comment.id !== commentId);
    fetchComments(currentPage.value);
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


function updatePost(tempPostId, memberId) {
  router.push({name: 'boardForm', query: {tempPostId, memberId}});
}

function confirmDelete() {
  if (confirm("게시글을 삭제하시겠습니까?")) {
    deletePost(post.value.id);
  }
}

function deletePost(postId) {
  axios.delete(`http://localhost:8080/tripPosts/${postId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  })
      .then(() => {
        alert("게시글이 삭제되었습니다.");
        router.push({name: 'boardList'});
      })
      .catch(error => {
        console.error("게시글 삭제 중 오류가 발생했습니다:", error);
        alert("게시글 삭제 중 문제가 발생했습니다.");
      });
}

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
.place-list h2 {
  background-color: #84CEEB; /* 진한 파란색 */
  color: white; /* 텍스트 색상을 흰색으로 */
  padding: 10px 20px; /* 상하, 좌우 패딩 */
  border-radius: 10px; /* 모서리 둥글게 */
  margin-left: 14px; /* 왼쪽 여백 */
  margin-right: 14px; /* 오른쪽 여백 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.card-margin {
  margin-bottom: 1rem;
}

.card {
  border: 0;
  box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.1);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.1);
  -moz-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.1);
  -ms-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.1);
}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 350px;
  word-wrap: break-word;
  background-color: #ffffff;
  background-clip: border-box;
  border-radius: 8px;
}

.card .card-header.no-border {
  border: 0;
}
.card .card-header {
  background: none;
  padding: 0 0.9375rem;
  font-weight: 500;

  display: flex;
  align-items: center;
  min-height: 50px;
}
.card-header:first-child {
  border-radius: calc(8px - 1px) calc(8px - 1px) 0 0;
}

.widget-49 .widget-49-title-wrapper {
  display: flex;
  align-items: center;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-primary {
  display: flex;

  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #edf1fc;
  width: 4rem;
  margin-left: 10px;
  height: 4rem;
  border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-primary .widget-49-date-day {
  color: #4e73e5;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-primary .widget-49-date-month {
  color: #4e73e5;
  line-height: 1;
  font-size: 1rem;
  text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #fcfcfd;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-secondary .widget-49-date-day {
  color: #dde1e9;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-secondary .widget-49-date-month {
  color: #dde1e9;
  line-height: 1;
  font-size: 1rem;
  text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-success {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #e8faf8;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-success .widget-49-date-day {
  color: #17d1bd;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-success .widget-49-date-month {
  color: #17d1bd;
  line-height: 1;
  font-size: 1rem;
  text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #ebf7ff;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-info .widget-49-date-day {
  color: #36afff;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-info .widget-49-date-month {
  color: #36afff;
  line-height: 1;
  font-size: 1rem;
  text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: floralwhite;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-warning .widget-49-date-day {
  color: #FFC868;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-warning .widget-49-date-month {
  color: #FFC868;
  line-height: 1;
  font-size: 1rem;
  text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-danger {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #feeeef;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-danger .widget-49-date-day {
  color: #F95062;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-danger .widget-49-date-month {
  color: #F95062;
  line-height: 1;
  font-size: 1rem;
  text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-light {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #fefeff;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-light .widget-49-date-day {
  color: #f7f9fa;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-light .widget-49-date-month {
  color: #f7f9fa;
  line-height: 1;
  font-size: 1rem;
  text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-dark {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #ebedee;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-dark .widget-49-date-day {
  color: #394856;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-dark .widget-49-date-month {
  color: #394856;
  line-height: 1;
  font-size: 1rem;
  text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-base {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #f0fafb;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-base .widget-49-date-day {
  color: #68CBD7;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-base .widget-49-date-month {
  color: #68CBD7;
  line-height: 1;
  font-size: 1rem;
  text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-meeting-info {
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
}

.widget-49 .widget-49-title-wrapper .widget-49-meeting-info .widget-49-pro-title {
  color: #3c4142;
  font-size: 14px;
}

.widget-49 .widget-49-title-wrapper .widget-49-meeting-info .widget-49-meeting-time {
  color: #B1BAC5;
  font-size: 13px;
}

.widget-49 .widget-49-meeting-points {
  font-weight: 400;
  font-size: 13px;
  margin-top: .5rem;
}

.widget-49 .widget-49-meeting-points .widget-49-meeting-item {
  display: list-item;
  color: #727686;
}

.widget-49 .widget-49-meeting-points .widget-49-meeting-item span {
  margin-left: .5rem;
}

.widget-49 .widget-49-meeting-action {
  text-align: right;
}

.widget-49 .widget-49-meeting-action a {
  text-transform: uppercase;
}
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
.container2 {
  width: 350px;
  background-color: white;
  margin-left: 10px;
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
}

.main-content {
  padding-top: 20px;
}

.edit-content {
  width: 100%;
  height: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: Arial, sans-serif;
  font-size: 14px;
}


.place-item {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.place-item h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
}

.place-item p {
  font-size: 14px;
  margin: 2px 0;
}

.place-item a {
  color: #3498db;
  text-decoration: none;
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
  margin-bottom: 10px;
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
  background-color: #e74c3c;
}

.save-button {
  background-color: #2ecc71;
}

.cancel-button {
  background-color: #95a5a6; /* More neutral for cancel action */
}

.comment-input-edit {
  flex-grow: 1;
  padding: 8px;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin-right: 10px;
}

.tags {
  margin-top: 10px;
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 5px;
  display: inline-block;
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

.place-list {
  margin-top: 20px;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.place-item {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.place-item h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
}

.place-item p {
  font-size: 14px;
  margin: 2px 0;
}

.place-item a {
  color: #3498db;
  text-decoration: none;
}
</style>