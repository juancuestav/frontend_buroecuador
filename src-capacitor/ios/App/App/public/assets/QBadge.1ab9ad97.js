import{k as r,q as d,v as s,c as a,h as i,D as g,g as c,ak as b}from"./index.6072a1b1.js";const v=["ul","ol"];var B=r({name:"QList",props:{...d,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean,tag:{type:String,default:"div"}},setup(e,{slots:l}){const n=c(),o=s(e,n.proxy.$q),t=a(()=>v.includes(e.tag)?null:"list"),u=a(()=>"q-list"+(e.bordered===!0?" q-list--bordered":"")+(e.dense===!0?" q-list--dense":"")+(e.separator===!0?" q-list--separator":"")+(o.value===!0?" q-list--dark":"")+(e.padding===!0?" q-list--padding":""));return()=>i(e.tag,{class:u.value,role:t.value},g(l.default))}});const m=["top","middle","bottom"];var x=r({name:"QBadge",props:{color:String,textColor:String,floating:Boolean,transparent:Boolean,multiLine:Boolean,outline:Boolean,rounded:Boolean,label:[Number,String],align:{type:String,validator:e=>m.includes(e)}},setup(e,{slots:l}){const n=a(()=>e.align!==void 0?{verticalAlign:e.align}:null),o=a(()=>{const t=e.outline===!0&&e.color||e.textColor;return`q-badge flex inline items-center no-wrap q-badge--${e.multiLine===!0?"multi":"single"}-line`+(e.outline===!0?" q-badge--outline":e.color!==void 0?` bg-${e.color}`:"")+(t!==void 0?` text-${t}`:"")+(e.floating===!0?" q-badge--floating":"")+(e.rounded===!0?" q-badge--rounded":"")+(e.transparent===!0?" q-badge--transparent":"")});return()=>i("div",{class:o.value,style:n.value,role:"status","aria-label":e.label},b(l.default,e.label!==void 0?[e.label]:[]))}});export{x as Q,B as a};
