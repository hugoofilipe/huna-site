<template>
  <div class="TheLogin">

    <div class="main" >
    <h1>Bem vindo!</h1>
    <input
      type="text"
      name="username"
      id="username"
      placeholder="O teu nome"
      filled
      v-model="username"
    />
    <br />
    <input
      type="password"
      name="password"
      id="password"
      :rules="[val => !!val || 'Field is required']"
      placeholder="Password"
      v-model="pwd"
      filled
    />
    <br />
    <q-toggle v-model="accept" label="I accept the license and terms" />

    <br />
    <input
      type="button"
      value="Entrar"
      class="button"
      id="done"
      @click="logIn"
    />
    <br />
    <!-- <img src="../assets/google.svg" alt="Login using Google" />
    <img src="../assets/facebook.svg" alt="Login using Facebook" /> -->
  </div>
  </div>

</template>

<script>
export default {
  name: 'TheLogin',
  data () {
    const accept = false
    const username = null
    const pwd = null
    return {
      accept,
      username,
      pwd
    }
  },
  methods: {
    logIn () {
      if (this.pwd === 'caparica' && this.accept === true && this.username && this.username.length > 3) {
        this.$emit('Login::loginResult', { loginResult: true })
        this.$cookies.set('pwd', { code: this.pwd, token: 'v1' })
      } else {
        this.$cookies.remove('pwd')
        this.$emit('Login::loginResult', { loginResult: false })
      }
    }
  }
}
</script>

<style>
.main {
  background: rgba(255, 255, 255, 0.4);
  position: absolute;
  top: 20%;
  left: 30%;
  width: 40%;
  text-align: center;
  padding: 5px;
  border-radius: 3rem;
  box-shadow: 0px 0px 8px -5px #000000;
  padding-top: 3%;
  padding-bottom: 5%;
  font-family: "Poppins", sans-serif;
}
h1 {
  cursor: default;
  user-select: none;
}
input {
  border-radius: 3rem;
  border: none;
  padding: 10px;
  text-align: center;
  outline: none;
  margin: 10px;
  width: 30%;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
}
input:hover {
  box-shadow: 0px 0px 8px -5px #000000;
}
input:active {
  box-shadow: 0px 0px 8px -5px #000000;
}
#done {
  background: lightgreen;
}
.button {
  cursor: pointer;
  user-select: none;
}
img {
  height: 2.2rem;
  margin: 10px;
  user-select: none;
}
img:hover {
  box-shadow: 0px 0px 8px -5px #000000;
  cursor: pointer;
  border-radius: 200rem;
}
</style>
