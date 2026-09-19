/* PRML simulators: plotting, numerics and UI parts shared by every module. */
const el=(t,c,h)=>{const n=document.createElement(t);if(c)n.className=c;if(h!=null)n.innerHTML=h;return n};
let ROOT=document.documentElement;
function setRoot(el){ROOT=el||document.documentElement}
const cssv=n=>getComputedStyle(ROOT).getPropertyValue(n).trim();
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const fmt=(v,d)=>{d=d==null?2:d;if(!isFinite(v))return'–';const a=Math.abs(v);
  if(a!==0&&(a<1e-3||a>=1e5))return v.toExponential(1).replace('e','e');return v.toFixed(d)};
let mjLoad=null;
function ensureMathJax(){
  if(mjLoad)return mjLoad;
  window.MathJax={loader:{load:['[tex]/boldsymbol']},
    tex:{packages:{'[+]':['boldsymbol']},inlineMath:[['\\(','\\)']],displayMath:[['$$','$$']]},
    svg:{fontCache:'global'},options:{enableMenu:false},startup:{typeset:false}};
  mjLoad=new Promise((res,rej)=>{const t=document.createElement('script');
    t.src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.js';
    t.async=true;t.onload=()=>res();t.onerror=rej;document.head.appendChild(t)});
  return mjLoad}
function tex(node){ensureMathJax()
  .then(()=>window.MathJax.startup.promise)
  .then(()=>window.MathJax.typesetPromise([node])).catch(()=>{})}

/* seeded RNG so every student can reproduce the same figure */
function rng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;
  let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function gauss(r){let u=0,v=0;while(u===0)u=r();while(v===0)v=r();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const sin2pi=x=>Math.sin(2*Math.PI*x);
function makeData(N,sigma,seed){const r=rng(seed),xs=[],ts=[],es=[];
  for(let n=0;n<N;n++){const x=N===1?0.5:n/(N-1),e=gauss(r)*sigma;xs.push(x);ts.push(sin2pi(x)+e);es.push(e)}
  return{xs:xs,ts:ts,es:es,N:N,sigma:sigma,seed:seed}}

/* polynomial: y(x,w)=Σ w_j x^j , phi(x)=(x^0,…,x^M)^T */
const phi=(x,M)=>{const v=new Array(M+1);let p=1;for(let j=0;j<=M;j++){v[j]=p;p*=x}return v};
const polyval=(w,x)=>{let s=0;for(let j=w.length-1;j>=0;j--)s=s*x+w[j];return s};
function solve(A,b){const n=b.length,M=A.map((r,i)=>r.concat([b[i]]));
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
    const t=M[c];M[c]=M[p];M[p]=t;const pv=M[c][c];if(Math.abs(pv)<1e-14)continue;
    for(let r=0;r<n;r++){if(r===c)continue;const f=M[r][c]/pv;
      for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k]}}
  return M.map((r,i)=>Math.abs(r[i])<1e-14?0:r[n]/r[i])}
/* (Phi^T Phi + lambda I) w = Phi^T t  ->  w* (least squares when lambda = 0) */
function fit(xs,ts,M,lam){lam=lam||0;const d=M+1,A=[],b=new Array(d).fill(0);
  for(let i=0;i<d;i++)A.push(new Array(d).fill(0));
  for(let n=0;n<xs.length;n++){const p=phi(xs[n],M);
    for(let i=0;i<d;i++){b[i]+=p[i]*ts[n];for(let j=0;j<d;j++)A[i][j]+=p[i]*p[j]}}
  for(let i=0;i<d;i++)A[i][i]+=lam;return solve(A,b)}
const sse=(xs,ts,w)=>{let s=0;for(let n=0;n<xs.length;n++){const d=polyval(w,xs[n])-ts[n];s+=d*d}return .5*s};
const erms=(xs,ts,w)=>Math.sqrt(2*sse(xs,ts,w)/xs.length);

