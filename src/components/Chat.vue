<template>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" rel="stylesheet">

  <div class="chat">
    <div class="messages">
      <ul class="message-list" ref="messageList">
        <li v-for="(message, index) in chatMessages" :key="index"
            :class="message.memberId === user.memberId ? 'message-item item-primary' : 'message-item item-secondary'">
          {{ message.nickname }} : {{ parseContent(message.content) }}
          <div class="timestamp">{{ formatTimestamp(message.timestamp) }}</div>
        </li>
      </ul>
      <div class="message-input">
        <input type="text" placeholder="메시지를 입력하세요..." v-model="chatStore.chatMessage" @keyup.enter="send"/>
        <button type="button" class="btn btn-primary btn-round-2" @click="send">전송 </button>
      </div>
    </div>
  </div>
</template>

<script setup>


import { ref, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { chatStore } from '@/stores/counter';
import { useUserStore } from '@/stores/userStore';
import { useJwt } from '@vueuse/integrations/useJwt';
import { Client } from '@stomp/stompjs';
import dayjs from 'dayjs';  // Import dayjs

let client = null;
const token = localStorage.getItem('authToken');
const chatMessages = ref([]);

const userStore = useUserStore();
const user = userStore.$state;

const route = useRoute();
const tripId = route.params.tripId; 

onMounted(() => {
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

  connectWebSocket();
});

const scrollToBottom = () => {
  nextTick(() => {
    const messageListElement = document.querySelector('.message-list');
    if (messageListElement) {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    }
  });
};

const send = () => {
  if (client && client.connected) {

    const messageContent = chatStore.chatMessage.trim();

    if (messageContent === '') {
      return;
    }

    client.publish({
      destination: '/pub/chat/'+tripId,
      body: JSON.stringify({ content: chatStore.chatMessage, sender: 'User' }),
      headers: { Authorization: `Bearer ${token}` }
    });
    chatStore.chatMessage = '';
  } else {
    console.error('WebSocket is not connected.');
  }
};

const subscribeToTopic = () => {
  if (client && client.connected) {
    client.subscribe('/sub/chat/'+tripId, (message) => {
      const parseMessage = JSON.parse(message.body);
      const newMessage = JSON.parse(parseMessage.content);
      chatMessages.value.push({
        memberId: parseMessage.memberId,
        nickname: parseMessage.nickname,
        content: newMessage.content,
        timestamp: parseMessage.timestamp
      });
      scrollToBottom();
    }, { Authorization: `Bearer ${token}` });

    fetch('http://localhost:8080/chatMessage/'+tripId, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch previous messages');
      }
    })
    .then(data => {
      chatMessages.value = data.map(msg => ({
        memberId: msg.memberId,
        nickname: msg.nickname,
        content: msg.content,
        timestamp: msg.timestamp
      }));
      scrollToBottom();
    })
    .catch(error => {
      console.error('Error fetching previous messages:', error);
    });
  } else {
    console.error('WebSocket is not connected.');
  }
};

const connectWebSocket = () => {
  client = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      subscribeToTopic();
    }
  });

  client.activate();
};

function parseContent(content) {
  try {
    const parsed = JSON.parse(content);
    return parsed.content;
  } catch (e) {
    return content;
  }
}

// New function to format the timestamp
function formatTimestamp(timestamp) {
  return dayjs(timestamp).format('MM/DD HH:mm');
}
</script>


<style scoped>
.message-list {
  font-family: 'Noto Sans KR', sans-serif;
}

.btn {
  appearance: none;
  -webkit-appearance: none;
  font-family: sans-serif;
  cursor: pointer;
  padding: 12px;
  min-width: 60px;
  border: 0px;
  -webkit-transition: background-color 100ms linear;
  -ms-transition: background-color 100ms linear;
  transition: background-color 100ms linear;
}

.btn:focus, .btn.focus {
  outline: 0;
}

.btn-round-1 {
  border-radius: 8px;
}

.btn-round-2 {
  border-radius: 30px;
}

.btn-primary {
  background: #3498db;
  color: #ffffff;
}

.btn-primary:hover {
  background: #3F72AF;
  color: #ffffff;
}

.btn-success {
  background: #2ecc71;
  color: #ffffff;
}
/* screen configs */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  background-color: rgba(255, 255, 255, 0.8);
  font-family: 'Roboto', sans-serif;
}

ul { list-style: none; }

/* chatbox */
.chat {
  max-width: 400px;
  min-height: 400px;
  background-color: rgba(255, 255, 255, 0.8);
  padding-right: 15px;
  padding-left: 15px;
  margin: 20px auto;
  border-radius: 1rem;
}

/* messages */
.messages {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 500px;
}

.message-list {
  overflow-y: scroll;
  max-height: 500px;
}

.message-item {
  padding: 20px;
  border-radius: 0.75rem;
  margin: 20px 0;
}

.message-item:last-child {
  margin-bottom: 0;
}

.item-primary {
  background-color: #ffffff;
  color: #3c3c3e;
}

.item-secondary {
  background-color: #91d1ee;
  color: #000000;
}

/* messages input */
.message-input {
  display: flex;
  padding: 20px 0;
}

.message-input input {
  width: 100%;
  padding: 10px;
  border-radius: 2rem;
  border: 1px solid #a5a5a5;
}

.message-input button {
  padding: 10px;
  margin-left: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.timestamp {
  display: block;
  text-align: right;
  color: #888;
  font-size: 0.8rem;
  margin-top: 5px;
}
</style>
