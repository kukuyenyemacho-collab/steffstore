'use client';

import { useState } from 'react';
import { installment, money } from '@/lib/format';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from './Icon';

export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'select' | 'textarea';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  half?: boolean;
}

/** A form that turns its answers into a pre-filled WhatsApp message — works with no backend. */
export function WhatsAppForm({ title, intro, fields, submit, lead }: { title: string; intro?: string; fields: FieldDef[]; submit: string; lead: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [missing, setMissing] = useState<string[]>([]);

  const rows: FieldDef[][] = [];
  fields.forEach((f) => {
    const last = rows[rows.length - 1];
    if (f.half && last && last.length === 1 && last[0].half) last.push(f);
    else rows.push([f]);
  });

  const input = (f: FieldDef) => {
    const common = {
      id: `f-${f.name}`,
      name: f.name,
      value: values[f.name] ?? '',
      'aria-invalid': missing.includes(f.name),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setValues((v) => ({ ...v, [f.name]: e.target.value }));
        setMissing((m) => m.filter((x) => x !== f.name));
      },
    };
    return (
      <div className="field" key={f.name}>
        <label htmlFor={common.id}>
          {f.label} {!f.required && <span className="opt-l">(optional)</span>}
        </label>
        {f.type === 'select' ? (
          <select {...common}>
            <option value="">Choose…</option>
            {f.options?.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : f.type === 'textarea' ? (
          <textarea {...common} rows={4} placeholder={f.placeholder} />
        ) : (
          <input {...common} type={f.type ?? 'text'} placeholder={f.placeholder} inputMode={f.type === 'tel' ? 'tel' : undefined} />
        )}
        {missing.includes(f.name) && <span className="err">Required</span>}
      </div>
    );
  };

  return (
    <form
      className="form-card"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const miss = fields.filter((f) => f.required && !(values[f.name] ?? '').trim()).map((f) => f.name);
        setMissing(miss);
        if (miss.length) return;
        const body = fields
          .filter((f) => (values[f.name] ?? '').trim())
          .map((f) => `${f.label}: ${values[f.name].trim()}`)
          .join('\n');
        window.open(waLink(`${lead}\n${body}`), '_blank', 'noopener');
      }}
    >
      <h2>{title}</h2>
      {intro && (
        <p className="muted" style={{ margin: 0 }}>
          {intro}
        </p>
      )}
      {rows.map((r, i) =>
        r.length === 2 ? (
          <div className="row2" key={i}>
            {r.map(input)}
          </div>
        ) : (
          input(r[0])
        ),
      )}
      <button className="btn btn-wa btn-lg" type="submit">
        <WhatsAppIcon /> {submit}
      </button>
    </form>
  );
}

export function LipaCalculator() {
  const [price, setPrice] = useState(55000);
  const [months, setMonths] = useState(6);
  const plan = installment(price, months);
  return (
    <div className="calc">
      <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Estimate your plan</h2>
      <div className="field">
        <label htmlFor="lipa-price">Device price: {money(price)}</label>
        <input
          id="lipa-price"
          className="range"
          type="range"
          min={10000}
          max={300000}
          step={1000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <div className="field">
        <span style={{ fontSize: '.86rem', fontWeight: 600 }}>Pay over</span>
        <div className="opts" role="group" aria-label="Months">
          {[3, 6, 9, 12].map((m) => (
            <button key={m} type="button" className="opt" aria-pressed={m === months} onClick={() => setMonths(m)}>
              {m} months
            </button>
          ))}
        </div>
      </div>
      <dl className="calc-out">
        <div>
          <dt>Deposit today (30%)</dt>
          <dd>{money(plan.deposit)}</dd>
        </div>
        <div>
          <dt>Monthly</dt>
          <dd>{money(plan.monthly)}</dd>
        </div>
        <div>
          <dt>Months</dt>
          <dd>{months}</dd>
        </div>
      </dl>
      <p className="muted" style={{ margin: 0, fontSize: '.82rem' }}>
        Indicative only, before any financing fees. Your final deposit, monthly amount and total cost are confirmed in writing by our financing
        partner after approval — you see the full cost before you commit.
      </p>
    </div>
  );
}
