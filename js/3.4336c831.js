(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{"0668":function(t,e,a){},"1acc":function(t,e,a){"use strict";a("4c5c")},"4c5c":function(t,e,a){},"713b":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-layout",{attrs:{view:"hHh lpR fFf"}},[a("main-menu"),a("q-page-container",{staticClass:"container"},[a("router-view")],1)],1)},n=[],l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("q-header",{staticClass:" bg-black",attrs:{elevated:"",reveal:""}},[a("q-toolbar",{staticClass:"lt-md q-my-sm menu_mobile"},[a("q-btn",{attrs:{flat:"",dense:"",round:"",icon:"menu","aria-label":"Menu"},on:{click:function(e){t.leftDrawerOpen=!t.leftDrawerOpen}}}),a("router-link",{attrs:{to:"#welcome"}},[a("q-avatar",{staticClass:"q-px-sm",attrs:{square:"",size:"100px"}},[a("img",{attrs:{src:"images/huna.svg"}})])],1)],1),a("q-toolbar",{staticClass:"gt-sm q-px-lg q-my-sm menu "},[a("router-link",{attrs:{to:"#welcome"}},[a("q-avatar",{attrs:{square:"",size:"100px"}},[a("img",{attrs:{src:"images/huna.svg"}})])],1),a("q-space"),a("div",[a("q-btn",{attrs:{"no-caps":"",type:"a",href:"#how",label:t.$t("how")}}),a("q-btn",{attrs:{"no-caps":"",type:"a",href:"#services",label:t.$t("services")}}),a("q-btn",{attrs:{"no-caps":"",type:"a",href:"#prices",label:t.$t("prices")}}),a("q-btn",{staticClass:"btn-goldenCustom btn-rounded",attrs:{"no-caps":"",type:"a",href:"#contacto","text-color":"white",rounded:"",label:t.$t("letsTalk")}}),a("q-btn",{attrs:{label:t.languageKeyNow}},[a("q-menu",t._l(t.langOptions,(function(e){return a("q-list",{key:e.value},[a("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"text-weight-medium",staticStyle:{"font-size":"20px"},attrs:{clickable:""},on:{click:function(a){return t.changeLang(e)}}},[t._v("\n                      "+t._s(e.label)+"\n                  ")])],1)})),1)],1),a("q-btn",{attrs:{dense:"",flat:"",round:"",color:"white",icon:t.$q.dark.isActive?"nights_stay":"wb_sunny"},on:{click:function(e){return t.$q.dark.toggle()}}})],1)],1)],1),a("q-drawer",{attrs:{"content-class":"bg-black",width:300},model:{value:t.leftDrawerOpen,callback:function(e){t.leftDrawerOpen=e},expression:"leftDrawerOpen"}},[a("router-link",{attrs:{to:"#welcome"}},[a("q-avatar",{staticClass:"q-px-sm text-center q-ma-lg",attrs:{square:"",size:"100px"}},[a("img",{attrs:{src:"images/huna.svg"}})])],1),a("q-list",{staticStyle:{color:"white"},attrs:{padding:""}},[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"text-h5",attrs:{clickable:""}},[a("q-item-section",[a("router-link",{attrs:{tag:"btn",to:"#how"}},[t._v("\n              "+t._s(t.$t("how"))+"\n            ")])],1)],1),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"text-h5",attrs:{clickable:""}},[a("q-item-section",[a("router-link",{attrs:{tag:"btn",to:"#services"}},[t._v("\n              "+t._s(t.$t("services"))+"\n            ")])],1)],1),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"text-h5",attrs:{clickable:""}},[a("q-item-section",[a("router-link",{attrs:{tag:"btn",to:"#prices"}},[t._v("\n              "+t._s(t.$t("prices"))+"\n            ")])],1)],1)],1),a("q-list",{staticClass:"fixed-bottom"},[a("div",{staticClass:"row"},[a("q-btn",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"col-12 btn-goldenCustom text-white",attrs:{flat:"",clickable:"",type:"a",href:"#contacto",label:t.$t("letsTalk")}}),a("q-btn",{staticClass:"col-6 q-tab q-tab--no-caps",attrs:{label:t.languageKeyNow,exact:"",flat:"",color:"white"}},[a("q-menu",t._l(t.langOptions,(function(e){return a("q-list",{key:e.value},[a("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"text-weight-medium",staticStyle:{"font-size":"20px"},attrs:{clickable:""}},[a("q-item-section",{on:{click:function(a){return t.changeLang(e)}}},[t._v("\n                    "+t._s(e.label)+"\n                  ")])],1)],1)})),1)],1),a("q-btn",{staticClass:"col-6",attrs:{flat:"",color:"white",icon:t.$q.dark.isActive?"nights_stay":"wb_sunny"},on:{click:function(e){return t.$q.dark.toggle()}}})],1)])],1)],1)},i=[],r={name:"MainMenu",methods:{changeLang(t){this.lang=t.value,this.languageKeyNow=t.label}},data(){return{leftDrawerOpen:!1,lang:this.$i18n.locale,languageKeyNow:"PT",langOptions:[{value:"pt-PT",label:"PT"},{value:"en-US",label:"EN"}]}},watch:{lang(t){this.$i18n.locale=t}}},c=r,o=(a("1acc"),a("2877")),u=a("e359"),p=a("65c6"),m=a("9c40"),b=a("cb32"),g=a("2c91"),q=a("4e73"),v=a("1c1c"),w=a("66e5"),d=a("9404"),f=a("4074"),h=a("7460"),k=a("7f67"),y=a("714f"),x=a("eebe"),C=a.n(x),_=Object(o["a"])(c,l,i,!1,null,null,null),$=_.exports;C()(_,"components",{QHeader:u["a"],QToolbar:p["a"],QBtn:m["a"],QAvatar:b["a"],QSpace:g["a"],QMenu:q["a"],QList:v["a"],QItem:w["a"],QDrawer:d["a"],QItemSection:f["a"],QTab:h["a"]}),C()(_,"directives",{ClosePopup:k["a"],Ripple:y["a"]});var Q={name:"MainLayout",components:{MainMenu:$}},N=Q,O=(a("83ec"),a("4d5a")),D=a("09e3"),M=Object(o["a"])(N,s,n,!1,null,null,null);e["default"]=M.exports;C()(M,"components",{QLayout:O["a"],QPageContainer:D["a"]})},"83ec":function(t,e,a){"use strict";a("0668")}}]);