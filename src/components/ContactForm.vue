<template>
    <div class="bg-greenCustom q-pa-lg row justify-center section">
      <div class="col-11 col-md-5 text-center q-ma-md q-pa-md">
        <div class="row">
          <h4 class="text-weight-medium text-white" >Envie uma mensagem</h4>
        </div>
        <form @submit.prevent="submit"  @click="alert = true">
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
      <div class="bg-gray col-10 col-md-4 q-ma-md q-pa-md">
        <div class="row justify-center">
          <h4 class=" text-center text-weight-medium" >Pedido de informações</h4>
        </div>
        <div class="row q-gutter-sm text-center justify-around" style="width:100%">
          <div class="col-10 col-lg-3 btn-goldenCustom">
            <q-btn type="a" no-caps class="flat push dense text-h5 text-weight-bold q-px-sm" text-color="black" label="Telefone" href="tel:913314803"/>
          </div>
          <div class="col-10 col-lg-3 btn-goldenCustom">
            <q-btn type="a" no-caps class="flat push dense text-h5 text-weight-bold q-px-sm"  text-color="black" label="Whatsapp" href="https://wa.me/913314803"/>
          </div>
          <div class="col-10 col-lg-3 btn-goldenCustom">
            <q-btn type="a" no-caps class="flat push dense text-h5 text-weight-bold q-px-sm"  text-color="black" label="Messenger" href="https://www.messenger.com/t/huna.pt" target="_blank" />
          </div>
        </div>
        <div class="col-12 col-md-7 row q-px-md q-pt-xl justify-center items-center" >
          <div class="text-h6 col-12 col-5">
            <h4>Contactos</h4>
            <p>
                <q-icon class="q-ma-xs" name="img:icons/envelope.svg" />
                geral@huna.pt
            </p>
            <p>
                <q-icon class="q-ma-xs" name="img:icons/phone.svg" />
                913314803
            </p>
            <p>
                <q-icon class="q-ma-xs" name="img:icons/clock.svg" />
                Seg-Dom: 9:00 às 20:00
            </p>
            <p>
                <q-icon class="q-ma-xs" name="img:icons/globe.svg" />
                Lisboa, Portugal
            </p>
            <p class="q-pt-md" style="filter: opacity(0.5)">
              <q-btn type="a" href="https://www.facebook.com/Huna.pt/" target="_blank" dense >
                  <q-icon name="fab fa-facebook" color="#00704A" size="30px" style="color: #00704A"/>
              </q-btn>
              <q-btn type="a" href="https://www.instagram.com/huna.pt/" target="_blank" dense>
                  <q-icon name="fab fa-instagram" color="#00704A" size="30px" style="color: #00704A"/>
              </q-btn>
            </p>
          </div>
          <div class="col-7 mobile-hide" >
            <q-img
              width="100%"
              class="q-ma-md"
              style="filter: opacity(0.5)"
              src="images/huna.svg"
            />
          </div>
        </div>
      </div>
      <q-dialog v-model="alert">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{$t('send')}}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{$t('sendMessage')}}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
</template>

<style lang="sass">
  .bg-gray
    background: #eeeeee
  .section
      padding: 100px 0px
      @media (max-width: $breakpoint-sm-max)
        padding: 0px 0px 100px 0px
      p
        font-size: 19px
  .q-field__label
    font-size: 19px
  .q-btn__wrapper::before
    box-shadow: none
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
      text: null,
      alert: false
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
