(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{"0b43":function(t,a,e){"use strict";e("8218")},"0d4d":function(t,a,e){},1:function(t,a){},"539c":function(t,a,e){"use strict";e("90f0")},"578a":function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t._self._c;return a("div",{staticClass:"TheLogin"},[a("div",{staticClass:"main bg-gray"},[a("h1",[t._v("Bem vindo!")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.username,expression:"username"}],attrs:{type:"text",name:"username",id:"username",placeholder:"O teu nome",filled:""},domProps:{value:t.username},on:{input:function(a){a.target.composing||(t.username=a.target.value)}}}),a("br"),a("input",{directives:[{name:"model",rawName:"v-model",value:t.pwd,expression:"pwd"}],attrs:{type:"password",name:"password",id:"password",rules:[t=>!!t||"Field is required"],placeholder:"Password",filled:""},domProps:{value:t.pwd},on:{input:function(a){a.target.composing||(t.pwd=a.target.value)}}}),a("br"),a("q-toggle",{attrs:{label:"I accept the license and terms"},model:{value:t.accept,callback:function(a){t.accept=a},expression:"accept"}}),a("br"),a("br"),a("q-btn",{staticClass:"btn-goldenCustom btn-rounded q-my-sm q-px-xl",attrs:{"no-caps":"","text-color":"white",label:"Entrar"},on:{click:t.logIn}}),a("br"),a("br"),a("q-btn",{attrs:{type:"a",href:"https://www.facebook.com/Huna.pt/",unelevated:"",target:"_blank",dense:""}},[a("q-icon",{staticStyle:{color:"#00704A"},attrs:{name:"fab fa-facebook",color:"#00704A",size:"30px"}})],1),a("q-btn",{attrs:{type:"a",href:"https://www.instagram.com/huna.pt/",unelevated:"",target:"_blank",dense:""}},[a("q-icon",{staticStyle:{color:"#00704A"},attrs:{name:"fab fa-instagram",color:"#00704A",size:"30px"}})],1)],1)])},i=[],n={name:"TheLogin",data(){const t=!1,a=null,e=null;return{accept:t,username:a,pwd:e}},methods:{logIn(){"caparica"===this.pwd&&!0===this.accept&&this.username&&this.username.length>3?(this.$emit("Login::loginResult",{loginResult:!0}),this.$cookies.set("pwd",{code:this.pwd,token:"v1"})):(this.$cookies.remove("pwd"),this.$emit("Login::loginResult",{loginResult:!1}),console.log("wrong in something"))}}},o=n,r=(e("6c02"),e("2877")),l=e("9564"),c=e("9c40"),p=e("0016"),u=e("eebe"),d=e.n(u),m=Object(r["a"])(o,s,i,!1,null,null,null);a["default"]=m.exports;d()(m,"components",{QToggle:l["a"],QBtn:c["a"],QIcon:p["a"]})},5912:function(t,a,e){"use strict";var s=function(){var t=this,a=t._self._c;return a("div",[a("div",{staticClass:"main-video-player"},[a("video",{ref:"videoPlayer",staticClass:"video-js vjs-fluid vjs-default-skin vjs-big-play-centered"},[a("source",{attrs:{src:t.src,type:t.type}})]),a("div",{staticClass:"q-pa-md q-gutter-sm row item.centers"},[a("q-btn",{on:{click:t.play}},[t._v("play")]),a("q-btn",{on:{click:t.pause}},[t._v("pause")]),a("q-btn",{on:{click:function(a){return t.restart(t.src)}}},[t._v("restart")]),a("q-btn",{staticClass:"btn-fixed-width",attrs:{align:"around",label:"Copiar link",icon:"link"},on:{click:function(a){t.showDialog=!0,t.copyURL(t.anchor)}}},[a("q-tooltip",{staticClass:"bg-accent"},[t._v("Copiar link")])],1),a("socialSharing",{attrs:{anchor:t.anchor,title:t.anchor,position:"bottom"}})],1)]),a("q-dialog",{model:{value:t.showDialog,callback:function(a){t.showDialog=a},expression:"showDialog"}},[a("q-card",{staticClass:"bg-white text-black q-pa-md",staticStyle:{width:"700px","max-width":"80vw"}},[a("q-toolbar",{staticClass:"row items-center"},[a("q-avatar",{staticStyle:{height:"auto"},attrs:{size:"70px"}},[a("img",{attrs:{src:"icons/android-chrome-192x192.png",alt:"Huna logo"}})]),a("q-toolbar-title",[a("span",{staticClass:"text-weight-bold text-h5"},[t._v("Link copiado com sucesso")])])],1),a("q-card-section",{staticClass:"text-h6"},[a("span",{staticClass:"text-h6"},[t._v("Atenção:")]),t._v(" Apenas deverás partilhar esta página com surfistas e pseudo-surfistas, que saibam partilhar ondas e momentos especiais. Não te esqueças, a amizade é o mais importante de tudo.\n        ")]),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Eu entendi",color:"black"}})],1)],1)],1)],1)},i=[],n=(e("fda2"),e("f0e2")),o=e("a935"),r={name:"VideoPlayer",components:{socialSharing:o["a"]},props:{options:{type:Object,default(){return{}}},src:[Number,String],type:[Number,String],anchor:[Number,String]},methods:{play(){this.player.play()},pause(){this.player.pause(),this.player.bigPlayButton.show()},restart(t){this.player.pause(),this.player.src({src:t}),this.player.load(),this.player.play()},async copyURL(t){try{this.copiedUrl="www.huna.pt/cam#"+t,await navigator.clipboard.writeText(this.copiedUrl)}catch(a){alert("Cannot copy")}}},data(){return{player:null,showDialog:!1,copiedUrl:""}},mounted(){this.player=Object(n["a"])(this.$refs.videoPlayer,this.options,(()=>{this.player.log("onPlayerReady",this)}))},beforeDestroy(){this.player&&this.player.dispose()}},l=r,c=(e("539c"),e("2877")),p=e("9c40"),u=e("05c0"),d=e("24e8"),m=e("f09f"),h=e("65c6"),b=e("cb32"),g=e("6ac5"),w=e("a370"),v=e("4b7e"),f=e("7f67"),q=e("eebe"),y=e.n(q),k=Object(c["a"])(l,s,i,!1,null,null,null);a["a"]=k.exports;y()(k,"components",{QBtn:p["a"],QTooltip:u["a"],QDialog:d["a"],QCard:m["a"],QToolbar:h["a"],QAvatar:b["a"],QToolbarTitle:g["a"],QCardSection:w["a"],QCardActions:v["a"]}),y()(k,"directives",{ClosePopup:f["a"]})},"6c02":function(t,a,e){"use strict";e("c60e")},8218:function(t,a,e){},"85bb":function(t,a,e){"use strict";var s=function(){var t=this,a=t._self._c;return a("div",{staticClass:"main-video-youtube"},[a("LazyYoutube",{ref:"lazyVideo",attrs:{src:t.src,"max-width":"100%"}}),a("div",{staticClass:"q-pa-md q-gutter-sm row item.centers"},[a("q-btn",{on:{click:function(a){return t.handleClick("playVideo")}}},[t._v("Play")]),a("q-btn",{on:{click:function(a){return t.handleClick("pauseVideo")}}},[t._v("Pause")]),a("q-btn",{on:{click:t.restart}},[t._v("Restart")]),a("q-btn",{staticClass:"btn-fixed-width",attrs:{align:"around",label:"Copiar link",icon:"link"},on:{click:function(a){t.showDialog=!0,t.copyURL(t.anchor)}}},[a("q-tooltip",{staticClass:"bg-accent"},[t._v("Copiar link")])],1),a("socialSharing",{attrs:{anchor:t.anchor,title:t.anchor,position:"bottom"}})],1),a("q-dialog",{model:{value:t.showDialog,callback:function(a){t.showDialog=a},expression:"showDialog"}},[a("q-card",{staticClass:"bg-white text-black q-pa-md",staticStyle:{width:"700px","max-width":"80vw"}},[a("q-toolbar",{staticClass:"row items-center wrap"},[a("q-avatar",{staticStyle:{height:"auto"},attrs:{size:"70px"}},[a("img",{attrs:{src:"icons/android-chrome-192x192.png",alt:"Huna logo"}})]),a("q-toolbar-title",[a("span",{staticClass:"text-weight-bold text-h5"},[t._v("Link copiado com sucesso")])])],1),a("q-card-section",{staticClass:"text-h6"},[a("span",{staticClass:"text-h6"},[t._v("Atenção:")]),t._v(" Apenas deverás partilhar esta página com surfistas e pseudo-surfistas, que\n        saibam partilhar ondas e momentos especiais. Não te esqueças, a amizade é o mais importante de tudo.\n      ")]),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Eu entendi",color:"black"}})],1)],1)],1)],1)},i=[],n=e("3cf9"),o=e("a935"),r={name:"VideoPlayer",components:{LazyYoutube:n["LazyYoutube"],socialSharing:o["a"]},props:{options:{type:Object,default(){return{}}},src:[Number,String],type:[Number,String],anchor:[Number,String]},methods:{play(){this.handleClick("playVideo")},pause(){this.handleClick("pauseVideo")},restart(){this.handleClick("resetView"),this.handleClick("playVideo")},handleClick(t){this.$refs.lazyVideo[t]()},async copyURL(t){try{this.copiedUrl="www.huna.pt/cam#"+t,await navigator.clipboard.writeText(this.copiedUrl)}catch(a){alert("Cannot copy")}}},data(){return{player:null,showDialog:!1,copiedUrl:""}},mounted(){},beforeDestroy(){this.player&&this.player.dispose()}},l=r,c=(e("0b43"),e("2877")),p=e("9c40"),u=e("05c0"),d=e("24e8"),m=e("f09f"),h=e("65c6"),b=e("cb32"),g=e("6ac5"),w=e("a370"),v=e("4b7e"),f=e("7f67"),q=e("eebe"),y=e.n(q),k=Object(c["a"])(l,s,i,!1,null,null,null);a["a"]=k.exports;y()(k,"components",{QBtn:p["a"],QTooltip:u["a"],QDialog:d["a"],QCard:m["a"],QToolbar:h["a"],QAvatar:b["a"],QToolbarTitle:g["a"],QCardSection:w["a"],QCardActions:v["a"]}),y()(k,"directives",{ClosePopup:f["a"]})},"90f0":function(t,a,e){},"98c1":function(t,a,e){"use strict";e("0d4d")},a935:function(t,a,e){"use strict";var s=function(){var t=this,a=t._self._c;return a("ShareNetwork",{staticStyle:{"text-decoration":"none"},attrs:{network:"whatsapp",url:"www.huna.pt/cam#"+t.anchor,title:"Câmara da praia "+t.title,description:"Atenção: Apenas deverás partilhar esta página com surfistas e pseudo-surfistas, que saibam partilhar ondas e momentos especiais. Não te esqueças, a amizade é o mais importante de tudo.",name:"Whatsapp",color:"white"}},["top"===t.position?a("q-btn",{attrs:{push:"",round:"",color:"white",size:"xl",icon:"whatsapp"}}):"bottom"===t.position?a("q-btn",{staticClass:"btn-fixed-width",attrs:{align:"around","text-color":"black",label:"whatsapp",icon:"whatsapp"}}):t._e()],1)},i=[],n=e("bd8c"),o=e.n(n),r=e("2b0e");r["a"].use(o.a);var l={name:"socialSharing",props:{anchor:[String],title:[String],position:[String]}},c=l,p=e("2877"),u=e("9c40"),d=e("eebe"),m=e.n(d),h=Object(p["a"])(c,s,i,!1,null,null,null);a["a"]=h.exports;m()(h,"components",{QBtn:u["a"]})},add6:function(t,a,e){"use strict";var s=function(){var t=this,a=t._self._c;return a("div",[a("q-header",{staticClass:"bg-black",attrs:{elevated:"",reveal:""}},[a("q-toolbar",{staticClass:"lt-md q-my-sm menu_mobile orientation-portrait"},[a("q-btn",{attrs:{flat:"",dense:"",round:"",icon:"menu","aria-label":"Menu"},on:{click:function(a){t.leftDrawerOpen=!t.leftDrawerOpen}}}),a("router-link",{attrs:{to:"/"}},[a("q-avatar",{staticClass:"q-px-sm",attrs:{square:"",size:"100px"}},[a("img",{attrs:{src:"images/huna.svg",alt:"Huna logo"}})])],1)],1),a("q-toolbar",{staticClass:"gt-sm q-px-lg q-my-sm menu"},[a("router-link",{attrs:{to:"/"}},[a("q-avatar",{attrs:{square:"",size:"100px"}},[a("img",{attrs:{src:"images/huna.svg",alt:"Huna logo"}})])],1),a("q-space"),a("div",[a("q-btn",{attrs:{"no-caps":"",type:"a",href:"#how",label:t.$t("how")}}),a("q-btn",{attrs:{"no-caps":"",type:"a",href:"#services",label:t.$t("services")}}),a("q-btn",{attrs:{"no-caps":"",type:"a",href:"#prices",label:t.$t("prices")}}),a("q-btn",{staticClass:"btn-goldenCustom btn-rounded",attrs:{"no-caps":"",type:"a",href:"#contacto","text-color":"white",rounded:"",label:t.$t("letsTalk")}}),a("q-btn",{attrs:{label:t.languageKeyNow}},[a("q-menu",t._l(t.langOptions,(function(e){return a("q-list",{key:e.value},[a("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"text-weight-medium",staticStyle:{"font-size":"20px"},attrs:{clickable:""},on:{click:function(a){return t.changeLang(e)}}},[t._v("\n                      "+t._s(e.label)+"\n                  ")])],1)})),1)],1),a("q-btn",{attrs:{dense:"",flat:"",round:"",color:"white",icon:t.$q.dark.isActive?"nights_stay":"wb_sunny"},on:{click:function(a){return t.$q.dark.toggle()}}})],1)],1)],1),a("q-drawer",{attrs:{"content-class":"bg-black",width:300},model:{value:t.leftDrawerOpen,callback:function(a){t.leftDrawerOpen=a},expression:"leftDrawerOpen"}},[a("router-link",{attrs:{to:"#welcome"}},[a("q-avatar",{staticClass:"q-px-sm text-center q-ma-lg",attrs:{square:"",size:"100px"}},[a("img",{attrs:{src:"images/huna.svg",alt:"Huna logo"}})])],1),a("q-list",{staticStyle:{color:"white"},attrs:{padding:""}},[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"text-h5",attrs:{clickable:""}},[a("q-item-section",[a("router-link",{staticClass:"menu_drawer",attrs:{to:"#how"}},[t._v("\n              "+t._s(t.$t("how"))+"\n            ")])],1)],1),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"text-h5",attrs:{clickable:""}},[a("q-item-section",[a("router-link",{staticClass:"menu_drawer",attrs:{to:"#services"}},[t._v("\n              "+t._s(t.$t("services"))+"\n            ")])],1)],1),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"text-h5",attrs:{clickable:""}},[a("q-item-section",[a("router-link",{staticClass:"menu_drawer",attrs:{to:"#prices"}},[t._v("\n              "+t._s(t.$t("prices"))+"\n            ")])],1)],1)],1),a("q-list",{staticClass:"fixed-bottom"},[a("div",{staticClass:"row"},[a("q-btn",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"col-12 btn-goldenCustom text-white",attrs:{flat:"",clickable:"",type:"a",href:"#contacto",label:t.$t("letsTalk")}}),a("q-btn",{staticClass:"col-6 q-tab q-tab--no-caps",attrs:{label:t.languageKeyNow,exact:"",flat:"",color:"white"}},[a("q-menu",t._l(t.langOptions,(function(e){return a("q-list",{key:e.value},[a("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"text-weight-medium",staticStyle:{"font-size":"20px"},attrs:{clickable:""}},[a("q-item-section",{on:{click:function(a){return t.changeLang(e)}}},[t._v("\n                    "+t._s(e.label)+"\n                  ")])],1)],1)})),1)],1),a("q-btn",{staticClass:"col-6",attrs:{flat:"",color:"white",icon:t.$q.dark.isActive?"nights_stay":"wb_sunny"},on:{click:function(a){return t.$q.dark.toggle()}}})],1)])],1)],1)},i=[],n={name:"MainMenu",methods:{changeLang(t){this.lang=t.value,this.languageKeyNow=t.label}},data(){return{leftDrawerOpen:!1,lang:this.$i18n.locale,languageKeyNow:"PT",langOptions:[{value:"pt-PT",label:"PT"},{value:"en-US",label:"EN"}]}},watch:{lang(t){this.$i18n.locale=t}}},o=n,r=(e("98c1"),e("2877")),l=e("e359"),c=e("65c6"),p=e("9c40"),u=e("cb32"),d=e("2c91"),m=e("4e73"),h=e("1c1c"),b=e("66e5"),g=e("9404"),w=e("4074"),v=e("7460"),f=e("7f67"),q=e("714f"),y=e("eebe"),k=e.n(y),C=Object(r["a"])(o,s,i,!1,null,null,null);a["a"]=C.exports;k()(C,"components",{QHeader:l["a"],QToolbar:c["a"],QBtn:p["a"],QAvatar:u["a"],QSpace:d["a"],QMenu:m["a"],QList:h["a"],QItem:b["a"],QDrawer:g["a"],QItemSection:w["a"],QTab:v["a"]}),k()(C,"directives",{ClosePopup:f["a"],Ripple:q["a"]})},c60e:function(t,a,e){}}]);