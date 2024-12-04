import{u as V,R as N}from"./ReportePDF.b2846969.js";import{u as Q,E as D,F as M}from"./FormularioReporte.bc27d6ce.js";import{r as v,d as F,$ as O,a2 as T,o as A,_ as S,V as w,K as h,X as $,P as q,M as l,j as f,af as K,R as y,a5 as j,Q as H,N as z,c as B,ai as J}from"./index.aea1effc.js";import{Q as X}from"./QPage.161283b6.js";import{c as G}from"./configuracionColumnasUsuarios.a44152fe.js";import{c as W,I as Y}from"./ItemMiReporte.3c23dbd3.js";import{E as Z}from"./EssentialTable.a2272a35.js";import{u as x}from"./notificaciones.305263b9.js";import{_ as ee}from"./plugin-vue_export-helper.21dcd24c.js";import"./ReportePreview.acadff26.js";import"./ContadorComponent.a40a70d1.js";import"./QKnob.1ac44851.js";import"./QCircularProgress.5ddea41f.js";import"./format.8ac60962.js";import"./TouchPan.bfca0f21.js";import"./touch.9135741d.js";import"./selection.a0a4309d.js";import"./logo.d1d9b491.js";import"./utils.27a4761f.js";import"./date.0b7cec79.js";import"./entidadAuditable.9f5621ba.js";import"./Hidratable.166e9fe1.js";import"./QSelect.2477ae10.js";import"./QChip.f8291af0.js";import"./QItem.287f8ef9.js";import"./QMenu.ef20bc9f.js";import"./position-engine.c19cb930.js";import"./QExpansionItem.b3f19768.js";import"./use-render-cache.3aae9b27.js";import"./QForm.5ecf612c.js";import"./QTooltip.d74f897f.js";import"./TransacccionSimpleController.d6ace83b.js";import"./QBadge.66caf36c.js";import"./QToolbarTitle.2f0d394a.js";import"./_commonjsHelpers.80d8c10d.js";import"./EstadosComponent.4d132387.js";import"./utils.508c826c.js";function oe(o,e){const t=v(),n=v([]),s=v(),c={refListadoSeleccionable:t,listadoSeleccionable:n,endpoint:e,limpiar:()=>{o.id=null,o.nombres=null,o.identificacion=null,s.value=null},seleccionar:i=>{var R;o.id=i.id,o.nombres=i.name+" "+((R=i.apellidos)!=null?R:""),s.value=i.identificacion,o.identificacion=i.identificacion}},r=Q(c);return{refListadoSeleccionableUsuario:t,listadoUsuarios:n,listarUsuarios:()=>r.listar(s.value),limpiarUsuario:()=>c.limpiar(),seleccionarUsuario:i=>r.seleccionar(i),criterioBusquedaUsuario:s}}var re=F({components:{EssentialTable:Z,EssentialSelectableTable:D},setup(){const o=v([]),e=O({id:null,nombres:null,identificacion:null}),t=T.getInstance(),{notificarAdvertencia:n,notificarCorrecto:s,confirmar:c}=x(),r=V();async function b(){const u="?usuario="+e.id,p=t.getEndpoint(S.reportes)+u,m=(await t.get(p)).data.results;m.length===0&&n("El usuario seleccionado no tiene reportes asignados");const E=[];for(let d=0;d<m.length;d++){const g=new Y;g.id=m[d].id,g.nombre="REPORTE "+m[d].cliente+"-"+m[d].id,g.fecha=m[d].fecha,E.push(g)}o.value=[...E],r.setReportesConsultados(E)}const{refListadoSeleccionableUsuario:a,criterioBusquedaUsuario:C,listadoUsuarios:i,listarUsuarios:R,limpiarUsuario:I,seleccionarUsuario:L}=oe(e,"usuarios");async function P({entidad:u}){try{const p=await t.get(t.getEndpoint(S.reportes)+"/"+u.id);r.reporte=JSON.parse(p.data.reporte.reporte),r.mostrarEditarReporteConsultar(),r.cliente=e,r.idReporteActual=u.id}catch{console.log("error")}}function k({entidad:u,posicion:p}){c("\xBFDesea continuar?",async()=>{try{const U=await t.delete(t.getEndpoint(S.reportes)+"/"+u.id);s(U.data.mensaje),o.value.splice(p,1)}catch{}})}return A(()=>{o.value=r.reportesConsultados,r.cliente&&(e.id=r.cliente.id,e.nombres=r.cliente.nombres,C.value=r.cliente.identificacion)}),{configuracionColumnasUsuarios:G,configuracionColumnasMiReporte:W,listado:o,cliente:e,obtenerListado:b,editarReporte:P,eliminarReporte:k,refListadoSeleccionableUsuario:a,criterioBusquedaUsuario:C,listadoUsuarios:i,listarUsuarios:R,limpiarUsuario:I,seleccionarUsuario:L}}});const te={class:"row q-col-gutter-sm q-mb-xl"},ie={class:"col-12 col-md-3"},se={class:"col-12 col-md-9"},ae={class:"row"},ne={class:"col-12"};function le(o,e,t,n,s,c){const r=w("essential-table"),b=w("essential-selectable-table");return h(),$(X,{padding:""},{default:q(()=>[l("div",te,[l("div",ie,[e[4]||(e[4]=l("label",{class:"block q-mb-sm"},"Identificaci\xF3n del cliente",-1)),f(y,{modelValue:o.criterioBusquedaUsuario,"onUpdate:modelValue":e[0]||(e[0]=a=>o.criterioBusquedaUsuario=a),placeholder:"Obligatorio",hint:"Ingrese identificaci\xF3n del cliente y luego presione la tecla Enter",onKeydown:e[1]||(e[1]=K(a=>o.listarUsuarios(),["enter"])),outlined:"",dense:""},null,8,["modelValue"])]),l("div",se,[e[6]||(e[6]=l("label",{class:"block q-mb-sm"},"Cliente seleccionado",-1)),f(y,{modelValue:o.cliente.nombres,"onUpdate:modelValue":e[3]||(e[3]=a=>o.cliente.nombres=a),outlined:"",dense:"",disable:""},{after:q(()=>[f(j,{color:"primary",onClick:e[2]||(e[2]=a=>o.obtenerListado()),class:"block full-width","no-caps":"",push:""},{default:q(()=>[f(H,{name:"bi-search",class:"q-mr-md",size:"xs"}),e[5]||(e[5]=z(" Listar reportes "))]),_:1})]),_:1},8,["modelValue"])])]),l("div",ae,[l("div",ne,[f(r,{configuracionColumnas:o.configuracionColumnasMiReporte,datos:o.listado,mostrarBotones:!1,mostrarHeader:!1,mostrarFooter:!1,permitirConsultar:!1,onEditar:o.editarReporte,onEliminar:o.eliminarReporte},null,8,["configuracionColumnas","datos","onEditar","onEliminar"])])]),f(b,{ref:"refListadoSeleccionableUsuario","configuracion-columnas":o.configuracionColumnasUsuarios,datos:o.listadoUsuarios,onSelected:o.seleccionarUsuario},null,8,["configuracion-columnas","datos","onSelected"])]),_:1})}var _=ee(re,[["render",le]]);const ze=F({__name:"ConsultarReportePage",setup(o){const e=V();e.resetReporte();const t=B(()=>{switch(e.formularioConsultarReporte){case"FormularioReporte":return M;case"ConsultarReporte":return _;case"ReportePDF":return N;default:return _}}),n=B(()=>["FormularioReporte","ReportePDF"].includes(e.formularioConsultarReporte));return(s,c)=>(h(),$(J(t.value),{"permitir-editar":n.value},null,8,["permitir-editar"]))}});export{ze as default};