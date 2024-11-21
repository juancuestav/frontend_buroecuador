import{Q as y,a as I}from"./QTabs.4b078992.js";import{Q as C,a as J}from"./QTabPanels.2a304c71.js";import{Q as M}from"./QPage.2411b3e2.js";import{d as Y,a7 as D,r as K,a9 as W,c,$ as E,U as S,J as s,V as d,O as i,j as t,bl as g,ab as X,Y as l,S as m,L as V}from"./index.6072a1b1.js";import{B as Z}from"./buttonSubmits.178f5d81.js";import{E as h}from"./EssentialTable.0effb8dc.js";import{u as x}from"./StatusEssentialLoading.d6258813.js";import{_}from"./plugin-vue_export-helper.21dcd24c.js";var aa=Y({props:{mixin:{type:Object,required:!0},mostrarButtonSubmits:{type:Boolean,default:!0},configuracionColumnas:{type:Object,required:!1},tituloPagina:{type:String},subtituloPagina:{type:String,default:"SISTEMA"},mostrarFormulario:{type:Boolean,default:!0},mostrarListado:{type:Boolean,default:!0},mostrarCustomListado:{type:Boolean,default:!1},permitirGuardar:{type:Boolean,default:!0},permitirConsultar:{type:Boolean,default:!0},permitirEditar:{type:Boolean,default:!0},permitirEliminar:{type:Boolean,default:!0},puedeFiltrar:{type:Boolean,default:!1},puedeExportar:{type:Boolean,default:!0},mostrarAcciones:{type:Boolean,default:!0},accion1:{type:Object,required:!1},accion2:{type:Object,required:!1},accion3:{type:Object,required:!1},accion4:{type:Object,required:!1},accion5:{type:Object,required:!1},accion6:{type:Object,required:!1},accion7:{type:Object,required:!1},accion8:{type:Object,required:!1},accion9:{type:Object,required:!1},accion10:{type:Object,required:!1},accion1Header:{type:Object,required:!1},accion2Header:{type:Object,required:!1},accion3Header:{type:Object,required:!1},accion4Header:{type:Object,required:!1},full:{type:Boolean,default:!1},labelGuardar:{type:String,default:"Guardar"},listar:{type:Boolean,default:!0},ajustarCeldas:{type:Boolean,default:!1}},components:{EssentialTable:h,ButtonSubmits:Z},setup(a){var H,$,L;const{listar:e,filtrar:j,guardar:q,editar:v,eliminar:B,consultar:n,reestablecer:p}=a.mixin.useComportamiento(),{entidad:r,listado:F,accion:u,filtros:G,tabs:O}=a.mixin.useReferencias(),Q=D();let T=!1,f=(H=a.configuracionColumnas)!=null?H:[];a.mostrarAcciones&&(f=[...f,{name:"acciones",field:"acciones",label:"Acciones",align:"center",style:"width:200px"}]),!T&&a.mostrarListado&&a.listar&&(e(),T=!0);const w=K();W(()=>{O.value=a.mostrarFormulario?"formulario":"listado"});const b=(L=($=Q.currentRoute.value.name)==null?void 0:$.toString().replaceAll("_"," "))!=null?L:"",k=b.toLowerCase().substring(0,1).toUpperCase()+b.toLowerCase().substring(1,b.length),A={consultar:({entidad:o})=>{u.value=E.consultar,n(o)},editar:({entidad:o})=>{u.value=E.editar,n(o)},eliminar:({entidad:o})=>{u.value=E.eliminar,n(o)}},P=c(()=>a.permitirConsultar),U=c(()=>a.permitirGuardar),R=c(()=>a.permitirEditar),N=c(()=>a.permitirEliminar);function z(o){a.mostrarListado&&j(o)}return{filtrarTodos:z,tabs:O,tituloTabla:k,guardar:q,reestablecer:p,entidad:r,listado:F,accion:u,filtros:G,accionTabla:A,seleccionado:w,columnas:f,consultar:n,editar:v,eliminar:B,puedeVer:P,puedeCrear:U,puedeEditar:R,puedeEliminar:N,storeCargando:x()}}});const ea={class:"row justify-end q-col-gutter-x-xs q-pt-xl"};function ra(a,e,j,q,v,B){const n=S("button-submits"),p=S("essential-table");return s(),d(M,{padding:!a.$q.screen.xs},{default:i(()=>[t(X,{name:"scale",mode:"out-in"},{default:i(()=>[g(a.$slots,"modales")]),_:3}),t(I,{modelValue:a.tabs,"onUpdate:modelValue":e[0]||(e[0]=r=>a.tabs=r),align:"left","switch-indicator":"","active-class":"tab-active","indicator-color":"transparent",dense:""},{default:i(()=>[a.mostrarFormulario?(s(),d(y,{key:0,name:"formulario",label:"Formulario",class:l({"tab-inactive":a.tabs!=="formulario"}),"no-caps":""},null,8,["class"])):m("",!0),a.mostrarListado?(s(),d(y,{key:1,name:"listado",label:"Listado",class:l({"tab-inactive":a.tabs!=="listado"}),"no-caps":""},null,8,["class"])):m("",!0),a.mostrarCustomListado?(s(),d(y,{key:2,name:"custom-listado",label:"Listado",class:l({"tab-inactive":a.tabs!=="custom-listado"}),"no-caps":""},null,8,["class"])):m("",!0)]),_:1},8,["modelValue"]),t(J,{modelValue:a.tabs,"onUpdate:modelValue":e[5]||(e[5]=r=>a.tabs=r),animated:"","transition-prev":"scale","transition-next":"scale",helpalive:"",class:l({"rounded-tabpanel":!a.$q.screen.xs})},{default:i(()=>[t(C,{name:"formulario",class:l([{"q-pa-none":a.full},"z-index-10-menos"])},{default:i(()=>[g(a.$slots,"formulario"),V("div",{class:l({"q-pa-md":a.full})},[V("div",ea,[a.mostrarButtonSubmits?(s(),d(n,{key:0,accion:a.accion,permitirGuardar:a.puedeCrear,disabled:a.storeCargando.cargando,labelGuardar:a.labelGuardar,onCancelar:e[1]||(e[1]=r=>a.reestablecer()),onEditar:e[2]||(e[2]=r=>a.editar(a.entidad,a.resetFormularioOnUpdate)),onEliminar:e[3]||(e[3]=r=>a.eliminar(a.entidad,a.cbEliminar)),onGuardar:e[4]||(e[4]=r=>a.guardar(a.entidad))},null,8,["accion","permitirGuardar","disabled","labelGuardar"])):m("",!0)])],2)]),_:3},8,["class"]),t(C,{name:"listado",class:"borde"},{default:i(()=>[t(p,{titulo:a.tituloTabla,configuracionColumnas:a.columnas,datos:a.listado,permitirConsultar:a.puedeVer,permitirEditar:a.puedeEditar,permitirEliminar:a.puedeEliminar,accion1:a.accion1,accion2:a.accion2,accion3:a.accion3,accion4:a.accion4,accion5:a.accion5,accion6:a.accion6,accion7:a.accion7,accion8:a.accion8,accion9:a.accion9,accion10:a.accion10,accion1Header:a.accion1Header,accion2Header:a.accion2Header,accion3Header:a.accion3Header,accion4Header:a.accion4Header,permitirFiltrar:a.puedeFiltrar,mostrarExportar:a.puedeExportar,ajustarCeldas:a.ajustarCeldas,onConsultar:a.accionTabla.consultar,onEditar:a.accionTabla.editar,onEliminar:a.accionTabla.eliminar,onFiltrar:a.filtrarTodos},null,8,["titulo","configuracionColumnas","datos","permitirConsultar","permitirEditar","permitirEliminar","accion1","accion2","accion3","accion4","accion5","accion6","accion7","accion8","accion9","accion10","accion1Header","accion2Header","accion3Header","accion4Header","permitirFiltrar","mostrarExportar","ajustarCeldas","onConsultar","onEditar","onEliminar","onFiltrar"])]),_:1}),t(C,{name:"custom-listado"},{default:i(()=>[g(a.$slots,"custom-listado")]),_:3})]),_:3},8,["modelValue","class"])]),_:3},8,["padding"])}var ca=_(aa,[["render",ra]]);export{ca as T};
