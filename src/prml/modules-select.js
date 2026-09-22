/* PRML simulators, slides 45 and 49: choosing a model with a validation set,
   with cross-validation, and with information criteria. */
import{el,cssv,fmt,clamp,rng,gauss,sin2pi,polyval,fit,erms,Plot,board,legend,slider,
  btnrow,readout,eqbar,note}from'./core.js'

/* the normal equations stay solvable when a fold leaves fewer points than coefficients */
const RIDGE=1e-9;

/* an independent sample of the synthetic function, drawn at random inputs */
function sample(N,sigma,seed){const r=rng(seed),xs=[],ts=[];
  for(let n=0;n<N;n++)xs.push(r());
  xs.sort((a,b)=>a-b);
  for(let n=0;n<N;n++)ts.push(sin2pi(xs[n])+gauss(r)*sigma);
  return{xs:xs,ts:ts,N:N}}

/* ===== slide 45 · Training, validation and test sets ===== */
export function p45(root){
  const st={M:9,ntr:12,nva:12,nte:40,sigma:.25,seed:3};
  const LN=[];for(let v=-30;v<=2;v+=.5)LN.push(v);
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},
    {c:'var(--fit)',l:'\\(y(x,\\mathbf{w}^{*}_{\\mathrm{MAP}}(\\lambda^{*}))\\)'},
    {c:'var(--obs)',t:'dot',l:'\\(\\mathcal D_{\\mathrm{Train}}\\)'},
    {c:'var(--violet)',t:'dot',l:'\\(\\mathcal D_{\\mathrm{Valid}}\\)'},
    {c:'var(--muted)',t:'dot',l:'\\(\\mathcal D_{\\mathrm{Test}}\\)'}]);
  const P=new Plot(b.pc,{h:250,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const card=el('div','card plotcard');b.lc.appendChild(card);
  legend(card,[{c:'var(--obs)',l:'\\(E_{\\mathrm{RMS}}^{\\mathrm{train}}\\)'},
    {c:'var(--violet)',l:'\\(E_{\\mathrm{RMS}}^{\\mathrm{val}}\\)'},
    {c:'var(--fit)',l:'\\(E_{\\mathrm{RMS}}^{\\mathrm{test}}\\)'},
    {c:'var(--accent)',t:'dash',l:'\\(\\ln\\lambda^{*}\\)'}]);
  const R=new Plot(card,{h:260,xlim:[-31,3],ylim:[-.04,1.24],xl:'\\(\\ln\\lambda\\)',
    yl:'\\(E_{\\mathrm{RMS}}\\)',xt:[-30,-20,-10,0],yt:[0,.5,1],pad:[16,18,28,40]});
  slider(b.pn,{label:'Training points \\(N_{\\mathrm{Train}}\\)',min:4,max:40,step:1,value:st.ntr,
    on:v=>{st.ntr=v;gen()}});
  slider(b.pn,{label:'Validation points \\(N_{\\mathrm{Valid}}\\)',min:2,max:40,step:1,value:st.nva,
    on:v=>{st.nva=v;gen()}});
  slider(b.pn,{label:'Test points \\(N_{\\mathrm{Test}}\\)',min:5,max:200,step:5,value:st.nte,
    on:v=>{st.nte=v;gen()}});
  slider(b.pn,{label:'Order \\(M\\)',min:1,max:9,step:1,value:st.M,on:v=>{st.M=v;draw()}});
  slider(b.pn,{label:'Noise \\(\\sigma\\)',min:0,max:.6,step:.01,value:st.sigma,fmt:v=>fmt(v,2),
    on:v=>{st.sigma=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'lam',l:'\\(\\ln\\lambda^{*}\\)'},
    {k:'tr',l:'\\(E_{\\mathrm{RMS}}^{\\mathrm{train}}(\\lambda^{*})\\)'},
    {k:'va',l:'\\(E_{\\mathrm{RMS}}^{\\mathrm{val}}(\\lambda^{*})\\)'},
    {k:'te',l:'\\(E_{\\mathrm{RMS}}^{\\mathrm{test}}(\\lambda^{*})\\)',big:true},
    {k:'best',l:'Lowest \\(E_{\\mathrm{RMS}}^{\\mathrm{test}}\\) on the grid'},
    {k:'bl',l:'\\(\\ln\\lambda\\) that reaches it'},
    {k:'gap',l:'Cost of choosing on \\(\\mathcal D_{\\mathrm{Valid}}\\)'}]);
  eqbar(root,'Training, validation and test',
    '\\( \\mathbf{w}^{*}_{\\mathrm{MAP}}(\\lambda)=\\arg\\min_{\\mathbf{w}}\\left[\\dfrac{1}{2}'+
    '\\sum_{n=1}^{N_{\\mathrm{Train}}}\\{y(x_n,\\mathbf{w})-t_n\\}^{2}+\\dfrac{\\lambda}{2}'+
    '\\mathbf{w}^{\\mathrm T}\\mathbf{w}\\right]\\), \\( \\lambda^{*}=\\arg\\min_{\\lambda}'+
    'E_{\\mathrm{RMS}}^{\\mathrm{val}}(\\lambda)\\)<br>'+
    '\\( E_{\\mathrm{RMS}}^{\\mathrm{val}}(\\lambda)=\\sqrt{\\dfrac{1}{N_{\\mathrm{Valid}}}'+
    '\\sum_{n=1}^{N_{\\mathrm{Valid}}}\\left\\{y\\!\\left(x_n,\\mathbf{w}^{*}_{\\mathrm{MAP}}(\\lambda)\\right)-t_n\\right\\}^{2}}\\), '+
    '\\( E_{\\mathrm{RMS}}^{\\mathrm{test}}=\\sqrt{\\dfrac{1}{N_{\\mathrm{Test}}}\\sum_{n=1}^{N_{\\mathrm{Test}}}'+
    '\\left\\{y\\!\\left(x_n,\\mathbf{w}^{*}_{\\mathrm{MAP}}(\\lambda^{*})\\right)-t_n\\right\\}^{2}}\\)');
  note(root,['Train fixes \\(\\mathbf{w}\\), validation picks \\(\\lambda\\), test only reports.',
    'Small \\(N_{\\mathrm{Valid}}\\): \\(\\lambda^{*}\\) jumps from sample to sample.',
    'That jumping is what the last readout charges in test error.',
    'Small \\(N_{\\mathrm{Test}}\\): same model, unreliable score.']);
  function near(x){let k=0;for(let i=1;i<st.rows.length;i++)
    if(Math.abs(st.rows[i].l-x)<Math.abs(st.rows[k].l-x))k=i;return st.rows[k]}
  function gen(){st.d={tr:sample(st.ntr,st.sigma,st.seed),va:sample(st.nva,st.sigma,st.seed+101),
    te:sample(st.nte,st.sigma,st.seed+977)};draw()}
  function draw(){const d=st.d;
    st.rows=LN.map(l=>{const w=fit(d.tr.xs,d.tr.ts,st.M,Math.exp(l));
      return{l:l,w:w,tr:erms(d.tr.xs,d.tr.ts,w),va:erms(d.va.xs,d.va.ts,w),te:erms(d.te.xs,d.te.ts,w)}});
    let iv=0,it=0;
    st.rows.forEach((r,i)=>{if(r.va<st.rows[iv].va)iv=i;if(r.te<st.rows[it].te)it=i});
    st.pick=st.rows[iv];st.best=st.rows[it];
    out({lam:fmt(st.pick.l,1),tr:fmt(st.pick.tr,3),va:fmt(st.pick.va,3),te:fmt(st.pick.te,3),
      best:fmt(st.best.te,3),bl:fmt(st.best.l,1),gap:fmt(st.pick.te-st.best.te,3)});
    P.draw();R.draw()}
  P.render=p=>{const c=p.col,vi=cssv('--violet'),d=st.d;
    p.path(sin2pi,c.truth,2.2);
    p.dots(d.te.xs,d.te.ts,c.muted,2.4);
    p.dots(d.tr.xs,d.tr.ts,c.obs,4);
    p.dots(d.va.xs,d.va.ts,vi,4);
    p.path(x=>polyval(st.pick.w,x),c.fit,2.6)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},
    {t:'y(x, w*) = '+fmt(polyval(st.pick.w,x),2),c:P.col.fit},
    {t:'sin(2πx) = '+fmt(sin2pi(x),2),c:P.col.truth}];
  R.render=p=>{const c=p.col,vi=cssv('--violet'),cap=v=>clamp(v,-.04,1.24);
    p.seg(st.pick.l,-.04,1.24,c.acc,1.5,[4,4]);
    p.line(st.rows.map(r=>[r.l,cap(r.tr)]),c.obs,2.2);
    p.line(st.rows.map(r=>[r.l,cap(r.te)]),c.fit,2.2);
    p.line(st.rows.map(r=>[r.l,cap(r.va)]),vi,2.6);
    p.mark(st.pick.l,cap(st.pick.va),vi,4.5);
    p.mark(st.pick.l,cap(st.pick.te),c.fit,4.5)};
  R.hoverFmt=x=>{const r=near(x);
    return[{t:'ln λ = '+fmt(r.l,1)},{t:'train '+fmt(r.tr,3),c:R.col.obs},
      {t:'val '+fmt(r.va,3),c:cssv('--violet')},{t:'test '+fmt(r.te,3),c:R.col.fit}]};
  gen()}

