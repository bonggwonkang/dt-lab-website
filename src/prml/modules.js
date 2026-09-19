/* PRML simulators: one builder per slide, registered in MODULES. */
import{el,fmt,clamp,tex,sin2pi,makeData,polyval,fit,sse,erms,Plot,board,legend,slider,
  toggle,btnrow,readout,eqbar,note,sub,niceRange,wPanel,applyFit}from'./core.js'
import{p15,p19,p23,p25,p28,p30,p33}from'./modules-mle.js'
import{p34,p35,p36,p37,p38,p39}from'./modules-bayes.js'

/* ===== slide 10 · Setup: fitting a polynomial to a synthetic function (I) ===== */
function p10(root){
  const st={N:10,sigma:.25,seed:3,truth:true,eps:false};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},{c:'var(--obs)',t:'dot',l:'observation \\(t_n\\)'},
    {c:'var(--muted)',t:'dash',l:'noise \\(\\epsilon_n\\)'}]);
  const P=new Plot(b.pc,{h:340});
  const out=readout(b.pn,[{k:'N',l:'Points \\(N\\)'},{k:'sg',l:'Noise \\(\\sigma\\)'},
    {k:'me',l:'Sample mean of \\(\\epsilon\\)'},{k:'se',l:'Sample s.d. of \\(\\epsilon\\)'}]);
  b.pn.appendChild(el('div','hr'));
  const sN=slider(b.pn,{label:'Number of points \\(N\\)',min:2,max:100,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  const sS=slider(b.pn,{label:'Noise level \\(\\sigma\\)',min:0,max:.6,step:.01,value:st.sigma,fmt:v=>fmt(v,2),on:v=>{st.sigma=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'Reset \\((N=10,\\ \\sigma=0.25)\\)',on:()=>{st.N=10;st.sigma=.25;sN.set(10);sS.set(.25);gen()}}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show \\(\\sin(2\\pi x)\\)',st.truth,v=>{st.truth=v;P.draw()});
  toggle(tg,'Show the noise \\(\\epsilon_n\\)',st.eps,v=>{st.eps=v;P.draw()});
  eqbar(root,'Synthetic data set',
    '\\( x_n=\\dfrac{n}{N-1}\\in[0,1]\\), \\(t_n=\\sin(2\\pi x_n)+\\epsilon\\), \\(\\epsilon\\sim\\mathcal N(0,\\sigma^2)\\)<br>'+
    'training set \\(\\mathbf{x}\\equiv(x_1,\\dots,x_N)^{\\mathrm T}\\), target vector \\(\\mathbf{t}\\equiv(t_1,\\dots,t_N)^{\\mathrm T}\\)');
  note(root,['The green curve \\(\\sin(2\\pi x)\\) is what we want to learn; the blue circles are all we are given. As σ grows, the observations \\(t_n\\) drift away from the curve.',
    'Increase \\(N\\). Every single point is still wrong, but the shape of the curve emerges from the cloud. This is why <b>the larger the data set, the more complex the model we can afford to fit</b>.',
    '“Draw a new sample” keeps σ fixed and redraws the noise \\(\\epsilon\\) only. The same σ gives a different data set every time, and that variability is exactly the uncertainty in \\(\\mathbf{w}\\) the Bayesian treatment will carry.']);
  function gen(){st.d=makeData(st.N,st.sigma,st.seed);
    const m=st.d.es.reduce((a,b)=>a+b,0)/st.N,v=st.d.es.reduce((a,b)=>a+(b-m)*(b-m),0)/Math.max(1,st.N-1);
    out({N:st.N,sg:fmt(st.sigma,2),me:fmt(m,3),se:fmt(Math.sqrt(v),3)});P.draw()}
  P.render=p=>{const c=p.col,d=st.d;
    if(st.eps)d.xs.forEach((x,n)=>p.seg(x,sin2pi(x),d.ts[n],c.muted,1.5,[3,3]));
    if(st.truth)p.path(sin2pi,c.truth,2.5);
    p.dots(d.xs,d.ts,c.obs,st.N>50?3:4.4)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'sin(2πx) = '+fmt(sin2pi(x),2),c:P.col.truth}];
  gen()}

/* ===== slide 11 · Setup: fitting a polynomial to a synthetic function (II) ===== */
function p11(root){
  const st={w:[0,0,0,0],rng:10,terms:false,truth:true,data:true,d:makeData(10,.25,3)};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--fit)',l:'\\(y(x,\\mathbf{w})\\)'},{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},
    {c:'var(--obs)',t:'dot',l:'observation \\(t_n\\)'},{c:'var(--muted)',t:'dash',l:'term \\(w_jx^{j}\\)'}]);
  const P=new Plot(b.pc,{h:350,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  slider(b.pn,{label:'Order \\(M\\)',min:0,max:9,step:1,value:3,on:v=>{
    const w=new Array(v+1).fill(0);st.w.forEach((x,j)=>{if(j<=v)w[j]=x});st.w=w;W.rebuild();draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Set \\(\\mathbf{w}\\) to \\(\\mathbf{w}^{*}\\)',on:()=>{applyFit(st,W);draw()}},
    {l:'Double every \\(w_j\\)',on:()=>{st.w=st.w.map(v=>v*2);st.rng=niceRange(Math.max.apply(null,st.w.map(Math.abs))||1);W.sync();draw()}},
    {l:'Reset \\(\\mathbf{w}\\) to \\(\\mathbf{0}\\)',on:()=>{st.w=st.w.map(()=>0);st.rng=10;W.sync();draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'M',l:'Order \\(M\\)'},{k:'np',l:'Coefficients \\(M+1\\)'},{k:'E',l:'\\(E(\\mathbf{w})\\)'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show each term \\(w_jx^{j}\\)',st.terms,v=>{st.terms=v;P.draw()});
  toggle(tg,'Show \\(\\sin(2\\pi x)\\)',st.truth,v=>{st.truth=v;P.draw()});
  toggle(tg,'Show the training data',st.data,v=>{st.data=v;P.draw()});
  eqbar(root,'Polynomial curve',
    '\\( y(x,\\mathbf{w}) = w_0+w_1x+w_2x^2+\\cdots+w_Mx^M=\\sum_{j=0}^{M}w_jx^{j}\\)<br>'+
    'a nonlinear function of \\(x\\), but a <b>linear function of the coefficients</b> \\(\\mathbf{w}\\).');
  note(root,['\\(w_0\\) shifts the whole curve, \\(w_1\\) tilts it, and \\(w_2,\\dots,w_M\\) add bends. Switch on “each term” to watch the contributions \\(w_jx^j\\) add up to the red curve.',
    'Press <b>“Double every wⱼ”</b>: the curve is scaled by exactly two, \\(y(x,a\\mathbf{w})=a\\,y(x,\\mathbf{w})\\). That is what “linear in \\(\\mathbf{w}\\)” means, and it is why the error function can be minimised exactly in closed form.',
    'Raise \\(M\\) and press “Set w to w*”. At \\(M=9\\) the curve passes through every point but oscillates wildly (over-fitting), and the slider ranges blow up to the coefficient magnitudes of Table 1.1.']);
  function draw(){out({M:st.w.length-1,np:st.w.length,E:fmt(sse(st.d.xs,st.d.ts,st.w),3)});P.draw()}
  P.render=p=>{const c=p.col;
    if(st.terms)st.w.forEach((wj,j)=>{if(!wj)return;p.path(x=>wj*Math.pow(x,j),c.muted,1.2,[4,3]);
      p.label(1.02,clamp(wj,-2,2),'w'+sub(j)+'x'+supd(j),c.muted,'left')});
    if(st.truth)p.path(sin2pi,c.truth,2.2);
    if(st.data)p.dots(st.d.xs,st.d.ts,c.obs);
    p.path(x=>polyval(st.w,x),c.fit,2.6)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'y(x,w) = '+fmt(polyval(st.w,x),2),c:P.col.fit},
    {t:'sin(2πx) = '+fmt(sin2pi(x),2),c:P.col.truth}];
  draw()}
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',supd=j=>String(j).split('').map(d=>SUP[+d]).join('');

/* ===== slide 12 · Prediction error function (I) ===== */
function p12(root){
  const st={w:[.3,.3],rng:6,rngMin:6,d:makeData(10,.25,3),bars:true};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--fit)',l:'\\(y(x,\\mathbf{w})\\)'},{c:'var(--obs)',t:'dot',l:'observation \\(t_n\\)'},
    {c:'var(--truth)',l:'displacement \\(y(x_n,\\mathbf{w})-t_n\\)'}]);
  const P=new Plot(b.pc,{h:345,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const surfWrap=el('div','card plotcard');
  slider(b.pn,{label:'Order \\(M\\)',min:0,max:2,step:1,value:1,on:v=>{
    const w=new Array(v+1).fill(0);st.w.forEach((x,j)=>{if(j<=v)w[j]=x});st.w=w;
    W.rebuild();buildPanels();draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Move to \\(\\mathbf{w}^{*}\\)',on:()=>{applyFit(st,W);draw()}},
    {l:'Reset \\(\\mathbf{w}\\) to \\(\\mathbf{0}\\)',on:()=>{st.w=st.w.map(()=>0);st.rng=st.rngMin;W.sync();draw()}},
    {l:'New sample',on:()=>{st.d=makeData(10,.25,st.d.seed+1);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'E',l:'\\(E(\\mathbf{w})\\)',big:true},{k:'Em',l:'Minimum \\(E(\\mathbf{w}^{*})\\)'},
    {k:'gap',l:'\\(E(\\mathbf{w})-E(\\mathbf{w}^{*})\\)'},
    {k:'rms',l:'\\(E_{\\mathrm{RMS}}\\)'},{k:'mx',l:'Largest displacement'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show the displacements',st.bars,v=>{st.bars=v;P.draw()});
  eqbar(root,'Sum-of-squares error',
    '\\( E(\\mathbf{w})=\\dfrac{1}{2}\\sum_{n=1}^{N}\\{y(x_n,\\mathbf{w})-t_n\\}^{2}\\). Each green bar is the displacement '+
    '\\(|y(x_n,\\mathbf{w})-t_n|\\) of one data point from the curve, and \\(E(\\mathbf{w})\\) is one half of the sum of their squares.');
  root.appendChild(surfWrap);
  const scap=el('div','legend');surfWrap.appendChild(scap);
  scap.innerHTML='<span><b style="font-weight:600">The error as a function of the coefficients</b></span>'+
    '<span style="color:var(--muted)">&times; marks the minimiser \\(\\mathbf{w}^{*}\\) &middot; '+
    'click anywhere to move \\(\\mathbf{w}\\) there</span>';
  const panels=el('div');panels.style.cssText='display:grid;gap:16px';surfWrap.appendChild(panels);
  note(root,['The same data set gives a completely different total \\(E(\\mathbf{w})\\) depending on how the curve is drawn. Learning means finding the \\(\\mathbf{w}^{*}\\) that makes this total as small as possible.',
    'Because \\(E(\\mathbf{w})\\) is a <b>quadratic function</b> of the coefficients, its derivatives are linear in \\(\\mathbf{w}\\): with \\(M=0\\) it is a parabola, with \\(M=1\\) a bowl with elliptical contours, and the minimiser \\(\\mathbf{w}^{*}\\) is unique and can be found in closed form.',
    'At \\(M=2\\) the bowl lives in three dimensions, so it is shown as the three planes you can still draw, each holding the remaining coefficient at its current value. Move that third slider and watch every slice shift, which is why the coefficients cannot be tuned one at a time.']);
  const NX=52,NY=52;
  const ticks=r=>[-r,-r/2,0,r/2,r];
  const Ew=w=>sse(st.d.xs,st.d.ts,w);
  let SP=[];
  function buildPanels(){
    panels.innerHTML='';SP=[];
    const M=st.w.length-1;
    panels.style.gridTemplateColumns=M===2?'repeat(auto-fit,minmax(240px,1fr))':'minmax(0,1fr)';
    if(M===0){
      const box=el('div');box.style.cssText='display:flex;flex-direction:column;gap:6px';
      box.appendChild(el('div','cap','\\(E(w_0)\\), a parabola in the single coefficient'));
      const p=new Plot(box,{h:280,xlim:[-st.rng,st.rng],ylim:[0,1],xl:'w'+sub(0),yl:'E',
        xt:ticks(st.rng),yt:[0,1],pad:[16,18,28,50]});
      p.render=q=>{const c=q.col;
        q.path(v=>Ew([v]),c.acc,2.6);
        q.seg(st.best[0],0,Ew(st.best),c.ink,1.5,[4,4]);
        q.mark(st.best[0],Ew(st.best),c.ink,5);
        q.label(st.best[0],Ew(st.best),'  w*',c.ink,'left',-13);
        q.mark(st.w[0],Ew(st.w),c.fit,6);
        q.label(st.w[0],Ew(st.w),'  current w',c.fit,'left',15)};
      p.hoverFmt=v=>[{t:'w'+sub(0)+' = '+fmt(v,2)},{t:'E(w) = '+fmt(Ew([v]),2),c:p.col.acc}];
      p.onClick=v=>{st.w[0]=clamp(v,-st.rng,st.rng);W.sync();draw()};
      panels.appendChild(box);SP.push({p:p,a:0,b:-1});
    }else{
      const prs=M===1?[[0,1]]:[[0,1],[0,2],[1,2]];
      prs.forEach(pr=>{const a=pr[0],bb=pr[1],
        other=M===2?[0,1,2].filter(k=>k!==a&&k!==bb)[0]:-1;
        const box=el('div');box.style.cssText='display:flex;flex-direction:column;gap:6px';
        box.appendChild(el('div','cap','\\(E(w_'+a+',w_'+bb+')\\)'+
          (other>=0?' with \\(w_'+other+'\\) held where you left it':'')));
        const p=new Plot(box,{h:M===1?300:250,xlim:[-st.rng,st.rng],ylim:[-st.rng,st.rng],
          xl:'w'+sub(a),yl:'w'+sub(bb),xt:ticks(st.rng),yt:ticks(st.rng),pad:[16,18,28,40]});
        p.render=q=>{const c=q.col,w=st.w.slice(),V=[];let mn=Infinity,mx=-Infinity;
          const x0=q.o.xlim[0],x1=q.o.xlim[1],y0=q.o.ylim[0],y1=q.o.ylim[1];
          for(let i=0;i<NX;i++){V.push([]);
            for(let j=0;j<NY;j++){w[a]=x0+(x1-x0)*(i+.5)/NX;w[bb]=y0+(y1-y0)*(j+.5)/NY;
              const v=Math.log(Ew(w)+1e-6);V[i].push(v);if(v<mn)mn=v;if(v>mx)mx=v}}
          q.heat(V,NX,NY,mn,mx);q.axes();
          const g=q.ctx,BX=q.X(st.best[a]),BY=q.Y(st.best[bb]),s=6;
          g.save();g.strokeStyle=c.ink;g.lineWidth=2;g.beginPath();
          g.moveTo(BX-s,BY-s);g.lineTo(BX+s,BY+s);g.moveTo(BX+s,BY-s);g.lineTo(BX-s,BY+s);
          g.stroke();g.restore();
          q.label(st.best[a],st.best[bb],'  w*',c.ink,'left',-13);
          q.mark(st.w[a],st.w[bb],c.fit,6);
          q.label(st.w[a],st.w[bb],'  current w',c.fit,'left',15)};
        p.hoverFmt=(x,y)=>{const w=st.w.slice();w[a]=x;w[bb]=y;
          return[{t:'w'+sub(a)+' = '+fmt(x,2)+', w'+sub(bb)+' = '+fmt(y,2)},
            {t:'E(w) = '+fmt(Ew(w),2),c:p.col.acc}]};
        p.onClick=(x,y)=>{st.w[a]=clamp(x,-st.rng,st.rng);st.w[bb]=clamp(y,-st.rng,st.rng);
          W.sync();draw()};
        panels.appendChild(box);SP.push({p:p,a:a,b:bb})})
    }
    tex(panels)}
  function draw(){const E=Ew(st.w),ws=fit(st.d.xs,st.d.ts,st.w.length-1),Em=Ew(ws);
    let mx=0;st.d.xs.forEach((x,n)=>{mx=Math.max(mx,Math.abs(polyval(st.w,x)-st.d.ts[n]))});
    out({E:fmt(E,3),Em:fmt(Em,3),gap:fmt(E-Em,3),rms:fmt(erms(st.d.xs,st.d.ts,st.w),3),mx:fmt(mx,3)});
    st.best=ws;
    SP.forEach(s=>{s.p.o.xlim=[-st.rng,st.rng];s.p.o.xt=ticks(st.rng);
      if(s.b>=0){s.p.o.ylim=[-st.rng,st.rng];s.p.o.yt=ticks(st.rng)}
      else{const top=Math.max(Ew([-st.rng]),Ew([st.rng]));
        s.p.o.ylim=[0,top];s.p.o.yt=[0,Math.round(top/2),Math.round(top)]}
      s.p.draw()});
    P.draw()}
  P.render=p=>{const c=p.col,d=st.d;
    p.path(x=>polyval(st.w,x),c.fit,2.6);
    if(st.bars)d.xs.forEach((x,n)=>p.seg(x,d.ts[n],polyval(st.w,x),c.truth,2.5));
    p.dots(d.xs,d.ts,c.obs)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'y(x, w) = '+fmt(polyval(st.w,x),2),c:P.col.fit}];
  st.best=fit(st.d.xs,st.d.ts,st.w.length-1);
  buildPanels();draw()}

/* ===================== module list ===================== */
const S1='Synthetic function and polynomial curve',
      S2='Probabilistic polynomial curve and MLE-MAP',
      S3='Bayesian polynomial function learning';
const MODULES=[
 {p:10,sec:S1,t:'Setup: fitting a polynomial to a synthetic function (I)',
  g:'The target we want to learn, \\(\\sin(2\\pi x)\\), against the observations \\(t_n\\) we are actually given, controlled by the number of points \\(N\\) and the noise level \\(\\sigma\\).',b:p10},
 {p:11,sec:S1,t:'Setup: fitting a polynomial to a synthetic function (II)',
  g:'Move the coefficients \\(\\mathbf{w}\\) and watch the polynomial \\(y(x,\\mathbf{w})\\) respond, and see why it is a linear function of \\(\\mathbf{w}\\).',b:p11},
 {p:12,sec:S1,t:'Prediction error function (I)',
  g:'How the sum-of-squares error \\(E(\\mathbf{w})\\) changes with the choice of \\(\\mathbf{w}\\), shown as displacement bars and as an error surface.',b:p12},
 {p:15,sec:S1,t:'The root-mean-square (RMS) error',
  g:'\\(E_{\\mathrm{RMS}}\\) on the training set and on an independent test set for various values of \\(M\\), together with the learned \\(\\mathbf{w}^*\\).',b:p15},
 {p:19,sec:S1,t:'An error function that discourages over-fitting',
  g:'How the regularization coefficient \\(\\lambda\\) (the shrinkage method) trades the error term against the penalty term.',b:p19},
 {p:23,sec:S2,t:'Problem setup: synthetic function and probabilistic polynomial curve (I)',
  g:'Extending the deterministic curve \\(y(x,\\mathbf{w})\\) into the conditional distribution \\(p(t|x,\\mathbf{w},\\beta)=\\mathcal N(t|y(x,\\mathbf{w}),\\beta^{-1})\\).',b:p23},
 {p:25,sec:S2,t:'Likelihood of the probabilistic polynomial curve and MLE',
  g:'How the likelihood \\(p(\\mathbf{t}|\\mathbf{x},\\mathbf{w},\\beta)\\) responds as the coefficients \\(\\mathbf{w}\\) move.',b:p25},
 {p:28,sec:S2,t:'Maximum likelihood (MLE): the predictive distribution',
  g:'How \\(\\mathbf{w}_{\\mathrm{ML}}\\) and \\(\\beta_{\\mathrm{ML}}\\) are updated as the number of data points grows.',b:p28},
 {p:30,sec:S2,t:'Maximum a posteriori (MAP): the posterior over w (I)',
  g:'How the prior \\(p(\\mathbf{w}|\\alpha)\\) pulls \\(\\mathbf{w}_{\\mathrm{MAP}}\\) away from \\(\\mathbf{w}_{\\mathrm{ML}}\\).',b:p30},
 {p:33,sec:S3,t:'Bayesian polynomial function (I)',
  g:'What “integrating a variable out” means, using grades \\(Y\\) recorded by gender \\(X\\).',b:p33},
 {p:34,sec:S3,t:'Bayesian polynomial function (II)',
  g:'How the uncertainty in \\(\\mathbf{w}\\) shrinks as data points are added.',b:p34},
 {p:35,sec:S3,t:'Bayesian polynomial function (III)',
  g:'The predictive distribution \\(p(t|x,\\mathbf{x},\\mathbf{t})=\\int p(t|x,\\mathbf{w})p(\\mathbf{w}|\\mathbf{x},\\mathbf{t})\\,d\\mathbf{w}\\), obtained by marginalizing over \\(\\mathbf{w}\\).',b:p35},
 {p:36,sec:S3,t:'Basis functions that span the space of polynomials',
  g:'The polynomial as an inner product, \\(y(x,\\mathbf{w})=\\boldsymbol\\phi(x)^{\\mathrm T}\\mathbf{w}\\).',b:p36},
 {p:37,sec:S3,t:'Bayesian polynomial in basis functions: posterior mean and covariance',
  g:'The matrices behind the posterior: \\(\\sum_n\\boldsymbol\\phi(x_n)\\boldsymbol\\phi(x_n)^{\\mathrm T}\\) and \\(\\sum_n\\boldsymbol\\phi(x_n)t_n\\).',b:p37},
 {p:38,sec:S3,t:'Bayesian polynomial in basis functions: matching the Gaussian form',
  g:'The multivariate Gaussian \\(\\mathcal N(\\mathbf{w}|\\mathbf{m}_N,\\mathbf{S})\\) and the value of each term of the log likelihood.',b:p38},
 {p:39,sec:S3,t:'Deriving the Bayesian predictive distribution',
  g:'How \\(\\mathcal N(t|m(x),s^2(x))\\) responds to the number and the position of the data points.',b:p39}
];
MODULES.forEach((m,i)=>{m.ready=true;m.no=i+1});
export{MODULES};
