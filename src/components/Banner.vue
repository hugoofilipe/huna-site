<template>
  <div class="bg-banner banner">
    <div class="column justify-center ">
        <h2 class="col text-center text-weight-medium text-white" style="margin:13px">{{$t('bannerTitle1')}}</h2>
        <hr class="col banner-hr">
    </div>
    <div class="q-pa-lg row justify-center section">
        <div class="col-11 col-md-4 text-center">
            <img style="width:65%" src="images/huna.svg">
        </div>
        <div class="col-10 col-md-3 column items-center">
            <p class="text-white"> {{$t('bannerText1')}}</p>
            <div class="col q-pa-md q-gutter-sm self-end">
                <q-btn
                  o-caps
                  class="btn-greenCustom flat push dense text-weight-bold"
                  padding="15px 30px"
                  text-color="white"
                  :label="$t('letsTalk')"
                  type="a" href="#contacto"
                />
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
          @media (max-width: $breakpoint-sm-max)
            line-height: 33px
            font-size: 28px

.bg-banner
  background: linear-gradient(90deg, rgba(0,0,0,1) 50%, rgba(252,163,17,1) 50%)
  @media (max-width: $breakpoint-sm-max)
    background: linear-gradient(180deg, rgba(0,0,0,1) 50%, rgba(252,163,17,1) 50%)

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
