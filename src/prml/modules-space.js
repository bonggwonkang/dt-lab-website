/* PRML simulator for slide 36, second part: the space of functions that the
   basis functions span, and the coefficients that move y inside it. */
import{el,fmt,clamp,sin2pi,fit,polyval,Plot,board,legend,slider,toggle,btnrow,readout,eqbar,note,wPanel,applyFit}from'./core.js'

/* the inner product two functions have on [0,1], by the trapezoidal rule */
const NG=401,XG=[],GT=[];
for(let i=0;i<NG;i++){const x=i/(NG-1);XG.push(x);GT.push(sin2pi(x))}
const ip=(f,h)=>{let s=0;
  for(let i=0;i<NG;i++)s+=((i===0||i===NG-1)?.5:1)*f(XG[i])*h(XG[i]);return s/(NG-1)};
const dist=w=>Math.sqrt(Math.max(0,ip(x=>polyval(w,x)-sin2pi(x),x=>polyval(w,x)-sin2pi(x))));

/* the closest point of each space, which never changes */
const WSTAR=[],FLOOR=[];
for(let M=0;M<=9;M++){const w=fit(XG,GT,M,1e-12);WSTAR.push(w);FLOOR.push(dist(w))}

export function p36b(root){
  const st={M:3,w:[0,0,0,0],rng:3,rngMin:3,basis:true};

  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},{c:'var(--fit)',l:'\\(y(x,\\mathbf{w})\\)'},
    {c:'var(--accent)',t:'dash',l:'\\(y(x,\\mathbf{w}^{*})\\)'},{c:'var(--r3)',l:'\\(\\phi_j(x)\\)'}]);
  const A=new Plot(b.pc,{h:250,xlim:[0,1],ylim:[-1.7,1.7],xl:'\\(x\\)',yl:'\\(y\\)',
    xt:[0,.25,.5,.75,1],yt:[-1,0,1],pad:[16,18,28,38]});

  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--accent)',l:'\\(\\lVert y(x,\\mathbf{w}^{*})-\\sin(2\\pi x)\\rVert\\)'},
    {c:'var(--fit)',t:'dot',l:'\\(\\lVert y(x,\\mathbf{w})-\\sin(2\\pi x)\\rVert\\)'}]);
  const B=new Plot(c2,{h:200,xlim:[-.4,9.4],ylim:[0,.9],xl:'\\(M\\)',
    yl:'\\(\\lVert y-\\sin(2\\pi x)\\rVert\\)',xt:[0,1,2,3,4,5,6,7,8,9],yt:[0,.3,.6,.9],
    pad:[16,18,28,46]});

  const sM=slider(b.pn,{label:'\\(M\\)',min:0,max:9,step:1,value:st.M,on:v=>{
    const w=st.w.slice(0,v+1);while(w.length<v+1)w.push(0);
    st.M=v;st.w=w;W.rebuild();draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Set \\(\\mathbf{w}^{*}\\)',on:()=>{
    st.w=WSTAR[st.M].slice();
    st.rng=Math.max(st.rngMin,Math.max.apply(null,st.w.map(v=>Math.abs(v)))*1.2||3);
    W.sync();draw()}},
    {l:'Set \\(\\mathbf{w}=\\mathbf{0}\\)',on:()=>{
      st.w=st.w.map(()=>0);st.rng=st.rngMin;W.sync();draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[
    {k:'d',l:'\\(\\lVert y(x,\\mathbf{w})-\\sin(2\\pi x)\\rVert\\)',big:true},
    {k:'f',l:'\\(\\lVert y(x,\\mathbf{w}^{*})-\\sin(2\\pi x)\\rVert\\)'},
    {k:'o',l:'\\(\\max_j|\\langle\\sin(2\\pi x)-y,\\phi_j\\rangle|\\)'},
    {k:'n',l:'\\(M+1\\)'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show \\(\\phi_j(x)\\)',st.basis,v=>{st.basis=v;A.draw()});

  eqbar(root,'The space the basis functions span',
    '\\( y(x,\\mathbf{w})=\\sum_{j=0}^{M}w_j\\phi_j(x)=\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{w} \\), '+
    'so \\(\\mathbf{w}\\) are the coordinates of \\(y\\) in the basis '+
    '\\(\\phi_0,\\dots,\\phi_M\\)<br>'+
    'every \\(\\mathbf{w}\\) gives one function of that space, and the space has dimension \\(M+1\\)<br>'+
    'with \\( \\langle f,h\\rangle=\\int_0^1 f(x)h(x)\\,dx \\) and '+
    '\\( \\lVert f\\rVert=\\langle f,f\\rangle^{1/2} \\), the closest function '+
    '\\(y(x,\\mathbf{w}^{*})\\) leaves \\(\\sin(2\\pi x)-y\\) orthogonal to every \\(\\phi_j\\)');
  note(root,['Move any \\(w_j\\): \\(y\\) moves inside the space and never leaves it.',
    '\\(\\sin(2\\pi x)\\) is outside the space, so the distance has a floor.',
    'The red point never falls below that floor, whatever you set by hand.',
    'Raise \\(M\\) for one more \\(\\phi_j\\), though some add nothing this target can use.']);

  function draw(){const d=dist(st.w);
    let mo=0;for(let j=0;j<=st.M;j++){
      const v=Math.abs(ip(x=>sin2pi(x)-polyval(st.w,x),x=>Math.pow(x,j)));if(v>mo)mo=v}
    out({d:fmt(d,4),f:fmt(FLOOR[st.M],4),o:fmt(mo,4),n:st.M+1});
    A.draw();B.draw()}

  A.render=p=>{const c=p.col;
    if(st.basis)for(let j=0;j<=st.M;j++)
      p.path(x=>Math.pow(x,j),c.ramp[Math.min(5,j+1)],1.3);
    p.path(sin2pi,c.truth,2.2);
    p.path(x=>polyval(WSTAR[st.M],x),c.acc,1.8,[5,4]);
    p.path(x=>polyval(st.w,x),c.fit,2.8)};
  A.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'sin(2πx) = '+fmt(sin2pi(x),3),c:A.col.truth},
    {t:'y(x, w) = '+fmt(polyval(st.w,x),3),c:A.col.fit}];

  B.render=p=>{const c=p.col;
    p.line(FLOOR.map((v,M)=>[M,v]),c.acc,2.4);
    FLOOR.forEach((v,M)=>p.mark(M,v,c.acc,3.6));
    p.mark(st.M,clamp(dist(st.w),0,.9),c.fit,5.4)};
  B.hoverFmt=x=>{const M=clamp(Math.round(x),0,9);
    return[{t:'M = '+M},{t:'||y(w*) - sin|| = '+fmt(FLOOR[M],4),c:B.col.acc}]};

  draw()}
