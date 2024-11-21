var h=Object.defineProperty;var k=(o,e,u)=>e in o?h(o,e,{enumerable:!0,configurable:!0,writable:!0,value:u}):o[e]=u;var d=(o,e,u)=>(k(o,typeof e!="symbol"?e+"":e,u),u);import{Q as l}from"./QKnob.eae7adbe.js";import{Q as w}from"./QPage.2411b3e2.js";import{Z as x,d as q,G as P,_ as V,J as n,V as z,O as r,L as s,N as a,K as v,j as t,M as i,S as y}from"./index.6072a1b1.js";import{T as N}from"./TransacccionSimpleController.f4dc3690.js";import{H as D}from"./Hidratable.166e9fe1.js";import{d as M}from"./date.3330acff.js";import{_ as U}from"./plugin-vue_export-helper.21dcd24c.js";import"./QCircularProgress.dce56917.js";import"./format.8ac60962.js";import"./TouchPan.e744ede7.js";import"./touch.9135741d.js";import"./selection.ec88bd7c.js";class T extends N{constructor(){super(x.tablero)}}class A extends D{constructor(){super();d(this,"usuariosVerificados");d(this,"usuariosNoVerificados");d(this,"usuariosConectados");d(this,"usuariosConectadosDia");d(this,"usuariosConectadosMes");d(this,"usuarioConPlanesPagados");d(this,"usuarioConPlanesNoPagados");d(this,"serviciosActivos");d(this,"planesActivos");d(this,"pedidos");d(this,"reportes");d(this,"clicks_payphone");this.usuariosVerificados=0,this.usuariosNoVerificados=0,this.usuariosConectados=0,this.usuariosConectadosDia=0,this.usuariosConectadosMes=0,this.usuarioConPlanesPagados=0,this.usuarioConPlanesNoPagados=0,this.serviciosActivos=0,this.planesActivos=0,this.pedidos=0,this.reportes=0,this.clicks_payphone=0}}const B=q({name:"tablero_principal",setup(){const o=P(),e=new T,u=V(new A),c=20,m=Date.now(),p=M.formatDate(m,"dddd, DD MMMM YYYY");async function b(){const{response:C}=await e.listar();u.hydrate(C.data.modelo)}const f=!0,g=!1;return b(),{tablero:u,store:o,usuarios:c,fecha:p,mostrarTrabajosEcuador:g,mostrarBuroCreditoEcuadorEcuador:f}}}),E={class:"bg-solid rounded-card border-white"},S={class:"text-center q-py-md q-mb-md"},Q={class:"text-bold q-mb-md"},Y={class:"text-h5 q-mb-md"},$={key:0,class:"row q-col-gutter-xs"},j={class:"col-12 col-md-3 text-center"},_={class:"col-12 col-md-3 text-center"},F={class:"col-12 col-md-3 text-center"},H={class:"col-12 col-md-3 text-center"},K={key:1,class:"row q-col-gutter-xs"},G={class:"col-12 col-md-3 text-center"},J={class:"col-12 col-md-3 text-center"},L={class:"col-12 col-md-3 text-center"},O={class:"col-12 col-md-3 text-center"},R={class:"col-12 col-md-3 text-center"},Z={class:"col-12 col-md-3 text-center"},I={class:"col-12 col-md-3 text-center"},W={class:"col-12 col-md-3 text-center"},X={class:"col-12 col-md-3 text-center"},oo={class:"col-12 col-md-3 text-center"},eo={class:"col-12 col-md-3 text-center"},so={class:"col-12 col-md-3 text-center"},ao={class:"col-12 col-md-3 text-center"};function ro(o,e,u,c,m,p){return n(),z(w,{padding:""},{default:r(()=>[s("div",E,[s("div",S,[s("div",Q,a(o.fecha),1),s("div",Y,"Bienvenido, "+a(o.store.nombreUsuario)+".",1)]),o.mostrarTrabajosEcuador?(n(),v("div",$,[s("div",j,[e[0]||(e[0]=s("div",null,"Total de usuarios",-1)),t(l,{"model-value":o.tablero.usuariosVerificados+o.tablero.usuariosNoVerificados,readonly:"",step:1,"show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuariosVerificados+o.tablero.usuariosNoVerificados),1)]),_:1},8,["model-value"])]),s("div",_,[e[1]||(e[1]=s("div",null,"Usuarios conectados",-1)),t(l,{"model-value":o.tablero.usuariosConectados,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuariosConectados),1)]),_:1},8,["model-value"])]),s("div",F,[e[2]||(e[2]=s("div",null,"Usuarios conectados el dia de hoy",-1)),t(l,{"model-value":o.tablero.usuariosConectadosDia,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuariosConectadosDia),1)]),_:1},8,["model-value"])]),s("div",H,[e[3]||(e[3]=s("div",null,"Usuarios conectados en el mes",-1)),t(l,{"model-value":o.tablero.usuariosConectadosMes,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuariosConectadosMes),1)]),_:1},8,["model-value"])])])):y("",!0),o.mostrarBuroCreditoEcuadorEcuador?(n(),v("div",K,[s("div",G,[e[4]||(e[4]=s("div",null,"Total de usuarios",-1)),t(l,{"model-value":o.tablero.usuariosVerificados+o.tablero.usuariosNoVerificados,readonly:"",step:1,"show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuariosVerificados+o.tablero.usuariosNoVerificados),1)]),_:1},8,["model-value"])]),s("div",J,[e[5]||(e[5]=s("div",null,"Usuarios verificados",-1)),t(l,{"model-value":o.tablero.usuariosVerificados,readonly:"",step:1,"show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuariosVerificados),1)]),_:1},8,["model-value"])]),s("div",L,[e[6]||(e[6]=s("div",null,"Usuarios no verificados",-1)),t(l,{"model-value":o.tablero.usuariosNoVerificados,readonly:"",step:1,"show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuariosNoVerificados),1)]),_:1},8,["model-value"])]),s("div",O,[e[7]||(e[7]=s("div",null,"Usuarios conectados",-1)),t(l,{"model-value":o.tablero.usuariosConectados,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuariosConectados),1)]),_:1},8,["model-value"])]),s("div",R,[e[8]||(e[8]=s("div",null,"Usuarios conectados el dia de hoy",-1)),t(l,{"model-value":o.tablero.usuariosConectadosDia,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuariosConectadosDia),1)]),_:1},8,["model-value"])]),s("div",Z,[e[9]||(e[9]=s("div",null,"Usuarios conectados en el mes",-1)),t(l,{"model-value":o.tablero.usuariosConectadosMes,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuariosConectadosMes),1)]),_:1},8,["model-value"])]),s("div",I,[e[10]||(e[10]=s("div",null,"Usuarios con facturaci\xF3n de planes (pagado)",-1)),t(l,{"model-value":o.tablero.usuarioConPlanesPagados,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuarioConPlanesPagados),1)]),_:1},8,["model-value"])]),s("div",W,[e[11]||(e[11]=s("div",null,"Usuarios con facturaci\xF3n de planes (no pagado)",-1)),t(l,{"model-value":o.tablero.usuarioConPlanesNoPagados,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.usuarioConPlanesNoPagados),1)]),_:1},8,["model-value"])]),s("div",X,[e[12]||(e[12]=s("div",null,"Servicios activos",-1)),t(l,{"model-value":o.tablero.serviciosActivos,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.serviciosActivos),1)]),_:1},8,["model-value"])]),s("div",oo,[e[13]||(e[13]=s("div",null,"Planes activos",-1)),t(l,{"model-value":o.tablero.planesActivos,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.planesActivos),1)]),_:1},8,["model-value"])]),s("div",eo,[e[14]||(e[14]=s("div",null,"Pedidos de servicios por atender",-1)),t(l,{"model-value":o.tablero.pedidos,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.pedidos),1)]),_:1},8,["model-value"])]),s("div",so,[e[15]||(e[15]=s("div",null,"Reportes generados",-1)),t(l,{"model-value":o.tablero.pedidos,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.reportes),1)]),_:1},8,["model-value"])]),s("div",ao,[e[16]||(e[16]=s("div",null,"Clicks para pagos con Payphone",-1)),t(l,{"model-value":o.tablero.clicks_payphone,readonly:"","show-value":"",size:"90px",color:"primary","track-color":"grey-3",class:"text-primary q-ma-md"},{default:r(()=>[i(a(o.tablero.clicks_payphone),1)]),_:1},8,["model-value"])])])):y("",!0)])]),_:1})}var Co=U(B,[["render",ro]]);export{Co as default};
