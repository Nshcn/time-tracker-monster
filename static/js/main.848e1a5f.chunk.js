(this["webpackJsonpdragon-egg"]=this["webpackJsonpdragon-egg"]||[]).push([[0],[,,,,,,,,,,function(e,t,a){},function(e,t,a){},,function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(1),c=a.n(n),g=a(4),s=a.n(g),A=(a(10),a(5)),o=a(2),i=a.p+"static/media/dragon-egg.77956a12.png",r=a.p+"static/media/egg-head.8710bdba.png",m=a.p+"static/media/egg-tail.5df6bcec.png",d=[a.p+"static/media/mon1.caf5bfe6.png",a.p+"static/media/mon2.3df2a9ba.png",a.p+"static/media/mon3.3871db76.png",a.p+"static/media/mon4.2bb832b1.png",a.p+"static/media/mon5.0d116dc9.png",a.p+"static/media/mon6.1371b11b.png",a.p+"static/media/mon7.ad4a2678.png",a.p+"static/media/mon8.b550deb4.png"],l=(a(11),a(0));var p=function(){var e=Object(n.useState)(null),t=Object(o.a)(e,2),a=t[0],c=t[1],g=Object(n.useState)(!0),s=Object(o.a)(g,2),p=s[0],O=s[1],b=Object(n.useState)(!1),j=Object(o.a)(b,2),h=j[0],u=j[1],M=Object(n.useState)(null),f=Object(o.a)(M,2),C=f[0],v=f[1],E=Object(n.useState)(!1),N=Object(o.a)(E,2),Q=N[0],S=N[1],U=Object(n.useState)([]),w=Object(o.a)(U,2),D=(w[0],w[1]),x=Object(n.useState)(""),B=Object(o.a)(x,2),Z=B[0],F=B[1],I=Object(n.useState)(""),L=Object(o.a)(I,2),H=L[0],K=L[1],y=Object(n.useState)(""),k=Object(o.a)(y,2),z=k[0],G=k[1],R=Object(n.useState)(JSON.parse(localStorage.getItem("pets"))),T=Object(o.a)(R,2),W=T[0],X=T[1];return Object(n.useEffect)((function(){var e=localStorage.getItem("egg-start-time")||(new Date).getTime();localStorage.setItem("egg-start-time",e),G(e),c(Math.min(((new Date).getTime()-e)/1e3,18e3));var t=[];for(var a in W)t.push(Object(A.a)({id:a},W[a]));X(t)}),[]),Object(n.useEffect)((function(){return setTimeout((function(){p&&c(Math.min(((new Date).getTime()-z)/1e3,18e3))}),1e3),function(){}})),Object(l.jsxs)("div",{className:"egg-container",children:[p&&Object(l.jsx)(l.Fragment,{children:Object(l.jsx)("img",{className:"eggimg",src:i,alt:"egg"})})||h&&Object(l.jsxs)("div",{className:"breakegg",children:[Object(l.jsx)("img",{className:"eggimg egg-head",src:r,alt:""}),Object(l.jsx)("img",{className:"eggimg",src:m,alt:""}),Object(l.jsx)("img",{className:"eggimg",src:"data:image/png;base64,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",alt:""})]}),Object(l.jsx)("progress",{className:"loading",value:a,max:"18000"}),Object(l.jsx)("div",{className:"loadnum",children:((a||0)/18e3*100).toFixed(2)+"%"}),Object(l.jsx)("div",{children:18e3===a?"":"\u5269\u4f59\u65f6\u95f4\uff1a"+((18e3-(a||0))/60).toFixed(1)+"min"}),Object(l.jsx)("button",{className:"eggbtn",style:{opacity:a<18e3?0:1},onClick:function(){if(h){var e=localStorage.getItem("level"),t=[Math.ceil(100*Math.random()*e+50*e),Math.ceil(100*Math.random()*e+50*e),Math.ceil(100*Math.random()*e+50*e)];D(t),u(!1),function(e,t){var a=new Image,n="";a.src=e,a.onload=function(){var e=document.createElement("canvas"),c=a.width,g=a.height;e.width=c,e.height=g;var s=e.getContext("2d");s.drawImage(a,0,0,c,g);for(var A=s.getImageData(0,0,e.width,e.height),o=A.data,i=Math.floor(255*Math.random()+1),r=Math.floor(255*Math.random()+1),m=Math.floor(255*Math.random()+1),d=0;d<o.length;d+=4)o[d]+o[d+1]+o[d+2]>700&&(i+=Math.floor(3*Math.random()-1),r+=Math.floor(3*Math.random()-1),m+=Math.floor(3*Math.random()-1),o[d]=i+Math.floor(60*Math.random()-30),o[d+1]=r+Math.floor(60*Math.random()-30),o[d+2]=m+Math.floor(60*Math.random()-30));s.data=o,s.putImageData(A,0,0),n=e.toDataURL("image/png"),t(n)}}(d[Math.floor(Math.random()*d.length)],(function(e){v(e);var a=Math.ceil(2e8*Math.random());K(a);var n=JSON.parse(localStorage.getItem("pets"))||{};n[a]={name:Z,monProps:t,dataURL:e},localStorage.setItem("pets",JSON.stringify(n))})),S(!0)}else u(!0),O(!1)},disabled:a<18e3,children:h?"\u9886\u517b~~":"\u7834\u58f3~~"}),Q&&Object(l.jsxs)("div",{className:"mon",children:[Object(l.jsx)("img",{className:"monimg",src:C,alt:"123"}),Object(l.jsxs)("div",{children:["\u540d\u5b57\uff1a",Object(l.jsx)("input",{className:"nameinput",type:"text",maxLength:"8",onChange:function(e){F(e.target.value)}})]}),Object(l.jsx)("button",{className:"eggbtn",onClick:function(){c(0),S(!1);var e=(new Date).getTime();localStorage.setItem("egg-start-time",e),G(e),O(!0);var t=JSON.parse(localStorage.getItem("pets"))||{};t[H].name=Z,localStorage.setItem("pets",JSON.stringify(t))},children:"\u6536\u4e0b\u5566\uff01\uff01\uff01"})]})]})};a(13);var O=function(){return Object(l.jsx)("div",{className:"App",children:Object(l.jsx)(p,{})})};s.a.render(Object(l.jsx)(c.a.StrictMode,{children:Object(l.jsx)(O,{})}),document.getElementById("root"))}],[[14,1,2]]]);
//# sourceMappingURL=main.848e1a5f.chunk.js.map