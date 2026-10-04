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

function CloseIcon() {
  return <svg className="close-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3 3 10 10M13 3 3 13" /></svg>
}

type Locale = 'en' | 'it'
type Theme = 'dark' | 'light'

const copy = {
  en: { preferences: 'Preferences', settings: 'Settings', effort: 'Effort language', weight: 'Weight unit', language: 'Language', theme: 'Theme', dark: 'Dark', light: 'Light', legend: 'Legend', rpe: 'Rate of Perceived Exertion', rir: 'Reps In Reserve', oneRm: 'One Rep Max', known: 'Known load', desired: 'Desired effort', training: 'Training max', weightLabel: 'Weight', reps: 'Reps', estimated: 'Estimated 1RM', target: 'Target weight', percentage: 'Percentage', setWeight: 'Set weight', exact: 'Exact', useEstimate: 'Use est. 1RM', map: 'The map', reference: '% of 1RM Reference', working: 'Working Loads', translate: 'Continuous translation', ofChart: "of Tuchscherer's chart", barbell: 'Barbell Mathematics', autoregulation: 'Autoregulation', tagline: 'Translate effort into numbers you can load on the bar.', knownEyebrow: '01 / Known load', desiredEyebrow: '02 / Desired effort', trainingEyebrow: '03 / Training max', weightField: 'Weight', repsField: 'Reps', effortField: 'RPE', trainingField: 'Training max', percentageField: 'Percentage', exactLabel: 'Exact', selected: 'Selected target · rounded to nearest' },
  it: { preferences: 'Preferenze', settings: 'Impostazioni', effort: 'Linguaggio dello sforzo', weight: 'Unità di peso', language: 'Lingua', theme: 'Tema', dark: 'Scuro', light: 'Chiaro', legend: 'Legenda', rpe: 'Percezione dello sforzo', rir: 'Ripetizioni in riserva', oneRm: 'Massimale di una ripetizione', known: 'Carico noto', desired: 'Sforzo desiderato', training: 'Massimale di allenamento', weightLabel: 'Peso', reps: 'Ripetizioni', estimated: '1RM stimato', target: 'Peso obiettivo', percentage: 'Percentuale', setWeight: 'Peso della serie', exact: 'Esatto', useEstimate: 'Usa 1RM stimato', map: 'La mappa', reference: '% di 1RM', working: 'Carichi di lavoro', translate: 'Traduzione continua', ofChart: 'della tabella di Tuchscherer', barbell: 'Matematica del bilanciere', autoregulation: 'Autoregolazione', tagline: 'Trasforma lo sforzo in numeri da caricare sul bilanciere.', knownEyebrow: '01 / Carico noto', desiredEyebrow: '02 / Sforzo desiderato', trainingEyebrow: '03 / Massimale di allenamento', weightField: 'Peso', repsField: 'Ripetizioni', effortField: 'RPE', trainingField: 'Massimale di allenamento', percentageField: 'Percentuale', exactLabel: 'Esatto', selected: 'Obiettivo selezionato · arrotondato ai' },
} as const

function t(locale: Locale, key: keyof typeof copy.en) {
  return copy[locale][key]
}

