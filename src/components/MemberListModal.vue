<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>회원 목록</h2>
      <ul>
        <li v-for="member in members" :key="member.id">
          <div>
            {{ member.nickname }}
            <button class="delete-button" @click="deleteMember(member.id)">&times;</button>

          </div>
          <div>
            ({{ member.memberRole }})

          </div>

          <hr>
        </li>

      </ul>
      <button @click="prevPage">이전 페이지</button>
      <button @click="nextPage">다음 페이지</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  props: {
    isVisible: Boolean,
    isAdmin: Boolean
  },
  data() {
    return {
      members: []  // 초기 회원 목록은 비어 있습니다.
    };
  },
  methods: {
    closeModal() {
      this.$emit('update:isVisible', false);  // 모달의 가시성을 변경하기 위해 이벤트를 발생시킵니다.
    },
    deleteMember(id) {
      const token = localStorage.getItem('authToken');  // 로컬 스토리지에서 토큰을 가져옵니다.
      if (confirm('정말로 회원을 삭제하시겠습니까?')) {  // 사용자에게 삭제 의사를 확인받습니다.
        axios.delete(`http://localhost:8080/api/members/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`  // 요청 헤더에 인증 토큰을 추가합니다.
          }
        })
            .then(() => {
              this.members = this.members.filter(member => member.id !== id);  // 삭제 성공 시, 로컬 목록에서 해당 회원을 제거합니다.
              alert('회원이 삭제되었습니다.');
            })
            .catch(error => {
              console.error('회원 삭제 실패:', error);  // 오류가 발생하면 콘솔에 로그를 기록합니다.
              alert('회원 삭제에 실패했습니다.');
            });
      }
    },
    fetchMembers() {
      const token = localStorage.getItem('authToken');  // 로컬 스토리지에서 토큰을 가져옵니다.
      axios.get('http://localhost:8080/api/members/admin', {
        headers: {
          Authorization: `Bearer ${token}`  // 요청 헤더에 인증 토큰을 추가합니다.
        },
        params: {page: 0, size: 10}  // 페이지네이션을 위해 페이지와 크기를 설정합니다.
      })
          .then(response => {
            this.members = response.data.content;  // API로부터 받은 회원 목록을 저장합니다.
          })
          .catch(error => {
            console.error('회원 정보 불러오기 실패:', error);  // 오류가 발생하면 콘솔에 로그를 기록합니다.
          });
    }
  },
  mounted() {
    this.fetchMembers();  // 컴포넌트가 마운트되면 회원 목록을 불러옵니다.
  }
}
</script>



<style scoped>
.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 5px;
  width: 400px;
}

.close, .delete-button {
  color: #aa0000;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover, .delete-button:hover {
  color: black;
}
</style>
