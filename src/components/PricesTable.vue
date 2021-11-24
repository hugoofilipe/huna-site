<template>
  <div id="prices" class="bg-greenCustom section priceTable">
      <div class="column justify-center q-py-xl">
        <h2 class="col text-center text-weight-medium text-white" style="margin-bottom:30px">{{$t('priceTableTitle1')}}</h2>
        <hr class="hr">
        <h4 class="col-2 text-center text-grey-5" style="margin:13px">{{$t('priceTableSubTitle1')}}</h4>
      </div>
      <div class="row justify-center ">

          <!-- PRIMEIRA coluna -->
          <div class="bg-gray col-10 col-sm-7 col-md-3 col-side q-my-xl">
            <h3
              class="col text-weight-medium"
              style="margin-bottom: 13px"
            >
              {{$t('priceTableColumn1Title1')}}
            </h3>
            <p class="col-2 q-mb-xl" >{{$t('priceTableColumn1SubTitle1')}}</p>
            <div class="q-my-xs">
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: gray"/>
                <q-icon name="star" size="30px" style="color: gray"/>
            </div>
            <q-btn
                no-caps
                class="btn-goldenCustom btn-rounded q-my-sm"
                text-color="white"
                :label="$t('howItWorks')"
                type="a"
                href="#contacto"
            />

            <div class="q-py-md">
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService1')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService2')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService3')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService4')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService5')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService6')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService7')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService8')}}</span>
              </div>
            </div>

            <div class="row justify-center q-pt-md">
                <q-btn
                  no-caps
                  class="btn-goldenCustom btn-rounded col-8 text-h5 text-weight-medium"
                  type="a"
                  href="#contacto"
                  text-color="white"
                  :label="$t('letsTalk')"
              />
            </div>
          </div>

          <!-- SEGUNDA coluna -->
          <div class="bg-white col-10 col-sm-7 col-md-3  col-side center">
            <div class="column items-end">
              <q-btn
                no-caps
                class="btn-goldenCustom btn-rounded col-6"
                text-color="black"
                :label="$t('popular')"
              />
            </div>
            <h3
              class="col text-weight-medium"
              style="margin-bottom: 13px"
            >
              {{$t('priceTableColumn2Title1')}}
            </h3>
            <p class="col-2 q-mb-xl" >{{$t('priceTableColumn2SubTitle1')}}</p>
            <div class="q-my-xs">
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: gray"/>
            </div>
            <q-btn
                no-caps
                class="btn-goldenCustom btn-rounded q-my-sm"
                text-color="white"
                :label="$t('howItWorks')"
                type="a"
                href="#contacto"
            />

            <div class="q-py-md">
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService9')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService10')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService3')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService11')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService12')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService13')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService4')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService14')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService6')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService7')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService8')}}</span>
              </div>
            </div>

            <div class="row justify-center q-pt-md">
                <q-btn
                  no-caps
                  class="btn-goldenCustom btn-rounded col-8 text-h5 text-weight-medium"
                  type="a"
                  href="#contacto"
                  text-color="white"
                  :label="$t('letsTalk')"
              />
            </div>
          </div>

          <!-- TERCEIRA coluna -->
          <div class="bg-gray col-10 col-sm-7 col-md-3 col-side q-mt-xl">
            <h3
              class="col text-weight-medium"
              style="margin-bottom: 13px"
            >
              {{$t('priceTableColumn3Title1')}}
            </h3>
            <p class="col-2 q-mb-xl" >{{$t('priceTableColumn3SubTitle1')}}</p>
            <div class="q-my-xs">
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: black"/>
                <q-icon name="star" size="30px" style="color: black"/>
            </div>
            <q-btn
                no-caps
                class="btn-goldenCustom btn-rounded q-my-sm"
                text-color="white"
                :label="$t('howItWorks')"
                type="a"
                href="#contacto"
            />

            <div class="q-py-md">
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService15')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService10')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService16')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService18')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService3')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService17')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService11')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService12')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService13')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService4')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService14')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService6')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService7')}}</span>
              </div>
              <div class="q-my-sm">
                <q-icon name="fas fa-check-circle" size="25px" style="color: #00704A"/>
                <span class="q-px-sm">{{$t('priceTableService8')}}</span>
              </div>
            </div>

            <div class="row justify-center q-pt-md">
                <q-btn
                  no-caps
                  class="btn-goldenCustom btn-rounded col-8 text-h5 text-weight-medium"
                  type="a"
                  href="#contacto"
                  text-color="white"
                  :label="$t('letsTalk')"
              />
            </div>
          </div>
      </div>
    </div>
</template>

<style lang="sass">
.section.priceTable
  padding: 120px 0px
  .hr
      width: 10%
  .col-side
      border-top-left-radius: 30px
      border-top-right-radius: 30px
      border-bottom-right-radius: 30px
      border-bottom-left-radius: 30px
      padding: 20px 4% 20px 4%
      height: fit-content
      span
        font-size: 19px
  .col-side.center
      padding: 20px 4% 20px 4%
      margin-left: -2%
      margin-right: -2%
      z-index: 1

</style>

<script>
export default {
  name: 'priceTable',
  data () {
    return {
    }
  }
}
</script>
