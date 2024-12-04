import{Q as G}from"./QPage.161283b6.js";import{d as q,bm as k,H as V,c as t,bn as j,V as w,K as i,X as f,P as c,j as M,bl as n,ae as N,L as O,O as L,U as b,M as s}from"./index.aea1effc.js";import{B as P}from"./buttonSubmits.08b9f7f5.js";import{_ as Q}from"./plugin-vue_export-helper.21dcd24c.js";var R=q({props:{mixin:{type:Object,required:!0},mostrarButtonSubmits:{type:Boolean,default:!0},permitirConsultar:{type:Boolean,default:!0},permitirGuardar:{type:Boolean,default:!0},permitirEditar:{type:Boolean,default:!0},permitirEliminar:{type:Boolean,default:!0},permitirCancelar:{type:Boolean,default:!0},full:{type:Boolean,default:!1},labelGuardar:{type:String,default:"Guardar"},titulo:String},components:{ButtonSubmits:P},setup(e){const{guardar:r,editar:d,eliminar:u,consultar:l,reestablecer:m}=e.mixin.useComportamiento(),{entidad:o,accion:a,filtros:C}=e.mixin.useReferencias(),B=k(),g=V(),y=t(()=>{var p;return g.can(`puede.ver.${(p=B.name)==null?void 0:p.toString()}`)&&e.permitirConsultar}),S=t(()=>e.permitirGuardar),$=t(()=>e.permitirEditar),v=t(()=>e.permitirEliminar),E=t(()=>e.permitirCancelar);return{guardar:r,reestablecer:m,entidad:o,accion:a,filtros:C,consultar:l,editar:d,eliminar:u,puedeVer:y,puedeCrear:S,puedeEditar:$,puedeEliminar:v,puedeCancelar:E,storeCargando:j()}}});const U={key:0,class:"text-h6 q-mb-md"},A={class:"bg-desenfoque border-white rounded q-pa-md"},D={class:"row justify-end q-col-gutter-x-xs q-pt-md"};function F(e,r,d,u,l,m){const o=w("button-submits");return i(),f(G,{padding:""},{default:c(()=>[M(N,{name:"scale",mode:"out-in"},{default:c(()=>[n(e.$slots,"modales")]),_:3}),e.titulo?(i(),O("div",U,L(e.titulo),1)):b("",!0),s("div",A,[n(e.$slots,"formulario")]),s("div",D,[s("span",null,[n(e.$slots,"custom-buttons")]),e.mostrarButtonSubmits?(i(),f(o,{key:0,accion:e.accion,permitirGuardar:e.puedeCrear,permitirModificar:e.puedeEditar,permitirCancelar:e.puedeCancelar,disabled:e.storeCargando.cargando,labelGuardar:e.labelGuardar,onCancelar:r[0]||(r[0]=a=>e.reestablecer()),onEditar:r[1]||(r[1]=a=>e.editar(e.entidad,e.resetFormularioOnUpdate)),onEliminar:r[2]||(r[2]=a=>e.eliminar(e.entidad,e.cbEliminar)),onGuardar:r[3]||(r[3]=a=>e.guardar(e.entidad))},null,8,["accion","permitirGuardar","permitirModificar","permitirCancelar","disabled","labelGuardar"])):b("",!0)])]),_:3})}var h=Q(R,[["render",F]]);export{h as S};