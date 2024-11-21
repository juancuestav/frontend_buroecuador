import{Q as io}from"./QSelect.8fa0bc61.js";import{Z as D,d as ro,a7 as ao,r as m,U as V,J as d,V as q,O as i,L as a,j as e,K as v,bj as O,F as L,X as U,bk as h,S as k,Q as g,a2 as y,M as N,N as Q}from"./index.6072a1b1.js";import{b as M,Q as C}from"./QItem.159d8e83.js";import{Q as $}from"./QScrollArea.7cd516d9.js";import{Q as to}from"./QPage.2411b3e2.js";import{S as lo}from"./StatusEssentialLoading.d6258813.js";import{a as no}from"./notificaciones.fe24470b.js";import{u as mo}from"./use-quasar.52f58024.js";import{E as uo}from"./EssentialTable.0effb8dc.js";import{M as co,C as po}from"./ComportamientoModalesPermisoNuevo.86f7aa86.js";import{C as fo}from"./ContenedorSimpleMixin.6f374d2f.js";import{T as G}from"./TransacccionSimpleController.f4dc3690.js";import{a as vo,P as go,c as bo}from"./Permiso.694b0925.js";import{U as F}from"./UsuarioController.38e978d2.js";import{u as Co}from"./filtrosGenerales.911f2280.js";import{_ as Po}from"./plugin-vue_export-helper.21dcd24c.js";import"./QChip.2863bbd0.js";import"./QMenu.6c964ac0.js";import"./position-engine.71479b28.js";import"./selection.ec88bd7c.js";import"./format.8ac60962.js";import"./QResizeObserver.cd2c994f.js";import"./QScrollObserver.e3b5a4e0.js";import"./TouchPan.e744ede7.js";import"./touch.9135741d.js";import"./QTooltip.0b1018fa.js";import"./QBadge.1ab9ad97.js";import"./utils.c7760b0c.js";import"./date.3330acff.js";import"./QToolbarTitle.80dd577d.js";import"./logo.d1d9b491.js";import"./_commonjsHelpers.8402d862.js";import"./EstadosComponent.69881137.js";import"./utils.508c826c.js";import"./QForm.7a1734b3.js";import"./i18n-validators.254d0ba5.js";import"./index.d3fb51b6.js";import"./vue-i18n.runtime.0ca83697.js";import"./index.1be77ee8.js";import"./TabLayout.6a412dfb.js";import"./QTabs.4b078992.js";import"./QTabPanels.2a304c71.js";import"./use-render-cache.3aae9b27.js";import"./buttonSubmits.178f5d81.js";import"./RolController.531a0f0a.js";import"./entidadAuditable.9f5621ba.js";import"./Hidratable.166e9fe1.js";class So extends G{constructor(){super(D.asignar_permisos_individual)}}class B extends G{constructor(){super(D.permisos_roles_usuario)}}var _o=ro({components:{EssentialTable:uo,ModalEntidad:co},setup(){no().setQuasar(mo());const s=ao(),o=m(),P=m(),u=m(),E=new vo,S=new So,c=new lo,p=m([]),r=m([]),n=m(),_=m(),R=new po,w=new fo(go,new B),{entidad:T,listadosAuxiliares:b,listado:I}=w.useReferencias(),{cargarVista:z,obtenerListados:j,listar:H}=w.useComportamiento();z(async()=>{await j({usuarios:{controller:new F,params:{campos:"id,name,apellidos,identificacion",estado:1}}})});const{usuarios:J,filtrarUsuarios:K}=Co(b);async function X(t){H({id_rol:t,tipo:"ASIGNADOS",tipo_filtro:"POR ROL"});const{result:l}=await E.listar({id_rol:t,tipo:"NO ASIGNADOS",tipo_filtro:"POR ROL"});p.value=l}function Z(){n.value.seleccionar(),n.value.clearSelection()}function W(){_.value.seleccionar(),_.value.clearSelection()}function Y(t){const l=t.map(f=>f.id);S.guardar({empleado_id:u.value,permisos:l,tipo_sincronizacion:"ASIGNAR"}),A()}function x(t){const l=t.map(f=>f.id);S.guardar({empleado_id:u.value,permisos:l,tipo_sincronizacion:"ELIMINAR"}),A()}function oo(){R.abrirModalEntidad("PermisoNuevoPage")}const so=()=>{s.replace("/roles")};async function A(){c.activar();const{result:t}=await new F().consultar(u.value);o.value=t.roles,P.value=[...t.permisos];const{response:l}=await new B().listar({empleado_id:u.value,tipo:"NO ASIGNADOS"});p.value=l.data.results,I.value=[...l.data.permisos_usuario],c.desactivar()}return{fecha:m(),mixin:w,permiso:T,modales:R,configuracionColumnasPermisos:bo,empleado:u,listado:I,permisosSinAsignar:p,crearRol:so,crear_permiso:oo,obtenerPermisoRol:X,asignarPermiso:Y,eliminarPermiso:x,botonAsignarPermisos:Z,botonEliminarPermisos:W,listadosAuxiliares:b,roles:o,permisos:P,usuarios:J,permisosAsignados:r,refPermisosSinAsignar:n,refPermisosAsignados:_,filtrarUsuarios:K,filtrarRol(t,l){if(t===""){l(()=>{o.value=b.roles});return}l(()=>{const f=t.toLowerCase();o.value=b.roles.filter(eo=>eo.nombre.toLowerCase().indexOf(f)>-1)})},filtrarRolesEmpleados:A}}});const wo={class:"row q-col-gutter-sm q-mb-md"},Ao={class:"col-12 col-md-5"},qo={class:"col-12 col-md-5 q-mb-md"},ko={key:0,class:"col-12 col-md-5 q-mb-md"},yo={class:"row"},No={key:0,class:"col-12 col-md-5"},Qo={key:0,class:"col-12 col-md-5 q-mb-md"},Eo={class:"q-py-xs"},Ro={class:"row q-col-gutter-sm q-mb-md q-mt-xs"},Io={class:"col-12 col-md-5 q-gutter-y-sm"},Vo={class:"col-md-2 column justify-center q-gutter-y-sm"},Oo={class:"col-12 col-md-5 q-mb-md"};function Lo(s,o,P,u,E,S){const c=V("essential-table"),p=V("modal-entidad");return d(),q(to,{padding:"",class:"q-pa-lg"},{default:i(()=>[a("div",wo,[a("div",Ao,[a("div",qo,[o[4]||(o[4]=a("label",{class:"q-mb-sm block"},"Seleccione un usuario",-1)),e(io,{modelValue:s.empleado,"onUpdate:modelValue":[o[0]||(o[0]=r=>s.empleado=r),s.filtrarRolesEmpleados],options:s.usuarios,"options-dense":"",dense:"",outlined:"","error-message":"Debe seleccionar un usuario","use-input":"","input-debounce":"0",onFilter:s.filtrarUsuarios,"option-value":r=>r.id,"option-label":r=>r.name+" "+r.apellidos,"emit-value":"","map-options":""},null,8,["modelValue","options","onFilter","onUpdate:modelValue","option-value","option-label"])]),s.roles?(d(),v("div",ko,[e(h,null,{default:i(()=>[e(O,null,{default:i(()=>[o[5]||(o[5]=a("div",{class:"text-h6"},"Roles",-1)),e($,{style:{height:"100px"}},{default:i(()=>[a("div",yo,[(d(!0),v(L,null,U(s.roles,(r,n)=>(d(),q(M,{dense:"",key:n},{default:i(()=>[e(C,{avatar:""},{default:i(()=>[e(g,{name:"bi-check-circle-fill",size:"xs",color:"positive"})]),_:1}),e(C,null,{default:i(()=>[N(Q(r),1)]),_:2},1024)]),_:2},1024))),128))])]),_:1})]),_:1})]),_:1})])):k("",!0)]),o[7]||(o[7]=a("div",{class:"col-12 col-md-2"},null,-1)),s.permisos?(d(),v("div",No,[s.listado?(d(),v("div",Qo,[e(h,null,{default:i(()=>[e(O,null,{default:i(()=>[o[6]||(o[6]=a("div",{class:"text-h6"}," Todos los permisos asignados (roles y directamente) ",-1)),e($,{style:{height:"164px"}},{default:i(()=>[a("div",Eo,[(d(!0),v(L,null,U(s.permisos,(r,n)=>(d(),q(M,{dense:"",key:n},{default:i(()=>[e(C,{avatar:""},{default:i(()=>[e(g,{name:"bi-check-circle-fill",size:"xs",color:"positive"},{default:i(()=>[N(" \xA0"+Q(n+1),1)]),_:2},1024)]),_:2},1024),e(C,null,{default:i(()=>[N(Q(r.name),1)]),_:2},1024)]),_:2},1024))),128))])]),_:1})]),_:1})]),_:1})])):k("",!0)])):k("",!0)]),a("div",Ro,[a("div",Io,[o[8]||(o[8]=a("div",{class:"q-mb-md"},"No Asignados",-1)),e(c,{configuracionColumnas:s.configuracionColumnasPermisos,datos:s.permisosSinAsignar,permitirConsultar:!1,permitirEditar:!1,permitirEliminar:!1,mostrarHeader:!0,mostrarFooter:!0,mostrarColumnasVisibles:!1,ref:"refPermisosSinAsignar",onSelected:s.asignarPermiso,"tipo-seleccion":"multiple"},null,8,["configuracionColumnas","datos","onSelected"])]),a("div",Vo,[e(y,{class:"full-width block",color:"positive",onClick:o[1]||(o[1]=r=>s.crear_permiso()),unelevated:"",square:""},{default:i(()=>[e(g,{name:"bi-plus"})]),_:1}),e(y,{class:"full-width block",color:"primary",onClick:o[2]||(o[2]=r=>s.botonAsignarPermisos()),unelevated:"",square:""},{default:i(()=>[e(g,{name:"bi-arrow-right"})]),_:1}),e(y,{class:"full-width block",color:"accent",onClick:o[3]||(o[3]=r=>s.botonEliminarPermisos()),unelevated:"",square:""},{default:i(()=>[e(g,{name:"bi-arrow-left"})]),_:1})]),a("div",Oo,[o[9]||(o[9]=a("div",{class:"q-mb-md"},"Asignados directamente",-1)),e(c,{configuracionColumnas:s.configuracionColumnasPermisos,mostrarColumnasVisibles:!1,datos:s.listado,permitirConsultar:!1,permitirEditar:!1,permitirEliminar:!1,ref:"refPermisosAsignados",onSelected:s.eliminarPermiso,"tipo-seleccion":"multiple"},null,8,["configuracionColumnas","datos","onSelected"])])]),e(p,{comportamiento:s.modales},null,8,["comportamiento"])]),_:1})}var Qs=Po(_o,[["render",Lo]]);export{Qs as default};