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
      :autoplay="autoplay"
      class="text-white shadow-10"
      style="background: black; border-radius:0 0 30px 30px; box-shadow: rgb(0 0 0 / 20%) 0px 1px 8px, rgb(0 0 0 / 56%) 0px 3px 12px 0px; "
    >
      <!-- Slide 1 -->
      <q-carousel-slide
        name="slide1"
        class="row"
        style="background: radial-gradient(farthest-corner at 70% 70%, rgba(255, 200, 1,1) 0%, rgba(0,0,0) 30%);"
      >
        <div class="col-12 row justify-center items-center" style="padding-top:100px">
          <div class="col-4">
            <div class="text-weight-bolder" style="font-size:130px; line-height:1">
              <p>
                {{$t('slide1Title1')}}
                <span
                  style="background: rgba(255, 200, 1, 0.6); color:black; width: fit-content;padding: 0px 5px; display:inline-block"
                >
                  {{$t('slide1Title2')}}
                </span>
              </p>
            </div>
            <div class="row">
              <p class="col-8 text-h6">{{$t('slide1Subtitle1')}}</p>
            </div>
            <div class="q-pa-md q-gutter-sm ">
              <q-btn no-caps rounded class="btn-goldenCustom text-h6" text-color="white" :label="$t('prices')" />
              <q-btn no-caps rounded class="btn-goldenCustom text-h6" text-color="white" :label="$t('contacts')" />
            </div>
          </div>
          <div class="col-6  text-center">
            <q-img src="images/computer.svg" />
          </div>
        </div>
      </q-carousel-slide>

      <!-- Slide 2 -->
      <q-carousel-slide
        name="slide2"
        class="row"
        style="background: radial-gradient(farthest-corner at 70% 70%, rgba(138, 66, 51, 1.1) 0%, rgba(0,0,0) 30%);"
      >
        <div class="col-12 row justify-center items-center" style="padding-top:100px">
          <div class="col-4">
            <div class="text-weight-bolder" style="font-size:130px; line-height:1">
              <p>
                {{$t('slide2Title1')}}
                <span
                  style="background: rgba(138, 66, 51, 0.8); color:black; width: fit-content;padding: 0px 5px; display:inline-block"
                >
                  {{$t('slide2Title2')}}
                </span>
              </p>
            </div>
            <div class="row">
              <p class="col-8 text-h6">{{$t('slide2Subtitle1')}}</p>
            </div>
            <div class="q-pa-md q-gutter-sm ">
              <q-btn no-caps rounded class="btn-goldenCustom text-h6" text-color="white" :label="$t('prices')" />
              <q-btn no-caps rounded class="btn-goldenCustom text-h6" text-color="white" :label="$t('contacts')" />
            </div>
          </div>
          <div class="col-6  text-center">
            <q-img src="images/store.svg" />
          </div>
        </div>
      </q-carousel-slide>

      <!-- Slide 3 -->
      <q-carousel-slide
        name="slide3"
        class="row"
        style="background: radial-gradient(farthest-corner at 70% 70%, rgb(53, 73, 175, 2.1) 0%, rgba(0,0,0) 30%);"
      >
        <div class="col-12 row justify-center items-center" style="padding-top:100px">
          <div class="col-4">
            <div class="text-weight-bolder" style="font-size:130px; line-height:1">
              <p>
                {{$t('slide3Title1')}}
                <span
                  style="background: rgb(53 73 175 / 82%); color:black; width: fit-content;padding: 0px 5px; display:inline-block"
                >
                  {{$t('slide3Title2')}}
                </span>
              </p>
            </div>
            <div class="row">
              <p class="col-8 text-h6">{{$t('slide3Subtitle1')}}</p>
            </div>
            <div class="q-pa-md q-gutter-sm ">
              <q-btn no-caps rounded class="btn-goldenCustom text-h6" text-color="white" :label="$t('prices')" />
              <q-btn no-caps rounded class="btn-goldenCustom text-h6" text-color="white" :label="$t('contacts')" />
            </div>
          </div>
          <div class="col-6  text-center">
            <q-img style="width:80%" src="images/dashboard.svg" />
          </div>
        </div>
      </q-carousel-slide>

      <!-- Slide 4 -->
      <q-carousel-slide
        name="slide4"
        class="row"
        style="background: radial-gradient(farthest-corner at 70% 70%, rgb(77, 212, 192, 2.1) 0%, rgba(0,0,0) 30%);"
      >
        <div class="col-12 row justify-center items-center" style="padding-top:100px">
          <div class="col-4">
            <div class="text-weight-bolder" style="font-size:130px; line-height:1">
              <p>
                {{$t('slide4Title1')}}
                <span
                  style="background: rgb(77 212 192 / 74%); color:black; width: fit-content;padding: 0px 5px; display:inline-block"
                >
                  {{$t('slide4Title2')}}
                </span>
              </p>
            </div>
            <div class="row">
              <p class="col-8 text-h6">{{$t('slide4Subtitle1')}}</p>
            </div>
            <div class="q-pa-md q-gutter-sm ">
              <q-btn no-caps rounded class="btn-goldenCustom text-h6" text-color="white" :label="$t('prices')" />
              <q-btn no-caps rounded class="btn-goldenCustom text-h6" text-color="white" :label="$t('contacts')" />
            </div>
          </div>
          <div class="col-6  text-center">
            <q-img style="width:60%" src="images/mobile.svg" />
          </div>
        </div>
      </q-carousel-slide>

      <!-- Slide 5 -->
      <q-carousel-slide
        name="slide5"
        class="row"
        style="background: radial-gradient(farthest-corner at 70% 70%, rgb(212 202 77) 0%, rgba(0,0,0) 30%);"
      >
        <div class="col-12 row justify-center items-center" style="padding-top:100px">
          <div class="col-4">
            <div class="text-weight-bolder" style="font-size:80px; line-height:1">
              <p>
                {{$t('slide5Title1')}}
                <!-- <span
                  style="background: rgb(77 212 192 / 74%); color:black; width: fit-content;padding: 0px 5px; display:inline-block"
                >
                  {{$t('slide5Title2')}}
                </span> -->
              </p>
            </div>
            <div class="row">
              <p class="col-8 text-h6">{{$t('slide5Subtitle1')}}</p>
            </div>
            <div class="q-pa-md q-gutter-sm ">
              <q-btn no-caps rounded class="btn-goldenCustom text-h6" text-color="white" :label="$t('prices')" />
              <q-btn no-caps rounded class="btn-goldenCustom text-h6" text-color="white" :label="$t('contacts')" />
            </div>
          </div>
          <div class="col-6  text-center">
            <q-img style="width:85%" src="images/design.svg" />
          </div>
        </div>
      </q-carousel-slide>

      <template v-slot:control>
        <div class="q-carousel__control absolute q-gutter-xs absolute-bottom-right" style="bottom: 5%;left: 5%">
          <q-icon name="facebook" color="white" size="30px" />
          <q-icon name="share" color="white" size="30px" />
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
