import{C as t}from"./ConfiguracionController.02a36421.js";import{H as l,r as u}from"./index.6072a1b1.js";const m=l("configuracion_general",()=>{const r=u();async function a(){await new t().listar().then(o=>r.value=o.result[0])}function i(){a()}function c(){var o;const e=(o=r.value)==null?void 0:o.logo_claro;if(e){let n=document.querySelector('link[rel="icon"]');n||(n=document.createElement("link"),n.rel="icon",document.head.appendChild(n)),n.type="image/x-icon",n.href=e}}return{configuracion:r,consultarConfiguracion:a,refrescarConfiguracion:i,cambiarFavicon:c}});export{m as u};
