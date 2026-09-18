/* PRML simulators, slides 15 to 33: model selection, regularization, MLE and MAP. */
import{el,fmt,clamp,sin2pi,makeData,polyval,fit,sse,erms,Plot,board,legend,slider,toggle,
  btnrow,readout,eqbar,note,sub,wchips,gaussPdf,wPanel,applyFit}from'./core.js'

const norm2=w=>w.reduce((a,v)=>a+v*v,0);

/* ===== slide 15 · The root-mean-square (RMS) error ===== */
export function p15(root){
  const st={M:3,N:10,sigma:.25,seed:3};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'sin(2πx)'},{c:'var(--obs)',t:'dot',l:'training data'},
    {c:'var(--fit)',l:'y(x, w*)'}]);
  const P=new Plot(b.pc,{h:250,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const card=el('div','card plotcard');root.appendChild(card);
  legend(card,[{c:'var(--obs)',l:'training'},{c:'var(--fit)',l:'test (100 fresh points)'},
    {c:'var(--accent)',t:'dash',l:'the order M you selected'}]);
  const R=new Plot(card,{h:260,xlim:[-.6,9.6],ylim:[-.04,1.04],xl:'M',yl:'E_RMS',
    xt:[0,3,6,9],yt:[0,.5,1],pad:[16,18,28,40]});
  const sM=slider(b.pn,{label:'Order M',min:0,max:9,step:1,value:st.M,on:v=>{st.M=v;draw()}});
  const sN=slider(b.pn,{label:'Training points N',min:4,max:60,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Noise σ',min:0,max:.6,step:.01,value:st.sigma,fmt:v=>fmt(v,2),on:v=>{st.sigma=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'Jump to the best M',on:()=>{st.M=st.best;sM.set(st.best);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'tr',l:'E<sub>RMS</sub> training'},{k:'te',l:'E<sub>RMS</sub> test'},
    {k:'best',l:'Best M on the test set'},{k:'np',l:'Coefficients M+1'}]);
  const chips=wchips(b.pn,'Learned w*');
  eqbar(root,'Root-mean-square error',
    '\\( E_{\\mathrm{RMS}}=\\sqrt{2E(\\mathbf{w}^{*})/N}\\), where dividing by \\(N\\) lets us compare data sets of '+
    'different sizes on an equal footing and the square root puts the error on the same scale as the target \\(t\\).');
  note(root,['Training error falls all the way to zero as \\(M\\) grows: with \\(M=9\\) and \\(N=10\\) the polynomial has enough freedom to pass through every point.',
    'Test error tells the real story. It flattens out around \\(M=3\\dots 8\\) and then explodes, which is over-fitting seen as a number rather than as a wiggly curve.',
    'Raise \\(N\\) and watch the explosion move to the right. The larger the data set, the more complex the model we can afford to fit.']);
  function gen(){st.tr=makeData(st.N,st.sigma,st.seed);st.te=makeData(100,st.sigma,st.seed+977);
    st.rows=[];let best=0,bv=Infinity;
    for(let M=0;M<=9;M++){const w=fit(st.tr.xs,st.tr.ts,M),a=erms(st.tr.xs,st.tr.ts,w),e=erms(st.te.xs,st.te.ts,w);
      st.rows.push({M:M,w:w,tr:a,te:e});if(e<bv){bv=e;best=M}}
    st.best=best;draw()}
  function draw(){const r=st.rows[st.M];
    out({tr:fmt(r.tr,3),te:fmt(r.te,3),best:st.best,np:st.M+1});chips(r.w,2);P.draw();R.draw()}
  P.render=p=>{const c=p.col;p.path(sin2pi,c.truth,2.2);
    p.dots(st.tr.xs,st.tr.ts,c.obs,st.N>30?3:4.2);
    p.path(x=>polyval(st.rows[st.M].w,x),c.fit,2.6)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'y(x, w*) = '+fmt(polyval(st.rows[st.M].w,x),2),c:P.col.fit},
    {t:'sin(2πx) = '+fmt(sin2pi(x),2),c:P.col.truth}];
  R.render=p=>{const c=p.col,cap=v=>clamp(v,0,1.04);
    p.seg(st.M,-.04,1.04,c.acc,1.5,[4,4]);
    p.line(st.rows.map(r=>[r.M,cap(r.tr)]),c.obs,2.5);
    p.line(st.rows.map(r=>[r.M,cap(r.te)]),c.fit,2.5);
    p.dots(st.rows.map(r=>r.M),st.rows.map(r=>cap(r.tr)),c.obs,4);
    p.dots(st.rows.map(r=>r.M),st.rows.map(r=>cap(r.te)),c.fit,4)};
  R.hoverFmt=x=>{const M=clamp(Math.round(x),0,9),r=st.rows[M];
    return[{t:'M = '+M},{t:'training '+fmt(r.tr,3),c:R.col.obs},{t:'test '+fmt(r.te,3),c:R.col.fit}]};
  R.onClick=x=>{const M=clamp(Math.round(x),0,9);st.M=M;sM.set(M);draw()};
  gen()}

