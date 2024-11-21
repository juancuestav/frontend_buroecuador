var $=Object.defineProperty;var V=(o,e,t)=>e in o?$(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var a=(o,e,t)=>(V(o,typeof e!="symbol"?e+"":e,t),t);import{Z as k,d as q,G as y,U as g,J as n,V as A,O as m,L as r,j as s,Q as S,M as U,N as l,K as d,X as f,F as v}from"./index.6072a1b1.js";import{Q as h}from"./QSelect.8fa0bc61.js";import{Q}from"./QPage.2411b3e2.js";import{C as E}from"./ContenedorSimpleMixin.6f374d2f.js";import{o as T}from"./utils.508c826c.js";import{r as u}from"./i18n-validators.254d0ba5.js";import{u as j}from"./index.1be77ee8.js";import{S as w}from"./SelectorImagen.5afa715e.js";import{T as B}from"./TabLayout.6a412dfb.js";import{T as D}from"./TransacccionSimpleController.f4dc3690.js";import{E as F}from"./entidadAuditable.9f5621ba.js";import{_ as N}from"./plugin-vue_export-helper.21dcd24c.js";import"./QChip.2863bbd0.js";import"./QItem.159d8e83.js";import"./QMenu.6c964ac0.js";import"./position-engine.71479b28.js";import"./selection.ec88bd7c.js";import"./format.8ac60962.js";import"./utils.c7760b0c.js";import"./date.3330acff.js";import"./notificaciones.fe24470b.js";import"./use-quasar.52f58024.js";import"./StatusEssentialLoading.d6258813.js";import"./index.d3fb51b6.js";import"./vue-i18n.runtime.0ca83697.js";import"./QImg.351239be.js";import"./QTabs.4b078992.js";import"./QResizeObserver.cd2c994f.js";import"./QTabPanels.2a304c71.js";import"./touch.9135741d.js";import"./use-render-cache.3aae9b27.js";import"./buttonSubmits.178f5d81.js";import"./EssentialTable.0effb8dc.js";import"./QTooltip.0b1018fa.js";import"./QBadge.1ab9ad97.js";import"./QToolbarTitle.80dd577d.js";import"./logo.d1d9b491.js";import"./_commonjsHelpers.8402d862.js";import"./EstadosComponent.69881137.js";import"./Hidratable.166e9fe1.js";class L extends D{constructor(){super(k.verificar_cuenta)}}class x extends F{constructor(){super();a(this,"documento_identidad_anverso");a(this,"documento_identidad_reverso");a(this,"documento_identidad_selfie");a(this,"user_id");a(this,"usuario");a(this,"estado_verificacion");this.documento_identidad_anverso=null,this.documento_identidad_reverso=null,this.documento_identidad_selfie=null,this.user_id=null,this.usuario=null,this.estado_verificacion=null}}const I=[{name:"usuario",field:"usuario",label:"Usuario",align:"left",sortable:!0},{name:"created_at",field:"created_at",label:"Fecha hora subida archivos",align:"left",sortable:!0},{name:"estado_verificacion",field:"estado_verificacion",label:"Estado de verificaci\xF3n",align:"left",sortable:!0}];var M=q({name:"verificar_cuenta",components:{TabLayout:B,SelectorImagen:w},setup(){const o=y(),e=new E(x,new L),{entidad:t}=e.useReferencias(),{setValidador:_}=e.useComportamiento(),c=j({documento_identidad_anverso:{required:u},documento_identidad_reverso:{required:u},documento_identidad_selfie:{required:u},user_id:{required:u}},t);return _(c.value),t.user_id=o.user.id,{v$:c,mixin:e,verificaCuenta:t,configuracionColumnasAprobarVerificarCuenta:I,opcionesVerificarCuenta:T}}});const P={class:"row q-col-gutter-sm"},G={class:"col-12 bg-grey-2 rounded q-mb-md q-pb-sm"},J={class:"col-12 col-md-4"},K={class:"error-msg"},O={class:"col-12 col-md-4"},R={class:"error-msg"},X={class:"col-12 col-md-4 q-mb-md"},Z={class:"error-msg"},z={class:"col-12"};function H(o,e,t,_,b,c){const p=g("selector-imagen"),C=g("tab-layout");return n(),A(Q,{padding:""},{default:m(()=>[e[9]||(e[9]=r("div",{class:"text-h6 q-mb-md"},"Aprobar verificar cuentas",-1)),s(C,{mixin:o.mixin,configuracionColumnas:o.configuracionColumnasAprobarVerificarCuenta,"permitir-consultar":!1,"permitir-eliminar":!1},{formulario:m(()=>[r("div",P,[r("div",G,[s(S,{name:"bi-person-fill"}),e[4]||(e[4]=U(" Usuario: ")),r("b",null,l(o.verificaCuenta.usuario),1)]),r("div",J,[e[5]||(e[5]=r("label",{for:"q-mb-sm block"},"Documento de identidad (anverso)",-1)),s(p,{file_extensiones:".jpg, image/*",imagen:o.verificaCuenta.documento_identidad_anverso,comprimir:!0,alto:"400px",error:!!o.v$.documento_identidad_anverso.$errors.length,"onUpdate:modelValue":e[0]||(e[0]=i=>o.verificaCuenta.documento_identidad_anverso=i)},{error:m(()=>[(n(!0),d(v,null,f(o.v$.documento_identidad_anverso.$errors,i=>(n(),d("div",{key:i.$uid},[r("div",K,l(i.$message),1)]))),128))]),_:1},8,["imagen","error"])]),r("div",O,[e[6]||(e[6]=r("label",{for:"q-mb-sm block"},"Documento de identidad (reverso)",-1)),s(p,{file_extensiones:".jpg, image/*",imagen:o.verificaCuenta.documento_identidad_reverso,comprimir:!0,alto:"400px",error:!!o.v$.documento_identidad_reverso.$errors.length,"onUpdate:modelValue":e[1]||(e[1]=i=>o.verificaCuenta.documento_identidad_reverso=i)},{error:m(()=>[(n(!0),d(v,null,f(o.v$.documento_identidad_reverso.$errors,i=>(n(),d("div",{key:i.$uid},[r("div",R,l(i.$message),1)]))),128))]),_:1},8,["imagen","error"])]),r("div",X,[e[7]||(e[7]=r("label",{for:"q-mb-sm block"},"Documento de identidad (reverso)",-1)),s(p,{file_extensiones:".jpg, image/*",imagen:o.verificaCuenta.documento_identidad_selfie,comprimir:!0,alto:"400px",error:!!o.v$.documento_identidad_selfie.$errors.length,"onUpdate:modelValue":e[2]||(e[2]=i=>o.verificaCuenta.documento_identidad_selfie=i)},{error:m(()=>[(n(!0),d(v,null,f(o.v$.documento_identidad_selfie.$errors,i=>(n(),d("div",{key:i.$uid},[r("div",Z,l(i.$message),1)]))),128))]),_:1},8,["imagen","error"])]),r("div",z,[e[8]||(e[8]=r("label",{for:"q-mb-sm block"},"Estado de verificaci\xF3n",-1)),s(h,{modelValue:o.verificaCuenta.estado_verificacion,"onUpdate:modelValue":e[3]||(e[3]=i=>o.verificaCuenta.estado_verificacion=i),outlined:"",dense:"","options-dense":"",options:o.opcionesVerificarCuenta},null,8,["modelValue","options"])])])]),_:1},8,["mixin","configuracionColumnas"])]),_:1})}var xe=N(M,[["render",H]]);export{xe as default};
