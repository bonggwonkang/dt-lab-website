/* PRML simulators, slides 56, 58 and 59: the curse of dimensionality,
   gathered into one module because all three say the same thing about D. */
import{el,fmt,clamp,Plot,board,legend,slider,readout,eqbar,note}from'./core.js'

/* the binomial coefficient, exact over the range the sliders allow */
function comb(n,k){k=Math.min(k,n-k);let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)}
const fact=m=>{let r=1;for(let i=2;i<=m;i++)r*=i;return r};
const big=v=>v>=1e6?v.toExponential(2):String(Math.round(v));
/* the unnormalised radial density of a standard Gaussian in D dimensions */
const rad=(r,D)=>Math.pow(r,D-1)*Math.exp(-r*r/2);
function mass(a,b,D){const n=800,h=(b-a)/n;let s=0;
  for(let i=0;i<=n;i++)s+=(i===0||i===n?.5:1)*rad(a+i*h,D);return s*h}

export function p56(root){
  const st={D:3,M:3,eps:.2,a:0,b:1};
  const REF=[1,2,20].map(D=>({D:D,Z:mass(0,40,D),m:Math.sqrt(Math.max(D-1,.04))}));
  const DS=[1,2,5,20];
  const b=board(root,'Controls');

  /* slide 56: how many coefficients a polynomial of order M in D variables has */
  legend(b.pc,[{c:'var(--accent)',l:'\\(\\binom{D+M}{M}\\)'},
    {c:'var(--muted)',t:'dash',l:'\\(D^{M}/M!\\)'},{c:'var(--fit)',t:'dash',l:'\\(D\\)'}]);
  const A=new Plot(b.pc,{h:240,xlim:[.4,20.6],ylim:[0,8],xl:'\\(D\\)',
    yl:'\\(\\log_{10}(\\text{coefficients})\\)',xt:[1,5,10,15,20],yt:[0,4,8],pad:[16,18,28,46]});

  /* slide 58: the fraction of the volume of a sphere that sits in a thin shell */
  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--accent)',l:'\\(1-(1-\\epsilon)^{D}\\)'},
    {c:'var(--muted)',l:'\\(D=1,2,5,20\\)'},{c:'var(--fit)',t:'dash',l:'\\(\\epsilon\\)'}]);
  const B=new Plot(c2,{h:230,xlim:[-.02,1.02],ylim:[-.02,1.04],xl:'\\(\\epsilon\\)',
    yl:'\\(\\text{volume fraction}\\)',xt:[0,.25,.5,.75,1],yt:[0,.5,1],pad:[16,18,28,46]});

  /* slide 59: where the probability mass of a Gaussian sits, as a function of r */
  const c3=el('div','card plotcard');b.lc.appendChild(c3);
  legend(c3,[{c:'var(--accent)',l:'\\(p(r)\\)'},{c:'var(--muted)',l:'\\(D=1,2,20\\)'},
    {c:'var(--fit)',t:'dash',l:'\\(r\\)'}]);
  const C=new Plot(c3,{h:230,xlim:[-.05,8.05],ylim:[-.02,.88],xl:'\\(r\\)',yl:'\\(p(r)\\)',
    xt:[0,2,4,6,8],yt:[0,.4,.8],pad:[16,18,28,46]});

  const sD=slider(b.pn,{label:'Dimension \\(D\\)',min:1,max:20,step:1,value:st.D,on:v=>{st.D=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;draw()}});
  const oA=readout(b.pn,[{k:'c',l:'\\(\\binom{D+M}{M}\\)',big:true},
    {k:'e',l:'Terms of order exactly \\(M\\)'},{k:'p',l:'\\(D^{M}\\)'}]);
  b.pn.appendChild(el('div','hr'));
  const sE=slider(b.pn,{label:'Shell thickness \\(\\epsilon\\)',min:0,max:1,step:.01,value:st.eps,
    fmt:v=>fmt(v,2),on:v=>{st.eps=v;draw()}});
  const oB=readout(b.pn,[{k:'f',l:'\\(1-(1-\\epsilon)^{D}\\)',big:true},
    {k:'i',l:'\\((1-\\epsilon)^{D}\\)'}]);
  b.pn.appendChild(el('div','hr'));
  const sA=slider(b.pn,{label:'Inner radius \\(r_1\\)',min:0,max:8,step:.05,value:st.a,
    fmt:v=>fmt(v,2),on:v=>{st.a=Math.min(v,st.b);sA.set(st.a);draw()}});
  const sB=slider(b.pn,{label:'Outer radius \\(r_2\\)',min:0,max:8,step:.05,value:st.b,
    fmt:v=>fmt(v,2),on:v=>{st.b=Math.max(v,st.a);sB.set(st.b);draw()}});
  const oC=readout(b.pn,[{k:'m',l:'\\(\\int_{r_1}^{r_2}p(r)\\,dr\\)',big:true},
    {k:'pk',l:'Peak at \\(r=\\sqrt{D-1}\\)'}]);

  eqbar(root,'Three ways the dimension bites',
    '\\( y(\\mathbf{x},\\mathbf{w})=w_0+\\sum_{i=1}^{D}w_ix_i+\\sum_{i=1}^{D}\\sum_{j=1}^{D}w_{ij}x_ix_j+\\cdots\\), '+
    'with \\( \\binom{D+M}{M}\\) independent coefficients up to order \\(M\\), which grows like \\(D^{M}\\)<br>'+
    '\\( \\dfrac{V_D(1)-V_D(1-\\epsilon)}{V_D(1)}=1-(1-\\epsilon)^{D}\\), '+
    '\\( p(r)\\propto r^{D-1}\\exp\\!\\left(-\\dfrac{r^{2}}{2}\\right)\\)');
  note(root,['Coefficients grow like \\(D^{M}\\): 4 at \\(D=1\\), 286 at \\(D=10\\).',
    'At \\(\\epsilon=0.1\\) the shell holds 10% of the volume at \\(D=1\\), 88% at \\(D=20\\).',
    'Gaussian mass leaves the centre for a shell at \\(r=\\sqrt{D-1}\\).',
    'In high \\(D\\) almost every point is near the boundary.']);

  function draw(){const D=st.D,M=st.M,c=comb(D+M,M);
    oA({c:big(c),e:big(comb(D+M-1,M)),p:big(Math.pow(D,M))});
    oB({f:fmt(1-Math.pow(1-st.eps,D),4),i:fmt(Math.pow(1-st.eps,D),4)});
    st.Z=mass(0,40,D);
    oC({m:fmt(mass(st.a,st.b,D)/st.Z,4),pk:fmt(Math.sqrt(Math.max(D-1,0)),2)});
    const hi=Math.log(comb(20+M,M))/Math.LN10;
    A.o.ylim=[-.04*hi-.05,hi*1.06];A.o.yt=[0,Math.round(hi/2),Math.round(hi)];
    A.draw();B.draw();C.draw()}

  A.render=p=>{const c=p.col,M=st.M,lg=v=>Math.log(v)/Math.LN10;
    p.seg(st.D,p.o.ylim[0],p.o.ylim[1],c.fit,1.5,[4,4]);
    const pts=[],ref=[];
    for(let D=1;D<=20;D++){pts.push([D,lg(comb(D+M,M))]);ref.push([D,lg(Math.pow(D,M)/fact(M))])}
    p.line(ref,c.muted,1.6,[5,4]);p.line(pts,c.acc,2.6);
    p.mark(st.D,lg(comb(st.D+M,M)),c.acc,4.5)};
  A.hoverFmt=x=>{const D=clamp(Math.round(x),1,20);
    return[{t:'D = '+D},{t:'coefficients '+big(comb(D+st.M,st.M)),c:A.col.acc}]};
  A.onClick=x=>{st.D=clamp(Math.round(x),1,20);sD.set(st.D);draw()};

  B.render=p=>{const c=p.col;
    DS.forEach(D=>{p.path(e=>1-Math.pow(1-e,D),c.muted,1.3);
      const e=D<=2?.86:.3/D+.02;p.label(e,1-Math.pow(1-e,D),'D = '+D,c.muted,'left',-9)});
    p.seg(st.eps,-.02,1.04,c.fit,1.5,[4,4]);
    p.path(e=>1-Math.pow(1-e,st.D),c.acc,2.6);
    p.mark(st.eps,1-Math.pow(1-st.eps,st.D),c.acc,4.5)};
  B.hoverFmt=x=>{const e=clamp(x,0,1);
    return[{t:'ε = '+fmt(e,2)},{t:'fraction '+fmt(1-Math.pow(1-e,st.D),3),c:B.col.acc}]};
  B.onClick=x=>{st.eps=clamp(Math.round(x*100)/100,0,1);sE.set(st.eps);draw()};

  C.render=p=>{const c=p.col,f=r=>rad(r,st.D)/st.Z;
    REF.forEach(q=>{p.path(r=>rad(r,q.D)/q.Z,c.muted,1.3);
      p.label(q.m,rad(q.m,q.D)/q.Z,'D = '+q.D,c.muted,'left',-9)});
    p.band(()=>0,r=>(r>=st.a&&r<=st.b?f(r):0),c.acc,.28);
    p.seg(st.a,-.02,.88,c.fit,1.2,[4,4]);p.seg(st.b,-.02,.88,c.fit,1.2,[4,4]);
    p.path(f,c.acc,2.6)};
  C.hoverFmt=x=>{const r=clamp(x,0,8);
    return[{t:'r = '+fmt(r,2)},{t:'p(r) = '+fmt(rad(r,st.D)/st.Z,3),c:C.col.acc}]};

  draw()}
