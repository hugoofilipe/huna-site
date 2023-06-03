<template>
  <q-page >
    <carousel id="welcome"/>
    <roadmap style="margin-top: -25px;" id="how"/>
    <banner />
    <fields-of-business id="services"/>
    <service-banner />
    <prices-table id="prices"/>
    <testimonials />
    <contact-form id="contacto"/>
  </q-page>
</template>

<script>

import Carousel from 'src/components/Carousel.vue'
import roadmap from 'src/components/RoadMap.vue'
import banner from 'src/components/Banner.vue'
import fieldsOfBusiness from 'src/components/FieldsOfBusiness.vue'
import serviceBanner from 'src/components/ServiceBanner.vue'
import pricesTable from 'src/components/PricesTable.vue'
import contactForm from 'src/components/ContactForm.vue'
import testimonials from 'src/components/Testimonials.vue'

// import { Meta } from 'quasar'

// const metaData = {
//   title: 'Test Index Page 4',
//   meta: {
//     description: { name: 'description', content: 'Page 4' },
//     keywords: { name: 'keywords', content: 'Quasar website 4' }
//   }
// }
// console.log('IsServer:', process.env.SERVER)
// Meta(metaData) // does not work

// const metaData = {
//   // sets document title
//   title: 'Index Page 3',
//   // optional; sets final title as "Index Page - My Website", useful for multiple level meta
//   titleTemplate: title => `${title} - My Website`,

//   // meta tags
//   meta: {
//     description: { name: 'description', content: 'Page 3' },
//     keywords: { name: 'keywords', content: 'Quasar website 3' }
//   }
// }

export default {
  name: 'PageIndex',
  components: {
    Carousel,
    roadmap,
    banner,
    fieldsOfBusiness,
    serviceBanner,
    pricesTable,
    contactForm,
    testimonials
  },
  metaInfo: {
    title: 'Huna Digital',
    titleTemplate: '%s | Produção de produtos digitais',
    meta: [
      { charset: 'utf-8' },
      { name: 'description', content: ' Apoio técnico, todos os dias, de unidade tecnologica com experiência digital capaz de criar e desenvolver por si e pela sua empresa.' },
      { name: 'author', content: 'Hugo Filipe Duarte' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'keywords', content: 'websites loja online portal plataformas aplicações Marketing digital UX UI Visual Design Criação de Conteudo Redes sociais Branding' },
      { name: 'news_keywords', content: 'websites loja online portal plataformas aplicações Marketing digital UX UI Visual Design Criação de Conteudo Redes sociais Branding' },
      { name: 'og:email', content: 'geral@huna.pt' },
      { name: 'og:phone_number', content: '913314803' },
      { name: 'og:url', content: 'https://huna.pt' },
      { name: 'og:title', content: 'Huna Digital' },
      { name: 'og:image', content: 'https://huna.pt/images/huna.svg' },
      { name: 'og:type', content: 'digital.services' }
    ]
  }
}
</script>
