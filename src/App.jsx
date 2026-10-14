import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Route, Routes, NavLink, useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const EVENT_DATE = '2026-10-30T19:00:00+05:30'; // Change the time here; timezone is Asia/Kolkata.
const navItems = [
  ['Home', '/'], ['About Event', '/about'], ['Schedule', '/schedule'],
  ['Gallery', '/gallery'], ['Register', '/register'], ['Contact & FAQ', '/contact']
];

function Stars() {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 1700; i++) p.push((Math.random() - .5) * 34, (Math.random() - .5) * 20, -Math.random() * 18);
    return new Float32Array(p);
  }, []);
  const ref = useRef();
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * .006; });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} /></bufferGeometry><pointsMaterial size={0.025} color="#dce9ff" transparent opacity={0.85} sizeAttenuation /></points>;
}
function Moon() {
  const ref = useRef();
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * .035; });
  return <mesh ref={ref} rotation={[0.15, 0, -0.12]} castShadow>
    <sphereGeometry args={[2.15, 96, 96]} />
    <meshStandardMaterial color="#aab2c1" roughness={1} metalness={0.03} />
  </mesh>;
}
function MoonScene() {
  return <div className="moon-scene"><Canvas camera={{ position: [0, 0, 6.7], fov: 42 }} dpr={[1, 1.6]}>
    <ambientLight intensity={1.05} /><directionalLight position={[-4, 3, 5]} intensity={3.2} />
    <pointLight position={[4, -2, -3]} intensity={0.55} color="#6e9de8" />
    <Suspense fallback={null}><Moon /><Stars /></Suspense>
  </Canvas><div className="moon-halo" /></div>;
}
function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = new Date(EVENT_DATE).getTime() - now;
  if (diff <= 0) return <div className="live-pill"><span className="live-dot" /> THE EVENT IS LIVE</div>;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return <div className="countdown" aria-label="Countdown to the event">
    {days >= 1 ? <><TimeUnit value={days} label="DAYS" /><TimeUnit value={hours} label="HRS" /><TimeUnit value={mins} label="MIN" /><TimeUnit value={secs} label="SEC" /></> :
      <div className="last-hours"><span className="live-dot" /> FINAL COUNTDOWN <strong>{String(hours).padStart(2,'0')}:{String(mins).padStart(2,'0')}</strong></div>}
  </div>;
}
function TimeUnit({ value, label }) { return <div className="time-unit"><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>; }

