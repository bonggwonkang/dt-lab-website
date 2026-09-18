/* PRML simulators: one builder per slide, registered in MODULES. */
import{el,fmt,clamp,tex,sin2pi,makeData,polyval,fit,sse,erms,Plot,board,legend,slider,
  toggle,btnrow,readout,eqbar,note,sub,niceRange,wPanel,applyFit}from'./core.js'
import{p15,p19,p23,p25,p28,p30,p33}from'./modules-mle.js'
import{p34,p35,p36,p37,p38,p39}from'./modules-bayes.js'

/* ===== slide 10 · Setup: fitting a polynomial to a synthetic function (I) ===== */
function p10(root){
  const st={N:10,sigma:.25,seed:3,truth:true,eps:false};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'sin(2πx)'},{c:'var(--obs)',t:'dot',l:'observation tₙ'},
    {c:'var(--muted)',t:'dash',l:'noise εₙ'}]);
  const P=new Plot(b.pc,{h:340});
  const out=readout(b.pn,[{k:'N',l:'Points N'},{k:'sg',l:'Noise σ'},
    {k:'me',l:'Sample mean of ε'},{k:'se',l:'Sample s.d. of ε'}]);
  b.pn.appendChild(el('div','hr'));
  const sN=slider(b.pn,{label:'Number of points N',min:2,max:100,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  const sS=slider(b.pn,{label:'Noise level σ',min:0,max:.6,step:.01,value:st.sigma,fmt:v=>fmt(v,2),on:v=>{st.sigma=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'Reset (N = 10, σ = 0.25)',on:()=>{st.N=10;st.sigma=.25;sN.set(10);sS.set(.25);gen()}}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show sin(2πx)',st.truth,v=>{st.truth=v;P.draw()});
  toggle(tg,'Show the noise εₙ',st.eps,v=>{st.eps=v;P.draw()});
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
  legend(b.pc,[{c:'var(--fit)',l:'y(x, w)'},{c:'var(--truth)',l:'sin(2πx)'},
    {c:'var(--obs)',t:'dot',l:'observation tₙ'},{c:'var(--muted)',t:'dash',l:'term wⱼxʲ'}]);
  const P=new Plot(b.pc,{h:350,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  slider(b.pn,{label:'Order M',min:0,max:9,step:1,value:3,on:v=>{
    const w=new Array(v+1).fill(0);st.w.forEach((x,j)=>{if(j<=v)w[j]=x});st.w=w;W.rebuild();draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Set w to w*',on:()=>{applyFit(st,W);draw()}},
    {l:'Double every wⱼ',on:()=>{st.w=st.w.map(v=>v*2);st.rng=niceRange(Math.max.apply(null,st.w.map(Math.abs))||1);W.sync();draw()}},
    {l:'Reset w to 0',on:()=>{st.w=st.w.map(()=>0);st.rng=10;W.sync();draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'M',l:'Order M'},{k:'np',l:'Coefficients M+1'},{k:'E',l:'E(w)'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show each term wⱼxʲ',st.terms,v=>{st.terms=v;P.draw()});
  toggle(tg,'Show sin(2πx)',st.truth,v=>{st.truth=v;P.draw()});
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
  legend(b.pc,[{c:'var(--fit)',l:'y(x, w)'},{c:'var(--obs)',t:'dot',l:'observation tₙ'},
    {c:'var(--truth)',l:'displacement y(xₙ,w) − tₙ'}]);
  const P=new Plot(b.pc,{h:345,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const surfWrap=el('div','card plotcard');
  slider(b.pn,{label:'Order M',min:0,max:3,step:1,value:1,on:v=>{
    const w=new Array(v+1).fill(0);st.w.forEach((x,j)=>{if(j<=v)w[j]=x});st.w=w;W.rebuild();draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Move to w*',on:()=>{applyFit(st,W);draw()}},
    {l:'Reset w to 0',on:()=>{st.w=st.w.map(()=>0);st.rng=st.rngMin;W.sync();draw()}},
    {l:'New sample',on:()=>{st.d=makeData(10,.25,st.d.seed+1);st.g=null;draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'E',l:'E(w)',big:true},{k:'Em',l:'Minimum E(w*)'},{k:'gap',l:'E(w) − E(w*)'},
    {k:'rms',l:'E<sub>RMS</sub>'},{k:'mx',l:'Largest displacement'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show the displacements',st.bars,v=>{st.bars=v;P.draw()});
  eqbar(root,'Sum-of-squares error',
    '\\( E(\\mathbf{w})=\\dfrac{1}{2}\\sum_{n=1}^{N}\\{y(x_n,\\mathbf{w})-t_n\\}^{2}\\). Each green bar is the displacement '+
    '\\(|y(x_n,\\mathbf{w})-t_n|\\) of one data point from the curve, and \\(E(\\mathbf{w})\\) is one half of the sum of their squares.');
  root.appendChild(surfWrap);
  const scap=el('div','legend');surfWrap.appendChild(scap);
  scap.innerHTML='<span><b style="font-weight:600">Error surface E(w₀, w₁)</b></span>'+
    '<span style="color:var(--muted)">stronger colour means larger E(w) · × marks the minimiser w* · click anywhere to move w there</span>';
  const S=new Plot(surfWrap,{h:310,xlim:[-2.6,3.6],ylim:[-6.2,3.2],xl:'w₀',yl:'w₁',xt:[-2,0,2],yt:[-4,-2,0,2],pad:[16,18,28,40]});
  const snote=el('div','soon','The error surface can only be drawn for \\(M=1\\), where the model has just two parameters \\(w_0,w_1\\) and \\(E(\\mathbf{w})\\) fits on a plane. Set the order back to 1 to see it.');
  surfWrap.appendChild(snote);snote.style.display='none';tex(snote);
  note(root,['The same data set gives a completely different total \\(E(\\mathbf{w})\\) depending on how the curve is drawn. Learning means finding the \\(\\mathbf{w}^*\\) that makes this total as small as possible.',
    'Because \\(E(\\mathbf{w})\\) is a <b>quadratic function</b> of the coefficients, its derivatives are linear in \\(\\mathbf{w}\\): the surface has a single valley with elliptical contours, so the minimiser \\(\\mathbf{w}^*\\) is unique and can be found in closed form.',
    'With \\(M>1\\) the surface can no longer be drawn, because there are too many dimensions, but nothing changes in principle: “Move to w*” jumps straight to the bottom of that valley.']);
  S.onClick=(w0,w1)=>{if(st.w.length!==2)return;st.w=[clamp(w0,-st.rng,st.rng),clamp(w1,-st.rng,st.rng)];W.sync();draw()};
  function draw(){const E=sse(st.d.xs,st.d.ts,st.w),ws=fit(st.d.xs,st.d.ts,st.w.length-1),Em=sse(st.d.xs,st.d.ts,ws);
    let mx=0;st.d.xs.forEach((x,n)=>{mx=Math.max(mx,Math.abs(polyval(st.w,x)-st.d.ts[n]))});
    out({E:fmt(E,3),Em:fmt(Em,3),gap:fmt(E-Em,3),rms:fmt(erms(st.d.xs,st.d.ts,st.w),3),mx:fmt(mx,3)});
    st.best=ws;const two=st.w.length===2;S.c.style.display=two?'':'none';scap.style.display=two?'':'none';
    snote.style.display=two?'none':'';P.draw();if(two)S.draw()}
  P.render=p=>{const c=p.col,d=st.d;
    p.path(x=>polyval(st.w,x),c.fit,2.6);
    if(st.bars)d.xs.forEach((x,n)=>p.seg(x,d.ts[n],polyval(st.w,x),c.truth,2.5));
    p.dots(d.xs,d.ts,c.obs)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'y(x,w) = '+fmt(polyval(st.w,x),2),c:P.col.fit}];
  const NX=64,NY=64;
  function grid(){if(st.g)return st.g;const x0=S.o.xlim[0],x1=S.o.xlim[1],y0=S.o.ylim[0],y1=S.o.ylim[1];
    const V=[];let mn=Infinity,mxv=-Infinity;
    for(let i=0;i<NX;i++){V.push([]);for(let j=0;j<NY;j++){
      const a=x0+(x1-x0)*(i+.5)/NX,bq=y0+(y1-y0)*(j+.5)/NY,v=Math.log(sse(st.d.xs,st.d.ts,[a,bq])+1e-6);
      V[i].push(v);if(v<mn)mn=v;if(v>mxv)mxv=v}}
    st.g={V:V,mn:mn,mx:mxv};return st.g}
  S.render=p=>{if(st.w.length!==2)return;const g=p.ctx,c=p.col,G=grid();
    const x0=p.o.xlim[0],x1=p.o.xlim[1],y0=p.o.ylim[0],y1=p.o.ylim[1];
    const cw=(p.X(x1)-p.X(x0))/NX,ch=(p.Y(y0)-p.Y(y1))/NY;
    for(let i=0;i<NX;i++)for(let j=0;j<NY;j++){
      const t=(G.V[i][j]-G.mn)/(G.mx-G.mn||1),k=clamp(Math.floor(t*6),0,5);
      g.fillStyle=c.ramp[k];g.fillRect(p.X(x0)+i*cw-.5,p.Y(y1)+(NY-1-j)*ch-.5,cw+1,ch+1)}
    p.axes();
    const bw=st.best;g.save();g.strokeStyle=c.ink;g.lineWidth=2;const BX=p.X(bw[0]),BY=p.Y(bw[1]),s=6;
    g.beginPath();g.moveTo(BX-s,BY-s);g.lineTo(BX+s,BY+s);g.moveTo(BX+s,BY-s);g.lineTo(BX-s,BY+s);g.stroke();g.restore();
    p.label(bw[0],bw[1],'  w*',c.ink,'left',-13);
    p.mark(st.w[0],st.w[1],c.fit,6);p.label(st.w[0],st.w[1],'  current w',c.fit,'left',15)};
  S.hoverFmt=(a,bq)=>[{t:'w₀ = '+fmt(a,2)+', w₁ = '+fmt(bq,2)},{t:'E(w) = '+fmt(sse(st.d.xs,st.d.ts,[a,bq]),2),c:S.col.acc}];
  draw()}

/* ===================== module list ===================== */
const S1='Sinusoidal function and polynomial curve',
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
 {p:23,sec:S2,t:'Problem setup: sinusoidal function and probabilistic polynomial curve (I)',
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
