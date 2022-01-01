<template>
  <div class="bg-banner banner">
    <div class="column justify-center ">
        <h2 class="col text-center text-weight-medium text-white" style="margin:13px">{{$t('bannerTitle1')}}</h2>
        <hr class="col banner-hr">
    </div>
    <div class="q-pa-lg row justify-center section">
        <div class="col-11 col-lg-4 text-center">
            <img style="width:65%" src="images/huna.svg" alt="Logo HUNA">
        </div>
        <div class="col-12 lt-sm" style="padding:60px"></div>
        <div class="col-10 col-lg-3 column items-center">
            <p class="text-white"> {{$t('bannerText1')}}</p>
            <div class="col q-pa-md q-gutter-sm self-end btn-ctc">
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
.banner-hr
  background: #fca311
  background: linear-gradient(90deg, #fca311 50%, black 50%)
  border-style: solid
  border-width: 2px
  width: 20%
.banner
    padding: 100px 0px
    @media (max-width: $breakpoint-sm-max)
      padding: 40px 0px 10px 0px
    .section
        padding: 100px 0px
        .q-btn
          line-height: 2.415em
        p
          font-size: 36px
          line-height: 46px
          @media (max-width: $breakpoint-sm-max)
            line-height: 33px
            font-size: 28px
            text-align: center
        @media (max-width: $breakpoint-sm-max)
          padding: 60px 0px
          .btn-ctc
            align-self: auto
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