/* ===== slide 49 · Cross-validation and information criteria ===== */
export function p49(root){
  const st={N:20,S:5,M:3,sigma:.25,seed:3};
  const MS=[0,1,2,3,4,5,6,7,8,9];
  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'\\(\\sin(2\\pi x)\\)'},{c:'var(--obs)',t:'dot',l:'\\(t_n\\)'},
    {c:'var(--fit)',l:'\\(y(x,\\mathbf{w}^{*})\\)'}]);
  const P=new Plot(b.pc,{h:250,ylim:[-2.1,2.1],yt:[-2,-1,0,1,2]});
  const c1=el('div','card plotcard');b.lc.appendChild(c1);
  legend(c1,[{c:'var(--obs)',l:'\\(E_{\\mathrm{RMS}}^{\\mathrm{train}}\\)'},
    {c:'var(--violet)',l:'\\(E_{\\mathrm{CV}}\\)'},{c:'var(--fit)',l:'\\(E_{\\mathrm{RMS}}^{\\mathrm{test}}\\)'},
    {c:'var(--accent)',t:'dash',l:'\\(M\\)'}]);
  const R=new Plot(c1,{h:230,xlim:[-.6,9.6],ylim:[-.04,1.24],xl:'\\(M\\)',yl:'\\(E_{\\mathrm{RMS}}\\)',
    xt:[0,3,6,9],yt:[0,.5,1],pad:[16,18,28,40]});
  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--accent)',l:'\\(\\mathrm{AIC}\\)'},{c:'var(--cyan)',l:'\\(\\mathrm{BIC}\\)'},
    {c:'var(--accent)',t:'dash',l:'\\(M\\)'}]);
  const I=new Plot(c2,{h:230,xlim:[-.6,9.6],ylim:[0,1],xl:'\\(M\\)',yl:'\\(\\ln p(\\mathcal D\\mid\\mathbf{w}_{\\mathrm{ML}})-\\text{penalty}\\)',
    xt:[0,3,6,9],yt:[0,1],pad:[16,18,28,46]});
  slider(b.pn,{label:'Data points \\(N\\)',min:10,max:100,step:1,value:st.N,on:v=>{st.N=v;gen()}});
  slider(b.pn,{label:'Folds \\(S\\)',min:2,max:10,step:1,value:st.S,on:v=>{st.S=v;draw()}});
  const sM=slider(b.pn,{label:'Order \\(M\\) on show',min:0,max:9,step:1,value:st.M,on:v=>{st.M=v;paint()}});
  slider(b.pn,{label:'Noise \\(\\sigma\\)',min:0,max:.6,step:.01,value:st.sigma,fmt:v=>fmt(v,2),
    on:v=>{st.sigma=v;gen()}});
  btnrow(b.pn,[{l:'Draw a new sample',on:()=>{st.seed++;gen()}}]);
  btnrow(b.pn,[{l:'Go to the \\(\\mathrm{CV}\\) choice',on:()=>{st.M=st.mcv;sM.set(st.M);paint()}},
    {l:'\\(\\mathrm{AIC}\\)',on:()=>{st.M=st.maic;sM.set(st.M);paint()}},
    {l:'\\(\\mathrm{BIC}\\)',on:()=>{st.M=st.mbic;sM.set(st.M);paint()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'cv',l:'\\(M\\) chosen by \\(\\mathrm{CV}\\)'},
    {k:'aic',l:'\\(M\\) chosen by \\(\\mathrm{AIC}\\)'},{k:'bic',l:'\\(M\\) chosen by \\(\\mathrm{BIC}\\)'},
    {k:'mte',l:'\\(M\\) with the lowest \\(E_{\\mathrm{RMS}}^{\\mathrm{test}}\\)'},
    {k:'te',l:'\\(E_{\\mathrm{RMS}}^{\\mathrm{test}}\\) at the \\(M\\) on show',big:true},
    {k:'runs',l:'Training runs, \\(\\mathrm{CV}\\)'},
    {k:'runs1',l:'Training runs, \\(\\mathrm{AIC}\\) or \\(\\mathrm{BIC}\\)'}]);
  eqbar(root,'Two ways to choose a model without a test set',
    '\\( E_{\\mathrm{CV}}(M)=\\dfrac{1}{S}\\sum_{s=1}^{S}E_{\\mathrm{RMS}}^{(s)}(M)\\), where run \\(s\\) fits on '+
    '\\((S-1)/S\\) of the data and scores the held-out group<br>'+
    '\\( \\mathrm{AIC}=\\ln p(\\mathcal D\\mid\\mathbf{w}_{\\mathrm{ML}})-M\\), '+
    '\\( \\mathrm{BIC}=\\ln p(\\mathcal D\\mid\\mathbf{w}_{\\mathrm{ML}})-\\dfrac{M}{2}\\ln N\\), '+
    'where \\(M\\) counts the adjustable parameters, \\(M+1\\) for a polynomial of order \\(M\\)');
  note(root,['Cross-validation is steadier, at \\(S\\) times the training runs.',
    'Larger \\(S\\): more data per run, more runs.',
    '\\(\\mathrm{AIC}\\) and \\(\\mathrm{BIC}\\) need one fit and no held-out data.',
    '\\(\\mathrm{BIC}\\) charges \\(\\ln N\\) per parameter, so it picks simpler.']);
  function logLik(xs,ts,w){const N=xs.length;let s=0;
    for(let n=0;n<N;n++){const d=polyval(w,xs[n])-ts[n];s+=d*d}
    const be=N/Math.max(s,1e-12);
    return -N/2+N/2*Math.log(be)-N/2*Math.log(2*Math.PI)}
  function gen(){st.d=sample(st.N,st.sigma,st.seed);st.te=sample(400,st.sigma,st.seed+977);
    const r=rng(st.seed+13),idx=st.d.xs.map((v,i)=>i);
    for(let i=idx.length-1;i>0;i--){const j=Math.floor(r()*(i+1)),t=idx[i];idx[i]=idx[j];idx[j]=t}
    st.perm=idx;draw()}
  function draw(){const d=st.d,S=Math.min(st.S,d.N);
    st.rows=MS.map(M=>{const w=fit(d.xs,d.ts,M,RIDGE),k=M+1,ll=logLik(d.xs,d.ts,w);
      let cv=0;
      for(let s=0;s<S;s++){const ax=[],at=[],bx=[],bt=[];
        st.perm.forEach((n,pos)=>{if(pos%S===s){bx.push(d.xs[n]);bt.push(d.ts[n])}
          else{ax.push(d.xs[n]);at.push(d.ts[n])}});
        const ws=fit(ax,at,M,RIDGE);cv+=erms(bx,bt,ws)}
      return{M:M,w:w,tr:erms(d.xs,d.ts,w),te:erms(st.te.xs,st.te.ts,w),cv:cv/S,
        aic:ll-k,bic:ll-k/2*Math.log(d.N)}});
    let a=0,bi=0,c=0,t=0;
    st.rows.forEach((r,i)=>{if(r.aic>st.rows[a].aic)a=i;if(r.bic>st.rows[bi].bic)bi=i;
      if(r.cv<st.rows[c].cv)c=i;if(r.te<st.rows[t].te)t=i});
    st.maic=a;st.mbic=bi;st.mcv=c;st.mte=t;
    let lo=Infinity,hi=-Infinity;
    st.rows.forEach(r=>{lo=Math.min(lo,r.aic,r.bic);hi=Math.max(hi,r.aic,r.bic)});
    const pad=Math.max((hi-lo)*.15,.5);I.o.ylim=[lo-pad,hi+pad];
    I.o.yt=[Math.round(lo),Math.round((lo+hi)/2),Math.round(hi)];
    paint()}
  function paint(){const r=st.rows[st.M];
    out({cv:st.mcv,aic:st.maic,bic:st.mbic,mte:st.mte,te:fmt(r.te,3),
      runs:Math.min(st.S,st.d.N)*MS.length,runs1:MS.length});
    P.draw();R.draw();I.draw()}
  P.render=p=>{const c=p.col;p.path(sin2pi,c.truth,2.2);
    p.dots(st.d.xs,st.d.ts,c.obs,st.N>40?3:4.2);
    p.path(x=>polyval(st.rows[st.M].w,x),c.fit,2.6)};
  P.hoverFmt=x=>[{t:'x = '+fmt(x,2)},
    {t:'y(x, w*) = '+fmt(polyval(st.rows[st.M].w,x),2),c:P.col.fit},
    {t:'sin(2πx) = '+fmt(sin2pi(x),2),c:P.col.truth}];
  R.render=p=>{const c=p.col,vi=cssv('--violet'),cap=v=>clamp(v,-.04,1.24);
    p.seg(st.M,-.04,1.24,c.acc,1.5,[4,4]);
    p.line(st.rows.map(r=>[r.M,cap(r.tr)]),c.obs,2.2);
    p.line(st.rows.map(r=>[r.M,cap(r.te)]),c.fit,2.2);
    p.line(st.rows.map(r=>[r.M,cap(r.cv)]),vi,2.6);
    p.mark(st.mcv,cap(st.rows[st.mcv].cv),vi,4.5)};
  R.hoverFmt=x=>{const M=clamp(Math.round(x),0,9),r=st.rows[M];
    return[{t:'M = '+M},{t:'train '+fmt(r.tr,3),c:R.col.obs},
      {t:'CV '+fmt(r.cv,3),c:cssv('--violet')},{t:'test '+fmt(r.te,3),c:R.col.fit}]};
  R.onClick=x=>{st.M=clamp(Math.round(x),0,9);sM.set(st.M);paint()};
  I.render=p=>{const c=p.col,cy=cssv('--cyan');
    p.seg(st.M,p.o.ylim[0],p.o.ylim[1],c.acc,1.5,[4,4]);
    p.line(st.rows.map(r=>[r.M,r.aic]),c.acc,2.4);
    p.line(st.rows.map(r=>[r.M,r.bic]),cy,2.4);
    p.mark(st.maic,st.rows[st.maic].aic,c.acc,4.5);
    p.mark(st.mbic,st.rows[st.mbic].bic,cy,4.5)};
  I.hoverFmt=x=>{const M=clamp(Math.round(x),0,9),r=st.rows[M];
    return[{t:'M = '+M},{t:'AIC '+fmt(r.aic,2),c:I.col.acc},{t:'BIC '+fmt(r.bic,2),c:cssv('--cyan')}]};
  I.onClick=x=>{st.M=clamp(Math.round(x),0,9);sM.set(st.M);paint()};
  gen()}
