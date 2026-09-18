'use client';

import React, { useMemo, useState } from 'react';

const card='w-full max-w-4xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5 shadow-sm';
const input='w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500';
const money=(n:number)=>`₹${Number.isFinite(n)?n.toLocaleString('en-IN',{maximumFractionDigits:2}):'0'}`;
const n=(v:string)=>{const x=Number(v);return Number.isFinite(x)?x:0};

export default function FinanceEngine({toolSlug,toolName}:{toolSlug:string;toolName:string}){
 const [a,setA]=useState('5000'),[b,setB]=useState('12'),[c,setC]=useState('10'),[d,setD]=useState('1');
 const out=useMemo(()=>{const p=n(a),r=n(b),t=n(c),x=n(d);try{
  if(toolSlug==='sip-calculator'){const i=r/1200,m=Math.max(0,Math.floor(t*12));const fv=i===0?p*m:p*((Math.pow(1+i,m)-1)/i)*(1+i);return [['Invested',money(p*m)],['Estimated returns',money(fv-p*m)],['Future value',money(fv)]];}
  if(toolSlug==='emi-calculator'){const months=Math.max(1,Math.floor(t*12));const rate=r/1200;const emi=rate===0?p/months:p*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1);return [['Monthly EMI',money(emi)],['Total payment',money(emi*months)],['Total interest',money(emi*months-p)]];}
  if(toolSlug==='lumpsum-calculator'){const years=Math.max(0,t);const fv=p*Math.pow(1+r/100,years);return [['Invested',money(p)],['Estimated returns',money(fv-p)],['Future value',money(fv)]];}
  if(toolSlug==='gst-calculator'){const gst=Math.max(0,b)/100;const inclusive=x===1;const base=inclusive?p/(1+gst):p;const tax=base*gst;return [['Base amount',money(base)],['GST',money(tax)],['Total',money(base+tax)]];}
  if(toolSlug==='salary-calculator'){const gross=p;const deductions=Math.max(0,r);return [['Gross monthly',money(gross)],['Deductions',money(deductions)],['Estimated in-hand',money(Math.max(0,gross-deductions))]];}
  if(toolSlug==='fd-calculator'){const years=Math.max(0,t);const fv=p*Math.pow(1+r/400,4*years);return [['Principal',money(p)],['Interest',money(fv-p)],['Maturity',money(fv)]];}
  if(toolSlug==='rd-calculator'){const months=Math.max(0,Math.floor(t*12));const monthly=p;const rate=r/400;let fv=0;for(let k=1;k<=months;k++)fv+=monthly*Math.pow(1+rate,months-k+1);return [['Deposits',money(monthly*months)],['Interest',money(fv-monthly*months)],['Maturity',money(fv)]];}
  if(toolSlug==='retirement-calculator'){const current=p,annualReturn=r/100,years=Math.max(1,t);const future= current*Math.pow(1+annualReturn,years);const inflation=x/100;const futureMonthly=current*Math.pow(1+inflation,years);return [['Current monthly need',money(current)],['Inflation-adjusted monthly need',money(futureMonthly)],['Future value of current savings',money(future)]];}
  return [];
 }catch{return []}},[toolSlug,a,b,c,d]);
 const labels=toolSlug==='gst-calculator'?['Amount','GST rate %','Mode (0=exclusive, 1=inclusive)']:toolSlug==='salary-calculator'?['Gross monthly salary','Deductions','Unused']:toolSlug==='fd-calculator'||toolSlug==='rd-calculator'?['Principal / monthly deposit','Annual interest %','Tenure (years)']:toolSlug==='retirement-calculator'?['Current monthly need','Annual return %','Years','Inflation %']:toolSlug==='emi-calculator'?['Loan amount','Annual interest %','Tenure (years)']:['Investment amount','Annual return %','Years'];
 return <div className={card}><h3 className="text-lg font-bold">{toolName}</h3><div className="grid sm:grid-cols-2 gap-3">{[a,b,c].map((v,i)=><label key={i} className="text-xs font-semibold text-zinc-500">{labels[i]}<input className={input+' mt-1'} type="number" value={v} onChange={e=>[setA,setB,setC][i](e.target.value)}/></label>)}{toolSlug==='retirement-calculator'&&<label className="text-xs font-semibold text-zinc-500">{labels[3]}<input className={input+' mt-1'} type="number" value={d} onChange={e=>setD(e.target.value)}/></label>}</div><div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-5 space-y-3">{out.map(([k,v])=><div key={k} className="flex justify-between gap-4 text-sm"><span className="text-zinc-500">{k}</span><strong>{v}</strong></div>)}</div><p className="text-[11px] text-zinc-400">Estimates only; actual bank, tax, investment, and retirement outcomes can differ.</p></div>;
}