/* ===================== plotting ===================== */
class Plot{
  constructor(host,o){this.o=Object.assign({xlim:[-.04,1.04],ylim:[-1.65,1.65],xl:'x',yl:'t',
    xt:[0,1],yt:[-1,0,1],h:330,pad:[16,18,28,34]},o||{});
    this.c=el('canvas');host.appendChild(this.c);this.ctx=this.c.getContext('2d');
    this.render=null;this.hover=null;this.hoverFmt=null;this.onClick=null;
    const move=e=>{const r=this.c.getBoundingClientRect();
      const px=(e.touches?e.touches[0].clientX:e.clientX)-r.left,py=(e.touches?e.touches[0].clientY:e.clientY)-r.top;
      this.hover=(px>=this.pad[3]&&px<=this.w-this.pad[1])?{px:px,py:py,x:this.ix(px),y:this.iy(py)}:null;this.draw()};
    this.c.addEventListener('mousemove',move);this.c.addEventListener('touchmove',e=>{move(e);e.preventDefault()},{passive:false});
    this.c.addEventListener('mouseleave',()=>{this.hover=null;this.draw()});
    this.c.addEventListener('click',e=>{if(!this.onClick)return;const r=this.c.getBoundingClientRect();
      this.onClick(this.ix(e.clientX-r.left),this.iy(e.clientY-r.top))});
    this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(host);this.resize()}
  resize(){const dpr=window.devicePixelRatio||1,w=this.c.parentElement.clientWidth||600,h=this.o.h;
    if(!w)return;this.w=w;this.h=h;this.c.width=Math.round(w*dpr);this.c.height=Math.round(h*dpr);
    this.c.style.height=h+'px';this.ctx.setTransform(dpr,0,0,dpr,0,0);this.pad=this.o.pad.slice();this.draw()}
  X(x){const[a,b]=this.o.xlim;return this.pad[3]+(x-a)/(b-a)*(this.w-this.pad[1]-this.pad[3])}
  Y(y){const[a,b]=this.o.ylim;return this.h-this.pad[2]-(y-a)/(b-a)*(this.h-this.pad[0]-this.pad[2])}
  ix(px){const[a,b]=this.o.xlim;return a+(px-this.pad[3])/(this.w-this.pad[1]-this.pad[3])*(b-a)}
  iy(py){const[a,b]=this.o.ylim;return a+(this.h-this.pad[2]-py)/(this.h-this.pad[0]-this.pad[2])*(b-a)}
  draw(){if(!this.ctx||!this.w)return;const g=this.ctx;g.clearRect(0,0,this.w,this.h);
    this.col={line:cssv('--line'),line2:cssv('--line-2'),muted:cssv('--muted'),ink:cssv('--ink'),ink2:cssv('--ink-2'),
      surface:cssv('--surface'),sunken:cssv('--sunken'),truth:cssv('--truth'),fit:cssv('--fit'),obs:cssv('--obs'),
      acc:cssv('--accent'),accf:cssv('--accent-fill'),
      ramp:[cssv('--r0'),cssv('--r1'),cssv('--r2'),cssv('--r3'),cssv('--r4'),cssv('--r5')]};
    this.axes();if(this.render)this.render(this);if(this.hover&&this.hoverFmt)this.tip()}
  axes(){const g=this.ctx,c=this.col,o=this.o;g.save();g.lineWidth=1;g.strokeStyle=c.line;g.font='11px "IBM Plex Mono",monospace';
    g.fillStyle=c.muted;g.textAlign='center';g.textBaseline='top';
    o.xt.forEach(v=>{const X=this.X(v);g.beginPath();g.moveTo(X,this.Y(o.ylim[0]));g.lineTo(X,this.Y(o.ylim[1]));g.stroke();
      g.fillText(String(v),X,this.h-this.pad[2]+7)});
    g.textAlign='right';g.textBaseline='middle';
    o.yt.forEach(v=>{const Y=this.Y(v);g.beginPath();g.moveTo(this.X(o.xlim[0]),Y);g.lineTo(this.X(o.xlim[1]),Y);
      g.strokeStyle=v===0?c.line2:c.line;g.stroke();g.fillText(String(v),this.pad[3]-7,Y)});
    g.fillStyle=c.ink2;g.font='italic 12px "IBM Plex Mono",monospace';g.textAlign='right';g.textBaseline='bottom';
    g.fillText(o.xl,this.w-this.pad[1],this.h-this.pad[2]+18);
    g.textAlign='left';g.textBaseline='top';g.fillText(o.yl,4,this.pad[0]-8);g.restore()}
  path(f,color,w,dash){const g=this.ctx;g.save();g.strokeStyle=color;g.lineWidth=w||2;g.lineJoin='round';
    if(dash)g.setLineDash(dash);g.beginPath();const n=240,[a,b]=this.o.xlim;
    for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x),Y=this.Y(clamp(y,this.o.ylim[0]-2,this.o.ylim[1]+2));
      i?g.lineTo(this.X(x),Y):g.moveTo(this.X(x),Y)}g.stroke();g.restore()}
  line(pts,color,w,dash){const g=this.ctx;g.save();g.strokeStyle=color;g.lineWidth=w||2;g.lineJoin='round';
    if(dash)g.setLineDash(dash);g.beginPath();
    pts.forEach((p,i)=>{const X=this.X(p[0]),Y=this.Y(clamp(p[1],this.o.ylim[0]-2,this.o.ylim[1]+2));
      i?g.lineTo(X,Y):g.moveTo(X,Y)});g.stroke();g.restore()}
  heat(V,NX,NY,mn,mx){const g=this.ctx,c=this.col,x0=this.o.xlim[0],x1=this.o.xlim[1],
    y0=this.o.ylim[0],y1=this.o.ylim[1],cw=(this.X(x1)-this.X(x0))/NX,ch=(this.Y(y0)-this.Y(y1))/NY;
    for(let i=0;i<NX;i++)for(let j=0;j<NY;j++){const t=(V[i][j]-mn)/((mx-mn)||1);
      g.fillStyle=c.ramp[clamp(Math.floor(t*6),0,5)];
      g.fillRect(this.X(x0)+i*cw-.5,this.Y(y1)+(NY-1-j)*ch-.5,cw+1,ch+1)}}
  band(lo,hi,color,alpha){const g=this.ctx;g.save();g.globalAlpha=alpha==null?.16:alpha;g.fillStyle=color;g.beginPath();
    const n=160,[a,b]=this.o.xlim;
    for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;const Y=this.Y(clamp(hi(x),this.o.ylim[0]-2,this.o.ylim[1]+2));i?g.lineTo(this.X(x),Y):g.moveTo(this.X(x),Y)}
    for(let i=n;i>=0;i--){const x=a+(b-a)*i/n;g.lineTo(this.X(x),this.Y(clamp(lo(x),this.o.ylim[0]-2,this.o.ylim[1]+2)))}
    g.closePath();g.fill();g.restore()}
  dots(xs,ys,color,r){const g=this.ctx;g.save();g.lineWidth=2;g.strokeStyle=color;g.fillStyle=this.col.surface;
    for(let i=0;i<xs.length;i++){g.beginPath();g.arc(this.X(xs[i]),this.Y(ys[i]),r||4.2,0,7);g.fill();g.stroke()}g.restore()}
  seg(x,y0,y1,color,w,dash){const g=this.ctx;g.save();g.strokeStyle=color;g.lineWidth=w||2;if(dash)g.setLineDash(dash);
    g.beginPath();g.moveTo(this.X(x),this.Y(y0));g.lineTo(this.X(x),this.Y(y1));g.stroke();g.restore()}
  mark(x,y,color,r){const g=this.ctx;g.save();g.fillStyle=color;g.strokeStyle=this.col.surface;g.lineWidth=2;
    g.beginPath();g.arc(this.X(x),this.Y(y),r||5,0,7);g.fill();g.stroke();g.restore()}
  label(x,y,s,color,align,dy){const g=this.ctx;g.save();g.fillStyle=color;g.font='11.5px "IBM Plex Mono",monospace';
    g.textAlign=align||'left';g.textBaseline='middle';g.fillText(s,this.X(x),this.Y(y)+(dy||0));g.restore()}
  tip(){const g=this.ctx,rows=this.hoverFmt(this.hover.x,this.hover.y);if(!rows||!rows.length)return;
    g.save();g.setLineDash([3,3]);g.strokeStyle=this.col.line2;g.lineWidth=1;g.beginPath();
    g.moveTo(this.hover.px,this.pad[0]);g.lineTo(this.hover.px,this.h-this.pad[2]);g.stroke();g.setLineDash([]);
    g.font='11.5px "IBM Plex Mono",monospace';const wdt=Math.max.apply(null,rows.map(r=>g.measureText(r.t).width))+16;
    const hgt=rows.length*15+10;let bx=this.hover.px+10,by=this.pad[0]+4;
    if(bx+wdt>this.w-this.pad[1])bx=this.hover.px-wdt-10;
    g.fillStyle=this.col.surface;g.strokeStyle=this.col.line2;g.lineWidth=1;
    g.beginPath();g.roundRect(bx,by,wdt,hgt,6);g.fill();g.stroke();
    g.textAlign='left';g.textBaseline='top';
    rows.forEach((r,i)=>{g.fillStyle=r.c||this.col.ink2;g.fillText(r.t,bx+8,by+6+i*15)});g.restore()}
}

