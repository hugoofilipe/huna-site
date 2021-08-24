<template>
  <q-page >
    <carousel />
    <roadmap style="margin-top: -25px;"/>
    <banner />
    <fieldsOfBusiness />
    <serviceBanner />
    <footerMain />
  </q-page>
</template>

<script>
import Carousel from 'src/components/Carousel.vue'
import roadmap from 'src/components/RoadMap.vue'
import banner from 'src/components/Banner.vue'
import fieldsOfBusiness from 'src/components/FieldsOfBusiness.vue'
import serviceBanner from 'src/components/ServiceBanner.vue'
import footerMain from 'src/components/Footer.vue'

export default {
  name: 'PageIndex',
  components: {
    Carousel,
    roadmap,
    banner,
    fieldsOfBusiness,
    serviceBanner,
    footerMain
  }
}
</script>
