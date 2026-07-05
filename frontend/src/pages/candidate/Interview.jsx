import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import useIntegrityMonitor from "../../hooks/useIntegrityMonitor";
import { getInterview, submitAnswer } from "../../services/interviewService";

/* ============================================================
   STYLES
   ============================================================ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --primary:        #3eb489;
    --primary-light:  #4dc99a;
    --primary-pale:   #e8f8f2;
    --primary-border: #c2ead8;
    --bg:             #f5faf7;
    --bg-white:       #ffffff;
    --text-1:         #1a1a2e;
    --text-2:         #4b5563;
    --text-3:         #9ca3af;
    --border:         #e5e7eb;
    --border-soft:    #f0f0f0;
    --danger:         #ef4444;
    --danger-pale:    #fef2f2;
    --warning:        #f59e0b;
    --warning-pale:   #fffbeb;
    --r:              12px;
    --shadow:         0 1px 3px rgba(0,0,0,0.08);
    --shadow-md:      0 4px 16px rgba(0,0,0,0.1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { overflow: hidden; }

  /* ── READY MODAL OVERLAY ── */
  .iv-overlay {
    position: fixed; inset: 0;
    background: rgba(10,16,10,0.7);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
    animation: fade-in 0.3s ease;
  }

  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

  .iv-ready-modal {
    background: var(--bg-white);
    border-radius: 20px;
    padding: 40px 36px;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 24px 60px rgba(0,0,0,0.2);
    animation: modal-pop 0.4s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }

  @keyframes modal-pop {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .iv-ready-modal::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: var(--primary);
    border-radius: 20px 20px 0 0;
  }

  .iv-modal-icon {
    width: 64px; height: 64px;
    background: var(--primary-pale);
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    margin: 0 auto 20px;
    border: 1px solid var(--primary-border);
  }

  .iv-modal-title {
    font-size: 22px; font-weight: 700;
    color: var(--text-1);
    text-align: center;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .iv-modal-sub {
    font-size: 14px; color: var(--text-3);
    text-align: center;
    margin-bottom: 28px;
    line-height: 1.6;
  }

  .iv-rules {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .iv-rule {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.5;
  }

  .iv-rule-icon {
    width: 20px; height: 20px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .iv-rule-icon.ok  { background: var(--primary-pale); color: var(--primary); }
  .iv-rule-icon.bad { background: var(--danger-pale); color: var(--danger); }

  .iv-start-btn {
    width: 100%;
    padding: 14px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(62,180,137,0.35);
    letter-spacing: -0.2px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .iv-start-btn:hover { background: var(--primary-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(62,180,137,0.4); }
  .iv-start-btn:active { transform: scale(0.98); }

  /* ── FRAUD ALERT MODAL ── */
  .iv-fraud-overlay {
    position: fixed; inset: 0;
    background: rgba(239,68,68,0.15);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9998;
    animation: fade-in 0.2s ease;
  }

  .iv-fraud-modal {
    background: var(--bg-white);
    border-radius: 16px;
    padding: 32px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 50px rgba(239,68,68,0.2);
    animation: modal-pop 0.3s cubic-bezier(0.16,1,0.3,1);
    border: 1.5px solid #fca5a5;
    text-align: center;
  }

  .iv-fraud-icon {
    font-size: 44px;
    display: block;
    margin-bottom: 12px;
  }

  .iv-fraud-title {
    font-size: 18px; font-weight: 700;
    color: var(--danger);
    margin-bottom: 8px;
  }

  .iv-fraud-msg {
    font-size: 13px; color: var(--text-2);
    line-height: 1.6; margin-bottom: 20px;
  }

  .iv-fraud-count {
    display: inline-block;
    background: var(--danger-pale);
    color: var(--danger);
    border: 1px solid #fca5a5;
    border-radius: 99px;
    padding: 4px 14px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .iv-fraud-btn {
    width: 100%;
    padding: 11px;
    background: var(--danger);
    color: white;
    border: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .iv-fraud-btn:hover { opacity: 0.88; }

  /* ── MAIN LAYOUT ── */
  .iv {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    height: 100vh;
    display: grid;
    grid-template-columns: 220px 1fr;
    grid-template-rows: 60px 1fr;
    color: var(--text-1);
    overflow: hidden;
  }

  /* ── TOPBAR ── */
  .iv-top {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background: var(--bg-white);
    border-bottom: 1px solid var(--border);
    gap: 16px;
    box-shadow: var(--shadow);
    z-index: 10;
  }

  .iv-logo {
    display: flex; align-items: center; gap: 10px;
    font-weight: 700; font-size: 14px;
    color: var(--text-1); flex-shrink: 0;
  }

  .iv-logo-icon {
    width: 34px; height: 34px;
    background: var(--primary); border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 13px; font-weight: 700;
  }

  .iv-logo-sub {
    font-size: 10px; font-weight: 400;
    color: var(--text-3); display: block; line-height: 1;
  }

  .iv-top-center {
    flex: 1; max-width: 400px;
    display: flex; flex-direction: column; gap: 4px;
  }

  .iv-prog-info {
    display: flex; justify-content: space-between;
    font-size: 11px; color: var(--text-3); font-weight: 500;
  }

  .iv-prog-info span:last-child { color: var(--primary); font-weight: 600; }

  .iv-prog-track {
    height: 6px; background: var(--border);
    border-radius: 99px; overflow: hidden;
  }

  .iv-prog-fill {
    height: 100%; background: var(--primary);
    border-radius: 99px;
    transition: width 0.7s cubic-bezier(0.16,1,0.3,1);
  }

  .iv-top-right {
    display: flex; align-items: center;
    gap: 8px; flex-shrink: 0;
  }

  .iv-live-badge {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: var(--primary); font-weight: 600;
    padding: 5px 11px;
    background: var(--primary-pale);
    border-radius: 99px; border: 1px solid var(--primary-border);
  }

  .iv-live-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--primary);
    animation: blink 1.8s ease-in-out infinite;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .iv-violation-pill {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 99px;
    border: 1.5px solid #fca5a5;
    background: var(--danger-pale);
    color: var(--danger);
    font-size: 11px; font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  .iv-violation-pill:hover { transform: scale(1.03); }

  .iv-timer-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 13px; border-radius: 99px;
    border: 1.5px solid var(--border);
    background: var(--bg-white);
    font-size: 13px; font-weight: 600;
    color: var(--text-1);
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    box-shadow: var(--shadow);
  }

  .iv-timer-pill.caution { border-color:#fcd34d; background:var(--warning-pale); color:var(--warning); }
  .iv-timer-pill.danger  { border-color:#fca5a5; background:var(--danger-pale);  color:var(--danger);
    animation: timer-alert 0.8s ease-in-out infinite alternate; }

  @keyframes timer-alert { from{transform:scale(1)} to{transform:scale(1.03)} }

  /* ── SIDEBAR ── */
  .iv-sidebar {
    background: var(--bg-white);
    border-right: 1px solid var(--border);
    padding: 18px 10px;
    display: flex; flex-direction: column; gap: 18px;
    overflow-y: auto;
  }

  .iv-s-label {
    font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1px;
    color: var(--text-3); padding: 0 8px; margin-bottom: 2px;
  }

  .iv-q-list { display: flex; flex-direction: column; gap: 3px; }

  .iv-q-item {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 9px; border-radius: 7px;
    font-size: 11px; font-weight: 500;
    cursor: default; transition: background 0.15s ease;
  }

  .iv-q-item.done    { background: var(--primary-pale); color: var(--primary); }
  .iv-q-item.active  { background: var(--primary); color: white; box-shadow: 0 2px 8px rgba(62,180,137,0.28); }
  .iv-q-item.pending { color: var(--text-3); }
  .iv-q-item.pending:hover { background: var(--bg); }

  .iv-q-num {
    width: 20px; height: 20px; border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; flex-shrink: 0;
  }

  .done .iv-q-num   { background: rgba(62,180,137,0.18); color: var(--primary); }
  .active .iv-q-num { background: rgba(255,255,255,0.2); color: white; }
  .pending .iv-q-num{ background: var(--bg); color: var(--text-3); }

  .iv-mini-scores { display: flex; flex-direction: column; gap: 8px; }

  .iv-mini-row { display: flex; flex-direction: column; gap: 3px; }

  .iv-mini-head {
    display: flex; justify-content: space-between;
    font-size: 10px; color: var(--text-2); font-weight: 500;
  }

  .iv-mini-head span:last-child { color: var(--primary); font-weight: 600; }

  .iv-mini-track {
    height: 4px; background: var(--border);
    border-radius: 99px; overflow: hidden;
  }

  .iv-mini-fill {
    height: 100%; background: var(--primary); border-radius: 99px;
    transition: width 1.2s cubic-bezier(0.16,1,0.3,1);
  }

  /* ── MAIN CONTENT ── */
  .iv-main {
    padding: 22px 26px;
    display: flex; flex-direction: column; gap: 14px;
    overflow-y: auto;
  }

  .iv-ai-bar {
    display: flex; align-items: center; gap: 9px;
    padding: 10px 14px;
    background: var(--primary-pale);
    border: 1px solid var(--primary-border);
    border-radius: 10px;
    font-size: 12px; color: var(--primary); font-weight: 500;
    animation: bar-in 0.4s ease;
  }

  @keyframes bar-in { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

  .iv-ai-dot {
    width: 26px; height: 26px;
    background: var(--primary); border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 12px; flex-shrink: 0;
  }

  /* ── QUESTION CARD ── */
  .iv-qcard {
    background: var(--bg-white);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 26px;
    position: relative; overflow: hidden;
    box-shadow: var(--shadow);
    animation: slide-up 0.35s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes slide-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .iv-qcard::before {
    content: '';
    position: absolute; top:0; left:0; right:0; height:3px;
    background: var(--primary);
    border-radius: var(--r) var(--r) 0 0;
  }

  .iv-qcard-bg {
    position: absolute; top:-40px; right:-40px;
    width:140px; height:140px;
    background: var(--primary); border-radius:50%;
    opacity:0.04; pointer-events:none;
  }

  .iv-q-header {
    display: flex; align-items:center;
    justify-content:space-between; margin-bottom:14px;
  }

  .iv-q-lbl {
    font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:1px;
    color: var(--primary);
  }

  .iv-q-meta { font-size:11px; color:var(--text-3); font-weight:500; }

  .iv-q-text {
    font-size:17px; font-weight:600;
    line-height:1.65; color:var(--text-1);
    margin-bottom:18px; position:relative; z-index:1;
    letter-spacing:-0.2px;
  }

  .iv-topics {
    display:flex; align-items:center; gap:7px; flex-wrap:wrap;
    padding-top:14px; border-top:1px solid var(--border-soft);
  }

  .iv-topics-lbl {
    font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:0.8px; color:var(--text-3);
  }

  .iv-topic {
    font-size:11px; padding:3px 9px;
    background:var(--bg); border:1px solid var(--border);
    border-radius:5px; color:var(--text-2); font-weight:500;
  }

  /* ── ANSWER WORKSPACE ── */
  .iv-workspace {
    background: var(--bg-white);
    border:1px solid var(--border);
    border-radius: var(--r);
    overflow: hidden; box-shadow: var(--shadow);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .iv-workspace:focus-within {
    border-color: var(--primary-border);
    box-shadow: 0 0 0 3px rgba(62,180,137,0.1), var(--shadow);
  }

  .iv-ws-top {
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 16px; border-bottom:1px solid var(--border-soft);
    background: var(--bg);
  }

  .iv-ws-title {
    font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:1px; color:var(--text-3);
  }

  .iv-ws-meta { font-size:11px; color:var(--text-3); display:flex; gap:10px; }

  .iv-textarea {
    width:100%; min-height:190px;
    padding:16px; background:transparent;
    border:none; outline:none; resize:vertical;
    font-family:'Inter',sans-serif;
    font-size:14px; line-height:1.75; color:var(--text-1);
  }

  .iv-textarea::placeholder { color:var(--text-3); }
  .iv-textarea:disabled { opacity:0.5; cursor:not-allowed; }

  .iv-ws-bottom {
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 16px; border-top:1px solid var(--border-soft);
    background:var(--bg); flex-wrap:wrap; gap:10px;
  }

  .iv-hint { font-size:11px; color:var(--text-3); }

  .iv-submit-btn {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 22px; background:var(--primary); color:white;
    border:none; border-radius:8px;
    font-family:'Inter',sans-serif; font-weight:600; font-size:13px;
    cursor:pointer; transition:all 0.2s ease;
    box-shadow:0 2px 8px rgba(62,180,137,0.3); letter-spacing:-0.1px;
  }

  .iv-submit-btn:hover:not(:disabled) { background:var(--primary-light); transform:translateY(-1px); box-shadow:0 4px 14px rgba(62,180,137,0.4); }
  .iv-submit-btn:active:not(:disabled) { transform:scale(0.98); }
  .iv-submit-btn:disabled { opacity:0.35; cursor:not-allowed; box-shadow:none; }
  .iv-submit-btn.finish { background:var(--primary); }

  .iv-saving {
    display:flex; align-items:center; gap:8px;
    padding:9px 14px; background:var(--primary-pale);
    border:1px solid var(--primary-border); border-radius:8px;
    font-size:12px; color:var(--primary); font-weight:500;
  }

  /* ── SPINNERS ── */
  .iv-spin {
    width:13px; height:13px;
    border:2px solid rgba(62,180,137,0.2);
    border-top-color:var(--primary);
    border-radius:50%; animation:spin 0.65s linear infinite; flex-shrink:0;
  }

  .iv-spin-w {
    width:13px; height:13px;
    border:2px solid rgba(255,255,255,0.3);
    border-top-color:white;
    border-radius:50%; animation:spin 0.65s linear infinite; flex-shrink:0;
  }

  @keyframes spin { to { transform:rotate(360deg); } }

  /* ── LOADING ── */
  .iv-loading {
    position:fixed; inset:0;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    gap:14px; background:var(--bg); color:var(--text-3);
  }

  .iv-big-spin {
    width:40px; height:40px;
    border:3px solid var(--border);
    border-top-color:var(--primary);
    border-radius:50%; animation:spin 0.8s linear infinite;
  }

  /* ── COMPLETION ── */
  .iv-complete-wrap {
    grid-column:1/-1;
    padding:32px; max-width:700px;
    margin:0 auto; width:100%;
    animation:slide-up 0.5s cubic-bezier(0.16,1,0.3,1);
    overflow-y: auto;
  }

  .iv-complete-hero {
    background:var(--bg-white);
    border:1px solid var(--border);
    border-radius:var(--r);
    padding:40px; text-align:center;
    position:relative; overflow:hidden;
    margin-bottom:18px; box-shadow:var(--shadow-md);
  }

  .iv-complete-hero::before {
    content:''; position:absolute; top:0; left:0; right:0;
    height:4px; background:var(--primary);
  }

  .iv-complete-hero-bg {
    position:absolute; top:-50px; right:-50px;
    width:200px; height:200px; background:var(--primary);
    border-radius:50%; opacity:0.05; pointer-events:none;
  }

  .iv-complete-emoji {
    font-size:52px; display:block;
    margin-bottom:14px;
    animation:pop 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both;
    position:relative; z-index:1;
  }

  @keyframes pop { from{transform:scale(0.3);opacity:0} to{transform:scale(1);opacity:1} }

  .iv-complete-title {
    font-size:30px; font-weight:700;
    color:var(--text-1); margin-bottom:7px;
    letter-spacing:-1px; position:relative; z-index:1;
  }

  .iv-complete-sub {
    font-size:13px; color:var(--text-3);
    position:relative; z-index:1;
  }

  .iv-scores-grid {
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(130px,1fr));
    gap:12px; margin-bottom:16px;
  }

  .iv-score-tile {
    background:var(--bg-white);
    border:1px solid var(--border);
    border-radius:var(--r); padding:18px 14px;
    text-align:center; box-shadow:var(--shadow);
    animation:slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }

  .iv-score-tile:nth-child(1){animation-delay:.05s}
  .iv-score-tile:nth-child(2){animation-delay:.1s}
  .iv-score-tile:nth-child(3){animation-delay:.15s}
  .iv-score-tile:nth-child(4){animation-delay:.2s}
  .iv-score-tile:nth-child(5){animation-delay:.25s}

  .iv-score-tile.hero-tile {
    grid-column:1/-1; padding:22px;
    border-color:var(--primary-border);
    background:var(--primary-pale);
  }

  .iv-score-num {
    font-size:36px; font-weight:700;
    color:var(--text-1); line-height:1; letter-spacing:-1.5px;
  }

  .iv-score-tile.hero-tile .iv-score-num {
    font-size:52px; color:var(--primary); letter-spacing:-2px;
  }

  .iv-score-pct { font-size:18px; opacity:0.4; }
  .iv-score-tile.hero-tile .iv-score-pct { font-size:26px; }

  .iv-score-bar-track {
    height:4px; background:var(--border);
    border-radius:99px; margin:9px 0 7px; overflow:hidden;
  }

  .iv-score-tile.hero-tile .iv-score-bar-track { background:rgba(62,180,137,0.2); }

  .iv-score-bar {
    height:100%; background:var(--primary);
    border-radius:99px;
    transition:width 1.4s cubic-bezier(0.16,1,0.3,1);
  }

  .iv-score-name {
    font-size:10px; font-weight:600;
    text-transform:uppercase; letter-spacing:0.8px; color:var(--text-3);
  }

  .iv-calc {
    display:flex; align-items:center; justify-content:center;
    gap:6px; font-size:12px; color:var(--text-3); padding:7px 0;
  }

  .iv-complete-actions { display:flex; gap:10px; flex-wrap:wrap; }

  .iv-btn-cta {
    flex:1; min-width:130px; padding:12px 18px;
    background:var(--primary); color:white; border:none;
    border-radius:8px; font-family:'Inter',sans-serif;
    font-weight:600; font-size:13px; cursor:pointer;
    transition:all 0.2s ease;
    box-shadow:0 2px 8px rgba(62,180,137,0.3);
  }

  .iv-btn-cta:hover { background:var(--primary-light); transform:translateY(-1px); }

  .iv-btn-ghost {
    padding:12px 18px; background:var(--bg-white);
    color:var(--text-2); border:1px solid var(--border);
    border-radius:8px; font-family:'Inter',sans-serif;
    font-weight:500; font-size:13px; cursor:pointer;
    transition:all 0.2s ease; box-shadow:var(--shadow);
  }

  .iv-btn-ghost:hover { border-color:var(--primary-border); color:var(--primary); }

  @media (max-width:800px) {
    .iv { grid-template-columns:1fr; }
    .iv-sidebar { display:none; }
    .iv-main { padding:14px; }
  }
`;

/* ============================================================
   SCORE TILE COMPONENT
   ============================================================ */
const ScoreTile = ({ label, value, hero = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value == null) return;
    const target = Math.round(Number(value) || 0);
    let cur = 0;
    const steps = 80;
    const inc = target / steps;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target);
      setCount(Math.round(cur));
      if (cur >= target) clearInterval(t);
    }, 1400 / steps);
    return () => clearInterval(t);
  }, [value]);

  return (
    <div className={`iv-score-tile${hero ? " hero-tile" : ""}`}>
      {value != null ? (
        <>
          <div className="iv-score-num">
            {count}<span className="iv-score-pct">%</span>
          </div>
          <div className="iv-score-bar-track">
            <div className="iv-score-bar" style={{ width: `${count}%` }} />
          </div>
        </>
      ) : (
        <div className="iv-calc"><div className="iv-spin" />Evaluating</div>
      )}
      <div className="iv-score-name">{label}</div>
    </div>
  );
};

/* ============================================================
   TIMER COMPONENT
   ============================================================ */
const Timer = ({ duration, onTimeUp }) => {
  const [left, setLeft] = useState(duration);

  useEffect(() => { setLeft(duration); }, [duration]);

  useEffect(() => {
    if (left <= 0) { onTimeUp?.(); return; }
    const t = setInterval(() => setLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [left, onTimeUp]);

  const m   = Math.floor(left / 60);
  const s   = left % 60;
  const cls = left <= 30 ? "danger" : left <= 60 ? "caution" : "";

  return (
    <div className={`iv-timer-pill ${cls}`}>
      ⏱ {m}:{s.toString().padStart(2, "0")}
    </div>
  );
};

/* ============================================================
   MINI SCORE BAR
   ============================================================ */
const MiniBar = ({ label, value }) => (
  <div className="iv-mini-row">
    <div className="iv-mini-head">
      <span>{label}</span>
      <span>{value != null ? `${Math.round(value)}%` : "—"}</span>
    </div>
    <div className="iv-mini-track">
      <div className="iv-mini-fill" style={{ width: `${value || 0}%` }} />
    </div>
  </div>
);

/* ============================================================
   READY MODAL
   ============================================================ */
const ReadyModal = ({ onStart }) => (
  <div className="iv-overlay">
    <div className="iv-ready-modal">
      <div className="iv-modal-icon">🎯</div>
      <h2 className="iv-modal-title">Ready to Begin?</h2>
      <p className="iv-modal-sub">
        Your AI-powered technical interview is about to start.<br />
        Please read the rules carefully before proceeding.
      </p>

      <div className="iv-rules">
        {[
          { icon: "✓", type: "ok",  text: "Stay in full-screen mode for the entire session" },
          { icon: "✓", type: "ok",  text: "Answer each question within the 3-minute time limit" },
          { icon: "✓", type: "ok",  text: "Explain your reasoning clearly and with examples" },
          { icon: "✗", type: "bad", text: "Exiting full-screen will be flagged as a violation" },
          { icon: "✗", type: "bad", text: "Tab switching or window blur is monitored by AI" },
          { icon: "✗", type: "bad", text: "3 or more violations may disqualify your session" },
        ].map((r, i) => (
          <div key={i} className="iv-rule">
            <div className={`iv-rule-icon ${r.type}`}>{r.icon}</div>
            <span>{r.text}</span>
          </div>
        ))}
      </div>

      <button className="iv-start-btn" onClick={onStart}>
        ⚡ Start Interview in Full Screen
      </button>
    </div>
  </div>
);

/* ============================================================
   FRAUD ALERT MODAL
   ============================================================ */
const FraudModal = ({ count, onDismiss }) => (
  <div className="iv-fraud-overlay">
    <div className="iv-fraud-modal">
      <span className="iv-fraud-icon">🚨</span>
      <h3 className="iv-fraud-title">Security Violation Detected</h3>
      <p className="iv-fraud-msg">
        You exited full-screen mode. This action has been logged
        and flagged as a potential integrity violation.
        Please remain in full-screen for the entire session.
      </p>
      <div className="iv-fraud-count">
        ⚠ {count} Violation{count > 1 ? "s" : ""} Recorded
      </div>
      <button className="iv-fraud-btn" onClick={onDismiss}>
        Return to Full Screen
      </button>
    </div>
  </div>
);

/* ============================================================
   MAIN INTERVIEW COMPONENT
   ============================================================ */
const Interview = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const textareaRef  = useRef(null);
  const fsLockRef    = useRef(false);

  /* state */
  const [interview,     setInterview]     = useState(null);
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [answer,        setAnswer]        = useState("");
  const [loading,       setLoading]       = useState(true);
  const [submitting,    setSubmitting]    = useState(false);
  const [submitStep,    setSubmitStep]    = useState("");
  const [timerKey,      setTimerKey]      = useState(0);

  /* modals */
  const [showReady,     setShowReady]     = useState(true);
  const [showFraud,     setShowFraud]     = useState(false);
  const [violations,    setViolations]    = useState([]);

  /* integrity hook (tab-switch, copy-paste etc.) */
  const { violations: hookViolations } = useIntegrityMonitor(id);

  /* merge hook violations */
  useEffect(() => {
    if (hookViolations.length > violations.length) {
      setViolations(hookViolations);
    }
  }, [hookViolations]);

  /* ── LOAD INTERVIEW ── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res  = await getInterview(id);
        const data = res?.data || res;
        setInterview(data);
        setCurrentIndex(data.currentQuestion || 0);
      } catch {
        navigate("/candidate/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  /* ── FULLSCREEN HELPERS ── */
  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen request failed:", e);
    }
  }, []);

  const exitDetected = useCallback(() => {
    if (!document.fullscreenElement && !showReady && interview?.status !== "completed") {
      /* log violation */
      const newV = [...violations, { type: "fullscreen_exit", time: new Date().toISOString() }];
      setViolations(newV);
      setShowFraud(true);
    }
  }, [showReady, violations, interview]);

  /* ── FULLSCREEN CHANGE LISTENER ── */
  useEffect(() => {
    document.addEventListener("fullscreenchange", exitDetected);
    return () => document.removeEventListener("fullscreenchange", exitDetected);
  }, [exitDetected]);

  /* ── START INTERVIEW (Ready modal confirm) ── */
  const handleStart = useCallback(async () => {
    setShowReady(false);
    await enterFullscreen();
    setTimeout(() => textareaRef.current?.focus(), 300);
  }, [enterFullscreen]);

  /* ── RETURN TO FULLSCREEN (Fraud modal confirm) ── */
  const handleReturnFullscreen = useCallback(async () => {
    setShowFraud(false);
    await enterFullscreen();
    setTimeout(() => textareaRef.current?.focus(), 200);
  }, [enterFullscreen]);

  /* ── SUBMIT ANSWER ── */
  const handleSubmit = useCallback(async () => {
    if (!answer.trim() || submitting) return;
    const q = interview?.questions?.[currentIndex];
    if (!q) return;

    try {
      setSubmitting(true);
      setSubmitStep("Saving your answer...");

      const res     = await submitAnswer(interview._id, { questionId: q.id, answer });
    
      setSubmitStep("Loading next question...");
      const updated = res?.data || res;

      // ✅ ADD THIS - redirect to results when completed
      if (updated.status === "completed") {
        // Exit fullscreen cleanly before navigating
        if (document.fullscreenElement) {
          await document.exitFullscreen().catch(() => {});
        }
        navigate(`/candidate/results/${updated._id}`);
        return;
      }

      setInterview(updated);
      setAnswer("");
      setCurrentIndex(updated.currentQuestion || 0);
      setTimerKey(k => k + 1);
      setTimeout(() => textareaRef.current?.focus(), 100);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
      setSubmitStep("");
    }
  }, [answer, submitting, interview, currentIndex]);

  /* ── LOADING ── */
  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="iv-loading">
        <div className="iv-big-spin" />
        <span style={{ fontSize: 13 }}>Loading your session...</span>
      </div>
    </>
  );

  if (!interview) return (
    <>
      <style>{styles}</style>
      <div className="iv-loading">
        <p style={{ color: "var(--text-2)", marginBottom: 12 }}>Session not found.</p>
        <button className="iv-btn-cta" style={{ flex: "none" }}
          onClick={() => navigate("/candidate/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </>
  );

  /* ── COMPLETED ── */
  if (interview.status === "completed") {
    const s         = interview.overallScores;
    const hasScores = s && (s.competency > 0 || s.technical > 0);

    return (
      <>
        <style>{styles}</style>
        <div className="iv">
          <div className="iv-complete-wrap">
            <div className="iv-complete-hero">
              <div className="iv-complete-hero-bg" />
              <span className="iv-complete-emoji">🎯</span>
              <h1 className="iv-complete-title">Interview Complete</h1>
              <p className="iv-complete-sub">
                AI is analyzing your competency profile across all dimensions
              </p>
            </div>

            <div className="iv-scores-grid">
              <ScoreTile label="Overall Competency" value={hasScores ? s.competency    : null} hero />
              <ScoreTile label="Technical"           value={hasScores ? s.technical     : null} />
              <ScoreTile label="Communication"       value={hasScores ? s.communication : null} />
              <ScoreTile label="Confidence"          value={hasScores ? s.confidence    : null} />
              <ScoreTile label="Problem Solving"     value={hasScores ? s.problemSolving: null} />
            </div>

            {!hasScores && (
              <div className="iv-saving" style={{ marginBottom: 16 }}>
                <div className="iv-spin" />
                AI evaluation running in the background — click Refresh Scores in a few seconds
              </div>
            )}

            <div className="iv-complete-actions">
              <button className="iv-btn-cta"
                onClick={() => navigate("/candidate/dashboard")}>
                View Dashboard →
              </button>
              <button className="iv-btn-ghost"
                onClick={() => window.location.reload()}>
                ↺ Refresh Scores
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── ACTIVE INTERVIEW ── */
  const q          = interview?.questions?.[currentIndex];
  if (!q) return null;

  const total      = interview.questions?.length || 0;
  const isLast     = currentIndex === total - 1;
  const progress   = Math.round((currentIndex / total) * 100);
  const s          = interview.overallScores;
  const hasLive    = s && (s.technical > 0 || s.communication > 0);
  const vCount     = violations.length;

  return (
    <>
      <style>{styles}</style>

      {/* READY MODAL */}
      {showReady && <ReadyModal onStart={handleStart} />}

      {/* FRAUD MODAL */}
      {showFraud && <FraudModal count={vCount} onDismiss={handleReturnFullscreen} />}

      <div className="iv">

        {/* ── TOPBAR ── */}
        <div className="iv-top">
          <div className="iv-logo">
            <div className="iv-logo-icon">AI</div>
            <div>
              AI Recruiter
              <span className="iv-logo-sub">Intelligence Platform</span>
            </div>
          </div>

          <div className="iv-top-center">
            <div className="iv-prog-info">
              <span>Interview Progress</span>
              <span>{progress}% complete</span>
            </div>
            <div className="iv-prog-track">
              <div className="iv-prog-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="iv-top-right">
            <div className="iv-live-badge">
              <span className="iv-live-dot" />
              Live Session
            </div>

            {vCount > 0 && (
              <div className="iv-violation-pill"
                title="Click to view violations"
                onClick={() => setShowFraud(true)}>
                ⚠ {vCount} Violation{vCount > 1 ? "s" : ""}
              </div>
            )}

            <Timer key={timerKey} duration={180} onTimeUp={handleSubmit} />
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="iv-sidebar">
          <div>
            <div className="iv-s-label">Questions</div>
            <div className="iv-q-list">
              {interview.questions.map((_, i) => (
                <div key={i}
                  className={`iv-q-item ${
                    i < currentIndex ? "done"
                    : i === currentIndex ? "active"
                    : "pending"
                  }`}>
                  <div className="iv-q-num">{i + 1}</div>
                  <span style={{ flex: 1 }}>
                    {i < currentIndex ? "Answered"
                      : i === currentIndex ? "In Progress"
                      : "Upcoming"}
                  </span>
                  {i < currentIndex && <span style={{ fontSize: 11 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {hasLive && (
            <div>
              <div className="iv-s-label">Live Scores</div>
              <div className="iv-mini-scores">
                <MiniBar label="Technical"       value={s.technical} />
                <MiniBar label="Communication"   value={s.communication} />
                <MiniBar label="Confidence"      value={s.confidence} />
                <MiniBar label="Problem Solving" value={s.problemSolving} />
              </div>
            </div>
          )}
        </div>

        {/* ── MAIN ── */}
        <div className="iv-main">
          <div className="iv-ai-bar">
            <div className="iv-ai-dot">✦</div>
            AI is evaluating your answer across technical depth,
            communication clarity, and problem-solving approach
          </div>

          {/* QUESTION CARD */}
          <div className="iv-qcard" key={currentIndex}>
            <div className="iv-qcard-bg" />
            <div className="iv-q-header">
              <span className="iv-q-lbl">Question {currentIndex + 1} of {total}</span>
              <span className="iv-q-meta">{q.skill} · {q.type}</span>
            </div>
            <p className="iv-q-text">{q.question}</p>
            {q.expectedTopics?.length > 0 && (
              <div className="iv-topics">
                <span className="iv-topics-lbl">Cover:</span>
                {q.expectedTopics.map((t, i) => (
                  <span key={i} className="iv-topic">{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* ANSWER WORKSPACE */}
          <div className="iv-workspace">
            <div className="iv-ws-top">
              <div className="iv-ws-title">Your Answer</div>
              <div className="iv-ws-meta">
                <span>{answer.length} chars</span>
                {answer.split(/\s+/).filter(Boolean).length > 0 && (
                  <span>{answer.split(/\s+/).filter(Boolean).length} words</span>
                )}
              </div>
            </div>

            <textarea
              ref={textareaRef}
              className="iv-textarea"
              placeholder="Type your answer here. Be specific, structured, and explain your reasoning clearly..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={submitting}
            />

            <div className="iv-ws-bottom">
              <div className="iv-hint">
                ✦ AI scores clarity, technical depth, and structured thinking
              </div>
              <button
                className={`iv-submit-btn${isLast ? " finish" : ""}`}
                onClick={handleSubmit}
                disabled={submitting || !answer.trim()}
              >
                {submitting ? (
                  <><div className="iv-spin-w" />{submitStep || "Saving..."}</>
                ) : isLast ? (
                  <>Complete Interview ✓</>
                ) : (
                  <>Next Question →</>
                )}
              </button>
            </div>
          </div>

          {submitting && (
            <div className="iv-saving">
              <div className="iv-spin" />
              {submitStep}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Interview;