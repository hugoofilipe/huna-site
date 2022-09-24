<template>
    <div class="footer">
        <div class="background gt-md">
            <div class="container">
                <div class="trapezio_left"></div>
                <div class="trapezio_right"></div>
            </div>
        </div>
        <div class="row content gt-md">
            <div class="col-12 col-md-3 self-end">
                <div class="column items-center">
                    <q-img style="width:60%;" class="q-ma-md" src="images/huna.svg" alt="Huna logo">
                        <q-tooltip
                            anchor="top middle"
                            transition-show="scale"
                            transition-hide="scale"
                        >
                            Versão:{{version}}
                        </q-tooltip>
                    </q-img>
                    <div class=" q-pt-sm" >
                        <q-btn type="a" href="https://www.facebook.com/Huna.pt/" target="_blank" >
                            <q-icon name="fab fa-facebook" color="white" size="30px" style="color: #eeeeee"/>
                        </q-btn>
                        <q-btn type="a" href="https://www.instagram.com/huna.pt/" target="_blank" dense>
                            <q-icon name="fab fa-instagram" color="white" size="30px" style="color: #eeeeee"/>
                        </q-btn>
                    </div>
                </div>
            </div>
            <div class="gt-md col-2">
            </div>
            <div class="col-11 col-md-6 self-end" >
                <div class="row" style="margin: 34px;">
                    <div class="col-12 col-md-4" >
                        <h4>{{$t('contacts')}}</h4>
                        <div class="text-h6">
                            <p>
                                <q-icon name="img:icons/envelope.svg" />
                                geral@huna.pt
                            </p>
                            <p>
                                <q-icon name="img:icons/phone.svg" />
                                913314803
                            </p>
                            <p>
                                <q-icon name="img:icons/clock.svg" />
                                Seg-Sáb: 9:00 às 19:00
                            </p>
                            <p>
                                <q-icon name="img:icons/globe.svg" />
                                Lisboa, Portugal
                            </p>
                        </div>
                    </div>
                    <div class="col-12 col-md-4" >
                        <router-link to="#how" class="menu_footer">
                            <h4>{{$t('how')}}</h4>
                        </router-link>
                        <router-link to="#services" class="menu_footer">
                            <h4>{{$t('services')}}</h4>
                        </router-link>
                        <router-link to="#prices" class="menu_footer">
                            <h4>{{$t('prices')}}</h4>
                        </router-link>
                        <router-link to="cam" class="menu_footer">
                            <h4>{{$t('Login')}}</h4>
                        </router-link>
                    </div>
                    <div class="col-12 col-md-3" >
                        <q-btn
                            no-caps
                            class="btn-goldenCustom2 flat push dense text-weight-bold"
                            padding="15px 30px"
                            text-color="white"
                            :label="$t('letsTalk')"
                            type="a"
                            href="#contacto"
                        />
                        <p class="text-h6" >{{$t('slide1Subtitle1')}}</p>
                    </div>
                </div>
                <div class="row" >
                    <div class="col-12 col-md-6">
                        <p class="text-h6" >Politicas de privacidade | Cookies | RGPD</p>
                    </div>
                    <div class="col-12 col-md-6">
                        <p class="text-h6" >HUNA &reg; 2018 | Todos os direitos reservados</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row content lt-lg">
            <div class="bg-black col-12 col-lg-3 self-end">
                <div class="column items-center">
                    <img style="width:60%;" class="q-my-lg" src="images/huna.svg" alt="HUNA LOGO">
                    <!-- <div class=" q-pt-sm" >
                        <q-btn type="a" href="https://www.facebook.com/Huna.pt/" target="_blank" >
                            <q-icon name="fab fa-facebook" color="white" size="30px" style="color: #eeeeee"/>
                        </q-btn>
                        <q-btn type="a" href="https://www.instagram.com/huna.pt/" target="_blank" dense>
                            <q-icon name="fab fa-instagram" color="white" size="30px" style="color: #eeeeee"/>
                        </q-btn>
                    </div> -->
                </div>
            </div>
            <div class="gt-sm col-2">
            </div>
            <div class="col-12 bg-black text-white ">
                <div class="row justify-center" style="margin-bottom: 34px;">
                    <div class="col-10 text-center" >
                        <q-btn
                            no-caps
                            class="btn-goldenCustom2 flat push dense text-weight-bold"
                            padding="15px 30px"
                            text-color="white"
                            :label="$t('letsTalk')"
                            type="a"
                            href="#contacto"
                        />
                        <p class="text-h6" >{{$t('slide1Subtitle1')}}</p>
                    </div>
                </div>
                <div class="row justify-center q-ma-sm" >
                    <div class="col-10 text-center">
                        <p class="text-h6" >Politicas de privacidade | Cookies | RGPD</p>
                    </div>
                    <div class="col-10 text-center">
                        <p class="text-h6" >HUNA &reg; 2018 | Todos os direitos reservados</p>
                    </div>
                </div>
            </div>
        </div>    </div>
</template>

<style lang="sass">
    .footer
        position: relative
    .background
        width: 100%
        height: 100%
        position: absolute
        top: 0
        // left: 0
        .container
                display: flex
                background: $greenCustom
                padding-top: 50px
    .trapezio_left
        width: 35%
        background: black
        height: 400px
        -webkit-clip-path: polygon(0 0, 66% 0, 100% 100%, 0 100%)
        clip-path: polygon(0 0, 66% 0, 100% 100%, 0 100%)
    .trapezio_right
        width: 74%
        color: grey
        clip-path: polygon(0 0, 100% 0%, 100% 100%, 14% 100%)
        background: #eeeeee
        height: 330px
        margin-left: -9%
        margin-top: 70px
    .content
        position: relative
        height: 400px
        width: 100%
        color: #7A7A7A
        h4
            margin: 5px 0px
            font-weight: 800
            font-size: 30px
        p
            font-size: 18px
            margin: 6px 0px
            line-height: 27px
        div img
            width:20px
        .q-btn
            margin-bottom: 20px
    .content.row
        padding-bottom: 30px
    .menu_footer
        font-size: 1.5rem
        font-weight: 400
        line-height: 2rem
        letter-spacing: normal
        color: #7A7A7A
        text-decoration-line: unset
</style>

<script>
export default {
  name: 'footer-main',
  data () {
    return {
      version: 0.12
    }
  }
}
</script>
