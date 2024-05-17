<template>
  <div class="main">
    <div class="container">
      <header class="header">
        <h1 class="logo">게시글 등록</h1>
        <div class="search-profile">
          <input type="text" class="search-bar" placeholder="title" />
        </div>
      </header>
      <main class="main-content">
        <form class="post-form">
          <div class="editor">
            <QuillEditor :modules="modules" 
            toolbar="full" 
            v-model:content="content"
            contentType="html"
            theme="snow"
            style="height: 440px"/>
          </div>

          <button type="submit" @click.prevent="send" class="publish-btn">
            Publish
          </button>
        </form>
        <div class="tags">
          <p>#nature, #hiking, #wildflowers</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent  } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import ImageUploader from 'quill-image-uploader';
import axios from '@/commons/axios';

export default defineComponent ({
  components: {
    QuillEditor,
  },
  setup() {
    const content = ref('');

    const send = () => {
      console.log(content.value);
    };

    const accessToken = localStorage.getItem('authToken');

    const modules = {
        name: 'imageUploader',
        module: ImageUploader,
        options: {
          upload: file => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append("tripPostId", "1");
              formData.append("file", file);

              axios.post('http://localhost:8080/images', formData, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'multipart/form-data'},
              })
              .then(res => {
                console.log(res)
                resolve(res.data.url);
              })
              .catch(err => {
                reject("Upload failed");
                console.error("Error:", err)
              })
            })
          }
        }
      }
    

    return {
      content,
      send,
      modules
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

.post-form {
  display: flex;
  flex-direction: column;
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
  min-height: 500px; /* Ensure the editor has a minimum height */
  height: 500px; /* Set a fixed height */
}

.publish-btn {
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
