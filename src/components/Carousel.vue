<template>
  <div class="z-top">
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      padding
      dark
      infinite
      :height="windowHeight"
      ref="carousel"
      class=" shadow-10 carousel-section"
      style="background: black; border-radius:0 0 30px 30px; box-shadow: rgb(0 0 0 / 20%) 0px 1px 8px, rgb(0 0 0 / 56%) 0px 3px 12px 0px; "
    >
      <!-- Slide 1 -->
      <q-carousel-slide
        name="slide1"
        class="row slide1"
        style="background: radial-gradient(farthest-corner at 70% 70%, rgba(255, 200, 1,1) 0%, rgba(0,0,0) 30%);"
      >
        <div class="col-12 row justify-center items-center">
          <div class="col-11 col-sm-9 col-md-4">
            <div>
              <h1>
                {{$t('slide1Title1')}}
                <span
                  style="background: rgba(255, 200, 1, 0.6); color:black; width: fit-content;padding: 0px 5px; display:inline-block"
                >
                  {{$t('slide1Title2')}}
                </span>
              </h1>
            </div>
            <div class="row lt-md" style="width:90%;margin:auto">
              <q-img class="text-center" src="images/computer.svg" alt="Computer Huna image"/>
            </div>
            <div class="row">
              <p class="col-12 col-md-8 text-h6">{{$t('slide1Subtitle1')}}</p>
            </div>
            <div class="q-pa-md q-gutter-sm gt-sm">
              <q-btn no-caps rounded class="btn-goldenCustom btn-rounded text-h6" text-color="white" :label="$t('prices')" />
              <q-btn no-caps rounded class="btn-goldenCustom btn-rounded text-h6" text-color="white" type="a" href="#contacto" :label="$t('contacts')" />
            </div>
          </div>
          <div class="col-6 gt-sm">
            <q-img src="images/computer.svg" alt="Computer Huna image"/>
          </div>
        </div>
      </q-carousel-slide>

      <!-- Slide 2 -->
      <q-carousel-slide
        name="slide2"
        class="row slide2"
        style="background: radial-gradient(farthest-corner at 70% 70%, rgba(138, 66, 51, 1.1) 0%, rgba(0,0,0) 30%);"
      >
        <div class="col-12 row justify-center items-center">
          <div class="col-11 col-sm-9 col-md-4">
            <div>
              <h1>
                {{$t('slide2Title1')}}
                <span
                  style="background: rgba(138, 66, 51, 0.8); color:black; width: fit-content;padding: 0px 5px; display:inline-block"
                >
                  {{$t('slide2Title2')}}
                </span>
              </h1>
            </div>
            <div class="row lt-md q-ma-md" style="width:90%;">
              <q-img class="text-center" src="images/store.svg" alt="Store Huna image"/>
            </div>
            <div class="row">
              <p class="col-12 col-md-8 text-h6">{{$t('slide2Subtitle1')}}</p>
            </div>
            <div class="q-pa-md q-gutter-sm gt-sm">
              <q-btn no-caps rounded class="btn-goldenCustom btn-rounded text-h6" text-color="white" :label="$t('prices')" />
              <q-btn no-caps rounded class="btn-goldenCustom btn-rounded text-h6" text-color="white" type="a" href="#contacto" :label="$t('contacts')" />
            </div>
          </div>
          <div class="col-6 gt-sm">
            <q-img src="images/store.svg" alt="Store Huna image"/>
          </div>
        </div>
      </q-carousel-slide>

      <!-- Slide 3 -->
      <q-carousel-slide
        name="slide3"
        class="row slide3"
        style="background: radial-gradient(farthest-corner at 70% 70%, rgb(53, 73, 175, 2.1) 0%, rgba(0,0,0) 30%);"
      >
        <div class="col-12 row justify-center items-center" >
          <div class="col-11 col-sm-9 col-md-4">
            <div>
              <h1>
                {{$t('slide3Title1')}}
                <span
                  style="background: rgb(53 73 175 / 82%); color:black; width: fit-content;padding: 0px 5px; display:inline-block"
                  class="reduce-size"
                >
                  {{$t('slide3Title2')}}
                </span>
              </h1>
            </div>
            <div class="row lt-md q-ma-md" style="width:90%;">
              <q-img class="text-center" src="images/dashboard.svg" alt="Dashboard Huna image"/>
            </div>
            <div class="row">
              <p class="col-12 col-md-8 text-h6">{{$t('slide3Subtitle1')}}</p>
            </div>
            <div class="q-pa-md q-gutter-sm gt-sm">
              <q-btn no-caps rounded class="btn-goldenCustom btn-rounded text-h6" text-color="white" :label="$t('prices')" />
              <q-btn no-caps rounded class="btn-goldenCustom btn-rounded text-h6" text-color="white" type="a" href="#contacto" :label="$t('contacts')" />
            </div>
          </div>
          <div class="col-5 gt-sm">
            <q-img style="width:100%" src="images/dashboard.svg" alt="Dashboard Huna image"/>
          </div>
        </div>
      </q-carousel-slide>

      <!-- Slide 4 -->
      <q-carousel-slide
        name="slide4"
        class="row slide4"
        style="background: radial-gradient(farthest-corner at 70% 70%, rgb(77, 212, 192, 2.1) 0%, rgba(0,0,0) 30%);"
      >
        <div class="col-12 row justify-center items-center">
          <div class="col-11 col-sm-9 col-md-4">
            <div>
              <h1>
                {{$t('slide4Title1')}}
                <span
                  style="background: rgb(77 212 192 / 74%); color:black; width: fit-content;padding: 0px 5px; display:inline-block"
                  class="reduce-size"
                >
                  {{$t('slide4Title2')}}
                </span>
              </h1>
            </div>
            <div class="row lt-md" style="width:80%;margin:auto">
              <q-img class="text-center q-ma-md" src="images/mobile.svg" alt="Mobile Huna image"/>
            </div>
            <div class="row">
              <p class="col-12 col-md-8 text-h6">{{$t('slide4Subtitle1')}}</p>
            </div>
            <div class="q-pa-md q-gutter-sm gt-sm">
              <q-btn no-caps rounded class="btn-goldenCustom btn-rounded text-h6" text-color="white" :label="$t('prices')" />
              <q-btn no-caps rounded class="btn-goldenCustom btn-rounded text-h6" text-color="white" type="a" href="#contacto" :label="$t('contacts')" />
            </div>
          </div>
          <div class="col-1 gt-sm">
          </div>
          <div class="col-5 gt-sm">
            <q-img style="width:80%" src="images/mobile.svg" alt="mobile Huna image"/>
          </div>
        </div>
      </q-carousel-slide>

      <!-- Slide 5 -->
      <q-carousel-slide
        name="slide5"
        class="row slide5"
        style="background: radial-gradient(farthest-corner at 70% 70%, rgb(212 202 77) 0%, rgba(0,0,0) 30%);"
      >
        <div class="col-12 row justify-center items-center">
          <div class="col-11 col-sm-9 col-md-5">
            <div>
              <h1 style="font-size:60px;" class="reduce-size">
                {{$t('slide5Title1')}}
                <!-- <span
                  style="background: rgb(77 212 192 / 74%); color:black; width: fit-content;padding: 0px 5px; display:inline-block"
                >
                  {{$t('slide5Title2')}}
                </span> -->
              </h1>
            </div>
            <div class="row lt-md" style="width:90%;margin:auto">
              <q-img class="text-center" src="images/design.svg" alt="Design Huna image"/>
            </div>
            <div class="row gt-xs">
              <p class="col-12 col-md-8 text-h6">{{$t('slide5Subtitle1')}}</p>
            </div>
            <div class="q-pa-md q-gutter-sm gt-sm">
              <q-btn no-caps rounded class="btn-goldenCustom btn-rounded text-h6" text-color="white" :label="$t('prices')" />
              <q-btn no-caps rounded class="btn-goldenCustom btn-rounded text-h6" text-color="white" type="a" href="#contacto" :label="$t('contacts')" />
            </div>
          </div>
          <div class="col-6 gt-sm">
            <q-img style="width:85%" src="images/design.svg" alt="Design Huna image"/>
          </div>
        </div>
      </q-carousel-slide>

      <template v-slot:control>
        <div class="gt-sm q-carousel__control absolute q-gutter-xs absolute-bottom-right" style="bottom: 5%;left: 5%">
          <div class=" q-pt-sm" >
              <q-btn type="a" href="https://www.facebook.com/Huna.pt/" target="_blank" >
                  <q-icon name="fab fa-facebook" color="white" size="30px" style="color: #eeeeee"/>
              </q-btn>
              <q-btn type="a" href="https://www.instagram.com/huna.pt/" target="_blank" dense>
                  <q-icon name="fab fa-instagram" color="white" size="30px" style="color: #eeeeee"/>
              </q-btn>
          </div>
        </div>

        <q-carousel-control
          position="bottom-right"
          :offset="[18, 18]"
          class="q-gutter-xs"
          style="bottom: 5%;right: 5%"
        >
          <q-btn
            size= "lg"
            push
            round
            dense
            color="white"
            text-color="black"
            icon="arrow_back"
            class="q-mr-sm"
            @click="$refs.carousel.previous()"
          />
          <q-btn
            size= "lg"
            push
            round
            dense
            color="white"
            text-color="black"
            icon="arrow_forward"
            @click="$refs.carousel.next()"
          />
        </q-carousel-control>
      </template>
    </q-carousel>

  </div>
