var B=Object.defineProperty;var j=(o,e,l)=>e in o?B(o,e,{enumerable:!0,configurable:!0,writable:!0,value:l}):o[e]=l;var m=(o,e,l)=>(j(o,typeof e!="symbol"?e+"":e,l),l);import{d as T,r as p,J as u,V as P,O as i,bi as D,j as a,a4 as F,L as r,M as k,N as Q,B as h,a2 as Z,bj as G,af as H,bk as J,c as w,a0 as K,Z as X,U as W,Q as Y,ad as y,P as x,K as C,F as E,X as U,bI as f,S as _,bN as ee,bO as oe,a1 as se,b8 as ae}from"./index.6072a1b1.js";import{Q as le}from"./QToolbarTitle.80dd577d.js";import{a as re,C as ie}from"./QTooltip.0b1018fa.js";import{_ as I}from"./plugin-vue_export-helper.21dcd24c.js";import{b as z,Q as M,a as te}from"./QItem.159d8e83.js";import{Q as ne}from"./QSelect.8fa0bc61.js";import{Q as de}from"./QForm.7a1734b3.js";import{r as A}from"./i18n-validators.254d0ba5.js";import{a as me,u as R}from"./notificaciones.fe24470b.js";import{u as ue}from"./use-quasar.52f58024.js";import{u as pe}from"./index.1be77ee8.js";import{T as be}from"./TabLayout.6a412dfb.js";import{B as ce}from"./buttonSubmits.178f5d81.js";import{C as fe}from"./ContenedorSimpleMixin.6f374d2f.js";import{R as ve}from"./RolController.531a0f0a.js";import{P as Ve,a as ge}from"./Permiso.694b0925.js";var Ce=T({props:{comportamiento:{type:Object,required:!0}},setup(o){const{componente:e,titulo:l,abierto:n}=o.comportamiento.useModal();function t(){n.value=!1}const b=p(0);return setTimeout(()=>setInterval(()=>b.value=b.value+.1,200),250),{componente:e,titulo:l,abierto:n,cerrarModalEntidad:t,duracion:b}}});function $e(o,e,l,n,t,b){return u(),P(D,{modelValue:o.abierto,"onUpdate:modelValue":e[1]||(e[1]=d=>o.abierto=d),maximized:!0,"full-width":!1},{default:i(()=>[a(J,null,{default:i(()=>[a(re,null,{default:i(()=>[a(F,{square:""},{default:i(()=>e[2]||(e[2]=[r("img",{src:"src/assets/logo.svg"},null,-1)])),_:1}),a(le,null,{default:i(()=>[k(Q(o.titulo),1)]),_:1}),h(a(Z,{flat:"",round:"",dense:"",icon:"close",onClick:e[0]||(e[0]=d=>o.cerrarModalEntidad())},null,512),[[ie]])]),_:1}),a(G,null,{default:i(()=>[(u(),P(H(o.componente)))]),_:1})]),_:1})]),_:1},8,["modelValue"])}var _e=I(Ce,[["render",$e]]);class Qe{constructor(e){m(this,"refModalEntidades",p());m(this,"modales");m(this,"componenteActual",p());m(this,"modal");m(this,"abierto",p(!1));this.modales=e}useModal(){const e=w(()=>{var t;return(t=this.componenteActual.value)==null?void 0:t.component}),l=w(()=>{var t;return(t=this.componenteActual.value)==null?void 0:t.titulo}),n=w({set:t=>this.abierto.value=t,get:()=>this.abierto.value});return{componente:e,titulo:l,abierto:n,refModalEntidades:this.refModalEntidades}}abrirModalEntidad(e){const l=this.obtenerModal(e);l&&(this.componenteActual.value=l,this.abierto.value=!0)}cerrarModalEntidad(){this.abierto.value=!1}obtenerModal(e){return this.modales[e]}}class qe{constructor(e,l){m(this,"component");m(this,"titulo");this.titulo=e,this.component=l}getComponent(){return this.component}}var we=T({components:{TabLayout:be,ButtonSubmits:ce},emits:["guardado","cerrar-modal"],setup(o,{emit:e}){me().setQuasar(ue());const l=R(),n=new fe(Ve,new ge),{entidad:t,disabled:b,listadosAuxiliares:d}=n.useReferencias(),{cargarVista:s,obtenerListados:v}=n.useComportamiento();s(async()=>{await v({roles:{controller:new ve,params:{campos:"id,name"}}}),c.value=d.roles});const{notificarError:q}=R(),c=p([]),N=pe({name:{required:A},roles:{required:A}},t);async function L(){if(await N.value.$validate()){const V=K.getInstance(),$=V.getEndpoint(X.crear_permiso);await V.post($,t).then(function(g){l.notificarCorrecto(g.data.mensaje),e("cerrar-modal",!1)}).catch(g=>{q(g)})}}return{mixin:n,isPwdCurent:p(!0),isPwd:p(!0),isPwdConfirmation:p(!0),permiso:t,disabled:b,v$:N,roles:c,listadosAuxiliares:d,crear:L,filtrarRol(V,$){if(V===""){$(()=>{c.value=d.roles});return}$(()=>{const g=V.toLowerCase();c.value=d.roles.filter(O=>O.nombre.toLowerCase().indexOf(g)>-1)})}}}});const Me={class:"col-12 col-md-12 rounded-card q-py-sm text-center text-info bg-light-blue-1"},Pe={class:"row q-col-gutter-sm q-mb-md q-mt-md"},ke={class:"col-12 col-md-2"},Ne={class:"col-12 col-md-2 q-mb-md"},ye={class:"error-msg"},Ee={key:0,class:"col-12 col-md-5"},Ue={class:"row q-pt-md"},ze={class:"col-12 col-md-3"},Ae={class:"error-msg"};function Re(o,e,l,n,t,b){const d=W("button-submits");return u(),P(de,{onSubmit:e[10]||(e[10]=se(()=>{},["prevent"]))},{default:i(()=>[r("div",Me,[a(Y,{name:"bi-info-circle-fill",class:"q-mr-sm",size:"1em"}),e[11]||(e[11]=r("b",null,"\xA0 Informaci\xF3n",-1)),e[12]||(e[12]=r("p",{class:"q-mb-xs"}," Tipo de permiso normal: Crea un permiso ingresando el nombre de un m\xF3dulo (mismo nombre que est\xE1 en el controlador del backend), selecciona las acciones que puede realizar y los roles asociados al nuevo permiso. ",-1)),e[13]||(e[13]=r("p",{class:"q-mb-xs"},' Tipo de permiso personalizado: crea un permiso personalizado en el formato "puede.accion.permiso" y los roles asociados a dicho permiso ',-1))]),r("div",Pe,[r("div",ke,[e[14]||(e[14]=r("label",{class:"q-mb-sm block"},"Tipo de permiso",-1)),a(y,{label:o.permiso.permiso_personalizado?"PERSONALIZADO":"NORMAL",modelValue:o.permiso.permiso_personalizado,"onUpdate:modelValue":e[0]||(e[0]=s=>o.permiso.permiso_personalizado=s),color:"primary","keep-color":"",icon:"bi-check2-circle","unchecked-icon":"clear",disable:o.disabled},null,8,["label","modelValue","disable"])]),r("div",Ne,[e[15]||(e[15]=r("label",{class:"q-mb-sm block"},"Nombre",-1)),a(x,{hint:"Escribe un nombre de un modulo",modelValue:o.permiso.name,"onUpdate:modelValue":e[1]||(e[1]=s=>o.permiso.name=s),placeholder:"Obligatorio",error:!!o.v$.name.$errors.length,disable:o.disabled,outlined:"",dense:"",type:"text"},{error:i(()=>[(u(!0),C(E,null,U(o.v$.name.$errors,s=>(u(),C("div",{key:s.$uid},[r("div",ye,Q(s.$message),1)]))),128))]),_:1},8,["modelValue","error","disable"])]),o.permiso.permiso_personalizado?_("",!0):(u(),C("div",Ee,[e[16]||(e[16]=r("label",{class:"block"},"Acciones",-1)),r("div",Ue,[a(f,{class:"",modelValue:o.permiso.autorizar,"onUpdate:modelValue":e[2]||(e[2]=s=>o.permiso.autorizar=s),label:"Autorizar",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"]),a(f,{class:"q-ml-lg",modelValue:o.permiso.acceder,"onUpdate:modelValue":e[3]||(e[3]=s=>o.permiso.acceder=s),label:"Acceder",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"]),a(f,{class:"q-ml-lg",modelValue:o.permiso.ver,"onUpdate:modelValue":e[4]||(e[4]=s=>o.permiso.ver=s),label:"Ver",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"]),a(f,{class:"q-ml-lg",modelValue:o.permiso.crear,"onUpdate:modelValue":e[5]||(e[5]=s=>o.permiso.crear=s),label:"Crear",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"]),a(f,{class:"q-ml-lg",modelValue:o.permiso.editar,"onUpdate:modelValue":e[6]||(e[6]=s=>o.permiso.editar=s),label:"Editar",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"]),a(f,{class:"q-ml-lg",modelValue:o.permiso.eliminar,"onUpdate:modelValue":e[7]||(e[7]=s=>o.permiso.eliminar=s),label:"Eliminar",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"])])])),r("div",ze,[e[18]||(e[18]=r("label",{class:"q-mb-sm block"},"Roles",-1)),a(ne,{modelValue:o.permiso.roles,"onUpdate:modelValue":e[8]||(e[8]=s=>o.permiso.roles=s),options:o.roles,"transition-show":"jump-up","transition-hide":"jump-down",disable:o.disabled,"options-dense":"",multiple:"",dense:"","use-chips":"",outlined:"",onFilter:o.filtrarRol,"use-input":"","input-debounce":"0",error:!!o.v$.roles.$errors.length,"error-message":"Debes seleccionar uno o varios roles","option-value":s=>s.id,"option-label":s=>s.name,"emit-value":"","map-options":""},{option:i(({itemProps:s,opt:v,selected:q,toggleOption:c})=>[a(z,ee(oe(s)),{default:i(()=>[a(M,null,{default:i(()=>[k(Q(v.name)+" ",1),a(te,{"inner-h-t-m-l":v.name},null,8,["inner-h-t-m-l"])]),_:2},1024),a(M,{side:""},{default:i(()=>[a(y,{"model-value":q,"onUpdate:modelValue":S=>c(v)},null,8,["model-value","onUpdate:modelValue"])]),_:2},1024)]),_:2},1040)]),error:i(()=>[(u(!0),C(E,null,U(o.v$.roles.$errors,s=>(u(),C("div",{key:s.$uid},[r("div",Ae,Q(s.$message),1)]))),128))]),"no-option":i(()=>[a(z,null,{default:i(()=>[a(M,{class:"text-grey"},{default:i(()=>e[17]||(e[17]=[k(" No hay resultados ")])),_:1})]),_:1})]),_:1},8,["modelValue","options","disable","onFilter","error","option-value","option-label"])])]),a(d,{accion:"NUEVO",permitirCancelar:!1,onGuardar:e[9]||(e[9]=s=>o.crear(o.entidad))})]),_:1})}var Te=I(we,[["render",Re]]);class Ie{constructor(){m(this,"PermisoNuevoPage");this.PermisoNuevoPage=ae(new qe("Nuevo Permiso",Te))}}class eo extends Qe{constructor(){super(new Ie)}}export{eo as C,_e as M};