/* ===================== UI parts ===================== */
function board(root,panelTitle){const b=el('div','board'),lc=el('div','col'),pc=el('div','card plotcard'),pn=el('div','card panel');
  if(panelTitle)pn.appendChild(el('h3',null,panelTitle));lc.appendChild(pc);b.append(lc,pn);root.appendChild(b);return{pc:pc,pn:pn,lc:lc}}
function legend(host,items){const L=el('div','legend');items.forEach(it=>{const s=el('span');
  const i=el('i',it.t==='dot'?'dot':null);
  if(it.t==='dot'){i.style.borderColor=it.c;i.style.borderTopColor=it.c}
  else{i.style.borderTopColor=it.c;if(it.t==='dash')i.style.borderTopStyle='dashed'}
  s.append(i,document.createTextNode(it.l));L.appendChild(s)});host.appendChild(L);return L}
function slider(host,o){const c=el('div','ctrl'),top=el('div','top'),lab=el('span','lab',o.label),val=el('span','val');
  const inp=el('input');inp.type='range';inp.min=o.min;inp.max=o.max;inp.step=o.step;inp.value=o.value;
  if(o.id)inp.id=o.id;top.append(lab,val);c.append(top,inp);host.appendChild(c);
  const show=()=>{val.textContent=(o.fmt?o.fmt(+inp.value):inp.value)};show();
  inp.addEventListener('input',()=>{show();o.on(+inp.value)});
  return{inp:inp,set:v=>{inp.value=v;show()},get:()=>+inp.value,setRange:(mn,mx,st)=>{inp.min=mn;inp.max=mx;if(st)inp.step=st;show()},label:lab}}
