<template>
    <div class="fieldsOfBusiness-mobile">
        <div
        class=" bg-greenCustom"
        >
        <div class="column justify-center q-py-xl">
            <h2 class="col text-center text-weight-medium text-white" style="margin:13px">{{$t('fieldsOfBusinessTitle1')}}</h2>
            <hr class="col hr">
            <h4 class="col text-center text-grey-5" style="margin:13px">{{$t('fieldsOfBusinessSubTitle1')}}</h4>
        </div>
        <carousel
            class="carousel"
            :autoplay="true"
            :loop="true"
            :perPage=1
        >
            <slide class="container_slide">
                <q-img class="img " src='images/restaurant2.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard1')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img class="img" src='images/bars.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard2')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img class="img" src='images/rooms2.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard3')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img class="img" src='images/saude.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard4')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img class="img" src='images/shopper.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard5')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img class="img" src='images/construction.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard6')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img class="img" src='images/imobiliario.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard7')}}</h5>
                <div class="overlay"></div>
            </slide>
            <slide class="container_slide">
                <q-img class="img" src='images/clinics.jpg' />
                <h5 class="centered">{{$t('fieldsOfBusinesscard8')}}</h5>
                <div class="overlay"></div>
            </slide>
        </carousel>
    </div>
    </div>
</template>

<style lang="sass">
.fieldsOfBusiness-mobile
    .fieldsOfBusiness-mobile
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
        position: absolute
        transform: translate(-50%)
        z-index: 2
        top: 0%
        left: 50%
        padding: 17px
        transition: 0.6s ease
        opacity: 1
        width: 100%
        background: #ef9e0999
        margin: 0
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
    .VueCarousel-pagination
        // display: none
    .VueCarousel-dot-container
        margin-top: 0px !important
    .VueCarousel-dot--active
        background-color: #ffa000 !important
</style>

<script>
import { Carousel, Slide } from 'vue-carousel'

export default {
  name: 'fieldsOfBusiness-mobile',
  components: {
    Carousel,
    Slide
  },
  data () {
    return {
    }
  }
}
</script>
