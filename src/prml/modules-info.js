/* PRML simulators for information theory: slides 92 to 95, the information
   content and the entropy, and slides 100 to 103, the relative entropy and the
   training points that turn it into a likelihood. */
import{el,fmt,clamp,rng,gauss,gaussPdf,Plot,board,legend,slider,btnrow,readout,eqbar,note}from'./core.js'

const integ=(f,a,b,n)=>{const d=(b-a)/(n-1);let s=0;
  for(let i=0;i<n;i++)s+=((i===0||i===n-1)?.5:1)*f(a+i*d);return s*d};

/* ============ slides 92 to 95: information and entropy ============ */
export function p92(root){
  const st={mu:0,sd:1,x0:1.6};
  const px=x=>gaussPdf(x,st.mu,st.sd);
  const hx=x=>-Math.log2(px(x));
  const H=()=>-integ(x=>{const v=px(x);return v>1e-300?v*Math.log2(v):0},
    st.mu-7*st.sd,st.mu+7*st.sd,801);

  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--obs)',l:'\\(p(x)\\)'},{c:'var(--accent)',t:'dash',l:'\\(\\hat x\\)'}]);
  const A=new Plot(b.pc,{h:210,xlim:[-7,7],ylim:[0,.95],xl:'\\(x\\)',yl:'\\(p(x)\\)',
    xt:[-6,-3,0,3,6],yt:[0,.4,.8],pad:[16,18,28,40]});

  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--fit)',l:'\\(h(x)=-\\log_2 p(x)\\)'},{c:'var(--truth)',t:'dash',l:'\\(H[x]\\)'},
    {c:'var(--accent)',t:'dash',l:'\\(\\hat x\\)'}]);
  const B=new Plot(c2,{h:210,xlim:[-7,7],ylim:[0,9],xl:'\\(x\\)',yl:'\\(h(x)\\), bits',
    xt:[-6,-3,0,3,6],yt:[0,3,6,9],pad:[16,18,28,40]});

  slider(b.pn,{label:'Mean \\(\\mu\\)',min:-1.5,max:1.5,step:.05,value:st.mu,
    fmt:v=>fmt(v,2),on:v=>{st.mu=v;draw()}});
  slider(b.pn,{label:'Standard deviation \\(\\sigma\\)',min:.45,max:1.8,step:.01,value:st.sd,
    fmt:v=>fmt(v,2),on:v=>{st.sd=v;draw()}});
  const sX=slider(b.pn,{label:'Observed value \\(\\hat x\\)',min:-7,max:7,step:.05,value:st.x0,
    fmt:v=>fmt(v,2),on:v=>{st.x0=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'H',l:'Entropy \\(H[x]\\), bits',big:true},
    {k:'p',l:'\\(p(\\hat x)\\)'},{k:'h',l:'Information \\(h(\\hat x)\\), bits'},
    {k:'h0',l:'Information at \\(x=\\mu\\), bits'}]);

  eqbar(root,'The information content and its expectation',
    '\\( h(x)=-\\log_2 p(x) \\), so a less probable \\(x\\) carries more information<br>'+
    '\\( \\mathbb E[h(x)]\\equiv H[x]=-\\int p(x)\\log_2 p(x)\\,dx \\), the entropy<br>'+
    'for \\( p(x)=\\mathcal N(x|\\mu,\\sigma^{2}) \\) this is '+
    '\\( \\tfrac{1}{2}\\log_2\\!\\left(2\\pi e\\sigma^{2}\\right) \\), which does not contain \\(\\mu\\)');
  note(root,['Move \\(\\hat x\\) into the tail: \\(p(\\hat x)\\) falls and \\(h(\\hat x)\\) rises.',
    'Move \\(\\mu\\): everything slides sideways and \\(H[x]\\) does not change.',
    'Raise \\(\\sigma\\): the distribution flattens and \\(H[x]\\) rises.',
    'The dashed line is \\(H[x]\\), the average of \\(h(x)\\) weighted by \\(p(x)\\).']);

  function draw(){const e=H();
    out({H:fmt(e,3),p:fmt(px(st.x0),4),h:fmt(hx(st.x0),3),h0:fmt(hx(st.mu),3)});
    B.o.ylim=[0,9];A.draw();B.draw()}

  A.render=p=>{const c=p.col;
    p.path(px,c.obs,2.6);
    p.seg(st.x0,0,px(st.x0),c.acc,1.6,[5,4]);p.mark(st.x0,px(st.x0),c.acc,4.4)};
  A.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'p(x) = '+fmt(px(x),4),c:A.col.obs}];
  A.onClick=x=>{st.x0=clamp(Math.round(x*20)/20,-7,7);sX.set(st.x0);draw()};

  B.render=p=>{const c=p.col,e=H();
    p.line([[-7,e],[7,e]],c.truth,1.8,[5,4]);
    p.path(hx,c.fit,2.6);
    p.seg(st.x0,0,clamp(hx(st.x0),0,9),c.acc,1.6,[5,4]);
    p.mark(st.x0,clamp(hx(st.x0),0,9),c.acc,4.4)};
  B.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'h(x) = '+fmt(hx(x),3)+' bits',c:B.col.fit}];
  B.onClick=x=>{st.x0=clamp(Math.round(x*20)/20,-7,7);sX.set(st.x0);draw()};

  draw()}