function toggle(host,label,checked,on){const l=el('label','tg'),i=el('input');i.type='checkbox';i.checked=checked;
  l.append(i,el('span',null,label));host.appendChild(l);i.addEventListener('change',()=>on(i.checked));return i}
function btnrow(host,btns){const r=el('div','btnrow');btns.forEach(b=>{const t=el('button','act',b.l);t.type='button';
  t.addEventListener('click',()=>b.on(t));r.appendChild(t)});host.appendChild(r);return r}
function readout(host,keys){const r=el('div','readout'),vs={};keys.forEach(k=>{r.append(el('span','k',k.l),
  vs[k.k]=el('span','v'+(k.big?' big':'')));});host.appendChild(r);
  return o=>{for(const k in o)if(vs[k])vs[k].textContent=o[k]}}
function eqbar(host,cap,body){const e=el('div','eqbar');e.append(el('div','cap',cap),el('div','eq',body));
  host.appendChild(e);tex(e);return e}
function note(host,items,title){const n=el('div','note');n.appendChild(el('b',null,title||'What to look for'));
  const u=el('ul');items.forEach(t=>u.appendChild(el('li',null,t)));n.appendChild(u);host.appendChild(n);tex(n);return n}
const SUB='₀₁₂₃₄₅₆₇₈₉';const sub=j=>String(j).split('').map(d=>SUB[+d]).join('');

