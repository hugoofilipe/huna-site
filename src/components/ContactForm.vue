<template>
    <div class="bg-greenCustom q-pa-lg row justify-center section">
        <div class="col-11 col-md-5 text-center q-ma-md q-pa-md">
          <div class="row">
            <h4 class="text-weight-medium text-white" >Envie uma mensagem</h4>
          </div>
          <form @submit.prevent="submit">
            <div class="row justify-between q-my-sm">
              <q-input standout="bg-gray text-white" clearable label-color="grey-6" v-model="name" bg-color="grey-3" label="Nome" class="col-6"/>
              <q-input type="tel" mask="### ### ###" fill-mask="#" standout="bg-gray text-white" label-color="grey-6" v-model="tel" bg-color="grey-3" label="Telefone" class="q-ml-sm col-5"/>
            </div>
            <div class="row justify-around full-width text-white" >
              <q-input type="email" standout="bg-gray text-white" clearable label-color="grey-6" v-model="mail" label="Email" bg-color="grey-3" class="q-ma-sm full-width text-white"/>
            </div>
            <div class="row justify-around full-width" >
              <q-input standout="bg-gray text-white" clearable autogrow label-color="grey-6" v-model="service" label="Que serviço procura?" bg-color="grey-3" class="q-ma-sm full-width text-white"/>
            </div>
            <div class="row justify-around full-width" >
              <q-input standout="bg-gray text-white" clearable autogrow label-color="grey-6" v-model="field" label="Qual o sector em que trabalha?" bg-color="grey-3" class="q-ma-sm full-width text-white"/>
            </div>
            <div class="row justify-around full-width" >
              <q-input type="textarea" standout="bg-gray text-white" clearable  label-color="grey-6" v-model="text" label="Deixe-nos aqui uma mensagem..." bg-color="grey-3" class="q-ma-sm full-width text-white"/>
            </div>
            <div class="row justify-around" >
              <q-btn type="submit" no-caps class="btn-goldenCustom flat push dense text-h5 text-weight-bold" padding="8px 100px" text-color="black" label="Enviar" />
            </div>
          </form>
        </div>
        <div class="bg-gray col-10 col-md-4 column q-ma-md q-pa-md">
            <div class="row justify-center">
              <h4 class=" text-center text-weight-medium" >Pedido de informações</h4>
            </div>
            <div class="row q-gutter-sm text-center justify-around" style="width:100%">
              <div class="col-3">
                <q-btn type="a" no-caps class="btn-goldenCustom flat push dense text-h5 text-weight-bold q-px-sm" text-color="black" label="Telefone" href="tel:913314803"/>
              </div>
              <div class="col-3">
                <q-btn type="a" no-caps class="btn-goldenCustom flat push dense text-h5 text-weight-bold q-px-sm"  text-color="black" label="Whatsapp" href="https://wa.me/913314803"/>
              </div>
              <div class="col-3">
                <q-btn type="a" no-caps class="btn-goldenCustom flat push dense text-h5 text-weight-bold q-px-sm"  text-color="black" label="Messenger" href="https://www.messenger.com/t/huna.pt" target="_blank" />
              </div>
            </div>
            <div class="col-12 col-md-4" >
                <h4>Contactos</h4>
                <div class="text-h6">
                    <p>
                        <q-icon name="img:icons/envelope.svg" />
                        geral@huna.pt
                    </p>
                    <p>
                        <q-icon name="img:icons/phone.svg" />
                        913314803
                    </p>
                    <p>
                        <q-icon name="img:icons/clock.svg" />
                        Seg-Dom: 9:00 às 20:00
                    </p>
                    <p>
                        <q-icon name="img:icons/globe.svg" />
                        Lisboa, Portugal
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass">
  .bg-gray
    background: #eeeeee
</style>

<script>
import axios from 'axios'

export default {
  name: 'contactForm',
  data () {
    return {
      name: null,
      tel: null,
      mail: null,
      service: null,
      field: null,
      text: null
    }
  },
  methods: {
    submit () {
      console.log('Sending email...')
      const mail = {
        to: 'geral@huna.pt',
        subject: 'Contact form from website HUNA',
        name: this.name,
        tel: this.tel,
        mail: this.mail,
        service: this.service,
        field: this.field,
        text: this.text
      }
      // Simple POST request with a JSON body using axios
      axios.post('https://huna.pt/api/text-mail', mail)
    }
  }
}
</script>
