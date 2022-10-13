<template>
  <div class="TheLogin">

    <div class="main bg-gray">
      <h1>Bem vindo!</h1>
      <input type="text" name="username" id="username" placeholder="O teu nome" filled v-model="username" />
      <br />
      <input type="password" name="password" id="password" :rules="[val => !!val || 'Field is required']"
        placeholder="Password" v-model="pwd" filled />
      <br />
      <q-toggle v-model="accept" label="I accept the license and terms" />

      <br />
      <br />
      <q-btn no-caps class="btn-goldenCustom btn-rounded q-my-sm q-px-xl" text-color="white" label="Entrar"
        @click="logIn" />

      <br />
      <br />
      <q-btn type="a" href="https://www.facebook.com/Huna.pt/" unelevated target="_blank" dense>
        <q-icon name="fab fa-facebook" color="#00704A" size="30px" style="color: #00704A" />
      </q-btn>
      <q-btn type="a" href="https://www.instagram.com/huna.pt/" unelevated target="_blank" dense>
        <q-icon name="fab fa-instagram" color="#00704A" size="30px" style="color: #00704A" />
      </q-btn>

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
        console.log('wrong in something')
      }
    }
  }
}
</script>

<style lang="sass">
body
  background: #00704A
.TheLogin
  .main
    background: #eeeeee
    position: absolute
    top: 20%
    left: 20%
    width: 60%
    text-align: center
    padding: 5px
    border-radius: 3rem
    box-shadow: 0px 0px 8px -5px #000000
    padding-top: 3%
    padding-bottom: 5%
    font-family: "Poppins", sans-serif
    @media (max-width: 1080px)
      left: 5%
      width: 90%
      border-radius: none
      box-shadow: none
      .q-btn
        .q-icon
          color: (white !important)

  h1
    cursor: default
    user-select: none

  input
    border-radius: 3rem
    border: none
    padding: 10px
    text-align: center
    outline: none
    margin: 10px
    width: 50%
    box-sizing: border-box
    font-family: "Poppins", sans-serif
    font-weight: 400

  input:hover
    box-shadow: 0px 0px 8px -5px #000000

  input:active
    box-shadow: 0px 0px 8px -5px #000000

  #done
    background: lightgreen

  .button
    cursor: pointer
    user-select: none

  img
    height: 2.2rem
    margin: 10px
    user-select: none

  img:hover
    box-shadow: 0px 0px 8px -5px #000000
    cursor: pointer
    border-radius: 200rem

</style>
