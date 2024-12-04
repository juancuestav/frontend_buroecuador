import{u as $,Q as H}from"./QCircularProgress.5ddea41f.js";import{T as J}from"./TouchPan.bfca0f21.js";import{l as L,ba as U,r as P,c as l,w as W,am as X,au as Y,bQ as Z,D as _,g as p,h as ee}from"./index.aea1effc.js";import{b as y,n as w}from"./format.8ac60962.js";const Q=[34,37,40,33,39,38],ae=Object.keys($);var ie=L({name:"QKnob",props:{...U,...$,modelValue:{type:Number,required:!0},innerMin:Number,innerMax:Number,step:{type:Number,default:1,validator:e=>e>=0},tabindex:{type:[Number,String],default:0},disable:Boolean,readonly:Boolean},emits:["update:modelValue","change","dragValue"],setup(e,{slots:q,emit:g}){const{proxy:k}=p(),{$q:C}=k,i=P(e.modelValue),h=P(!1),r=l(()=>isNaN(e.innerMin)===!0||e.innerMin<e.min?e.min:e.innerMin),c=l(()=>isNaN(e.innerMax)===!0||e.innerMax>e.max?e.max:e.innerMax);let s;function V(){i.value=e.modelValue===null?r.value:y(e.modelValue,r.value,c.value),f(!0)}W(()=>`${e.modelValue}|${r.value}|${c.value}`,V),V();const d=l(()=>e.disable===!1&&e.readonly===!1),I=l(()=>"q-knob non-selectable"+(d.value===!0?" q-knob--editable":e.disable===!0?" disabled":"")),F=l(()=>(String(e.step).trim().split(".")[1]||"").length),v=l(()=>e.step===0?1:e.step),K=l(()=>e.instantFeedback===!0||h.value===!0),A=C.platform.is.mobile===!0?l(()=>d.value===!0?{onClick:N}:{}):l(()=>d.value===!0?{onMousedown:E,onClick:N,onKeydown:S,onKeyup:j}:{}),B=l(()=>d.value===!0?{tabindex:e.tabindex}:{[`aria-${e.disable===!0?"disabled":"readonly"}`]:"true"}),T=l(()=>{const a={};return ae.forEach(n=>{a[n]=e[n]}),a});function z(a){a.isFinal?(m(a.evt,!0),h.value=!1):(a.isFirst&&(M(),h.value=!0),m(a.evt))}const D=l(()=>[[J,z,void 0,{prevent:!0,stop:!0,mouse:!0}]]);function M(){const{top:a,left:n,width:o,height:b}=k.$el.getBoundingClientRect();s={top:a+b/2,left:n+o/2}}function E(a){M(),m(a)}function N(a){M(),m(a,!0)}function S(a){if(!Q.includes(a.keyCode))return;X(a);const n=([34,33].includes(a.keyCode)?10:1)*v.value,o=[34,37,40].includes(a.keyCode)?-n:n;i.value=y(parseFloat((i.value+o).toFixed(F.value)),r.value,c.value),f()}function m(a,n){const o=Y(a),b=Math.abs(o.top-s.top),G=Math.sqrt(b**2+Math.abs(o.left-s.left)**2);let t=Math.asin(b/G)*(180/Math.PI);o.top<s.top?t=s.left<o.left?90-t:270+t:t=s.left<o.left?t+90:270-t,C.lang.rtl===!0?t=w(-t-e.angle,0,360):e.angle&&(t=w(t-e.angle,0,360)),e.reverse===!0&&(t=360-t);let u=e.min+t/360*(e.max-e.min);if(v.value!==0){const x=u%v.value;u=u-x+(Math.abs(x)>=v.value/2?(x<0?-1:1)*v.value:0),u=parseFloat(u.toFixed(F.value))}u=y(u,r.value,c.value),g("dragValue",u),i.value!==u&&(i.value=u),f(n)}function j(a){Q.includes(a.keyCode)&&f(!0)}function f(a){e.modelValue!==i.value&&g("update:modelValue",i.value),a===!0&&g("change",i.value)}const O=Z(e);function R(){return ee("input",O.value)}return()=>{const a={class:I.value,role:"slider","aria-valuemin":r.value,"aria-valuemax":c.value,"aria-valuenow":e.modelValue,...B.value,...T.value,value:i.value,instantFeedback:K.value,...A.value},n={default:q.default};return d.value===!0&&e.name!==void 0&&(n.internal=R),_(H,a,n,"knob",d.value,()=>D.value)}}});export{ie as Q};