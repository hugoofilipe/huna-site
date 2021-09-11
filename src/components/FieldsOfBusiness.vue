<template>
    <div
        :class="{
            bg_hover_first: isHovering_1,
            bg_hover_second: isHovering_2,
            bg_hover_third: isHovering_3,
            bg_hover_four: isHovering_4,
            bg_hover_five: isHovering_5,
            bg_hover_six: isHovering_6,
            bg_hover_seven: isHovering_7,
            bg_hover_height: isHovering_8
            }"
        class=" fieldsOfBusiness bg_hover_third"
        >
        <div class="column justify-center q-py-xl">
            <h2 class="col text-center text-weight-medium text-white" style="margin:13px">{{$t('fieldsOfBusinessTitle1')}}</h2>
            <hr class="col hr">
            <h4 class="col text-center text-grey-5" style="margin:13px">{{$t('fieldsOfBusinessSubTitle1')}}</h4>
        </div>

        <carousel
            :perPageCustom="[[480, 3], [768, 6]]"
            class="carousel"
            :autoplay="true"
            :loop="true"
        >
            <slide class="container_slide">
                <q-img @mouseover="isHovering_1 = true" @mouseout="isHovering_1 = false" class="img " src='images/restaurant2.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard1')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img @mouseover="isHovering_2 = true" @mouseout="isHovering_2 = false" class="img" src='images/bars.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard2')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img @mouseover="isHovering_3 = true" @mouseout="isHovering_3 = false" class="img" src='images/rooms2.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard3')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img @mouseover="isHovering_4 = true" @mouseout="isHovering_4 = false" class="img" src='images/saude.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard4')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img @mouseover="isHovering_5 = true" @mouseout="isHovering_5 = false" class="img" src='images/shopper.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard5')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img @mouseover="isHovering_6 = true" @mouseout="isHovering_6 = false" class="img" src='images/construction.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard6')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img @mouseover="isHovering_7 = true" @mouseout="isHovering_7 = false" class="img" src='images/imobiliario.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard7')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img @mouseover="isHovering_8 = true" @mouseout="isHovering_8 = false" class="img" src='images/clinics.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard8')}}</h5>
                <div class="overlay"></div>
            </slide>
        </carousel>
    </div>
</template>

<style lang="sass">
.fieldsOfBusiness
    padding: 120px 0px
    .hr
        width: 10%
    .section
        padding: 50px 0px
        p
            font-size: 36px
            line-height: 1

.VueCarousel-slide
    position: relative
    color: #fff
    font-family: Arial
    font-size: 24px
    text-align: center
    min-height: 100px
.VueCarousel-inner
    padding:30px 0px

.label
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
.img
    height:500px
    width: 360px
.centered
    padding: 10px
    background-color: black
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    pointer-events: none
    opacity: 0
.overlay
  position: absolute
  bottom: 0
  background: rgb(249 235 41 / 18%)
  color: #f1f1f1
  width: 100%
  transition: .5s ease
  opacity:1
  top:0%
  height: 500px
.container_slide:hover
    .img
        width:450px
        height:720px
        margin-top: -30%
        z-index: 1
    .centered
        z-index: 2
        top: 0%
        left: 50%
        padding: 17px
        transition: 0.6s ease
        opacity: 1
        width: 101%
        background: #00000094
        margin: 0
    .overlay
        opacity: 0
.VueCarousel-pagination
    // display: none
.VueCarousel-dot-container
    margin-top: 0px !important
.VueCarousel-dot--active
    background-color: #ffa000 !important

// Não alterar a ordem destas classes
.bg_hover_third
    background: radial-gradient(at 44% 60%, black 18%, #00704a 36%)
.bg_hover_first
    background: radial-gradient(at 0% 60%, black 18%, #00704a 36%)
.bg_hover_second
    background: radial-gradient(at 24% 60%, black 18%, #00704a 36%)
.bg_hover_four
    background: radial-gradient(at 58% 60%, black 18%, #00704a 36%)
.bg_hover_five
    background: radial-gradient(at 77% 60%, black 18%, #00704a 36%)
.bg_hover_six
    background: radial-gradient(at 92% 60%, black 18%, #00704a 36%)
.bg_hover_seven
    background: radial-gradient(at 92% 60%, black 18%, #00704a 36%)
.bg_hover_height
    background: radial-gradient(at 92% 60%, black 18%, #00704a 36%)
</style>

<script>
import { Carousel, Slide } from 'vue-carousel'

export default {
  name: 'fieldsOfBusiness',
  components: {
    Carousel,
    Slide
  },
  template: '<div><carousel paginationActiveColor="#42b983" paginationColor="#b2ebd1" paginationSize="5" easing="linear" speed="300"></carousel></div>',
  data () {
    return {
      isHovering_1: false,
      isHovering_2: false,
      isHovering_3: false,
      isHovering_4: false,
      isHovering_5: false,
      isHovering_6: false,
      isHovering_7: false,
      isHovering_8: false
    }
  }
}
</script>
