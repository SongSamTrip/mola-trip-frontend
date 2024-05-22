<template>
  <div class="main">
    <div class="container">
      <header class="header">
        <h1 class="logo">게시글 등록</h1>
        <select v-model="tripPostStatus" class="post-status-select">
          <!-- DRAFT 상태는 사용자가 선택할 수 없도록 제거 -->
          <option value="PUBLIC">공개</option>
          <option value="PRIVATE">비공개</option>
        </select>
        <div class="search-profile">
          <input type="text" class="search-bar" placeholder="title" v-model="title" />
        </div>
      </header>
      <main class="main-content">
        <div class="content-wrapper">
          <form class="post-form" @submit.prevent="send">
            <div class="editor">
              <QuillEditor :modules="modules" 
                toolbar="full" 
                v-model:content="content"
                contentType="html"
                theme="snow"
                style="height: 440px"/>
            </div>
            <button type="submit" class="publish-btn">등록</button>
          </form>
        </div>
        <div class="tags">
          <p>#nature, #hiking, #wildflowers</p>
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

<script>
import { ref, defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import ImageUploader from 'quill-image-uploader';
import axios from '@/commons/axios';
import dayjs from 'dayjs';

export default defineComponent({
  components: {
    QuillEditor,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const tempPostId = ref(route.query.tempPostId);
    const memberId = ref(route.query.memberId);

    const content = ref('');
    const title = ref('');
    const tripPlans = ref([]);
    const selectedTripPlanId = ref(null);
    const tripPostStatus = ref('PUBLIC'); // 기본 상태를 'PUBLIC'로 설정

    const fetchTripPlans = () => {
      axios.get('http://localhost:8080/api/trip-plan/lists', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      .then(response => {
        tripPlans.value = response.data.map(plan => ({
          ...plan,
          startDate: dayjs(plan.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(plan.endDate).format('YYYY-MM-DD')
        }));
      })
      .catch(error => {
        console.error('Error fetching trip plans:', error);
      });
    };

    const fetchPostDetails = async () => {
      if (!tempPostId.value) return;
      try {
        const response = await axios.get(`http://localhost:8080/tripPosts/${tempPostId.value}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const postData = response.data;
        title.value = postData.name;
        content.value = postData.content;
        selectedTripPlanId.value = postData.tripPlanId;
        tripPostStatus.value = postData.tripPostStatus; // 서버로부터 받은 상태를 설정

        // tripPlans 정보 업데이트 (선택적)
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    onMounted(() => {
      fetchTripPlans();
      if (tempPostId.value) {
        fetchPostDetails();
      }
    });

    const send = () => {
      if (selectedTripPlanId.value == null) {
        alert("어떤 여행인지 선택해야 합니다.");
        return;
      }
      const postData = {
        id: tempPostId.value,
        memberId: memberId.value,
        name: title.value,
        content: content.value,
        tripPlanId: selectedTripPlanId.value,
        tripPostStatus: tripPostStatus.value
      };

      console.log("Sending data:", postData);

      axios.post('http://localhost:8080/tripPosts', postData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      .then(response => {
        console.log('게시글이 성공적으로 저장되었습니다:', response.data);
        const tripPostId = response.data;
        router.push({ name: 'boardDetails', params: { tripPostId } });
      })
      .catch(error => {
        console.error('게시글 저장 중 오류가 발생했습니다:', error);
      });
    };

    const modules = {
      name: 'imageUploader',
      module: ImageUploader,
      options: {
        upload: file => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("tripPostId", tempPostId.value);
            formData.append("file", file);

            axios.post('http://localhost:8080/images', formData, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'multipart/form-data'
              },
            })
            .then(res => {
              console.log(res.data);
              resolve(res.data.url);
            })
            .catch(err => {
              reject("Upload failed");
              console.error("Error:", err);
            })
          })
        }
      }
    };

    const formatDate = date => dayjs(date).format('YYYY-MM-DD');

    return {
      content,
      title,
      send,
      modules,
      tripPlans,
      selectedTripPlanId,
      formatDate,
      tripPostStatus
    };
  },
});
</script>

<style scoped>
.main {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items to the top */
  height: 100vh;
}

.container, .trip-plans {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.container {
  width: 800px;
  margin-right: 20px; /* Add some space between the container and trip plans */
}

.header, .trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.logo, .trip-header h2 {
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
  margin-right: 10px;
  width: 500px;
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.main-content {
  padding-top: 20px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
}

.post-form {
  display: flex;
  flex-direction: column;
  flex: 1; /* Adjust flex value to manage the width */
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.editor {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  background-color: #f7f7f7;
  min-height: 500px;
  height: 500px;
}

.trip-plans {
  width: 200px; /* Fixed width for trip plans */
  margin-left: 20px; /* Space between form and trip plans */
}

.trip-plans h2 {
  margin-bottom: 10px;
}

.trip-plans ul {
  list-style: none;
  padding: 0;
}

.trip-plans li {
  margin-bottom: 10px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}

.publish-btn, .trip-plan-select-btn {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: flex-end;
}

.tags {
  margin-top: 20px;
}

.tags p {
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 5px;
  display: inline-block;
}
</style>

