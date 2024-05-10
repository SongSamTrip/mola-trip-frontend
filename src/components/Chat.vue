<template>
  <div class="chat">
    <div class="messages">
      <ul class="message-list" ref="messageList">
        <li class="message-item item-primary" v-for="(message, index) in chatMessages" :key="index">
          {{ message.memberId }} : {{ message.content }}
        </li>
      </ul>
      <div class="message-input">
        <input type="text" placeholder="Type your message..." v-model="chatStore.chatMessage"/>
        <button type="button" class="btn" @click="send">Send</button>
        <button type="button" class="btn" @click="subscribeToTopic">Subscribe</button>
        <button type="button" class="btn" @click="connectWebSocket">Connect WebSocket</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { chatStore } from '@/stores/counter';
import { Client } from '@stomp/stompjs';

let client = null;
const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNb2xhVHJpcCIsInN1YiI6IkFjY2Vzc1Rva2VuIiwiZXhwIjoxNzE1MzYwMzU2LCJtZW1iZXJJZCI6MX0.DRzH5S2PJNGZVsZl3dAtPd6UU_6A3k13kFrLiElVLalYJgSiP9L-HX70RoeCRuCJ05-LDoeRyUq8dtseU5CaDg";
const chatMessages = ref([]);

// 메시지 리스트의 끝으로 스크롤 이동
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
    client.publish({
      destination: '/pub/chat/1',
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
    client.subscribe('/sub/chat/1', (message) => {
      // JSON 문자열을 파싱하여 메시지 객체로 변환
      const parseMessage = JSON.parse(message.body);
      const newMessage = JSON.parse(parseMessage.content);
      // 채팅 메시지 객체에 content만 저장하도록 변경
      chatMessages.value.push({
        memberId: parseMessage.memberId,
        content: newMessage.content, // content 값만 사용
        // sender: newMessage.sender // sender 정보도 유지
      });
      scrollToBottom();
    }, { Authorization: `Bearer ${token}` });

    // 구독이 설정되자마자 단 한 번만 이전 채팅 내역을 가져오는 GET 요청을 보냅니다.
    fetch('http://localhost:8080/chatMessage/1', {
      method: 'GET', // HTTP 메소드 지정
      headers: {
        'Authorization': `Bearer ${token}`, // 토큰을 요청 헤더에 포함
        'Content-Type': 'application/json' // 요청의 Content-Type 지정
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
      // data 배열의 각 항목에서 content만 추출하여 새 배열 생성
      chatMessages.value = data.map(msg => ({
        content: msg.content,
        sender: msg.sender
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
    heartbeatOutgoing: 4000
  });

  client.activate();
};
</script>

<style scoped>
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
  background-color: #f6f7f8;
  color: #3c3c3e;
}

.item-secondary {
  background-color: #5ccad7;
  color: #fff;
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
</style>
