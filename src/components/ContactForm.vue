<template>
    <div>olaola Returned Id: {{mailResponse}}
        <form @submit.prevent="submit">
            <input type="text" v-model="name">
            <input type="text" v-model="tel">
            <input type="text" v-model="text">
            <button type="submit">
                Submit From Vue Property
            </button>
        </form>
    </div>

</template>

<style lang="sass">

</style>

<script>
import axios from 'axios'

export default {
  name: 'contactForm',
  data () {
    return {
      name: null,
      tel: null,
      text: null
    }
  },
  methods: {
    submit () {
      console.log('Sending')
      const mail = {
        to: 'geral@huna.pt',
        subject: 'Contact form from website HUNA',
        name: this.name,
        tel: this.tel,
        text: this.text
      }
      // Simple POST request with a JSON body using axios
      axios.post('https://huna.pt/api/text-mail', mail)
    }
  }
}
</script>
