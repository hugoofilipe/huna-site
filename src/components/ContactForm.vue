<template>
    <div>olaola Returned Id: {{mailResponse}}
        <form @submit.prevent="submit">
            <input type="text" v-model="name">
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
      email: null,
      name: null,
      mailResponse: null
    }
  },
  methods: {
    submit () {
      console.log('sending')
      const mail = { to: 'geral@huna.pt' }
      // Simple POST request with a JSON body using axios
      axios.post('https://huna.pt/api/text-mail', mail)
    }
  }
}
</script>