/* ===== slide 19 · An error function that discourages over-fitting ===== */
export function p19(root){
  const st={lnLam:-18,M:9,N:10,sigma:.25,seed:3};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'sin(2πx)'},{c:'var(--obs)',t:'dot',l:'training data'},
    {c:'var(--fit)',l:'y(x, w*) with the penalty term'}]);
  const P=new Plot(b.pc,{h:250,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const card=el('div','card plotcard');root.appendChild(card);
  legend(card,[{c:'var(--obs)',l:'training'},{c:'var(--fit)',l:'test'},
    {c:'var(--accent)',t:'dash',l:'the ln λ you selected'}]);
  const R=new Plot(card,{h:250,xlim:[-40,0],ylim:[-.04,1.04],xl:'ln λ',yl:'E_RMS',
    xt:[-35,-30,-25,-20,-15,-10,-5,0],yt:[0,.5,1],pad:[16,18,28,40]});
  const sL=slider(b.pn,{label:'Regularization ln λ',min:-40,max:0,step:.5,value:st.lnLam,
    fmt:v=>fmt(v,1),on:v=>{st.lnLam=v;draw()}});
  slider(b.pn,{label:'Order M',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;gen()}});
  slider(b.pn,{label:'Training points N',min:4,max:40,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'No penalty (λ → 0)',on:()=>{st.lnLam=-40;sL.set(-40);draw()}},
    {l:'Jump to the best λ',on:()=>{st.lnLam=st.best;sL.set(st.best);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'lam',l:'λ'},{k:'err',l:'Error term'},{k:'pen',l:'Penalty term'},
    {k:'tot',l:'Total Ẽ(w)',big:true},{k:'nw',l:'‖w‖'},{k:'tr',l:'E<sub>RMS</sub> training'},
    {k:'te',l:'E<sub>RMS</sub> test'}]);
  const chips=wchips(b.pn,'Learned w*');
  eqbar(root,'Error function with a quadratic regularizer',
    '\\( \\tilde E(\\mathbf{w})=\\dfrac{1}{2}\\sum_{n=1}^{N}\\{y(x_n,\\mathbf{w})-t_n\\}^{2}'+
    '+\\dfrac{\\lambda}{2}\\lVert\\mathbf{w}\\rVert^{2}\\), with '+
    '\\(\\lVert\\mathbf{w}\\rVert^{2}=\\mathbf{w}^{\\mathrm T}\\mathbf{w}=w_0^2+w_1^2+\\cdots+w_M^2\\). '+
    'This quadratic case is ridge regression, known as weight decay in the context of neural networks.');
  note(root,['Start at \\(\\ln\\lambda=-40\\), which is effectively no penalty: the \\(M=9\\) curve passes through every point and the coefficients reach the huge values of Table 1.1.',
    'Increase \\(\\ln\\lambda\\) and watch the two numbers trade places. The error term grows while the penalty term shrinks the coefficients, and the test error drops.',
    'Push \\(\\lambda\\) too far and the penalty wins outright: the coefficients are driven towards zero and the curve flattens, so both errors rise again.']);
  function gen(){st.tr=makeData(st.N,st.sigma,st.seed);st.te=makeData(100,st.sigma,st.seed+977);
    st.rows=[];let best=-40,bv=Infinity;
    for(let l=-40;l<=0;l+=.5){const w=fit(st.tr.xs,st.tr.ts,st.M,Math.exp(l)),
      e=erms(st.te.xs,st.te.ts,w);st.rows.push({l:l,tr:erms(st.tr.xs,st.tr.ts,w),te:e});
      if(e<bv){bv=e;best=l}}
    st.best=best;draw()}
  function draw(){const lam=Math.exp(st.lnLam),w=fit(st.tr.xs,st.tr.ts,st.M,lam),
    err=sse(st.tr.xs,st.tr.ts,w),pen=.5*lam*norm2(w);
    st.w=w;out({lam:fmt(lam,lam<1?4:2),err:fmt(err,3),pen:fmt(pen,3),tot:fmt(err+pen,3),
      nw:fmt(Math.sqrt(norm2(w)),2),tr:fmt(erms(st.tr.xs,st.tr.ts,w),3),te:fmt(erms(st.te.xs,st.te.ts,w),3)});
    chips(w,2);P.draw();R.draw()}
  P.render=p=>{const c=p.col;p.path(sin2pi,c.truth,2.2);p.dots(st.tr.xs,st.tr.ts,c.obs);
    p.path(x=>polyval(st.w,x),c.fit,2.6)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'y(x, w*) = '+fmt(polyval(st.w,x),2),c:P.col.fit}];
  R.render=p=>{const c=p.col,cap=v=>clamp(v,0,1.04);
    p.seg(st.lnLam,-.04,1.04,c.acc,1.5,[4,4]);
    p.line(st.rows.map(r=>[r.l,cap(r.tr)]),c.obs,2.5);
    p.line(st.rows.map(r=>[r.l,cap(r.te)]),c.fit,2.5)};
  R.hoverFmt=x=>{const i=clamp(Math.round((x+40)/.5),0,st.rows.length-1),r=st.rows[i];
    return[{t:'ln λ = '+fmt(r.l,1)},{t:'training '+fmt(r.tr,3),c:R.col.obs},{t:'test '+fmt(r.te,3),c:R.col.fit}]};
  R.onClick=x=>{const l=clamp(Math.round(x*2)/2,-40,0);st.lnLam=l;sL.set(l);draw()};
  gen()}

