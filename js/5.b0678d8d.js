(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{"05f7":function(t,a,e){"use strict";e("5559")},1:function(t,a){},5559:function(t,a,e){},"999a":function(t,a,e){"use strict";e("cfa5")},cfa5:function(t,a,e){},d881:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("q-layout",{staticClass:"bg-white",attrs:{view:"lhr lpR lFr"}},[e("q-drawer",{staticClass:"bg-grey-3 sidebar",attrs:{"show-if-above":"",side:"right",width:400,breakpoint:500},model:{value:t.drawer,callback:function(a){t.drawer=a},expression:"drawer"}},[e("div",{staticClass:"align"},[e("q-list",[t._l(t.webcams,(function(a,s){return e("q-item",{key:s,attrs:{dense:""}},[e("q-item-section",[e("q-expansion-item",{staticClass:"text-h6",attrs:{"expand-separator":"",label:a.title,to:"#"+a.anchor,dense:"","dense-toggle":"",icon:"img:/icons/beach.svg","active-class":"bg-orange-3 text-grey-9"}},[e("q-card",[e("q-card-section",[e("p",[t._v("\n                    Title: "+t._s(a.title)+"\n                  ")]),e("p",[t._v("Type: "+t._s(a.type))]),e("p",[t._v("SRC: "+t._s(a.src))]),e("p",[t._v("Link: "+t._s(a.link))]),e("p",[t._v("Anchor: "+t._s(a.anchor))]),e("p",[t._v("Index: "+t._s(s))])])],1)],1)],1)],1)})),e("q-item",{attrs:{dense:""}},[e("q-expansion-item",{staticClass:"text-h6",attrs:{"expand-separator":"",label:"Windguru",to:"#windguru",dense:"","dense-toggle":"",icon:"img:/icons/analytics.svg","active-class":"bg-orange-3 text-grey-9"}},[e("q-card",[e("q-card-section",[e("p",[t._v("\n                  Link: http://www.windguru.cz/pt/index.php?sc=48963\n                ")])])],1)],1)],1),e("q-item",{attrs:{dense:""}},[e("q-expansion-item",{staticClass:"text-h6",attrs:{"expand-separator":"",label:"Marés",to:"#tide",dense:"","dense-toggle":"",icon:"img:/icons/analytics.svg","active-class":"bg-orange-3 text-grey-9"}},[e("q-card",[e("q-card-section",[e("p",[t._v("\n                  Link: https://pt.tideschart.com/Portugal/District-of-Setubal/Almada/Trafaria/#day\n                ")])])],1)],1)],1),e("q-item",{attrs:{dense:""}},[e("q-expansion-item",{staticClass:"text-h6",attrs:{"expand-separator":"",label:"Surf-forcast",to:"#surfforecast",dense:"","dense-toggle":"",icon:"img:/icons/analytics.svg","active-class":"bg-orange-3 text-grey-9"}},[e("q-card",[e("q-card-section",[e("p",[t._v("\n                  Link: https://www.surf-forecast.com/breaks/Costada-Caparica/forecasts/latest\n                ")])])],1)],1)],1),e("q-item",{attrs:{dense:""}},[e("q-expansion-item",{staticClass:"text-h6",attrs:{"expand-separator":"",label:"MagicseaWeed",to:"#magicseaweed",dense:"","dense-toggle":"",icon:"img:/icons/analytics.svg","active-class":"bg-orange-3 text-grey-9"}},[e("q-card",[e("q-card-section",[e("p",[t._v("\n                  Link: https://pt.magicseaweed.com/Costa-da-Caparica-Surf-Report/874/\n                ")])])],1)],1)],1)],2)],1)]),e("q-page-container",[e("div",[t._l(t.webcams,(function(a,s){return e("div",{key:s,staticClass:"section q-pa-md"},[e("h4",{staticClass:"text-weight-medium"},[t._v("\n          "+t._s(a.title)+"\n        ")]),e("video-player",{attrs:{options:t.videoOptions,src:a.src,type:a.type,anchor:a.anchor}})],1)})),e("div",{staticClass:"section q-pa-md",staticStyle:{"padding-top":"100px"},attrs:{id:"windguru"}},[e("h4",{staticClass:"text-weight-medium"},[t._v("\n          Windguru\n        ")]),e("iframe",{staticStyle:{border:"none",width:"100%",overflow:"hidden",height:"823px"},attrs:{scrolling:"no",seamless:"seamless",src:"https://www.windguru.cz/widget-fcst-iframe.php?s=48963&m=3&mw=84&uid=wg_fwdg_48963_3_1616953874460&wj=kmh&tj=c&waj=m&odh=0&doh=24&fhours=240&hrsm=1&vt=forecasts&lng=pt&ts=2&p=WINDSPD,GUST,MWINDSPD,SMER,HTSGW,PERPW,DIRPW,SWELL1,SWPER1,SWDIR1,SWELL2,SWPER2,SWDIR2,WVHGT,WVPER,WVDIR,TMP,TMPE,WCHILL,FLHGT,CDC,TCDC,APCP1s,SLP,RH,RATING&hostname=huna.pt&url=https%3A%2F%2Fhuna.pt%2Fcam%2F",id:"iFrameResizer0"}})]),e("div",{staticClass:"tideschart window-height items-center section q-pa-md",staticStyle:{"padding-top":"100px"},attrs:{id:"tide"}},[e("h4",{staticClass:"text-weight-medium"},[t._v("\n          Marés\n        ")]),e("iframe",{attrs:{scrolling:"no",src:"https://pt.tideschart.com/Portugal/District-of-Setubal/Almada/Trafaria/#day",height:"700px",width:"500px"}})]),e("div",{staticClass:"section q-pa-md",staticStyle:{"padding-top":"100px"},attrs:{id:"surfforecast"}},[e("h4",{staticClass:"text-weight-medium"},[t._v("\n          Surf Forecast\n        ")]),e("div",{staticClass:"wf-width-cont surf-fc-widget"},[e("div",{staticClass:"widget-container"},[e("div",{staticClass:"external-cont"},[e("iframe",{staticClass:"surf-fc-i",attrs:{allowtransparency:"true",src:"//pt.surf-forecast.com/breaks/Costada-Caparica/forecasts/widget/a",height:"400px",width:"100%",scrolling:"no",frameborder:"0",marginwidth:"0",marginheight:"0"}})])])])]),e("div",{staticClass:"section q-pa-xl",staticStyle:{"padding-top":"200px"},attrs:{id:"magicseaweed"}},[e("h4",{staticClass:"text-weight-medium"},[t._v("\n          MagicSeaWeed\n        ")]),e("iframe",{attrs:{src:"https://magicseaweed.com/Costa-da-Caparica-Surf-Report/874/Embed/",scrolling:"no",width:"100%",height:"5000px",frameborder:"0"}})])],2)])],1)},i=[],c=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",["application/x-mpegURL"===t.type?e("div",{staticClass:"main-video",attrs:{id:t.anchor}},[e("video",{ref:"videoPlayer",staticClass:"video-js vjs-fluid vjs-default-skin vjs-big-play-centered"},[e("source",{attrs:{src:t.src,type:t.type}})])]):"video/youtube"===t.type?e("div",{staticClass:"main-video",attrs:{id:t.anchor}},[e("iframe",{attrs:{id:"ytplayer",type:"text/html",src:t.src,frameborder:"0",allowfullscreen:""}})]):e("div",[t._v("somthing goes wrong")])])},o=[],r=(e("fda2"),e("f0e2")),n={name:"VideoPlayer",props:{options:{type:Object,default(){return{}}},src:[Number,String],type:[Number,String],anchor:[Number,String]},data(){return{player:null}},mounted(){this.player=Object(r["a"])(this.$refs.videoPlayer,this.options,(()=>{this.player.log("onPlayerReady",this)}))},beforeDestroy(){this.player&&this.player.dispose()}},p=n,l=(e("999a"),e("2877")),d=Object(l["a"])(p,c,o,!1,null,null,null),m=d.exports,u={name:"Cam",components:{VideoPlayer:m},data(){return{drawer:!1,videoOptions:{autoplay:!0,controls:!0},webcams:[{title:"Cova do Vapor",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-covadovapor/chunklist.m3u8",link:"https://www.surfline.com/surf-report/cova-do-vapor/584204204e65fad6a77096ad",anchor:"covadovapor"},{title:"Lorosai - São joão",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-saojoaocaparica/chunklist.m3u8",link:"https://www.surfline.com/surf-report/s-o-joao-da-caparica/5dbb587ff387900001fee288",anchor:"lorosai"},{title:"Inatel - São joão",type:"application/x-mpegURL",src:"https://video-auth1.iol.pt/beachcam/costacaparicasaojoao/chunks.m3u8",link:"https://beachcam.meo.pt/livecams/costa-da-caparica-sao-joao/",anchor:"inatel"},{title:"Marcelino",type:"video/youtube",src:"https://www.youtube.com/embed/bFiWx-_UAlk?autoplay=1&controls=0&mute=1",link:"https://www.youtube.com/watch?v=bFiWx-_UAlk&ab_channel=Playocean",anchor:"marcelino"},{title:"Marcelino norte até CDS sul",type:"application/x-mpegURL",src:"https://video-auth1.iol.pt/beachcam/costacaparicacds/chunks.m3u8",link:"https://beachcam.meo.pt/livecams/costa-da-caparica/",anchor:"marcelinonorte"},{title:"CDS até ao barbas",type:"application/x-mpegURL",src:"https://video-auth1.iol.pt/beachcam/costacaparicabernard/chunks.m3u8",link:"https://beachcam.meo.pt/livecams/costa-da-caparica-cds/",anchor:"cds"},{title:"Barbas",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-cdscaparica/chunklist.m3u8",link:"",anchor:"barbas1"},{title:"Barbas",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-barbas/chunklist.m3u8",link:"https://www.surfline.com/surf-report/praia-do-barbas/584204214e65fad6a7709d16?camId=58349f6e3421b20545c4b574",anchor:"barbas2"},{title:"Dragão  / Barbas",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-costacaparica/chunklist.m3u8",link:"",anchor:"dragaoebarbas"},{title:"Panoramica - CDS / Barbas / dragão / praia nova / Nova praia",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-costadacaparicaoverview/chunklist.m3u8",link:"https://www.surfline.com/surf-report/costa-da-caparica/5842041f4e65fad6a7708e65?camId=60956af96fe5bbe4ad8557fc",anchor:"panoramica"},{title:"Dragão até à Praia nova",type:"application/x-mpegURL",src:"https://video-auth1.iol.pt/beachcam/bccaparicanovapraia/chunks.m3u8",link:"https://beachcam.meo.pt/livecams/costa-da-caparica-praia-nova/",anchor:"praianovadragao"},{title:"Panorâmica fora dos pontões",type:"video/youtube",src:"https://www.youtube.com/embed/eoxd8mtF6pM?autoplay=1&controls=0&mute=1",link:"https://www.youtube.com/watch?v=eoxd8mtF6pM&ab_channel=Playocean",anchor:"foradospontoes"},{title:"Praia do castelo",type:"application/x-mpegURL",src:"https://cams.cdn-surfline.com/cdn-int/pt-castelo/chunklist.m3u8",link:"https://www.surfline.com/surf-report/marcelino/584204214e65fad6a7709d15",anchor:"castelo"},{title:"Praia da Sereia",type:"video/youtube",src:"https://www.youtube.com/embed/_sT-z5d4ZAU?autoplay=1&controls=0&mute=1",link:"https://www.youtube.com/watch?v=_sT-z5d4ZAU&ab_channel=Playocean",anchor:"sereia"},{title:"Fonte da telha",type:"video/youtube",src:"https://www.youtube.com/embed/U4AwFAoEPLM?autoplay=1&controls=0&mute=1",link:"https://www.youtube.com/watch?v=U4AwFAoEPLM&ab_channel=Playocean",anchor:"fontedatelhanorte"},{title:"Kailua - Fonte da telha - Sul",type:"video/youtube",src:"https://www.youtube.com/embed/LO68qQ6-OK8?autoplay=1&controls=0&mute=1",link:"https://www.youtube.com/watch?v=LO68qQ6-OK8&ab_channel=Playocean",anchor:"fontedatelhasul"}]}}},h=u,w=(e("05f7"),e("4d5a")),g=e("9404"),b=e("1c1c"),f=e("66e5"),v=e("4074"),y=e("3b73"),x=e("f09f"),C=e("a370"),k=e("09e3"),_=e("0016"),S=e("eebe"),P=e.n(S),q=Object(l["a"])(h,s,i,!1,null,null,null);a["default"]=q.exports;P()(q,"components",{QLayout:w["a"],QDrawer:g["a"],QList:b["a"],QItem:f["a"],QItemSection:v["a"],QExpansionItem:y["a"],QCard:x["a"],QCardSection:C["a"],QPageContainer:k["a"],QIcon:_["a"]})}}]);