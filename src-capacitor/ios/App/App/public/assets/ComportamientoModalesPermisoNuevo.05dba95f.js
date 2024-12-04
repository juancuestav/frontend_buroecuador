var B=Object.defineProperty;var j=(o,e,l)=>e in o?B(o,e,{enumerable:!0,configurable:!0,writable:!0,value:l}):o[e]=l;var m=(o,e,l)=>(j(o,typeof e!="symbol"?e+"":e,l),l);import{d as T,r as p,K as u,X as P,P as i,bi as D,j as a,a7 as F,M as r,N as k,O as Q,C as h,a5 as G,bj as H,ai as J,bk as K,c as w,a3 as X,a2 as Y,_ as Z,V as W,Q as x,ag as N,R as _,L as C,F as E,Y as U,bJ as f,U as ee,bO as oe,bP as se,a4 as ae,b8 as le}from"./index.aea1effc.js";import{Q as re}from"./QToolbarTitle.2f0d394a.js";import{a as ie,C as te}from"./QTooltip.d74f897f.js";import{_ as I}from"./plugin-vue_export-helper.21dcd24c.js";import{b as z,Q as M,a as ne}from"./QItem.287f8ef9.js";import{Q as de}from"./QSelect.2477ae10.js";import{Q as me}from"./QForm.5ecf612c.js";import{r as A}from"./i18n-validators.b664e07d.js";import{a as ue,u as R}from"./notificaciones.305263b9.js";import{u as pe}from"./index.9737fa5c.js";import{T as be}from"./TabLayout.7cfb4972.js";import{B as ce}from"./buttonSubmits.08b9f7f5.js";import{C as fe}from"./ContenedorSimpleMixin.9e6b94a2.js";import{R as ve}from"./RolController.4a5cdc75.js";import{P as Ve,a as ge}from"./Permiso.41ecb692.js";var Ce=T({props:{comportamiento:{type:Object,required:!0}},setup(o){const{componente:e,titulo:l,abierto:n}=o.comportamiento.useModal();function t(){n.value=!1}const b=p(0);return setTimeout(()=>setInterval(()=>b.value=b.value+.1,200),250),{componente:e,titulo:l,abierto:n,cerrarModalEntidad:t,duracion:b}}});function $e(o,e,l,n,t,b){return u(),P(D,{modelValue:o.abierto,"onUpdate:modelValue":e[1]||(e[1]=d=>o.abierto=d),maximized:!0,"full-width":!1},{default:i(()=>[a(K,null,{default:i(()=>[a(ie,null,{default:i(()=>[a(F,{square:""},{default:i(()=>e[2]||(e[2]=[r("img",{src:"src/assets/logo.svg"},null,-1)])),_:1}),a(re,null,{default:i(()=>[k(Q(o.titulo),1)]),_:1}),h(a(G,{flat:"",round:"",dense:"",icon:"close",onClick:e[0]||(e[0]=d=>o.cerrarModalEntidad())},null,512),[[te]])]),_:1}),a(H,null,{default:i(()=>[(u(),P(J(o.componente)))]),_:1})]),_:1})]),_:1},8,["modelValue"])}var xe=I(Ce,[["render",$e]]);class Qe{constructor(e){m(this,"refModalEntidades",p());m(this,"modales");m(this,"componenteActual",p());m(this,"modal");m(this,"abierto",p(!1));this.modales=e}useModal(){const e=w(()=>{var t;return(t=this.componenteActual.value)==null?void 0:t.component}),l=w(()=>{var t;return(t=this.componenteActual.value)==null?void 0:t.titulo}),n=w({set:t=>this.abierto.value=t,get:()=>this.abierto.value});return{componente:e,titulo:l,abierto:n,refModalEntidades:this.refModalEntidades}}abrirModalEntidad(e){const l=this.obtenerModal(e);l&&(this.componenteActual.value=l,this.abierto.value=!0)}cerrarModalEntidad(){this.abierto.value=!1}obtenerModal(e){return this.modales[e]}}class qe{constructor(e,l){m(this,"component");m(this,"titulo");this.titulo=e,this.component=l}getComponent(){return this.component}}var we=T({components:{TabLayout:be,ButtonSubmits:ce},emits:["guardado","cerrar-modal"],setup(o,{emit:e}){ue().setQuasar(X());const l=R(),n=new fe(Ve,new ge),{entidad:t,disabled:b,listadosAuxiliares:d}=n.useReferencias(),{cargarVista:s,obtenerListados:v}=n.useComportamiento();s(async()=>{await v({roles:{controller:new ve,params:{campos:"id,name"}}}),c.value=d.roles});const{notificarError:q}=R(),c=p([]),y=pe({name:{required:A},roles:{required:A}},t);async function O(){if(await y.value.$validate()){const V=Y.getInstance(),$=V.getEndpoint(Z.crear_permiso);await V.post($,t).then(function(g){l.notificarCorrecto(g.data.mensaje),e("cerrar-modal",!1)}).catch(g=>{q(g)})}}return{mixin:n,isPwdCurent:p(!0),isPwd:p(!0),isPwdConfirmation:p(!0),permiso:t,disabled:b,v$:y,roles:c,listadosAuxiliares:d,crear:O,filtrarRol(V,$){if(V===""){$(()=>{c.value=d.roles});return}$(()=>{const g=V.toLowerCase();c.value=d.roles.filter(S=>S.nombre.toLowerCase().indexOf(g)>-1)})}}}});const Me={class:"col-12 col-md-12 rounded-card q-py-sm text-center text-info bg-light-blue-1"},Pe={class:"row q-col-gutter-sm q-mb-md q-mt-md"},ke={class:"col-12 col-md-2"},ye={class:"col-12 col-md-2 q-mb-md"},Ne={class:"error-msg"},Ee={key:0,class:"col-12 col-md-5"},Ue={class:"row q-pt-md"},ze={class:"col-12 col-md-3"},Ae={class:"error-msg"};function Re(o,e,l,n,t,b){const d=W("button-submits");return u(),P(me,{onSubmit:e[10]||(e[10]=ae(()=>{},["prevent"]))},{default:i(()=>[r("div",Me,[a(x,{name:"bi-info-circle-fill",class:"q-mr-sm",size:"1em"}),e[11]||(e[11]=r("b",null,"\xA0 Informaci\xF3n",-1)),e[12]||(e[12]=r("p",{class:"q-mb-xs"}," Tipo de permiso normal: Crea un permiso ingresando el nombre de un m\xF3dulo (mismo nombre que est\xE1 en el controlador del backend), selecciona las acciones que puede realizar y los roles asociados al nuevo permiso. ",-1)),e[13]||(e[13]=r("p",{class:"q-mb-xs"},' Tipo de permiso personalizado: crea un permiso personalizado en el formato "puede.accion.permiso" y los roles asociados a dicho permiso ',-1))]),r("div",Pe,[r("div",ke,[e[14]||(e[14]=r("label",{class:"q-mb-sm block"},"Tipo de permiso",-1)),a(N,{label:o.permiso.permiso_personalizado?"PERSONALIZADO":"NORMAL",modelValue:o.permiso.permiso_personalizado,"onUpdate:modelValue":e[0]||(e[0]=s=>o.permiso.permiso_personalizado=s),color:"primary","keep-color":"",icon:"bi-check2-circle","unchecked-icon":"clear",disable:o.disabled},null,8,["label","modelValue","disable"])]),r("div",ye,[e[15]||(e[15]=r("label",{class:"q-mb-sm block"},"Nombre",-1)),a(_,{hint:"Escribe un nombre de un modulo",modelValue:o.permiso.name,"onUpdate:modelValue":e[1]||(e[1]=s=>o.permiso.name=s),placeholder:"Obligatorio",error:!!o.v$.name.$errors.length,disable:o.disabled,outlined:"",dense:"",type:"text"},{error:i(()=>[(u(!0),C(E,null,U(o.v$.name.$errors,s=>(u(),C("div",{key:s.$uid},[r("div",Ne,Q(s.$message),1)]))),128))]),_:1},8,["modelValue","error","disable"])]),o.permiso.permiso_personalizado?ee("",!0):(u(),C("div",Ee,[e[16]||(e[16]=r("label",{class:"block"},"Acciones",-1)),r("div",Ue,[a(f,{class:"",modelValue:o.permiso.autorizar,"onUpdate:modelValue":e[2]||(e[2]=s=>o.permiso.autorizar=s),label:"Autorizar",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"]),a(f,{class:"q-ml-lg",modelValue:o.permiso.acceder,"onUpdate:modelValue":e[3]||(e[3]=s=>o.permiso.acceder=s),label:"Acceder",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"]),a(f,{class:"q-ml-lg",modelValue:o.permiso.ver,"onUpdate:modelValue":e[4]||(e[4]=s=>o.permiso.ver=s),label:"Ver",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"]),a(f,{class:"q-ml-lg",modelValue:o.permiso.crear,"onUpdate:modelValue":e[5]||(e[5]=s=>o.permiso.crear=s),label:"Crear",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"]),a(f,{class:"q-ml-lg",modelValue:o.permiso.editar,"onUpdate:modelValue":e[6]||(e[6]=s=>o.permiso.editar=s),label:"Editar",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"]),a(f,{class:"q-ml-lg",modelValue:o.permiso.eliminar,"onUpdate:modelValue":e[7]||(e[7]=s=>o.permiso.eliminar=s),label:"Eliminar",disable:o.disabled,outlined:"",dense:""},null,8,["modelValue","disable"])])])),r("div",ze,[e[18]||(e[18]=r("label",{class:"q-mb-sm block"},"Roles",-1)),a(de,{modelValue:o.permiso.roles,"onUpdate:modelValue":e[8]||(e[8]=s=>o.permiso.roles=s),options:o.roles,"transition-show":"jump-up","transition-hide":"jump-down",disable:o.disabled,"options-dense":"",multiple:"",dense:"","use-chips":"",outlined:"",onFilter:o.filtrarRol,"use-input":"","input-debounce":"0",error:!!o.v$.roles.$errors.length,"error-message":"Debes seleccionar uno o varios roles","option-value":s=>s.id,"option-label":s=>s.name,"emit-value":"","map-options":""},{option:i(({itemProps:s,opt:v,selected:q,toggleOption:c})=>[a(z,oe(se(s)),{default:i(()=>[a(M,null,{default:i(()=>[k(Q(v.name)+" ",1),a(ne,{"inner-h-t-m-l":v.name},null,8,["inner-h-t-m-l"])]),_:2},1024),a(M,{side:""},{default:i(()=>[a(N,{"model-value":q,"onUpdate:modelValue":L=>c(v)},null,8,["model-value","onUpdate:modelValue"])]),_:2},1024)]),_:2},1040)]),error:i(()=>[(u(!0),C(E,null,U(o.v$.roles.$errors,s=>(u(),C("div",{key:s.$uid},[r("div",Ae,Q(s.$message),1)]))),128))]),"no-option":i(()=>[a(z,null,{default:i(()=>[a(M,{class:"text-grey"},{default:i(()=>e[17]||(e[17]=[k(" No hay resultados ")])),_:1})]),_:1})]),_:1},8,["modelValue","options","disable","onFilter","error","option-value","option-label"])])]),a(d,{accion:"NUEVO",permitirCancelar:!1,onGuardar:e[9]||(e[9]=s=>o.crear(o.entidad))})]),_:1})}var Te=I(we,[["render",Re]]);class Ie{constructor(){m(this,"PermisoNuevoPage");this.PermisoNuevoPage=le(new qe("Nuevo Permiso",Te))}}class _e extends Qe{constructor(){super(new Ie)}}export{_e as C,xe as M};