/* ===== slide 23 · From a deterministic curve to a probabilistic one ===== */
export function p23(root){
  const st={w:[.2,1.5,-2.4,.6],rng:10,beta:11.1,x0:.45,band:true,bell:true,d:makeData(10,.25,3)};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--fit)',l:'mean y(x, w)'},{c:'var(--fit)',t:'dash',l:'±1 standard deviation'},
    {c:'var(--obs)',t:'dot',l:'observation tₙ'},{c:'var(--truth)',l:'sin(2πx)'}]);
  const P=new Plot(b.pc,{h:360,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  slider(b.pn,{label:'Order M',min:0,max:9,step:1,value:3,on:v=>{
    const w=new Array(v+1).fill(0);st.w.forEach((x,j)=>{if(j<=v)w[j]=x});st.w=w;W.rebuild();draw()}});
  const sB=slider(b.pn,{label:'Precision β',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  const sX=slider(b.pn,{label:'Show the distribution at x₀',min:0,max:1,step:.01,value:st.x0,
    fmt:v=>fmt(v,2),on:v=>{st.x0=v;P.draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Set w to w*',on:()=>{applyFit(st,W);draw()}},
    {l:'Reset w to 0',on:()=>{st.w=st.w.map(()=>0);st.rng=10;W.sync();draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'sd',l:'σ = β^(-1/2)'},{k:'y0',l:'y(x₀, w)'},
    {k:'p0',l:'p(t | x₀, w, β) at its peak'},{k:'in',l:'Points inside ±1σ'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show the ±1σ band',st.band,v=>{st.band=v;P.draw()});
  toggle(tg,'Show the Gaussian at x₀',st.bell,v=>{st.bell=v;P.draw()});
  eqbar(root,'A Gaussian conditional distribution for the target',
    '\\( p(t\\mid x,\\mathbf{w},\\beta)=\\mathcal N\\!\\left(t\\mid y(x,\\mathbf{w}),\\beta^{-1}\\right)\\), '+
    'where the mean is the polynomial \\(y(x,\\mathbf{w})\\) and the precision \\(\\beta\\) is the inverse variance, '+
    '\\(\\beta^{-1}=\\sigma^{2}\\).');
  note(root,['The curve no longer predicts a single value. At every \\(x\\) it now carries a whole Gaussian, drawn sideways at \\(x_0\\), whose centre is the old deterministic prediction \\(y(x,\\mathbf{w})\\).',
    'Lower \\(\\beta\\) and the bell flattens and the band widens: the model admits more noise. Raise \\(\\beta\\) and it claims the targets sit almost exactly on the curve.',
    'Move \\(\\mathbf{w}\\) and the whole distribution moves with it, because \\(\\mathbf{w}\\) sets only the mean. \\(\\beta\\) and \\(\\mathbf{w}\\) are separate parameters, and the next slides estimate both from the data.']);
  function draw(){const sd=1/Math.sqrt(st.beta);let inside=0;
    st.d.xs.forEach((x,n)=>{if(Math.abs(st.d.ts[n]-polyval(st.w,x))<=sd)inside++});
    out({sd:fmt(sd,3),y0:fmt(polyval(st.w,st.x0),3),p0:fmt(gaussPdf(0,0,sd),2),
      in:inside+' of '+st.d.N});P.draw()}
  P.render=p=>{const c=p.col,sd=1/Math.sqrt(st.beta),y=x=>polyval(st.w,x);
    if(st.band)p.band(x=>y(x)-sd,x=>y(x)+sd,c.fit,.15);
    p.path(sin2pi,c.truth,2);
    if(st.band){p.path(x=>y(x)-sd,c.fit,1,[4,4]);p.path(x=>y(x)+sd,c.fit,1,[4,4])}
    p.path(y,c.fit,2.6);p.dots(st.d.xs,st.d.ts,c.obs);
    if(!st.bell)return;
    const g=p.ctx,y0=y(st.x0),scale=70*sd;
    p.seg(st.x0,p.o.ylim[0],p.o.ylim[1],c.line2,1,[3,3]);
    g.save();g.strokeStyle=c.fit;g.lineWidth=2;g.beginPath();
    for(let i=0;i<=120;i++){const t=y0-4*sd+8*sd*i/120,d=gaussPdf(t,y0,sd)*scale,
      X=p.X(st.x0)+d,Y=p.Y(t);i?g.lineTo(X,Y):g.moveTo(X,Y)}
    g.stroke();g.restore();
    p.mark(st.x0,y0,c.fit,4);p.label(st.x0,y0,'  y(x₀, w)',c.fit,'left',-13)};
  P.hoverFmt=(x,t)=>{const sd=1/Math.sqrt(st.beta),y=polyval(st.w,x);
    return[{t:'x = '+fmt(x,2)},{t:'y(x, w) = '+fmt(y,2),c:P.col.fit},
      {t:'p(t | x) = '+fmt(gaussPdf(t,y,sd),3)}]};
  draw()}

/* ===== slide 25 · Likelihood and maximum likelihood ===== */
export function p25(root){
  const st={w:[.2,1.5,-2.4,.6],rng:10,beta:11.1,j:1,d:makeData(10,.25,3)};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--fit)',l:'y(x, w)'},{c:'var(--obs)',t:'dot',l:'observation tₙ'},
    {c:'var(--truth)',l:'density p(tₙ | xₙ, w, β)'}]);
  const P=new Plot(b.pc,{h:300,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const card=el('div','card plotcard');root.appendChild(card);
  const cap=el('div','legend');card.appendChild(cap);
  cap.innerHTML='<span><b style="font-weight:600">Log likelihood as one coefficient moves</b></span>'+
    '<span style="color:var(--muted)">every other coefficient is held where you left it</span>';
  const L=new Plot(card,{h:240,xlim:[-10,10],ylim:[-200,60],xl:'wⱼ',yl:'ln p',
    xt:[-10,-5,0,5,10],yt:[-200,-100,0],pad:[16,18,28,46]});
  slider(b.pn,{label:'Order M',min:0,max:9,step:1,value:3,on:v=>{
    const w=new Array(v+1).fill(0);st.w.forEach((x,j)=>{if(j<=v)w[j]=x});st.w=w;
    st.j=Math.min(st.j,v);sJ.setRange(0,v,1);sJ.set(st.j);W.rebuild();draw()}});
  slider(b.pn,{label:'Precision β',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  const sJ=slider(b.pn,{label:'Coefficient to sweep, j',min:0,max:3,step:1,value:st.j,
    on:v=>{st.j=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Set w to w_ML',on:()=>{applyFit(st,W);draw()}},
    {l:'Reset w to 0',on:()=>{st.w=st.w.map(()=>0);st.rng=10;W.sync();draw()}},
    {l:'New sample',on:()=>{st.d=makeData(10,.25,st.d.seed+1);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'ll',l:'ln p(t | x, w, β)',big:true},{k:'t1',l:'−β/2 · Σ{y−t}²'},
    {k:'t2',l:'+N/2 · ln β'},{k:'t3',l:'−N/2 · ln(2π)'},{k:'e',l:'E(w)'},{k:'gap',l:'ln p at w_ML'}]);
  eqbar(root,'Likelihood and log likelihood',
    '\\( p(\\mathbf{t}\\mid\\mathbf{x},\\mathbf{w},\\beta)=\\prod_{n=1}^{N}'+
    '\\mathcal N\\!\\left(t_n\\mid y(x_n,\\mathbf{w}),\\beta^{-1}\\right)\\)<br>'+
    '\\( \\ln p(\\mathbf{t}\\mid\\mathbf{x},\\mathbf{w},\\beta)=-\\dfrac{\\beta}{2}\\sum_{n=1}^{N}'+
    '\\{y(x_n,\\mathbf{w})-t_n\\}^{2}+\\dfrac{N}{2}\\ln\\beta-\\dfrac{N}{2}\\ln(2\\pi)\\)');
  note(root,['Each green stem is the density the model assigns to one observed target. The likelihood is their product, which is why a single badly missed point can sink the whole thing.',
    'Only the first term depends on \\(\\mathbf{w}\\), and it is \\(-\\beta\\) times the sum-of-squares error. <b>Maximising the likelihood with respect to \\(\\mathbf{w}\\) is exactly minimising \\(E(\\mathbf{w})\\)</b>, so "Set w to w_ML" lands on the same solution as least squares.',
    'The sweep below shows \\(\\ln p\\) as one coefficient moves: a single smooth peak. \\(\\beta\\) changes how sharp that peak is, but not where it sits.']);
  const logLik=(w,beta)=>{let s=0;st.d.xs.forEach((x,n)=>{const r=polyval(w,x)-st.d.ts[n];s+=r*r});
    return -beta/2*s+st.d.N/2*Math.log(beta)-st.d.N/2*Math.log(2*Math.PI)};
  function draw(){const s2=2*sse(st.d.xs,st.d.ts,st.w),N=st.d.N;
    const t1=-st.beta/2*s2,t2=N/2*Math.log(st.beta),t3=-N/2*Math.log(2*Math.PI);
    out({ll:fmt(t1+t2+t3,2),t1:fmt(t1,2),t2:fmt(t2,2),t3:fmt(t3,2),e:fmt(s2/2,3),
      gap:fmt(logLik(fit(st.d.xs,st.d.ts,st.w.length-1),st.beta),2)});
    const w=st.w.slice(),pts=[];let lo=Infinity,hi=-Infinity;
    for(let i=0;i<=160;i++){const v=-st.rng+2*st.rng*i/160;w[st.j]=v;
      const y=logLik(w,st.beta);pts.push([v,y]);if(y>hi)hi=y;if(y<lo)lo=y}
    lo=Math.max(lo,hi-260);st.sweep={pts:pts,lo:lo,hi:hi};
    L.o.xlim=[-st.rng,st.rng];L.o.xt=[-st.rng,0,st.rng];
    L.o.ylim=[lo,hi+(hi-lo)*.14];L.o.yt=[Math.round(lo),Math.round(hi)];
    P.draw();L.draw()}
  P.render=p=>{const c=p.col,sd=1/Math.sqrt(st.beta);
    p.path(x=>polyval(st.w,x),c.fit,2.6);
    const g=p.ctx;g.save();g.strokeStyle=c.truth;g.lineWidth=2.5;
    st.d.xs.forEach((x,n)=>{const y=polyval(st.w,x),t=st.d.ts[n],
      h=gaussPdf(t,y,sd)/gaussPdf(0,0,sd);
      g.beginPath();g.moveTo(p.X(x),p.Y(t));g.lineTo(p.X(x)+h*30,p.Y(t));g.stroke()});
    g.restore();
    p.dots(st.d.xs,st.d.ts,c.obs)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'y(x, w) = '+fmt(polyval(st.w,x),2),c:P.col.fit}];
  L.render=p=>{const c=p.col,sw=st.sweep,lo=sw.lo,hi=sw.hi;
    p.line(sw.pts.map(q=>[q[0],clamp(q[1],lo,hi)]),c.fit,2.5);
    const cur=logLik(st.w,st.beta);
    p.seg(st.w[st.j],lo,clamp(cur,lo,hi),c.acc,1.5,[4,4]);
    p.mark(st.w[st.j],clamp(cur,lo,hi),c.acc,5);
    p.label(st.w[st.j],clamp(cur,lo,hi),'  w'+sub(st.j),c.acc,'left',-13)};
  draw()}

/* ===== slide 28 · Maximum likelihood: the predictive distribution ===== */
export function p28(root){
  const st={N:10,M:3,sigma:.25,seed:3};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'sin(2πx)'},{c:'var(--obs)',t:'dot',l:'observation tₙ'},
    {c:'var(--fit)',l:'y(x, w_ML)'},{c:'var(--fit)',t:'dash',l:'±1 σ_ML'}]);
  const P=new Plot(b.pc,{h:290,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const card=el('div','card plotcard');root.appendChild(card);
  const cap=el('div','legend');card.appendChild(cap);
  cap.innerHTML='<span><b style="font-weight:600">Estimated noise level as data accumulate</b></span>'+
    '<span style="color:var(--muted)">the dashed line is the σ the data were actually generated with</span>';
  const S=new Plot(card,{h:230,xlim:[2,80],ylim:[0,.65],xl:'N',yl:'σ_ML',
    xt:[10,20,40,60,80],yt:[0,.25,.5],pad:[16,18,28,46]});
  const sN=slider(b.pn,{label:'Data points N',min:4,max:80,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Order M',min:0,max:9,step:1,value:st.M,on:v=>{st.M=v;gen()}});
  slider(b.pn,{label:'True noise σ',min:.05,max:.6,step:.01,value:st.sigma,fmt:v=>fmt(v,2),
    on:v=>{st.sigma=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'N = 10',on:()=>{st.N=10;sN.set(10);gen()}},{l:'N = 80',on:()=>{st.N=80;sN.set(80);gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'b',l:'β_ML',big:true},{k:'s',l:'σ_ML = β_ML^(-1/2)'},
    {k:'st',l:'True σ'},{k:'e',l:'E<sub>RMS</sub> training'},{k:'te',l:'E<sub>RMS</sub> test'}]);
  const chips=wchips(b.pn,'Learned w_ML');
  eqbar(root,'Maximum likelihood estimates and the predictive distribution',
    '\\( \\dfrac{1}{\\beta_{\\mathrm{ML}}}=\\dfrac{1}{N}\\sum_{n=1}^{N}\\{y(x_n,\\mathbf{w}_{\\mathrm{ML}})-t_n\\}^{2}'+
    '\\qquad p(t\\mid x,\\mathbf{w}_{\\mathrm{ML}},\\beta_{\\mathrm{ML}})='+
    '\\mathcal N\\!\\left(t\\mid y(x,\\mathbf{w}_{\\mathrm{ML}}),\\beta_{\\mathrm{ML}}^{-1}\\right)\\)');
  note(root,['\\(\\beta_{\\mathrm{ML}}\\) is read straight off the residuals: the model calls whatever it failed to fit "noise". With a sensible \\(M\\), \\(\\sigma_{\\mathrm{ML}}\\) settles near the σ the data were generated with.',
    'Push \\(M\\) up to 9 with \\(N=10\\). The residuals vanish, so \\(\\beta_{\\mathrm{ML}}\\) shoots up and the band collapses: the model is now <b>certain and wrong</b>, which is the danger of a point estimate.',
    'Because we now have a distribution rather than a single number, the prediction at a new \\(x\\) is a Gaussian. Its width is the same everywhere, which is exactly what the Bayesian treatment later fixes.']);
  function gen(){st.tr=makeData(st.N,st.sigma,st.seed);st.te=makeData(100,st.sigma,st.seed+977);
    st.curve=[];
    for(let n=4;n<=80;n+=2){const d=makeData(n,st.sigma,st.seed),w=fit(d.xs,d.ts,st.M);
      let s=0;d.xs.forEach((x,i)=>{const r=polyval(w,x)-d.ts[i];s+=r*r});
      st.curve.push([n,Math.sqrt(s/n)])}
    draw()}
  function draw(){const w=fit(st.tr.xs,st.tr.ts,st.M);st.w=w;
    let s=0;st.tr.xs.forEach((x,n)=>{const r=polyval(w,x)-st.tr.ts[n];s+=r*r});
    const varML=s/st.N;st.sd=Math.sqrt(varML);
    out({b:fmt(1/Math.max(varML,1e-12),2),s:fmt(st.sd,3),st:fmt(st.sigma,2),
      e:fmt(erms(st.tr.xs,st.tr.ts,w),3),te:fmt(erms(st.te.xs,st.te.ts,w),3)});
    chips(w,2);P.draw();S.draw()}
  P.render=p=>{const c=p.col,y=x=>polyval(st.w,x),sd=Math.max(st.sd,1e-3);
    p.band(x=>y(x)-sd,x=>y(x)+sd,c.fit,.15);
    p.path(x=>y(x)-sd,c.fit,1,[4,4]);p.path(x=>y(x)+sd,c.fit,1,[4,4]);
    p.path(sin2pi,c.truth,2.2);p.dots(st.tr.xs,st.tr.ts,c.obs,st.N>40?3:4.2);p.path(y,c.fit,2.6)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'y(x, w_ML) = '+fmt(polyval(st.w,x),2),c:P.col.fit},
    {t:'±1σ_ML = '+fmt(st.sd,3)}];
  S.render=p=>{const c=p.col;
    p.line([[2,st.sigma],[80,st.sigma]],c.truth,1.5,[5,4]);
    p.line(st.curve.map(q=>[q[0],clamp(q[1],0,.65)]),c.fit,2.5);
    p.mark(clamp(st.N,2,80),clamp(st.sd,0,.65),c.acc,5)};
  S.hoverFmt=x=>[{t:'N = '+Math.round(x)},{t:'true σ = '+fmt(st.sigma,2),c:S.col.truth}];
  gen()}

/* ===== slide 30 · Maximum a posteriori and the role of the prior ===== */
export function p30(root){
  const st={lnAlpha:-5,M:9,N:10,sigma:.25,beta:11.1,seed:3};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'sin(2πx)'},{c:'var(--obs)',t:'dot',l:'observation tₙ'},
    {c:'var(--fit)',t:'dash',l:'y(x, w_ML)'},{c:'var(--accent)',l:'y(x, w_MAP)'}]);
  const P=new Plot(b.pc,{h:290,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const card=el('div','card plotcard');root.appendChild(card);
  const cap=el('div','legend');card.appendChild(cap);
  cap.innerHTML='<span><b style="font-weight:600">Test error as the prior tightens</b></span>'+
    '<span style="color:var(--muted)">large α means a narrow prior, which pulls every coefficient towards zero</span>';
  const A=new Plot(card,{h:230,xlim:[-14,8],ylim:[-.04,1.04],xl:'ln α',yl:'E_RMS',
    xt:[-12,-8,-4,0,4,8],yt:[0,.5,1],pad:[16,18,28,40]});
  const sA=slider(b.pn,{label:'Prior precision ln α',min:-14,max:8,step:.25,value:st.lnAlpha,
    fmt:v=>fmt(v,2),on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'Order M',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;gen()}});
  slider(b.pn,{label:'Data points N',min:4,max:40,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Noise precision β',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'Flat prior (α → 0)',on:()=>{st.lnAlpha=-14;sA.set(-14);draw()}},
    {l:'Jump to the best α',on:()=>{st.lnAlpha=st.best;sA.set(st.best);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'a',l:'α'},{k:'lam',l:'λ = α/β'},{k:'nml',l:'‖w_ML‖'},
    {k:'nmap',l:'‖w_MAP‖'},{k:'eml',l:'E<sub>RMS</sub> test, ML'},{k:'emap',l:'E<sub>RMS</sub> test, MAP',big:true}]);
  const cML=wchips(b.pn,'w_ML'),cMAP=wchips(b.pn,'w_MAP');
  eqbar(root,'Prior over the coefficients and the MAP estimate',
    '\\( p(\\mathbf{w}\\mid\\alpha)=\\mathcal N\\!\\left(\\mathbf{w}\\mid\\mathbf{0},\\alpha^{-1}\\mathbf{I}\\right)'+
    '=\\left(\\dfrac{\\alpha}{2\\pi}\\right)^{(M+1)/2}\\exp\\!\\left\\{-\\dfrac{\\alpha}{2}'+
    '\\mathbf{w}^{\\mathrm T}\\mathbf{w}\\right\\}\\)<br>'+
    '\\( \\mathbf{w}_{\\mathrm{MAP}}=\\arg\\min_{\\mathbf{w}}\\left[\\dfrac{\\beta}{2}\\sum_{n=1}^{N}'+
    '\\{y(x_n,\\mathbf{w})-t_n\\}^{2}+\\dfrac{\\alpha}{2}\\mathbf{w}^{\\mathrm T}\\mathbf{w}\\right]\\)');
  note(root,['The prior says, before seeing any data, that large coefficients are implausible. Slide α up and the MAP curve peels away from the wild ML curve towards something smooth.',
    'Compare the two equations: MAP with \\(\\alpha\\) and \\(\\beta\\) is the regularized error function of slide 19 with \\(\\lambda=\\alpha/\\beta\\). <b>Regularization was a prior in disguise all along.</b>',
    'Add data and the prior matters less: with \\(N=40\\) the two curves nearly coincide over a wide range of α, because the likelihood term now dominates the prior.']);
  function gen(){st.tr=makeData(st.N,st.sigma,st.seed);st.te=makeData(100,st.sigma,st.seed+977);
    st.rows=[];let best=-14,bv=Infinity;
    for(let a=-14;a<=8;a+=.25){const w=fit(st.tr.xs,st.tr.ts,st.M,Math.exp(a)/st.beta),
      e=erms(st.te.xs,st.te.ts,w);st.rows.push([a,e]);if(e<bv){bv=e;best=a}}
    st.best=best;draw()}
  function draw(){const al=Math.exp(st.lnAlpha),lam=al/st.beta;
    st.wML=fit(st.tr.xs,st.tr.ts,st.M);st.wMAP=fit(st.tr.xs,st.tr.ts,st.M,lam);
    out({a:fmt(al,al<1?4:2),lam:fmt(lam,lam<1?4:2),nml:fmt(Math.sqrt(norm2(st.wML)),1),
      nmap:fmt(Math.sqrt(norm2(st.wMAP)),2),eml:fmt(erms(st.te.xs,st.te.ts,st.wML),3),
      emap:fmt(erms(st.te.xs,st.te.ts,st.wMAP),3)});
    cML(st.wML,1);cMAP(st.wMAP,2);P.draw();A.draw()}
  P.render=p=>{const c=p.col;p.path(sin2pi,c.truth,2.2);p.dots(st.tr.xs,st.tr.ts,c.obs);
    p.path(x=>polyval(st.wML,x),c.fit,2,[5,4]);p.path(x=>polyval(st.wMAP,x),c.acc,2.8)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'w_ML: '+fmt(polyval(st.wML,x),2),c:P.col.fit},
    {t:'w_MAP: '+fmt(polyval(st.wMAP,x),2),c:P.col.acc}];
  A.render=p=>{const c=p.col;
    p.seg(st.lnAlpha,-.04,1.04,c.acc,1.5,[4,4]);
    p.line(st.rows.map(r=>[r[0],clamp(r[1],0,1.04)]),c.acc,2.5);
    p.line([[-14,clamp(erms(st.te.xs,st.te.ts,st.wML),0,1.04)],
      [8,clamp(erms(st.te.xs,st.te.ts,st.wML),0,1.04)]],c.fit,1.5,[5,4])};
  A.hoverFmt=x=>{const i=clamp(Math.round((x+14)/.25),0,st.rows.length-1);
    return[{t:'ln α = '+fmt(st.rows[i][0],2)},{t:'test '+fmt(st.rows[i][1],3),c:A.col.acc}]};
  A.onClick=x=>{const a=clamp(Math.round(x*4)/4,-14,8);st.lnAlpha=a;sA.set(a);draw()};
  gen()}

/* ===== slide 33 · Marginalization: grades recorded by gender ===== */
export function p33(root){
  const st={pF:.5,muM:72,sdM:12,muF:78,sdF:10,show:true};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--obs)',l:'p(Y | X = male)'},{c:'var(--fit)',l:'p(Y | X = female)'},
    {c:'var(--truth)',l:'marginal p(Y)'}]);
  const P=new Plot(b.pc,{h:340,xlim:[30,110],ylim:[0,.055],xl:'Y  (grade)',yl:'density',
    xt:[40,60,80,100],yt:[0,.02,.04],pad:[16,18,28,52]});
  const sP=slider(b.pn,{label:'Share of female records p(X = female)',min:0,max:1,step:.01,
    value:st.pF,fmt:v=>fmt(v,2),on:v=>{st.pF=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  slider(b.pn,{label:'Mean grade, male',min:50,max:95,step:.5,value:st.muM,fmt:v=>fmt(v,1),
    on:v=>{st.muM=v;draw()}});
  slider(b.pn,{label:'Spread, male',min:4,max:20,step:.5,value:st.sdM,fmt:v=>fmt(v,1),
    on:v=>{st.sdM=v;draw()}});
  slider(b.pn,{label:'Mean grade, female',min:50,max:95,step:.5,value:st.muF,fmt:v=>fmt(v,1),
    on:v=>{st.muF=v;draw()}});
  slider(b.pn,{label:'Spread, female',min:4,max:20,step:.5,value:st.sdF,fmt:v=>fmt(v,1),
    on:v=>{st.sdF=v;draw()}});
  btnrow(b.pn,[{l:'All male',on:()=>{st.pF=0;sP.set(0);draw()}},
    {l:'Half and half',on:()=>{st.pF=.5;sP.set(.5);draw()}},
    {l:'All female',on:()=>{st.pF=1;sP.set(1);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'pf',l:'p(X = female)'},{k:'pm',l:'p(X = male)'},
    {k:'em',l:'E[Y | X = male]'},{k:'ef',l:'E[Y | X = female]'},{k:'e',l:'E[Y] after marginalizing',big:true},
    {k:'sd',l:'Standard deviation of p(Y)'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show the two conditionals',st.show,v=>{st.show=v;P.draw()});
  eqbar(root,'The sum rule: integrating a variable out',
    '\\( p(Y)=\\sum_{X}p(Y,X)=\\sum_{X}p(Y\\mid X)\\,p(X)\\), and for a continuous variable the sum '+
    'becomes an integral, \\( p(Y)=\\int p(Y\\mid X)\\,p(X)\\,dX \\). Marginalizing means asking about '+
    '\\(Y\\) while refusing to condition on \\(X\\).');
  note(root,['The marginal is not one of the two conditionals, and it is not their average shape either. It is a <b>weighted mixture</b>: each conditional contributes in proportion to how often that group appears.',
    'Slide the share to 0 or 1 and the marginal collapses onto a single conditional. Keep it near a half with means far apart and the marginal grows two humps, which no single Gaussian could describe.',
    'This is the operation the Bayesian treatment performs on \\(\\mathbf{w}\\): the predictive distribution weighs every possible \\(\\mathbf{w}\\) by how plausible the data made it, instead of committing to one value.']);
  function draw(){const pf=st.pF,pm=1-pf,mean=pm*st.muM+pf*st.muF,
    sec=pm*(st.sdM*st.sdM+st.muM*st.muM)+pf*(st.sdF*st.sdF+st.muF*st.muF);
    out({pf:fmt(pf,2),pm:fmt(pm,2),em:fmt(st.muM,1),ef:fmt(st.muF,1),e:fmt(mean,2),
      sd:fmt(Math.sqrt(Math.max(sec-mean*mean,0)),2)});P.draw()}
  const dM=y=>gaussPdf(y,st.muM,st.sdM),dF=y=>gaussPdf(y,st.muF,st.sdF),
    mix=y=>(1-st.pF)*dM(y)+st.pF*dF(y);
  P.render=p=>{const c=p.col;
    p.band(()=>0,mix,c.truth,.14);
    if(st.show){p.path(y=>(1-st.pF)*dM(y),c.obs,2,[5,4]);p.path(y=>st.pF*dF(y),c.fit,2,[5,4]);
      p.path(dM,c.obs,1.2);p.path(dF,c.fit,1.2)}
    p.path(mix,c.truth,2.8);
    const m=(1-st.pF)*st.muM+st.pF*st.muF;
    p.seg(m,0,mix(m),c.muted,1.5,[3,3]);p.label(m,mix(m),'  E[Y]',c.ink2,'left',-12)};
  P.hoverFmt=y=>[{t:'Y = '+fmt(y,1)},{t:'p(Y) = '+fmt(mix(y),4),c:P.col.truth},
    {t:'p(Y | male) = '+fmt(dM(y),4),c:P.col.obs},{t:'p(Y | female) = '+fmt(dF(y),4),c:P.col.fit}];
  draw()}