/* ---- linear algebra and Bayesian pieces shared by the later slides ---- */
const zeros=(n,m)=>{const A=[];for(let i=0;i<n;i++)A.push(new Array(m).fill(0));return A};
const dot=(a,b)=>{let s=0;for(let i=0;i<a.length;i++)s+=a[i]*b[i];return s};
const matVec=(A,x)=>A.map(r=>dot(r,x));
/* quadratic form a^T A a */
const quad=(a,A)=>{let s=0;for(let i=0;i<a.length;i++)for(let j=0;j<a.length;j++)s+=a[i]*A[i][j]*a[j];return s};
function inv(A){const n=A.length,M=A.map((r,i)=>r.concat(Array.from({length:n},(_,j)=>i===j?1:0)));
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
    const t=M[c];M[c]=M[p];M[p]=t;const pv=M[c][c]||1e-300;
    for(let k=c;k<2*n;k++)M[c][k]/=pv;
    for(let r=0;r<n;r++){if(r===c)continue;const f=M[r][c];if(!f)continue;
      for(let k=c;k<2*n;k++)M[r][k]-=f*M[c][k]}}
  return M.map(r=>r.slice(n))}
/* lower triangular Cholesky factor, used to draw samples of w */
function chol(A){const n=A.length,L=zeros(n,n);
  for(let i=0;i<n;i++)for(let j=0;j<=i;j++){let s=A[i][j];
    for(let k=0;k<j;k++)s-=L[i][k]*L[j][k];
    if(i===j)L[i][j]=Math.sqrt(Math.max(s,1e-14));else L[i][j]=s/(L[j][j]||1e-300)}
  return L}
/* posterior over w: S^-1 = alpha I + beta sum phi phi^T ,  S^-1 m_N = beta sum phi t_n */
function posterior(xs,ts,M,alpha,beta){const d=M+1,Sinv=zeros(d,d),b=new Array(d).fill(0);
  for(let n=0;n<xs.length;n++){const p=phi(xs[n],M);
    for(let i=0;i<d;i++){b[i]+=beta*p[i]*ts[n];for(let j=0;j<d;j++)Sinv[i][j]+=beta*p[i]*p[j]}}
  for(let i=0;i<d;i++)Sinv[i][i]+=alpha;
  const S=inv(Sinv);return{Sinv:Sinv,S:S,b:b,m:matVec(S,b),d:d}}
/* predictive distribution: m(x) = phi(x)^T m_N , s^2(x) = beta^-1 + phi(x)^T S phi(x) */
function predict(x,M,post,beta){const p=phi(x,M);
  return{mean:dot(p,post.m),var:1/beta+quad(p,post.S)}}
function sampleW(post,r){const L=chol(post.S),d=post.d,z=[],w=[];
  for(let i=0;i<d;i++)z.push(gauss(r));
  for(let i=0;i<d;i++){let s=post.m[i];for(let k=0;k<=i;k++)s+=L[i][k]*z[k];w.push(s)}
  return w}
