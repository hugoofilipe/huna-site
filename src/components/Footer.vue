<template>
    <div class="footer">
        <div class="background gt-sm">
            <div class="container">
                <div class="trapezio_left"></div>
                <div class="trapezio_right"></div>
            </div>
        </div>
        <div class="row items-end content">
            <div class="col-12 col-md-3">
                <img style="width:70%;padding: 20px; float: right" src="images/huna.svg">
            </div>
            <div class="gt-md col-3">
            </div>
            <div class="col-11 col-md-6">
                <div class="row" style="margin-bottom: 34px;">
                    <div class="col-12 col-md-4" >
                        <h4>Contactos</h4>
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
                                Seg-Dom: 9:00 às 20:00
                            </p>
                            <p>
                                <q-icon name="img:icons/globe.svg" />
                                Lisboa, Portugal
                            </p>
                        </div>
                    </div>
                    <div class="col-12 col-md-4" >
                        <h4>Serviços</h4>
                        <h4>Portfólio</h4>
                        <h4>Preços</h4>
                        <h4>Area Reservada</h4>
                    </div>
                    <div class="col-12 col-md-4" >
                        <q-btn no-caps class="btn-goldenCustom2 flat push dense text-weight-bold" padding="15px 30px" text-color="white" :label="$t('letsTalk')" />
                        <p class="text-h6" >Deixe tudo conosco, nós criamos e desenvolvemos para si e para a sua empresa.</p>
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
    </div>
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
        width: 45%
        background: black
        height: 400px
        -webkit-clip-path: polygon(0 0, 66% 0, 100% 100%, 0 100%)
        clip-path: polygon(0 0, 66% 0, 100% 100%, 0 100%)
    .trapezio_right
        width: 67%
        color: grey
        clip-path: polygon(0 0, 100% 0%, 100% 100%, 19% 100%)
        background: #eeeeee
        height: 330px
        margin-left: -10%
        margin-top: 70px
    .content
        position: relative
        height: 400px
        width: 100%
        color: #7A7A7A
        h4
            margin: 5px 0px
            font-weight: 700
            font-size: 30px
        p
            margin: 6px 0px
            line-height: 27px
        div img
            width:20px
        .q-btn
            margin-bottom: 20px
    .content.row
        padding-bottom: 30px

</style>

<script>
export default {
  name: 'footer',
  data () {
    return {

    }
  }
}
</script>