function SettingsPanel({ language, setLanguage, unit, setUnit, locale, setLocale, theme, setTheme, onClose }: { language: 'rpe' | 'rir'; setLanguage: (language: 'rpe' | 'rir') => void; unit: 'kg' | 'lb'; setUnit: (unit: 'kg' | 'lb') => void; locale: Locale; setLocale: (locale: Locale) => void; theme: Theme; setTheme: (theme: Theme) => void; onClose: () => void }) {
  const text = copy[locale]
  return <aside className="settings-panel" aria-label={text.settings}><div className="settings-title"><span className="eyebrow">{text.preferences}</span><strong>{text.settings}</strong><button type="button" className="settings-close" aria-label={locale === 'it' ? 'Chiudi impostazioni' : 'Close settings'} onClick={onClose}><CloseIcon /></button></div><div className="settings-option"><span>{text.effort}</span><div className="settings-toggle" role="group" aria-label={text.effort}><button className={language === 'rpe' ? 'active' : ''} onClick={() => setLanguage('rpe')}>RPE</button><button className={language === 'rir' ? 'active' : ''} onClick={() => setLanguage('rir')}>RIR</button></div></div><div className="settings-option"><span>{text.weight}</span><div className="settings-toggle" role="group" aria-label={text.weight}><button className={unit === 'kg' ? 'active' : ''} onClick={() => setUnit('kg')}>KG</button><button className={unit === 'lb' ? 'active' : ''} onClick={() => setUnit('lb')}>LB</button></div></div><div className="settings-option"><span>{text.language}</span><div className="settings-toggle" role="group" aria-label={text.language}><button className={locale === 'en' ? 'active' : ''} onClick={() => setLocale('en')}>EN</button><button className={locale === 'it' ? 'active' : ''} onClick={() => setLocale('it')}>IT</button></div></div><div className="settings-option"><span>{text.theme}</span><div className="settings-toggle" role="group" aria-label={text.theme}><button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>{text.dark}</button><button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>{text.light}</button></div></div><div className="settings-legend"><span className="eyebrow">{text.legend}</span><p><strong>RPE</strong> — {text.rpe}</p><p><strong>RIR</strong> — {text.rir}</p><p><strong>1RM</strong> — {text.oneRm}</p></div></aside>
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
  const [locale, setLocale] = useState<Locale>('en')
  const [theme, setTheme] = useState<Theme>('dark')
  const text = copy[locale]
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
  const tableValues = language === 'rir' ? RPE_VALUES.map((value) => 10 - value) : RPE_VALUES

  const setUseOneRepMax = () => { if (haveValid) setTrainingMax(Number(oneRepMax.toFixed(1))) }
  const setQuickPercentage = (value: number) => setTrainingPercentage(value)

  return <main className="calculator-shell" data-theme={theme}>
    <header className="hero">
      <div className="kicker"><span>{text.barbell}</span><i /> <span>{text.autoregulation}</span></div>
      <div className="hero-rule" />
      <h1>RPE Load<br /><em>Calculator</em></h1>
      <p className="tagline">{text.tagline}</p>
      <button className="settings-button" aria-expanded={settingsOpen} aria-controls="calculator-settings" onClick={() => setSettingsOpen(!settingsOpen)}><SettingsIcon /> {text.settings}</button>
      {settingsOpen && <div id="calculator-settings"><SettingsPanel language={language} setLanguage={setLanguage} unit={unit} setUnit={setUnit} locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} onClose={() => setSettingsOpen(false)} /></div>}
    </header>

    <section className="tool-grid" aria-label={locale === 'it' ? 'Calcolatori di carico' : 'Load calculators'}>
      <article className="panel"><PanelHeader eyebrow={text.knownEyebrow} title={locale === 'it' ? 'Hai → 1RM stimato' : 'Have → Est. 1RM'} /><div className="fields"><Field label={text.weightField} value={haveWeight} onChange={setHaveWeight} min={0} step={unit === 'kg' ? 0.5 : 1} suffix={unit} /><Field label={text.repsField} value={haveReps} onChange={setHaveReps} min={1} step={1} /><Field label={language === 'rpe' ? 'RPE' : 'RIR'} value={haveRpe} onChange={setHaveRpe} min={0} max={language === 'rpe' ? 10 : 6} step={0.5} /></div><div className="result"><span>{text.estimated}</span><strong className={mono}>{haveValid ? oneRepMax.toFixed(1) : '—'} <small>{unit}</small></strong>{haveValid && <p>{haveReps}× @ {haveRpe} {locale === 'it' ? 'corrisponde al' : 'sits at'} {formatPercent(percentage(haveReps, effortToRpe(Number(haveRpe))))} {locale === 'it' ? 'di 1RM.' : 'of 1RM.'}</p>}</div></article>
      <article className="panel"><PanelHeader eyebrow={text.desiredEyebrow} title={locale === 'it' ? 'Vuoi → Peso obiettivo' : 'Want → Target Weight'} /><div className="fields"><Field label={text.repsField} value={wantReps} onChange={setWantReps} min={1} step={1} /><Field label={language === 'rpe' ? 'RPE' : 'RIR'} value={wantRpe} onChange={setWantRpe} min={0} max={language === 'rpe' ? 10 : 6} step={0.5} /></div><div className="result target"><span>{text.target}</span><strong className={mono}>{wantValid && oneRepMax > 0 ? wantWeight.toFixed(1) : '—'} <small>{unit}</small></strong>{wantValid && <p>{wantReps}× @ {wantRpe} {locale === 'it' ? 'equivale al' : 'equals'} {formatPercent(percentage(wantReps, effortToRpe(Number(wantRpe))))} {locale === 'it' ? 'di 1RM.' : 'of 1RM.'}</p>}</div></article>
    </section>

    <section className="percent-panel"><PanelHeader eyebrow={text.trainingEyebrow} title={locale === 'it' ? 'Percentuale del massimale di allenamento' : 'Percent of a Training Max'} /><div className="percent-layout"><div className="percent-fields"><Field label={text.trainingField} value={trainingMax} onChange={setTrainingMax} min={0} step={unit === 'kg' ? 0.5 : 1} suffix={unit} /><button className="text-button" onClick={setUseOneRepMax} disabled={!haveValid}>{text.useEstimate} <ArrowUpRight /></button></div><Field label={text.percentageField} value={trainingPercentage} onChange={setTrainingPercentage} min={0} max={200} step={0.5} suffix="%" /><div className="set-result"><span>{text.setWeight}</span><strong className={mono}>{setWeight > 0 ? roundToIncrement(setWeight, increment).toFixed(1) : '—'} <small>{unit}</small></strong><p>{text.exactLabel}: {setWeight > 0 ? setWeight.toFixed(1) : '—'} {unit}</p></div></div><div className="chips" aria-label={locale === 'it' ? 'Percentuali rapide' : 'Quick percentages'}>{QUICK_PERCENTAGES.map((value) => <button key={value} className={trainingPercentage === value ? 'active' : ''} onClick={() => setQuickPercentage(value)}><span>{value.toFixed(1)}</span><small>{Number(trainingMax) > 0 ? roundToIncrement(Number(trainingMax) * value / 100, increment).toFixed(1) : value.toFixed(1)}</small></button>)}</div><div className="chip-caption"><span>{locale === 'it' ? 'Percentuali di allenamento' : 'Training percentages'}</span><span>{locale === 'it' ? 'Apertura · 2ª · 3ª' : 'Opener · 2nd · 3rd'}</span></div></section>

    <section className="reference-section"><div className="section-heading"><div><div className="eyebrow">04 / {text.map}</div><h2>{haveValid ? text.working : text.reference}</h2></div><p>{text.translate}<br />{text.ofChart}</p></div><div className="table-wrap"><table><caption className="sr-only">{locale === 'it' ? `Tabella di riferimento ${language.toUpperCase()} per ripetizioni da uno a dieci` : `${language.toUpperCase()} reference table for reps one through ten`}</caption><thead><tr><th>{locale === 'it' ? `RIPETIZIONI / ${language.toUpperCase()}` : `REPS / ${language.toUpperCase()}`}</th>{tableValues.map((effort) => <th key={effort} className={wantRpe === effort ? 'highlight-axis' : ''}>{effort}</th>)}</tr></thead><tbody>{Array.from({ length: 10 }, (_, i) => i + 1).map((reps) => <tr key={reps}><th className={wantReps === reps ? 'highlight-axis' : ''}>{reps}</th>{tableValues.map((effort) => { const rpe = language === 'rir' ? 10 - effort : effort; const pct = percentage(reps, rpe); const isSelected = wantReps === reps && wantRpe === effort; return <td key={effort} className={isSelected ? 'selected-cell' : ''}>{pct > 0 ? haveValid ? roundToIncrement(oneRepMax * pct / 100, increment).toFixed(1) : pct.toFixed(1) : '—'}</td> })}</tr>)}</tbody></table></div><div className="table-note"><span className="legend" />{text.selected} {increment} {unit}</div></section>

    <footer><span>{locale === 'it' ? 'Calcolo RPE basato sulla tabella RPE di Mike Tuchscherer (Reactive Training Systems).' : "RPE math based on Mike Tuchscherer's RPE chart (Reactive Training Systems)."}</span><a href="https://github.com/mauromltn/rpe-load-calculator" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a></footer>
  </main>
}