function Layout({ children }) {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => { setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location.pathname]);
  return <div className="app-shell"><div className="starfield" aria-hidden="true" />
    <header className="site-header"><NavLink to="/" className="brand"><span className="brand-mark">◒</span><span><b>DJSNOVA</b><small>ASTROPHYSICS & ASTRONOMY</small></span></NavLink>
      <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">{menu ? '✕' : '☰'}</button>
      <nav className={menu ? 'nav-links open' : 'nav-links'}>{navItems.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}</nav>
    </header>
    <main>{children}</main>
    <footer className="footer"><span>© 2026 DJSNOVA · D. J. Sanghvi College of Engineering</span><span>LOOK UP. WONDER MORE. <b>✦</b></span></footer>
  </div>;
}
function Home() {
  const navigate = useNavigate();
  return <section className="hero page-wrap">
    <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> A NIGHT UNDER THE COSMOS</div>
      <h1>MOON<span>GAZING</span><em>3.0</em></h1>
      <p className="tagline">Exploring Beyond the Ordinary.</p>
      <p className="hero-desc">A little closer to the Moon. A little further into the unknown. Join DJSNOVA for an evening of celestial discovery, cosmic stories, and wonder.</p>
      <div className="event-meta"><span>◷ &nbsp;30 OCTOBER 2026</span><i /> <span>⌖ &nbsp;DJSCE CAMPUS</span></div>
      <Countdown />
      <div className="hero-actions"><button className="btn btn-primary" onClick={() => navigate('/register')}>Reserve Your Orbit <span>↗</span></button><button className="btn btn-quiet" onClick={() => navigate('/about')}>Discover the Event <span>→</span></button></div>
      <div className="scroll-cue"><span /> SCROLL TO EXPLORE</div>
    </div>
    <div className="hero-visual"><MoonScene /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="moon-label label-top"><span>01 / CELESTIAL BODY</span><b>THE MOON</b></div><div className="moon-label label-bottom"><span>384,400 KM</span><b>FROM EARTH, WITH WONDER</b></div><div className="floating-star">✦</div></div>
    <div className="hero-index">01 — 06 <span /> THE LUNAR EXPERIENCE</div>
  </section>;
}
function PageIntro({ kicker, title, text }) { return <div className="page-intro"><div className="eyebrow"><span className="eyebrow-line" />{kicker}</div><h1>{title}</h1><p>{text}</p></div>; }
function About() {
  return <section className="inner-page page-wrap"><PageIntro kicker="THE WHY & THE WONDER" title={<>More than looking up.<br/><span>A way to look closer.</span></>} text="MOONGAZING 3.0 brings curious minds together for an evening shaped by astronomy, observation, and the questions that make us human." />
    <div className="about-grid"><div className="about-visual"><div className="about-moon">◐</div><span className="visual-coordinate">19°07' N · 72°50' E</span><span className="visual-caption">SAME SKY. INFINITE STORIES.</span></div><div className="about-content"><span className="section-number">01 / OUR MISSION</span><h2>Make the universe<br/>feel a little closer.</h2><p>Organised by DJSNOVA — the Astrophysics & Astronomical Committee of D. J. Sanghvi College of Engineering — this edition invites students to step away from everyday noise and experience the night sky with fresh eyes.</p><p>Whether you know the constellations by heart or are meeting the Moon through a telescope for the first time, there is a place for your curiosity here.</p><div className="stat-row"><div><b>01</b><span>SHARED SKY</span></div><div><b>∞</b><span>QUESTIONS</span></div><div><b>100%</b><span>WONDER</span></div></div></div></div>
    <div className="feature-row">{[['◉','Guided Observation','Explore lunar details and celestial objects with guidance.'],['✧','Cosmic Conversations','Exchange questions, facts, and perspectives about space.'],['⌁','Community Under Stars','Meet fellow students who share your curiosity.']].map(x=><article className="feature-card" key={x[1]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div>
  </section>;
}
function Schedule() {
  const items = [['18:00','Arrival & Check-in','Get settled, meet the committee, and find your place under the night sky.','01'],['18:30','Welcome to the Cosmos','An introduction to the evening, the sky, and what to look out for.','02'],['19:00','Guided Moon Observation','Turn your gaze to the lunar surface and discover its visible features.','03'],['19:45','Astronomy Activities','Interactive space-themed activities, trivia, and conversations.','04'],['20:30','Closing Reflections','Share discoveries, ask final questions, and wrap up the night.','05']];
  return <section className="inner-page page-wrap"><PageIntro kicker="YOUR EVENING, ORBIT BY ORBIT" title={<>A timeline written<br/><span>in the stars.</span></>} text="A planned flow for a night full of discovery. Timings are indicative and may be updated by the organising committee."/>
    <div className="schedule-layout"><div className="schedule-note"><span className="note-icon">✧</span><h2>Keep your eyes<br/>on the sky.</h2><p>Arrive a little early, bring your curiosity, and keep an eye on official committee updates for final event instructions.</p><div className="date-card"><small>FRIDAY</small><b>30 <span>OCT</span></b><i>MOONGAZING 3.0</i></div></div><div className="timeline">{items.map(([time,title,desc,n])=><article className="timeline-item" key={n}><div className="timeline-time">{time}<small>IST</small></div><div className="timeline-node">{n}</div><div className="timeline-copy"><h3>{title}</h3><p>{desc}</p></div></article>)}</div></div>
    <div className="notice-strip"><span>✦</span><p><b>Schedule note</b> — This is a sample schedule for the website demo. Confirm final timings and activities with DJSNOVA before publishing.</p></div>
  </section>;
}
const galleryItems = [
  { title: 'Moonlit Moments', category: 'NIGHT SKY', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Lunar Surface', category: 'THE MOON', image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Into the Cosmos', category: 'DEEP SPACE', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=85' },
  { title: 'A Sky Full of Stars', category: 'STARGAZING', image: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Celestial Blue', category: 'NIGHT SKY', image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Beyond the Horizon', category: 'EXPLORATION', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85' }
];
function Gallery() {
  const [selected, setSelected] = useState(null);
  useEffect(() => { const close = e => e.key === 'Escape' && setSelected(null); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  return <section className="inner-page page-wrap"><PageIntro kicker="MEMORIES FROM THE COSMOS" title={<>Nights worth<br/><span>remembering.</span></>} text="A visual moodboard for the MOONGAZING experience. Replace these sample space photographs with verified photos from previous college events before publishing."/>
    <div className="gallery-grid">{galleryItems.map((item,i)=><button className={`gallery-card gallery-card-${i+1}`} key={item.title} onClick={()=>setSelected(item)}><img src={item.image} alt={item.title} loading="lazy"/><span className="gallery-overlay"><small>{item.category}</small><b>{item.title}</b><i>↗</i></span></button>)}</div>
    <p className="gallery-note">IMAGE NOTE · These are illustrative space images, not verified photographs from a previous Moongazing event.</p>
    {selected && <div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setSelected(null)}><button className="lightbox-close" aria-label="Close image">✕</button><img src={selected.image} alt={selected.title}/><div><small>{selected.category}</small><h3>{selected.title}</h3></div></div>}
  </section>;
}
function Register() {
  const [form, setForm] = useState({name:'', roll:'', email:'', phone:'', department:'', division:'', year:''});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const update = e => setForm({...form, [e.target.name]: e.target.value});
  function submit(e) {
    e.preventDefault(); setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid college email address.');
    if (!/^[6-9]\d{9}$/.test(form.phone)) return setError('Enter a valid 10-digit Indian mobile number.');
    if (!form.name.trim() || !form.roll.trim() || !form.department || !form.division || !form.year) return setError('Please complete every field.');
    try {
      const previous = JSON.parse(localStorage.getItem('moongazingRegistrations') || '[]');
      previous.push({...form, submittedAt:new Date().toISOString()});
      localStorage.setItem('moongazingRegistrations', JSON.stringify(previous));
      setSuccess(true);
    } catch { setError('Could not save in this browser. Check localStorage settings and try again.'); }
  }
  return <section className="inner-page page-wrap register-page"><PageIntro kicker="CLAIM YOUR PLACE UNDER THE STARS" title={<>Your orbit<br/><span>starts here.</span></>} text="Register your interest for MOONGAZING 3.0. Complete the details below to reserve your place."/>
    {success ? <div className="success-panel"><div className="success-icon">✓</div><span className="eyebrow">TRANSMISSION RECEIVED</span><h2>You're on the list.</h2><p>Thanks, {form.name}. Your demo registration has been saved in this browser.</p><p className="privacy-note">This is a frontend demo only. Data is stored in localStorage on this device and is not sent to the committee.</p><button className="btn btn-primary" onClick={()=>{setForm({name:'',roll:'',email:'',phone:'',department:'',division:'',year:''});setSuccess(false)}}>Register another student ↗</button></div> :
    <form className="registration-form" onSubmit={submit}><div className="form-heading"><span>01 — STUDENT DETAILS</span><small>* REQUIRED FIELDS</small></div><div className="form-grid">
      <Field label="Full name" name="name" value={form.name} onChange={update} placeholder="Enter your full name" />
      <Field label="Roll number" name="roll" value={form.roll} onChange={update} placeholder="e.g. 2026XXXXX" />
      <Field label="College email" name="email" value={form.email} onChange={update} placeholder="you@djsce.ac.in" type="email" />
      <Field label="Phone number" name="phone" value={form.phone} onChange={update} placeholder="10-digit mobile number" />
      <SelectField label="Department" name="department" value={form.department} onChange={update} options={['Computer Engineering','Information Technology','Electronics & Telecommunication','Computer Science & Engineering (Data Science)','Artificial Intelligence & Data Science','Mechanical Engineering','Other']} />
      <SelectField label="Division" name="division" value={form.division} onChange={update} options={['A','B','C','D','E','Other']} />
      <SelectField label="Academic year" name="year" value={form.year} onChange={update} options={['First Year','Second Year','Third Year','Final Year']} />
    </div>{error && <p className="form-error" role="alert">{error}</p>}<div className="form-bottom"><p>By submitting, you agree that this demo stores your details locally in this browser only.</p><button className="btn btn-primary" type="submit">Submit Registration <span>↗</span></button></div></form>}
  </section>;
}
function Field({label, ...props}) { return <label className="field"><span>{label} <i>*</i></span><input required name={props.name} value={props.value} onChange={props.onChange} placeholder={props.placeholder} type={props.type || 'text'} /></label>; }
function SelectField({label, name, value, onChange, options}) { return <label className="field"><span>{label} <i>*</i></span><select required name={name} value={value} onChange={onChange}><option value="">Select {label.toLowerCase()}</option>{options.map(o=><option key={o}>{o}</option>)}</select></label>; }
function Contact() {
  const [open, setOpen] = useState(0);
  const faqs = [['Who can attend MOONGAZING 3.0?','This website is designed for D. J. Sanghvi College of Engineering students. Please follow official DJSNOVA announcements for eligibility and access details.'],['Do I need prior astronomy knowledge?','Not at all. The event is designed to welcome beginners and astronomy enthusiasts alike.'],['Is the registration form connected to a database?','No. This is a frontend-only demonstration. Submissions are stored in your browser localStorage and are not sent to the organisers.'],['What should I bring?','Check the official committee announcement for the final checklist, venue instructions, and any requirements.'],['Where can I find final event updates?','Follow official DJSNOVA channels or contact the committee through the verified details shared by your college.']];
  return <section className="inner-page page-wrap"><PageIntro kicker="WE'RE ONLY A MESSAGE AWAY" title={<>Questions about<br/><span>the universe?</span></>} text="Need a little more information before you join us? Start here, and check official DJSNOVA channels for verified event updates."/>
    <div className="contact-layout"><div className="contact-card"><span className="contact-symbol">✧</span><small>THE ORGANISERS</small><h2>DJSNOVA</h2><p>Astrophysics & Astronomical Committee<br/>D. J. Sanghvi College of Engineering</p><div className="contact-line"><span>⌖</span><div><small>VENUE</small><b>DJSCE Campus, Mumbai</b><em>Confirm exact venue before the event</em></div></div><div className="contact-line"><span>✉</span><div><small>EMAIL</small><b>Use the committee's official email</b><em>Add verified contact details before launch</em></div></div><div className="contact-warning">Replace placeholder contact information with official committee details before publishing.</div></div>
      <div className="faq-area"><div className="faq-heading"><span className="section-number">ANSWERS FROM MISSION CONTROL</span><h2>Frequently asked<br/>questions.</h2></div>{faqs.map(([q,a],i)=><div className={`faq-item ${open===i?'expanded':''}`} key={q}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>{q}</span><b>{open===i?'−':'+'}</b></button>{open===i&&<p>{a}</p>}</div>)}</div></div>
  </section>;
}
function NotFound() { return <section className="inner-page page-wrap"><PageIntro kicker="OFF COURSE" title={<>Lost in<br/><span>deep space?</span></>} text="This page is outside our orbit."/><NavLink className="btn btn-primary inline-btn" to="/">Return to home ↗</NavLink></section>; }
export default function App() {
  return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/schedule" element={<Schedule/>}/><Route path="/gallery" element={<Gallery/>}/><Route path="/register" element={<Register/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></Layout>;
}
