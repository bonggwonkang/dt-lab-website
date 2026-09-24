/* PRML simulators, slides 75 to 77: the generative approach, the discriminative
   model and the discriminant function on one classification problem, with the
   consequences listed on slides 78 to 81. */
import{el,tex,fmt,clamp,gaussPdf,Plot,board,legend,slider,btnrow,readout,eqbar,note}from'./core.js'

/* the class conditional densities of Figure 1.27, the left mode of class 1
   deliberately far from the overlap */
const MIX=[{w:.5,m:.2,s:.1},{w:.5,m:.5,s:.09}],G2={m:.7,s:.1};
const px1=x=>MIX.reduce((a,q)=>a+q.w*gaussPdf(x,q.m,q.s),0);
const px2=x=>gaussPdf(x,G2.m,G2.s);
const NG=400,H=1/NG;

export function p75(root){
  const st={way:0,pi:.5,l12:1,l21:1,th:.5,x0:.55,xf:.6};
  const b=board(root,'Controls');

  /* what the chosen approach actually models */
  const L=[legend(b.pc,[{c:'var(--obs)',l:'\\(p(x\\mid\\mathcal C_1)\\)'},
      {c:'var(--fit)',l:'\\(p(x\\mid\\mathcal C_2)\\)'},{c:'var(--accent)',t:'dash',l:'\\(p(x)\\)'}]),
    legend(b.pc,[{c:'var(--obs)',l:'\\(p(\\mathcal C_1\\mid x)\\)'},
      {c:'var(--fit)',l:'\\(p(\\mathcal C_2\\mid x)\\)'},{c:'var(--muted)',t:'dash',l:'\\(\\theta\\)'}]),
    legend(b.pc,[{c:'var(--accent)',l:'\\(f(x)\\)'}])];
  const A=new Plot(b.pc,{h:250,xlim:[0,1],ylim:[0,4.4],xl:'\\(x\\)',
    yl:'\\(p(x\\mid\\mathcal C_k)\\)',xt:[0,.25,.5,.75,1],yt:[0,2,4],pad:[16,18,28,44]});

  /* the decision that follows from it */
  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--obs)',l:'\\(\\mathcal R_1\\)'},{c:'var(--fit)',l:'\\(\\mathcal R_2\\)'},
    {c:'var(--muted)',l:'reject'},{c:'var(--accent)',t:'dash',l:'\\(\\hat x\\)'}]);
  const B=new Plot(c2,{h:230,xlim:[0,1],ylim:[0,2.4],xl:'\\(x\\)',yl:'\\(p(x,\\mathcal C_k)\\)',
    xt:[0,.25,.5,.75,1],yt:[0,1,2],pad:[16,18,28,44]});

  const ways=btnrow(b.pn,[{l:'(I) Generative',on:()=>pick(0)},{l:'(II) Discriminative',on:()=>pick(1)},
    {l:'(III) Discriminant',on:()=>pick(2)}]);
  b.pn.appendChild(el('div','hr'));
  slider(b.pn,{label:'Class prior \\(p(\\mathcal C_1)\\)',min:.05,max:.95,step:.01,value:st.pi,
    fmt:v=>fmt(v,2),on:v=>{st.pi=v;draw()}});
  slider(b.pn,{label:'Loss \\(L_{12}\\), true \\(\\mathcal C_1\\) called \\(\\mathcal C_2\\)',
    min:1,max:20,step:1,value:st.l12,on:v=>{st.l12=v;draw()}});
  slider(b.pn,{label:'Loss \\(L_{21}\\), true \\(\\mathcal C_2\\) called \\(\\mathcal C_1\\)',
    min:1,max:20,step:1,value:st.l21,on:v=>{st.l21=v;draw()}});
  slider(b.pn,{label:'Reject threshold \\(\\theta\\)',min:.5,max:.99,step:.01,value:st.th,
    fmt:v=>fmt(v,2),on:v=>{st.th=v;draw()}});
  const sT=slider(b.pn,{label:'Test input \\(\\hat x\\)',min:0,max:1,step:.005,value:st.x0,
    fmt:v=>fmt(v,3),on:v=>{st.x0=v;draw()}});
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'bd',l:'Decision boundary'},
    {k:'pm',l:'\\(p(\\text{mistake})\\)'},{k:'el',l:'\\(\\mathbb E[L]\\)',big:true},
    {k:'rj',l:'Rejected share of \\(p(x)\\)'},{k:'pv',l:'\\(p(\\hat x)\\), the evidence'},
    {k:'po',l:'\\(p(\\mathcal C_1\\mid\\hat x)\\)'}]);

  eqbar(root,'Three routes from data to a decision',
    '(I) \\( p(\\mathcal C_k\\mid x)=\\dfrac{p(x\\mid\\mathcal C_k)p(\\mathcal C_k)}{p(x)}\\), '+
    '\\( p(x)=\\sum_k p(x\\mid\\mathcal C_k)p(\\mathcal C_k)\\)<br>'+
    '(II) \\( p(\\mathcal C_1\\mid x,\\mathbf{w})=\\sigma\\!\\left(\\mathbf{w}^{\\mathrm T}\\boldsymbol\\phi(x)\\right)\\), '+
    '(III) \\( f(x)=0\\) if \\(\\mathbf{w}^{\\mathrm T}\\boldsymbol\\phi(x)+w_0<0\\), else \\(1\\)<br>'+
    'and the decision itself minimises \\( \\mathbb E[L]=\\sum_k\\sum_j\\int_{\\mathcal R_j}L_{kj}\\,p(x,\\mathcal C_k)\\,dx\\)');
  note(root,['Only (I) models \\(p(x)\\), so only (I) can call \\(\\hat x\\) an outlier.',
    'The left mode of \\(p(x\\mid\\mathcal C_1)\\) never reaches the posterior or the decision.',
    'Raise \\(L_{12}\\): (I) and (II) move the boundary at once, (III) cannot.',
    'Raise \\(\\theta\\): a reject band opens for (I) and (II), never for (III).']);

  const j1=x=>st.pi*px1(x),j2=x=>(1-st.pi)*px2(x);
  const post=x=>{const a=j1(x),c=a+j2(x);return c>0?a/c:.5};
  const decide=x=>st.way===2?x<st.xf:st.l12*j1(x)>=st.l21*j2(x);
  const reject=x=>{if(st.way===2)return false;const p=post(x);return Math.max(p,1-p)<=st.th};
  function opt(){let last=0;
    for(let i=0;i<=NG;i++){const x=i*H;if(st.l12*j1(x)>=st.l21*j2(x))last=x}
    return Math.min(last+H/2,1)}
  function pick(k){st.way=k;
    L.forEach((n,i)=>{n.style.display=i===k?'':'none'});
    Array.prototype.forEach.call(ways.children,(n,i)=>n.classList.toggle('on',i===k));
    A.o.ylim=k===0?[0,4.4]:[-.06,1.06];A.o.yt=k===0?[0,2,4]:[0,.5,1];
    A.ly.innerHTML=k===0?'\\(p(x\\mid\\mathcal C_k)\\)':k===1?'\\(p(\\mathcal C_k\\mid x)\\)':'\\(f(x)\\)';
    tex(A.ly);draw()}

  function draw(){let err=0,loss=0,rej=0,sw=[],prev=null;
    const top=Math.max(j1(MIX[1].m),j2(G2.m))*1.16;
    B.o.ylim=[0,top];B.o.yt=[0,Math.round(top/2*10)/10,Math.round(top*10)/10];
    for(let i=0;i<=NG;i++){const x=i*H,a=j1(x),c=j2(x),w=(i===0||i===NG)?.5:1;
      const d=decide(x);
      if(reject(x))rej+=w*(a+c)*H;
      else{err+=w*(d?c:a)*H;loss+=w*(d?st.l21*c:st.l12*a)*H}
      if(prev!==null&&d!==prev&&sw.length<3)sw.push(fmt(x,3));prev=d}
    const ev=j1(st.x0)+j2(st.x0),mx=j1(MIX[1].m)+j2(G2.m);
    out({bd:sw.length?sw.join(', '):'none',pm:fmt(err,4),el:fmt(loss,4),rj:fmt(rej,4),
      pv:st.way===0?fmt(ev,3)+(ev<.05*mx?'  outlier':''):'not modelled',
      po:st.way===2?'not modelled':fmt(post(st.x0),3)});
    A.draw();B.draw()}

  A.render=p=>{const c=p.col;
    if(st.way===0){p.path(x=>px1(x),c.obs,2.4);p.path(x=>px2(x),c.fit,2.4);
      p.path(x=>j1(x)+j2(x),c.acc,1.8,[5,4])}
    else if(st.way===1){p.path(post,c.obs,2.6);p.path(x=>1-post(x),c.fit,2.6);
      p.line([[0,st.th],[1,st.th]],c.muted,1.2,[4,4]);
      p.line([[0,1-st.th],[1,1-st.th]],c.muted,1.2,[4,4])}
    else{const pts=[];for(let i=0;i<=NG;i++){const x=i*H;pts.push([x,decide(x)?0:1])}
      p.line(pts,c.acc,2.6)}
    p.seg(st.x0,p.o.ylim[0],p.o.ylim[1],c.acc,1.6,[5,4])};
  A.hoverFmt=x=>st.way===0?[{t:'x = '+fmt(x,2)},{t:'p(x|C₁) = '+fmt(px1(x),2),c:A.col.obs},
      {t:'p(x|C₂) = '+fmt(px2(x),2),c:A.col.fit}]:
    st.way===1?[{t:'x = '+fmt(x,2)},{t:'p(C₁|x) = '+fmt(post(x),3),c:A.col.obs}]:
      [{t:'x = '+fmt(x,2)},{t:'f(x) = '+(decide(x)?0:1),c:A.col.acc}];
  A.onClick=x=>{st.x0=clamp(Math.round(x*200)/200,0,1);sT.set(st.x0);draw()};

  B.render=p=>{const c=p.col,top=p.o.ylim[1];
    p.band(()=>0,x=>reject(x)?top:0,c.muted,.22);
    p.band(()=>0,x=>!reject(x)&&decide(x)?top:0,c.obs,.16);
    p.band(()=>0,x=>!reject(x)&&!decide(x)?top:0,c.fit,.16);
    p.path(j1,c.obs,2.2);p.path(j2,c.fit,2.2);
    p.seg(st.x0,0,top,c.acc,1.6,[5,4])};
  B.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'p(x, C₁) = '+fmt(j1(x),3),c:B.col.obs},
    {t:'p(x, C₂) = '+fmt(j2(x),3),c:B.col.fit}];
  B.onClick=x=>{st.x0=clamp(Math.round(x*200)/200,0,1);sT.set(st.x0);draw()};

  st.xf=opt();pick(0)}
