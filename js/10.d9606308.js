(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{"373e":function(t,a,e){"use strict";e.r(a);var o=function(){var t=this,a=t._self._c;return a("q-layout",{staticClass:"bg-white",attrs:{view:"lhr lpR lFr"},on:{scroll:t.scrollHandler}},[a("q-drawer",{staticClass:"bg-grey-3 sidebar",attrs:{"show-if-above":"",side:"right",width:320,breakpoint:500},model:{value:t.drawer,callback:function(a){t.drawer=a},expression:"drawer"}},[a("div",{staticClass:"align"},[a("q-list",t._l(t.webcams,(function(e,o){return a("q-item",{key:o,attrs:{dense:""}},[a("q-item-section",[a("q-expansion-item",{class:"text-h6 "+e.anchor,attrs:{label:e.title,to:"#"+e.anchor,dense:"","dense-toggle":"",icon:t.iconSelect(e.type),"active-class":"text-black"}},[a("q-card",[a("q-card-section",[a("p",[t._v("\n                    Title: "+t._s(e.title)+"\n                  ")]),a("p",[t._v("Type: "+t._s(e.type))]),a("p",[t._v("SRC: "+t._s(e.src))]),a("p",[t._v("Link: "+t._s(e.link))]),a("p",[t._v("Anchor: "+t._s(e.anchor))]),a("p",[t._v("Index: "+t._s(o))])])],1)],1)],1)],1)})),1)],1)]),a("q-page-container",[a("div",t._l(t.webcams,(function(e,o){return a("div",{key:o,staticClass:"section q-pa-md",attrs:{id:e.anchor}},[a("div",{staticClass:"title row items-center"},[a("h4",{staticClass:"text-weight-medium col-9 col-md-10"},[t._v("\n            "+t._s(e.title)+"\n          ")]),a("q-fab",{staticClass:"desktop-only",attrs:{color:"green",icon:"share",direction:"down"}},[a("socialSharing",{staticStyle:{"padding-top":"40px"},attrs:{anchor:e.anchor,title:e.title,position:"top"}}),a("q-btn",{staticStyle:{"margin-top":"80px"},attrs:{push:"",round:"",color:"white",icon:"link",size:"xl"},on:{click:function(a){t.showDialog=!0,t.copyURL(e.anchor)}}})],1)],1),"application/x-mpegURL"===e.type?a("video-player",{ref:"video",refInFor:!0,attrs:{options:t.videoOptions,src:e.src,type:e.type,anchor:e.anchor}}):"video/youtube"===e.type?a("video-youtube",{ref:"video",refInFor:!0,attrs:{src:e.src,anchor:e.anchor,type:e.type}}):"previsoes"===e.type&&"windguru"===e.anchor?a("div",{staticClass:"section q-pa-md"},[a("iframe",{staticStyle:{border:"none",width:"100%",overflow:"hidden",height:"823px"},attrs:{scrolling:"no",seamless:"seamless",src:"https://www.windguru.cz/widget-fcst-iframe.php?s=48963&m=3&mw=84&uid=wg_fwdg_48963_3_1616953874460&wj=kmh&tj=c&waj=m&odh=0&doh=24&fhours=240&hrsm=1&vt=forecasts&lng=pt&ts=2&p=WINDSPD,GUST,MWINDSPD,SMER,HTSGW,PERPW,DIRPW,SWELL1,SWPER1,SWDIR1,SWELL2,SWPER2,SWDIR2,WVHGT,WVPER,WVDIR,TMP,TMPE,WCHILL,FLHGT,CDC,TCDC,APCP1s,SLP,RH,RATING&hostname=huna.pt&url=https%3A%2F%2Fhuna.pt%2Fcam%2F",id:"iFrameResizer0"}})]):"previsoes"===e.type&&"tide"===e.anchor?a("div",{staticClass:"tideschart window-height items-center section q-pa-md",staticStyle:{"padding-top":"100px"}},[a("iframe",{attrs:{scrolling:"no",src:"https://pt.tideschart.com/Portugal/District-of-Setubal/Almada/Trafaria/#day",height:"700px",width:"500px"}})]):"previsoes"===e.type&&"surfforecast"===e.anchor?a("div",{staticClass:"section q-pa-md",staticStyle:{"padding-top":"100px"}},[a("div",{staticClass:"wf-width-cont surf-fc-widget"},[a("div",{staticClass:"widget-container"},[a("div",{staticClass:"external-cont"},[a("iframe",{staticClass:"surf-fc-i",attrs:{allowtransparency:"true",src:"//pt.surf-forecast.com/breaks/Costada-Caparica/forecasts/widget/a",height:"400px",width:"100%",scrolling:"no",frameborder:"0",marginwidth:"0",marginheight:"0"}})])])])]):"previsoes"===e.type&&"magicseaweed"===e.anchor?a("div",{staticClass:"section q-pa-xl box",staticStyle:{"padding-top":"200px"}},[a("iframe",{attrs:{src:"https://magicseaweed.com/Costa-da-Caparica-Surf-Report/874/Embed/",scrolling:"no",width:"100%",height:"5000px",frameborder:"0"}})]):a("div",[t._v(" something goes wrong code 5000")])],1)})),0),a("q-dialog",{model:{value:t.showDialog,callback:function(a){t.showDialog=a},expression:"showDialog"}},[a("q-card",{staticClass:"bg-white text-black q-pa-md",staticStyle:{width:"700px","max-width":"80vw"}},[a("q-toolbar",{staticClass:"row items-center"},[a("q-avatar",{staticStyle:{height:"auto"},attrs:{size:"70px"}},[a("img",{attrs:{src:"icons/android-chrome-192x192.png",alt:"Huna logo"}})]),a("q-toolbar-title",[a("span",{staticClass:"text-weight-bold text-h5"},[t._v("Link copiado com sucesso")])])],1),a("q-card-section",{staticClass:"text-h6"},[a("span",{staticClass:"text-h6"},[t._v("Atenção:")]),t._v(" Apenas deverás partilhar esta página com surfistas e pseudo-surfistas, que saibam partilhar ondas e momentos especiais. Não te esqueças, a amizade é o mais importante de tudo.\n        ")]),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Eu entendi",color:"black"}})],1)],1)],1),a("q-page-sticky",{attrs:{position:"bottom-right",offset:[22,5]}},[a("div",{staticClass:"q-mini-drawer-hide absolute",staticStyle:{top:"15px",right:"-17px"}},[a("q-btn",{attrs:{round:"",unelevated:"",icon:"chevron_left"},on:{click:function(a){t.drawer=!t.drawer}}})],1)])],1)],1)},i=[],s=e("5912"),c=e("85bb"),r=e("a935"),n={name:"Cam3",components:{VideoPlayer:s["a"],VideoYoutube:c["a"],socialSharing:r["a"]},methods:{iconSelect(t){return"previsoes"===t?"img:/icons/analytics.svg":"img:/icons/beach.svg"},async copyURL(t){try{this.copiedUrl="www.huna.pt/cam#"+t,await navigator.clipboard.writeText(this.copiedUrl)}catch(a){alert("Cannot copy")}},scrollHandler(){this.webcams.forEach(((t,a)=>{try{const e=document.getElementsByClassName(t.anchor);this.isInViewport(document.getElementById(t.anchor))?(e[0].classList.add("btn_active"),this.$refs.video[a].play()):(e[0].classList.remove("btn_active"),this.$refs.video[a].pause())}catch{console.log("something goes wrong code:4000")}}))},start(){this.$refs.video[0].play()},isInViewport(t){const a=t.getBoundingClientRect();return this.mobile?a.top-350<=0&&a.bottom-350>=0:a.top-500<=0&&a.bottom-500>=0},isMobile(){screen.width<=760?this.mobile=!0:this.mobile=!1}},beforeMount(){this.isMobile()},watch:{$route(t,a){}},data(){return{showDialog:!1,key:0,drawer:!1,mobile:!0,videoOptions:{controls:!0,muted:"muted"},webcams:[{title:"Cova do Vapor",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-covadovapor/chunklist.m3u8",link:"https://www.surfline.com/surf-report/cova-do-vapor/584204204e65fad6a77096ad",anchor:"covadovapor"},{title:"Lorosae - São joão",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-saojoaocaparica/chunklist.m3u8",link:"https://www.surfline.com/surf-report/s-o-joao-da-caparica/5dbb587ff387900001fee288",anchor:"lorosae"},{title:"Inatel - São joão",type:"application/x-mpegURL",src:"https://video-auth1.iol.pt/beachcam/costacaparicasaojoao/chunks.m3u8",link:"https://beachcam.meo.pt/livecams/costa-da-caparica-sao-joao/",anchor:"inatel"},{title:"Marcelino",type:"video/youtube",src:"https://www.youtube.com/embed/1w2_rhfA-SQ?autoplay=1&controls=0&mute=1",link:"https://www.youtube.com/watch?v=1w2_rhfA-SQ&ab_channel=Playocean",anchor:"marcelino"},{title:"CDS até ao barbas",type:"application/x-mpegURL",src:"https://video-auth1.iol.pt/beachcam/costacaparicabernard/chunks.m3u8",link:"https://beachcam.meo.pt/livecams/costa-da-caparica-cds/",anchor:"cds"},{title:"Barbas",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-cdscaparica/chunklist.m3u8",link:"",anchor:"barbas1"},{title:"Barbas",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-barbas/chunklist.m3u8",link:"https://www.surfline.com/surf-report/praia-do-barbas/584204214e65fad6a7709d16?camId=58349f6e3421b20545c4b574",anchor:"barbas2"},{title:"Tarquinho",type:"application/x-mpegURL",src:"https://video-auth1.iol.pt/beachcam/bctarquinho/chunks.m3u8",link:"https://beachcam.meo.pt/livecams/costa-da-caparica-tarquinio/",anchor:"tarquinho"},{title:"Dragão  / Barbas",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-costacaparica/chunklist.m3u8",link:"",anchor:"dragaoebarbas"},{title:"Panoramica - CDS / Barbas / dragão / praia nova / Nova praia",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-costadacaparicaoverview/chunklist.m3u8",link:"https://www.surfline.com/surf-report/costa-da-caparica/5842041f4e65fad6a7708e65?camId=60956af96fe5bbe4ad8557fc",anchor:"panoramica"},{title:"Dragão até à Praia nova",type:"application/x-mpegURL",src:"https://video-auth1.iol.pt/beachcam/bccaparicanovapraia/chunks.m3u8",link:"https://beachcam.meo.pt/livecams/costa-da-caparica-praia-nova/",anchor:"praianovadragao"},{title:"Panorâmica fora dos pontões",type:"video/youtube",src:"https://www.youtube.com/embed/ts9LyJbLwX8?autoplay=1&controls=0&mute=1",link:"https://www.youtube.com/watch?v=ts9LyJbLwX8&ab_channel=Playocean",anchor:"foradospontoes"},{title:"Praia da Riviera",type:"application/x-mpegURL",src:"https://video-auth1.iol.pt/beachcam/riviera/chunks.m3u8",link:"https://beachcam.meo.pt/livecams/costa-da-caparica-riviera/",anchor:"riviera"},{title:"Praia do castelo",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-castelo/chunklist.m3u8",link:"https://www.surfline.com/surf-report/marcelino/584204214e65fad6a7709d15",anchor:"castelo"},{title:"Praia da Sereia",type:"video/youtube",src:"https://www.youtube.com/embed/ywH7uPTpd98?autoplay=1&controls=0&mute=1",link:"https://www.youtube.com/watch?v=ywH7uPTpd98&ab_channel=Playocean",anchor:"sereia"},{title:"Fonte da telha - Norte",type:"video/youtube",src:"https://www.youtube.com/embed/Icwrq0WqOXo?autoplay=1&controls=0&mute=1",link:"https://www.youtube.com/watch?v=Icwrq0WqOXo&ab_channel=Playocean",anchor:"fontedatelhanorte"},{title:"Fonte da telha - Sul",type:"video/youtube",src:"https://www.youtube.com/embed/aiCB3ZVf6xY?autoplay=1&controls=0&mute=1",link:"https://www.youtube.com/watch?v=aiCB3ZVf6xY&ab_channel=Playocean",anchor:"fontedatelhasul"},{title:"Windguru",type:"previsoes",link:"http://www.windguru.cz/pt/index.php?sc=48963",src:"none",anchor:"windguru"},{title:"Tabela de Marés",type:"previsoes",link:"http://www.windguru.cz/pt/index.php?sc=48963",src:"none",anchor:"tide"},{title:"Surf Forecast",type:"previsoes",link:"none",src:"none",anchor:"surfforecast"}]}}},p=n,l=(e("7024"),e("2877")),d=e("4d5a"),h=e("9404"),u=e("1c1c"),m=e("66e5"),w=e("4074"),b=e("3b73"),v=e("f09f"),g=e("a370"),f=e("09e3"),y=e("c294"),k=e("9c40"),x=e("24e8"),C=e("65c6"),S=e("cb32"),q=e("6ac5"),_=e("4b7e"),L=e("de5e"),R=e("0016"),P=e("7f67"),I=e("eebe"),D=e.n(I),Q=Object(l["a"])(p,o,i,!1,null,null,null);a["default"]=Q.exports;D()(Q,"components",{QLayout:d["a"],QDrawer:h["a"],QList:u["a"],QItem:m["a"],QItemSection:w["a"],QExpansionItem:b["a"],QCard:v["a"],QCardSection:g["a"],QPageContainer:f["a"],QFab:y["a"],QBtn:k["a"],QDialog:x["a"],QToolbar:C["a"],QAvatar:S["a"],QToolbarTitle:q["a"],QCardActions:_["a"],QPageSticky:L["a"],QIcon:R["a"]}),D()(Q,"directives",{ClosePopup:P["a"]})},7024:function(t,a,e){"use strict";e("ca18")},ca18:function(t,a,e){}}]);