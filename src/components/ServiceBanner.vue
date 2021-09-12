<template>
    <div class="bg-greenCustom serviceBanner ">
        <div class="q-ma-xl q-pa-xl bg-serviceBanner">
          <div class="column justify-center q-pa-xl">
            <h2 class="col text-center text-weight-medium text-white" style="margin:13px">{{$t('serviceBannertitle1')}}</h2>
            <hr class="col hr">
            <h4 class="col text-center text-grey-4" style="margin:13px">{{$t('serviceBannersubtitle1')}}</h4>
          </div>

          <div class="row justify-around section items-center">
              <!-- Coluna da esquerda -->
              <div class="col-12 col-md-3">
                <q-card dark flat class="bg-grey-3 my-card q-ma-md pointer" @click='service_img===1?service_img=0:service_img=1' >
                  <q-card-section class="flex">
                    <q-img class="q-mr-md" style="width:42px" src='icons/house.png' />
                    <div class="text-black text-h4 text-weight-medium">{{$t('serviceBannerLocationTitle')}}</div>
                  </q-card-section>
                  <q-separator inset class="btn-goldenCustom" style="width:30%"/>
                  <q-card-section>
                    <p class="text-h6 text-black">{{$t('serviceBannerLocationText')}}</p>
                  </q-card-section>
                </q-card>

                <q-card dark flat class="bg-grey-3 my-card q-ma-md pointer" @click='service_img===2?service_img=0:service_img=2' >
                  <q-card-section class="flex">
                    <q-img class="q-mr-md" style="width:42px" src='icons/branding.png' />
                    <div class="text-black text-h4 text-weight-medium">{{$t('serviceBannerBrandingTitle')}}</div>
                  </q-card-section>
                  <q-separator inset class="btn-goldenCustom" style="width:30%"/>
                  <q-card-section>
                    <p class="text-h6 text-black">{{$t('serviceBannerBrandingText')}}</p>
                  </q-card-section>
                </q-card>

                <q-card dark flat class="bg-grey-3 my-card q-ma-md pointer" @click='service_img===3?service_img=0:service_img=3' >
                  <q-card-section class="flex">
                    <q-img class="q-mr-md" style="width:42px" src='icons/socialMedia.png' />
                    <div class="text-black text-h4 text-weight-medium">{{$t('serviceBannerSocialMediaTitle')}}</div>
                  </q-card-section>
                  <q-separator inset class="btn-goldenCustom" style="width:30%"/>
                  <q-card-section>
                    <p class="text-h6 text-black">{{$t('serviceBannerSocialMediaText')}}</p>
                  </q-card-section>
                </q-card>

                <q-card dark flat class="bg-grey-3 my-card q-ma-md pointer" @click='service_img===4?service_img=0:service_img=4' >
                  <q-card-section class="flex">
                    <q-img class="q-mr-md" style="width:42px" src='icons/technology.png' />
                    <div class="text-black text-h4 text-weight-medium">{{$t('serviceBannerTechnologyTitle')}}</div>
                  </q-card-section>
                  <q-separator inset class="btn-goldenCustom" style="width:30%"/>
                  <q-card-section>
                    <p class="text-h6 text-black">{{$t('serviceBannerTechnologyText')}}</p>
                  </q-card-section>
                </q-card>
              </div>

              <!-- conteudo escrito -->
              <div v-show = "service_img == 0" class="col-4 q-px-md text-center">
                <img style="width:90%" src="images/huna.svg">
              </div>
              <div v-show = "service_img == 1" class="col-4 q-px-md text-center">
                <div class="text-white text-h4 text-left text-weight-medium q-my-lg">{{$t('serviceBannerLocationTitle')}}</div>
                <p class="text-white text-justify text-h5 ">{{$t('serviceBannerLocationInfo1')}}</p>
              </div>
              <div v-show = "service_img == 2" class="col-4 q-px-md text-center">
                <div class="text-white text-h4 text-left text-weight-medium q-my-lg">{{$t('serviceBannerBrandingTitle')}}</div>
                <p class="text-white text-justify text-h5 ">{{$t('serviceBannerBrandingInfo1')}}</p>
              </div>
              <div v-show = "service_img == 3" class="col-4 q-px-md text-center">
                <div class="text-white text-h4 text-left text-weight-medium q-my-lg">{{$t('serviceBannerSocialMediaTitle')}}</div>
                <p class="text-white text-justify text-h5 ">{{$t('serviceBannerSocialMediaInfo1')}}</p>
              </div>
              <div v-show = "service_img == 4" class="col-4 q-px-md text-center">
                <div class="text-white text-h4 text-left text-weight-medium q-my-lg">{{$t('serviceBannerTechnologyTitle')}}</div>
                <p class="text-white text-justify text-h5 ">{{$t('serviceBannerTechnologyInfo1')}}</p>
              </div>
              <div v-show = "service_img == 5" class="col-4 q-px-md text-center">
                <div class="text-white text-h4 text-left text-weight-medium q-my-lg">{{$t('serviceBannerSeoTitle')}}</div>
                <p class="text-white text-justify text-h5 ">{{$t('serviceBannerSeoInfo1')}}</p>
              </div>
              <div v-show = "service_img == 6" class="col-4 q-px-md text-center">
                <div class="text-white text-h4 text-left text-weight-medium q-my-lg">{{$t('serviceBannerPwaTitle')}}</div>
                <p class="text-white text-justify text-h5 ">{{$t('serviceBannerPwaInfo1')}}</p>
              </div>
              <div v-show = "service_img == 7" class="col-4 q-px-md text-center">
                <div class="text-white text-h4 text-left text-weight-medium q-my-lg">{{$t('serviceBannerMonitoringTitle')}}</div>
                <p class="text-white text-justify text-h5 ">{{$t('serviceBannerMonitoringInfo1')}}</p>
              </div>
              <div v-show = "service_img == 8" class="col-4 q-px-md text-center">
                <div class="text-white text-h4 text-left text-weight-medium q-my-lg">{{$t('serviceBannerResponsiveTitle')}}</div>
                <p class="text-white text-justify text-h5 ">{{$t('serviceBannerResponsiveInfo1')}}</p>
              </div>

              <!-- Coluna da direita -->
              <div class="col-12 col-md-3 q-px-md">
                <q-card dark flat class="bg-grey-3 my-card q-ma-md pointer" @click='service_img===5?service_img=0:service_img=5' >
                  <q-card-section class="flex">
                    <q-img class="q-mr-md" style="width:42px" src='icons/search.png' />
                    <div class="text-black text-h4 text-weight-medium">{{$t('serviceBannerSeoTitle')}}</div>
                  </q-card-section>
                  <q-separator inset class="btn-goldenCustom" style="width:30%"/>
                  <q-card-section>
                    <p class="text-h6 text-black">{{$t('serviceBannerSeoText')}}</p>
                  </q-card-section>
                </q-card>

                <q-card dark flat class="bg-grey-3 my-card q-ma-md pointer" @click='service_img===6?service_img=0:service_img=6' >
                  <q-card-section class="flex">
                    <q-img class="q-mr-md" style="width:42px" src='icons/pwa.png' />
                    <div class="text-black text-h4 text-weight-medium">{{$t('serviceBannerPwaTitle')}}</div>
                  </q-card-section>
                  <q-separator inset class="btn-goldenCustom" style="width:30%"/>
                  <q-card-section>
                    <p class="text-h6 text-black">{{$t('serviceBannerPwaText')}}</p>
                  </q-card-section>
                </q-card>

                <q-card dark flat class="bg-grey-3 my-card q-ma-md pointer" @click='service_img===7?service_img=0:service_img=7' >
                  <q-card-section class="flex">
                    <q-img class="q-mr-md" style="width:42px" src='icons/monitoring.png' />
                    <div class="text-black text-h4 text-weight-medium">{{$t('serviceBannerMonitoringTitle')}}</div>
                  </q-card-section>
                  <q-separator inset class="btn-goldenCustom" style="width:30%"/>
                  <q-card-section>
                    <p class="text-h6 text-black">{{$t('serviceBannerMonitoringText')}}</p>
                  </q-card-section>
                </q-card>

                <q-card dark flat class="bg-grey-3 my-card q-ma-md pointer" @click='service_img===8?service_img=0:service_img=8' >
                  <q-card-section class="flex">
                    <q-img class="q-mr-md" style="width:42px" src='icons/responsive.png' />
                    <div class="text-black text-h4 text-weight-medium">{{$t('serviceBannerResponsiveTitle')}}</div>
                  </q-card-section>
                  <q-separator inset class="btn-goldenCustom" style="width:30%"/>
                  <q-card-section>
                    <p class="text-h6 text-black">{{$t('serviceBannerResponsiveText')}}</p>
                  </q-card-section>
                </q-card>

              </div>
          </div>
        </div>
    </div>
</template>

<style lang="sass">
  .serviceBanner
    padding: 100px 0px
    .hr
      width: 10%
    .section
      padding: 50px 0px
    .my-card
      border-radius: 20px
      background: #eeeeee66 !important
      &:hover
        border: 4px solid #ef9e09 !important
        background: #ffffff !important
        transition: 0.2s

        // outline: #ef9e09 solid 4px
        // border-radius: 20px !important
    .pointer
      cursor: pointer
    .q-img
      width: 60%
  .bg-serviceBanner
    @media (max-width: $breakpoint-sm-max)
      margin: auto
      padding: 27px 0px
      h2, h4
        color:#000  !important

</style>

<script>
export default {
  name: 'serviceBanner',
  data () {
    return {
      service_img: 0
    }
  }
}
</script>
