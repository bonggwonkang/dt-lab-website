/* PRML simulators, slides 15 to 33: model selection, regularization, MLE and MAP. */
import{el,fmt,clamp,sin2pi,makeData,polyval,fit,sse,erms,Plot,board,legend,slider,toggle,
  btnrow,readout,eqbar,note,sub,wchips,gaussPdf,wPanel,applyFit}from'./core.js'

const norm2=w=>w.reduce((a,v)=>a+v*v,0);

/* ===== slide 15 · The root-mean-square (RMS) error ===== */
export function p15(root){
  const st={M:3,N:10,sigma:.25,seed:3};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},{c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},
    {c:'var(--fit)',l:'\\(y(x,\\mathbf{w}^{*})\\)'}]);
  const P=new Plot(b.pc,{h:250,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const card=el('div','card plotcard');b.lc.appendChild(card);
  legend(card,[{c:'var(--obs)',l:'\\(E_{\\mathrm{RMS}}^{\\text{train}}\\)'},{c:'var(--fit)',l:'\\(E_{\\mathrm{RMS}}^{\\text{test}}\\)'},
    {c:'var(--accent)',t:'dash',l:'\\(M\\)'}]);
  const R=new Plot(card,{h:260,xlim:[-.6,9.6],ylim:[-.04,1.04],xl:'\\(M\\)',yl:'\\(E_{\\mathrm{RMS}}\\)',
    xt:[0,3,6,9],yt:[0,.5,1],pad:[16,18,28,40]});
  const sM=slider(b.pn,{label:'Order \\(M\\)',min:0,max:9,step:1,value:st.M,on:v=>{st.M=v;draw()}});
  const sN=slider(b.pn,{label:'Training points \\(N\\)',min:4,max:60,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Noise \\(\\sigma\\)',min:0,max:.6,step:.01,value:st.sigma,fmt:v=>fmt(v,2),on:v=>{st.sigma=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'Jump to the best \\(M\\)',on:()=>{st.M=st.best;sM.set(st.best);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'tr',l:'\\(E_{\\mathrm{RMS}}\\) training'},{k:'te',l:'\\(E_{\\mathrm{RMS}}\\) test'},
    {k:'best',l:'Best \\(M\\) on the test set'},{k:'np',l:'Coefficients \\(M+1\\)'}]);
  const chips=wchips(b.pn,'Learned \\(\\mathbf{w}^{*}\\)');
  eqbar(root,'Root-mean-square error',
    '\\( E_{\\mathrm{RMS}}=\\sqrt{2E(\\mathbf{w}^{*})/N}\\), where dividing by \\(N\\) lets us compare data sets of '+
    'different sizes on an equal footing and the square root puts the error on the same scale as the target \\(t\\).');
  note(root,['Training error reaches zero at \\(M=9\\) with \\(N=10\\).',
    'Test error is flat near \\(M=3\\dots 8\\), then explodes.',
    'Larger \\(N\\) moves the explosion to larger \\(M\\).']);
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
  legend(b.pc,[{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},{c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},
    {c:'var(--fit)',l:'\\(y(x,\\mathbf{w}^{*})\\)'}]);
  const P=new Plot(b.pc,{h:250,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const card=el('div','card plotcard');b.lc.appendChild(card);
  legend(card,[{c:'var(--obs)',l:'\\(E_{\\mathrm{RMS}}^{\\text{train}}\\)'},{c:'var(--fit)',l:'\\(E_{\\mathrm{RMS}}^{\\text{test}}\\)'},
    {c:'var(--accent)',t:'dash',l:'\\(\\ln\\lambda\\)'}]);
  const R=new Plot(card,{h:250,xlim:[-40,0],ylim:[-.04,1.04],xl:'\\(\\ln\\lambda\\)',yl:'\\(E_{\\mathrm{RMS}}\\)',
    xt:[-35,-30,-25,-20,-15,-10,-5,0],yt:[0,.5,1],pad:[16,18,28,40]});
  const sL=slider(b.pn,{label:'Regularization \\(\\ln\\lambda\\)',min:-40,max:0,step:.5,value:st.lnLam,
    fmt:v=>fmt(v,1),on:v=>{st.lnLam=v;draw()}});
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;gen()}});
  slider(b.pn,{label:'Training points \\(N\\)',min:4,max:40,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'No penalty \\((\\lambda\\to0)\\)',on:()=>{st.lnLam=-40;sL.set(-40);draw()}},
    {l:'Jump to the best \\(\\lambda\\)',on:()=>{st.lnLam=st.best;sL.set(st.best);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'lam',l:'\\(\\lambda\\)'},{k:'err',l:'Error term'},{k:'pen',l:'Penalty term'},
    {k:'tot',l:'Total \\(\\tilde E(\\mathbf{w})\\)',big:true},{k:'nw',l:'\\(\\lVert\\mathbf{w}\\rVert\\)'},{k:'tr',l:'\\(E_{\\mathrm{RMS}}\\) training'},
    {k:'te',l:'\\(E_{\\mathrm{RMS}}\\) test'}]);
  const chips=wchips(b.pn,'Learned \\(\\mathbf{w}^{*}\\)');
  eqbar(root,'Error function with a quadratic regularizer',
    '\\( \\tilde E(\\mathbf{w})=\\dfrac{1}{2}\\sum_{n=1}^{N}\\{y(x_n,\\mathbf{w})-t_n\\}^{2}'+
    '+\\dfrac{\\lambda}{2}\\lVert\\mathbf{w}\\rVert^{2}\\), with '+
    '\\(\\lVert\\mathbf{w}\\rVert^{2}=\\mathbf{w}^{\\mathrm T}\\mathbf{w}=w_0^2+w_1^2+\\cdots+w_M^2\\). '+
    'This quadratic case is ridge regression, known as weight decay in the context of neural networks.');
  note(root,['\\(\\ln\\lambda=-40\\): no penalty, huge coefficients.',
    'Middle \\(\\lambda\\): lowest test error, tame coefficients.',
    'Large \\(\\lambda\\): \\(\\mathbf{w}\\to\\mathbf{0}\\) and the curve flattens.']);
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
  legend(b.pc,[{c:'var(--fit)',l:'\\(y(x,\\mathbf{w})\\)'},{c:'var(--fit)',t:'dash',l:'\\(y(x,\\mathbf{w})\\pm\\beta^{-1/2}\\)'},
    {c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'}]);
  const P=new Plot(b.pc,{h:360,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  slider(b.pn,{label:'Order \\(M\\)',min:0,max:9,step:1,value:3,on:v=>{
    const w=new Array(v+1).fill(0);st.w.forEach((x,j)=>{if(j<=v)w[j]=x});st.w=w;W.rebuild();draw()}});
  const sB=slider(b.pn,{label:'Precision \\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  const sX=slider(b.pn,{label:'Show the distribution at \\(x_0\\)',min:0,max:1,step:.01,value:st.x0,
    fmt:v=>fmt(v,2),on:v=>{st.x0=v;P.draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Set \\(\\mathbf{w}\\) to \\(\\mathbf{w}^{*}\\)',on:()=>{applyFit(st,W);draw()}},
    {l:'Reset \\(\\mathbf{w}\\) to \\(\\mathbf{0}\\)',on:()=>{st.w=st.w.map(()=>0);st.rng=10;W.sync();draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'sd',l:'\\(\\sigma=\\beta^{-1/2}\\)'},{k:'y0',l:'\\(y(x_0,\\mathbf{w})\\)'},
    {k:'p0',l:'\\(p(t\\mid x_0,\\mathbf{w},\\beta)\\) at its peak'},{k:'in',l:'Points inside \\(\\pm1\\sigma\\)'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show the \\(\\pm1\\sigma\\) band',st.band,v=>{st.band=v;P.draw()});
  toggle(tg,'Show the Gaussian at \\(x_0\\)',st.bell,v=>{st.bell=v;P.draw()});
  eqbar(b.lc,'A Gaussian conditional distribution for the target',
    '\\( p(t\\mid x,\\mathbf{w},\\beta)=\\mathcal N\\!\\left(t\\mid y(x,\\mathbf{w}),\\beta^{-1}\\right)\\), '+
    'where the mean is the polynomial \\(y(x,\\mathbf{w})\\) and the precision \\(\\beta\\) is the inverse variance, '+
    '\\(\\beta^{-1}=\\sigma^{2}\\).');
  note(root,['Every \\(x\\) carries a Gaussian centred on \\(y(x,\\mathbf{w})\\).',
    'Small \\(\\beta\\), wide bell, since \\(\\beta^{-1}=\\sigma^{2}\\).',
    'Move \\(\\mathbf{w}\\) and the whole distribution moves with it.']);
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
  legend(b.pc,[{c:'var(--fit)',l:'\\(y(x,\\mathbf{w})\\)'},{c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},
    {c:'var(--fit)',t:'dash',l:'\\(p(t\\mid x_n,\\mathbf{w},\\beta)\\)'},
    {c:'var(--truth)',l:'\\(p(t_n\\mid x_n,\\mathbf{w},\\beta)\\)'}]);
  const P=new Plot(b.pc,{h:300,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const card=el('div','card plotcard');b.lc.appendChild(card);
  const L=new Plot(card,{h:240,xlim:[-10,10],ylim:[-200,60],xl:'\\(w_j\\)',yl:'\\(\\ln p(\\mathbf{t}\\mid\\mathbf{x},\\mathbf{w},\\beta)\\)',
    xt:[-10,-5,0,5,10],yt:[-200,-100,0],pad:[16,18,28,46]});
  slider(b.pn,{label:'Order \\(M\\)',min:0,max:9,step:1,value:3,on:v=>{
    const w=new Array(v+1).fill(0);st.w.forEach((x,j)=>{if(j<=v)w[j]=x});st.w=w;
    st.j=Math.min(st.j,v);sJ.setRange(0,v,1);sJ.set(st.j);W.rebuild();draw()}});
  slider(b.pn,{label:'Precision \\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;draw()}});
  const sJ=slider(b.pn,{label:'Coefficient to sweep, \\(j\\)',min:0,max:3,step:1,value:st.j,
    on:v=>{st.j=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  const W=wPanel(b.pn,st,()=>draw());
  btnrow(b.pn,[{l:'Set \\(\\mathbf{w}\\) to \\(\\mathbf{w}_{\\mathrm{ML}}\\)',on:()=>{applyFit(st,W);draw()}},
    {l:'Reset \\(\\mathbf{w}\\) to \\(\\mathbf{0}\\)',on:()=>{st.w=st.w.map(()=>0);st.rng=10;W.sync();draw()}},
    {l:'New sample',on:()=>{st.d=makeData(10,.25,st.d.seed+1);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'ll',l:'\\(\\ln p(\\mathbf{t}\\mid\\mathbf{x},\\mathbf{w},\\beta)\\)',big:true},{k:'t1',l:'\\(-\\tfrac{\\beta}{2}\\sum\\{y-t\\}^{2}\\)'},
    {k:'t2',l:'\\(+\\tfrac{N}{2}\\ln\\beta\\)'},{k:'t3',l:'\\(-\\tfrac{N}{2}\\ln(2\\pi)\\)'},{k:'e',l:'\\(E(\\mathbf{w})\\)'},{k:'gap',l:'\\(\\ln p\\) at \\(\\mathbf{w}_{\\mathrm{ML}}\\)'}]);
  eqbar(root,'Likelihood and log likelihood',
    '\\( p(\\mathbf{t}\\mid\\mathbf{x},\\mathbf{w},\\beta)=\\prod_{n=1}^{N}'+
    '\\mathcal N\\!\\left(t_n\\mid y(x_n,\\mathbf{w}),\\beta^{-1}\\right)\\)<br>'+
    '\\( \\ln p(\\mathbf{t}\\mid\\mathbf{x},\\mathbf{w},\\beta)=-\\dfrac{\\beta}{2}\\sum_{n=1}^{N}'+
    '\\{y(x_n,\\mathbf{w})-t_n\\}^{2}+\\dfrac{N}{2}\\ln\\beta-\\dfrac{N}{2}\\ln(2\\pi)\\)');
  note(root,['The likelihood is a product of bells read at each \\(t_n\\).',
    'Only \\(-\\tfrac{\\beta}{2}\\sum\\{y(x_n,\\mathbf{w})-t_n\\}^{2}\\) depends on \\(\\mathbf{w}\\).',
    'Maximizing \\(\\ln p\\) is minimizing \\(E(\\mathbf{w})\\).']);
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
    const g=p.ctx,peak=gaussPdf(0,0,sd),W=p.X(.08)-p.X(0);
    st.d.xs.forEach((x,n)=>{const y=polyval(st.w,x),t=st.d.ts[n],X0=p.X(x),
      lo=Math.min(y-3.5*sd,t),hi=Math.max(y+3.5*sd,t);
      g.save();
      /* the axis the bell stands on: x = x_n, running along t */
      g.strokeStyle=c.line2;g.lineWidth=1;g.beginPath();g.moveTo(X0,p.Y(lo));g.lineTo(X0,p.Y(hi));g.stroke();
      /* the conditional Gaussian over t, its height drawn sideways */
      g.strokeStyle=c.fit;g.globalAlpha=.75;g.lineWidth=1.4;g.setLineDash([3,2]);g.beginPath();
      for(let i=0;i<=60;i++){const tt=y-3.5*sd+7*sd*i/60,X=X0+W*gaussPdf(tt,y,sd)/peak;
        i?g.lineTo(X,p.Y(tt)):g.moveTo(X,p.Y(tt))}
      g.stroke();g.setLineDash([]);g.globalAlpha=1;
      /* its value at the observed target */
      g.strokeStyle=c.truth;g.lineWidth=2.5;g.beginPath();
      g.moveTo(X0,p.Y(t));g.lineTo(X0+W*gaussPdf(t,y,sd)/peak,p.Y(t));g.stroke();
      g.restore()});
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
  legend(b.pc,[{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},{c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},
    {c:'var(--fit)',l:'\\(y(x,\\mathbf{w}_{\\mathrm{ML}})\\)'},{c:'var(--fit)',t:'dash',l:'\\(\\pm1\\,\\sigma_{\\mathrm{ML}}\\)'}]);
  const P=new Plot(b.pc,{h:290,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const card=el('div','card plotcard');b.lc.appendChild(card);
  legend(card,[{c:'var(--truth)',t:'dash',l:'\\(\\sigma\\)'},{c:'var(--fit)',l:'\\(\\sigma_{\\mathrm{ML}}\\)'}]);
  const S=new Plot(card,{h:230,xlim:[2,80],ylim:[0,.65],xl:'\\(N\\)',yl:'\\(\\sigma_{\\mathrm{ML}}\\)',
    xt:[10,20,40,60,80],yt:[0,.25,.5],pad:[16,18,28,46]});
  const sN=slider(b.pn,{label:'Data points \\(N\\)',min:4,max:80,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Order \\(M\\)',min:0,max:9,step:1,value:st.M,on:v=>{st.M=v;gen()}});
  slider(b.pn,{label:'True noise \\(\\sigma\\)',min:.05,max:.6,step:.01,value:st.sigma,fmt:v=>fmt(v,2),
    on:v=>{st.sigma=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'\\(N=10\\)',on:()=>{st.N=10;sN.set(10);gen()}},{l:'\\(N=80\\)',on:()=>{st.N=80;sN.set(80);gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'b',l:'\\(\\beta_{\\mathrm{ML}}\\)',big:true},{k:'s',l:'\\(\\sigma_{\\mathrm{ML}}=\\beta_{\\mathrm{ML}}^{-1/2}\\)'},
    {k:'st',l:'True \\(\\sigma\\)'},{k:'e',l:'\\(E_{\\mathrm{RMS}}\\) training'},{k:'te',l:'\\(E_{\\mathrm{RMS}}\\) test'}]);
  const chips=wchips(b.pn,'Learned \\(\\mathbf{w}_{\\mathrm{ML}}\\)');
  eqbar(root,'Maximum likelihood estimates and the predictive distribution',
    '\\( \\dfrac{1}{\\beta_{\\mathrm{ML}}}=\\dfrac{1}{N}\\sum_{n=1}^{N}\\{y(x_n,\\mathbf{w}_{\\mathrm{ML}})-t_n\\}^{2}'+
    '\\), \\(p(t\\mid x,\\mathbf{w}_{\\mathrm{ML}},\\beta_{\\mathrm{ML}})='+
    '\\mathcal N\\!\\left(t\\mid y(x,\\mathbf{w}_{\\mathrm{ML}}),\\beta_{\\mathrm{ML}}^{-1}\\right)\\)');
  note(root,['\\(\\beta_{\\mathrm{ML}}\\) is read straight off the residuals.',
    '\\(M=9\\) with \\(N=10\\): residuals vanish, \\(\\beta_{\\mathrm{ML}}\\to\\infty\\).',
    'More data and \\(\\sigma_{\\mathrm{ML}}\\) settles near the true \\(\\sigma\\).']);
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
  legend(b.pc,[{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},{c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},
    {c:'var(--fit)',t:'dash',l:'\\(y(x,\\mathbf{w}_{\\mathrm{ML}})\\)'},{c:'var(--accent)',l:'\\(y(x,\\mathbf{w}_{\\mathrm{MAP}})\\)'}]);
  const P=new Plot(b.pc,{h:290,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const pc=el('div','card plotcard');b.lc.appendChild(pc);
  legend(pc,[{c:'var(--accent)',t:'dash',l:'\\(p(w_j\\mid\\alpha)=\\mathcal N(w_j\\mid0,\\alpha^{-1})\\)'},
    {c:'var(--accent)',t:'dot',l:'\\(w_{\\mathrm{MAP},j}\\)'},{c:'var(--fit)',t:'dot',l:'\\(w_{\\mathrm{ML},j}\\)'},
    {c:'var(--truth)',l:'\\(p(w_{\\mathrm{MAP},j}\\mid\\alpha)\\)'}]);
  const Q=new Plot(pc,{h:300,xlim:[-.6,9.6],ylim:[-1,1],xl:'\\(j\\)',yl:'\\(w_j\\)',
    xt:[0,1,2,3,4,5,6,7,8,9],yt:[-1,0,1],pad:[16,18,28,58]});
  const card=el('div','card plotcard');b.lc.appendChild(card);
  legend(card,[{c:'var(--accent)',l:'\\(E_{\\mathrm{RMS}}^{\\text{test}}(\\mathbf{w}_{\\mathrm{MAP}})\\)'},
    {c:'var(--fit)',t:'dash',l:'\\(E_{\\mathrm{RMS}}^{\\text{test}}(\\mathbf{w}_{\\mathrm{ML}})\\)'},
    {c:'var(--accent)',t:'dash',l:'\\(\\ln\\alpha\\)'}]);
  const A=new Plot(card,{h:230,xlim:[-14,8],ylim:[-.04,1.04],xl:'\\(\\ln\\alpha\\)',yl:'\\(E_{\\mathrm{RMS}}\\)',
    xt:[-12,-8,-4,0,4,8],yt:[0,.5,1],pad:[16,18,28,40]});
  const sA=slider(b.pn,{label:'Prior precision \\(\\ln\\alpha\\)',min:-14,max:8,step:.25,value:st.lnAlpha,
    fmt:v=>fmt(v,2),on:v=>{st.lnAlpha=v;draw()}});
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;gen()}});
  slider(b.pn,{label:'Data points \\(N\\)',min:4,max:40,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Noise precision \\(\\beta\\)',min:1,max:60,step:.5,value:st.beta,fmt:v=>fmt(v,1),
    on:v=>{st.beta=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}},
    {l:'Jump to the best \\(\\alpha\\)',on:()=>{st.lnAlpha=st.best;sA.set(st.best);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'a',l:'\\(\\alpha\\)'},{k:'lam',l:'\\(\\lambda=\\alpha/\\beta\\)'},{k:'nml',l:'\\(\\lVert\\mathbf{w}_{\\mathrm{ML}}\\rVert\\)'},
    {k:'nmap',l:'\\(\\lVert\\mathbf{w}_{\\mathrm{MAP}}\\rVert\\)'},{k:'pml',l:'\\(-\\tfrac{\\alpha}{2}\\lVert\\mathbf{w}_{\\mathrm{ML}}\\rVert^{2}\\)'},
    {k:'pmap',l:'\\(-\\tfrac{\\alpha}{2}\\lVert\\mathbf{w}_{\\mathrm{MAP}}\\rVert^{2}\\)'},
    {k:'eml',l:'\\(E_{\\mathrm{RMS}}\\) test, \\(\\mathbf{w}_{\\mathrm{ML}}\\)'},{k:'emap',l:'\\(E_{\\mathrm{RMS}}\\) test, \\(\\mathbf{w}_{\\mathrm{MAP}}\\)',big:true}]);
  const cML=wchips(b.pn,'\\(\\mathbf{w}_{\\mathrm{ML}}\\)'),cMAP=wchips(b.pn,'\\(\\mathbf{w}_{\\mathrm{MAP}}\\)');
  eqbar(root,'Prior over the coefficients and the MAP estimate',
    '\\( p(\\mathbf{w}\\mid\\alpha)=\\mathcal N\\!\\left(\\mathbf{w}\\mid\\mathbf{0},\\alpha^{-1}\\mathbf{I}\\right)'+
    '=\\left(\\dfrac{\\alpha}{2\\pi}\\right)^{(M+1)/2}\\exp\\!\\left\\{-\\dfrac{\\alpha}{2}'+
    '\\mathbf{w}^{\\mathrm T}\\mathbf{w}\\right\\}\\)<br>'+
    '\\( \\mathbf{w}_{\\mathrm{MAP}}=\\arg\\min_{\\mathbf{w}}\\left[\\dfrac{\\beta}{2}\\sum_{n=1}^{N}'+
    '\\{y(x_n,\\mathbf{w})-t_n\\}^{2}+\\dfrac{\\alpha}{2}\\mathbf{w}^{\\mathrm T}\\mathbf{w}\\right]\\)');
  note(root,['The prior is one bell \\(\\mathcal N(w_j\\mid0,\\alpha^{-1})\\) per coefficient.',
    '\\(\\mathbf{w}_{\\mathrm{ML}}\\) ignores it, \\(\\mathbf{w}_{\\mathrm{MAP}}\\) is pulled towards \\(\\mathbf{0}\\).',
    'MAP is regularization with \\(\\lambda=\\alpha/\\beta\\).']);
  function gen(){st.tr=makeData(st.N,st.sigma,st.seed);st.te=makeData(100,st.sigma,st.seed+977);
    st.rows=[];let best=-14,bv=Infinity;
    for(let a=-14;a<=8;a+=.25){const w=fit(st.tr.xs,st.tr.ts,st.M,Math.exp(a)/st.beta),
      e=erms(st.te.xs,st.te.ts,w);st.rows.push([a,e]);if(e<bv){bv=e;best=a}}
    st.best=best;draw()}
  function draw(){const al=Math.exp(st.lnAlpha),lam=al/st.beta;
    st.wML=fit(st.tr.xs,st.tr.ts,st.M);st.wMAP=fit(st.tr.xs,st.tr.ts,st.M,lam);
    st.sd=1/Math.sqrt(al);
    const R=Math.max(3.5*st.sd,1.25*Math.max.apply(null,st.wMAP.map(Math.abs)),1e-3),
      tk=Number((.8*R).toPrecision(2));
    Q.o.xlim=[-.6,st.M+.6];Q.o.xt=Array.from({length:st.M+1},(_,j)=>j);
    Q.o.ylim=[-R,R];Q.o.yt=[-tk,0,tk];
    out({a:fmt(al,al<1?4:2),lam:fmt(lam,lam<1?4:2),nml:fmt(Math.sqrt(norm2(st.wML)),1),
      pml:fmt(-al/2*norm2(st.wML),2),pmap:fmt(-al/2*norm2(st.wMAP),3),
      nmap:fmt(Math.sqrt(norm2(st.wMAP)),2),eml:fmt(erms(st.te.xs,st.te.ts,st.wML),3),
      emap:fmt(erms(st.te.xs,st.te.ts,st.wMAP),3)});
    cML(st.wML,1);cMAP(st.wMAP,2);P.draw();Q.draw();A.draw()}
  Q.render=q=>{const c=q.col,g=q.ctx,sd=st.sd,R=q.o.ylim[1],peak=gaussPdf(0,0,sd),
      Wd=(q.X(1)-q.X(0))*.62,lo=Math.max(-R,-4*sd),hi=Math.min(R,4*sd);
    for(let j=0;j<=st.M;j++){const X0=q.X(j),wm=st.wMAP[j],wl=st.wML[j];
      g.save();
      g.strokeStyle=c.line2;g.lineWidth=1;g.beginPath();g.moveTo(X0,q.Y(-R));g.lineTo(X0,q.Y(R));g.stroke();
      /* the prior bell for w_j, its height drawn sideways */
      g.strokeStyle=c.acc;g.globalAlpha=.8;g.lineWidth=1.4;g.setLineDash([3,2]);g.beginPath();
      for(let i=0;i<=80;i++){const w=lo+(hi-lo)*i/80,X=X0+Wd*gaussPdf(w,0,sd)/peak;
        i?g.lineTo(X,q.Y(w)):g.moveTo(X,q.Y(w))}
      g.stroke();g.setLineDash([]);g.globalAlpha=1;
      /* its value at w_MAP,j */
      g.strokeStyle=c.truth;g.lineWidth=2.5;g.beginPath();
      g.moveTo(X0,q.Y(wm));g.lineTo(X0+Wd*gaussPdf(wm,0,sd)/peak,q.Y(wm));g.stroke();
      /* w_ML,j: a dot, or an arrow at the edge when it is off the chart */
      g.fillStyle=c.fit;
      if(Math.abs(wl)<=R){g.restore();q.dots([j],[wl],c.fit,4)}
      else{const up=wl>0,Y=q.Y(up?R:-R)+(up?7:-7);g.beginPath();
        g.moveTo(X0,Y+(up?-7:7));g.lineTo(X0-5,Y);g.lineTo(X0+5,Y);g.closePath();g.fill();g.restore()}
      q.mark(j,wm,c.acc,4.5)}};
  Q.hoverFmt=x=>{const j=clamp(Math.round(x),0,st.M);
    return[{t:'j = '+j},{t:'w_MAP = '+fmt(st.wMAP[j],3),c:Q.col.acc},{t:'w_ML = '+fmt(st.wML[j],1),c:Q.col.fit},
      {t:'p(w_MAP | α) = '+fmt(gaussPdf(st.wMAP[j],0,st.sd),3),c:Q.col.truth}]};
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

/* ===== slide 33 · Marginalization over a two-valued X ===== */
export function p33(root){
  const st={pF:.5,muM:72,sdM:12,muF:78,sdF:10,show:true};
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--obs)',l:'\\(p(Y\\mid X=x_1)\\)'},{c:'var(--fit)',l:'\\(p(Y\\mid X=x_2)\\)'},
    {c:'var(--obs)',t:'dash',l:'\\(p(Y\\mid X=x_1)\\,p(X=x_1)\\)'},
    {c:'var(--fit)',t:'dash',l:'\\(p(Y\\mid X=x_2)\\,p(X=x_2)\\)'},
    {c:'var(--truth)',l:'\\(p(Y)\\)'}]);
  const P=new Plot(b.pc,{h:340,xlim:[30,110],ylim:[0,.055],xl:'\\(Y\\)',yl:'\\(p(Y)\\)',
    xt:[40,60,80,100],yt:[0,.02,.04],pad:[16,18,28,52]});
  slider(b.pn,{label:'Data mix \\(N_1:N_2\\)',min:0,max:1,step:.01,value:st.pF,
    fmt:v=>Math.round((1-v)*100)+' : '+Math.round(v*100),on:v=>{st.pF=v;draw()}});
  /* a two-colour bar showing how the weight splits between the two components */
  function mixbar(host,l1,l2){const bar=el('div');
    bar.style.cssText='display:flex;height:24px;border-radius:6px;overflow:hidden;'+
      'font-family:var(--mono);font-size:11px;color:#fff;margin-top:-4px';
    const s1=el('div'),s2=el('div');
    [[s1,'var(--obs)'],[s2,'var(--fit)']].forEach(z=>{z[0].style.cssText='background:'+z[1]+
      ';display:flex;align-items:center;justify-content:center;overflow:hidden;white-space:nowrap;transition:width .15s'});
    bar.append(s1,s2);host.appendChild(bar);
    return function(p2){const p1=1-p2;s1.style.width=(p1*100)+'%';s2.style.width=(p2*100)+'%';
      s1.textContent=p1>=.12?l1+' '+Math.round(p1*100)+'%':'';
      s2.textContent=p2>=.12?l2+' '+Math.round(p2*100)+'%':''}}
  const setBar=mixbar(b.pn,'x₁','x₂');
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'pm',l:'\\(p(X=x_1)=N_1/N\\)'},{k:'pf',l:'\\(p(X=x_2)=N_2/N\\)'},
    {k:'em',l:'\\(\\mathbb{E}[Y\\mid X=x_1]\\)'},{k:'ef',l:'\\(\\mathbb{E}[Y\\mid X=x_2]\\)'},{k:'e',l:'\\(\\mathbb{E}[Y]\\) after marginalizing',big:true},
    {k:'sd',l:'Standard deviation of \\(p(Y)\\)'},
    {k:'vw',l:'\\(\\mathbb{E}_X[\\mathrm{Var}(Y\\mid X)]\\)'},{k:'vb',l:'\\(\\mathrm{Var}_X(\\mathbb{E}[Y\\mid X])\\)'}]);
  const tg=el('div','toggles');b.pn.appendChild(tg);
  toggle(tg,'Show the two conditionals',st.show,v=>{st.show=v;P.draw()});
  /* ---- the same computation in the notation of the polynomial example ---- */
  const q={p2:.5,x0:.9,beta:11.1,d:makeData(10,.25,3)},d2=makeData(10,.25,8);
  q.w1=fit(q.d.xs,q.d.ts,3);q.w2=fit(d2.xs,d2.ts,3);
  const b2=board(root,'Controls');
  legend(b2.pc,[{c:'var(--obs)',l:'\\(y(x,\\mathbf{w}^{(1)})\\)'},{c:'var(--fit)',l:'\\(y(x,\\mathbf{w}^{(2)})\\)'},
    {c:'var(--muted)',t:'dot',l:'\\(t_n\\)'}]);
  const C=new Plot(b2.pc,{h:250,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const dc=el('div','card plotcard');b2.lc.appendChild(dc);
  legend(dc,[{c:'var(--obs)',l:'\\(p(t\\mid x_0,\\mathbf{w}^{(1)})\\)'},{c:'var(--fit)',l:'\\(p(t\\mid x_0,\\mathbf{w}^{(2)})\\)'},
    {c:'var(--obs)',t:'dash',l:'\\(p(t\\mid x_0,\\mathbf{w}^{(1)})\\,p(\\mathbf{w}^{(1)}\\mid\\mathbf{x},\\mathbf{t})\\)'},
    {c:'var(--fit)',t:'dash',l:'\\(p(t\\mid x_0,\\mathbf{w}^{(2)})\\,p(\\mathbf{w}^{(2)}\\mid\\mathbf{x},\\mathbf{t})\\)'},
    {c:'var(--truth)',l:'\\(p(t\\mid x_0,\\mathbf{x},\\mathbf{t})\\)'}]);
  const D=new Plot(dc,{h:300,xlim:[-2.2,2.2],ylim:[0,1.5],xl:'\\(t\\)',
    yl:'\\(p(t\\mid x_0,\\mathbf{x},\\mathbf{t})\\)',xt:[-2,-1,0,1,2],yt:[0,.5,1],pad:[16,18,28,52]});
  const sQ=slider(b2.pn,{label:'Posterior weights \\(p(\\mathbf{w}^{(1)}\\mid\\mathbf{x},\\mathbf{t}):p(\\mathbf{w}^{(2)}\\mid\\mathbf{x},\\mathbf{t})\\)',
    min:0,max:1,step:.01,value:q.p2,fmt:v=>Math.round((1-v)*100)+' : '+Math.round(v*100),on:v=>{q.p2=v;draw2()}});
  const setBar2=mixbar(b2.pn,'w⁽¹⁾','w⁽²⁾');
  btnrow(b2.pn,[{l:'\\(1:0\\)',on:()=>{q.p2=0;sQ.set(0);draw2()}},
    {l:'\\(1:1\\)',on:()=>{q.p2=.5;sQ.set(.5);draw2()}},
    {l:'\\(0:1\\)',on:()=>{q.p2=1;sQ.set(1);draw2()}}]);
  b2.pn.appendChild(el('div','hr'));
  slider(b2.pn,{label:'New input \\(x_0\\)',min:0,max:1,step:.01,value:q.x0,fmt:v=>fmt(v,2),
    on:v=>{q.x0=v;draw2()}});
  slider(b2.pn,{label:'Noise precision \\(\\beta\\)',min:1,max:60,step:.5,value:q.beta,fmt:v=>fmt(v,1),
    on:v=>{q.beta=v;draw2()}});
  b2.pn.appendChild(el('div','hr'));
  const out2=readout(b2.pn,[{k:'y1',l:'\\(y(x_0,\\mathbf{w}^{(1)})\\)'},{k:'y2',l:'\\(y(x_0,\\mathbf{w}^{(2)})\\)'},
    {k:'m',l:'\\(\\mathbb{E}[t]\\) after marginalizing',big:true},
    {k:'v',l:'\\(\\mathrm{Var}[t]\\)'},{k:'vw',l:'\\(\\beta^{-1}\\)'},
    {k:'vb',l:'\\(\\mathrm{Var}_{\\mathbf{w}}\\big(y(x_0,\\mathbf{w})\\big)\\)'}]);
  eqbar(b2.lc,'Marginalizing over w',
    '\\( p(t\\mid x_0,\\mathbf{x},\\mathbf{t})=\\sum_{k=1}^{2}p(t\\mid x_0,\\mathbf{w}^{(k)})\\,'+
    'p(\\mathbf{w}^{(k)}\\mid\\mathbf{x},\\mathbf{t})\\), \\( p(t\\mid x_0,\\mathbf{w}^{(k)})='+
    '\\mathcal N\\!\\left(t\\mid y(x_0,\\mathbf{w}^{(k)}),\\beta^{-1}\\right)\\)<br>'+
    '\\( \\sum_{k}p(t\\mid x_0,\\mathbf{w}^{(k)})\\,p(\\mathbf{w}^{(k)}\\mid\\mathbf{x},\\mathbf{t})\\;\\longrightarrow\\;'+
    '\\int p(t\\mid x_0,\\mathbf{w})\\,p(\\mathbf{w}\\mid\\mathbf{x},\\mathbf{t})\\,d\\mathbf{w}\\)');
  function draw2(){const p2=q.p2,p1=1-p2,y1=polyval(q.w1,q.x0),y2=polyval(q.w2,q.x0),m=p1*y1+p2*y2,
      vw=1/q.beta,vb=p1*(y1-m)*(y1-m)+p2*(y2-m)*(y2-m),peak=gaussPdf(0,0,Math.sqrt(vw)),
      tk=Number((peak*.45).toPrecision(2));
    setBar2(p2);D.o.ylim=[0,peak*1.12];D.o.yt=[0,tk,Number((2*tk).toPrecision(2))];
    out2({y1:fmt(y1,3),y2:fmt(y2,3),m:fmt(m,3),v:fmt(vw+vb,4),vw:fmt(vw,4),vb:fmt(vb,4)});
    C.draw();D.draw()}
  C.render=p=>{const c=p.col;
    p.dots(q.d.xs,q.d.ts,c.muted,3.4);
    p.path(x=>polyval(q.w1,x),c.obs,2.4);p.path(x=>polyval(q.w2,x),c.fit,2.4);
    p.seg(q.x0,p.o.ylim[0],p.o.ylim[1],c.line2,1,[3,3]);
    p.mark(q.x0,polyval(q.w1,q.x0),c.obs,4.5);p.mark(q.x0,polyval(q.w2,q.x0),c.fit,4.5);
    p.label(q.x0,p.o.ylim[0]+.2,' x₀',c.ink2,'left')};
  C.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'y(x, w⁽¹⁾) = '+fmt(polyval(q.w1,x),2),c:C.col.obs},
    {t:'y(x, w⁽²⁾) = '+fmt(polyval(q.w2,x),2),c:C.col.fit}];
  C.onClick=x=>{q.x0=clamp(x,0,1);draw2()};
  const comp=()=>{const sd=1/Math.sqrt(q.beta),y1=polyval(q.w1,q.x0),y2=polyval(q.w2,q.x0),p2=q.p2;
    return{f1:t=>gaussPdf(t,y1,sd),f2:t=>gaussPdf(t,y2,sd),p1:1-p2,p2:p2,m:(1-p2)*y1+p2*y2}};
  D.render=p=>{const c=p.col,k=comp(),mix=t=>k.p1*k.f1(t)+k.p2*k.f2(t);
    p.band(()=>0,mix,c.truth,.14);
    p.path(k.f1,c.obs,1.2);p.path(k.f2,c.fit,1.2);
    p.path(t=>k.p1*k.f1(t),c.obs,2,[5,4]);p.path(t=>k.p2*k.f2(t),c.fit,2,[5,4]);
    p.path(mix,c.truth,2.8);
    p.seg(k.m,0,mix(k.m),c.muted,1.5,[3,3]);p.label(k.m,mix(k.m),'  E[t]',c.ink2,'left',-12)};
  D.hoverFmt=t=>{const k=comp();return[{t:'t = '+fmt(t,2)},
    {t:'p(t | x₀, x, t) = '+fmt(k.p1*k.f1(t)+k.p2*k.f2(t),3),c:D.col.truth}]};
  draw2();
  note(root,['The marginal is a weighted mixture, not an average shape.',
    'A mix of 1 : 0 collapses it onto one conditional.',
    '\\(X\\to\\mathbf{w}\\) and \\(Y\\to t\\): the same sum, one slide later.',
    '\\(s^{2}(x)=\\beta^{-1}+\\mathrm{Var}_{\\mathbf{w}}(y)\\): noise plus spread.']);
  function draw(){const pf=st.pF,pm=1-pf,mean=pm*st.muM+pf*st.muF,
    sec=pm*(st.sdM*st.sdM+st.muM*st.muM)+pf*(st.sdF*st.sdF+st.muF*st.muF);
    setBar(pf);
    out({pf:fmt(pf,2),pm:fmt(pm,2),em:fmt(st.muM,1),ef:fmt(st.muF,1),e:fmt(mean,2),
      sd:fmt(Math.sqrt(Math.max(sec-mean*mean,0)),2),
      vw:fmt(pm*st.sdM*st.sdM+pf*st.sdF*st.sdF,2),
      vb:fmt(pm*(st.muM-mean)*(st.muM-mean)+pf*(st.muF-mean)*(st.muF-mean),2)});P.draw()}
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
    {t:'p(Y | x₁) = '+fmt(dM(y),4),c:P.col.obs},{t:'p(Y | x₂) = '+fmt(dF(y),4),c:P.col.fit}];
  draw()}
