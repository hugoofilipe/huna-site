<template>
  <div class="bg-banner banner">

    <div class="column justify-center ">
        <h2 class="col text-center text-weight-medium text-white" style="margin:13px">{{$t('bannerTitle1')}}</h2>
        <hr class="col banner-hr">
    </div>

    <div class="q-pa-lg row justify-center section">
        <div class="col-4 ">
            <img style="width:65%" src="images/huna.svg">
        </div>
        <div class="col-3 column justify-between ">
            <p class="text-white"> {{$t('bannerText1')}}</p>
            <div class="q-pa-md q-gutter-sm self-end">
                <q-btn no-caps class="btn-greenCustom flat push dense text-weight-bold" padding="15px 30px" text-color="white" :label="$t('letsTalk')" />
            </div>
        </div>
    </div>

  </div>
</template>

<style lang="sass">
    .banner
        padding: 100px 0px
        .section
            padding: 100px 0px
            p
                font-size: 36px
                line-height: 46px
    .bg-banner
        background: rgb(0,0,0)
        background: linear-gradient(90deg, rgba(0,0,0,1) 50%, rgba(252,163,17,1) 50%)
</style>

<script>
export default {
  name: 'banner',
  data () {
    return {
    }
  }
}
</script>
