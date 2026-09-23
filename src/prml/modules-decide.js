/* PRML simulators, slides 66 and 68: the misclassification rate and where the
   decision boundary should sit. */
import{el,fmt,clamp,gaussPdf,Plot,board,legend,slider,btnrow,readout,eqbar,note}from'./core.js'

const LO=-8,HI=8,NG=1600,H=(HI-LO)/NG;

export function p66(root){
  const st={xh:.7,m1:-1.2,m2:1.2,s1:1,s2:1,pi1:.5};
  const b=board(root,'Controls');

  /* slide 66: the two joint densities and the three error areas */
  legend(b.pc,[{c:'var(--truth)',l:'\\(\\int_{-\\infty}^{x_0}p(x,\\mathcal C_2)\\,dx\\)'},
    {c:'var(--fit)',l:'\\(\\left|\\int_{x_0}^{\\hat x}\\{p(x,\\mathcal C_2)-p(x,\\mathcal C_1)\\}dx\\right|\\)'},
    {c:'var(--obs)',l:'\\(\\int_{x_0}^{\\infty}p(x,\\mathcal C_1)\\,dx\\)'},
    {c:'var(--accent)',t:'dash',l:'\\(\\hat x\\)'},{c:'var(--muted)',t:'dash',l:'\\(x_0\\)'}]);
  const A=new Plot(b.pc,{h:280,xlim:[-5,5],ylim:[0,.5],xl:'\\(x\\)',yl:'\\(p(x,\\mathcal C_k)\\)',
    xt:[-4,-2,0,2,4],yt:[0,.25,.5],pad:[16,18,28,44]});

  /* slide 68: how the total error moves with the boundary */
  const c2=el('div','card plotcard');b.lc.appendChild(c2);
  legend(c2,[{c:'var(--accent)',l:'\\(p(\\text{mistake})\\)'},
    {c:'var(--muted)',t:'dash',l:'\\(p(\\text{mistake})\\) at \\(\\hat x=x_0\\)'}]);
  const B=new Plot(c2,{h:230,xlim:[-5,5],ylim:[0,.6],xl:'\\(\\hat x\\)',yl:'\\(p(\\text{mistake})\\)',
    xt:[-4,-2,0,2,4],yt:[0,.3,.6],pad:[16,18,28,44]});

  const sX=slider(b.pn,{label:'Decision boundary \\(\\hat x\\)',min:-5,max:5,step:.05,value:st.xh,
    fmt:v=>fmt(v,2),on:v=>{st.xh=v;paint()}});
  btnrow(b.pn,[{l:'Put \\(\\hat x\\) at \\(x_0\\)',on:()=>{st.xh=Math.round(st.x0*20)/20;sX.set(st.xh);paint()}}]);
  b.pn.appendChild(el('div','hr'));
  slider(b.pn,{label:'Prior \\(p(\\mathcal C_1)\\)',min:.05,max:.95,step:.01,value:st.pi1,
    fmt:v=>fmt(v,2),on:v=>{st.pi1=v;gen()}});
  slider(b.pn,{label:'Mean \\(\\mu_1\\)',min:-4,max:-.2,step:.1,value:st.m1,fmt:v=>fmt(v,1),
    on:v=>{st.m1=v;gen()}});
  slider(b.pn,{label:'Mean \\(\\mu_2\\)',min:.2,max:4,step:.1,value:st.m2,fmt:v=>fmt(v,1),
    on:v=>{st.m2=v;gen()}});
  slider(b.pn,{label:'Spread \\(\\sigma_1\\)',min:.3,max:2,step:.05,value:st.s1,fmt:v=>fmt(v,2),
    on:v=>{st.s1=v;gen()}});
  slider(b.pn,{label:'Spread \\(\\sigma_2\\)',min:.3,max:2,step:.05,value:st.s2,fmt:v=>fmt(v,2),
    on:v=>{st.s2=v;gen()}});
  b.pn.appendChild(el('div','hr'));
  const out=readout(b.pn,[{k:'x0',l:'\\(x_0\\), where the curves cross'},
    {k:'e2',l:'\\(\\int_{\\mathcal R_1}p(x,\\mathcal C_2)\\,dx\\)'},
    {k:'e1',l:'\\(\\int_{\\mathcal R_2}p(x,\\mathcal C_1)\\,dx\\)'},
    {k:'pm',l:'\\(p(\\text{mistake})\\)',big:true},
    {k:'best',l:'\\(p(\\text{mistake})\\) at \\(\\hat x=x_0\\)'},
    {k:'red',l:'Excess, the red area'}]);

  eqbar(root,'The probability of a mistake',
    '\\( p(\\text{mistake})=p(\\mathbf{x}\\in\\mathcal R_1,\\mathcal C_2)+p(\\mathbf{x}\\in\\mathcal R_2,\\mathcal C_1)'+
    '=\\int_{\\mathcal R_1}p(x,\\mathcal C_2)\\,dx+\\int_{\\mathcal R_2}p(x,\\mathcal C_1)\\,dx\\)<br>'+
    'with \\( p(x,\\mathcal C_k)=p(x\\mid\\mathcal C_k)p(\\mathcal C_k)\\), \\(\\mathcal R_1=\\{x<\\hat x\\}\\), '+
    '\\(\\mathcal R_2=\\{x\\geq\\hat x\\}\\), and the minimum at \\(\\hat x=x_0\\), '+
    'where \\(p(x,\\mathcal C_1)=p(x,\\mathcal C_2)\\), that is where \\(p(\\mathcal C_k\\mid x)\\) is largest');
  note(root,['Every \\(x\\) has a true class and a decided class; mistakes are the two off-diagonal pairs.',
    'Green and blue never move, so only the red area changes with \\(\\hat x\\).',
    'Red vanishes at \\(\\hat x=x_0\\), which is the minimum of the lower curve.',
    'Raise \\(p(\\mathcal C_1)\\) and \\(x_0\\) slides towards \\(\\mathcal C_2\\): a rarer class needs stronger evidence.']);

  const f1=x=>st.pi1*gaussPdf(x,st.m1,st.s1),f2=x=>(1-st.pi1)*gaussPdf(x,st.m2,st.s2);
  const at=(c,x)=>{const u=clamp((x-LO)/H,0,NG),i=Math.floor(u);
    return i>=NG?c[NG]:c[i]+(c[i+1]-c[i])*(u-i)};

  function gen(){const c1=[0],cc2=[0];
    for(let i=1;i<=NG;i++){const a=LO+(i-1)*H,b2=LO+i*H;
      c1.push(c1[i-1]+(f1(a)+f1(b2))/2*H);cc2.push(cc2[i-1]+(f2(a)+f2(b2))/2*H)}
    st.c1=c1;st.c2=cc2;st.t1=c1[NG];
    /* the crossing that sits between the two means */
    const lo=Math.min(st.m1,st.m2),hi=Math.max(st.m1,st.m2);let x0=(lo+hi)/2,prev=f1(lo)-f2(lo);
    for(let i=1;i<=200;i++){const x=lo+(hi-lo)*i/200,v=f1(x)-f2(x);
      if(prev===0||v*prev<0){x0=x-(hi-lo)/200*v/(v-prev);break}prev=v}
    st.x0=x0;
    st.green=at(cc2,x0);st.blue=st.t1-at(c1,x0);
    const pk=Math.max(f1(st.m1),f2(st.m2)),top=Math.max(.1,pk*1.18);
    A.o.ylim=[0,top];A.o.yt=[0,Math.round(top/2*100)/100,Math.round(top*100)/100];
    st.curve=[];let mx=0;
    for(let i=0;i<=160;i++){const x=-5+10*i/160,v=pmAt(x);st.curve.push([x,v]);if(v>mx)mx=v}
    const tb=Math.max(.05,mx*1.1);B.o.ylim=[0,tb];B.o.yt=[0,Math.round(tb/2*100)/100,Math.round(tb*100)/100];
    paint()}

  function pmAt(x){return at(st.c2,x)+(st.t1-at(st.c1,x))}

  function paint(){const e2=at(st.c2,st.xh),e1=st.t1-at(st.c1,st.xh),pm=e1+e2;
    out({x0:fmt(st.x0,2),e2:fmt(e2,4),e1:fmt(e1,4),pm:fmt(pm,4),
      best:fmt(st.green+st.blue,4),red:fmt(Math.max(pm-st.green-st.blue,0),4)});
    A.draw();B.draw()}

  A.render=p=>{const c=p.col,x0=st.x0,a=Math.min(st.xh,x0),z=Math.max(st.xh,x0),top=p.o.ylim[1];
    p.band(()=>0,x=>x<=x0?f2(x):0,c.truth,.30);
    p.band(()=>0,x=>x>=x0?f1(x):0,c.obs,.30);
    p.band(x=>(x>=a&&x<=z)?Math.min(f1(x),f2(x)):0,x=>(x>=a&&x<=z)?Math.max(f1(x),f2(x)):0,c.fit,.55);
    p.seg(x0,0,top,c.muted,1.2,[4,4]);p.seg(st.xh,0,top,c.acc,2,[5,4]);
    p.path(f1,c.ink2,2.2);p.path(f2,c.ink2,2.2);
    p.label(st.m1,f1(st.m1),'C₁',c.ink2,'center',-12);
    p.label(st.m2,f2(st.m2),'C₂',c.ink2,'center',-12)};
  A.hoverFmt=x=>[{t:'x = '+fmt(x,2)},{t:'p(x, C₁) = '+fmt(f1(x),3)},{t:'p(x, C₂) = '+fmt(f2(x),3)}];
  A.onClick=x=>{st.xh=clamp(Math.round(x*20)/20,-5,5);sX.set(st.xh);paint()};

  B.render=p=>{const c=p.col;
    p.seg(st.xh,0,p.o.ylim[1],c.acc,2,[5,4]);
    p.line([[-5,st.green+st.blue],[5,st.green+st.blue]],c.muted,1.3,[4,4]);
    p.line(st.curve,c.acc,2.6);
    p.mark(st.x0,st.green+st.blue,c.muted,4.5);
    p.mark(st.xh,pmAt(st.xh),c.acc,4.5)};
  B.hoverFmt=x=>{const v=clamp(x,-5,5);
    return[{t:'x̂ = '+fmt(v,2)},{t:'p(mistake) = '+fmt(pmAt(v),4),c:B.col.acc}]};
  B.onClick=x=>{st.xh=clamp(Math.round(x*20)/20,-5,5);sX.set(st.xh);paint()};

  gen()}
