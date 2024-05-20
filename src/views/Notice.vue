<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/commons/axios';

const router = useRouter();

const createTemporaryPost = () => {

  console.log(localStorage.getItem('authToken'));

    axios.post('http://localhost:8080/tripPosts/draft', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      .then(response => {
        console.log('게시글이 성공적으로 생성되었습니다:', response.data);
        const tempPostId = response.data.tempPostId;
        const memberId = response.data.memberId;
        router.push({ path: '/tripPosts/boardForm', query: { tempPostId, memberId } });
      })
  };
</script>

<template>
  <div class="board">
    <div class="d-flex justify-content-center">
      <router-link to="/map" class="btn-primary">Go to Map</router-link>
      <router-link to="/tripPosts/boardList" class="btn-primary">Go to boardList</router-link>
      <button @click="createTemporaryPost" class="btn-primary">Go to boardForm</button>
    </div>
    <router-view></router-view>
  </div>
</template>


<style scoped>
.btn-primary {
    background-color: #007BFF; /* 버튼의 배경색 설정 */
    color: white; /* 글자색은 흰색으로 설정 */
    padding: 10px 20px; /* 상하, 좌우 패딩 설정 */
    font-size: 16px; /* 글자 크기 설정 */
    border: none; /* 테두리 없앰 */
    border-radius: 20px; /* 버튼의 모서리를 둥글게 설정 */
    cursor: pointer; /* 마우스 오버 시 커서를 손가락 모양으로 변경 */
    text-decoration: none; /* 텍스트 밑줄 제거 */
    display: inline-block; /* 인라인 블록 요소로 설정 */
    margin: 0 10px; /* 좌우 마진으로 버튼 사이 간격 조정 */
    transition: background-color 0.3s; /* 배경색 변경시 애니메이션 효과 */
}

.btn-primary:hover {
    background-color: #0056b3; /* 호버 시 배경색 변경 */
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 이미지가 맨 위에 오도록 설정 */
  text-align: center;
}

.centered-image {
  width: 400px;
  height: 400px;
  margin-top: 20px; /* 상단 여백 조절 */
}

.board {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
