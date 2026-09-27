/* PRML simulators for decision theory applied to regression:
   slide 86, the expected loss and the two terms it is made of, and
   slides 88 to 90, the Minkowski loss and the conditional mean, median and mode. */
import{el,fmt,clamp,sin2pi,makeData,fit,polyval,gaussPdf,Plot,board,legend,slider,btnrow,readout,eqbar,note}from'./core.js'

/* ============ slide 86: the expected loss and its two terms ============ */
const GX=201,GU=81,XG=[];
for(let i=0;i<GX;i++)XG.push((i+.5)/GX);
const SS=[];for(let k=0;k<21;k++)SS.push(.05+.55*k/20);

export function p86(root){
  const st={sig:.25,M:3,N:20};

  /* the expected squared loss, by quadrature over t at every x */
  function loss(w){const s=st.sig,du=10*s/(GU-1),U=[],W=[];let z=0;
    for(let j=0;j<GU;j++){const u=-5*s+j*du,v=gaussPdf(u,0,s);U.push(u);W.push(v);z+=v}
    for(let j=0;j<GU;j++)W[j]/=z;
    let pe=0,iv=0,tot=0;
    for(let i=0;i<GX;i++){const d=polyval(w,XG[i])-sin2pi(XG[i]);pe+=d*d;
      for(let j=0;j<GU;j++){const e=d-U[j];tot+=W[j]*e*e}}
    for(let j=0;j<GU;j++)iv+=W[j]*U[j]*U[j];
    return{pe:pe/GX,iv:iv,tot:tot/GX}}

  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},{c:'var(--truth)',l:'\\(\\mathbb E_t[t\\mid x]\\)'},
    {c:'var(--fit)',l:'\\(y(x,\\mathbf{w}^*)\\)'},{c:'var(--muted)',l:'\\(\\pm\\sigma\\)'}]);
  const A=new Plot(b.pc,{h:250,xlim:[0,1],ylim:[-1.9,1.9],xl:'\\(x\\)',yl:'\\(t\\)',
    xt:[0,.25,.5,.75,1],yt:[-1,0,1],pad:[16,18,28,38]});

  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--fit)',l:'\\(\\mathbb E[L]\\)'},{c:'var(--accent)',l:'prediction error'},
    {c:'var(--muted)',t:'dash',l:'intrinsic variance'}]);
  const B=new Plot(c2,{h:210,xlim:[.05,.6],ylim:[0,1],xl:'\\(\\sigma\\)',yl:'\\(\\mathbb E[L]\\)',
    xt:[.1,.2,.3,.4,.5,.6],yt:[0,.5,1],pad:[16,18,28,46]});

  slider(b.pn,{label:'\\(\\sigma\\)',min:.05,max:.6,step:.01,value:st.sig,
    fmt:v=>fmt(v,2),on:v=>{st.sig=v;draw()}});
  slider(b.pn,{label:'Order \\(M\\)',min:0,max:9,step:1,value:st.M,
    on:v=>{st.M=v;draw()}});
  slider(b.pn,{label:'\\(N\\)',min:4,max:50,step:1,value:st.N,
    on:v=>{st.N=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'tot',l:'\\(\\mathbb E[L]\\) for \\(y(x,\\mathbf{w}^*)\\)',big:true},
    {k:'pe',l:'Prediction error'},{k:'iv',l:'Intrinsic variance'},
    {k:'sm',l:'Sum of the two terms'}]);
  b.pn.appendChild(el('div','hr'));
  const cmp=readout(b.pn,[{k:'ct',l:'\\(\\mathbb E[L]\\) for \\(y(x)=\\mathbb E_t[t\\mid x]\\)'},
    {k:'cp',l:'Prediction error'}]);

  eqbar(root,'The expected loss and the two terms it is made of',
    '\\( \\mathbb E[L]=\\int\\!\\!\\int\\{y(x)-t\\}^{2}p(x,t)\\,dx\\,dt \\)<br>'+
    '\\( =\\underbrace{\\int\\{y(x)-\\mathbb E_t[t|x]\\}^{2}p(x)dx}_{\\text{prediction error}}'+
    '+\\underbrace{\\int\\!\\!\\int\\{\\mathbb E_t[t|x]-t\\}^{2}p(x)\\,dt\\,dx}_{\\text{intrinsic variance}} \\)<br>'+
    'with \\( t_n=\\sin(2\\pi x_n)+\\epsilon \\), \\( \\epsilon\\sim\\mathcal N(0,\\sigma^{2}) \\), '+
    'so that \\( \\mathbb E_t[t|x]=\\sin(2\\pi x) \\)');
  note(root,['Only the first term moves with \\(y(x)\\), and it is zero at \\(y(x)=\\mathbb E_t[t|x]\\).',
    'The second term is the noise itself, so it is a floor no \\(y(x)\\) can go below.',
    'Raise \\(\\sigma\\): the floor rises as \\(\\sigma^{2}\\) and the fitted curve also gets worse.',
    'Raise \\(M\\) with a small \\(N\\): over-fitting shows up in the first term alone.']);

  let cur={};
  function draw(){const d=makeData(st.N,st.sig,3),w=fit(d.xs,d.ts,st.M,1e-8),L=loss(w);
    const P=[],I=[];
    for(let k=0;k<SS.length;k++){const s=SS[k],dk=makeData(st.N,s,3),wk=fit(dk.xs,dk.ts,st.M,1e-8);
      let pe=0;for(let i=0;i<GX;i++){const e=polyval(wk,XG[i])-sin2pi(XG[i]);pe+=e*e}
      P.push(pe/GX);I.push(s*s)}
    cur={d:d,w:w,P:P,I:I,pe:L.pe,iv:L.iv};
    out({tot:fmt(L.tot,4),pe:fmt(L.pe,4),iv:fmt(L.iv,4),sm:fmt(L.pe+L.iv,4)});
    cmp({ct:fmt(L.iv,4),cp:fmt(0,4)});
    let top=0;for(let k=0;k<SS.length;k++)top=Math.max(top,P[k]+I[k]);
    top=Math.max(top*1.15,.1);B.o.ylim=[0,top];
    B.o.yt=[0,Math.round(top/2*100)/100,Math.round(top*100)/100];
    A.draw();B.draw()}

  A.render=p=>{const c=p.col,s=st.sig;
    p.band(x=>sin2pi(x)-s,x=>sin2pi(x)+s,c.muted,.12);
    p.path(sin2pi,c.truth,2);
    p.path(x=>polyval(cur.w,x),c.fit,2.6);
    p.dots(cur.d.xs,cur.d.ts,c.obs,4)};
  A.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'E[t|x] = '+fmt(sin2pi(x),3),c:A.col.truth},
    {t:'y(x, w*) = '+fmt(polyval(cur.w,x),3),c:A.col.fit}];

  B.render=p=>{const c=p.col,pt=f=>SS.map((s,i)=>[s,f(i)]);
    p.line(pt(i=>cur.P[i]+cur.I[i]),c.fit,2.6);
    p.line(pt(i=>cur.P[i]),c.acc,2);
    p.line(pt(i=>cur.I[i]),c.muted,2,[5,4]);
    p.seg(st.sig,0,p.o.ylim[1],c.acc,1.4,[4,4]);
    p.mark(st.sig,cur.iv,c.muted,4.4);p.mark(st.sig,cur.pe,c.acc,4.4);
    p.mark(st.sig,cur.pe+cur.iv,c.fit,5)};
  B.hoverFmt=x=>{const i=clamp(Math.round((x-.05)/.55*(SS.length-1)),0,SS.length-1);
    return[{t:'sigma = '+fmt(SS[i],2)},{t:'E[L] = '+fmt(cur.P[i]+cur.I[i],4),c:B.col.fit},
      {t:'prediction error = '+fmt(cur.P[i],4),c:B.col.acc},
      {t:'intrinsic variance = '+fmt(cur.I[i],4),c:B.col.muted}]};

  draw()}

