import{d as q,r as y,V as C,K as l,X as w,P as d,j as a,M as s,R as n,L as r,Y as m,F as t,Q as V,C as U,aQ as O,a4 as I,O as u}from"./index.aea1effc.js";import{Q as k}from"./QSelect.2477ae10.js";import{Q as P}from"./QForm.5ecf612c.js";import{c as N}from"./configuracionColumnasUsuarios.a44152fe.js";import{r as p}from"./index.cab36ed2.js";import{u as R}from"./index.9737fa5c.js";import{T as A}from"./TabLayout.7cfb4972.js";import{C as Q}from"./ContenedorSimpleMixin.9e6b94a2.js";import{U as L}from"./UsuarioController.e4f3ede8.js";import{U as M}from"./Usuario.f0ee9d5d.js";import{T as S,R as T}from"./RolController.a7d6e522.js";import{_ as D}from"./plugin-vue_export-helper.21dcd24c.js";import"./QChip.f8291af0.js";import"./QItem.287f8ef9.js";import"./QMenu.ef20bc9f.js";import"./position-engine.c19cb930.js";import"./selection.a0a4309d.js";import"./format.8ac60962.js";import"./QTabs.18a819ba.js";import"./QResizeObserver.5837b731.js";import"./QTabPanels.10a35ad8.js";import"./touch.9135741d.js";import"./use-render-cache.3aae9b27.js";import"./QPage.161283b6.js";import"./buttonSubmits.08b9f7f5.js";import"./EssentialTable.a2272a35.js";import"./QTooltip.d74f897f.js";import"./QBadge.66caf36c.js";import"./utils.27a4761f.js";import"./date.0b7cec79.js";import"./QToolbarTitle.2f0d394a.js";import"./logo.d1d9b491.js";import"./_commonjsHelpers.80d8c10d.js";import"./EstadosComponent.4d132387.js";import"./utils.508c826c.js";import"./notificaciones.305263b9.js";import"./TransacccionSimpleController.d6ace83b.js";import"./entidadAuditable.9f5621ba.js";import"./Hidratable.166e9fe1.js";var E=q({components:{TabLayout:A},setup(){const o=new Q(M,new L),{entidad:i,disabled:v,listadosAuxiliares:$,accion:f}=o.useReferencias(),{setValidador:g,obtenerListados:b,cargarVista:e}=o.useComportamiento(),c=R({name:{required:p},apellidos:{required:p},edad:{required:p},direccion:{required:p},celular:{required:p},email:{required:p},identificacion:{required:p},tipo_identificacion:{required:p},rol:{required:p}},i);return g(c.value),e(async()=>{await b({tiposIdentificaciones:new S,roles:new T})}),{mixin:o,usuario:i,accion:f,v$:c,disabled:v,configuracionColumnas:N,listadosAuxiliares:$,isPwd:y(!0)}}});const F={class:"row q-col-gutter-sm q-py-md"},B={class:"col-12 col-md-3 q-mb-md"},j={class:"error-msg"},K={class:"col-12 col-md-3 q-mb-md"},X={class:"error-msg"},Y={class:"col-12 col-md-3 q-mb-md"},z={class:"error-msg"},G={class:"col-12 col-md-3 q-mb-md"},H={class:"error-msg"},J={class:"col-12 col-md-3 q-mb-md"},W={class:"error-msg"},Z={class:"col-12 col-md-3 q-mb-md"},h={class:"error-msg"},_={class:"col-12 col-md-3 q-mb-md"},x={class:"error-msg"},oo={class:"col-12 col-md-3 q-mb-md"},eo={class:"error-msg"},io={class:"col-12 col-md-3 q-mb-md"},so={key:0,class:"q-mb-sm block"},lo={key:1,class:"q-mb-sm block"},ro={class:"col-12 col-md-3 q-mb-md"},ao={key:0,class:"q-mb-sm block"},no={key:1,class:"q-mb-sm block"},mo={class:"col-12 col-md-3 q-mb-md"},to={class:"error-msg"},uo={class:"col-12 col-md-3 q-mb-md"},po={class:"col-12 col-md-3 q-mb-md"};function bo(o,i,v,$,f,g){const b=C("tab-layout");return l(),w(b,{mixin:o.mixin,configuracionColumnas:o.configuracionColumnas,"titulo-pagina":"Usuarios"},{formulario:d(()=>[a(P,{onSubmit:i[19]||(i[19]=I(()=>{},["prevent"]))},{default:d(()=>[s("div",F,[s("div",B,[i[20]||(i[20]=s("label",{class:"q-mb-sm block"},"Nombre",-1)),a(n,{modelValue:o.usuario.name,"onUpdate:modelValue":[i[0]||(i[0]=e=>o.usuario.name=e),i[1]||(i[1]=e=>o.usuario.name=e.toUpperCase())],placeholder:"Obligatorio",disable:o.disabled,error:!!o.v$.name.$errors.length,outlined:"",dense:""},{error:d(()=>[(l(!0),r(t,null,m(o.v$.name.$errors,e=>(l(),r("div",{key:e.$uid},[s("div",j,u(e.$message),1)]))),128))]),_:1},8,["modelValue","disable","error"])]),s("div",K,[i[21]||(i[21]=s("label",{class:"q-mb-sm block"},"Apellidos",-1)),a(n,{modelValue:o.usuario.apellidos,"onUpdate:modelValue":[i[2]||(i[2]=e=>o.usuario.apellidos=e),i[3]||(i[3]=e=>o.usuario.apellidos=e.toUpperCase())],placeholder:"Obligatorio",disable:o.disabled,error:!!o.v$.apellidos.$errors.length,outlined:"",dense:""},{error:d(()=>[(l(!0),r(t,null,m(o.v$.apellidos.$errors,e=>(l(),r("div",{key:e.$uid},[s("div",X,u(e.$message),1)]))),128))]),_:1},8,["modelValue","disable","error"])]),s("div",Y,[i[22]||(i[22]=s("label",{class:"q-mb-sm block"},"Edad",-1)),a(n,{modelValue:o.usuario.edad,"onUpdate:modelValue":[i[4]||(i[4]=e=>o.usuario.edad=e),i[5]||(i[5]=e=>o.usuario.edad=e.toUpperCase())],placeholder:"Obligatorio",disable:o.disabled,error:!!o.v$.edad.$errors.length,outlined:"",dense:""},{error:d(()=>[(l(!0),r(t,null,m(o.v$.edad.$errors,e=>(l(),r("div",{key:e.$uid},[s("div",z,u(e.$message),1)]))),128))]),_:1},8,["modelValue","disable","error"])]),s("div",G,[i[23]||(i[23]=s("label",{class:"q-mb-sm block"},"Direcci\xF3n",-1)),a(n,{modelValue:o.usuario.direccion,"onUpdate:modelValue":[i[6]||(i[6]=e=>o.usuario.direccion=e),i[7]||(i[7]=e=>o.usuario.direccion=e.toUpperCase())],placeholder:"Obligatorio",disable:o.disabled,error:!!o.v$.direccion.$errors.length,outlined:"",dense:""},{error:d(()=>[(l(!0),r(t,null,m(o.v$.direccion.$errors,e=>(l(),r("div",{key:e.$uid},[s("div",H,u(e.$message),1)]))),128))]),_:1},8,["modelValue","disable","error"])]),s("div",J,[i[24]||(i[24]=s("label",{class:"q-mb-sm block"},"Celular",-1)),a(n,{modelValue:o.usuario.celular,"onUpdate:modelValue":i[8]||(i[8]=e=>o.usuario.celular=e),placeholder:"Obligatorio",disable:o.disabled,error:!!o.v$.celular.$errors.length,outlined:"",dense:""},{error:d(()=>[(l(!0),r(t,null,m(o.v$.celular.$errors,e=>(l(),r("div",{key:e.$uid},[s("div",W,u(e.$message),1)]))),128))]),_:1},8,["modelValue","disable","error"])]),s("div",Z,[i[25]||(i[25]=s("label",{class:"q-mb-sm block"},"Correo",-1)),a(n,{modelValue:o.usuario.email,"onUpdate:modelValue":i[9]||(i[9]=e=>o.usuario.email=e),placeholder:"Obligatorio",type:"email",disable:o.disabled,error:!!o.v$.email.$errors.length,outlined:"",dense:""},{error:d(()=>[(l(!0),r(t,null,m(o.v$.email.$errors,e=>(l(),r("div",{key:e.$uid},[s("div",h,u(e.$message),1)]))),128))]),_:1},8,["modelValue","disable","error"])]),s("div",_,[i[26]||(i[26]=s("label",{class:"q-mb-sm block"},"Tipo de identificaci\xF3n",-1)),a(k,{modelValue:o.usuario.tipo_identificacion,"onUpdate:modelValue":i[10]||(i[10]=e=>o.usuario.tipo_identificacion=e),options:o.listadosAuxiliares.tiposIdentificaciones,error:!!o.v$.tipo_identificacion.$errors.length,disable:o.disabled,"transition-show":"flip-up","transition-hide":"flip-down","option-label":e=>e.descripcion,"option-value":e=>e.id,"options-dense":"","emit-value":"","map-options":"",dense:"",outlined:""},{error:d(()=>[(l(!0),r(t,null,m(o.v$.tipo_identificacion.$errors,e=>(l(),r("div",{key:e.$uid},[s("div",x,u(e.$message),1)]))),128))]),_:1},8,["modelValue","options","error","disable","option-label","option-value"])]),s("div",oo,[i[27]||(i[27]=s("label",{class:"q-mb-sm block"},"Identificaci\xF3n",-1)),a(n,{modelValue:o.usuario.identificacion,"onUpdate:modelValue":i[11]||(i[11]=e=>o.usuario.identificacion=e),placeholder:"Obligatorio",disable:o.disabled,error:!!o.v$.identificacion.$errors.length,outlined:"",dense:""},{error:d(()=>[(l(!0),r(t,null,m(o.v$.identificacion.$errors,e=>(l(),r("div",{key:e.$uid},[s("div",eo,u(e.$message),1)]))),128))]),_:1},8,["modelValue","disable","error"])]),s("div",io,[o.accion==="MODIFICAR"?(l(),r("label",so,"Nueva contrase\xF1a")):(l(),r("label",lo,"Contrase\xF1a")),a(n,{modelValue:o.usuario.password,"onUpdate:modelValue":i[13]||(i[13]=e=>o.usuario.password=e),placeholder:o.accion==="NUEVO"?"Obligatorio":"Opcional",disable:o.disabled,outlined:"",dense:"",type:o.isPwd?"password":"text",autocomplete:"off"},{append:d(()=>[a(V,{name:o.isPwd?"visibility_off":"visibility",class:"cursor-pointer",onClick:i[12]||(i[12]=e=>o.isPwd=!o.isPwd)},null,8,["name"])]),_:1},8,["modelValue","placeholder","disable","type"])]),U(s("div",ro,[o.accion==="MODIFICAR"?(l(),r("label",ao,"Nueva contrase\xF1a")):(l(),r("label",no,"Confirmar contrase\xF1a")),a(n,{modelValue:o.usuario.password_confirmation,"onUpdate:modelValue":i[15]||(i[15]=e=>o.usuario.password_confirmation=e),placeholder:o.accion==="NUEVO"?"Obligatorio":"Opcional",disable:o.disabled,outlined:"",dense:"",type:o.isPwd?"password":"text"},{append:d(()=>[a(V,{name:o.isPwd?"visibility_off":"visibility",class:"cursor-pointer",onClick:i[14]||(i[14]=e=>o.isPwd=!o.isPwd)},null,8,["name"])]),_:1},8,["modelValue","placeholder","disable","type"])],512),[[O,o.accion!=="ELIMINAR"||o.accion!=="CONSULTAR"]]),s("div",mo,[i[28]||(i[28]=s("label",{class:"q-mb-sm block"},"Rol",-1)),a(k,{modelValue:o.usuario.rol,"onUpdate:modelValue":i[16]||(i[16]=e=>o.usuario.rol=e),options:o.listadosAuxiliares.roles,error:!!o.v$.rol.$errors.length,disable:o.disabled,"transition-show":"flip-up","transition-hide":"flip-down","option-label":e=>e.name,"option-value":e=>e.id,"options-dense":"","emit-value":"","map-options":"",dense:"",multiple:"","use-chips":"",outlined:""},{error:d(()=>[(l(!0),r(t,null,m(o.v$.rol.$errors,e=>(l(),r("div",{key:e.$uid},[s("div",to,u(e.$message),1)]))),128))]),_:1},8,["modelValue","options","error","disable","option-label","option-value"])]),s("div",uo,[i[29]||(i[29]=s("label",{class:"q-mb-sm block"},"C\xF3digo verificaci\xF3n",-1)),a(n,{modelValue:o.usuario.codigo_verificacion,"onUpdate:modelValue":i[17]||(i[17]=e=>o.usuario.codigo_verificacion=e),readonly:"",outlined:"",dense:""},null,8,["modelValue"])]),s("div",po,[i[30]||(i[30]=s("label",{class:"q-mb-sm block"},"C\xF3digo reclutador",-1)),a(n,{modelValue:o.usuario.codigo_reclutador,"onUpdate:modelValue":i[18]||(i[18]=e=>o.usuario.codigo_reclutador=e),readonly:"",outlined:"",dense:""},null,8,["modelValue"])])])]),_:1})]),_:1},8,["mixin","configuracionColumnas"])}var oe=D(E,[["render",bo]]);export{oe as default};
