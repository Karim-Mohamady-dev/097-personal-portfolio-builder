import { useEffect, useState } from 'react'
import { Briefcase, Envelope, Globe, MapPin, Printer, User, Plus, Trash, X, GlobeHemisphereWest } from '@phosphor-icons/react'
import { useI18n } from './i18n'

type Project = { id: string; title: string; desc: string; link: string }
type Skill = { id: string; name: string; level: number }
type Job = { id: string; role: string; company: string; period: string }
type Profile = { name: string; title: string; bio: string; location: string; email: string; website: string }

const uid = () => Math.random().toString(36).slice(2, 10)
function load<T>(key: string, fallback: T): T { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback } catch { return fallback } }
function save(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* ignore */ } }

const ACCENTS: Record<string, string> = { ink: '#181818', blue: '#1d4ed8', green: '#0f766e', rose: '#be185d' }
const THEMES: Record<string, { bg: string; card: string; text: string; muted: string }> = {
  light: { bg: '#ffffff', card: '#f5f5f5', text: '#181818', muted: '#555555' },
  dark: { bg: '#181818', card: '#272727', text: '#ffffff', muted: '#b3b3b3' },
  warm: { bg: '#faf6ef', card: '#f0e8d8', text: '#2b2118', muted: '#6b5d4f' },
}

