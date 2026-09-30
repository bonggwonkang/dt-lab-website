/* PRML simulators, slides 34 to 39: the fully Bayesian treatment. */
import{el,fmt,clamp,sin2pi,makeData,polyval,phi,Plot,board,legend,slider,toggle,btnrow,
  readout,eqbar,note,wchips,matview,posterior,predict,sampleW,rng,gauss,tex,dot,quad,
  wPanel,applyFit}from'./core.js'

const ALPHA0=Math.log(5e-3);          /* the prior precision used in Figure 1.17 */
const BETA0=11.1;                     /* the known noise precision used in Figure 1.17 */

/* draw K curves from the posterior over w, with a fixed seed so they stay put */
function curves(post,M,K,seed){const r=rng(seed),out=[];
  for(let k=0;k<K;k++)out.push(sampleW(post,r));return out}

/* ===== slide 34 · How the uncertainty in w shrinks with data ===== */
export function p34(root){
  const st={N:2,M:9,lnAlpha:ALPHA0,beta:BETA0,K:24,seed:3,mean:true};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--accent)',l:'\\(y(x,\\mathbf{w}),\\ \\mathbf{w}\\sim p(\\mathbf{w}\\mid\\mathbf{x},\\mathbf{t})\\)'},{c:'var(--fit)',l:'\\(m(x)\\)'},
    {c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},{c:'var(--obs)',t:'dot',l:'\\(t_n\\)'}]);
  const P=new Plot(b.pc,{h:360,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const sN=slider(b.pn,{label:'\\(N\\)',min:0,max:25,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;gen()}});
  slider(b.pn,{label:'\\(\\ln\\alpha\\)',min:-10,max:6,step:.25,value:st.lnAlpha,fmt:v=>fmt(v,2),
    on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'\\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  slider(b.pn,{label:'Curves drawn',min:1,max:60,step:1,value:st.K,on:v=>{st.K=v;draw()}});
  btnrow(b.pn,[{l:'Draw a new data set',on:()=>{st.seed++;gen()}},
    {l:'\\(N=0\\)',on:()=>{st.N=0;sN.set(0);gen()}},
    {l:'\\(N=15\\)',on:()=>{st.N=15;sN.set(15);gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'n',l:'\\(N\\)'},{k:'sd0',l:'\\(\\sqrt{S_{00}}\\)'},
    {k:'sdm',l:'\\(\\max_j\\sqrt{S_{jj}}\\)'},{k:'s1',l:'Standard deviation at \\(x=0.5\\)',big:true},
    {k:'s2',l:'Standard deviation at \\(x=1\\)'}]);
  const cm=wchips(b.pn,'Posterior mean \\(\\mathbf{m}_N\\)'),cs=wchips(b.pn,'Posterior standard deviations');
  eqbar(root,'A distribution over the coefficients, not a single value',
    '\\( p(\\mathbf{w}\\mid\\mathbf{x},\\mathbf{t},\\alpha,\\beta)\\propto '+
    'p(\\mathbf{t}\\mid\\mathbf{x},\\mathbf{w},\\beta)\\,p(\\mathbf{w}\\mid\\alpha)\\). '+
    'Because the observed targets are corrupted by noise and the data set is finite, the data cannot '+
    'determine \\(\\mathbf{w}\\) uniquely, and every curve drawn here is one \\(\\mathbf{w}\\) the data '+
    'still consider plausible.');
  note(root,['With no data the curves are whatever \\(\\alpha\\) allows.',
    'Each data point narrows the posterior distribution where it sits.',
    'The posterior distribution narrows as \\(N\\) grows.']);
  function gen(){st.d=makeData(Math.max(st.N,0),.25,st.seed);
    if(st.N===0){st.d={xs:[],ts:[],N:0,seed:st.seed}}draw()}
  function draw(){const al=Math.exp(st.lnAlpha);
    st.post=posterior(st.d.xs,st.d.ts,st.M,al,st.beta);
    st.samples=curves(st.post,st.M,st.K,st.seed*7919+st.M);
    const sd=st.post.S.map((r,i)=>Math.sqrt(Math.max(r[i],0)));
    const spread=x=>{const v=st.samples.map(w=>polyval(w,x));
      const m=v.reduce((a,q)=>a+q,0)/v.length;
      return Math.sqrt(v.reduce((a,q)=>a+(q-m)*(q-m),0)/Math.max(1,v.length-1))};
    out({n:st.d.xs.length,sd0:fmt(sd[0],3),sdm:fmt(Math.max.apply(null,sd),2),
      s1:fmt(spread(.5),3),s2:fmt(spread(1),3)});
    cm(st.post.m,2);cs(sd,2);P.draw()}
  P.render=p=>{const c=p.col,g=p.ctx;
    g.save();g.globalAlpha=clamp(.55-st.K*.005,.12,.5);
    st.samples.forEach(w=>p.path(x=>polyval(w,x),c.acc,1.2));g.restore();
    p.path(sin2pi,c.truth,2.2);
    p.path(x=>polyval(st.post.m,x),c.fit,2.6);
    if(st.d.xs.length)p.dots(st.d.xs,st.d.ts,c.obs)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'posterior mean '+fmt(polyval(st.post.m,x),2),c:P.col.fit},
    {t:'sin(2πx) = '+fmt(sin2pi(x),2),c:P.col.truth}];
  gen()}

/* ===== slide 35 · The predictive distribution ===== */
export function p35(root){
  const st={N:10,M:9,lnAlpha:ALPHA0,beta:BETA0,K:12,x0:.5,samples:false,seed:3};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--fit)',l:'\\(m(x)\\)'},{c:'var(--fit)',t:'dash',l:'\\(m(x)\\pm s(x)\\)'},
    {c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},{c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},
    {c:'var(--accent)',l:'\\(y(x,\\mathbf{w}),\\ \\mathbf{w}\\sim p(\\mathbf{w}\\mid\\mathbf{x},\\mathbf{t})\\)'}]);
  const P=new Plot(b.pc,{h:360,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  slider(b.pn,{label:'\\(N\\)',min:1,max:40,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;gen()}});
  slider(b.pn,{label:'\\(\\ln\\alpha\\)',min:-10,max:6,step:.25,value:st.lnAlpha,fmt:v=>fmt(v,2),
    on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'\\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  slider(b.pn,{label:'\\(x_0\\)',min:0,max:1,step:.01,value:st.x0,fmt:v=>fmt(v,2),
    on:v=>{st.x0=v;draw()}});
  btnrow(b.pn,[{l:'Draw a new data set',on:()=>{st.seed++;gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'m',l:'\\(m(x_0)\\)'},{k:'s',l:'\\(s(x_0)\\)',big:true},{k:'sn',l:'\\(\\beta^{-1}\\)'},
    {k:'sm',l:'\\(\\boldsymbol\\phi(x_0)^{\\mathrm T}\\mathbf{S}\\boldsymbol\\phi(x_0)\\)'},{k:'sh',l:'\\(s(0.05)\\)'},{k:'sl',l:'\\(s(0.95)\\)'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Overlay curves from the posterior',st.samples,v=>{st.samples=v;P.draw()});
  eqbar(b.lc,'Marginalizing over w',
    '\\( p(t\\mid x,\\mathbf{x},\\mathbf{t})=\\int p(t\\mid x,\\mathbf{w})\\,'+
    'p(\\mathbf{w}\\mid\\mathbf{x},\\mathbf{t})\\,d\\mathbf{w}=\\mathcal N\\!\\left(t\\mid m(x),s^{2}(x)\\right)\\)<br>'+
    '\\( m(x)=\\beta\\,\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{S}\\sum_{n=1}^{N}\\boldsymbol\\phi(x_n)t_n'+
    '\\), \\(s^{2}(x)=\\beta^{-1}+\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{S}\\,\\boldsymbol\\phi(x)\\)');
  note(root,['The band is \\(\\pm1\\) standard deviation around the mean.',
    '\\(s^{2}(x)=\\beta^{-1}+\\boldsymbol\\phi^{\\mathrm T}\\mathbf{S}\\boldsymbol\\phi\\): noise plus model.',
    'The band widens at the edges, so the variance depends on \\(x\\).']);
  function gen(){st.d=makeData(st.N,.25,st.seed);draw()}
  function draw(){const al=Math.exp(st.lnAlpha);
    st.post=posterior(st.d.xs,st.d.ts,st.M,al,st.beta);
    st.samples2=curves(st.post,st.M,st.K,st.seed*104729+st.M);
    const q=predict(st.x0,st.M,st.post,st.beta),p0=phi(st.x0,st.M);
    out({m:fmt(q.mean,3),s:fmt(Math.sqrt(q.var),3),sn:fmt(1/st.beta,4),
      sm:fmt(quad(p0,st.post.S),4),
      sh:fmt(Math.sqrt(predict(.05,st.M,st.post,st.beta).var),3),
      sl:fmt(Math.sqrt(predict(.95,st.M,st.post,st.beta).var),3)});
    P.draw()}
  P.render=p=>{const c=p.col,
    m=x=>dot(phi(x,st.M),st.post.m),
    s=x=>Math.sqrt(predict(x,st.M,st.post,st.beta).var);
    p.band(x=>m(x)-s(x),x=>m(x)+s(x),c.fit,.16);
    if(st.samples){const g=p.ctx;g.save();g.globalAlpha=.35;
      st.samples2.forEach(w=>p.path(x=>polyval(w,x),c.acc,1.1));g.restore()}
    p.path(x=>m(x)-s(x),c.fit,1,[4,4]);p.path(x=>m(x)+s(x),c.fit,1,[4,4]);
    p.path(sin2pi,c.truth,2.2);p.path(m,c.fit,2.6);p.dots(st.d.xs,st.d.ts,c.obs);
    p.seg(st.x0,m(st.x0)-s(st.x0),m(st.x0)+s(st.x0),c.acc,2);
    p.mark(st.x0,m(st.x0),c.acc,4.5);p.label(st.x0,m(st.x0),'  x₀',c.acc,'left',-13)};
  P.hoverFmt=x=>{const q=predict(x,st.M,st.post,st.beta);
    return[{t:'x = '+fmt(x,2)},{t:'m(x) = '+fmt(q.mean,2),c:P.col.fit},
      {t:'s(x) = '+fmt(Math.sqrt(q.var),3),c:P.col.acc}]};
  gen()}

/* ===== slide 36 · Basis functions ===== */
/* one colour per order j, the same in every panel of this module */
const JC=['#CBD5E1','#7DD3FC','#FDE047','#C084FC','#F9A8D4','#5EEAD4','#FDBA74','#A5B4FC','#BEF264','#FCA5A5'];
const SUBS='₀₁₂₃₄₅₆₇₈₉';
const niceStep=r=>{const e=Math.pow(10,Math.floor(Math.log10(r))),f=r/e;return(f<=1?1:f<=2?2:f<=5?5:10)*e};
export function p36(root){
  const st={w:[.2,1.2,-2.2,1.1],rng:10,x0:.6,basis:true,space:false,d:makeData(10,.25,3)};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--fit)',l:'\\(y(x,\\mathbf{w})=\\sum_j w_j\\phi_j(x)\\)'},
    {c:JC[3],t:'dash',l:'\\(w_j\\phi_j(x)\\), one colour per \\(j\\)'},
    {c:'var(--accent)',l:'Other functions of the same space'}]);
  const P=new Plot(b.pc,{h:320,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});

  /* the basis functions themselves, before any coefficient touches them */
  const cB=el('div','card plotcard');b.lc.appendChild(cB);
  cB.appendChild(el('div','cap','Basis functions \\(\\phi_j(x)=x^{j}\\) and the basis values \\(\\phi_j(x_0)\\) at the input'));
  const legB=el('div');cB.appendChild(legB);
  const B=new Plot(cB,{h:250,xlim:[-.04,1.04],ylim:[-.08,1.12],yt:[0,.5,1],yl:'\\(\\phi_j(x)\\)'});

  /* the weighted basis values, added one order at a time */
  const cS=el('div','card plotcard');b.lc.appendChild(cS);
  cS.appendChild(el('div','cap','\\(w_j\\phi_j(x_0)\\) added from \\(j=0\\) to \\(M\\): the running sum ends at \\(y(x_0,\\mathbf{w})\\)'));
  const S=new Plot(cS,{h:250,xlim:[-.6,4.6],ylim:[-1,1],xl:'\\(j\\)',yl:'\\(\\sum_{k\\le j}w_k\\phi_k(x_0)\\)',
    xt:[0,1,2,3],yt:[-1,0,1],pad:[16,18,28,46]});
  const holder=el('div','matrow');cS.appendChild(holder);
  tex(cB);tex(cS);

  slider(b.pn,{label:'Order \\(M\\)',min:0,max:9,step:1,value:3,on:v=>{
    const w=new Array(v+1).fill(0);st.w.forEach((x,j)=>{if(j<=v)w[j]=x});st.w=w;W.rebuild();mv=null;rebuild();draw()}});
  const sX=slider(b.pn,{label:'Input \\(x_0\\)',min:0,max:1,step:.01,value:st.x0,
    fmt:v=>fmt(v,2),on:v=>{st.x0=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Set \\(\\mathbf{w}^{*}\\)',on:()=>{applyFit(st,W);draw()}},
    {l:'Set \\(\\mathbf{w}=\\mathbf{0}\\)',on:()=>{st.w=st.w.map(()=>0);st.rng=10;W.sync();draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'y',l:'\\(y(x_0,\\mathbf{w})=\\boldsymbol\\phi(x_0)^{\\mathrm T}\\mathbf{w}\\)',big:true},
    {k:'d',l:'Dimension of the space \\(M+1\\)'},
    {k:'big',l:'Largest \\(w_j\\phi_j(x_0)\\)'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show \\(w_j\\phi_j(x)\\)',st.basis,v=>{st.basis=v;P.draw()});
  toggle(tg,'Show other functions of the space',st.space,v=>{st.space=v;P.draw()});
  let mv=null,others=[];

  eqbar(root,'Basis, basis functions and the function space',
    '<b>Basis functions</b>: fixed functions of the input, here \\(\\phi_j(x)=x^{j}\\). '+
    'An input \\(x_0\\) turns them into the numbers \\(\\boldsymbol\\phi(x_0)=\\left(\\phi_0(x_0),\\dots,\\phi_M(x_0)\\right)^{\\mathrm T}\\in\\mathbb R^{M+1}\\).<br>'+
    '<b>Basis</b>: the set \\(\\{\\phi_0,\\phi_1,\\dots,\\phi_M\\}=\\{1,x,\\dots,x^{M}\\}\\), none of which is a combination of the others.<br>'+
    '<b>Function space</b>: every weighted sum of the basis, '+
    '\\( \\mathcal F_M=\\left\\{\\,y(x,\\mathbf{w})=\\sum_{j=0}^{M}w_j\\phi_j(x)\\ :\\ \\mathbf{w}\\in\\mathbb R^{M+1}\\right\\}\\), '+
    'of dimension \\(M+1\\); \\(\\mathbf{w}\\) are the coordinates of one function in it.<br>'+
    'At one input the model is a single inner product, '+
    '\\( y(x_0,\\mathbf{w})=\\sum_{j=0}^{M}w_j\\phi_j(x_0)=\\boldsymbol\\phi(x_0)^{\\mathrm T}\\mathbf{w}\\).');
  note(root,['Move \\(x_0\\): every basis value \\(\\phi_j(x_0)=x_0^{j}\\) changes, higher \\(j\\) stay near 0 until \\(x_0\\) nears 1.',
    'Each \\(\\phi_j(x_0)\\) is scaled by its \\(w_j\\), and the running sum ends exactly at the point on the curve.',
    'Doing this at every \\(x\\) draws the whole curve: \\(y\\) is the sum of the coloured dashed curves.',
    'Moving \\(\\mathbf{w}\\) picks another function of the same space; the faint curves are a few of them.',
    'Raising \\(M\\) adds one basis function, so the space grows by one dimension.']);

  function rebuild(){const M=st.w.length-1;legB.innerHTML='';
    legend(legB,JC.slice(0,M+1).map((c,j)=>({c:c,l:'\\(\\phi_{'+j+'}=x^{'+j+'}\\)'})));tex(legB);
    const r=rng(97+M);others=[];
    for(let k=0;k<10;k++){const w=[];for(let j=0;j<=M;j++)w.push(1.6*gauss(r)/Math.sqrt(j+1));others.push(w)}
    S.o.xlim=[-.6,M+1.6];S.o.xt=Array.from({length:M+1},(_,j)=>j)}

  function draw(){const M=st.w.length-1,p0=phi(st.x0,M),terms=p0.map((v,j)=>v*st.w[j]);
    let big=0;terms.forEach(v=>{if(Math.abs(v)>Math.abs(big))big=v});
    const y0=polyval(st.w,st.x0);
    out({y:fmt(y0,3),d:M+1,big:fmt(big,3)});
    st.cum=[];let s=0,lo=0,hi=0;terms.forEach(v=>{s+=v;st.cum.push(s);lo=Math.min(lo,s);hi=Math.max(hi,s)});
    const stp=niceStep(Math.max(hi-lo,.5)/3);lo=Math.floor(lo/stp-.25)*stp;hi=Math.ceil(hi/stp+.25)*stp;
    S.o.ylim=[lo,hi];S.o.yt=[];for(let v=lo;v<=hi+1e-9;v+=stp)S.o.yt.push(+v.toFixed(6));
    const padL=Math.max(46,14+7*Math.max.apply(null,S.o.yt.map(v=>String(v).length)));
    if(S.o.pad[3]!==padL){S.o.pad[3]=padL;S.resize()}
    if(!mv){holder.innerHTML='';
      const row=(c,d)=>matview(holder,{cap:c,rows:1,cols:M+1,digits:d||3});
      mv={p:row('\\(\\boldsymbol\\phi(x_0)^{\\mathrm T}=\\left(x_0^{0},x_0^{1},\\dots,x_0^{M}\\right)\\)'),
        w:matview(holder,{cap:'\\(\\mathbf{w}\\)',rows:M+1,cols:1,digits:3}),
        t:row('\\(\\left(w_0\\phi_0(x_0),\\dots,w_M\\phi_M(x_0)\\right)\\)'),
        y:matview(holder,{cap:'\\(\\boldsymbol\\phi(x_0)^{\\mathrm T}\\mathbf{w}=y(x_0,\\mathbf{w})\\)',
          rows:1,cols:1,digits:3})}}
    mv.p((i,j)=>p0[j]);mv.w(i=>st.w[i]);mv.t((i,j)=>terms[j]);mv.y(()=>y0);
    P.draw();B.draw();S.draw()}

  P.render=p=>{const c=p.col,M=st.w.length-1,g=p.ctx;
    if(st.space){g.save();g.globalAlpha=.35;others.forEach(w=>p.path(x=>polyval(w,x),c.acc,1.2));g.restore()}
    if(st.basis)for(let j=0;j<=M;j++)if(st.w[j])p.path(x=>st.w[j]*Math.pow(x,j),JC[j],1.4,[5,4]);
    p.dots(st.d.xs,st.d.ts,c.obs,3.4);
    p.path(x=>polyval(st.w,x),c.fit,2.8);
    p.seg(st.x0,p.o.ylim[0],p.o.ylim[1],c.line2,1,[3,3]);
    if(st.basis)for(let j=0;j<=M;j++)if(st.w[j])p.mark(st.x0,st.w[j]*Math.pow(st.x0,j),JC[j],3.2);
    p.mark(st.x0,polyval(st.w,st.x0),c.fit,5)};
  P.hoverFmt=x=>{const M=st.w.length-1,rows=[{t:'x = '+fmt(x,2)},{t:'y(x, w) = '+fmt(polyval(st.w,x),3),c:P.col.fit}];
    if(st.basis)for(let j=0;j<=M;j++)rows.push({t:'w'+SUBS[j]+'φ'+SUBS[j]+'(x) = '+fmt(st.w[j]*Math.pow(x,j),3),c:JC[j]});
    return rows};
  const setX=x=>{const v=clamp(Math.round(x*100)/100,0,1);st.x0=v;sX.set(v);draw()};
  P.onClick=setX;

  B.render=p=>{const c=p.col,M=st.w.length-1;
    for(let j=0;j<=M;j++)p.path(x=>Math.pow(x,j),JC[j],1.8);
    p.seg(st.x0,p.o.ylim[0],p.o.ylim[1],c.line2,1,[3,3]);
    for(let j=0;j<=M;j++)p.mark(st.x0,Math.pow(st.x0,j),JC[j],4.2);
    p.label(st.x0,p.o.ylim[1],' x₀ = '+fmt(st.x0,2),c.ink2,st.x0>.8?'right':'left',6)};
  B.hoverFmt=x=>{const M=st.w.length-1,rows=[{t:'x = '+fmt(x,2)}];
    for(let j=0;j<=M;j++)rows.push({t:'φ'+SUBS[j]+'(x) = x^'+j+' = '+fmt(Math.pow(x,j),3),c:JC[j]});
    return rows};
  B.onClick=setX;

  /* waterfall: bar j runs from the sum up to j-1 to the sum up to j, the last bar is the total */
  S.render=p=>{const c=p.col,g=p.ctx,M=st.w.length-1,hw=.32;
    const bar=(x,a,z,col)=>{const X0=p.X(x-hw),X1=p.X(x+hw),Ya=p.Y(a),Yz=p.Y(z);
      g.fillStyle=col;g.fillRect(X0,Math.min(Ya,Yz),X1-X0,Math.max(1.5,Math.abs(Yz-Ya)))};
    g.save();
    for(let j=0;j<=M;j++){const a=j?st.cum[j-1]:0;bar(j,a,st.cum[j],JC[j]);
      if(j<M){g.strokeStyle=c.line2;g.setLineDash([2,3]);g.beginPath();
        g.moveTo(p.X(j+hw),p.Y(st.cum[j]));g.lineTo(p.X(j+1-hw),p.Y(st.cum[j]));g.stroke();g.setLineDash([])}}
    const yv=st.cum[M];bar(M+1,0,yv,c.fit);
    g.strokeStyle=c.fit;g.setLineDash([4,4]);g.beginPath();
    g.moveTo(p.X(p.o.xlim[0]),p.Y(yv));g.lineTo(p.X(M+1-hw),p.Y(yv));g.stroke();g.restore();
    p.label(M+1,yv,'y(x₀,w)',c.fit,'center',yv<0?12:-12);
    p.label(M+1,p.o.ylim[0],'Σ',c.muted,'center',13)};
  S.hoverFmt=x=>{const M=st.w.length-1,j=Math.round(x);if(j<0||j>M+1)return null;
    if(j===M+1)return[{t:'Σ wⱼφⱼ(x₀) = y(x₀, w) = '+fmt(st.cum[M],3),c:S.col.fit}];
    const pv=Math.pow(st.x0,j);
    return[{t:'j = '+j,c:JC[j]},{t:'φ'+SUBS[j]+'(x₀) = '+fmt(pv,3)},{t:'w'+SUBS[j]+' = '+fmt(st.w[j],3)},
      {t:'w'+SUBS[j]+'φ'+SUBS[j]+'(x₀) = '+fmt(st.w[j]*pv,3),c:JC[j]},
      {t:'sum up to j = '+fmt(st.cum[j],3)}]};

  rebuild();draw()}

/* ===== slide 37 · The matrices behind the posterior ===== */
export function p37(root){
  const st={N:3,M:2,lnAlpha:-3,beta:BETA0,seed:3};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--fit)',l:'\\(m(x)\\)'},{c:'var(--fit)',t:'dash',l:'\\(m(x)\\pm s(x)\\)'},
    {c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'}]);
  const P=new Plot(b.pc,{h:250,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const sN=slider(b.pn,{label:'\\(N\\)',min:1,max:8,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:4,step:1,value:st.M,on:v=>{st.M=v;reset();gen()}});
  slider(b.pn,{label:'\\(\\ln\\alpha\\)',min:-8,max:6,step:.25,value:st.lnAlpha,fmt:v=>fmt(v,2),
    on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'\\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  btnrow(b.pn,[{l:'Add a point',on:()=>{st.N=clamp(st.N+1,1,8);sN.set(st.N);gen()}},
    {l:'Draw a new data set',on:()=>{st.seed++;gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'n',l:'\\(N\\)'},{k:'d',l:'\\((M+1)\\times(M+1)\\)'},
    {k:'a',l:'\\(\\alpha\\)'},{k:'tr',l:'\\(\\mathrm{tr}\\,\\mathbf{S}\\)'}]);
  const card=el('div','card plotcard');b.lc.appendChild(card);
  const holder=el('div','matrow');card.appendChild(holder);
  let views=null;
  eqbar(root,'Reading the posterior from the Gaussian form',
    '\\( \\mathbf{S}^{-1}=\\alpha\\mathbf{I}+\\beta\\sum_{n=1}^{N}\\boldsymbol\\phi(x_n)'+
    '\\boldsymbol\\phi(x_n)^{\\mathrm T}\\), \\('+
    '\\mathbf{S}^{-1}\\mathbf{m}_N=\\beta\\sum_{n=1}^{N}\\boldsymbol\\phi(x_n)t_n\\)');
  note(root,['Each data point adds one \\(\\boldsymbol\\phi(x_n)\\boldsymbol\\phi(x_n)^{\\mathrm T}\\).',
    '\\(\\alpha\\) enters only on the diagonal and keeps \\(\\mathbf{S}^{-1}\\) invertible.',
    '\\(\\mathbf{S}\\) depends on the \\(x_n\\), \\(\\mathbf{m}_N\\) on the \\(t_n\\) as well.']);
  function reset(){views=null;holder.innerHTML=''}
  function gen(){st.d=makeData(st.N,.25,st.seed);reset();draw()}
  function draw(){const al=Math.exp(st.lnAlpha),M=st.M,d=M+1;
    const P0=st.d.xs.map(x=>phi(x,M));
    const PP=[],Pt=new Array(d).fill(0);
    for(let i=0;i<d;i++)PP.push(new Array(d).fill(0));
    P0.forEach((p,n)=>{for(let i=0;i<d;i++){Pt[i]+=p[i]*st.d.ts[n];
      for(let j=0;j<d;j++)PP[i][j]+=p[i]*p[j]}});
    st.post=posterior(st.d.xs,st.d.ts,M,al,st.beta);
    let tr=0;for(let i=0;i<d;i++)tr+=st.post.S[i][i];
    out({n:st.d.xs.length,d:d,a:fmt(al,al<1?4:2),tr:fmt(tr,3)});
    if(!views){views={
      phi:matview(holder,{cap:'\\(\\mathbf{\\Phi}\\): row \\(n\\) is \\(\\boldsymbol\\phi(x_n)^{\\mathrm T}\\)',rows:st.d.xs.length,cols:d,digits:3}),
      pp:matview(holder,{cap:'\\(\\sum_n\\boldsymbol\\phi(x_n)\\boldsymbol\\phi(x_n)^{\\mathrm T}\\)',rows:d,cols:d,digits:3}),
      pt:matview(holder,{cap:'\\(\\sum_n\\boldsymbol\\phi(x_n)t_n\\)',rows:d,cols:1,digits:3}),
      si:matview(holder,{cap:'\\(\\mathbf{S}^{-1}=\\alpha\\mathbf{I}+\\beta\\sum_n\\boldsymbol\\phi\\boldsymbol\\phi^{\\mathrm T}\\)',rows:d,cols:d,digits:2}),
      s:matview(holder,{cap:'\\(\\mathbf{S}\\)',rows:d,cols:d,digits:3}),
      m:matview(holder,{cap:'\\(\\mathbf{m}_N\\)',rows:d,cols:1,digits:3})}}
    views.phi((i,j)=>P0[i][j]);views.pp((i,j)=>PP[i][j]);views.pt(i=>Pt[i]);
    views.si((i,j)=>st.post.Sinv[i][j]);views.s((i,j)=>st.post.S[i][j]);views.m(i=>st.post.m[i]);
    P.draw()}
  P.render=p=>{const c=p.col,m=x=>dot(phi(x,st.M),st.post.m),
    s=x=>Math.sqrt(predict(x,st.M,st.post,st.beta).var);
    p.band(x=>m(x)-s(x),x=>m(x)+s(x),c.fit,.14);
    p.path(x=>m(x)-s(x),c.fit,1,[4,4]);p.path(x=>m(x)+s(x),c.fit,1,[4,4]);
    p.path(sin2pi,c.truth,2);p.path(m,c.fit,2.6);p.dots(st.d.xs,st.d.ts,c.obs)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'φ(x) = ('+phi(x,st.M).map(v=>fmt(v,2)).join(', ')+')'}];
  gen()}

/* ===== slide 38 · The multivariate Gaussian, term by term ===== */
export function p38(root){
  const st={N:10,lnAlpha:-3,beta:BETA0,w:[.4,-1.2],seed:3};
  const M=1;
  const b=board(root,'Controls');
  const P=new Plot(b.pc,{h:330,xlim:[-1.4,2.6],ylim:[-4.2,1.2],xl:'\\(w_0\\)',yl:'\\(w_1\\)',
    xt:[-1,0,1,2],yt:[-4,-2,0],pad:[16,18,28,40]});
  const sN=slider(b.pn,{label:'\\(N\\)',min:0,max:40,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'\\(\\ln\\alpha\\)',min:-8,max:6,step:.25,value:st.lnAlpha,fmt:v=>fmt(v,2),
    on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'\\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  btnrow(b.pn,[{l:'Set \\(\\mathbf{w}=\\mathbf{m}_N\\)',on:()=>{st.w=st.post.m.slice();draw()}},
    {l:'Draw a new data set',on:()=>{st.seed++;gen()}},
    {l:'\\(N=0\\)',on:()=>{st.N=0;sN.set(0);gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'q',l:'\\(-\\tfrac12\\mathbf{w}^{\\mathrm T}\\mathbf{S}^{-1}\\mathbf{w}\\)'},{k:'l',l:'\\(+\\mathbf{w}^{\\mathrm T}\\mathbf{S}^{-1}\\mathbf{m}_N\\)'},{k:'c',l:'\\(+C_3\\)'},
    {k:'s',l:'\\(\\ln\\mathcal N(\\mathbf{w}\\mid\\mathbf{m}_N,\\mathbf{S})\\)',big:true},{k:'md',l:'\\((\\mathbf{w}-\\mathbf{m}_N)^{\\mathrm T}\\mathbf{S}^{-1}(\\mathbf{w}-\\mathbf{m}_N)\\)'}]);
  const card=el('div','card plotcard');b.lc.appendChild(card);
  const holder=el('div','matrow');card.appendChild(holder);
  const vm=matview(holder,{cap:'\\(\\mathbf{m}_N\\)',rows:2,cols:1,digits:3});
  const vs=matview(holder,{cap:'\\(\\mathbf{S}\\) (covariance)',rows:2,cols:2,digits:4});
  const vi=matview(holder,{cap:'\\(\\mathbf{S}^{-1}\\) (precision)',rows:2,cols:2,digits:2});
  const vw=matview(holder,{cap:'\\(\\mathbf{w}\\)',rows:2,cols:1,digits:3});
  eqbar(root,'Matching the Gaussian form',
    '\\( \\ln\\mathcal N(\\mathbf{w}\\mid\\mathbf{m}_N,\\mathbf{S})=-\\dfrac{1}{2}\\mathbf{w}^{\\mathrm T}'+
    '\\mathbf{S}^{-1}\\mathbf{w}+\\mathbf{w}^{\\mathrm T}\\mathbf{S}^{-1}\\mathbf{m}_N+C_3\\), '+
    'so reading the quadratic term gives \\(\\mathbf{S}^{-1}\\) and reading the linear term gives '+
    '\\(\\mathbf{S}^{-1}\\mathbf{m}_N\\), which is how the posterior mean and covariance are identified.');
  note(root,['Only the quadratic and the linear term depend on \\(\\mathbf{w}\\).',
    'Away from \\(\\mathbf{m}_N\\) the quadratic term falls fastest.',
    'Data shrinks the ellipse, the tilt is \\(w_0,w_1\\) correlation.']);
  function gen(){st.d=st.N?makeData(st.N,.25,st.seed):{xs:[],ts:[],N:0,seed:st.seed};draw()}
  function draw(){const al=Math.exp(st.lnAlpha);
    st.post=posterior(st.d.xs,st.d.ts,M,al,st.beta);
    const S=st.post.S,Si=st.post.Sinv,m=st.post.m,w=st.w;
    const det=S[0][0]*S[1][1]-S[0][1]*S[1][0];
    const q=-.5*quad(w,Si),l=dot(w,[Si[0][0]*m[0]+Si[0][1]*m[1],Si[1][0]*m[0]+Si[1][1]*m[1]]),
      c3=-.5*quad(m,Si)-Math.log(2*Math.PI)-.5*Math.log(Math.max(det,1e-300)),
      dw=[w[0]-m[0],w[1]-m[1]];
    out({q:fmt(q,3),l:fmt(l,3),c:fmt(c3,3),s:fmt(q+l+c3,3),md:fmt(Math.sqrt(Math.max(quad(dw,Si),0)),3)});
    vm(i=>m[i]);vs((i,j)=>S[i][j]);vi((i,j)=>Si[i][j]);vw(i=>w[i]);
    const NX=64,NY=64,V=[],x0=P.o.xlim[0],x1=P.o.xlim[1],y0=P.o.ylim[0],y1=P.o.ylim[1];
    let mn=Infinity,mx=-Infinity;
    for(let i=0;i<NX;i++){V.push([]);for(let j=0;j<NY;j++){
      const a=x0+(x1-x0)*(i+.5)/NX,bq=y0+(y1-y0)*(j+.5)/NY,dv=[a-m[0],bq-m[1]],
        v=-.5*quad(dv,Si);V[i].push(v);if(v>mx)mx=v;if(v<mn)mn=v}}
    st.grid={V:V,mn:Math.max(mn,mx-12),mx:mx};P.draw()}
  P.render=p=>{const c=p.col,g=p.ctx,G=st.grid,m=st.post.m;
    p.heat(G.V,64,64,G.mn,G.mx);p.axes();
    g.save();g.strokeStyle=c.ink;g.lineWidth=2;const BX=p.X(m[0]),BY=p.Y(m[1]),s=6;
    g.beginPath();g.moveTo(BX-s,BY-s);g.lineTo(BX+s,BY+s);g.moveTo(BX+s,BY-s);g.lineTo(BX-s,BY+s);
    g.stroke();g.restore();
    p.label(m[0],m[1],'  m_N',c.ink,'left',-13);
    p.mark(st.w[0],st.w[1],c.fit,6);p.label(st.w[0],st.w[1],'  w',c.fit,'left',15)};
  P.hoverFmt=(a,bq)=>{const m=st.post.m,dv=[a-m[0],bq-m[1]];
    return[{t:'w₀ = '+fmt(a,2)+', w₁ = '+fmt(bq,2)},
      {t:'ln density ≈ '+fmt(-.5*quad(dv,st.post.Sinv),2),c:P.col.acc}]};
  P.onClick=(a,bq)=>{st.w=[clamp(a,-3,4),clamp(bq,-6,3)];draw()};
  gen()}

/* ===== slide 39 · Where the data are decides what the model knows ===== */
export function p39(root){
  const st={M:9,lnAlpha:-1,beta:BETA0,xs:[],ts:[],seed:3};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--fit)',l:'\\(m(x)\\)'},{c:'var(--fit)',t:'dash',l:'\\(m(x)\\pm s(x)\\)'},
    {c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},{c:'var(--obs)',t:'dot',l:'\\(t_n\\)'}]);
  const P=new Plot(b.pc,{h:380,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;draw()}});
  slider(b.pn,{label:'\\(\\ln\\alpha\\)',min:-10,max:6,step:.25,value:st.lnAlpha,fmt:v=>fmt(v,2),
    on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'\\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  btnrow(b.pn,[{l:'Clear the points',on:()=>{st.xs=[];st.ts=[];draw()}},
    {l:'10 points from \\(\\sin(2\\pi x)\\)',on:()=>{const d=makeData(10,.25,++st.seed);
      st.xs=d.xs.slice();st.ts=d.ts.slice();draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'n',l:'\\(N\\)'},{k:'s1',l:'\\(s(x)\\) at \\(x=0.1\\)'},
    {k:'s2',l:'\\(s(x)\\) at \\(x=0.5\\)'},{k:'s3',l:'\\(s(x)\\) at \\(x=0.9\\)'},{k:'wid',l:'Widest point of the band',big:true}]);
  eqbar(root,'The predictive distribution, once more',
    '\\( p(t\\mid x,\\mathbf{x},\\mathbf{t})=\\mathcal N\\!\\left(t\\mid m(x),s^{2}(x)\\right)\\), '+
    '\\( s^{2}(x)=\\beta^{-1}+\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{S}\\,\\boldsymbol\\phi(x)\\), '+
    '\\( \\mathbf{S}^{-1}=\\alpha\\mathbf{I}+\\beta\\sum_{n=1}^{N}\\boldsymbol\\phi(x_n)\\boldsymbol\\phi(x_n)^{\\mathrm T}\\).');
  note(root,['With no data the band is the prior, wide and centred on zero.',
    'Tight where the points are, wide where they are not.',
    'One far point moves the mean less once \\(N\\) is large.']);
  function draw(){const al=Math.exp(st.lnAlpha);
    st.post=posterior(st.xs,st.ts,st.M,al,st.beta);
    const s=x=>Math.sqrt(predict(x,st.M,st.post,st.beta).var);
    let wid=0,wx=0;for(let i=0;i<=100;i++){const x=i/100,v=s(x);if(v>wid){wid=v;wx=x}}
    out({n:st.xs.length,s1:fmt(s(.1),3),s2:fmt(s(.5),3),s3:fmt(s(.9),3),
      wid:fmt(wid,3)+' at x = '+fmt(wx,2)});
    P.draw()}
  P.render=p=>{const c=p.col,m=x=>dot(phi(x,st.M),st.post.m),
    s=x=>Math.sqrt(predict(x,st.M,st.post,st.beta).var);
    p.band(x=>m(x)-s(x),x=>m(x)+s(x),c.fit,.16);
    p.path(x=>m(x)-s(x),c.fit,1,[4,4]);p.path(x=>m(x)+s(x),c.fit,1,[4,4]);
    p.path(sin2pi,c.truth,2.2);p.path(m,c.fit,2.6);
    if(st.xs.length)p.dots(st.xs,st.ts,c.obs)};
  P.hoverFmt=x=>{const q=predict(x,st.M,st.post,st.beta);
    return[{t:'x = '+fmt(x,2)},{t:'m(x) = '+fmt(q.mean,2),c:P.col.fit},
      {t:'s(x) = '+fmt(Math.sqrt(q.var),3),c:P.col.acc}]};
  P.onClick=(x,t)=>{if(x<-.02||x>1.02)return;
    st.xs.push(clamp(x,0,1));st.ts.push(clamp(t,-2,2));draw()};
  draw()}
