import{k as ae,u as ne,q as se,al as ue,am as le,t as ie,r as w,c as u,v as re,an as ce,x as fe,ao as de,y as ve,ap as ge,w as D,aq as he,ar as me,as as ye,at as M,au as Pe,av as Te,h as A,D as ke,ab as xe,m as Ce,g as Se,aw as qe,ax as Oe,ay as be,aj as Be}from"./index.6072a1b1.js";import{u as Ee,v as R,a as Fe,b as we,c as De,p as H,r as K,s as Me,d as Ae}from"./position-engine.71479b28.js";var Ke=ae({name:"QMenu",inheritAttrs:!1,props:{...Ee,...ne,...se,...ue,persistent:Boolean,autoClose:Boolean,separateClosePopup:Boolean,noRouteDismiss:Boolean,noRefocus:Boolean,noFocus:Boolean,fit:Boolean,cover:Boolean,square:Boolean,anchor:{type:String,validator:R},self:{type:String,validator:R},offset:{type:Array,validator:Fe},scrollTarget:le,touchPosition:Boolean,maxHeight:{type:String,default:null},maxWidth:{type:String,default:null}},emits:[...ie,"click","escapeKey"],setup(t,{slots:Q,emit:c,attrs:d}){let n=null,f,l,v;const T=Se(),{proxy:g}=T,{$q:o}=g,a=w(null),s=w(!1),W=u(()=>t.persistent!==!0&&t.noRouteDismiss!==!0),j=re(t,o),{registerTick:_,removeTick:I}=ce(),{registerTimeout:k}=fe(),{transitionProps:L,transitionStyle:U}=de(t),{localScrollTarget:x,changeScrollEvent:$,unconfigureScrollTarget:z}=we(t,E),{anchorEl:i,canShow:G}=De({showing:s}),{hide:C}=ve({showing:s,canShow:G,handleShow:Y,handleHide:Z,hideOnRouteChange:W,processOnMount:!0}),{showPortal:S,hidePortal:q,renderPortal:J}=ge(T,a,ee,"menu"),h={anchorEl:i,innerRef:a,onClickOutside(e){if(t.persistent!==!0&&s.value===!0)return C(e),(e.type==="touchstart"||e.target.classList.contains("q-dialog__backdrop"))&&Be(e),!0}},O=u(()=>H(t.anchor||(t.cover===!0?"center middle":"bottom start"),o.lang.rtl)),N=u(()=>t.cover===!0?O.value:H(t.self||"top start",o.lang.rtl)),V=u(()=>(t.square===!0?" q-menu--square":"")+(j.value===!0?" q-menu--dark q-dark":"")),X=u(()=>t.autoClose===!0?{onClick:p}:{}),b=u(()=>s.value===!0&&t.persistent!==!0);D(b,e=>{e===!0?(qe(y),Ae(h)):(M(y),K(h))});function m(){Oe(()=>{let e=a.value;e&&e.contains(document.activeElement)!==!0&&(e=e.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||e.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||e.querySelector("[autofocus], [data-autofocus]")||e,e.focus({preventScroll:!0}))})}function Y(e){if(n=t.noRefocus===!1?document.activeElement:null,he(F),S(),E(),f=void 0,e!==void 0&&(t.touchPosition||t.contextMenu)){const P=me(e);if(P.left!==void 0){const{top:te,left:oe}=i.value.getBoundingClientRect();f={left:P.left-oe,top:P.top-te}}}l===void 0&&(l=D(()=>o.screen.width+"|"+o.screen.height+"|"+t.self+"|"+t.anchor+"|"+o.lang.rtl,r)),t.noFocus!==!0&&document.activeElement.blur(),_(()=>{r(),t.noFocus!==!0&&m()}),k(()=>{o.platform.is.ios===!0&&(v=t.autoClose,a.value.click()),r(),S(!0),c("show",e)},t.transitionDuration)}function Z(e){I(),q(),B(!0),n!==null&&(e===void 0||e.qClickOutside!==!0)&&(((e&&e.type.indexOf("key")===0?n.closest('[tabindex]:not([tabindex^="-"])'):void 0)||n).focus(),n=null),k(()=>{q(!0),c("hide",e)},t.transitionDuration)}function B(e){f=void 0,l!==void 0&&(l(),l=void 0),(e===!0||s.value===!0)&&(ye(F),z(),K(h),M(y)),e!==!0&&(n=null)}function E(){(i.value!==null||t.scrollTarget!==void 0)&&(x.value=Pe(i.value,t.scrollTarget),$(x.value,r))}function p(e){v!==!0?(Te(g,e),c("click",e)):v=!1}function F(e){b.value===!0&&t.noFocus!==!0&&be(a.value,e.target)!==!0&&m()}function y(e){c("escapeKey"),C(e)}function r(){Me({targetEl:a.value,offset:t.offset,anchorEl:i.value,anchorOrigin:O.value,selfOrigin:N.value,absoluteOffset:f,fit:t.fit,cover:t.cover,maxHeight:t.maxHeight,maxWidth:t.maxWidth})}function ee(){return A(xe,L.value,()=>s.value===!0?A("div",{role:"menu",...d,ref:a,tabindex:-1,class:["q-menu q-position-engine scroll"+V.value,d.class],style:[d.style,U.value],...X.value},ke(Q.default)):null)}return Ce(B),Object.assign(g,{focus:m,updatePosition:r}),J}});export{Ke as Q};