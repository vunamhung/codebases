(this["webpackJsonpjetswap-frontend-polygon"]=this["webpackJsonpjetswap-frontend-polygon"]||[]).push([[16],{1107:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return ht}));var c,a,r,i,s,o,j,l,b,u,d,O,x,p,m,f,h,g,v,w,k,y,S,z,F,N,T,C,I,L,W,E,Q,_,D,G=n(20),U=n(0),H=n(8),P=n(15),A=n(167),R=n(1),M=n.n(R),B=n(13),J=n(25),V=n(30),q=n(39),Z=n(272),$=n(56),K=n(6),X=n.n(K),Y=n(32),ee=n(18),te=n(69),ne=n(269),ce=n(166),ae=function(){var e=Object(U.useState)([]),t=Object(J.a)(e,2),n=t[0],c=t[1],a=Object(V.c)().account,r=Object(ce.a)().fastRefresh;return Object(U.useEffect)((function(){a&&function(){var e=Object(B.a)(M.a.mark((function e(){var t,n,r,i,s;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=ne.c.map((function(e){return e.pid})),n=[].concat(Object($.a)(t),[0,19]),r=n.map((function(e){return{address:Object(ee.h)(),name:"pendingCake",params:[e,a]}})),e.next=5,Object(Y.a)(te,r);case 5:i=e.sent,s=n.map((function(e,t){return{pid:e,balance:new X.a(i[t])}})),c(s);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()()}),[a,r]),n},re=n(267),ie=n(50),se=n(273),oe=n(4),je=function(e){var t=e.value,n=e.decimals,c=e.fontSize,a=void 0===c?"40px":c,r=e.lineHeight,i=void 0===r?"1":r,s=e.prefix,o=void 0===s?"":s,j=e.bold,l=void 0===j||j,b=e.color,u=void 0===b?"text":b,d=Object(se.useCountUp)({start:0,end:t,duration:1,separator:",",decimals:void 0!==n?n:t<0?4:t>1e5?0:3}),O=d.countUp,x=d.update,p=Object(U.useRef)(x);return Object(U.useEffect)((function(){p.current(t)}),[t,p]),Object(oe.jsxs)(P.cb,{bold:l,fontSize:a,style:{lineHeight:i},color:u,children:[o,O]})},le=n(16),be=function(e){return Object(oe.jsx)(je,Object(le.a)({fontSize:"14px",lineHeight:"1.1",color:"textSubtle",prefix:"~$",bold:!1,decimals:2},e))},ue=H.e.div(c||(c=Object(G.a)(["\n  margin-bottom: 24px;\n}\n"]))),de=function(){var e=Object(q.b)().t,t=Object(V.c)().account,n=ae().reduce((function(e,t){return e+new X.a(t.balance).div(new X.a(10).pow(18)).toNumber()}),0),c=new X.a(n).multipliedBy(Object(ie.o)()).toNumber();return t?Object(oe.jsxs)(ue,{children:[Object(oe.jsx)(je,{value:n,lineHeight:"1.5"}),Object(oe.jsx)(be,{value:c})]}):Object(oe.jsx)(P.cb,{fontSize:"36px",color:"text",style:{lineHeight:"76px"},children:e("Locked")})},Oe=n(832),xe=n(78),pe=function(){var e=Object(q.b)().t,t=Object(Oe.a)(Object(ee.m)()),n=new K.BigNumber(Object(xe.a)(t)).multipliedBy(Object(ie.o)()).toNumber();return Object(V.c)().account?Object(oe.jsxs)(oe.Fragment,{children:[Object(oe.jsx)(je,{value:Object(xe.a)(t),decimals:4,fontSize:"24px",lineHeight:"36px"}),Object(oe.jsx)(be,{value:n})]}):Object(oe.jsx)(P.cb,{fontSize:"36px",color:"text",style:{lineHeight:"54px"},children:e("Locked")})},me=Object(H.e)(P.o)(a||(a=Object(G.a)(["\n  background-image: url('/images/assets/cardbg.svg');\n  background-repeat: no-repeat;\n  min-height: 376px;\n"]))),fe=Object(H.e)(re.a)(r||(r=Object(G.a)(["\n  background: ",";\n  color: #ffffff;\n  width: 100%;\n  border-radius: 7px;\n"])),(function(e){return e.theme.colors.button})),he=H.e.div(i||(i=Object(G.a)(["\n  margin-bottom: 16px;\n"]))),ge=H.e.img(s||(s=Object(G.a)(["\n  margin-bottom: 16px;\n"]))),ve=H.e.div(o||(o=Object(G.a)(["\n  color: ",";\n  font-size: 18px;\n"])),(function(e){return e.theme.colors.textDisabled})),we=H.e.div(j||(j=Object(G.a)(["\n  margin-top: 24px;\n"]))),ke=function(){var e=Object(U.useState)(!1),t=Object(J.a)(e,2),n=t[0],c=t[1],a=Object(V.c)().account,r=Object(q.b)().t,i=ae().filter((function(e){return e.balance.toNumber()>0})),s=Object(Z.a)(i.map((function(e){return e.pid}))).onReward,o=Object(U.useCallback)(Object(B.a)(M.a.mark((function e(){return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c(!0),e.prev=1,e.next=4,s();case 4:e.next=8;break;case 6:e.prev=6,e.t0=e.catch(1);case 8:return e.prev=8,c(!1),e.finish(8);case 11:case"end":return e.stop()}}),e,null,[[1,6,8,11]])}))),[s]);return Object(oe.jsx)(me,{children:Object(oe.jsxs)(P.p,{children:[Object(oe.jsx)(P.F,{size:"xl",mb:"24px",children:r("Farms & Staking")}),Object(oe.jsx)(ge,{src:"/images/assets/WINGS.svg",alt:"wings logo",width:64,height:64}),Object(oe.jsxs)(he,{children:[Object(oe.jsxs)(ve,{children:[r("pWINGS to Harvest"),":"]}),Object(oe.jsx)(de,{})]}),Object(oe.jsxs)(he,{children:[Object(oe.jsxs)(ve,{children:[r("pWINGS in Wallet"),":"]}),Object(oe.jsx)(pe,{})]}),Object(oe.jsx)(we,{children:a?Object(oe.jsx)(P.k,{id:"harvest-all",disabled:i.length<=0||n,onClick:o,width:"100%",children:n?r("Collecting pWINGS"):r("Harvest all (%count%)",{count:i.length})}):Object(oe.jsx)(fe,{width:"100%"})})]})})},ye=Object(H.e)(P.o)(l||(l=Object(G.a)(["\n  background-image: url('/images/assets/bg2.svg');\n  background-repeat: no-repeat;\n  background-position: bottom right;\n  min-height: 376px;\n"]))),Se=H.e.div(b||(b=Object(G.a)(["\n  margin-bottom: 16px;\n"]))),ze=H.e.img(u||(u=Object(G.a)(["\n  margin-bottom: 16px;\n"]))),Fe=function(){var e=Object(q.b)().t,t=Object(Oe.c)(),n=Object(xe.a)(Object(Oe.b)(Object(ee.m)())),c=t?Object(xe.a)(t)-n:0;return Object(oe.jsx)(ye,{children:Object(oe.jsxs)(P.p,{children:[Object(oe.jsx)(P.F,{size:"xl",mb:"24px",children:e("pWINGS Stats")}),Object(oe.jsx)(ze,{src:"/images/assets/WINGS.svg",alt:"wings logo",width:64,height:64}),Object(oe.jsxs)(Se,{children:[c&&Object(oe.jsx)(je,{fontSize:"36px",value:c}),Object(oe.jsx)(P.cb,{fontSize:"14px",color:"#808080",children:e("Total pWINGS Supply")})]}),Object(oe.jsxs)(Se,{children:[Object(oe.jsx)(je,{fontSize:"36px",decimals:0,value:n}),Object(oe.jsx)(P.cb,{fontSize:"14px",color:"#808080",children:e("Total pWINGS Burned")})]}),Object(oe.jsxs)(Se,{children:[Object(oe.jsx)(je,{fontSize:"36px",decimals:0,value:2}),Object(oe.jsx)(P.cb,{fontSize:"14px",color:"#808080",children:e("New pWINGS/block")})]})]})})},Ne=n(189),Te=n(190),Ce=Object(H.e)(P.o)(d||(d=Object(G.a)(["\n  align-items: center;\n  display: flex;\n  flex: 1;\n"]))),Ie=function(){var e=Object(q.b)().t,t=function(){var e=Object(U.useState)(null),t=Object(J.a)(e,2),n=t[0],c=t[1];return Object(U.useEffect)((function(){!function(){var e=Object(B.a)(M.a.mark((function e(){var t,n;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Ne.a.query({query:Te.c,variables:{},fetchPolicy:"no-cache"});case 3:(null===(t=e.sent)||void 0===t?void 0:t.data)&&(n=0,t.data.pairs.map((function(e){return n+=parseFloat(e.reserveUSD)})),c({update_at:"","24h_total_volume":0,total_value_locked:0,total_value_locked_all:n,trade_pairs:null})),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error("Unable to fetch data:",e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}()()}),[c]),n}(),n=Object(ie.f)(),c=Object(ie.l)(),a=Object(V.c)().account,r=Object(ie.m)(a),i=Object(U.useMemo)((function(){var e=n.reduce((function(e,t){if(!t.lpTotalInQuoteToken||!c)return e;var n=c[t.quoteToken.symbol.toLowerCase()],a=new X.a(t.lpTotalInQuoteToken).times(n);return e.plus(a)}),new X.a(0)),a=r.reduce((function(e,t){if(!t)return e;var n=c[t.stakingToken.symbol.toLowerCase()],a=new X.a(t.totalStaked).div(new X.a(10).pow(t.stakingToken.decimals)).times(n);return e.plus(a)}),new X.a(0)),i=new X.a(t?t.total_value_locked_all:0);return e.plus(a).plus(i).toNumber().toLocaleString("en-US",{maximumFractionDigits:0})}),[t,n,r,c]);return Object(oe.jsx)(Ce,{children:Object(oe.jsxs)(P.p,{children:[Object(oe.jsxs)(P.F,{size:"lg",mb:"14px",children:[e("Total Value Locked"),Object(oe.jsx)("br",{}),"(TVL)"]}),t?Object(oe.jsxs)(oe.Fragment,{children:[Object(oe.jsx)(P.F,{fontSize:"32px",size:"lg",color:"extra",children:"$".concat(i)}),Object(oe.jsx)(P.cb,{fontSize:"18px",color:"textDisabled",children:e("Across all LPs and Pilots Pools")})]}):Object(oe.jsx)(oe.Fragment,{children:Object(oe.jsx)(P.Z,{height:66})})]})})},Le=n(913),We=n.n(Le),Ee=n(79),Qe=n(279),_e=Object(H.e)(P.o)(O||(O=Object(G.a)(["\n  margin-left: auto;\n  margin-right: auto;\n  width: 100%;\n\n  "," {\n    margin: 0;\n    max-width: none;\n  }\n"])),(function(e){return e.theme.mediaQueries.lg})),De=Object(H.e)(P.F).attrs({size:"lg"})(x||(x=Object(G.a)(["\n  line-height: 44px;\n  width: 75%;\n  color: ",";\n"])),(function(e){return e.theme.colors.extra})),Ge=H.e.div(p||(p=Object(G.a)(["\n  background: #ac7bff;\n  margin-top: -50px;\n  width: 59px;\n  height: 59px;\n  border-radius: 50%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 40px;\n"]))),Ue=function(){var e=Object(q.b)().t,t=Object(ie.f)(),n=Object(ie.l)(),c=Object(ie.o)(),a=Object(U.useMemo)((function(){var e=t.filter((function(e){return 0!==e.pid&&"0X"!==e.multiplier})).map((function(e){if(e.lpTotalInQuoteToken&&n){var t=n[e.quoteToken.symbol.toLowerCase()],a=new X.a(e.lpTotalInQuoteToken).times(t);return Object(Qe.a)(e.poolWeight,c,a)}return null})),a=We()(e);return null===a||void 0===a?void 0:a.toLocaleString("en-US",{maximumFractionDigits:2})}),[c,t,n]),r=a||"-",i=e("Earn up to %highestApr% APR in Farms",{highestApr:r}).split(r),s=Object(J.a)(i,2),o=s[0],j=s[1];return Object(oe.jsx)(_e,{children:Object(oe.jsxs)(P.p,{children:[Object(oe.jsx)(P.F,{color:"text",size:"lg",children:o}),Object(oe.jsx)(De,{children:a?"".concat(a,"%"):Object(oe.jsx)(P.Z,{animation:"pulse",variant:"rect",height:"44px"})}),Object(oe.jsxs)(P.E,{justifyContent:"space-between",children:[Object(oe.jsx)(P.F,{color:"text",size:"lg",children:j}),Object(oe.jsx)(Ee.b,{exact:!0,activeClassName:"active",to:"/farms",id:"farm-apy-cta",children:Object(oe.jsx)(Ge,{children:Object(oe.jsx)(P.c,{color:"#000000"})})})]})]})})},He=n(188),Pe=n.n(He),Ae=n(64),Re=Object(H.e)(P.o)(m||(m=Object(G.a)(["\n  margin-left: auto;\n  margin-right: auto;\n  width: 100%;\n  "," {\n    margin: 0;\n    max-width: none;\n  }\n"])),(function(e){return e.theme.mediaQueries.lg})),Me=Object(H.e)(P.F).attrs({size:"xl"})(f||(f=Object(G.a)(["\n  line-height: 44px;\n"]))),Be=H.e.div(h||(h=Object(G.a)(["\n  background: #ac7bff;\n  margin-top: -50px;\n  width: 59px;\n  height: 59px;\n  border-radius: 50%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 40px;\n"]))),Je=function(){var e=Object(q.b)().t,t=Ae.a.filter((function(e){return!e.isFinished&&!e.earningToken.symbol.includes("CAKE")})),n=(Pe()(t,["sortOrder","pid"],["desc","desc"]).slice(0,3),"pWINGS"),c=e("Earn %assets% in Pools",{assets:n}).split(n),a=Object(J.a)(c,2),r=a[0],i=a[1];return Object(oe.jsx)(Re,{children:Object(oe.jsxs)(P.p,{children:[Object(oe.jsx)(P.F,{color:"text",size:"lg",children:r}),Object(oe.jsx)(Me,{color:"extra",children:n}),Object(oe.jsxs)(P.E,{justifyContent:"space-between",children:[Object(oe.jsx)(P.F,{color:"text",size:"lg",children:i}),Object(oe.jsx)(Ee.b,{exact:!0,activeClassName:"active",to:"/syrup",id:"pool-cta",children:Object(oe.jsx)(Be,{children:Object(oe.jsx)(P.c,{color:"#000000"})})})]})]})})},Ve=Object(H.e)(P.o)(g||(g=Object(G.a)(["\n  align-items: center;\n  display: flex;\n  width: 100%;\n  height: 100%;\n"]))),qe=function(){var e=Object(q.b)().t,t=Object(ie.b)(),n=Object(U.useMemo)((function(){return t.untrackedVolumeUSD.toLocaleString("en-US",{maximumFractionDigits:2})}),[t]);return Object(oe.jsx)(Ve,{children:Object(oe.jsxs)(P.p,{children:[Object(oe.jsx)(P.F,{size:"lg",mb:"14px",children:e("All Time Volume")}),n?Object(oe.jsx)(oe.Fragment,{children:Object(oe.jsx)(P.F,{fontSize:"32px",size:"lg",color:"extra",children:"$".concat(n)})}):Object(oe.jsx)(oe.Fragment,{children:Object(oe.jsx)(P.Z,{height:66})})]})})},Ze=Object(H.e)(P.o)(v||(v=Object(G.a)(["\n  align-items: center;\n  display: flex;\n  width: 100%;\n  height: 100%;\n"]))),$e=function(){var e=Object(q.b)().t,t=Object(ie.b)(),n=Object(U.useMemo)((function(){return(.001*t.untrackedVolumeUSD).toLocaleString("en-US",{maximumFractionDigits:2})}),[t]);return Object(oe.jsx)(Ze,{children:Object(oe.jsxs)(P.p,{children:[Object(oe.jsx)(P.F,{size:"lg",mb:"14px",children:e("All Time Fee")}),n?Object(oe.jsx)(oe.Fragment,{children:Object(oe.jsx)(P.F,{fontSize:"32px",size:"lg",color:"extra",children:"$".concat(n)})}):Object(oe.jsx)(oe.Fragment,{children:Object(oe.jsx)(P.Z,{height:66})})]})})},Ke=n(916),Xe=n.n(Ke),Ye=(n(929),Object(H.f)(w||(w=Object(G.a)(["\n\t0% {\n\t\ttransform: translatey(0px);\n\t}\n\t50% {\n\t\ttransform: translatey(10px);\n\t}\n\t100% {\n\t\ttransform: translatey(0px);\n\t}\n"])))),et=H.e.div(k||(k=Object(G.a)(["\n  display: none;\n\n  "," {\n    display: block;\n    background-image: url('/images/assets/jetbg.svg');\n  }\n"])),(function(e){return e.theme.mediaQueries.lg})),tt=H.e.img(y||(y=Object(G.a)(["\n  animation: "," 4s ease-in-out infinite;\n  transform: translate3d(0, 0, 0);\n"])),Ye),nt=function(){return Object(oe.jsx)(et,{children:Object(oe.jsx)(tt,{src:"/images/assets/jet1.png",alt:"jet"})})},ct=Object(H.f)(S||(S=Object(G.a)(["\n\t0% {\n\t\ttransform: translatey(0px);\n\t}\n\t50% {\n\t\ttransform: translatey(10px);\n\t}\n\t100% {\n\t\ttransform: translatey(0px);\n\t}\n"]))),at=H.e.div(z||(z=Object(G.a)(["\n  display: none;\n\n  "," {\n    display: block;\n    background-image: url('/images/assets/jetbg.svg');\n    background-repeat: no-repeat;\n  }\n"])),(function(e){return e.theme.mediaQueries.lg})),rt=H.e.img(F||(F=Object(G.a)(["\n  animation: "," 4s ease-in-out infinite;\n  transform: translate3d(0, 0, 0);\n"])),ct),it=function(){return Object(oe.jsx)(at,{children:Object(oe.jsx)(rt,{src:"/images/assets/jet2.png",alt:"jet"})})},st=Object(H.f)(N||(N=Object(G.a)(["\n\t0% {\n\t\ttransform: translatey(0px);\n\t}\n\t50% {\n\t\ttransform: translatey(10px);\n\t}\n\t100% {\n\t\ttransform: translatey(0px);\n\t}\n"]))),ot=H.e.div(T||(T=Object(G.a)(["\n  display: block;\n  background-image: url('/images/assets/jetbg.svg');\n  padding-bottom: 30px;\n  "," {\n    display: none;\n  }\n"])),(function(e){return e.theme.mediaQueries.lg})),jt=H.e.img(C||(C=Object(G.a)(["\n  animation: "," 4s ease-in-out infinite;\n  transform: translate3d(0, 0, 0);\n"])),st),lt=function(){return Object(oe.jsx)(ot,{children:Object(oe.jsx)(jt,{src:"/images/assets/jet1.png",alt:"jet"})})},bt=H.e.div(I||(I=Object(G.a)(["\n  align-items: center;\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n  margin: auto;\n  margin-bottom: 32px;\n  text-align: center;\n\n  "," {\n    padding-top: 40px;\n  }\n"])),(function(e){return e.theme.mediaQueries.lg})),ut=Object(H.e)(P.e)(L||(L=Object(G.a)(["\n  align-items: stretch;\n  justify-content: stretch;\n  margin-bottom: 32px;\n\n  & > div {\n    grid-column: span 6;\n    width: 100%;\n  }\n\n  "," {\n    & > div {\n      grid-column: span 8;\n    }\n  }\n\n  "," {\n    & > div {\n      grid-column: span 6;\n    }\n  }\n"])),(function(e){return e.theme.mediaQueries.sm}),(function(e){return e.theme.mediaQueries.lg})),dt=H.e.div(W||(W=Object(G.a)(["\n  width: 100%;\n  background-image: url('/images/assets/bg5.svg');\n\n  background-repeat: no-repeat;\n  background-position: center center;\n"]))),Ot=H.e.div(E||(E=Object(G.a)(["\n  display: flex;\n"]))),xt=H.e.div(Q||(Q=Object(G.a)([""]))),pt=H.e.div(_||(_=Object(G.a)(["\n  display: none;\n  @media (max-width: 768px) {\n    display: grid;\n    grid-gap: 20px;\n    & > div {\n      width: 100%;\n    }\n  }\n"]))),mt={superLargeDesktop:{breakpoint:{max:4e3,min:3e3},items:5},desktop:{breakpoint:{max:3e3,min:1024},items:3},tablet:{breakpoint:{max:1024,min:464},items:2},mobile:{breakpoint:{max:464,min:0},items:1}},ft=Object(H.e)(Xe.a)(D||(D=Object(G.a)(["\n  & .react-multi-carousel-item--active ~ .react-multi-carousel-item--active {\n    padding-left: 20px;\n  }\n  @media (max-width: 768px) {\n    display: none !important;\n  }\n"]))),ht=function(){var e=Object(q.b)().t;return Object(oe.jsx)(dt,{children:Object(oe.jsxs)(A.a,{children:[Object(oe.jsxs)(bt,{children:[Object(oe.jsx)(lt,{}),Object(oe.jsxs)(Ot,{children:[Object(oe.jsx)(nt,{}),Object(oe.jsxs)(xt,{children:[Object(oe.jsx)(P.F,{as:"h1",size:"xl",mb:"24px",color:"text",children:e("JetSwap")}),Object(oe.jsx)(P.cb,{children:e("Welcome to Jetswap, Jetfuel.Finance's AMM on BSC & Polygon")})]}),Object(oe.jsx)(it,{})]})]}),Object(oe.jsxs)("div",{children:[Object(oe.jsxs)(ut,{children:[Object(oe.jsx)(ke,{}),Object(oe.jsx)(Fe,{})]}),Object(oe.jsxs)(pt,{children:[Object(oe.jsx)(Ue,{}),Object(oe.jsx)(Je,{}),Object(oe.jsx)(Ie,{}),Object(oe.jsx)(qe,{}),Object(oe.jsx)($e,{})]}),Object(oe.jsxs)(ft,{responsive:mt,itemClass:"carousel-item",infinite:!0,autoPlay:!0,autoPlaySpeed:3e3,arrows:!1,children:[Object(oe.jsx)(Ue,{}),Object(oe.jsx)(Je,{}),Object(oe.jsx)(Ie,{}),Object(oe.jsx)(qe,{}),Object(oe.jsx)($e,{})]})]})]})})}},832:function(e,t,n){"use strict";n.d(t,"c",(function(){return O})),n.d(t,"b",(function(){return x}));var c=n(1),a=n.n(c),r=n(13),i=n(25),s=n(0),o=n(6),j=n.n(o),l=n(30),b=n(43),u=n(66),d=n(166),O=function(){var e=Object(d.a)().slowRefresh,t=Object(s.useState)(),n=Object(i.a)(t,2),c=n[0],o=n[1];return Object(s.useEffect)((function(){function e(){return(e=Object(r.a)(a.a.mark((function e(){var t,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=Object(b.p)(),e.next=3,t.methods.totalSupply().call();case 3:n=e.sent,o(new j.a(n));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[e]),c},x=function(e){var t=Object(s.useState)(new j.a(0)),n=Object(i.a)(t,2),c=n[0],o=n[1],l=Object(d.a)().slowRefresh,O=Object(u.a)();return Object(s.useEffect)((function(){(function(){var t=Object(r.a)(a.a.mark((function t(){var n,c;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=Object(b.a)(e,O),t.next=3,n.methods.balanceOf("0x000000000000000000000000000000000000dEaD").call();case 3:c=t.sent,o(new j.a(c));case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}})()()}),[O,e,l]),c};t.a=function(e){var t=Object(s.useState)(new j.a(0)),n=Object(i.a)(t,2),c=n[0],o=n[1],O=Object(l.c)().account,x=Object(u.a)(),p=Object(d.a)().fastRefresh;return Object(s.useEffect)((function(){O&&function(){var t=Object(r.a)(a.a.mark((function t(){var n,c;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=Object(b.a)(e,x),t.next=3,n.methods.balanceOf(O).call();case 3:c=t.sent,o(new j.a(c));case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}()()}),[O,e,x,p]),c}}}]);
//# sourceMappingURL=16.13f6ef27.chunk.js.map