'use client'

import { useMemo, useState } from 'react'
import { estimatedOneRepMax, formatPercent, isValidInput, percentage, QUICK_PERCENTAGES, roundToIncrement, RPE_VALUES, targetWeight } from '@/lib/rpe'

const mono = 'font-mono tabular-nums'

function ArrowUpRight() {
  return <svg className="arrow-icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2 10 10 2M4 2h6v6" /></svg>
}

function SettingsIcon() {
  return <svg className="settings-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6.7 1.6h2.6l.4 1.7a5.4 5.4 0 0 1 1.2.7l1.7-.7 1.3 2.2-1.3 1.2c.1.4.1.8.1 1.3s0 .9-.1 1.3l1.3 1.2-1.3 2.2-1.7-.7a5.4 5.4 0 0 1-1.2.7l-.4 1.7H6.7l-.4-1.7a5.4 5.4 0 0 1-1.2-.7l-1.7.7-1.3-2.2 1.3-1.2a5.5 5.5 0 0 1-.1-1.3c0-.5 0-.9.1-1.3L2.1 5.5l1.3-2.2 1.7.7a5.4 5.4 0 0 1 1.2-.7l.4-1.7Z" /><circle cx="8" cy="8" r="2.1" /></svg>
}

function SettingsPanel({ language, setLanguage, unit, setUnit }: { language: 'rpe' | 'rir'; setLanguage: (language: 'rpe' | 'rir') => void; unit: 'kg' | 'lb'; setUnit: (unit: 'kg' | 'lb') => void }) {
  return <aside className="settings-panel" aria-label="Calculator settings"><div className="settings-title"><span className="eyebrow">Preferences</span><strong>Settings</strong></div><div className="settings-option"><span>Effort language</span><div className="settings-toggle" role="group" aria-label="Effort language"><button className={language === 'rpe' ? 'active' : ''} onClick={() => setLanguage('rpe')}>RPE</button><button className={language === 'rir' ? 'active' : ''} onClick={() => setLanguage('rir')}>RIR</button></div></div><div className="settings-option"><span>Weight unit</span><div className="settings-toggle" role="group" aria-label="Weight unit"><button className={unit === 'kg' ? 'active' : ''} onClick={() => setUnit('kg')}>KG</button><button className={unit === 'lb' ? 'active' : ''} onClick={() => setUnit('lb')}>LB</button></div></div><div className="settings-legend"><span className="eyebrow">Legend</span><p><strong>RPE</strong> — Rate of Perceived Exertion</p><p><strong>RIR</strong> — Reps In Reserve</p><p><strong>1RM</strong> — One Rep Max</p></div></aside>
}

function Field({ label, value, onChange, min, max, step = 1, suffix, help }: { label: string; value: number | ''; onChange: (value: number | '') => void; min?: number; max?: number; step?: number; suffix?: string; help?: string }) {
  return <label className="field"><span className="field-label">{label}</span><span className="field-control"><input aria-label={label} type="number" inputMode="decimal" value={value} min={min} max={max} step={step} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} className={mono} />{suffix && <span className="suffix">{suffix}</span>}</span>{help && <span className="field-help">{help}</span>}</label>
}

function PanelHeader({ title, eyebrow }: { title: string; eyebrow: string }) {
  return <div className="panel-header"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div><span className="panel-mark"><ArrowUpRight /></span></div>
}

