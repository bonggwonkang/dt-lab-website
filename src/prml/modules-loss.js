/* PRML simulators, slides 86 to 90: the expected loss of a regression function,
   its split into a prediction error and an intrinsic variance, and the way the
   Minkowski exponent q moves the optimal y(x). */
import{el,fmt,clamp,rng,gauss,fit,polyval,gaussPdf,Plot,board,legend,slider,btnrow,readout,eqbar,note}from'./core.js'

/* the conditional distribution: two branches, so that p(t|x) can be made
   multimodal as in the inverse problems of slide 88 */
const NX=81,NT=369,T0=-4.6,T1=4.6,DT=(T1-T0)/(NT-1),XS=[],TS=[];
for(let i=0;i<NX;i++)XS.push((i+.5)/NX);
for(let j=0;j<NT;j++)TS.push(T0+j*DT);
const S1=x=>Math.sin(2*Math.PI*x);

/* one fixed sample, so that only the sliders move the picture */
const NPT=40,XN=[],SN=[],ZN=[],UN=[];
(function(){const r=rng(3);for(let n=0;n<NPT;n++){const x=(n+.5)/NPT;
  XN.push(x);SN.push(S1(x));ZN.push(gauss(r));UN.push(r())}})();

const HX=64,HY=132,HT0=-2.6,HT1=2.6,NS=11,SG=[];
for(let k=0;k<NS;k++)SG.push(.1+.6*k/(NS-1));

