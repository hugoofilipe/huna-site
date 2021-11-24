<template>
  <q-page >
    <carousel />
    <roadmap style="margin-top: -25px;"/>
    <banner />
    <fields-of-business />
    <service-banner />
    <prices-table />
    <contact-form  id="contacto"/>
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
import footerMain from 'src/components/Footer.vue'

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
    footerMain
  }
}
</script>
