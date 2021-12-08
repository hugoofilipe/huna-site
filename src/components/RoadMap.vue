<template>
  <div class="bg-greenCustom roadmap">

    <div class="row justify-center">
      <h2 class="col-11 col-sm-10  col-md-8 text-center text-weight-medium text-white" >{{$t('roadmapTitle1')}}</h2>
    </div>

     <q-parallax
        src="images/bg-section1.png"
        :height="800"
        :speed="1"
        class="templates"
      >
      <div class="row justify-around section">
        <div class="col-10 col-md-3">
          <q-img style="width:87px" src='icons/computer.png' />
          <h2 class="text-weight-medium text-white">{{$t('roadmapTitle2')}}</h2>
          <p class="text-white">{{$t('roadmapText2')}}</p>
          <!-- <p class="text-white"> {{$t('readMore')}}</p> -->
        </div>
        <div class="col-4 gt-sm"></div>
      </div>
     </q-parallax>

    <q-space class="q-ma-xl mobile-hide"/>

    <q-parallax
      src="images/bg-section2.png"
      :height="800"
      :speed="1"
      class="templates sectionTwo"
    >
      <div class="row justify-around section text-right" style="">
        <div class="col-10 col-md-3">
          <q-img style="width:87px" src='icons/store.png' />
          <h2 class="text-weight-medium text-white">{{$t('roadmapTitle3')}}</h2>
          <p class="text-white">{{$t('roadmapText3')}}</p>
          <!-- <p class="text-white">{{$t('readMore')}}</p> -->
        </div>
      </div>
    </q-parallax>

    <q-space/>

    <div class="row justify-center section">
      <div class="col-8 text-center">
        <h2 class="text-weight-medium text-white" style="margin-bottom:30px">{{$t('roadmapTitle4')}}</h2>
      </div>
    </div>

    <q-space/>

    <div class="row justify-around section">
      <div class="col-10 col-md-6">
        <q-img src='images/relaxe.png' />
      </div>
      <div class="col-10 col-md-3">
        <q-img style="width:87px" src='icons/world.png' />
        <h2 class="text-weight-medium text-white">{{$t('roadmapTitle5')}}</h2>
        <p class="text-white">{{$t('roadmapText5')}}</p>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
  .roadmap
    padding: 100px 0px
    .q-parallax.templates
        img
          filter: opacity(0.5)
          @media (max-width: $breakpoint-sm)
            filter: opacity(0.3)
    .q-parallax.templates.sectionTwo
      img
        @media (max-width: $breakpoint-sm)
          left: 149%
          bottom: -50%
    .section
      padding: 50px 0px
      // @media (max-width: $breakpoint-sm)
      //   padding: 0px 0px
      p
        font-size: 36px
        line-height: 1

</style>

<script>
export default {
  name: 'roadmap',
  data () {
    return {
    }
  }
}
</script>
