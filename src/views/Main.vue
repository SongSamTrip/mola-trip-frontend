<template>

  <form class="login-form" style="margin-top: 100px">
    <p class="login-text">

    <span class="fa-stack fa-lg">
        <i class="fa fa-circle fa-stack-2x"></i>
        <i class="fa fa-lock fa-stack-1x"></i>
    </span>
    </p>

    <input type="email" class="login-username" autofocus="true" required="true" placeholder="Email" />
    <input type="password" class="login-password" required="true" placeholder="Password" />
    <div class="button-container">
      <input type="submit" name="Login" value="Login" class="login-submit" />
      <input type="submit" name="SignUp" value="SignUp" class="login-submit" />
    </div>
    <div class="button-container" :style="{ opacity: 0.9, width: formWidth + 'px', height: '50px'  }">

      <!-- Kakao Login Button -->
      <a href="http://localhost:8080/api/auth/oauth2/kakao" class="login-link">
        <img class="sns-login" src="@/assets/kakao_small_light.png" alt="Login with Kakao" style="opacity: 1;">
      </a>
      <!-- Naver Login Button -->
      <a href="http://localhost:8080/api/auth/oauth2/google" class="login-link">
        <img class="sns-login" src="@/assets/google_small.webp" alt="Login with Naver" style="opacity: 1;">
      </a>


      <!-- Naver Login Button -->
      <a href="http://localhost:8080/api/auth/oauth2/naver" class="login-link">
        <img class="sns-login" src="@/assets/naver_small.png" alt="Login with Naver" style="opacity: 1;">
      </a>

<!--      http://localhost:8080/api/auth/oauth2/kakao-->
    </div>
  </form>

  <a href="#" class="login-forgot-pass">forgot password?</a>
  <div class="underlay-photo"></div>
  <div class="underlay-black"></div>
</template>
<script setup>

</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:100,300,400,700");
@import url("https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css");
.login-link {
  display: inline-block;
  cursor: pointer;
  border: none;
  background: none;
  padding: 10px;
}

.sns-login {
  max-width: 100px; /* Adjust based on your design requirements */
  opacity: 1; /* Ensure the images are fully opaque */
  transition: opacity 0.3s ease;
}

.sns-login:hover {
  opacity: 0.8; /* Slight opacity change on hover for visual feedback */
}
.button-container {
  display: flex;
  justify-content: space-evenly;
}

.logo {
  width: 100px; /* 원하는 너비 */
  height: 100px; /* 원하는 높이 */
}


body, html {
  height: 100%;
}

body {
  font-family: 'Open Sans', sans-serif;
  font-weight: 100;
  display: flex;
  overflow: hidden;
}

input::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.7);
}

input::-moz-placeholder {
  color: rgba(255, 255, 255, 0.7);
}

input:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.7);
}

input:focus {
  outline: 0 transparent solid;
}

input:focus::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.7);
}

input:focus::-moz-placeholder {
  color: rgba(0, 0, 0, 0.7);
}

input:focus:-ms-input-placeholder {
  color: rgba(0, 0, 0, 0.7);
}

.login-form {
  min-height: 10rem;
  margin: auto;
  max-width: 50%;
  padding: .5rem;
}

.login-text {
  color: white;
  font-size: 1.5rem;
  margin: 0 auto;
  max-width: 50%;
  padding: .5rem;
  text-align: center;
}

.login-text .fa-stack-1x {
  color: black;
}

.login-username, .login-password {
  background: transparent;
  border: 0 solid;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  display: block;
  margin: 1rem;
  padding: .5rem;
  transition: 250ms background ease-in;
  width: calc(100% - 3rem);
}

.login-username:focus, .login-password:focus {
  background: white;
  color: black;
  transition: 250ms background ease-in;
}

.login-forgot-pass {
  bottom: 0;
  color: white;
  cursor: pointer;
  display: block;
  font-size: 75%;
  left: 0;
  opacity: 0.6;
  padding: .5rem;
  position: absolute;
  text-align: center;
  width: 100%;
}

.login-forgot-pass:hover {
  opacity: 1;
}

.login-submit {
  border: 1px solid white;
  background: transparent;
  color: white;
  display: block;
  margin: 1rem auto;
  min-width: 1px;
  padding: .25rem;
  transition: 250ms background ease-in;
}

.sns-login {
  background: transparent;
  color: white;
  display: block;
  margin: 10px;
  transition: 250ms background ease-in;

}

.login-submit:hover, .login-submit:focus {
  background: white;
  color: black;
  transition: 250ms background ease-in;
}

[class*="underlay"] {
  left: 0;
  min-height: 100%;
  min-width: 100%;
  position: fixed;
  top: 0;
}

.underlay-photo {
  animation: hue-rotate 6s infinite;
  background: url('https://cdn.pixabay.com/photo/2016/12/21/07/43/korea-1922376_1280.jpg') no-repeat center center;
  background-size: cover;
  filter: grayscale(30%);
  z-index: -1;
}

.underlay-black {
  background: rgba(0, 0, 0, 0.7);
  z-index: -1;
}

@keyframes hue-rotate {
  from {
    filter: grayscale(30%) hue-rotate(0deg);
  }
  to {
    filter: grayscale(30%) hue-rotate(360deg);
  }
}

</style>