/* ====== slides 100 and 101: the relative entropy and its two terms ====== */
export function p100(root){
  const st={mp:0,sp:1,mq:.8,sq:1.4};
  const px=x=>gaussPdf(x,st.mp,st.sp),qx=x=>gaussPdf(x,st.mq,st.sq);
  const lo=()=>st.mp-8*st.sp,hi=()=>st.mp+8*st.sp;
  const cross=()=>-integ(x=>{const v=px(x),u=qx(x);return v>1e-300?v*Math.log(Math.max(u,1e-300)):0},
    lo(),hi(),901);
  const ent=()=>-integ(x=>{const v=px(x);return v>1e-300?v*Math.log(v):0},lo(),hi(),901);
  const band=x=>{const v=px(x),u=qx(x);return v>1e-300?v*Math.log(v/Math.max(u,1e-300)):0};

  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--obs)',l:'\\(p(x)\\)'},{c:'var(--fit)',l:'\\(q(x)\\)'}]);
  const A=new Plot(b.pc,{h:210,xlim:[-6,6],ylim:[0,.95],xl:'\\(x\\)',yl:'density',
    xt:[-6,-3,0,3,6],yt:[0,.4,.8],pad:[16,18,28,44]});

  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--accent)',l:'\\(p(x)\\ln\\{p(x)/q(x)\\}\\)'}]);
  const B=new Plot(c2,{h:200,xlim:[-6,6],ylim:[-.3,.6],xl:'\\(x\\)',yl:'integrand',
    xt:[-6,-3,0,3,6],yt:[-.2,0,.2,.4],pad:[16,18,28,44]});

  slider(b.pn,{label:'Mean of \\(p\\)',min:-2,max:2,step:.05,value:st.mp,
    fmt:v=>fmt(v,2),on:v=>{st.mp=v;draw()}});
  slider(b.pn,{label:'Standard deviation of \\(p\\)',min:.45,max:2,step:.01,value:st.sp,
    fmt:v=>fmt(v,2),on:v=>{st.sp=v;draw()}});
  slider(b.pn,{label:'Mean of \\(q\\)',min:-2,max:2,step:.05,value:st.mq,
    fmt:v=>fmt(v,2),on:v=>{st.mq=v;draw()}});
  slider(b.pn,{label:'Standard deviation of \\(q\\)',min:.45,max:2,step:.01,value:st.sq,
    fmt:v=>fmt(v,2),on:v=>{st.sq=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'kl',l:'\\(\\mathrm{KL}(p\\|q)\\), their difference',big:true},
    {k:'cr',l:'\\(\\mathbb E_p[-\\ln q]\\), the left term'},
    {k:'en',l:'\\(\\mathbb E_p[-\\ln p]\\), the right term'},
    {k:'cf',l:'\\(\\mathrm{KL}(p\\|q)\\) in closed form'}]);

  eqbar(root,'The relative entropy, or KL divergence',
    '\\( \\mathrm{KL}(p\\|q)=\\underbrace{-\\int p(x)\\ln q(x)\\,dx}_{\\mathbb E_p[-\\ln q]}'+
    '-\\underbrace{\\left(-\\int p(x)\\ln p(x)\\,dx\\right)}_{\\mathbb E_p[-\\ln p]}'+
    '=-\\int p(x)\\ln\\left\\{\\dfrac{q(x)}{p(x)}\\right\\}dx \\)<br>'+
    'the average additional surprise by believing \\(q(x)\\) when the data come from \\(p(x)\\)');
  note(root,['Move \\(q\\) away from \\(p\\): the left term rises, the right term does not move.',
    'The right term is the entropy of \\(p\\), so it is fixed once \\(p\\) is fixed.',
    '\\(\\mathrm{KL}(p\\|q)=0\\) only when \\(q\\) matches \\(p\\) everywhere.',
    'The lower curve shows which \\(x\\) the divergence is collected from.']);

  function draw(){const cr=cross(),en=ent(),
    cf=Math.log(st.sq/st.sp)+(st.sp*st.sp+(st.mp-st.mq)*(st.mp-st.mq))/(2*st.sq*st.sq)-.5;
    out({kl:fmt(cr-en,4),cr:fmt(cr,4),en:fmt(en,4),cf:fmt(cf,4)});
    let mx=.05,mn=-.05;
    for(let i=0;i<=120;i++){const v=band(-6+i*.1);if(v>mx)mx=v;if(v<mn)mn=v}
    B.o.ylim=[mn*1.2-.05,mx*1.2];
    B.o.yt=[Math.round(mn*10)/10,0,Math.round(mx*10)/10,Math.round(mx*20)/20*2];
    A.draw();B.draw()}

  A.render=p=>{p.path(px,p.col.obs,2.6);p.path(qx,p.col.fit,2.6)};
  A.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'p(x) = '+fmt(px(x),3),c:A.col.obs},
    {t:'q(x) = '+fmt(qx(x),3),c:A.col.fit}];

  B.render=p=>{p.line([[-6,0],[6,0]],p.col.line2,1);p.path(band,p.col.acc,2.4)};
  B.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'integrand = '+fmt(band(x),4),c:B.col.acc}];

  draw()}