export function p86(root){
  const st={way:0,sig:.3,rho:0,q:2,M:3};
  let S,W,HM,FY,SW,cur={pe:0,iv:0};

  function stats(sig,rho,keep){const mean=[],vr=[],med=[],mod=[],w=new Float64Array(NT);
    for(let i=0;i<NX;i++){const a=S1(XS[i]);let s=0;
      for(let j=0;j<NT;j++){const v=(1-rho)*gaussPdf(TS[j],a,sig)+rho*gaussPdf(TS[j],-a,sig);w[j]=v;s+=v}
      let m=0,bi=0,bv=-1;
      for(let j=0;j<NT;j++){w[j]/=s;m+=TS[j]*w[j];if(w[j]>bv){bv=w[j];bi=j}}
      let v2=0,cum=0,md=TS[NT-1],got=false;
      for(let j=0;j<NT;j++){const d=TS[j]-m;v2+=d*d*w[j];
        if(!got&&cum+w[j]>=.5){md=TS[j]-DT/2+DT*(.5-cum)/w[j];got=true}cum+=w[j]}
      const p0=bi>0?w[bi-1]:0,p2=bi<NT-1?w[bi+1]:0,dn=p0-2*w[bi]+p2;
      mean.push(m);vr.push(v2);med.push(md);mod.push(TS[bi]+(dn<0?DT*.5*(p0-p2)/dn:0));
      if(keep)keep.push(Float64Array.from(w))}
    return{mean:mean,vr:vr,med:med,mod:mod}}

  const sample=sig=>XN.map((x,n)=>(UN[n]<st.rho?-SN[n]:SN[n])+sig*ZN[n]);
  const fitAt=sig=>fit(XN,sample(sig),st.M,1e-7);
  const curve=(P,sig)=>st.way===0?P.mean:st.way===1?P.med:st.way===2?P.mod:
    (function(){const w=fitAt(sig);return XS.map(x=>polyval(w,x))})();

  function EL(y,q){let s=0;
    for(let i=0;i<NX;i++){const w=W[i],yi=y[i];let e=0;
      for(let j=0;j<NT;j++)e+=w[j]*Math.pow(Math.abs(yi-TS[j]),q);s+=e}
    return s/NX}

  function build(){W=[];S=stats(st.sig,st.rho,W);
    const w=fitAt(st.sig);FY=XS.map(x=>polyval(w,x));
    const m=[];let mx=0;
    for(let i=0;i<HX;i++){const x=(i+.5)/HX,a=S1(x),col=[];
      for(let j=0;j<HY;j++){const t=HT0+(HT1-HT0)*(j+.5)/HY;
        const v=Math.sqrt((1-st.rho)*gaussPdf(t,a,st.sig)+st.rho*gaussPdf(t,-a,st.sig));
        col.push(v);if(v>mx)mx=v}
      m.push(col)}
    HM={m:m,mx:mx}}

  function sweep(){const P=[],I=[];
    for(let k=0;k<NS;k++){const Pk=stats(SG[k],st.rho),y=curve(Pk,SG[k]);let p=0,v=0;
      for(let i=0;i<NX;i++){const d=y[i]-Pk.mean[i];p+=d*d;v+=Pk.vr[i]}
      P.push(p/NX);I.push(v/NX)}
    SW={P:P,I:I}}

  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--r3)',l:'\\(p(t\\mid x)\\)'},{c:'var(--truth)',l:'\\(\\mathbb E_t[t\\mid x]\\)'},
    {c:'var(--fit)',l:'\\(y(x)\\)'},{c:'var(--obs)',t:'dot',l:'samples'}]);
  const A=new Plot(b.pc,{h:260,xlim:[0,1],ylim:[-2.6,2.6],xl:'\\(x\\)',yl:'\\(t\\)',
    xt:[0,.25,.5,.75,1],yt:[-2,-1,0,1,2],pad:[16,18,28,40]});

  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--fit)',l:'\\(\\mathbb E[L]\\)'},{c:'var(--accent)',l:'prediction error'},
    {c:'var(--muted)',t:'dash',l:'intrinsic variance'}]);
  const B=new Plot(c2,{h:220,xlim:[.1,.7],ylim:[0,1],xl:'\\(\\sigma\\)',yl:'\\(\\mathbb E[L]\\), \\(q=2\\)',
    xt:[.1,.25,.4,.55,.7],yt:[0,.5,1],pad:[16,18,28,46]});

  const ways=btnrow(b.pn,[{l:'Conditional mean',on:()=>pick(0)},{l:'Conditional median',on:()=>pick(1)},
    {l:'Conditional mode',on:()=>pick(2)},{l:'Fitted \\(y(x,\\mathbf{w}^*)\\)',on:()=>pick(3)}]);
  b.pn.appendChild(el('div','hr'));
  slider(b.pn,{label:'Noise level \\(\\sigma\\)',min:.1,max:.7,step:.01,value:st.sig,
    fmt:v=>fmt(v,2),on:v=>{st.sig=v;build();draw()}});
  slider(b.pn,{label:'Weight of the second branch \\(\\rho\\)',min:0,max:.5,step:.01,value:st.rho,
    fmt:v=>fmt(v,2),on:v=>{st.rho=v;build();sweep();draw()}});
  slider(b.pn,{label:'Loss exponent \\(q\\)',min:.1,max:4,step:.1,value:st.q,
    fmt:v=>fmt(v,1),on:v=>{st.q=v;draw()}});
  slider(b.pn,{label:'Order \\(M\\) of the fitted \\(y(x,\\mathbf{w}^*)\\)',min:0,max:9,step:1,value:st.M,
    on:v=>{st.M=v;build();sweep();draw()}});
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'lq',l:'\\(\\mathbb E[L_q]\\) for this \\(y(x)\\)',big:true},
    {k:'pe',l:'Prediction error, \\(q=2\\)'},{k:'iv',l:'Intrinsic variance, \\(q=2\\)'},
    {k:'sm',l:'Sum of the two terms'},{k:'tq',l:'\\(\\mathbb E[L]\\) by quadrature'}]);
  b.pn.appendChild(el('div','hr'));
  const cmp=readout(b.pn,[{k:'cm',l:'\\(\\mathbb E[L_q]\\) at the mean'},
    {k:'cd',l:'\\(\\mathbb E[L_q]\\) at the median'},{k:'co',l:'\\(\\mathbb E[L_q]\\) at the mode'},
    {k:'cf',l:'\\(\\mathbb E[L_q]\\) at \\(y(x,\\mathbf{w}^*)\\)'}]);

  eqbar(root,'The expected loss and the two terms it is made of',
    '\\( \\mathbb E[L_q]=\\int\\!\\!\\int|y(x)-t|^{q}p(x,t)\\,dx\\,dt \\), and for \\(q=2\\)<br>'+
    '\\( \\mathbb E[L]=\\int\\{y(x)-\\mathbb E_t[t|x]\\}^{2}p(x)dx+\\int\\!\\!\\int\\{\\mathbb E_t[t|x]-t\\}^{2}p(x)\\,dt\\,dx \\)<br>'+
    'where \\( p(t|x)=(1-\\rho)\\mathcal N\\!\\left(t|\\sin(2\\pi x),\\sigma^{2}\\right)+'+
    '\\rho\\,\\mathcal N\\!\\left(t|-\\sin(2\\pi x),\\sigma^{2}\\right) \\)');
  note(root,['The second term never moves with \\(y(x)\\): it is the noise floor.',
    'Only the conditional mean drives the first term to zero, and only at \\(q=2\\).',
    'Raise \\(\\rho\\): \\(p(t|x)\\) turns bimodal and the mean falls between the branches.',
    'Lower \\(q\\) towards 0 and the mode wins, \\(q=1\\) the median, \\(q=2\\) the mean.']);

  function pick(k){st.way=k;
    Array.prototype.forEach.call(ways.children,(n,i)=>n.classList.toggle('on',i===k));
    sweep();draw()}

  function draw(){const Y=st.way===0?S.mean:st.way===1?S.med:st.way===2?S.mod:FY;
    let pe=0,iv=0;
    for(let i=0;i<NX;i++){const d=Y[i]-S.mean[i];pe+=d*d;iv+=S.vr[i]}
    pe/=NX;iv/=NX;cur={pe:pe,iv:iv,Y:Y};
    const v=[EL(S.mean,st.q),EL(S.med,st.q),EL(S.mod,st.q),EL(FY,st.q)],mn=Math.min.apply(null,v);
    const tag=z=>fmt(z,4)+(z<=mn*1.0002?'  min':'');
    out({lq:fmt(v[st.way],4),pe:fmt(pe,4),iv:fmt(iv,4),sm:fmt(pe+iv,4),tq:fmt(EL(Y,2),4)});
    cmp({cm:tag(v[0]),cd:tag(v[1]),co:tag(v[2]),cf:tag(v[3])});
    let top=0;for(let k=0;k<NS;k++)top=Math.max(top,SW.P[k]+SW.I[k]);
    top=Math.max(top*1.15,.1);B.o.ylim=[0,top];
    B.o.yt=[0,Math.round(top/2*100)/100,Math.round(top*100)/100];
    A.draw();B.draw()}

  A.render=p=>{const c=p.col;
    p.heat(HM.m,HX,HY,0,HM.mx);
    p.dots(XN,sample(st.sig),c.obs,3.6);
    p.path(x=>(1-2*st.rho)*S1(x),c.truth,1.8);
    p.line(XS.map((x,i)=>[x,cur.Y[i]]),c.fit,2.6)};
  A.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'E[t|x] = '+fmt((1-2*st.rho)*S1(x),3),c:A.col.truth},
    {t:'y(x) = '+fmt(cur.Y[clamp(Math.round(x*NX-.5),0,NX-1)],3),c:A.col.fit}];

  B.render=p=>{const c=p.col,pt=f=>SG.map((s,i)=>[s,f(i)]);
    p.line(pt(i=>SW.P[i]+SW.I[i]),c.fit,2.6);
    p.line(pt(i=>SW.P[i]),c.acc,2);
    p.line(pt(i=>SW.I[i]),c.muted,2,[5,4]);
    p.seg(st.sig,0,p.o.ylim[1],c.acc,1.4,[4,4]);
    p.mark(st.sig,cur.iv,c.muted,4.4);p.mark(st.sig,cur.pe,c.acc,4.4);
    p.mark(st.sig,cur.pe+cur.iv,c.fit,5)};
  B.hoverFmt=x=>{const i=clamp(Math.round((x-.1)/.6*(NS-1)),0,NS-1);
    return[{t:'sigma = '+fmt(SG[i],2)},{t:'E[L] = '+fmt(SW.P[i]+SW.I[i],4),c:B.col.fit},
      {t:'prediction error = '+fmt(SW.P[i],4),c:B.col.acc},
      {t:'intrinsic variance = '+fmt(SW.I[i],4),c:B.col.muted}]};

  build();sweep();pick(0)}
