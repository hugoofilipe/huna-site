<template>
  <ShareNetwork
      network="whatsapp"
      :url="'www.huna.pt/cam#' + anchor"
      :title="'Câmara da praia ' + title"
      description="Atenção: Apenas deverás partilhar esta página com surfistas e pseudo-surfistas, que saibam partilhar ondas e momentos especiais. Não te esqueças, a amizade é o mais importante de tudo."
      name="Whatsapp"
      color="white"
      style="text-decoration: none;"
    >
    <q-btn v-if="position === 'top'" push round color="white" size="xl" icon="whatsapp"/>
    <q-btn v-else-if="position === 'bottom'" align="around" text-color="black" class=" btn-fixed-width" label="whatsapp" icon="whatsapp">
    </q-btn>
  </ShareNetwork>
</template>

<script>
import ShareNetwork from 'vue-social-sharing'
import Vue from 'vue'
Vue.use(ShareNetwork)

export default {
  name: 'socialSharing',
  props: {
    anchor: [String],
    title: [String],
    position: [String]
  }
}
</script>