/* ====== slides 102 and 103: the same divergence over a training set ====== */
const MP=.6,SP=1,ZN=[];
(function(){const r=rng(3);for(let n=0;n<80;n++)ZN.push(gauss(r))})();

export function p102(root){
  const st={N:20,mq:0,sq:1.4};
  const xs=()=>ZN.slice(0,st.N).map(z=>MP+SP*z);
  const px=x=>gaussPdf(x,MP,SP),qx=x=>gaussPdf(x,st.mq,st.sq);
  const nll=(d,m,s)=>{let v=0;for(let n=0;n<d.length;n++){const e=d[n]-m;
    v+=.5*Math.log(2*Math.PI*s*s)+e*e/(2*s*s)}return v};

  const b=board(root,'Controls');
  legend(b.pc,[{c:'var(--truth)',l:'\\(p(x)\\)'},{c:'var(--fit)',l:'\\(q(x\\mid\\theta)\\)'},
    {c:'var(--obs)',t:'dot',l:'\\(x_n\\)'}]);
  const A=new Plot(b.pc,{h:210,xlim:[-4,5],ylim:[-.06,.95],xl:'\\(x\\)',yl:'density',
    xt:[-4,-2,0,2,4],yt:[0,.4,.8],pad:[16,18,28,44]});

  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--fit)',l:'\\(\\sum_n\\{-\\ln q(x_n\\mid\\theta)\\}\\)'},
    {c:'var(--truth)',t:'dash',l:'\\(\\theta_{\\mathrm{ML}}\\)'},{c:'var(--accent)',t:'dash',l:'current \\(\\theta\\)'}]);
  const B=new Plot(c2,{h:200,xlim:[-2,3],ylim:[0,1],xl:'mean of \\(q(x\\mid\\theta)\\)',
    yl:'\\(\\sum_n\\{-\\ln q\\}\\)',xt:[-2,-1,0,1,2,3],yt:[0,.5,1],pad:[16,18,28,46]});

  slider(b.pn,{label:'Number of training points \\(N\\)',min:5,max:80,step:1,value:st.N,
    on:v=>{st.N=v;draw()}});
  const sM=slider(b.pn,{label:'Mean of \\(q(x\\mid\\theta)\\)',min:-2,max:3,step:.02,value:st.mq,
    fmt:v=>fmt(v,2),on:v=>{st.mq=v;draw()}});
  const sS=slider(b.pn,{label:'Standard deviation of \\(q(x\\mid\\theta)\\)',min:.45,max:2.5,step:.01,
    value:st.sq,fmt:v=>fmt(v,2),on:v=>{st.sq=v;draw()}});
  btnrow(b.pn,[{l:'Set \\(\\theta\\) to the maximum likelihood solution',on:()=>{
    const d=xs(),m=d.reduce((a,c)=>a+c,0)/d.length;
    let v=0;d.forEach(z=>{v+=(z-m)*(z-m)});
    st.mq=clamp(Math.round(m*50)/50,-2,3);st.sq=clamp(Math.round(Math.sqrt(v/d.length)*100)/100,.45,2.5);
    sM.set(st.mq);sS.set(st.sq);draw()}}]);
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'nl',l:'\\(\\sum_n\\{-\\ln q(x_n\\mid\\theta)\\}\\)',big:true},
    {k:'cn',l:'\\(\\sum_n\\ln p(x_n)\\), no \\(\\theta\\) in it'},
    {k:'kl',l:'\\(\\mathrm{KL}(p\\|q)\\), the sum of the two'},
    {k:'lo',l:'Its lowest value, at \\(\\theta_{\\mathrm{ML}}\\)'}]);
  b.pn.appendChild(el('div','hr'));
  const ml=readout(b.pn,[{k:'m',l:'Mean of the training points'},
    {k:'s',l:'Standard deviation of the training points'}]);

  eqbar(root,'The same divergence, approximated by a sum over the training points',
    '\\( \\mathrm{KL}(p\\|q)\\approx\\sum_{n=1}^{N}\\left\\{'+
    '\\underbrace{-\\ln q(x_n|\\boldsymbol\\theta)}_{\\text{negative log likelihood}}'+
    '+\\ln p(x_n)\\right\\} \\)<br>'+
    'the second term does not contain \\(\\boldsymbol\\theta\\), so minimizing this KL divergence '+
    'is maximizing the likelihood function');
  note(root,['The second term only shifts the curve, it never moves the minimum.',
    'The best mean is the mean of the training points, whatever \\(\\sigma\\) is.',
    'Press the button: \\(\\theta\\) lands on the lowest point of the curve.',
    'Raise \\(N\\) and \\(\\theta_{\\mathrm{ML}}\\) settles near the \\(p(x)\\) that made the points.']);

  let cur={};
  function draw(){const d=xs(),m=d.reduce((a,c)=>a+c,0)/d.length;
    let v=0;d.forEach(z=>{v+=(z-m)*(z-m)});const s=Math.sqrt(v/d.length);
    let cn=0;d.forEach(z=>{cn+=Math.log(px(z))});
    const nl=nll(d,st.mq,st.sq),best=nll(d,m,st.sq);
    cur={d:d,m:m,s:s};
    out({nl:fmt(nl,3),cn:fmt(cn,3),kl:fmt(nl+cn,3),lo:fmt(best,3)});
    ml({m:fmt(m,3),s:fmt(s,3)});
    const ys=[];for(let i=0;i<=100;i++)ys.push(nll(d,-2+i*.05,st.sq));
    const mn=Math.min.apply(null,ys),mx=Math.max.apply(null,ys);
    B.o.ylim=[mn-(mx-mn)*.08,mn+(mx-mn)*1.08];
    B.o.yt=[Math.round(mn),Math.round((mn+mx)/2),Math.round(mx)];
    A.draw();B.draw()}

  A.render=p=>{const c=p.col;
    p.path(px,c.truth,2.2);p.path(qx,c.fit,2.6);
    p.dots(cur.d,cur.d.map(()=>-.03),c.obs,3.4)};
  A.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'p(x) = '+fmt(px(x),3),c:A.col.truth},
    {t:'q(x|theta) = '+fmt(qx(x),3),c:A.col.fit}];

  B.render=p=>{const c=p.col,lo=p.o.ylim[0],hi=p.o.ylim[1];
    p.path(m=>nll(cur.d,m,st.sq),c.fit,2.6);
    p.seg(cur.m,lo,hi,c.truth,1.6,[5,4]);
    p.seg(st.mq,lo,hi,c.acc,1.4,[4,4]);
    p.mark(st.mq,nll(cur.d,st.mq,st.sq),c.acc,4.6)};
  B.hoverFmt=m=>[{t:'mean = '+fmt(m,2)},
    {t:'sum = '+fmt(nll(cur.d,m,st.sq),3),c:B.col.fit}];

  draw()}
