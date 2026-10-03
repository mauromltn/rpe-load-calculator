'use client'

import { useMemo, useState } from 'react'
import { estimatedOneRepMax, formatPercent, isValidInput, percentage, QUICK_PERCENTAGES, roundToIncrement, RPE_VALUES, targetWeight } from '@/lib/rpe'

const mono = 'font-mono tabular-nums'

function Field({ label, value, onChange, min, max, step = 1, suffix, help }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number; suffix?: string; help?: string }) {
  return <label className="field"><span className="field-label">{label}</span><span className="field-control"><input aria-label={label} type="number" inputMode="decimal" value={value} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} className={mono} />{suffix && <span className="suffix">{suffix}</span>}</span>{help && <span className="field-help">{help}</span>}</label>
}

function PanelHeader({ title, eyebrow }: { title: string; eyebrow: string }) {
  return <div className="panel-header"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div><span className="panel-mark" aria-hidden="true">↗</span></div>
}

export function RpeCalculator() {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [haveWeight, setHaveWeight] = useState(100)
  const [haveReps, setHaveReps] = useState(5)
  const [haveRpe, setHaveRpe] = useState(8)
  const [wantReps, setWantReps] = useState(3)
  const [wantRpe, setWantRpe] = useState(9)
  const [trainingMax, setTrainingMax] = useState(100)
  const [trainingPercentage, setTrainingPercentage] = useState(70)

  const oneRepMax = useMemo(() => estimatedOneRepMax(haveWeight, haveReps, haveRpe), [haveWeight, haveReps, haveRpe])
  const haveValid = isValidInput(haveWeight, haveReps, haveRpe)
  const wantValid = wantReps > 0 && Number.isInteger(wantReps) && wantRpe > 0 && percentage(wantReps, wantRpe) > 0
  const wantWeight = wantValid && oneRepMax > 0 ? targetWeight(oneRepMax, wantReps, wantRpe) : 0
  const increment = unit === 'kg' ? 2.5 : 5
  const setWeight = trainingMax > 0 && trainingPercentage > 0 ? trainingMax * trainingPercentage / 100 : 0

  const setUseOneRepMax = () => { if (haveValid) setTrainingMax(Number(oneRepMax.toFixed(1))) }
  const setQuickPercentage = (value: number) => setTrainingPercentage(value)

  return <main className="calculator-shell">
    <header className="hero">
      <div className="kicker"><span>Barbell Mathematics</span><i /> <span>Autoregulation</span></div>
      <div className="hero-rule" />
      <h1>RPE Load<br /><em>Calculator</em></h1>
      <p className="tagline">Translate effort into numbers you can load on the bar.</p>
      <div className="unit-toggle" role="group" aria-label="Weight unit"><button className={unit === 'kg' ? 'active' : ''} onClick={() => setUnit('kg')}>KG</button><button className={unit === 'lb' ? 'active' : ''} onClick={() => setUnit('lb')}>LB</button></div>
    </header>

    <section className="tool-grid" aria-label="Load calculators">
      <article className="panel"><PanelHeader eyebrow="01 / Known load" title="Have → Est. 1RM" /><div className="fields"><Field label="Weight" value={haveWeight} onChange={setHaveWeight} min={0} step={unit === 'kg' ? 0.5 : 1} suffix={unit} /><Field label="Reps" value={haveReps} onChange={setHaveReps} min={1} step={1} /><Field label="RPE" value={haveRpe} onChange={setHaveRpe} min={4} max={10} step={0.5} /></div><div className="result"><span>Estimated 1RM</span><strong className={mono}>{haveValid ? oneRepMax.toFixed(1) : '—'} <small>{unit}</small></strong>{haveValid && <p>{haveReps}× @ {haveRpe} sits at {formatPercent(percentage(haveReps, haveRpe))} of 1RM.</p>}</div></article>
      <article className="panel"><PanelHeader eyebrow="02 / Desired effort" title="Want → Target Weight" /><div className="fields"><Field label="Reps" value={wantReps} onChange={setWantReps} min={1} step={1} /><Field label="RPE" value={wantRpe} onChange={setWantRpe} min={4} max={10} step={0.5} /></div><div className="result target"><span>Target weight</span><strong className={mono}>{wantValid && oneRepMax > 0 ? wantWeight.toFixed(1) : '—'} <small>{unit}</small></strong>{wantValid && <p>{wantReps}× @ {wantRpe} equals {formatPercent(percentage(wantReps, wantRpe))} of 1RM.</p>}</div></article>
    </section>

    <section className="reference-section"><div className="section-heading"><div><div className="eyebrow">03 / The map</div><h2>{haveValid ? 'Working Loads' : '% of 1RM Reference'}</h2></div><p>Continuous translation<br />of Tuchscherer&apos;s chart</p></div><div className="table-wrap"><table><caption className="sr-only">RPE reference table for reps one through ten</caption><thead><tr><th>REPS / RPE</th>{RPE_VALUES.map((rpe) => <th key={rpe} className={wantRpe === rpe ? 'highlight-axis' : ''}>{rpe}</th>)}</tr></thead><tbody>{Array.from({ length: 10 }, (_, i) => i + 1).map((reps) => <tr key={reps}><th className={wantReps === reps ? 'highlight-axis' : ''}>{reps}</th>{RPE_VALUES.map((rpe) => { const pct = percentage(reps, rpe); const isSelected = wantReps === reps && wantRpe === rpe; return <td key={rpe} className={isSelected ? 'selected-cell' : ''}>{pct > 0 ? haveValid ? roundToIncrement(oneRepMax * pct / 100, increment).toFixed(1) : pct.toFixed(1) : '—'}</td> })}</tr>)}</tbody></table></div><div className="table-note"><span className="legend" />Selected target · rounded to nearest {increment} {unit}</div></section>

    <section className="percent-panel"><PanelHeader eyebrow="04 / Training max" title="Percent of a Training Max" /><div className="percent-layout"><div className="percent-fields"><Field label="Training max" value={trainingMax} onChange={setTrainingMax} min={0} step={unit === 'kg' ? 0.5 : 1} suffix={unit} /><button className="text-button" onClick={setUseOneRepMax} disabled={!haveValid}>Use est. 1RM <span>↗</span></button></div><Field label="Percentage" value={trainingPercentage} onChange={setTrainingPercentage} min={0} max={200} step={0.5} suffix="%" /><div className="set-result"><span>Set weight</span><strong className={mono}>{setWeight > 0 ? roundToIncrement(setWeight, increment).toFixed(1) : '—'} <small>{unit}</small></strong><p>Exact: {setWeight > 0 ? setWeight.toFixed(1) : '—'} {unit}</p></div></div><div className="chips" aria-label="Quick percentages">{QUICK_PERCENTAGES.map((value) => <button key={value} className={trainingPercentage === value ? 'active' : ''} onClick={() => setQuickPercentage(value)}><span>{Math.floor(value)}</span><small>{trainingMax > 0 ? roundToIncrement(trainingMax * value / 100, increment).toFixed(1) : '—'}</small></button>)}</div><div className="chip-caption"><span>Training percentages</span><span>Opener · 2nd · 3rd</span></div></section>

    <footer><span>Calculation preserved from the OpenPowerlifting RPE Load Calculator.</span><a href="https://www.plsource.org/" target="_blank" rel="noreferrer">plsource.org ↗</a></footer>
  </main>
}