export function RpeCalculator() {
  const [unit, setUnitState] = useState<'kg' | 'lb'>('kg')
  const [language, setLanguage] = useState<'rpe' | 'rir'>('rpe')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [haveWeight, setHaveWeight] = useState<number | ''>('')
  const [haveReps, setHaveReps] = useState<number | ''>('')
  const [haveRpe, setHaveRpe] = useState<number | ''>('')
  const [wantReps, setWantReps] = useState<number | ''>('')
  const [wantRpe, setWantRpe] = useState<number | ''>('')
  const [trainingMax, setTrainingMax] = useState<number | ''>('')
  const [trainingPercentage, setTrainingPercentage] = useState<number | ''>('')

  const effortToRpe = (value: number) => language === 'rir' ? 10 - value : value
  const setUnit = (nextUnit: 'kg' | 'lb') => {
    if (nextUnit === unit) return
    const convert = (value: number | '') => value === '' ? '' : Number((nextUnit === 'lb' ? value * 2.20462 : value / 2.20462).toFixed(1))
    setHaveWeight(convert(haveWeight)); setTrainingMax(convert(trainingMax)); setUnitState(nextUnit)
  }
  const oneRepMax = useMemo(() => estimatedOneRepMax(Number(haveWeight), Number(haveReps), effortToRpe(Number(haveRpe))), [haveWeight, haveReps, haveRpe, language])
  const haveValid = haveWeight !== '' && haveReps !== '' && haveRpe !== '' && isValidInput(haveWeight, haveReps, effortToRpe(haveRpe))
  const wantValid = wantReps !== '' && wantRpe !== '' && wantReps > 0 && Number.isInteger(wantReps) && wantRpe > 0 && percentage(wantReps, effortToRpe(wantRpe)) > 0
  const wantWeight = wantValid && oneRepMax > 0 ? targetWeight(oneRepMax, Number(wantReps), effortToRpe(Number(wantRpe))) : 0
  const increment = unit === 'kg' ? 2.5 : 5
  const setWeight = Number(trainingMax) > 0 && Number(trainingPercentage) > 0 ? Number(trainingMax) * Number(trainingPercentage) / 100 : 0

  const setUseOneRepMax = () => { if (haveValid) setTrainingMax(Number(oneRepMax.toFixed(1))) }
  const setQuickPercentage = (value: number) => setTrainingPercentage(value)

  return <main className="calculator-shell">
    <header className="hero">
      <div className="kicker"><span>Barbell Mathematics</span><i /> <span>Autoregulation</span></div>
      <div className="hero-rule" />
      <h1>RPE Load<br /><em>Calculator</em></h1>
      <p className="tagline">Translate effort into numbers you can load on the bar.</p>
      <button className="settings-button" aria-expanded={settingsOpen} aria-controls="calculator-settings" onClick={() => setSettingsOpen(!settingsOpen)}><SettingsIcon /> Settings</button>
      {settingsOpen && <div id="calculator-settings"><SettingsPanel language={language} setLanguage={setLanguage} unit={unit} setUnit={setUnit} /></div>}
    </header>

    <section className="tool-grid" aria-label="Load calculators">
      <article className="panel"><PanelHeader eyebrow="01 / Known load" title="Have → Est. 1RM" /><div className="fields"><Field label="Weight" value={haveWeight} onChange={setHaveWeight} min={0} step={unit === 'kg' ? 0.5 : 1} suffix={unit} /><Field label="Reps" value={haveReps} onChange={setHaveReps} min={1} step={1} /><Field label={language === 'rpe' ? 'RPE' : 'RIR'} value={haveRpe} onChange={setHaveRpe} min={0} max={language === 'rpe' ? 10 : 6} step={0.5} /></div><div className="result"><span>Estimated 1RM</span><strong className={mono}>{haveValid ? oneRepMax.toFixed(1) : '—'} <small>{unit}</small></strong>{haveValid && <p>{haveReps}× @ {haveRpe} sits at {formatPercent(percentage(haveReps, haveRpe))} of 1RM.</p>}</div></article>
      <article className="panel"><PanelHeader eyebrow="02 / Desired effort" title="Want → Target Weight" /><div className="fields"><Field label="Reps" value={wantReps} onChange={setWantReps} min={1} step={1} /><Field label={language === 'rpe' ? 'RPE' : 'RIR'} value={wantRpe} onChange={setWantRpe} min={0} max={language === 'rpe' ? 10 : 6} step={0.5} /></div><div className="result target"><span>Target weight</span><strong className={mono}>{wantValid && oneRepMax > 0 ? wantWeight.toFixed(1) : '—'} <small>{unit}</small></strong>{wantValid && <p>{wantReps}× @ {wantRpe} equals {formatPercent(percentage(wantReps, wantRpe))} of 1RM.</p>}</div></article>
    </section>

    <section className="percent-panel"><PanelHeader eyebrow="03 / Training max" title="Percent of a Training Max" /><div className="percent-layout"><div className="percent-fields"><Field label="Training max" value={trainingMax} onChange={setTrainingMax} min={0} step={unit === 'kg' ? 0.5 : 1} suffix={unit} /><button className="text-button" onClick={setUseOneRepMax} disabled={!haveValid}>Use est. 1RM <ArrowUpRight /></button></div><Field label="Percentage" value={trainingPercentage} onChange={setTrainingPercentage} min={0} max={200} step={0.5} suffix="%" /><div className="set-result"><span>Set weight</span><strong className={mono}>{setWeight > 0 ? roundToIncrement(setWeight, increment).toFixed(1) : '—'} <small>{unit}</small></strong><p>Exact: {setWeight > 0 ? setWeight.toFixed(1) : '—'} {unit}</p></div></div><div className="chips" aria-label="Quick percentages">{QUICK_PERCENTAGES.map((value) => <button key={value} className={trainingPercentage === value ? 'active' : ''} onClick={() => setQuickPercentage(value)}><span>{value.toFixed(1)}</span><small>{Number(trainingMax) > 0 ? roundToIncrement(Number(trainingMax) * value / 100, increment).toFixed(1) : value.toFixed(1)}</small></button>)}</div><div className="chip-caption"><span>Training percentages</span><span>Opener · 2nd · 3rd</span></div></section>

    <section className="reference-section"><div className="section-heading"><div><div className="eyebrow">04 / The map</div><h2>{haveValid ? 'Working Loads' : '% of 1RM Reference'}</h2></div><p>Continuous translation<br />of Tuchscherer&apos;s chart</p></div><div className="table-wrap"><table><caption className="sr-only">RPE reference table for reps one through ten</caption><thead><tr><th>REPS / RPE</th>{RPE_VALUES.map((rpe) => <th key={rpe} className={wantRpe === rpe ? 'highlight-axis' : ''}>{rpe}</th>)}</tr></thead><tbody>{Array.from({ length: 10 }, (_, i) => i + 1).map((reps) => <tr key={reps}><th className={wantReps === reps ? 'highlight-axis' : ''}>{reps}</th>{RPE_VALUES.map((rpe) => { const pct = percentage(reps, rpe); const isSelected = wantReps === reps && wantRpe === rpe; return <td key={rpe} className={isSelected ? 'selected-cell' : ''}>{pct > 0 ? haveValid ? roundToIncrement(oneRepMax * pct / 100, increment).toFixed(1) : pct.toFixed(1) : '—'}</td> })}</tr>)}</tbody></table></div><div className="table-note"><span className="legend" />Selected target · rounded to nearest {increment} {unit}</div></section>

    <footer><span>Math based on OpenPowerlifting&apos;s open-source calculator.</span><a href="https://github.com/mauromltn/rpe-load-calculator" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a></footer>
  </main>
}
