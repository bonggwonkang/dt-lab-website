/* PRML simulators, slides 34 to 39: the fully Bayesian treatment. */
import{el,fmt,clamp,sin2pi,makeData,polyval,phi,Plot,board,legend,slider,toggle,btnrow,
  readout,eqbar,note,wchips,matview,posterior,predict,sampleW,rng,dot,quad,
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
  const sN=slider(b.pn,{label:'Data points \\(N\\)',min:0,max:25,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;gen()}});
  slider(b.pn,{label:'Prior precision \\(\\ln\\alpha\\)',min:-10,max:6,step:.25,value:st.lnAlpha,fmt:v=>fmt(v,2),
    on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'Noise precision \\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  slider(b.pn,{label:'Curves drawn',min:1,max:60,step:1,value:st.K,on:v=>{st.K=v;draw()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'No data at all',on:()=>{st.N=0;sN.set(0);gen()}},
    {l:'\\(N=15\\)',on:()=>{st.N=15;sN.set(15);gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'n',l:'Points seen'},{k:'sd0',l:'Posterior sd of \\(w_0\\)'},
    {k:'sdm',l:'Largest posterior sd'},{k:'s1',l:'Spread of the curves at \\(x=0.5\\)',big:true},
    {k:'s2',l:'Spread of the curves at \\(x=1\\)'}]);
  const cm=wchips(b.pn,'Posterior mean \\(\\mathbf{m}_N\\)'),cs=wchips(b.pn,'Posterior standard deviations');
  eqbar(root,'A distribution over the coefficients, not a single value',
    '\\( p(\\mathbf{w}\\mid\\mathbf{x},\\mathbf{t},\\alpha,\\beta)\\propto '+
    'p(\\mathbf{t}\\mid\\mathbf{x},\\mathbf{w},\\beta)\\,p(\\mathbf{w}\\mid\\alpha)\\). '+
    'Because the observed targets are corrupted by noise and the data set is finite, the data cannot '+
    'determine \\(\\mathbf{w}\\) uniquely, and every curve drawn here is one \\(\\mathbf{w}\\) the data '+
    'still consider plausible.');
  note(root,['With no data the curves are whatever the prior allows: all of them pass near zero on average, and α alone decides how wild they get.',
    'Add points one at a time. The bundle tightens fastest where the points are, and stays wide where there are none, which is uncertainty that a single least-squares curve simply cannot express.',
    'The posterior standard deviations shrink as \\(N\\) grows while the mean settles down. Slide 35 replaces this bundle of samples with the integral that summarises it.']);
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
  const sN=slider(b.pn,{label:'Data points \\(N\\)',min:1,max:40,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;gen()}});
  slider(b.pn,{label:'Prior precision \\(\\ln\\alpha\\)',min:-10,max:6,step:.25,value:st.lnAlpha,fmt:v=>fmt(v,2),
    on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'Noise precision \\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  slider(b.pn,{label:'Inspect the width at \\(x_0\\)',min:0,max:1,step:.01,value:st.x0,fmt:v=>fmt(v,2),
    on:v=>{st.x0=v;draw()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'\\(N=4\\)',on:()=>{st.N=4;sN.set(4);gen()}},{l:'\\(N=25\\)',on:()=>{st.N=25;sN.set(25);gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'m',l:'\\(m(x_0)\\)'},{k:'s',l:'\\(s(x_0)\\)',big:true},{k:'sn',l:'noise part \\(\\beta^{-1}\\)'},
    {k:'sm',l:'model part \\(\\boldsymbol\\phi(x_0)^{\\mathrm T}\\mathbf{S}\\boldsymbol\\phi(x_0)\\)'},{k:'sh',l:'width at \\(x=0.05\\)'},{k:'sl',l:'width at \\(x=0.95\\)'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Overlay curves from the posterior',st.samples,v=>{st.samples=v;P.draw()});
  eqbar(root,'Marginalizing over w',
    '\\( p(t\\mid x,\\mathbf{x},\\mathbf{t})=\\int p(t\\mid x,\\mathbf{w})\\,'+
    'p(\\mathbf{w}\\mid\\mathbf{x},\\mathbf{t})\\,d\\mathbf{w}=\\mathcal N\\!\\left(t\\mid m(x),s^{2}(x)\\right)\\)<br>'+
    '\\( m(x)=\\beta\\,\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{S}\\sum_{n=1}^{N}\\boldsymbol\\phi(x_n)t_n'+
    '\\), \\(s^{2}(x)=\\beta^{-1}+\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{S}\\,\\boldsymbol\\phi(x)\\)');
  note(root,['Switch the overlay on. The band is not a separate idea from slide 34: it is exactly the spread of those curves, obtained in closed form instead of by sampling.',
    'The width splits into two parts. \\(\\beta^{-1}\\) is noise in the targets and never goes away; \\(\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{S}\\boldsymbol\\phi(x)\\) is uncertainty about \\(\\mathbf{w}\\) and does shrink with data.',
    'Move \\(x_0\\) towards the edges. The band flares where the model has to extrapolate, so <b>the variance depends on \\(x\\)</b>, something the maximum likelihood predictive distribution of slide 28 could never show.']);
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
export function p36(root){
  const st={w:[.2,1.2,-2.2,1.1],rng:10,x0:.6,basis:true,d:makeData(10,.25,3)};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--fit)',l:'\\(y(x,\\mathbf{w})=\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{w}\\)'},{c:'var(--muted)',t:'dash',l:'\\(\\phi_j(x)=x^{j}\\)'},
    {c:'var(--accent)',l:'\\(w_j\\phi_j(x)\\)'}]);
  const P=new Plot(b.pc,{h:340,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  slider(b.pn,{label:'Order \\(M\\)',min:0,max:9,step:1,value:3,on:v=>{
    const w=new Array(v+1).fill(0);st.w.forEach((x,j)=>{if(j<=v)w[j]=x});st.w=w;W.rebuild();mv=null;draw()}});
  const sX=slider(b.pn,{label:'Evaluate the inner product at \\(x_0\\)',min:0,max:1,step:.01,value:st.x0,
    fmt:v=>fmt(v,2),on:v=>{st.x0=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Set \\(\\mathbf{w}\\) to \\(\\mathbf{w}^{*}\\)',on:()=>{applyFit(st,W);draw()}},
    {l:'Reset \\(\\mathbf{w}\\) to \\(\\mathbf{0}\\)',on:()=>{st.w=st.w.map(()=>0);st.rng=10;W.sync();draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'y',l:'\\(y(x_0,\\mathbf{w})=\\boldsymbol\\phi(x_0)^{\\mathrm T}\\mathbf{w}\\)',big:true},{k:'d',l:'Dimension \\(M+1\\)'},
    {k:'big',l:'Largest single term'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show the basis functions',st.basis,v=>{st.basis=v;P.draw()});
  const card=el('div','card plotcard');root.appendChild(card);
  const cap=el('div','legend');card.appendChild(cap);
  cap.innerHTML='<span><b style="font-weight:600">The inner product term by term at \\(x_0\\)</b></span>'+
    '<span style="color:var(--muted)">column 1 is \\(\\phi_j(x_0)\\), column 2 is \\(w_j\\), column 3 is their product</span>';
  const holder=el('div','matrow');card.appendChild(holder);
  let mv=null;
  eqbar(root,'The polynomial as an inner product',
    '\\( y(x,\\mathbf{w})=\\sum_{j=0}^{M}w_jx^{j}=\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{w}\\), '+
    'where \\(\\boldsymbol\\phi(x)=\\left(x^{0},x^{1},\\dots,x^{M}\\right)^{\\mathrm T}\\in\\mathbb R^{M+1}\\).');
  note(root,['A polynomial is a weighted sum of fixed shapes. The shapes \\(x^{0},x^{1},\\dots,x^{M}\\) never move; only the weights \\(\\mathbf{w}\\) do, which is again the linearity that makes the algebra easy.',
    'At a single \\(x_0\\) the whole model collapses to one dot product. The table shows every term of it, and the terms grow rapidly with \\(j\\) near \\(x=1\\) while they all vanish near \\(x=0\\).',
    'Nothing in the later slides depends on these shapes being powers of \\(x\\). Replace \\(\\boldsymbol\\phi\\) with Gaussians or sigmoids and every formula from here on still holds.']);
  function draw(){const p0=phi(st.x0,st.w.length-1),terms=p0.map((v,j)=>v*st.w[j]);
    let big=0;terms.forEach(v=>{if(Math.abs(v)>Math.abs(big))big=v});
    out({y:fmt(polyval(st.w,st.x0),3),d:st.w.length,big:fmt(big,3)});
    if(!mv){holder.innerHTML='';
      mv=matview(holder,{cap:'\\(\\phi_j(x_0)\\), \\(w_j\\), \\(w_j\\phi_j(x_0)\\)',rows:st.w.length,cols:3,
        rowLab:i=>'j = '+i,digits:3})}
    mv((i,j)=>j===0?p0[i]:j===1?st.w[i]:terms[i]);
    P.draw()}
  P.render=p=>{const c=p.col,M=st.w.length-1;
    if(st.basis)for(let j=0;j<=M;j++)p.path(x=>Math.pow(x,j),c.muted,1,[4,3]);
    for(let j=0;j<=M;j++)if(st.w[j])p.path(x=>st.w[j]*Math.pow(x,j),c.acc,1.3);
    p.dots(st.d.xs,st.d.ts,c.obs,3.4);
    p.path(x=>polyval(st.w,x),c.fit,2.8);
    p.seg(st.x0,p.o.ylim[0],p.o.ylim[1],c.line2,1,[3,3]);
    p.mark(st.x0,polyval(st.w,st.x0),c.fit,4.5)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'y(x, w) = '+fmt(polyval(st.w,x),2),c:P.col.fit}];
  P.onClick=x=>{const v=clamp(Math.round(x*100)/100,0,1);st.x0=v;sX.set(v);draw()};
  draw()}

/* ===== slide 37 · The matrices behind the posterior ===== */
export function p37(root){
  const st={N:3,M:2,lnAlpha:-3,beta:BETA0,seed:3};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--fit)',l:'\\(m(x)\\)'},{c:'var(--fit)',t:'dash',l:'\\(m(x)\\pm s(x)\\)'},
    {c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'}]);
  const P=new Plot(b.pc,{h:250,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const sN=slider(b.pn,{label:'Data points \\(N\\)',min:1,max:8,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:4,step:1,value:st.M,on:v=>{st.M=v;reset();gen()}});
  slider(b.pn,{label:'Prior precision \\(\\ln\\alpha\\)',min:-8,max:6,step:.25,value:st.lnAlpha,fmt:v=>fmt(v,2),
    on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'Noise precision \\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  btnrow(b.pn,[{l:'Add a point',on:()=>{st.N=clamp(st.N+1,1,8);sN.set(st.N);gen()}},
    {l:'Draw a new sample',on:()=>{st.seed++;gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'n',l:'Points seen'},{k:'d',l:'Matrix size \\((M+1)\\)'},
    {k:'a',l:'\\(\\alpha\\)'},{k:'tr',l:'Trace of \\(\\mathbf{S}\\)'}]);
  const card=el('div','card plotcard');root.appendChild(card);
  const cap=el('div','legend');card.appendChild(cap);
  cap.innerHTML='<span><b style="font-weight:600">Everything the posterior is built from</b></span>'+
    '<span style="color:var(--muted)">colour intensity follows the size of each entry</span>';
  const holder=el('div','matrow');card.appendChild(holder);
  let views=null;
  eqbar(root,'Reading the posterior off a Gaussian',
    '\\( \\mathbf{S}^{-1}=\\alpha\\mathbf{I}+\\beta\\sum_{n=1}^{N}\\boldsymbol\\phi(x_n)'+
    '\\boldsymbol\\phi(x_n)^{\\mathrm T}\\), \\('+
    '\\mathbf{S}^{-1}\\mathbf{m}_N=\\beta\\sum_{n=1}^{N}\\boldsymbol\\phi(x_n)t_n\\)');
  note(root,['Each data point contributes one rank-one block \\(\\boldsymbol\\phi(x_n)\\boldsymbol\\phi(x_n)^{\\mathrm T}\\) to the sum. Press "Add a point" and watch a whole matrix change from a single new observation.',
    'The prior enters in exactly one place: \\(\\alpha\\) is added along the diagonal. That is what keeps \\(\\mathbf{S}^{-1}\\) invertible even when there are fewer points than coefficients, so the posterior always exists.',
    'The mean solves \\(\\mathbf{S}^{-1}\\mathbf{m}_N=\\beta\\sum\\boldsymbol\\phi(x_n)t_n\\). Raise β and the data term dominates; raise α and \\(\\mathbf{m}_N\\) is pulled back towards \\(\\mathbf{0}\\).']);
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
      phi:matview(holder,{cap:'\\(\\mathbf{\\Phi}\\): row \\(n\\) is \\(\\boldsymbol\\phi(x_n)^{\\mathrm T}\\)',rows:st.d.xs.length,cols:d,
        rowLab:i=>'n = '+(i+1),digits:3}),
      pp:matview(holder,{cap:'\\(\\sum_n\\boldsymbol\\phi(x_n)\\boldsymbol\\phi(x_n)^{\\mathrm T}\\)',rows:d,cols:d,rowLab:i=>'i = '+i,digits:3}),
      pt:matview(holder,{cap:'\\(\\sum_n\\boldsymbol\\phi(x_n)t_n\\)',rows:d,cols:1,rowLab:i=>'i = '+i,digits:3}),
      si:matview(holder,{cap:'\\(\\mathbf{S}^{-1}=\\alpha\\mathbf{I}+\\beta\\sum_n\\boldsymbol\\phi\\boldsymbol\\phi^{\\mathrm T}\\)',rows:d,cols:d,rowLab:i=>'i = '+i,digits:2}),
      s:matview(holder,{cap:'\\(\\mathbf{S}\\)',rows:d,cols:d,rowLab:i=>'i = '+i,digits:3}),
      m:matview(holder,{cap:'\\(\\mathbf{m}_N\\)',rows:d,cols:1,rowLab:i=>'i = '+i,digits:3})}}
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
  const cap0=el('div','legend');b.pc.appendChild(cap0);
  cap0.innerHTML='<span><b style="font-weight:600">\\(p(\\mathbf{w}\\mid\\mathbf{x},\\mathbf{t})\\) over the plane \\((w_0,w_1)\\)</b></span>'+
    '<span style="color:var(--muted)">stronger colour means higher density &middot; &times; is the mean \\(\\mathbf{m}_N\\) &middot; click to move \\(\\mathbf{w}\\)</span>';
  const P=new Plot(b.pc,{h:330,xlim:[-1.4,2.6],ylim:[-4.2,1.2],xl:'w₀',yl:'w₁',
    xt:[-1,0,1,2],yt:[-4,-2,0],pad:[16,18,28,40]});
  const sN=slider(b.pn,{label:'Data points \\(N\\)',min:0,max:40,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Prior precision \\(\\ln\\alpha\\)',min:-8,max:6,step:.25,value:st.lnAlpha,fmt:v=>fmt(v,2),
    on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'Noise precision \\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  btnrow(b.pn,[{l:'Move \\(\\mathbf{w}\\) to the mean',on:()=>{st.w=st.post.m.slice();draw()}},
    {l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'No data at all',on:()=>{st.N=0;sN.set(0);gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'q',l:'\\(-\\tfrac12\\mathbf{w}^{\\mathrm T}\\mathbf{S}^{-1}\\mathbf{w}\\)'},{k:'l',l:'\\(+\\mathbf{w}^{\\mathrm T}\\mathbf{S}^{-1}\\mathbf{m}_N\\)'},{k:'c',l:'\\(+C_3\\) (constant)'},
    {k:'s',l:'\\(\\ln\\mathcal N(\\mathbf{w}\\mid\\mathbf{m}_N,\\mathbf{S})\\)',big:true},{k:'md',l:'Mahalanobis distance from \\(\\mathbf{m}_N\\)'}]);
  const card=el('div','card plotcard');root.appendChild(card);
  const cap=el('div','legend');card.appendChild(cap);
  cap.innerHTML='<span><b style="font-weight:600">The mean vector and the covariance matrix</b></span>'+
    '<span style="color:var(--muted)">\\(\\mathbf{S}^{-1}=\\alpha\\mathbf{I}+\\beta\\sum_n\\boldsymbol\\phi\\boldsymbol\\phi^{\\mathrm T}\\), and \\(\\mathbf{m}_N\\) solves \\(\\mathbf{S}^{-1}\\mathbf{m}_N=\\beta\\sum_n\\boldsymbol\\phi(x_n)t_n\\)</span>';
  const holder=el('div','matrow');card.appendChild(holder);
  const vm=matview(holder,{cap:'\\(\\mathbf{m}_N\\)',rows:2,cols:1,rowLab:i=>'i = '+i,digits:3});
  const vs=matview(holder,{cap:'\\(\\mathbf{S}\\) (covariance)',rows:2,cols:2,rowLab:i=>'i = '+i,digits:4});
  const vi=matview(holder,{cap:'\\(\\mathbf{S}^{-1}\\) (precision)',rows:2,cols:2,rowLab:i=>'i = '+i,digits:2});
  const vw=matview(holder,{cap:'\\(\\mathbf{w}\\) (where you clicked)',rows:2,cols:1,rowLab:i=>'i = '+i,digits:3});
  eqbar(root,'Matching the Gaussian form',
    '\\( \\ln\\mathcal N(\\mathbf{w}\\mid\\mathbf{m}_N,\\mathbf{S})=-\\dfrac{1}{2}\\mathbf{w}^{\\mathrm T}'+
    '\\mathbf{S}^{-1}\\mathbf{w}+\\mathbf{w}^{\\mathrm T}\\mathbf{S}^{-1}\\mathbf{m}_N+C_3\\), '+
    'so reading the quadratic term gives \\(\\mathbf{S}^{-1}\\) and reading the linear term gives '+
    '\\(\\mathbf{S}^{-1}\\mathbf{m}_N\\), which is how the posterior mean and covariance are identified.');
  note(root,['Only two terms depend on \\(\\mathbf{w}\\). The quadratic one bends the surface into an ellipse and the linear one slides its centre to \\(\\mathbf{m}_N\\); \\(C_3\\) only normalises.',
    'Click away from the mean and watch the quadratic term fall much faster than the linear term rises. That gap is the Mahalanobis distance, which is how a Gaussian measures "far".',
    'Add data and the ellipse shrinks and tilts. The tilt is correlation: with \\(x\\in[0,1]\\) the intercept \\(w_0\\) and the slope \\(w_1\\) cannot be pinned down independently.']);
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
  const hint=el('div','legend');b.pc.appendChild(hint);
  hint.innerHTML='<span style="color:var(--muted)">Click anywhere on the plot to place a data point.</span>';
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;draw()}});
  slider(b.pn,{label:'Prior precision \\(\\ln\\alpha\\)',min:-10,max:6,step:.25,value:st.lnAlpha,fmt:v=>fmt(v,2),
    on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'Noise precision \\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  btnrow(b.pn,[{l:'Clear the points',on:()=>{st.xs=[];st.ts=[];draw()}},
    {l:'10 points from \\(\\sin(2\\pi x)\\)',on:()=>{const d=makeData(10,.25,++st.seed);
      st.xs=d.xs.slice();st.ts=d.ts.slice();draw()}},
    {l:'Crowd the left half',on:()=>{const d=makeData(10,.25,++st.seed);
      st.xs=d.xs.map(x=>x*.45);st.ts=st.xs.map((x,i)=>sin2pi(x)+d.es[i]);draw()}},
    {l:'Undo the last point',on:()=>{st.xs.pop();st.ts.pop();draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'n',l:'Points placed'},{k:'s1',l:'\\(s(x)\\) at \\(x=0.1\\)'},
    {k:'s2',l:'\\(s(x)\\) at \\(x=0.5\\)'},{k:'s3',l:'\\(s(x)\\) at \\(x=0.9\\)'},{k:'wid',l:'Widest point of the band',big:true}]);
  eqbar(root,'The predictive distribution, once more',
    '\\( p(t\\mid x,\\mathbf{x},\\mathbf{t})=\\mathcal N\\!\\left(t\\mid m(x),s^{2}(x)\\right)\\), '+
    '\\( s^{2}(x)=\\beta^{-1}+\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{S}\\,\\boldsymbol\\phi(x)\\), '+
    '\\( \\mathbf{S}^{-1}=\\alpha\\mathbf{I}+\\beta\\sum_{n=1}^{N}\\boldsymbol\\phi(x_n)\\boldsymbol\\phi(x_n)^{\\mathrm T}\\).');
  note(root,['Start with an empty plot: the band is just the prior, wide and centred on zero. Place one point and a narrow waist appears around it.',
    'Press "Crowd the left half". The band is tight where you put data and flares over the empty stretch, because \\(\\mathbf{S}\\) only shrinks in the directions the data actually constrain.',
    'Place a point far from the curve and watch how far the mean moves. With \\(M=9\\) a lone outlier can drag the whole fit, which is why α, and more data, matter.']);
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