export default function App() {
  const { lang, setLang, t } = useI18n('portfolio-builder-lang')
  const [tab, setTab] = useState<'profile' | 'projects' | 'skills' | 'experience' | 'theme'>('profile')
  const [profile, setProfile] = useState<Profile>(() => load('portfolio-profile', { name: '', title: '', bio: '', location: '', email: '', website: '' }))
  const [projects, setProjects] = useState<Project[]>(() => load('portfolio-projects', []))
  const [skills, setSkills] = useState<Skill[]>(() => load('portfolio-skills', []))
  const [jobs, setJobs] = useState<Job[]>(() => load('portfolio-jobs', []))
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('portfolio-theme') || 'light' } catch { return 'light' } })
  const [accent, setAccent] = useState(() => { try { return localStorage.getItem('portfolio-accent') || 'ink' } catch { return 'ink' } })
  const [projForm, setProjForm] = useState({ title: '', desc: '', link: '' })
  const [skillForm, setSkillForm] = useState({ name: '', level: 70 })
  const [jobForm, setJobForm] = useState({ role: '', company: '', period: '' })

  useEffect(() => save('portfolio-profile', profile), [profile])
  useEffect(() => save('portfolio-projects', projects), [projects])
  useEffect(() => save('portfolio-skills', skills), [skills])
  useEffect(() => save('portfolio-jobs', jobs), [jobs])
  useEffect(() => { try { localStorage.setItem('portfolio-theme', theme); localStorage.setItem('portfolio-accent', accent) } catch { /* ignore */ } }, [theme, accent])

  const th = THEMES[theme] || THEMES.light
  const ac = ACCENTS[accent] || ACCENTS.ink
  const initials = profile.name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-white text-[#181818]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg">Skip to content</a>
      <header className="sticky top-4 z-10 mx-auto max-w-6xl px-4">
        <nav className="flex items-center justify-between gap-4 rounded-2xl border border-[#e3e3e3] bg-white/90 px-4 py-3 shadow-sm backdrop-blur" aria-label="Main">
          <span className="title-1 flex items-center gap-2"><User size={22} />{t('appName')}</span>
          <button type="button" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="button-sm flex items-center gap-2 rounded-xl border border-[#e3e3e3] px-3 py-2 motion-hover hover:bg-[#f5f5f5] active:scale-[0.98]"><GlobeHemisphereWest size={18} />{lang === 'en' ? t('langAr') : t('langEn')}</button>
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4">
        <section className="py-16 md:py-24">
          <p className="caption-2">{t('tagline')}</p>
          <h1 className="heading-1 hero-gradient mt-4 max-w-[680px]">{t('heroTitle')}</h1>
          <p className="body-3 mt-4 max-w-[680px] text-[#555555]">{t('heroSub')}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button type="button" onClick={() => document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })} className="button-md rounded-xl bg-[#181818] px-3 py-2 text-white motion-hover hover:bg-[#313131] active:scale-[0.98]">{t('ctaStart')}</button>
            <button type="button" onClick={() => document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' })} className="button-md rounded-xl border border-[#e3e3e3] px-3 py-2 motion-hover hover:bg-[#f5f5f5] active:scale-[0.98]">{t('ctaPreview')}</button>
          </div>
        </section>

        <section id="builder" className="pb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="flex flex-wrap gap-2" role="tablist">
                {(['profile', 'projects', 'skills', 'experience', 'theme'] as const).map((tb) => (
                  <button key={tb} type="button" role="tab" aria-selected={tab === tb} onClick={() => setTab(tb)} className={`button-sm rounded-xl px-3 py-2 motion-hover active:scale-[0.98] ${tab === tb ? 'bg-[#181818] text-white' : 'border border-[#e3e3e3] hover:bg-[#f5f5f5]'}`}>{t(`tab${tb.charAt(0).toUpperCase() + tb.slice(1)}`)}</button>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-[#e3e3e3] p-4 md:p-8">
                {tab === 'profile' && (
                  <div className="space-y-4">
                    <div><label htmlFor="pf-name" className="title-4 block">{t('fullName')}</label><input id="pf-name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder={t('fullNamePh')} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" /></div>
                    <div><label htmlFor="pf-title" className="title-4 block">{t('jobTitle')}</label><input id="pf-title" value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} placeholder={t('jobTitlePh')} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" /></div>
                    <div><label htmlFor="pf-bio" className="title-4 block">{t('bio')}</label><textarea id="pf-bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder={t('bioPh')} rows={3} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" /></div>
                    <div><label htmlFor="pf-loc" className="title-4 block">{t('location')}</label><input id="pf-loc" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder={t('locationPh')} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" /></div>
                    <div><label htmlFor="pf-email" className="title-4 block">{t('email')}</label><input id="pf-email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" dir="ltr" /></div>
                    <div><label htmlFor="pf-web" className="title-4 block">{t('website')}</label><input id="pf-web" value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} placeholder={t('websitePh')} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" dir="ltr" /></div>
                  </div>
                )}
                {tab === 'projects' && (
                  <div>
                    <div className="space-y-4">
                      <div><label htmlFor="pj-title" className="title-4 block">{t('projectTitle')}</label><input id="pj-title" value={projForm.title} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} placeholder={t('projectTitlePh')} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" /></div>
                      <div><label htmlFor="pj-desc" className="title-4 block">{t('projectDesc')}</label><textarea id="pj-desc" value={projForm.desc} onChange={(e) => setProjForm({ ...projForm, desc: e.target.value })} placeholder={t('projectDescPh')} rows={3} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" /></div>
                      <div><label htmlFor="pj-link" className="title-4 block">{t('projectLink')}</label><input id="pj-link" value={projForm.link} onChange={(e) => setProjForm({ ...projForm, link: e.target.value })} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" dir="ltr" /></div>
                    </div>
                    <button type="button" onClick={() => { if (!projForm.title.trim()) return; setProjects((p) => [...p, { id: uid(), title: projForm.title.trim(), desc: projForm.desc.trim(), link: projForm.link.trim() }]); setProjForm({ title: '', desc: '', link: '' }) }} className="button-md mt-4 flex items-center gap-2 rounded-xl bg-[#181818] px-3 py-2 text-white motion-hover hover:bg-[#313131] active:scale-[0.98]"><Plus size={18} />{t('addProject')}</button>
                    {projects.length === 0 ? <p className="body-6 mt-6 rounded-xl bg-[#f5f5f5] p-4 text-[#555555]">{t('noProjects')}</p> : (
                      <ul className="mt-6 space-y-2">{projects.map((p) => (
                        <li key={p.id} className="flex items-start justify-between gap-4 rounded-xl border border-[#e3e3e3] p-4"><span><span className="title-3 block">{p.title}</span><span className="body-6 mt-1 block text-[#555555]">{p.desc}</span></span>
                          <button type="button" onClick={() => setProjects((prev) => prev.filter((x) => x.id !== p.id))} className="text-red-700" aria-label={t('remove')}><Trash size={18} /></button></li>))}</ul>
                    )}
                  </div>
                )}
                {tab === 'skills' && (
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder={t('skillPh')} className="min-w-0 flex-1 rounded-xl border border-[#e3e3e3] p-4 body-3" aria-label={t('skillName')} />
                      <input type="range" min={10} max={100} step={5} value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })} className="w-32" aria-label={t('skillLevel')} />
                      <span className="body-5 self-center">{skillForm.level}%</span>
                      <button type="button" onClick={() => { if (!skillForm.name.trim()) return; setSkills((p) => [...p, { id: uid(), name: skillForm.name.trim(), level: skillForm.level }]); setSkillForm({ name: '', level: 70 }) }} className="button-md rounded-xl bg-[#181818] px-3 py-2 text-white motion-hover hover:bg-[#313131] active:scale-[0.98]">{t('addSkill')}</button>
                    </div>
                    {skills.length === 0 ? <p className="body-6 mt-6 rounded-xl bg-[#f5f5f5] p-4 text-[#555555]">{t('noSkills')}</p> : (
                      <ul className="mt-6 space-y-2">{skills.map((s) => (
                        <li key={s.id} className="flex items-center gap-4 rounded-xl border border-[#e3e3e3] p-4">
                          <span className="body-3 w-32">{s.name}</span>
                          <span className="h-2 flex-1 rounded-full bg-[#e3e3e3]"><span className="block h-2 rounded-full" style={{ width: `${s.level}%`, backgroundColor: ac }} /></span>
                          <span className="caption-4 w-10 text-end">{s.level}%</span>
                          <button type="button" onClick={() => setSkills((p) => p.filter((x) => x.id !== s.id))} className="text-red-700" aria-label={t('remove')}><X size={16} /></button>
                        </li>))}</ul>
                    )}
                  </div>
                )}
                {tab === 'experience' && (
                  <div>
                    <div className="space-y-4">
                      <div><label htmlFor="jb-role" className="title-4 block">{t('jobRole')}</label><input id="jb-role" value={jobForm.role} onChange={(e) => setJobForm({ ...jobForm, role: e.target.value })} placeholder={t('jobRolePh')} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" /></div>
                      <div><label htmlFor="jb-co" className="title-4 block">{t('company')}</label><input id="jb-co" value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} placeholder={t('companyPh')} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" /></div>
                      <div><label htmlFor="jb-per" className="title-4 block">{t('period')}</label><input id="jb-per" value={jobForm.period} onChange={(e) => setJobForm({ ...jobForm, period: e.target.value })} placeholder={t('periodPh')} className="mt-2 w-full rounded-xl border border-[#e3e3e3] p-4 body-3" /></div>
                    </div>
                    <button type="button" onClick={() => { if (!jobForm.role.trim()) return; setJobs((p) => [...p, { id: uid(), role: jobForm.role.trim(), company: jobForm.company.trim(), period: jobForm.period.trim() }]); setJobForm({ role: '', company: '', period: '' }) }} className="button-md mt-4 flex items-center gap-2 rounded-xl bg-[#181818] px-3 py-2 text-white motion-hover hover:bg-[#313131] active:scale-[0.98]"><Briefcase size={18} />{t('addJob')}</button>
                    {jobs.length === 0 ? <p className="body-6 mt-6 rounded-xl bg-[#f5f5f5] p-4 text-[#555555]">{t('noJobs')}</p> : (
                      <ul className="mt-6 space-y-2">{jobs.map((j) => (
                        <li key={j.id} className="flex items-start justify-between gap-4 rounded-xl border border-[#e3e3e3] p-4"><span><span className="title-3 block">{j.role}</span><span className="body-6 mt-1 block text-[#555555]">{j.company} · {j.period}</span></span>
                          <button type="button" onClick={() => setJobs((p) => p.filter((x) => x.id !== j.id))} className="text-red-700" aria-label={t('remove')}><Trash size={18} /></button></li>))}</ul>
                    )}
                  </div>
                )}
                {tab === 'theme' && (
                  <div>
                    <h3 className="title-2">{t('theme')}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(['light', 'dark', 'warm'] as const).map((thName) => (
                        <button key={thName} type="button" onClick={() => setTheme(thName)} className={`button-md rounded-xl px-3 py-2 motion-hover active:scale-[0.98] ${theme === thName ? 'bg-[#181818] text-white' : 'border border-[#e3e3e3] hover:bg-[#f5f5f5]'}`}>{t(`theme${thName.charAt(0).toUpperCase() + thName.slice(1)}`)}</button>
                      ))}
                    </div>
                    <h3 className="title-2 mt-8">{t('accent')}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(['ink', 'blue', 'green', 'rose'] as const).map((a) => (
                        <button key={a} type="button" onClick={() => setAccent(a)} className={`button-md flex items-center gap-2 rounded-xl px-3 py-2 motion-hover active:scale-[0.98] ${accent === a ? 'bg-[#181818] text-white' : 'border border-[#e3e3e3] hover:bg-[#f5f5f5]'}`}>
                          <span className="inline-block h-4 w-4 rounded-full" style={{ backgroundColor: ACCENTS[a] }} />{t(`accent${a.charAt(0).toUpperCase() + a.slice(1)}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div id="preview">
              <div className="flex items-center justify-between gap-4">
                <h2 className="heading-5">{t('preview')}</h2>
                <button type="button" onClick={() => window.print()} className="button-md flex items-center gap-2 rounded-xl bg-[#181818] px-3 py-2 text-white motion-hover hover:bg-[#313131] active:scale-[0.98]"><Printer size={18} />{t('print')}</button>
              </div>
              <p className="caption-2 mt-2 text-[#555555]">{t('printHint')}</p>
              <div className="mt-4 rounded-2xl border border-[#e3e3e3] p-4 md:p-8" style={{ backgroundColor: th.bg, color: th.text }}>
                {profile.name ? (
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white heading-6" style={{ backgroundColor: ac }}>{initials || '?'}</span>
                      <div>
                        <h3 className="heading-5">{profile.name}</h3>
                        <p className="body-3" style={{ color: th.muted }}>{profile.title}</p>
                      </div>
                    </div>
                    {profile.bio && <p className="body-3 mt-6">{profile.bio}</p>}
                    <p className="body-6 mt-4 flex flex-wrap gap-4" style={{ color: th.muted }}>
                      {profile.location && <span><MapPin size={14} className="inline me-1" />{profile.location}</span>}
                      {profile.email && <span><Envelope size={14} className="inline me-1" />{profile.email}</span>}
                      {profile.website && <span><Globe size={14} className="inline me-1" />{profile.website}</span>}
                    </p>
                    {skills.length > 0 && (
                      <div className="mt-8"><h4 className="title-2" style={{ color: ac }}>{t('tabSkills')}</h4>
                        <ul className="mt-4 space-y-2">{skills.map((s) => (
                          <li key={s.id} className="flex items-center gap-4"><span className="body-5 w-32">{s.name}</span><span className="h-2 flex-1 rounded-full" style={{ backgroundColor: th.card }}><span className="block h-2 rounded-full" style={{ width: `${s.level}%`, backgroundColor: ac }} /></span><span className="caption-4 w-10 text-end">{s.level}%</span></li>))}</ul>
                      </div>
                    )}
                    {projects.length > 0 && (
                      <div className="mt-8"><h4 className="title-2" style={{ color: ac }}>{t('tabProjects')}</h4>
                        <ul className="mt-4 space-y-4">{projects.map((p) => (
                          <li key={p.id} className="rounded-xl p-4" style={{ backgroundColor: th.card }}>
                            <p className="title-3">{p.title}</p><p className="body-6 mt-2" style={{ color: th.muted }}>{p.desc}</p>
                            {p.link && <p className="body-6 mt-2" dir="ltr" style={{ color: ac }}>{p.link}</p>}
                          </li>))}</ul>
                      </div>
                    )}
                    {jobs.length > 0 && (
                      <div className="mt-8"><h4 className="title-2" style={{ color: ac }}>{t('tabExperience')}</h4>
                        <ul className="mt-4 space-y-4">{jobs.map((j) => (
                          <li key={j.id}><p className="title-3">{j.role}</p><p className="body-6 mt-1" style={{ color: th.muted }}>{j.company} · {j.period}</p></li>))}</ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="body-3 rounded-xl p-8 text-center" style={{ color: th.muted }}>{t('previewEmpty')}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-[#e3e3e3] py-8">
        <p className="caption-2 mx-auto max-w-6xl px-4 text-[#555555]">{t('footerNote')}</p>
      </footer>
    </div>
  )
}
