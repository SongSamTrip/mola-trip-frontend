<template>
  <div class="mt-4">
      <h2>새 글 작성</h2>
      <form @submit.prevent="addPost">
        <div class="mb-3">
          <label for="title" class="form-label">제목</label>
          <input type="text" class="form-control" id="title" v-model="newPost.title" required>
        </div>
        <div class="mb-3">
          <label for="author" class="form-label">작성자</label>
          <input type="text" class="form-control" id="author" v-model="newPost.author" required>
        </div>
        <div class="mb-3">
          <label for="content" class="form-label">내용</label>
          <textarea class="form-control" id="content" rows="3" v-model="newPost.content"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">글 작성</button>
      </form>
    </div>
</template>

<script setup>
  import {ref} from 'vue'
const newPost = ref({
  title: '',
  author: '',
  content: ''
});

  const addPost = () => {
    console.log('post');
  }


</script>