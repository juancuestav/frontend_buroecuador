var _=Object.defineProperty;var y=(o,e,t)=>e in o?_(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var m=(o,e,t)=>(y(o,typeof e!="symbol"?e+"":e,t),t);import{d as h,a3 as $,V,K as i,X as f,P as r,j as a,M as n,R as k,L as d,Y as b,F as g,bk as R,bj as w,U as N,a4 as S,O as p,Q as x,N as q}from"./index.aea1effc.js";import{b as L,Q as v}from"./QItem.287f8ef9.js";import{Q as B}from"./QScrollArea.f0a0ff79.js";import{Q as E}from"./QForm.5ecf612c.js";import{a as I}from"./notificaciones.305263b9.js";import{u as M}from"./index.9737fa5c.js";import{T as F}from"./TabLayout.7cfb4972.js";import{C as T}from"./ContenedorSimpleMixin.9e6b94a2.js";import{R as j}from"./RolController.4a5cdc75.js";import{E as z}from"./entidadAuditable.9f5621ba.js";import{_ as A}from"./plugin-vue_export-helper.21dcd24c.js";import"./QResizeObserver.5837b731.js";import"./QScrollObserver.d3c4e618.js";import"./TouchPan.bfca0f21.js";import"./touch.9135741d.js";import"./selection.a0a4309d.js";import"./format.8ac60962.js";import"./QTabs.18a819ba.js";import"./QSelect.2477ae10.js";import"./QChip.f8291af0.js";import"./QMenu.ef20bc9f.js";import"./position-engine.c19cb930.js";import"./QTabPanels.10a35ad8.js";import"./use-render-cache.3aae9b27.js";import"./QPage.161283b6.js";import"./buttonSubmits.08b9f7f5.js";import"./EssentialTable.a2272a35.js";import"./QTooltip.d74f897f.js";import"./QBadge.66caf36c.js";import"./utils.27a4761f.js";import"./date.0b7cec79.js";import"./QToolbarTitle.2f0d394a.js";import"./logo.d1d9b491.js";import"./_commonjsHelpers.80d8c10d.js";import"./EstadosComponent.4d132387.js";import"./utils.508c826c.js";import"./TransacccionSimpleController.d6ace83b.js";import"./Hidratable.166e9fe1.js";const O=[{name:"name",field:"name",label:"Nombre",align:"left",sortable:!0}];class P extends z{constructor(){super();m(this,"nombre");m(this,"name");m(this,"empleados");this.nombre=null,this.name=null,this.empleados=null}}var U=h({components:{TabLayout:F},setup(){I().setQuasar($());const o=new T(P,new j),{entidad:e,disabled:t,accion:u}=o.useReferencias(),{setValidador:c}=o.useComportamiento(),l=M({name:{required:!0,minLength:3,maxLength:50}},e);return c(l.value),{mixin:o,rol:e,disabled:t,accion:u,v$:l,configuracionColumnas:O}}});const D={class:"row q-col-gutter-sm q-py-md"},K={class:"col-12"},X={class:"error-msg"},Y={key:0,class:"col-12 col-md-12 q-mb-md"},G={class:"row"};function H(o,e,t,u,c,C){const l=V("tab-layout");return i(),f(l,{mixin:o.mixin,configuracionColumnas:o.configuracionColumnas,"titulo-pagina":"Motivos"},{formulario:r(()=>[a(E,{onSubmit:e[1]||(e[1]=S(()=>{},["prevent"]))},{default:r(()=>[n("div",D,[n("div",K,[e[2]||(e[2]=n("label",{class:"q-mb-sm block"},"Rol",-1)),a(k,{modelValue:o.rol.name,"onUpdate:modelValue":e[0]||(e[0]=s=>o.rol.name=s),placeholder:"Obligatorio",readonly:o.disabled,error:!!o.v$.name.$errors.length,outlined:"",dense:""},{error:r(()=>[(i(!0),d(g,null,b(o.v$.name.$errors,s=>(i(),d("div",{key:s.$uid},[n("div",X,p(s.$message),1)]))),128))]),_:1},8,["modelValue","readonly","error"])]),o.rol.empleados?(i(),d("div",Y,[a(R,null,{default:r(()=>[a(w,null,{default:r(()=>[e[3]||(e[3]=n("div",{style:{"font-size":"19px","font-weight":"500"}},"Empleados con el rol asignado",-1)),a(B,{style:{height:"200px"}},{default:r(()=>[n("div",G,[(i(!0),d(g,null,b(o.rol.empleados,(s,Q)=>(i(),f(L,{dense:"",key:Q},{default:r(()=>[a(v,{avatar:""},{default:r(()=>[a(x,{name:"bi-check-circle-fill",size:"xs",color:"positive"})]),_:1}),a(v,null,{default:r(()=>[q(p(s.nombres)+" "+p(s.apellidos),1)]),_:2},1024)]),_:2},1024))),128))])]),_:1})]),_:1})]),_:1})])):N("",!0)])]),_:1})]),_:1},8,["mixin","configuracionColumnas"])}var Fo=A(U,[["render",H]]);export{Fo as default};