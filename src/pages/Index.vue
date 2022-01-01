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
    <footer-main />
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
import footerMain from 'src/components/Footer.vue'

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
    testimonials,
    footerMain
  },
  // setup () {
  //   console.log('IsServer:', process.env.SERVER)
  //   return {
  //     meta () {
  //       return {
  //         title: 'Test Index',
  //         meta: {
  //           description: { name: 'description', content: 'Page 1' },
  //           keywords: { name: 'keywords', content: 'Quasar website' }
  //         }
  //       }
  //     }
  //   }
  //   // Meta(metaData)
  // }
  // setup () {
  //   Meta(() => {
  //     return {
  //       title: 'Test Index',
  //       meta: {
  //         description: { name: 'description', content: 'Page 1' },
  //         keywords: { name: 'keywords', content: 'Quasar website' }
  //       }
  //     }
  //   })
  // },
  meta () {
    return {
      title: 'Test Index',
      meta: {
        description: { name: 'description', content: 'Page 1' },
        keywords: { name: 'keywords', content: 'websites loja online portal plataformas aplicações Marketing digital UX UI Visual Design Criação de Conteudo Redes sociais Branding' }
      }
    }
  }
}
</script>