</template>

<style lang="sass">
.carousel-section
  .slide1
    @media (max-width: $breakpoint-sm-max)
      background: radial-gradient(at 51% 55%, rgb(255, 200, 1) -119%, rgb(0, 0, 0) 69%) !important
  .slide2
    @media (max-width: $breakpoint-sm-max)
      background: radial-gradient(at 51% 55%, rgba(138, 66, 51, 1.1) -119%, rgb(0, 0, 0) 69%) !important
  .slide3
    @media (max-width: $breakpoint-sm-max)
      background: radial-gradient(at 51% 55%, rgb(53, 73, 175, 2.1) -119%, rgb(0, 0, 0) 69%) !important
    .reduce-size
      @media (max-width: $breakpoint-sm-max)
        font-size:57px
  .slide4
    @media (max-width: $breakpoint-sm-max)
      background: radial-gradient(at 51% 55%, rgb(77, 212, 192, 2.1) -119%, rgb(0, 0, 0) 69%) !important
    .reduce-size
      @media (max-width: $breakpoint-sm-max)
        font-size:57px
  .slide5
    @media (max-width: $breakpoint-sm-max)
      background: radial-gradient(at 51% 55%, rgb(212 202 77) -119%, rgb(0, 0, 0) 69%) !important
    .reduce-size
      @media (max-width: $breakpoint-sm-max)
        font-size:35px !important
  .text-h6
      @media (max-width: $breakpoint-sm-max)
        line-height: 1.5rem
</style>
<script>

export default {
  data () {
    return {
      slide: 'slide1',
      windowHeight: (window.innerHeight + 30) + 'px',
      autoplay: true,
      lorem: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo provident incidunt ducimus iusto perferendis porro earum. Totam, numquam?'
    }
  }
}
</script>
