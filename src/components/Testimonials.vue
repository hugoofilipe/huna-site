<template>
  <div class="bg-greenCustom testimonials">
      <div class="column justify-center q-py-xl">
        <h2 class="col text-center text-weight-medium text-white" style="margin-bottom:30px">{{$t('testemonialTitle1')}}</h2>
        <hr class="hr">
        <h4 class="col-2 text-center text-grey-5" style="margin:13px">{{$t('testemonialSubTitle1')}}</h4>
      </div>
      <div class="row q-my-xl gt-sm" >
          <img  src="icons/message.png" class="center">

          <div style="position: relative;float: right;z-index: 1000; "></div>
          <carousel-3d
            border=0
            space=650
            width=500
            height=450
            perspective=0
            scalling=200
            display=3
            autoplay=true
            autoplayTimeout=3000
          >
            <slide
              :index="0"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center"
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-mx-xl text-justify">
                <p> {{$t('testemonialOne')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">Bestweather</h4>
                <p>CEO</p>
              </div>
            </slide>
            <slide
              :index="1"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center "
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialTwo')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">Francisco Rodrigues</h4>
                <p>Geógrafo Físico</p>
              </div>
            </slide>
            <slide
              :index="2"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center "
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialSix')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">Tiago Alvarenga</h4>
                <p>Médico Veternário e empresário</p>
              </div>
            </slide>
            <slide
              :index="3"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center "
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialThree')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">Nuno Manuel Sousa</h4>
                <p>Agile Scrum Master</p>
              </div>
            </slide>
            <slide
              :index="4"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center "
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialFive')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">VetCaxias</h4>
                <p>CEO</p>
              </div>
            </slide>
            <slide
              :index="5"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center "
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialFour')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">Sofia André</h4>
                <p>Account Manager</p>
              </div>
            </slide>
          </carousel-3d>
      </div>

      <div class="row q-ma-md lt-md">
          <img  src="icons/message.png" class="center">

          <div style="position: relative;float: right;z-index: 1000; "></div>
          <carousel-3d
            border=0
            space=650
            width=500
            height=450
            perspective=0
            scalling=200
            display=1
            autoplay=true
            autoplayTimeout=3000
          >
            <slide
              :index="0"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center"
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialOne')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">Bestweather</h4>
                <p>CEO</p>
              </div>
            </slide>
            <slide
              :index="1"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center "
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialSix')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">Tiago Alvarenga</h4>
                <p>Médico Veternário e empresário</p>
              </div>
            </slide>
            <slide
              :index="2"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center "
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialTwo')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">Francisco Rodrigues</h4>
                <p>Geógrafo Físico</p>
              </div>
            </slide>
            <slide
              :index="3"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center "
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialThree')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">Nuno Manuel Sousa</h4>
                <p>Agile Scrum Master</p>
              </div>
            </slide>
            <slide
              :index="4"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center "
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialFour')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">Sofia André</h4>
                <p>Account Manager</p>
              </div>
            </slide>
            <slide
              :index="5"
              class="bg-grey-2 col-10 col-sm-7 col-md-3  col-side column justify-center "
            >
              <div class="col-2 text-center q-pb-lg vertical-middle">
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
                  <q-icon name="star" size="40px" style="color: orange"/>
              </div>
              <div class=" q-px-xl text-justify">
                <p> {{$t('testemonialFive')}}</p>
              </div>
              <hr class="hr small">
              <div class="col-1 text-center">
                <h4 style="margin:0px">VetCaxias</h4>
                <p>CEO</p>
              </div>
            </slide>
          </carousel-3d>
      </div>
    </div>
</template>

<style lang="sass">
.testimonials
  padding: 60px 0px
  .hr
    border-width: 2px
    width: 10%
  .hr.small
    border-width: 0.5px
    color: black
    width: 25%
  .col-side
    border-top-left-radius: 5px
    border-top-right-radius: 5px
    border-bottom-right-radius: 5px
    border-bottom-left-radius: 5px
    display: inline-flex
    p
      font-size: 19px
  .square
    width: 500px
    height: 500px
    background: white
  .previous .next
    transform: rotate(3deg) scale(0.8)

  .right-1
    transform: translateX(650px) translateZ(-400px) rotate(3deg) !important
    filter: blur(1.5px)
  .left-1
    transform: translateX(-650px) translateZ(-400px) rotate(-3deg) !important
    filter: blur(1.5px)
  .carousel-3d-slide
    box-shadow: 2px 6px 14px 2px #00000057
  .center
    margin: auto auto -82px auto
    z-index: 1
    padding-left: 21%
  .carousel-3d-container
    height: 520px !important
  .carousel-3d-slide
    height: 500px !important
</style>

<script>
import { Carousel3d, Slide } from 'vue-carousel-3d'

export default {
  name: 'testemonials',
  data () {
    return {
      show: true
    }
  },
  methods: {
    say () {
      console.log('Sending email...')
    }
  },
  components: {
    Carousel3d,
    Slide
  }
}
</script>