/* ====== slides 88 to 90: the Minkowski loss and where its minimum sits ====== */
const NT=361,TT=[],DT=7.2/(NT-1),NXQ=81,XQ=[];
for(let j=0;j<NT;j++)TT.push(-3.6+j*DT);
for(let i=0;i<NXQ;i++)XQ.push((i+.5)/NXQ);
const SL=[.15,.25,.60,.75],BASE=[.35,1.45,2.55,3.65],HGT=.95;
const W1=.6,W2=.4;   /* the two modes of the multimodal p(t|x) */

export function p88(root){
  const st={q:2,sig:.22,multi:1};

  /* p(t|x) on the t grid, and its conditional mean, median and mode */
  function slice(x){const a=sin2pi(x),w=new Float64Array(NT);let z=0;
    for(let j=0;j<NT;j++){const v=st.multi?W1*gaussPdf(TT[j],a,st.sig)+W2*gaussPdf(TT[j],-a,st.sig)
      :gaussPdf(TT[j],a,st.sig);w[j]=v;z+=v}
    let m=0,bi=0,bv=-1;
    for(let j=0;j<NT;j++){w[j]/=z;m+=TT[j]*w[j];if(w[j]>bv){bv=w[j];bi=j}}
    let cum=0,md=TT[NT-1],got=false;
    for(let j=0;j<NT;j++){if(!got&&cum+w[j]>=.5){md=TT[j]-DT/2+DT*(.5-cum)/w[j];got=true}cum+=w[j]}
    const p0=bi>0?w[bi-1]:0,p2=bi<NT-1?w[bi+1]:0,dn=p0-2*w[bi]+p2;
    return{w:w,mean:m,med:md,mode:TT[bi]+(dn<0?DT*.5*(p0-p2)/dn:0)}}

  const EL=(S,y,q)=>{let e=0;for(let j=0;j<NT;j++)e+=S.w[j]*Math.pow(Math.abs(y-TT[j]),q);return e};
  const dens=(S,y)=>{const j=clamp(Math.round((y+3.6)/DT),0,NT-1);return S.w[j]/DT};
  function argmin(S,q){let by=TT[0],bv=Infinity;
    for(let j=0;j<NT;j+=2){const v=EL(S,TT[j],q);if(v<bv){bv=v;by=TT[j]}}
    return by}

  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--obs)',l:'\\(p(t\\mid x)\\)'},
    {c:'var(--fit)',l:'\\(y(x)\\) minimising \\(\\mathbb E[L_q]\\)'}]);
  const A=new Plot(b.pc,{h:300,xlim:[-2.2,2.2],ylim:[0,4.7],xl:'\\(t\\)',yl:'\\(p(t\\mid x)\\)',
    xt:[-2,-1,0,1,2],yt:[],pad:[16,18,28,34]});

  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--fit)',l:'\\(L_q=|y-t|^{q}\\)'}]);
  const B=new Plot(c2,{h:190,xlim:[-2,2],ylim:[0,2],xl:'\\(y-t\\)',yl:'\\(|y-t|^{q}\\)',
    xt:[-2,-1,0,1,2],yt:[0,1,2],pad:[16,18,28,34]});

  const ways=btnrow(b.pn,[{l:'Unimodal \\(p(t\\mid x)\\)',on:()=>pick(0)},
    {l:'Multimodal \\(p(t\\mid x)\\)',on:()=>pick(1)}]);
  b.pn.appendChild(el('div','hr'));
  slider(b.pn,{label:'\\(q\\)',min:.1,max:4,step:.1,value:st.q,
    fmt:v=>fmt(v,1),on:v=>{st.q=v;draw()}});
  slider(b.pn,{label:'\\(\\sigma\\)',min:.1,max:.5,step:.01,value:st.sig,
    fmt:v=>fmt(v,2),on:v=>{st.sig=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'a',l:'\\(\\mathbb E[L_q]\\) at \\(\\mathbb E_t[t\\mid x]\\)'},
    {k:'b',l:'\\(\\mathbb E[L_q]\\) at \\(\\mathrm{median}[t\\mid x]\\)'},
    {k:'c',l:'\\(\\mathbb E[L_q]\\) at \\(\\mathrm{argmax}_t\\,p(t\\mid x)\\)'}]);
  b.pn.appendChild(el('div','hr'));
  const den=readout(b.pn,[{k:'a',l:'\\(p(t\\mid x)\\) at \\(\\mathbb E_t[t\\mid x]\\)'},
    {k:'b',l:'\\(p(t\\mid x)\\) at \\(\\mathrm{median}[t\\mid x]\\)'},
    {k:'c',l:'\\(p(t\\mid x)\\) at \\(\\mathrm{argmax}_t\\,p(t\\mid x)\\)'}]);

  eqbar(root,'The Minkowski loss and where its minimum sits',
    '\\( \\mathbb E[L_q]=\\int\\!\\!\\int|y(x)-t|^{q}p(x,t)\\,dx\\,dt \\), which is the squared loss for \\(q=2\\)<br>'+
    'its minimum is \\( \\mathbb E_t[t|x] \\) for \\(q=2\\), \\( \\mathrm{median}[t|x] \\) for \\(q=1\\), '+
    'and \\( \\mathrm{argmax}_t\\,p(t|x) \\) for \\(q=0\\)<br>'+
    'here \\( p(t|x)=0.6\\,\\mathcal N\\!\\left(t|\\sin(2\\pi x),\\sigma^{2}\\right)'+
    '+0.4\\,\\mathcal N\\!\\left(t|-\\sin(2\\pi x),\\sigma^{2}\\right) \\) when it is multimodal');
  note(root,['Each curve is \\(p(t|x)\\) at one fixed \\(x\\), and the red mark is the best \\(y(x)\\).',
    'With \\(q=2\\) and two modes the mark falls between them, where almost no mass lies.',
    'Lower \\(q\\) towards 0 and the mark jumps onto a mode, a value that \\(t\\) can take.',
    'The lower panel is \\(|y-t|^{q}\\) itself: small \\(q\\) barely punishes a far miss.']);

  let cur={};
  function pick(k){st.multi=k;
    Array.prototype.forEach.call(ways.children,(n,i)=>n.classList.toggle('on',i===k));
    draw()}

  function draw(){const S=SL.map(slice);
    let mx=1e-9;S.forEach(s=>{for(let j=0;j<NT;j++)mx=Math.max(mx,s.w[j])});
    cur={S:S,sc:HGT/(mx/DT),y:S.map(s=>argmin(s,st.q))};
    let la=0,lb=0,lc=0,da=0,db=0,dc=0;
    for(let i=0;i<NXQ;i++){const s=slice(XQ[i]);
      la+=EL(s,s.mean,st.q);lb+=EL(s,s.med,st.q);lc+=EL(s,s.mode,st.q);
      da+=dens(s,s.mean);db+=dens(s,s.med);dc+=dens(s,s.mode)}
    const v=[la/NXQ,lb/NXQ,lc/NXQ],mn=Math.min.apply(null,v);
    const tag=z=>fmt(z,4)+(z<=mn*1.0002?'  min':'');
    out({a:tag(v[0]),b:tag(v[1]),c:tag(v[2])});
    den({a:fmt(da/NXQ,3),b:fmt(db/NXQ,3),c:fmt(dc/NXQ,3)});
    A.draw();B.draw()}

  A.render=p=>{const c=p.col;
    SL.forEach((x,k)=>{const S=cur.S[k],y=cur.y[k],
      h=t=>BASE[k]+cur.sc*(S.w[clamp(Math.round((t+3.6)/DT),0,NT-1)]/DT);
      p.line([[-2.2,BASE[k]],[2.2,BASE[k]]],c.line,1);
      p.path(h,c.obs,2.2);
      p.seg(y,BASE[k],h(y),c.fit,2.2);p.mark(y,h(y),c.fit,4.2);
      p.label(-2.15,BASE[k]+.18,'x = '+fmt(x,2),c.muted)})};
  A.hoverFmt=t=>[{t:'t = '+fmt(t,2)}];

  B.render=p=>{p.path(d=>Math.pow(Math.abs(d),st.q),p.col.fit,2.6)};
  B.hoverFmt=d=>[{t:'y - t = '+fmt(d,2)},
    {t:'|y-t|^q = '+fmt(Math.pow(Math.abs(d),st.q),3),c:B.col.fit}];

  pick(1)}