const gaussPdf=(x,mu,sd)=>Math.exp(-.5*Math.pow((x-mu)/sd,2))/(sd*Math.sqrt(2*Math.PI));
const logGaussPdf=(x,mu,sd)=>-.5*Math.pow((x-mu)/sd,2)-Math.log(sd)-.5*Math.log(2*Math.PI);

/* ---- coefficient sliders shared by the polynomial modules ---- */
const NICE=[1,2,3,5,10,20,50,100,300,1000,1e4,1e5,1e6];
const niceRange=m=>{for(let i=0;i<NICE.length;i++)if(m<=NICE[i]*.98)return NICE[i];return Math.ceil(m)};
function wPanel(host,st,redraw){
  const box=el('div');box.style.cssText='display:flex;flex-direction:column;gap:9px';host.appendChild(box);
  const api={s:[],
    rebuild(){box.innerHTML='';api.s=[];st.w.forEach((v,j)=>{
      api.s[j]=slider(box,{label:'\\(w_{'+j+'}\\)',min:-st.rng,max:st.rng,step:st.rng/500,value:v,
        fmt:x=>fmt(x,st.rng>=20?1:2),on:x=>{st.w[j]=x;redraw()}})});tex(box)},
    sync(){if(api.s.length!==st.w.length)return api.rebuild();
      st.w.forEach((v,j)=>{api.s[j].setRange(-st.rng,st.rng,st.rng/500);api.s[j].set(v)})}};
  api.rebuild();return api}
function applyFit(st,api,lam){const w=fit(st.d.xs,st.d.ts,st.w.length-1,lam||0);
  st.rng=Math.max(st.rngMin||0,niceRange(Math.max.apply(null,w.map(Math.abs))||1));st.w=w.slice();api.sync()}

/* coefficient chips: w0 = .. , w1 = .. */
function wchips(host,label){const box=el('div','mat');if(label)box.appendChild(el('div','cap',label));
  const d=el('div','wmat');box.appendChild(d);host.appendChild(box);tex(box);
  return function(ww,prec){d.innerHTML='';ww.forEach((v,j)=>
    d.appendChild(el('span',null,'w'+sub(j)+' = '+fmt(v,prec==null?2:prec))))}}

/* ---- matrix view: a grid of numbers shaded by magnitude ---- */
function matview(host,o){const box=el('div','mat');if(o.cap)box.appendChild(el('div','cap',o.cap));
  const g=el('div','grid');g.style.gridTemplateColumns='repeat('+(o.cols+(o.rowLab?1:0))+',minmax(0,1fr))';
  box.appendChild(g);host.appendChild(box);tex(box);
  return function(get){g.innerHTML='';let mx=1e-12;
    for(let i=0;i<o.rows;i++)for(let j=0;j<o.cols;j++)mx=Math.max(mx,Math.abs(get(i,j)));
    for(let i=0;i<o.rows;i++){
      if(o.rowLab)g.appendChild(el('span','cell lab',o.rowLab(i)));
      for(let j=0;j<o.cols;j++){const v=get(i,j),c=el('span','cell',fmt(v,o.digits==null?2:o.digits));
        const t=Math.min(1,Math.abs(v)/mx);c.style.background='rgba(99,102,241,'+(.06+.5*t).toFixed(3)+')';
        if(t>.55)c.style.color='#fff';g.appendChild(c)}}}}

export{el,cssv,setRoot,clamp,fmt,tex,ensureMathJax,rng,gauss,sin2pi,makeData,phi,polyval,solve,fit,sse,erms,Plot,board,legend,slider,toggle,btnrow,readout,eqbar,note,sub,
  zeros,dot,matVec,quad,inv,chol,posterior,predict,sampleW,gaussPdf,logGaussPdf,matview,wchips,niceRange,wPanel,applyFit};
