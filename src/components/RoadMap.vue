<template>
  <div class="bg-greenCustom roadmap">

    <div class="row justify-center">
      <h1 class="col-8 text-center text-weight-medium text-white" >{{$t('roadmapTitle1')}}</h1>
    </div>

     <q-parallax
        src="images/bg-section1.png"
        :height="1000"
        :speed="1"
      >
      <div class="row justify-around section">
        <div class="col-3">
          <q-img style="width:87px" src='icons/computer.png' />
          <h2 class="text-weight-medium text-white">{{$t('roadmapTitle2')}}</h2>
          <p class="text-white">{{$t('roadmapText2')}}</p>
          <p class="text-white"> {{$t('readMore')}}</p>
        </div>
        <div class="col-4"></div>
      </div>
     </q-parallax>

    <q-space/>

    <q-parallax
      src="images/bg-section2.png"
      :height="1000"
      :speed="1"
    >
      <div class="row justify-around section" style="">
        <div class="col-3">
          <q-img style="width:87px" src='icons/store.png' />
          <h2 class="text-weight-medium text-white">{{$t('roadmapTitle3')}}</h2>
          <p class="text-white">{{$t('roadmapText3')}}</p>
          <p class="text-white">{{$t('readMore')}}</p>
        </div>
      </div>
    </q-parallax>

    <q-space/>

    <div class="row justify-center section">
      <div class="col-3 text-center">
        <h2 class="text-weight-medium text-white" style="margin-bottom:30px">{{$t('roadmapTitle4')}}</h2>
        <hr class="hr">
      </div>
    </div>

    <q-space/>

    <div class="row justify-around section">
      <div class="col-6">
        <q-img src='images/relaxe.png' />
      </div>
      <div class="col-3">
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
    .section
      padding: 50px 0px
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
