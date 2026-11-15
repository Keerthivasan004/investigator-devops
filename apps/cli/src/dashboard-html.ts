export function getEmbeddedUIDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark light" />
  <meta name="description" content="Incident investigation console for service operations. Read-only root-cause analysis with full traceability." />
  <title>DevOps Incident Investigator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* ============ AI DevOps Investigator — Design Tokens ============ */
    :root, :root[data-theme="dark"] {
      --bg: #060c18;
      --bg-subtle: #0a1322;
      --card: #0e1930;
      --card-head: #13203a;
      --card-inset: #0a1224;
      --thead-bg: #111e36;
      --input-bg: #0a1224;
      --border: #1c2c48;
      --border-bright: #2b4066;
      --border-focus: #049fd9;
      --text: #eef4fb;
      --text-muted: #c3d0e3;
      --text-faint: #8296b1;
      --brand: #049fd9;
      --brand-deep: #0a7fae;
      --brand-ink: #7cc7e9;
      --primary: #c3d0e3;
      --primary-soft: rgba(4, 159, 217, 0.12);
      --primary-ring: rgba(4, 159, 217, 0.32);
      --accent: #4cc1eb;
      --accent-strong: #049fd9;
      --accent-bg: rgba(4, 159, 217, 0.13);
      --accent-border: rgba(76, 193, 235, 0.35);
      --success: #7ce3a8;
      --success-strong: #6cc24a;
      --success-bg: rgba(108, 194, 74, 0.13);
      --success-border: rgba(108, 194, 74, 0.42);
      --warn: #ffc857;
      --warn-strong: #fbab2c;
      --warn-bg: rgba(251, 171, 44, 0.13);
      --warn-border: rgba(251, 171, 44, 0.42);
      --danger: #ff8a80;
      --danger-strong: #e2231a;
      --danger-bg: rgba(226, 35, 26, 0.14);
      --danger-border: rgba(255, 138, 128, 0.42);
      --purple: #c9a6f5;
      --purple-bg: rgba(155, 105, 228, 0.14);
      --purple-border: rgba(201, 166, 245, 0.38);
      --btn-bg: #049fd9;
      --btn-bg-hover: #0378a6;
      --btn-text: #04121c;
      --btn-border: #049fd9;
      --tag-bg: #16263f;
      --tag-text: #eef4fb;
      --track-bg: #0a1224;
      --thumb: #2b4066;
      --thumb-hover: #3b587f;
      --zebra: rgba(4, 159, 217, 0.05);
      --nav-bg: rgba(6, 12, 24, 0.88);
      --shadow: 0 12px 32px rgba(0, 0, 0, 0.42);
      --shadow-sm: 0 4px 14px rgba(0, 0, 0, 0.3);
      --radius: 14px;
      --radius-sm: 9px;
      color-scheme: dark;
    }
    :root[data-theme="light"] {
      --bg: #edf1f6;
      --bg-subtle: #e4e9f1;
      --card: #ffffff;
      --card-head: #f2f6fb;
      --card-inset: #f6f9fc;
      --thead-bg: #eef3f9;
      --input-bg: #ffffff;
      --border: #d9e0ea;
      --border-bright: #b9c6d8;
      --border-focus: #0076a8;
      --text: #0d1b2a;
      --text-muted: #33475f;
      --text-faint: #64748f;
      --brand: #0076a8;
      --brand-deep: #005073;
      --brand-ink: #0076a8;
      --primary: #33475f;
      --primary-soft: rgba(0, 118, 168, 0.08);
      --primary-ring: rgba(0, 118, 168, 0.2);
      --accent: #0076a8;
      --accent-strong: #0076a8;
      --accent-bg: #e6f4fa;
      --accent-border: #a9d6e9;
      --success: #1d7a3a;
      --success-strong: #25813f;
      --success-bg: #e8f6ec;
      --success-border: #a9d9b8;
      --warn: #935705;
      --warn-strong: #b7791f;
      --warn-bg: #fff6e0;
      --warn-border: #f0d48a;
      --danger: #a4121f;
      --danger-strong: #c41230;
      --danger-bg: #fdeef0;
      --danger-border: #f3b3bb;
      --purple: #5b21b6;
      --purple-bg: #f1eafe;
      --purple-border: #cdbcf0;
      --btn-bg: #049fd9;
      --btn-bg-hover: #0076a8;
      --btn-text: #ffffff;
      --btn-border: #049fd9;
      --tag-bg: #eef2f7;
      --tag-text: #0d1b2a;
      --track-bg: #e7edf4;
      --thumb: #b9c6d8;
      --thumb-hover: #8ea0b8;
      --zebra: #f5f9fd;
      --nav-bg: rgba(255, 255, 255, 0.92);
      --shadow: 0 12px 28px rgba(13, 27, 42, 0.1);
      --shadow-sm: 0 3px 10px rgba(13, 27, 42, 0.08);
      color-scheme: light;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    html, body {
      width: 100%; min-height: 100vh; overflow-x: hidden;
      background: var(--bg); color: var(--text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px; line-height: 1.55;
      -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
      transition: background 0.2s ease, color 0.2s ease;
    }
    body::before {
      content: ""; position: fixed; inset: 0 0 auto 0; height: 3px; z-index: 60;
      background: linear-gradient(90deg, #049fd9 0%, #6cc24a 55%, #fbab2c 100%);
    }
    :focus-visible { outline: 2px solid var(--border-focus); outline-offset: 2px; border-radius: 6px; }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--thumb); border-radius: 999px; border: 2px solid transparent; background-clip: content-box; }
    ::-webkit-scrollbar-thumb:hover { background: var(--thumb-hover); background-clip: content-box; }
    .skip-link { position: absolute; left: -9999px; top: 0; background: var(--btn-bg); color: #fff; padding: 10px 16px; border-radius: 0 0 8px 0; z-index: 100; font-weight: 700; }
    .skip-link:focus { left: 0; }

    /* Top utility bar */
    .topbar { border-bottom: 1px solid var(--border); background: var(--card); font-size: 12px; color: var(--text-muted); position: sticky; top: 0; z-index: 40; backdrop-filter: blur(10px); }
    .topbar-inner { max-width: 1080px; margin: 0 auto; padding: 9px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .topbar-brand { display: flex; align-items: center; gap: 10px; font-weight: 700; color: var(--text); letter-spacing: -0.1px; min-width: 0; }
    .topbar-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--success-strong); box-shadow: 0 0 0 4px var(--success-bg); flex-shrink: 0; }
    .topbar-meta { color: var(--text-faint); font-size: 12px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
    .topbar-kbd { font-family: 'JetBrains Mono', monospace; font-size: 11px; border: 1px solid var(--border-bright); border-radius: 6px; padding: 1px 6px; color: var(--text-faint); }

    .app-container { max-width: 1220px; margin: 0 auto; padding: 24px 24px 70px; width: 100%; }

    /* Console masthead */
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; gap: 18px; flex-wrap: wrap; margin-bottom: 14px; }
    .title-group { display: flex; align-items: center; gap: 14px; min-width: 0; flex: 1 1 420px; }
    .brand-mark { width: 46px; height: 46px; border-radius: 12px; background: linear-gradient(135deg, #049fd9 0%, #005073 60%, #0b1e33 100%); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; letter-spacing: 0.4px; flex-shrink: 0; box-shadow: var(--shadow-sm); border: 1px solid rgba(255,255,255,0.16); }
    .title-group h1 { font-size: 19px; font-weight: 800; letter-spacing: -0.3px; color: var(--text); line-height: 1.3; overflow-wrap: anywhere; }
    .title-group .subtitle { font-size: 13px; color: var(--text-muted); margin-top: 2px; max-width: 62ch; }
    .title-group .author { font-size: 12px; color: var(--text-faint); margin-top: 3px; }
    .author strong { color: var(--text-muted); font-weight: 700; }

    /* Control deck — clear primary action hierarchy */
    .controls { display: flex; align-items: stretch; gap: 10px; flex-wrap: wrap; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 14px; box-shadow: var(--shadow-sm); flex: 1 1 520px; min-width: 0; }
    .control-box { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .control-box.grow-path { flex: 1 1 220px; } .control-box.grow-target { flex: 1.4 1 280px; }
    .control-label { font-size: 10.5px; color: var(--text-faint); font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; display: flex; align-items: center; gap: 6px; }
    .control-hint { font-size: 11px; color: var(--text-faint); font-weight: 500; text-transform: none; letter-spacing: 0; }
    select, #project-path-input {
      background: var(--input-bg); border: 1px solid var(--border-bright); color: var(--text);
      padding: 10px 12px; border-radius: var(--radius-sm); font-size: 13px; font-family: inherit; outline: none;
      transition: border-color 0.15s, box-shadow 0.15s; width: 100%;
    }
    select:focus, #project-path-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--primary-ring); }
    #project-path-input { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
    #project-path-input::placeholder { color: var(--text-faint); font-family: 'Inter', sans-serif; }
    .control-actions { display: flex; align-items: flex-end; gap: 8px; flex-wrap: wrap; margin-left: auto; }
    .btn { background: var(--btn-bg); color: #fff; border: 1px solid var(--btn-border); padding: 10px 18px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 750; font-family: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s, transform 0.05s, box-shadow 0.15s; white-space: nowrap; box-shadow: 0 4px 12px rgba(4,159,217,0.28); }
    .btn:hover { background: var(--btn-bg-hover); }
    .btn:active { transform: translateY(1px); }
    .btn:disabled { opacity: 0.6; cursor: wait; }
    .btn-stop { background: transparent; color: var(--danger-strong); border: 1px solid var(--danger-border); box-shadow: none; }
    :root[data-theme="dark"] .btn-stop { color: var(--danger); }
    .btn-stop:hover { background: var(--danger-bg); }
    .theme-toggle { display: inline-flex; align-items: center; gap: 7px; background: var(--input-bg); color: var(--text-muted); border: 1px solid var(--border-bright); padding: 9px 13px; border-radius: var(--radius-sm); font-size: 12.5px; font-weight: 700; font-family: inherit; cursor: pointer; transition: border-color 0.15s, color 0.15s; }
    .theme-toggle:hover { border-color: var(--border-focus); color: var(--text); }
    .theme-toggle svg { width: 14px; height: 14px; flex-shrink: 0; }
    .badge-engine { font-size: 10px; font-weight: 800; color: var(--success); border: 1px solid var(--success-border); background: var(--success-bg); padding: 6px 10px; border-radius: 999px; letter-spacing: 0.7px; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; align-self: center; }
    .badge-engine i { width: 7px; height: 7px; border-radius: 999px; background: var(--success-strong); display: inline-block; }

    /* Sticky investigation stepper — same 6 steps, faster wayfinding */
    .section-nav { position: sticky; top: 41px; z-index: 30; background: var(--nav-bg); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 999px; padding: 6px; display: flex; gap: 4px; overflow-x: auto; margin-bottom: 20px; box-shadow: var(--shadow-sm); scrollbar-width: none; }
    .section-nav::-webkit-scrollbar { display: none; }
    .section-nav a { flex: 1 0 auto; text-align: center; text-decoration: none; font-size: 12px; font-weight: 700; color: var(--text-faint); padding: 8px 14px; border-radius: 999px; white-space: nowrap; transition: all 0.15s; border: 1px solid transparent; }
    .section-nav a:hover { color: var(--text); background: var(--primary-soft); }
    .section-nav a.active { color: var(--accent); background: var(--accent-bg); border-color: var(--accent-border); }
    .section-nav a .n { font-family: 'JetBrains Mono', monospace; font-size: 11px; opacity: 0.8; margin-right: 5px; }

    .error-box { background: var(--danger-bg); border: 1px solid var(--danger-border); color: var(--danger); padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 16px; display: none; word-break: break-word; overflow-wrap: anywhere; font-size: 13px; font-weight: 600; }
    .loading-banner { display: none; align-items: center; gap: 10px; background: var(--accent-bg); border: 1px solid var(--accent-border); color: var(--accent); padding: 11px 16px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 13px; font-weight: 600; }
    :root[data-theme="light"] .loading-banner, :root[data-theme="light"] .error-box { color: var(--text); }
    .loading-banner.visible { display: flex; }
    .spinner { width: 15px; height: 15px; border-radius: 999px; border: 2px solid var(--accent-border); border-top-color: var(--accent); animation: spin 0.8s linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Scope cards — project + target at a glance */
    .meta-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; margin-bottom: 18px; }
    @media (max-width: 860px) { .meta-grid { grid-template-columns: minmax(0, 1fr); } }
    .meta-section { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 17px 20px; box-shadow: var(--shadow-sm); min-width: 0; position: relative; overflow: hidden; }
    .meta-section::after { display: none; }
    .meta-section.target-card::after { display: none; }
    .meta-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; padding-bottom: 11px; border-bottom: 1px solid var(--border); }
    .meta-title-cluster { display: flex; align-items: center; gap: 9px; min-width: 0; flex-wrap: wrap; }
    .meta-badge-proj, .meta-badge-target { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 800; letter-spacing: 0.7px; padding: 3px 9px; border-radius: 6px; text-transform: uppercase; white-space: nowrap; }
    .meta-badge-proj { background: var(--accent-bg); color: var(--accent); border: 1px solid var(--accent-border); }
    .meta-badge-target { background: var(--warn-bg); color: var(--warn); border: 1px solid var(--warn-border); }
    :root[data-theme="light"] .meta-badge-target { color: var(--warn-strong); }
    .meta-status-pill, .meta-count-pill { font-size: 11.5px; font-weight: 700; color: var(--text-faint); display: inline-flex; align-items: center; gap: 6px; }
    .meta-status-pill::before { content: ""; width: 7px; height: 7px; border-radius: 999px; background: var(--success-strong); display: inline-block; }
    .meta-type-pill { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; background: var(--card-inset); border: 1px solid var(--border-bright); color: var(--text-muted); white-space: nowrap; }
    .meta-body { display: flex; flex-direction: column; gap: 9px; }
    .meta-field { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; line-height: 1.55; min-width: 0; }
    .meta-label { font-size: 10.5px; font-weight: 800; color: var(--text-faint); min-width: 108px; text-transform: uppercase; letter-spacing: 0.6px; flex-shrink: 0; padding-top: 2px; }
    .meta-val-highlight { color: var(--text); font-weight: 750; font-size: 14px; overflow-wrap: anywhere; word-break: break-word; }
    .meta-val-code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted); word-break: break-all; overflow-wrap: anywhere; background: var(--card-inset); border: 1px solid var(--border); padding: 3px 8px; border-radius: 6px; display: inline-block; max-width: 100%; }
    .meta-val-target { color: var(--text); font-weight: 750; font-size: 14px; overflow-wrap: anywhere; word-break: break-word; }
    .meta-val-summary { color: var(--text-muted); font-size: 13px; overflow-wrap: anywhere; word-break: break-word; }

    /* Verdict hero — KPI cards spill every key number */
    .root-cause-hero { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 26px 20px; margin-bottom: 30px; box-shadow: var(--shadow); position: relative; overflow: hidden; }
    .root-cause-hero::before { display: none; }
    .root-cause-hero::after { content: ""; position: absolute; right: -70px; top: -70px; width: 220px; height: 220px; border-radius: 999px; background: radial-gradient(circle, rgba(4,159,217,0.16) 0%, transparent 70%); pointer-events: none; }
    .rc-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
    .rc-badges-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .rc-badge-primary { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 800; letter-spacing: 0.7px; padding: 5px 11px; border-radius: 7px; background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger-border); text-transform: uppercase; display: inline-flex; align-items: center; gap: 6px; }
    .rc-badge-primary::before { content: ""; width: 7px; height: 7px; border-radius: 999px; background: var(--danger-strong); display: inline-block; }
    .rc-conf-pill { font-size: 11.5px; font-weight: 800; padding: 5px 12px; border-radius: 999px; white-space: nowrap; border: 1px solid; }
    .rc-conf-pill.high { background: var(--success-bg); color: var(--success); border-color: var(--success-border); }
    .rc-conf-pill.med { background: var(--warn-bg); color: var(--warn); border-color: var(--warn-border); }
    .rc-conf-pill.low { background: var(--danger-bg); color: var(--danger); border-color: var(--danger-border); }
    :root[data-theme="light"] .rc-conf-pill.high { color: var(--success-strong); }
    :root[data-theme="light"] .rc-conf-pill.med { color: var(--warn-strong); }
    :root[data-theme="light"] .rc-conf-pill.low { color: var(--danger-strong); }
    .rc-rule-pill { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 7px; background: var(--accent-bg); color: var(--accent); border: 1px solid var(--accent-border); white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
    .rc-status-tag { font-size: 12px; font-weight: 600; color: var(--text-faint); }
    .rc-headline-box { margin-bottom: 16px; }
    .rc-headline-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--danger); margin-bottom: 7px; display: flex; align-items: center; gap: 7px; }
    :root[data-theme="light"] .rc-headline-label { color: var(--danger-strong); }
    .rc-headline-value { font-size: 22px; font-weight: 800; letter-spacing: -0.35px; color: var(--text); line-height: 1.38; overflow-wrap: anywhere; word-break: break-word; max-width: 62ch; }
    .rc-values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 270px), 1fr)); gap: 12px; margin-bottom: 18px; }
    .rc-value-card { background: var(--card-inset); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 16px; display: flex; flex-direction: column; gap: 7px; min-width: 0; }
    .rc-value-card.proof-card { border-color: var(--success-border); background: linear-gradient(180deg, var(--success-bg), var(--card-inset)); }
    .rc-val-label { font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--brand-ink); display: flex; align-items: center; gap: 6px; }
    .rc-val-text { font-size: 13px; color: var(--text-muted); line-height: 1.6; overflow-wrap: anywhere; word-break: break-word; }
    .rc-val-text.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
    .metrics-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr)); gap: 12px; padding-top: 16px; border-top: 1px solid var(--border); }
    .metric-item { display: flex; flex-direction: column; gap: 3px; min-width: 0; background: var(--card-inset); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; }
    .metric-label { font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--text-faint); }
    .metric-val { font-size: 22px; font-weight: 800; letter-spacing: -0.3px; color: var(--text); line-height: 1.2; font-variant-numeric: tabular-nums; }
    .metric-val.accent { color: var(--brand-ink); }
    .metric-sub { font-size: 11.5px; color: var(--text-faint); }
    .conf-meter { height: 6px; background: var(--track-bg); border-radius: 999px; overflow: hidden; margin-top: 6px; border: 1px solid var(--border); }
    .conf-meter-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--brand), var(--success-strong)); transition: width 0.5s ease; }

    /* Step sections — numbered SRE runbook */
    .step-section { margin-bottom: 30px; padding-bottom: 26px; border-bottom: 1px solid var(--border); scroll-margin-top: 120px; }
    .step-section:last-of-type { border-bottom: none; margin-bottom: 12px; padding-bottom: 0; }
    .step-section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; gap: 12px; flex-wrap: wrap; }
    .step-section-title { font-size: 15.5px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 10px; letter-spacing: -0.15px; }
    .step-num-badge { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #fff; background: linear-gradient(135deg, #049fd9, #005073); padding: 4px 9px; border-radius: 7px; letter-spacing: 0.4px; }
    .step-section-meta { font-size: 12px; color: var(--text-faint); font-weight: 650; background: var(--card); border: 1px solid var(--border); padding: 4px 11px; border-radius: 999px; white-space: nowrap; }
    .step-section-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; line-height: 1.6; max-width: 82ch; }

    .skeleton { border-radius: 8px; background: linear-gradient(90deg, var(--card-inset) 25%, var(--primary-soft) 50%, var(--card-inset) 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border: 1px solid var(--border); }
    @keyframes shimmer { to { background-position: -200% 0; } }

    /* Timeline — severity rail */
    .timeline-list { display: flex; flex-direction: column; padding-left: 2px; }
    .timeline-row { display: flex; gap: 15px; min-width: 0; }
    .timeline-rail { display: flex; flex-direction: column; align-items: center; width: 18px; flex-shrink: 0; padding-top: 5px; }
    .timeline-dot { width: 11px; height: 11px; border-radius: 999px; background: var(--border-bright); z-index: 1; border: 2px solid var(--bg); box-shadow: 0 0 0 2px var(--border); }
    .timeline-row.initial_trigger .timeline-dot { background: var(--brand); box-shadow: 0 0 0 3px var(--accent-bg); }
    .timeline-row.state_change .timeline-dot { background: var(--danger-strong); box-shadow: 0 0 0 3px var(--danger-bg); }
    .timeline-row.user_visible_symptom .timeline-dot { background: var(--warn-strong); box-shadow: 0 0 0 3px var(--warn-bg); }
    .timeline-stem { width: 2px; flex: 1; background: var(--border); min-height: 22px; margin-top: 3px; border-radius: 2px; }
    .timeline-item { flex: 1; min-width: 0; padding-bottom: 15px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 11px 14px; margin-bottom: 12px; transition: border-color 0.15s; }
    .timeline-item:hover { border-color: var(--border-focus); }
    .timeline-row:last-child .timeline-item { margin-bottom: 2px; }
    .timeline-row:last-child .timeline-stem { display: none; }
    .time-header { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-family: 'JetBrains Mono', monospace; color: var(--text-faint); margin-bottom: 4px; flex-wrap: wrap; }
    .time-chip { background: var(--card-inset); border: 1px solid var(--border); border-radius: 6px; padding: 1px 7px; font-variant-numeric: tabular-nums; }
    .service-tag { color: var(--text-muted); font-size: 11px; font-weight: 700; background: var(--primary-soft); border: 1px solid var(--border); padding: 1px 8px; border-radius: 999px; font-family: 'Inter', sans-serif; }
    .timeline-text { font-size: 13.5px; color: var(--text); line-height: 1.6; overflow-wrap: anywhere; word-break: break-word; }
    .sig-tag { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--text-faint); margin-top: 5px; display: inline-flex; align-items: center; gap: 6px; }

    /* Causal flow — numbered propagation */
    .causal-flow { display: flex; flex-direction: column; padding-left: 2px; }
    .causal-node { display: flex; gap: 14px; min-width: 0; padding-bottom: 14px; }
    .causal-node:last-child { padding-bottom: 0; }
    .causal-rail { display: flex; flex-direction: column; align-items: center; width: 30px; flex-shrink: 0; }
    .causal-dot { width: 30px; height: 30px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #fff; background: var(--border-bright); flex-shrink: 0; z-index: 1; border: 2px solid var(--bg); box-shadow: var(--shadow-sm); font-variant-numeric: tabular-nums; }
    .causal-dot.root_cause { background: linear-gradient(135deg, #e2231a, #8f1210); }
    .causal-dot.contributing_factor { background: linear-gradient(135deg, #fbab2c, #b7791f); }
    .causal-dot.system_effect { background: linear-gradient(135deg, #049fd9, #005073); }
    .causal-dot.user_visible_symptom { background: linear-gradient(135deg, #64748b, #334155); }
    .causal-line { width: 3px; flex: 1; background: linear-gradient(180deg, var(--border-bright), var(--border)); margin: 6px 0; min-height: 14px; border-radius: 3px; }
    .causal-step-content { flex: 1; min-width: 0; padding-top: 1px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 13px 16px; transition: border-color 0.15s, transform 0.15s; }
    .causal-step-content:hover { border-color: var(--border-focus); }
    .step-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
    .step-role-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--text-muted); }
    .step-ref-pill { font-size: 11px; font-weight: 700; color: var(--success); background: var(--success-bg); border: 1px solid var(--success-border); padding: 2px 9px; border-radius: 999px; white-space: nowrap; }
    :root[data-theme="light"] .step-ref-pill { color: var(--success-strong); }
    .step-desc { font-size: 13.5px; font-weight: 550; color: var(--text); line-height: 1.6; overflow-wrap: anywhere; word-break: break-word; }

    /* Hypotheses — adversarial cards */
    .hypo-list { display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
    .hypo-row { padding: 17px 20px; border-bottom: 1px solid var(--border); }
    .hypo-row:last-child { border-bottom: none; }
    .hypo-row.is-confirmed { }
    .hypo-row.is-ruledout { opacity: 0.96; }
    .hypo-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 9px; flex-wrap: wrap; }
    .hypo-title { font-size: 14px; font-weight: 700; color: var(--text); line-height: 1.5; overflow-wrap: anywhere; word-break: break-word; flex: 1; min-width: min(100%, 240px); }
    .hypo-id { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--brand-ink); background: var(--accent-bg); border: 1px solid var(--accent-border); padding: 2px 7px; border-radius: 6px; margin-right: 7px; white-space: nowrap; }
    .pill { font-size: 10.5px; font-weight: 800; letter-spacing: 0.5px; padding: 4px 11px; border-radius: 999px; white-space: nowrap; flex-shrink: 0; }
    .pill.confirmed { background: var(--success-strong); color: #fff; }
    .pill.disproven { background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger-border); }
    .pill.investigating { background: var(--warn-bg); color: var(--warn); border: 1px solid var(--warn-border); }
    :root[data-theme="light"] .pill.investigating { color: var(--warn-strong); }
    :root[data-theme="light"] .pill.disproven { color: var(--danger-strong); }
    .progress-bar-bg { height: 7px; background: var(--track-bg); border: 1px solid var(--border); border-radius: 999px; overflow: hidden; margin-bottom: 9px; }
    .progress-bar-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
    .hypo-meta { font-size: 12.8px; color: var(--text-muted); line-height: 1.6; margin-bottom: 9px; overflow-wrap: anywhere; word-break: break-word; }
    .hypo-chips { display: flex; gap: 8px 10px; flex-wrap: wrap; align-items: center; }
    .chip { font-size: 12px; font-weight: 650; color: var(--text-muted); background: var(--card-inset); border: 1px solid var(--border); padding: 3px 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 5px; }
    .chip.good { color: var(--success); border-color: var(--success-border); background: var(--success-bg); }
    .chip.bad { color: var(--danger); border-color: var(--danger-border); background: var(--danger-bg); }
    :root[data-theme="light"] .chip.good { color: var(--success-strong); }
    :root[data-theme="light"] .chip.bad { color: var(--danger-strong); }
    .chip-refs { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); background: var(--accent-bg); border: 1px solid var(--accent-border); padding: 3px 9px; border-radius: 999px; overflow-wrap: anywhere; word-break: break-all; }
    :root[data-theme="light"] .chip-refs { color: var(--brand-deep); }
    .hypo-verdict { font-size: 12.5px; font-weight: 650; margin-top: 9px; padding: 9px 13px; border-radius: var(--radius-sm); line-height: 1.55; }
    .hypo-verdict.good { color: var(--success); background: var(--success-bg); border: 1px solid var(--success-border); }
    .hypo-verdict.bad { color: var(--danger); background: var(--danger-bg); border: 1px solid var(--danger-border); }
    :root[data-theme="light"] .hypo-verdict.good { color: var(--success-strong); }
    :root[data-theme="light"] .hypo-verdict.bad { color: var(--danger-strong); }

    /* Actions — operator runbook */
    .actions-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
    .actions-list { display: flex; flex-direction: column; }
    .action-row { display: flex; align-items: flex-start; gap: 13px; padding: 14px 20px; border-bottom: 1px solid var(--border); font-size: 13.5px; line-height: 1.6; color: var(--text); }
    .action-row:last-child { border-bottom: none; }
    .action-row:hover { background: var(--zebra); }
    .action-num { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: #fff; background: linear-gradient(135deg, #049fd9, #005073); min-width: 28px; height: 28px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .action-content { flex: 1; min-width: 0; overflow-wrap: anywhere; word-break: break-word; }
    .cmd-pill, .path-pill { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 6px; display: inline-block; overflow-wrap: anywhere; word-break: break-all; }
    .cmd-pill { background: var(--input-bg); border: 1px solid var(--border-bright); color: var(--accent); }
    :root[data-theme="light"] .cmd-pill { color: var(--brand-deep); }
    .path-pill { background: var(--primary-soft); border: 1px solid var(--border); color: var(--text-muted); }
    .action-footer-note { font-size: 12px; color: var(--text-faint); padding: 12px 20px; border-top: 1px dashed var(--border); background: var(--card-inset); line-height: 1.55; }

    /* Safeguards — observability triptych */
    .safeguard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 12px; }
    .safeguard-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 17px 18px; min-width: 0; }
    .safeguard-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--text-muted); margin-bottom: 11px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .safeguard-count { font-family: 'JetBrains Mono', monospace; font-size: 11px; background: var(--card-inset); border: 1px solid var(--border); padding: 2px 8px; border-radius: 999px; color: var(--text-faint); }
    .guardrails-list { display: flex; flex-direction: column; gap: 8px; }
    .guardrail-item { font-size: 12.8px; color: var(--text-muted); display: flex; gap: 9px; align-items: flex-start; line-height: 1.55; }
    .guardrail-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--success-strong); margin-top: 6px; flex-shrink: 0; box-shadow: 0 0 0 3px var(--success-bg); }
    .gap-row { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; padding: 8px 0; border-bottom: 1px solid var(--border); }
    .gap-row:last-child { border-bottom: none; }
    .badge-gap, .badge-ruled-out { font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; flex-shrink: 0; margin-top: 2px; letter-spacing: 0.5px; }
    .badge-gap { background: var(--warn-bg); color: var(--warn); border: 1px solid var(--warn-border); }
    .badge-ruled-out { background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger-border); }
    :root[data-theme="light"] .badge-gap { color: var(--warn-strong); }
    :root[data-theme="light"] .badge-ruled-out { color: var(--danger-strong); }
    .gap-name { font-weight: 650; color: var(--text); overflow-wrap: anywhere; word-break: break-word; }
    .gap-hint { font-size: 12px; color: var(--text-faint); margin-top: 2px; line-height: 1.5; }
    .coverage-good { font-size: 12.8px; color: var(--success); font-weight: 650; padding: 6px 0; display: flex; gap: 8px; align-items: center; }
    :root[data-theme="light"] .coverage-good { color: var(--success-strong); }

    /* Evidence inspector */
    .filter-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 14px; position: sticky; top: 104px; z-index: 20; box-shadow: var(--shadow-sm); }
    .filter-pills { display: flex; gap: 6px; flex-wrap: wrap; }
    .filter-pill { background: var(--card-inset); border: 1px solid var(--border); color: var(--text-muted); padding: 8px 14px; border-radius: 999px; font-size: 12.5px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: all 0.15s ease; font-family: inherit; }
    .filter-pill:hover { color: var(--text); border-color: var(--border-focus); }
    .filter-pill.active { background: var(--accent-bg); border-color: var(--accent-border); color: var(--accent); font-weight: 800; }
    :root[data-theme="light"] .filter-pill.active { color: var(--brand-deep); }
    .filter-pill .count { font-size: 11px; font-weight: 800; background: var(--primary-soft); border-radius: 999px; padding: 1px 8px; font-variant-numeric: tabular-nums; }
    .filter-pill.active .count { background: transparent; }
    .evidence-search-wrap { position: relative; flex: 1 1 220px; max-width: 320px; min-width: 200px; }
    .evidence-search-box { background: var(--input-bg); border: 1px solid var(--border-bright); color: var(--text); padding: 9px 13px 9px 34px; border-radius: var(--radius-sm); font-size: 12.5px; font-family: inherit; outline: none; width: 100%; transition: border-color 0.15s, box-shadow 0.15s; }
    .evidence-search-box:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--primary-ring); }
    .evidence-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--text-faint); pointer-events: none; }
    .table-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
    .table-wrap { overflow-x: auto; max-height: 600px; overflow-y: auto; }
    .ev-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; min-width: 720px; }
    .ev-table thead th { position: sticky; top: 0; z-index: 2; background: var(--thead-bg); padding: 12px 14px; border-bottom: 1px solid var(--border-bright); font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--text-faint); white-space: nowrap; }
    .ev-table td { padding: 13px 14px; border-bottom: 1px solid var(--border); vertical-align: top; color: var(--text); line-height: 1.6; }
    .ev-table tbody tr { transition: background 0.12s; }
    .ev-table tbody tr:hover td { background: var(--zebra); }
    .ev-table tbody tr:last-child td { border-bottom: none; }
    .ev-table tbody tr.is-proving td:first-child { }
    .col-num { width: 54px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-faint); font-weight: 700; font-variant-numeric: tabular-nums; }
    .col-sev { width: 158px; }
    .col-source { width: 220px; }
    .badge-sev { display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px; border-radius: 7px; font-size: 10.5px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; white-space: nowrap; }
    .badge-sev::before { content: ""; width: 7px; height: 7px; border-radius: 999px; background: currentColor; display: inline-block; }
    .badge-sev.critical { background: var(--danger-strong); color: #fff; }
    .badge-sev.critical::before { background: #fff; }
    .badge-sev.error { background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger-border); }
    .badge-sev.warn { background: var(--warn-bg); color: var(--warn); border: 1px solid var(--warn-border); }
    .badge-sev.info { background: var(--accent-bg); color: var(--accent); border: 1px solid var(--accent-border); }
    :root[data-theme="light"] .badge-sev.error { color: var(--danger-strong); }
    :root[data-theme="light"] .badge-sev.warn { color: var(--warn-strong); }
    :root[data-theme="light"] .badge-sev.info { color: var(--brand-deep); }
    .badge-proves { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; color: var(--success); margin-top: 6px; white-space: nowrap; }
    :root[data-theme="light"] .badge-proves { color: var(--success-strong); }
    .source-container { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .source-pill { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: var(--text); display: inline-block; word-break: break-all; overflow-wrap: anywhere; }
    .source-dir { font-size: 11px; color: var(--text-faint); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; font-family: 'JetBrains Mono', monospace; }
    .ev-msg-text { font-size: 13px; color: var(--text); word-break: break-word; overflow-wrap: anywhere; line-height: 1.6; }
    .ev-expand-btn { background: none; border: none; color: var(--brand-ink); font-size: 12px; font-weight: 700; font-family: inherit; cursor: pointer; padding: 4px 0; margin-top: 3px; display: inline-flex; align-items: center; gap: 5px; }
    .ev-expand-btn:hover { text-decoration: underline; }
    .ev-full-dump { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; background: var(--input-bg); border: 1px solid var(--border); border-radius: 7px; padding: 10px 12px; margin-top: 8px; white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere; color: var(--text-muted); max-height: 260px; overflow-y: auto; line-height: 1.6; }
    .ev-metric-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 700; color: var(--warn); margin-top: 6px; font-family: 'JetBrains Mono', monospace; background: var(--warn-bg); border: 1px solid var(--warn-border); padding: 2px 9px; border-radius: 999px; }
    :root[data-theme="light"] .ev-metric-badge { color: var(--warn-strong); }
    .table-footer { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; padding: 12px 16px; border-top: 1px solid var(--border); background: var(--card-inset); font-size: 12px; color: var(--text-faint); }
    .btn-ghost { background: transparent; color: var(--accent); border: 1px solid var(--accent-border); padding: 7px 14px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 750; cursor: pointer; font-family: inherit; }
    :root[data-theme="light"] .btn-ghost { color: var(--brand-deep); }
    .btn-ghost:hover { background: var(--accent-bg); }
    .btn-copy { background: var(--card); color: var(--text-muted); border: 1px solid var(--border-bright); padding: 7px 13px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: color 0.15s, border-color 0.15s; font-family: inherit; }
    .btn-copy:hover { border-color: var(--border-focus); color: var(--text); }
    .copy-toast { font-size: 11.5px; color: var(--success); font-weight: 800; opacity: 0; transition: opacity 0.2s ease; }
    :root[data-theme="light"] .copy-toast { color: var(--success-strong); }
    .copy-toast.visible { opacity: 1; }
    .empty-state { padding: 36px 20px; text-align: center; color: var(--text-faint); font-size: 13px; }
    .empty-state .empty-title { font-weight: 750; color: var(--text-muted); font-size: 13.5px; margin-bottom: 4px; }
    .empty-cta { margin-top: 10px; display: inline-flex; }
    .footer { margin-top: 40px; padding-top: 18px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; font-size: 12px; color: var(--text-faint); }
    .footer-brand { display: flex; align-items: center; gap: 8px; font-weight: 650; color: var(--text-muted); }

    @media (max-width: 1024px) {
      .controls { flex: 1 1 100%; }
      .filter-bar { top: 98px; }
    }
    @media (max-width: 640px) {
      .app-container { padding: 16px 14px 44px; }
      .controls { padding: 12px; }
      .control-box.grow-path, .control-box.grow-target { flex: 1 1 100%; }
      .control-actions { margin-left: 0; width: 100%; }
      .control-actions .btn { flex: 1; justify-content: center; }
      .root-cause-hero { padding: 18px 16px; }
      .rc-headline-value { font-size: 18px; }
      .meta-label { min-width: 92px; }
      .evidence-search-wrap { max-width: none; flex: 1 1 100%; }
      .section-nav { top: 55px; border-radius: 12px; }
      .filter-bar { top: 112px; }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }
    @media print {
      body::before, .topbar, .controls, .filter-bar, .btn-copy, .theme-toggle, #btn-investigate, #btn-stop-server, .section-nav { display: none !important; }
      .app-container { max-width: 100%; }
      .root-cause-hero, .meta-section { box-shadow: none; break-inside: avoid; }
      .step-section { break-inside: avoid-page; }
    }
  </style>
  <style>
    /* Flat professional console: hairlines instead of boxes, one accent color. */
    :root, :root[data-theme="dark"] {
      --bg: #0b0d10;
      --bg-subtle: #0e1114;
      --card: #0e1114;
      --card-head: transparent;
      --card-inset: #14181d;
      --thead-bg: #0b0d10;
      --input-bg: #14181d;
      --border: #22282f;
      --border-bright: #323a42;
      --border-focus: #049fd9;
      --text: #e9ebee;
      --text-muted: #a6adb6;
      --text-faint: #71787f;
      --primary-soft: transparent;
      --primary-ring: rgba(4, 159, 217, 0.25);
      --accent: #4cc1eb;
      --accent-bg: transparent;
      --accent-border: #323a42;
      --success-bg: transparent;
      --success-border: transparent;
      --warn-bg: transparent;
      --warn-border: transparent;
      --danger-bg: transparent;
      --danger-border: transparent;
      --purple-bg: transparent;
      --purple-border: transparent;
      --tag-bg: transparent;
      --track-bg: #1a1f25;
      --thumb: #323a42;
      --thumb-hover: #4a545e;
      --zebra: transparent;
      --nav-bg: rgba(11, 13, 16, 0.96);
      --shadow: none;
      --shadow-sm: none;
    }
    :root[data-theme="light"] {
      --bg: #f3f4f5;
      --bg-subtle: #eceeef;
      --card: #ffffff;
      --card-inset: #f4f5f6;
      --thead-bg: #f3f4f5;
      --input-bg: #ffffff;
      --border: #e0e3e6;
      --border-bright: #c9ced3;
      --text: #14181d;
      --text-muted: #4d565f;
      --text-faint: #7b848d;
      --primary-soft: transparent;
      --accent-bg: transparent;
      --accent-border: #c9ced3;
      --success-bg: transparent;
      --success-border: transparent;
      --warn-bg: transparent;
      --warn-border: transparent;
      --danger-bg: transparent;
      --danger-border: transparent;
      --purple-bg: transparent;
      --purple-border: transparent;
      --tag-bg: transparent;
      --track-bg: #e4e7ea;
      --zebra: transparent;
      --nav-bg: rgba(243, 244, 245, 0.96);
      --shadow: none;
      --shadow-sm: none;
    }
    body::before { height: 2px; background: #049fd9; }
    .app-container { max-width: 1080px; }
    .topbar { backdrop-filter: none; }
    .brand-mark { background: #049fd9; border: none; box-shadow: none; border-radius: 8px; width: 38px; height: 38px; }
    .controls { background: transparent; border: none; border-bottom: 1px solid var(--border); border-radius: 0; box-shadow: none; padding: 0 0 14px; }
    .btn { box-shadow: none; border-radius: 6px; }
    .btn-stop { box-shadow: none; }
    .badge-engine { background: transparent; border: none; color: var(--text-faint); padding: 6px 0; }
    .badge-engine i { box-shadow: none; }
    .section-nav { background: var(--nav-bg); border: none; border-bottom: 1px solid var(--border); border-radius: 0; box-shadow: none; padding: 2px 0; top: 37px; }
    .section-nav a { border: none; border-radius: 0; color: var(--text-faint); padding: 9px 10px; }
    .section-nav a:hover { background: transparent; color: var(--text); }
    .section-nav a.active { background: transparent; border: none; box-shadow: inset 0 -2px 0 #049fd9; color: var(--text); }
    .error-box, .loading-banner { background: transparent; }
    .meta-grid { gap: 0 32px; }
    .meta-section { background: transparent; border: none; border-bottom: 1px solid var(--border); border-radius: 0; box-shadow: none; padding: 14px 0; }
    .meta-section::after { display: none; }
    .meta-badge-proj, .meta-badge-target { background: transparent; border: none; color: var(--text-faint); padding: 2px 0; }
    .meta-type-pill { background: transparent; border: none; color: var(--text-faint); padding: 2px 0; }
    .meta-status-pill::before { box-shadow: none; }
    .meta-val-code { background: transparent; border: none; padding: 0; }
    .root-cause-hero { background: transparent; border: none; border-bottom: 1px solid var(--border); border-radius: 0; box-shadow: none; padding: 18px 0; }
    .root-cause-hero::before, .root-cause-hero::after { display: none; }
    .rc-badge-primary { background: transparent; border: none; color: var(--text-faint); padding: 2px 0; }
    .rc-badge-primary::before { display: none; }
    .rc-conf-pill { background: transparent !important; border: none !important; padding: 2px 0; }
    .rc-conf-pill.high { color: var(--success); }
    .rc-conf-pill.med { color: var(--warn); }
    .rc-conf-pill.low { color: var(--danger); }
    .rc-rule-pill { background: transparent; border: none; color: var(--text-faint); padding: 2px 0; }
    .rc-value-card { background: transparent; border: none; border-radius: 0; padding: 0; }
    .rc-value-card.proof-card { background: transparent; border: none; }
    .metrics-strip { border-top: 1px solid var(--border); }
    .metric-item { background: transparent; border: none; border-radius: 0; padding: 0 24px 0 0; }
    .metric-val.accent { color: var(--text); }
    .conf-meter { border: none; }
    .conf-meter-fill { background: #049fd9; }
    .step-num-badge { background: transparent; color: var(--text-faint); padding: 0; }
    .step-section-meta { background: transparent; border: none; color: var(--text-faint); padding: 0; }
    .timeline-item { background: transparent; border: none; border-radius: 0; padding: 0 0 14px; margin-bottom: 0; }
    .timeline-item:hover { border-color: transparent; }
    .timeline-dot { box-shadow: none; }
    .timeline-row.initial_trigger .timeline-dot, .timeline-row.state_change .timeline-dot, .timeline-row.user_visible_symptom .timeline-dot { box-shadow: none; }
    .time-chip { background: transparent; border: none; padding: 0; }
    .service-tag { background: transparent; border: none; padding: 0; color: var(--text-faint); }
    .causal-dot { border: 1px solid var(--border-bright); }
    .causal-dot.root_cause, .causal-dot.contributing_factor, .causal-dot.system_effect, .causal-dot.user_visible_symptom { background: transparent; color: var(--text-muted); }
    .causal-node:first-child .causal-dot { background: var(--text); border-color: var(--text); color: var(--bg); }
    .causal-line { width: 1px; }
    .causal-step-content { background: transparent; border: none; border-radius: 0; padding: 0 0 0 2px; }
    .causal-step-content:hover { border-color: transparent; }
    .step-ref-pill { background: transparent; border: none; color: var(--text-faint); padding: 0; }
    .hypo-list { background: transparent; border: none; border-radius: 0; }
    .hypo-row { border-left: none; border-bottom: 1px solid var(--border); padding: 14px 0; }
    .hypo-row:last-child { border-bottom: none; }
    .hypo-id { background: transparent; border: none; color: var(--text-faint); padding: 0; margin-right: 6px; }
    .pill { background: transparent !important; border: none !important; padding: 0; }
    .pill.confirmed { color: var(--success); }
    .pill.disproven { color: var(--danger); }
    .pill.investigating { color: var(--warn); }
    .progress-bar-bg { border: none; height: 4px; }
    .progress-bar-fill { background: #8a929b !important; }
    .chip, .chip-refs { background: transparent; border: none; padding: 0; }
    .hypo-verdict { background: transparent !important; border: none !important; border-top: 1px solid var(--border) !important; border-radius: 0; padding: 8px 0 0; }
    .actions-card { background: transparent; border: none; border-radius: 0; }
    .action-row { border-bottom: 1px solid var(--border); padding: 10px 0; }
    .action-row:hover { background: transparent; }
    .action-num { background: transparent; color: var(--text-faint); border: 1px solid var(--border-bright); border-radius: 6px; }
    .cmd-pill, .path-pill { background: transparent; color: var(--text); }
    .action-footer-note { background: transparent; border-top: 1px solid var(--border); }
    .safeguard-card { background: transparent; border: none; border-radius: 0; padding: 0; }
    .safeguard-count { background: transparent; border: none; color: var(--text-faint); }
    .guardrail-dot { box-shadow: none; }
    .badge-gap, .badge-ruled-out { background: transparent; border: none; padding: 2px 0; }
    .filter-bar { background: var(--nav-bg); border: none; border-bottom: 1px solid var(--border); border-radius: 0; box-shadow: none; padding: 10px 0; }
    .filter-pill { background: transparent; border: none; border-radius: 0; padding: 8px 10px; }
    .filter-pill:hover { border-color: transparent; }
    .filter-pill.active { background: transparent; border: none; box-shadow: inset 0 -2px 0 #049fd9; border-radius: 0; }
    .table-card { background: transparent; border: none; border-radius: 0; }
    .ev-table thead th { background: var(--thead-bg); border-bottom: 1px solid var(--border-bright); }
    .ev-table tbody tr:hover td { background: transparent; }
    .ev-table tbody tr.is-proving td:first-child { }
    .badge-sev { background: transparent !important; border: none !important; padding: 0; }
    .badge-sev.critical { color: var(--danger); }
    .badge-sev.error { color: var(--danger); }
    .badge-sev.warn { color: var(--warn); }
    .badge-sev.info { color: var(--text-muted); }
    .badge-proves { color: var(--success); }
    .ev-full-dump { border-radius: 6px; }
    .ev-metric-badge { background: transparent; border: 1px solid var(--border); color: var(--text-muted); }
    .table-footer { background: transparent; }
    .topbar-kbd { background: transparent; }
    .skeleton { border: none; }
    /* Declutter: one clear column, generous rhythm, single-line facts. */
    .header { margin-bottom: 8px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
    .meta-grid { margin-bottom: 4px; }
    .rc-values-grid { grid-template-columns: minmax(0, 1fr); gap: 0; margin-bottom: 14px; }
    .rc-value-card { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 14px; padding: 10px 0; align-items: start; }
    .rc-value-card + .rc-value-card { border-top: 1px solid var(--border); }
    .metrics-strip { display: flex; flex-wrap: wrap; gap: 6px 26px; align-items: baseline; }
    .metric-item { flex-direction: row; align-items: baseline; gap: 8px; padding: 0; }
    .metric-val { font-size: 14px; }
    .metric-sub { display: none; }
    .conf-meter { display: none; }
    .step-section { padding: 20px 0 22px; margin-bottom: 0; scroll-margin-top: 60px; }
    .step-section-head { margin-bottom: 4px; }
    .step-section-sub { font-size: 12.5px; margin-bottom: 12px; }
    .filter-bar { top: 37px; }
    @media (max-width: 640px) {
      .filter-bar { top: 57px; }
      .rc-value-card { grid-template-columns: minmax(0, 1fr); gap: 3px; }
    }

    /* ============ Diagnosis Card ============ */
    .diagnosis-breakdown-card {
      background: var(--card);
      border: 1px solid var(--border-bright);
      border-radius: var(--radius);
      padding: 20px;
      margin: 18px 0 24px;
      box-shadow: var(--shadow-sm);
    }
    .diagnosis-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 10px;
    }
    .diagnosis-badge {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 3px 10px;
      border-radius: 999px;
      background: var(--card-inset);
      color: var(--text-muted);
      border: 1px solid var(--border);
    }
    .diagnosis-card-title {
      font-size: 15px;
      font-weight: 750;
      color: var(--text);
      margin: 0;
    }
    .diagnosis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
      margin-bottom: 16px;
    }
    .diagnosis-item {
      background: var(--card-inset);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .diagnosis-item.diag-fix {
      grid-column: 1 / -1;
      border: 1px solid var(--border);
      background: var(--card-inset);
    }
    .diag-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.6px;
      color: var(--text-faint);
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
    }
    .diag-value {
      font-size: 13.5px;
      color: var(--text);
      line-height: 1.55;
      font-weight: 600;
      word-break: break-word;
    }
    .diag-value.code-highlight {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--text);
      background: var(--input-bg);
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid var(--border);
    }
    .diag-value.error-highlight {
      color: var(--text);
      font-weight: 700;
    }
    .diag-value.cause-highlight {
      color: var(--text);
      font-weight: 650;
    }
    .btn-copy-quickfix {
      align-self: flex-start;
      margin-top: 6px;
      background: var(--card);
      color: var(--text);
      border: 1px solid var(--border-bright);
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      font-family: inherit;
    }
    .btn-copy-quickfix:hover {
      background: var(--input-bg);
      border-color: var(--border-focus);
    }
    .diagnosis-raw-box {
      background: var(--input-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      overflow: hidden;
    }
    .diag-raw-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .diag-raw-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.6px;
      color: var(--text-faint);
    }
    .diag-raw-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 180px;
      overflow-y: auto;
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#verdict">Skip to verdict</a>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="topbar-brand">
        <span class="topbar-dot" aria-hidden="true"></span>
        <span>DevOps Incident Investigator</span>
      </div>
      <div class="topbar-meta">
        <span>Read-only</span>
      </div>
    </div>
  </div>

  <div class="app-container">
    <div class="header">
      <div class="title-group">
        <div class="brand-mark" aria-hidden="true" style="display:flex;align-items:center;justify-content:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <div>
          <h1>DevOps Incident Investigator</h1>
          <div class="subtitle">Root-cause analysis for service incidents.</div>
          <div class="author">Created by Keerthivasan.R.V &middot; Release 0.1.0</div>
        </div>
      </div>
      <div class="controls" role="search" aria-label="Investigation controls">
        <div class="control-box grow-path">
          <label for="project-path-input" class="control-label">Project folder <span class="control-hint">local path</span></label>
          <input id="project-path-input" type="text" placeholder="e.g. ./incidents/incident-001" value="" aria-label="Project folder path" autocomplete="off" spellcheck="false" />
        </div>
        <div class="control-box grow-target">
          <label for="target-select" class="control-label">Target incident <span class="control-hint">incident or workspace</span></label>
          <select id="target-select" aria-label="Select target incident">
            <option value="">Loading targets...</option>
          </select>
        </div>
        <div class="control-actions">
          <button id="btn-investigate" class="btn" type="button">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>
            <span>Investigate</span>
          </button>
          <button id="btn-stop-server" class="btn btn-stop" type="button" title="Stop Investigator server and free the port">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="10" height="10" rx="2"/></svg>
            <span>Stop</span>
          </button>
          <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme" aria-pressed="false">
            <svg id="theme-icon-moon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1.5a6.5 6.5 0 1 0 4.6 11.1A7.5 7.5 0 0 1 8 1.5Z"/></svg>
            <svg id="theme-icon-sun" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" style="display:none;"><circle cx="8" cy="8" r="3.2"/><path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1"/></svg>
            <span id="theme-label">Light</span>
          </button>
          <span class="badge-engine"><i aria-hidden="true"></i>READ-ONLY</span>
        </div>
      </div>
    </div>

    <div id="error-display" class="error-box" role="alert"></div>
    <div id="loading-banner" class="loading-banner" role="status"><span class="spinner" aria-hidden="true"></span><span id="loading-text">Loading records...</span></div>

    <div class="meta-grid">
      <div class="meta-section" aria-label="Project scope">
        <div class="meta-head">
          <div class="meta-title-cluster">
            <span class="meta-badge-proj">Project</span>
            <span id="display-project-name" class="meta-val-highlight">Loading...</span>
          </div>
          <span id="project-scan-status" class="meta-status-pill">Connecting...</span>
        </div>
        <div class="meta-body">
          <div class="meta-field">
            <span class="meta-label">Directory</span>
            <span id="display-project-path" class="meta-val-code">Resolving workspace...</span>
          </div>
          <div class="meta-field">
            <span class="meta-label">Mode</span>
            <span id="display-project-mode" class="meta-val-summary">Read-only access &middot; source data is never modified</span>
          </div>
        </div>
      </div>

      <div class="meta-section target-card" aria-label="Target incident">
        <div class="meta-head">
          <div class="meta-title-cluster">
            <span class="meta-badge-target">Target</span>
            <span id="display-target-type" class="meta-type-pill">Resolving...</span>
          </div>
          <span id="display-target-signals" class="meta-count-pill">-- signals</span>
        </div>
        <div class="meta-body">
          <div class="meta-field">
            <span class="meta-label">Selected</span>
            <span id="display-target-name" class="meta-val-target">Loading target...</span>
          </div>
          <div class="meta-field">
            <span class="meta-label">Symptoms</span>
            <span id="display-target-summary" class="meta-val-summary">Loading incident records...</span>
          </div>
          <div class="meta-field">
            <span class="meta-label">Location</span>
            <span id="display-target-location" class="meta-val-code">--</span>
          </div>
        </div>
      </div>
    </div>

    <div class="root-cause-hero" id="verdict" aria-live="polite">
      <div class="rc-header">
        <div class="rc-badges-group">
          <span class="rc-badge-primary">Root cause</span>
          <span id="hero-conf-badge" class="rc-conf-pill med">Awaiting analysis</span>
          <span id="hero-rule-badge" class="rc-rule-pill" title="Detection rule">Rule: --</span>
        </div>
        <div class="rc-status-tag">Linked to supporting evidence</div>
      </div>
      <div class="rc-headline-box">
        <div class="rc-headline-label">Failure mode</div>
        <h2 id="stat-root-cause" class="rc-headline-value">Loading records...</h2>
      </div>
      <div class="rc-values-grid">
        <div class="rc-value-card">
          <span class="rc-val-label">Rationale</span>
          <p id="stat-root-cause-rationale" class="rc-val-text">Reviewing timeline and comparing candidate explanations.</p>
        </div>
        <div class="rc-value-card">
          <span class="rc-val-label">First event</span>
          <p id="stat-root-cause-trigger" class="rc-val-text">Reading the initial entry in the timeline...</p>
        </div>
        <div class="rc-value-card proof-card">
          <span class="rc-val-label">Primary supporting reference</span>
          <p id="stat-root-cause-proof" class="rc-val-text mono">Locating source reference...</p>
        </div>
      </div>
      <div class="metrics-strip">
        <div class="metric-item">
          <span class="metric-label">Confidence</span>
          <span id="stat-confidence" class="metric-val accent">--</span>
          <span class="metric-sub">Finding certainty</span>
          <div class="conf-meter" aria-hidden="true"><div class="conf-meter-fill" id="hero-conf-bar-fill" style="width:0%;"></div></div>
        </div>
        <div class="metric-item">
          <span class="metric-label">Excluded</span>
          <span id="stat-reduction" class="metric-val">--</span>
          <span class="metric-sub">Routine records excluded</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Supporting records</span>
          <span id="stat-evidence" class="metric-val">--</span>
          <span class="metric-sub">Supporting references</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Runtime</span>
          <span id="stat-duration" class="metric-val">--</span>
          <span class="metric-sub">Local analysis</span>
        </div>
      </div>
    </div>

    <!-- Quick Executive Diagnosis: What, Where, Why & How to Fix -->
    <div class="diagnosis-breakdown-card" id="diagnosis-card">
      <div class="diagnosis-card-header">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="diagnosis-badge">Diagnosis Summary</span>
          <h3 class="diagnosis-card-title">At a Glance: What, Where, Why &amp; How to Fix</h3>
        </div>
        <span class="meta-status-pill" style="color:var(--accent);border-color:var(--accent-border);">Executive View</span>
      </div>
      <div class="diagnosis-grid">
        <div class="diagnosis-item diag-where">
          <div class="diag-label">WHERE IS THE ERROR?</div>
          <div class="diag-value code-highlight" id="diag-where-error">Locating source file and line number...</div>
        </div>
        <div class="diagnosis-item diag-what">
          <div class="diag-label">WHAT IS THE ERROR?</div>
          <div class="diag-value error-highlight" id="diag-what-error">Analyzing error message...</div>
        </div>
        <div class="diagnosis-item diag-why">
          <div class="diag-label">WHAT CAUSED IT?</div>
          <div class="diag-value cause-highlight" id="diag-why-cause">Tracing root cause trigger...</div>
        </div>
        <div class="diagnosis-item diag-fix">
          <div class="diag-label">HOW TO FIX IT?</div>
          <div class="diag-value" id="diag-how-fix">Synthesizing recommended remediation steps...</div>
          <button class="btn-copy-quickfix" id="btn-quick-copy" type="button">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>
            <span id="btn-quick-copy-text">Copy Recommended Fix</span>
          </button>
        </div>
      </div>
      <div class="diagnosis-raw-box" id="diag-raw-box">
        <div class="diag-raw-header">
          <span class="diag-raw-label">RAW LOG OUTPUT / ERROR TRACE SNIPPET</span>
          <button class="btn-ghost" style="padding:3px 9px;font-size:11px;" id="btn-toggle-raw" type="button">Copy Raw Error</button>
        </div>
        <pre class="diag-raw-code" id="diag-raw-text">Loading error trace...</pre>
      </div>
    </div>

    <div class="step-section" id="sec-01">
      <div class="step-section-head">
        <div class="step-section-title"><span class="step-num-badge">01</span><span>Chronological event timeline</span></div>
        <span id="timeline-count" class="step-section-meta">0 events</span>
      </div>
      <div class="step-section-sub">Significant events in chronological order. Routine informational messages are excluded.</div>
      <div id="timeline-list" class="timeline-list"><div class="skeleton" style="height:72px;"></div><div class="skeleton" style="height:72px;margin-top:10px;"></div></div>
    </div>

    <div class="step-section" id="sec-02">
      <div class="step-section-head">
        <div class="step-section-title"><span class="step-num-badge">02</span><span>Causal propagation chain</span></div>
        <span class="step-section-meta">Root cause &rarr; factor &rarr; effect &rarr; symptom</span>
      </div>
      <div class="step-section-sub">Failure progression from cause to symptom. Each step references the records that support it — follow the numbers top to bottom.</div>
      <div id="causal-chain" class="causal-flow"><div class="skeleton" style="height:86px;"></div></div>
    </div>

    <div class="step-section" id="sec-03">
      <div class="step-section-head">
        <div class="step-section-title"><span class="step-num-badge">03</span><span>Candidate explanations</span></div>
        <span class="step-section-meta">Comparison</span>
      </div>
      <div class="step-section-sub">Candidate explanations checked against the same records. The finding with direct supporting evidence and no conflicting records is listed as confirmed; the remainder are listed as ruled out.</div>
      <div id="hypotheses-list" class="hypo-list"><div class="empty-state"><div class="empty-title">Loading comparison...</div><div>Checking candidate explanations.</div></div></div>
    </div>

    <div class="step-section" id="sec-04">
      <div class="step-section-head">
        <div class="step-section-title"><span class="step-num-badge">04</span><span>Recommended actions</span></div>
        <div style="display:inline-flex;align-items:center;gap:8px;">
          <button class="btn-copy" type="button" id="btn-copy-plan">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>
            <span>Copy plan</span>
          </button>
          <span class="copy-toast" id="copy-toast">Copied!</span>
          <span class="step-section-meta">Safe &middot; read-only</span>
        </div>
      </div>
      <div class="step-section-sub">Next steps for operations review. Confirm each command in a non-production environment before use — no action runs automatically.</div>
      <div class="actions-card">
        <div id="actions-list" class="actions-list"></div>
        <div class="action-footer-note">Run inspection commands in a non-production environment first. This console does not perform remediation.</div>
      </div>
    </div>

    <div class="step-section" id="sec-05">
      <div class="step-section-head">
        <div class="step-section-title"><span class="step-num-badge">05</span><span>Record gaps &amp; safeguards</span></div>
        <span id="gaps-meta" class="step-section-meta">Observability</span>
      </div>
      <div class="step-section-sub">Records that are unavailable, alternatives that were ruled out, and the read-only constraints in effect. Unavailable records are listed as missing.</div>
      <div id="safeguards-panel" class="safeguard-grid"></div>
    </div>

    <div class="step-section" id="sec-06">
      <div class="step-section-head">
        <div class="step-section-title"><span class="step-num-badge">06</span><span>Evidence records</span></div>
        <span id="evidence-count" class="step-section-meta">Loading evidence...</span>
      </div>
      <div class="step-section-sub">Source records with file and line references. Rows marked “Supports finding” form the supporting set for the decision. Tip: press <strong>/</strong> to jump to search.</div>
      <div class="filter-bar">
        <div class="filter-pills" role="tablist" aria-label="Evidence filters">
          <button class="filter-pill active" type="button" data-filter="all" id="btn-filter-all"><span>All signals</span><span class="count" id="filter-count-all">0</span></button>
          <button class="filter-pill" type="button" data-filter="proves" id="btn-filter-proves"><span>Supports finding</span><span class="count" id="filter-count-proves">0</span></button>
          <button class="filter-pill" type="button" data-filter="errors" id="btn-filter-errors"><span>Critical &amp; errors</span><span class="count" id="filter-count-errors">0</span></button>
          <button class="filter-pill" type="button" data-filter="metrics" id="btn-filter-metrics"><span>Metrics</span><span class="count" id="filter-count-metrics">0</span></button>
        </div>
        <div class="evidence-search-wrap">
          <span class="evidence-search-icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg></span>
          <input type="text" id="evidence-search" class="evidence-search-box" placeholder="Filter by keyword, file, service..." aria-label="Filter evidence" autocomplete="off" spellcheck="false" />
        </div>
      </div>
      <div class="table-card">
        <div class="table-wrap">
          <table class="ev-table">
            <thead>
              <tr><th class="col-num" scope="col">#</th><th class="col-sev" scope="col">Severity</th><th class="col-source" scope="col">Source</th><th class="col-msg" scope="col">Message &amp; details</th></tr>
            </thead>
            <tbody id="evidence-table-body"></tbody>
          </table>
        </div>
        <div class="table-footer">
          <span id="evidence-footer-note">--</span>
          <button class="btn-ghost" type="button" id="btn-show-more-evidence" style="display:none;">Show more</button>
        </div>
      </div>
    </div>

    <div class="footer">
      <span class="footer-brand">DevOps Incident Investigator · Created by Keerthivasan.R.V · Release 0.1.0</span>
      <span>Read-only · Confirm findings against source records before acting</span>
    </div>
  </div>

  <script>
    var currentIncidentId = '';
    var latestReport = null;
    var currentEvidenceFilter = 'all';
    var currentSearchTerm = '';
    var evidenceVisibleLimit = 100;

    function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function syncThemeUI(theme) {
      var label = document.getElementById('theme-label');
      var moon = document.getElementById('theme-icon-moon');
      var sun = document.getElementById('theme-icon-sun');
      var toggle = document.getElementById('theme-toggle');
      if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
      if (moon && sun) { moon.style.display = theme === 'dark' ? '' : 'none'; sun.style.display = theme === 'dark' ? 'none' : ''; }
      if (toggle) toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      try {
        var meta = document.querySelector('meta[name="color-scheme"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? 'dark light' : 'light dark');
      } catch (e) {}
    }

    function initTheme() {
      var theme = null;
      try { theme = localStorage.getItem('investigator-theme'); } catch (e) {}
      if (theme !== 'light' && theme !== 'dark') {
        try {
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'light';
          else theme = 'dark';
        } catch (e) { theme = 'dark'; }
      }
      document.documentElement.setAttribute('data-theme', theme);
      syncThemeUI(theme);
    }

    function toggleTheme() {
      var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('investigator-theme', next); } catch (e) {}
      syncThemeUI(next);
    }

    function setLoading(isLoading, text) {
      var banner = document.getElementById('loading-banner');
      var label = document.getElementById('loading-text');
      if (label && text) label.textContent = text;
      if (banner) banner.classList.toggle('visible', !!isLoading);
      var btn = document.getElementById('btn-investigate');
      if (btn) {
        btn.disabled = !!isLoading;
        if (isLoading) { btn.setAttribute('aria-busy', 'true'); }
        else { btn.removeAttribute('aria-busy'); }
      }
    }

    function showError(msg) {
      var el = document.getElementById('error-display');
      if (!el) return;
      el.textContent = msg;
      el.style.display = 'block';
    }
    function hideError() {
      var el = document.getElementById('error-display');
      if (!el) return;
      el.style.display = 'none';
      el.textContent = '';
    }

    function confidenceTier(conf01) {
      if (conf01 >= 0.85) return 'high';
      if (conf01 >= 0.6) return 'med';
      return 'low';
    }

    function formatActionText(str) {
      if (!str) return '';
      var safe = escapeHtml(str);
      safe = safe.replace(/((?:\\.\\/gradlew|gradlew\\.bat|gradle)\\s+[a-zA-Z0-9_\\-\\.\\/]+)/g, '<code class="cmd-pill">$1</code>');
      safe = safe.replace(/(kill\\s+-9\\s+[^\\s,;]+)/g, '<code class="cmd-pill">$1</code>');
      safe = safe.replace(/(Stop-Process\\s+[^\\s,;]+)/g, '<code class="cmd-pill">$1</code>');
      safe = safe.replace(/(org\\.gradle\\.jvmargs=[^\\s,;]+)/g, '<code class="cmd-pill">$1</code>');
      safe = safe.replace(/(-Xmx\\d+[mgMG])/g, '<code class="cmd-pill">$1</code>');
      safe = safe.replace(/([a-zA-Z0-9_\\-\\.\\/]+\\.(?:properties|json|gradle|log|xml|conf|yaml|yml))/g, '<code class="path-pill">$1</code>');
      return safe;
    }

    function supportingIdSet(r) {
      var s = {};
      var arr = (r && r.supportingEvidence) || [];
      for (var i = 0; i < arr.length; i++) { if (arr[i] && arr[i].id) s[arr[i].id] = true; }
      return s;
    }

    function isProving(ev, suppMap) {
      return !!(ev && ev.id && suppMap[ev.id]);
    }

    async function init() {
      initTheme();
      var themeBtn = document.getElementById('theme-toggle');
      if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
      var invBtn = document.getElementById('btn-investigate');
      if (invBtn) invBtn.addEventListener('click', fetchInvestigation);
      var stopBtn = document.getElementById('btn-stop-server');
      if (stopBtn) stopBtn.addEventListener('click', stopServer);
      var copyBtn = document.getElementById('btn-copy-plan');
      if (copyBtn) copyBtn.addEventListener('click', copyActionPlan);
      var pills = document.querySelectorAll('.filter-pill');
      for (var i = 0; i < pills.length; i++) {
        (function (btn) {
          btn.addEventListener('click', function () { filterEvidence(btn.getAttribute('data-filter') || 'all'); });
        })(pills[i]);
      }
      var search = document.getElementById('evidence-search');
      if (search) search.addEventListener('input', onSearchEvidence);
      var moreBtn = document.getElementById('btn-show-more-evidence');
      if (moreBtn) moreBtn.addEventListener('click', function () { evidenceVisibleLimit += 100; updateEvidenceView(); });
      var pathInput = document.getElementById('project-path-input');
      if (pathInput) pathInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') fetchInvestigation(); });
      var select = document.getElementById('target-select');
      if (select) select.addEventListener('change', onTargetChange);
      document.addEventListener('keydown', function (e) {
        if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
          var tag = (document.activeElement && document.activeElement.tagName) || '';
          if (tag !== 'INPUT' && tag !== 'SELECT' && tag !== 'TEXTAREA') {
            e.preventDefault();
            var s = document.getElementById('evidence-search');
            if (s) { s.focus(); document.getElementById('sec-06').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
          }
        }
      });

      setLoading(true, 'Loading available targets...');
      try {
        var res = await fetch('/api/incidents');
        if (!res.ok) throw new Error('Failed to fetch targets (HTTP ' + res.status + ')');
        var data = await res.json();
        var projectInfo = { name: '', path: '' };
        var targets = [];
        if (data && data.project) {
          projectInfo = data.project;
          targets = data.targets || [];
        } else if (Array.isArray(data)) {
          targets = data;
        }
        if (projectInfo && projectInfo.path) {
          var ppi = document.getElementById('project-path-input');
          if (ppi && !ppi.value) ppi.value = projectInfo.path;
          var dpn = document.getElementById('display-project-name');
          if (dpn && projectInfo.name) dpn.textContent = projectInfo.name;
        }
        var sel = document.getElementById('target-select');
        if (sel) {
          sel.innerHTML = '';
          if (!targets || targets.length === 0) {
            var o = document.createElement('option');
            o.value = '';
            o.textContent = 'No targets available';
            sel.appendChild(o);
          } else {
            targets.forEach(function (t) {
              var opt = document.createElement('option');
              opt.value = t.id;
              opt.textContent = t.title;
              sel.appendChild(opt);
            });
            var preferred = null;
            for (var k = 0; k < targets.length; k++) {
              if (targets[k].id === 'project-scan') { preferred = targets[k]; break; }
            }
            currentIncidentId = preferred ? preferred.id : targets[0].id;
            sel.value = currentIncidentId;

            if (data && data.project && data.project.path) {
              var pInput = document.getElementById('project-path-input');
              if (pInput && !pInput.value) {
                pInput.placeholder = data.project.path;
              }
            }
          }
        }
        await fetchInvestigation();
      } catch (err) {
        showError('Could not initialize dashboard: ' + (err && err.message ? err.message : err));
        setLoading(false);
      }
    }

    function onTargetChange() {
      var select = document.getElementById('target-select');
      if (select && select.value) {
        currentIncidentId = select.value;
        var targetSummaryEl = document.getElementById('display-target-summary');
        if (targetSummaryEl) targetSummaryEl.textContent = 'Loading target records...';
      }
      fetchInvestigation();
    }

    async function fetchInvestigation() {
      hideError();
      var projectPathInput = document.getElementById('project-path-input');
      var projectPath = projectPathInput ? projectPathInput.value.trim() : '';
      var select = document.getElementById('target-select');
      if (select && select.value) currentIncidentId = select.value;
      if (!currentIncidentId) { showError('Select a target incident before investigating.'); return; }

      setLoading(true, 'Loading ' + currentIncidentId + '...');
      var headline = document.getElementById('stat-root-cause');
      if (headline) headline.textContent = 'Loading records...';
      var confBadge = document.getElementById('hero-conf-badge');
      if (confBadge) { confBadge.textContent = 'Analyzing...'; confBadge.className = 'rc-conf-pill med'; }

      try {
        var url = '/api/incident?id=' + encodeURIComponent(currentIncidentId);
        if (currentIncidentId === 'project-scan' && projectPath) url += '&projectPath=' + encodeURIComponent(projectPath);
        var res = await fetch(url);
        if (!res.ok) {
          var errData = {};
          try { errData = await res.json(); } catch (e) {}
          throw new Error((errData && errData.error) || ('HTTP ' + res.status));
        }
        var report = await res.json();
        renderReport(report);
      } catch (err) {
        showError('Failed to load investigation: ' + (err && err.message ? err.message : err));
        var h = document.getElementById('stat-root-cause');
        if (h) h.textContent = 'Investigation failed';
      } finally {
        setLoading(false);
      }
    }

    function renderReport(r) {
      latestReport = r;
      evidenceVisibleLimit = 100;

      var projNameEl = document.getElementById('display-project-name');
      if (projNameEl) projNameEl.textContent = r.projectName || r.project_name || 'Active workspace';
      var projPathEl = document.getElementById('display-project-path');
      if (projPathEl) projPathEl.textContent = r.projectPath || r.project_path || r.targetLocation || 'Current workspace';
      var projStatusEl = document.getElementById('project-scan-status');
      if (projStatusEl) {
        var isLive = (r.targetId === 'project-scan' || r.targetType === 'Live Project Telemetry Scan');
        projStatusEl.textContent = isLive ? 'Workspace loaded' : 'Incident loaded';
      }

      var targetNameEl = document.getElementById('display-target-name');
      if (targetNameEl) targetNameEl.textContent = r.targetTitle || ((r.targetId || r.incidentId || 'Target') + (r.incidentSummary ? ': ' + r.incidentSummary : ''));
      var targetTypeEl = document.getElementById('display-target-type');
      if (targetTypeEl) targetTypeEl.textContent = r.targetType || ((r.incidentId && String(r.incidentId).indexOf('incident-') === 0) ? 'Incident records' : 'Workspace review');
      var targetSummaryEl = document.getElementById('display-target-summary');
      if (targetSummaryEl) targetSummaryEl.textContent = r.incidentSummary || 'Summary of the loaded records.';
      var targetLocEl = document.getElementById('display-target-location');
      if (targetLocEl) targetLocEl.textContent = r.targetLocation || r.projectPath || '--';
      var targetSignalsEl = document.getElementById('display-target-signals');
      if (targetSignalsEl) {
        var suppCount0 = ((r.supportingEvidence) || []).length;
        var totalAvail0 = (r.statistics && r.statistics.totalEvidenceAvailable !== undefined) ? r.statistics.totalEvidenceAvailable : (((r.selectedEvidence) || []).length);
        targetSignalsEl.textContent = totalAvail0 + ' records (' + suppCount0 + ' supporting)';
      }

      var select = document.getElementById('target-select');
      if (select && (r.targetId || r.incidentId)) {
        var curVal = r.targetId || r.incidentId;
        var found = false;
        for (var i = 0; i < select.options.length; i++) { if (select.options[i].value === curVal) { found = true; break; } }
        if (found && select.value !== curVal) select.value = curVal;
      }

      var rootCauseDesc = (r.rootCause && r.rootCause.description) || 'Root cause under investigation';
      var rcEl = document.getElementById('stat-root-cause');
      if (rcEl) rcEl.textContent = rootCauseDesc;
      var conf01 = (r.rootCause && typeof r.rootCause.confidence === 'number') ? r.rootCause.confidence : 0;
      var confPct = Math.round(conf01 * 100);
      var heroConfBadge = document.getElementById('hero-conf-badge');
      if (heroConfBadge) {
        heroConfBadge.textContent = confPct + '% confidence · ' + (conf01 >= 0.85 ? 'High certainty' : conf01 >= 0.6 ? 'Moderate certainty' : 'Needs review');
        var tier = confidenceTier(conf01);
        heroConfBadge.className = 'rc-conf-pill ' + tier;
      }
      var heroBar = document.getElementById('hero-conf-bar-fill');
      if (heroBar) heroBar.style.width = confPct + '%';
      var heroRuleBadge = document.getElementById('hero-rule-badge');
      if (heroRuleBadge) {
        var ruleId = (r.rootCause && r.rootCause.ruleId) ? r.rootCause.ruleId : '';
        heroRuleBadge.textContent = ruleId ? ('Rule: ' + ruleId) : 'Correlated records';
        heroRuleBadge.title = ruleId || 'Correlation rule';
      }
      var rationaleEl = document.getElementById('stat-root-cause-rationale');
      if (rationaleEl) rationaleEl.textContent = (r.rootCause && r.rootCause.confidenceRationale) ? r.rootCause.confidenceRationale : 'Supporting records point to this failure mode.';
      var triggerEl = document.getElementById('stat-root-cause-trigger');
      if (triggerEl) {
        var triggerText = '';
        if (r.causalChain && r.causalChain.length > 0) {
          var rootNode = null;
          for (var ti = 0; ti < r.causalChain.length; ti++) { if (r.causalChain[ti].role === 'root_cause') { rootNode = r.causalChain[ti]; break; } }
          triggerText = (rootNode && rootNode.description) || r.causalChain[0].description;
        }
        triggerEl.textContent = triggerText || r.incidentSummary || 'First recorded event';
      }
      var proofEl = document.getElementById('stat-root-cause-proof');
      if (proofEl) {
        var supp0 = ((r.supportingEvidence && r.supportingEvidence.length > 0) ? r.supportingEvidence[0] : ((r.selectedEvidence && r.selectedEvidence[0]) || null));
        proofEl.textContent = '';
        if (supp0) {
          var ref = supp0.originalReference ? (supp0.originalReference.file + ':L' + supp0.originalReference.line) : supp0.source;
          proofEl.textContent = ref + ' — ' + supp0.message;
        } else {
          proofEl.textContent = 'Verified against source files.';
        }
      }

      var confEl = document.getElementById('stat-confidence');
      if (confEl) confEl.textContent = confPct + '%';
      var redEl = document.getElementById('stat-reduction');
      if (redEl) redEl.textContent = (r.statistics && r.statistics.evidenceReductionRatio !== undefined) ? ((r.statistics.evidenceReductionRatio * 100).toFixed(1) + '%') : '--';
      var evStatEl = document.getElementById('stat-evidence');
      if (evStatEl && r.statistics) {
        var sc = ((r.supportingEvidence) || []).length;
        var insp = r.statistics.evidenceInspected;
        evStatEl.textContent = sc + ' / ' + insp;
      }
      var durEl = document.getElementById('stat-duration');
      if (durEl) durEl.textContent = (r.statistics && r.statistics.durationMs !== undefined) ? (r.statistics.durationMs + ' ms') : '--';

      renderDiagnosisOverview(r);
      renderTimeline(r);
      renderCausalChain(r);
      renderHypotheses(r);
      renderActions(r);
      renderSafeguards(r);
      updateEvidenceView();
    }

    function renderDiagnosisOverview(r) {
      if (!r) return;
      var supp0 = ((r.supportingEvidence && r.supportingEvidence.length > 0) ? r.supportingEvidence[0] : ((r.selectedEvidence && r.selectedEvidence[0]) || null));
      var crit0 = null;
      if (r.supportingEvidence && r.supportingEvidence.length > 0) {
        crit0 = r.supportingEvidence.find(function(e) { return e.severity === 'critical' || e.severity === 'error'; });
      }
      if (!crit0 && r.selectedEvidence && r.selectedEvidence.length > 0) {
        crit0 = r.selectedEvidence.find(function(e) { return e.severity === 'critical' || e.severity === 'error'; });
      }
      if (!crit0) crit0 = supp0;

      // 1. WHAT IS THE ERROR?
      var whatEl = document.getElementById('diag-what-error');
      if (whatEl) {
        if (crit0 && crit0.message) {
          whatEl.textContent = crit0.message;
        } else if (r.rootCause && r.rootCause.description) {
          whatEl.textContent = r.rootCause.description;
        } else {
          whatEl.textContent = 'No critical anomaly detected.';
        }
      }

      // 2. WHERE IS THE ERROR?
      var whereEl = document.getElementById('diag-where-error');
      if (whereEl) {
        if (crit0 && crit0.originalReference && crit0.originalReference.file) {
          whereEl.textContent = crit0.originalReference.file + ' (Line ' + crit0.originalReference.line + ')';
        } else if (crit0 && crit0.source) {
          whereEl.textContent = crit0.source;
        } else {
          whereEl.textContent = r.targetLocation || r.projectPath || 'Current workspace';
        }
      }

      // 3. WHAT CAUSED IT?
      var whyEl = document.getElementById('diag-why-cause');
      if (whyEl) {
        var causeText = (r.rootCause && r.rootCause.description) || 'Root cause under investigation';
        if (r.rootCause && r.rootCause.confidenceRationale) {
          causeText += ' — ' + r.rootCause.confidenceRationale;
        }
        whyEl.textContent = causeText;
      }

      // 4. HOW TO FIX IT?
      var howEl = document.getElementById('diag-how-fix');
      var quickBtn = document.getElementById('btn-quick-copy');
      var quickBtnText = document.getElementById('btn-quick-copy-text');
      var primaryAction = (r.recommendedActions && r.recommendedActions.length > 0) ? r.recommendedActions[0] : 'Inspect logs around the failure timestamp.';
      if (howEl) {
        howEl.textContent = primaryAction;
      }
      if (quickBtn) {
        quickBtn.onclick = function() {
          try {
            navigator.clipboard.writeText(primaryAction);
            if (quickBtnText) quickBtnText.textContent = 'Copied to Clipboard';
            setTimeout(function() {
              if (quickBtnText) quickBtnText.textContent = 'Copy Recommended Fix';
            }, 2000);
          } catch(e) {}
        };
      }

      // 5. WHAT WAS THE LOG OUTPUT?
      var rawEl = document.getElementById('diag-raw-text');
      var copyRawBtn = document.getElementById('btn-toggle-raw');
      var rawOutputText = '';
      if (crit0) {
        var ref = crit0.originalReference ? (crit0.originalReference.file + ':L' + crit0.originalReference.line) : (crit0.source || 'telemetry');
        rawOutputText = '[' + (crit0.timestamp || 'TIMESTAMP') + '] [' + (crit0.service || 'service') + '] [' + (crit0.severity || 'ERROR').toUpperCase() + '] ' + ref + '\\n' + (crit0.message || '');
        if (crit0.rawTelemetry && crit0.rawTelemetry !== crit0.message) {
          rawOutputText += '\\n\\n' + crit0.rawTelemetry;
        }
      } else {
        rawOutputText = 'No raw error logs captured in current selection.';
      }
      if (rawEl) rawEl.textContent = rawOutputText;
      if (copyRawBtn) {
        copyRawBtn.onclick = function() {
          try {
            navigator.clipboard.writeText(rawOutputText);
            copyRawBtn.textContent = 'Copied Raw Error';
            setTimeout(function() { copyRawBtn.textContent = 'Copy Raw Error'; }, 2000);
          } catch(e) {}
        };
      }
    }

    function renderTimeline(r) {
      var timeEl = document.getElementById('timeline-list');
      var countEl = document.getElementById('timeline-count');
      var items = (r && r.timeline) || [];
      if (countEl) countEl.textContent = items.length + (items.length === 1 ? ' event' : ' events');
      if (!timeEl) return;
      if (items.length === 0) {
        timeEl.innerHTML = '<div class="empty-state"><div class="empty-title">No timeline events</div><div>No significant events in the loaded records.</div></div>';
        return;
      }
      var html = '';
      for (var idx = 0; idx < items.length; idx++) {
        var t = items[idx] || {};
        var timeStr = t.timestamp ? String(t.timestamp).replace('T', ' ').replace('Z', '') : '';
        var sig = ((t.significance || 'system_effect') + '').replace(/_/g, ' ');
        var last = idx === items.length - 1;
        html += '<div class="timeline-row ' + escapeHtml(t.significance || 'system_effect') + '">'
          + '<div class="timeline-rail"><div class="timeline-dot"></div>' + (last ? '' : '<div class="timeline-stem"></div>') + '</div>'
          + '<div class="timeline-item"><div class="time-header"><span class="time-chip">' + escapeHtml(timeStr) + '</span><span class="service-tag">' + escapeHtml(t.service || 'system') + '</span></div>'
          + '<div class="timeline-text">' + escapeHtml(t.description || '') + '</div>'
          + '<div class="sig-tag">' + escapeHtml(sig) + '</div></div></div>';
      }
      timeEl.innerHTML = html;
    }

    function renderCausalChain(r) {
      var chainEl = document.getElementById('causal-chain');
      if (!chainEl) return;
      var chain = (r && r.causalChain) || [];
      if (chain.length === 0) {
        chainEl.innerHTML = '<div class="empty-state"><div class="empty-title">No sequence available</div><div>No step-by-step path in this report.</div></div>';
        return;
      }
      var roleLabels = { 'root_cause': 'Root cause', 'contributing_factor': 'Contributing factor', 'system_effect': 'System effect', 'user_visible_symptom': 'Visible symptom' };
      var html = '';
      for (var i = 0; i < chain.length; i++) {
        var node = chain[i] || {};
        var last = i === chain.length - 1;
        var roleName = roleLabels[node.role] || String(node.role || 'system_effect').replace(/_/g, ' ');
        var refCount = ((node.evidenceIds) || []).length;
        var refBadge = refCount > 0 ? '<span class="step-ref-pill">' + refCount + ' reference' + (refCount > 1 ? 's' : '') + '</span>' : '<span class="step-ref-pill" style="color:var(--text-faint);background:transparent;border-color:var(--border);">0 references</span>';
        html += '<div class="causal-node"><div class="causal-rail"><div class="causal-dot ' + escapeHtml(node.role || '') + '">' + (i + 1) + '</div>' + (last ? '' : '<div class="causal-line"></div>') + '</div>'
          + '<div class="causal-step-content"><div class="step-header"><span class="step-role-title">Step ' + (i + 1) + ' &middot; ' + escapeHtml(roleName) + '</span>' + refBadge + '</div>'
          + '<div class="step-desc">' + escapeHtml(node.description || '') + '</div></div></div>';
      }
      chainEl.innerHTML = html;
    }

    function renderHypotheses(r) {
      var hypoEl = document.getElementById('hypotheses-list');
      if (!hypoEl) return;
      var hyps = (r && r.hypotheses) || [];
      if (hyps.length === 0) {
        hypoEl.innerHTML = '<div class="empty-state"><div class="empty-title">No comparison available</div><div>No candidate explanations in this report.</div></div>';
        return;
      }
      var html = '';
      for (var i = 0; i < hyps.length; i++) {
        var h = hyps[i] || {};
        var statusClass = 'investigating';
        var statusLabel = 'INVESTIGATING';
        var fillColor = 'var(--warn-strong)';
        var rowClass = '';
        if (h.status === 'strongly_supported') { statusClass = 'confirmed'; statusLabel = 'CONFIRMED'; fillColor = 'var(--success-strong)'; rowClass = ' is-confirmed'; }
        else if (h.status === 'disproven' || h.status === 'weakened') { statusClass = 'disproven'; statusLabel = (h.status === 'weakened' ? 'WEAKENED' : 'RULED OUT'); fillColor = 'var(--danger-strong)'; rowClass = ' is-ruledout'; }
        var pct = Math.round(((typeof h.confidence === 'number') ? h.confidence : 0) * 100);
        var suppCount = ((h.supportingEvidenceIds) || []).length;
        var contraCount = ((h.contradictingEvidenceIds) || []).length;
        var suppChip = '<span class="chip ' + (suppCount > 0 ? 'good' : '') + '"><strong>' + suppCount + '</strong>&nbsp;supporting</span>';
        var contraChip = '<span class="chip ' + (contraCount > 0 ? 'bad' : '') + '"><strong>' + contraCount + '</strong>&nbsp;contradicting</span>';
        var refsHtml = '';
        if (h.supportingEvidenceIds && h.supportingEvidenceIds.length > 0) {
          var shown = [];
          for (var k = 0; k < Math.min(4, h.supportingEvidenceIds.length); k++) shown.push(escapeHtml(h.supportingEvidenceIds[k]));
          refsHtml = '<span class="chip-refs" title="' + escapeHtml(h.supportingEvidenceIds.join(', ')) + '">Evidence: ' + shown.join(', ') + (h.supportingEvidenceIds.length > 4 ? ' (+' + (h.supportingEvidenceIds.length - 4) + ' more)' : '') + '</span>';
        }
        var missingHtml = '';
        if (h.missingEvidenceDescriptions && h.missingEvidenceDescriptions.length > 0) {
          var miss = [];
          for (var m = 0; m < h.missingEvidenceDescriptions.length; m++) miss.push(escapeHtml(h.missingEvidenceDescriptions[m]));
          missingHtml = '<div class="hypo-meta" style="margin:6px 0 0;">Missing records: ' + miss.join('; ') + '</div>';
        }
        var verdictNote = '';
        if (h.status === 'strongly_supported') verdictNote = '<div class="hypo-verdict good">Confirmed — supported by the records below with alternatives ruled out.</div>';
        else if (h.status === 'disproven') verdictNote = '<div class="hypo-verdict bad">Ruled out — not supported as the primary cause.</div>';
        else if (h.status === 'weakened') verdictNote = '<div class="hypo-verdict bad">Weakened — not supported as the primary cause.</div>';
        html += '<div class="hypo-row' + rowClass + '"><div class="hypo-top"><span class="hypo-title"><span class="hypo-id">' + escapeHtml(h.id || ('H' + (i + 1))) + '</span>' + escapeHtml(h.cause || 'Unknown explanation') + '</span>'
          + '<span class="pill ' + statusClass + '">' + statusLabel + ' &middot; ' + pct + '%</span></div>'
          + '<div class="progress-bar-bg"><div class="progress-bar-fill" style="width:' + pct + '%;background:' + fillColor + ';"></div></div>'
          + '<div class="hypo-meta">' + escapeHtml(h.rationale || '') + '</div>'
          + '<div class="hypo-chips">' + suppChip + contraChip + refsHtml + '</div>' + missingHtml + verdictNote + '</div>';
      }
      hypoEl.innerHTML = html;
    }

    function renderActions(r) {
      var actEl = document.getElementById('actions-list');
      if (!actEl) return;
      var actions = (r && r.recommendedActions) || [];
      if (actions.length === 0) {
        actEl.innerHTML = '<div class="empty-state"><div class="empty-title">No actions listed</div><div>Review the records above before acting.</div></div>';
        return;
      }
      var html = '';
      for (var i = 0; i < actions.length; i++) {
        var num = String(i + 1).padStart(2, '0');
        html += '<div class="action-row"><span class="action-num">' + num + '</span><div class="action-content">' + formatActionText(actions[i]) + '</div></div>';
      }
      actEl.innerHTML = html;
    }

    function renderSafeguards(r) {
      var panel = document.getElementById('safeguards-panel');
      if (!panel) return;
      var allMissing = {};
      var missingOrder = [];
      function addMissing(m) { if (m && !allMissing[m]) { allMissing[m] = true; missingOrder.push(m); } }
      var baseMissing = (r && r.missingEvidence) || [];
      for (var i = 0; i < baseMissing.length; i++) addMissing(baseMissing[i]);
      var hyps = (r && r.hypotheses) || [];
      for (var j = 0; j < hyps.length; j++) {
        var arr = (hyps[j] && hyps[j].missingEvidenceDescriptions) || [];
        for (var k = 0; k < arr.length; k++) addMissing(arr[k]);
      }
      var altList = ((r && r.alternativeExplanations) || []).slice();
      if (altList.length === 0 && hyps.length > 1) {
        for (var a = 1; a < hyps.length; a++) altList.push((hyps[a].cause || 'Alternative') + ' (' + Math.round(((typeof hyps[a].confidence === 'number') ? hyps[a].confidence : 0) * 100) + '%)');
      }
      var gapsMeta = document.getElementById('gaps-meta');
      if (gapsMeta) gapsMeta.textContent = missingOrder.length > 0 ? (missingOrder.length + (missingOrder.length === 1 ? ' gap' : ' gaps') + ' · needs instrumentation') : 'Complete coverage';
      var missingHtml = '';
      if (missingOrder.length > 0) {
        for (var n = 0; n < missingOrder.length; n++) {
          missingHtml += '<div class="gap-row"><span class="badge-gap">Missing</span><div style="min-width:0;"><div class="gap-name">' + escapeHtml(missingOrder[n]) + '</div><div class="gap-hint">Not present in the loaded records; needed for full confirmation.</div></div></div>';
        }
      } else {
        missingHtml = '<div class="coverage-good">No missing critical records.</div>';
      }
      var altHtml = '';
      if (altList.length > 0) {
        for (var q = 0; q < altList.length; q++) altHtml += '<div class="gap-row"><span class="badge-ruled-out">Ruled out</span><span style="font-size:13px;color:var(--text);font-weight:500;overflow-wrap:anywhere;word-break:break-word;">' + escapeHtml(altList[q]) + '</span></div>';
      } else {
        altHtml = '<div class="gap-hint" style="padding:4px 0;">No alternative explanations required evaluation.</div>';
      }
      panel.innerHTML = '<div class="safeguard-card"><div class="safeguard-label"><span>Operational guardrails</span><span class="safeguard-count">3 active</span></div>'
        + '<div class="guardrails-list"><div class="guardrail-item"><span class="guardrail-dot"></span><span><strong>Read-only access</strong> &mdash; no infrastructure changes</span></div>'
        + '<div class="guardrail-item"><span class="guardrail-dot"></span><span><strong>File and line references</strong> on every record</span></div>'
        + '<div class="guardrail-item"><span class="guardrail-dot"></span><span><strong>Local processing</strong> &mdash; no external calls</span></div></div></div>'
        + '<div class="safeguard-card"><div class="safeguard-label"><span>Record gaps</span><span class="safeguard-count">' + (missingOrder.length > 0 ? missingOrder.length + ' absent' : 'Complete') + '</span></div>' + missingHtml + '</div>'
        + '<div class="safeguard-card"><div class="safeguard-label"><span>Ruled-out alternatives</span><span class="safeguard-count">' + altList.length + ' evaluated</span></div>' + altHtml + '</div>';
    }

    function filterEvidence(mode) {
      currentEvidenceFilter = mode || 'all';
      var pills = document.querySelectorAll('.filter-pill');
      for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
      var activeBtn = document.getElementById('btn-filter-' + currentEvidenceFilter);
      if (activeBtn) activeBtn.classList.add('active');
      evidenceVisibleLimit = 100;
      updateEvidenceView();
    }

    function onSearchEvidence() {
      var searchInput = document.getElementById('evidence-search');
      currentSearchTerm = (searchInput ? searchInput.value : '').toLowerCase().trim();
      evidenceVisibleLimit = 100;
      updateEvidenceView();
    }

    function toggleLogExpand(btnId, dumpId) {
      var dump = document.getElementById(dumpId);
      var btn = document.getElementById(btnId);
      if (!dump || !btn) return;
      if (dump.style.display === 'none') { dump.style.display = 'block'; btn.textContent = 'Hide full log'; }
      else { dump.style.display = 'none'; btn.textContent = btn.getAttribute('data-label') || 'Show full log'; }
    }

    function updateEvidenceView() {
      if (!latestReport) return;
      var r = latestReport;
      var allEv = r.selectedEvidence || [];
      var suppMap = supportingIdSet(r);
      var countAll = allEv.length;
      var countProves = 0, countErrors = 0, countMetrics = 0;
      for (var i = 0; i < allEv.length; i++) {
        var e = allEv[i];
        if (isProving(e, suppMap)) countProves++;
        if (e.severity === 'critical' || e.severity === 'error') countErrors++;
        if (e.value !== undefined) countMetrics++;
      }
      var cAll = document.getElementById('filter-count-all');
      if (cAll) cAll.textContent = String(countAll);
      var cP = document.getElementById('filter-count-proves');
      if (cP) cP.textContent = String(countProves);
      var cE = document.getElementById('filter-count-errors');
      if (cE) cE.textContent = String(countErrors);
      var cM = document.getElementById('filter-count-metrics');
      if (cM) cM.textContent = String(countMetrics);

      var filtered = [];
      for (var j = 0; j < allEv.length; j++) {
        var ev = allEv[j];
        var proving = isProving(ev, suppMap);
        if (currentEvidenceFilter === 'proves' && !proving) continue;
        if (currentEvidenceFilter === 'errors' && ev.severity !== 'critical' && ev.severity !== 'error') continue;
        if (currentEvidenceFilter === 'metrics' && ev.value === undefined) continue;
        if (currentSearchTerm) {
          var msg = (ev.message || '').toLowerCase();
          var src = (ev.source || '').toLowerCase();
          var svc = (ev.service || '').toLowerCase();
          var ref = ev.originalReference ? String(ev.originalReference.file || '').toLowerCase() : '';
          if (msg.indexOf(currentSearchTerm) === -1 && src.indexOf(currentSearchTerm) === -1 && svc.indexOf(currentSearchTerm) === -1 && ref.indexOf(currentSearchTerm) === -1) continue;
        }
        filtered.push(ev);
      }

      var countLabel = document.getElementById('evidence-count');
      if (countLabel) countLabel.textContent = filtered.length + ' shown of ' + countAll + ' · ' + countProves + ' supporting finding';
      var evBody = document.getElementById('evidence-table-body');
      var footerNote = document.getElementById('evidence-footer-note');
      var moreBtn = document.getElementById('btn-show-more-evidence');
      if (!evBody) return;
      if (filtered.length === 0) {
        evBody.innerHTML = '<tr><td colspan="4"><div class="empty-state"><div class="empty-title">No evidence matches</div><div>Adjust the active filter or search term.</div><div class="empty-cta"><button class="btn-ghost" type="button" onclick="filterEvidence(\\'all\\')">Reset filters</button></div></div></td></tr>';
        if (footerNote) footerNote.textContent = '0 of ' + countAll + ' items';
        if (moreBtn) moreBtn.style.display = 'none';
        return;
      }
      var visible = filtered.slice(0, evidenceVisibleLimit);
      var html = '';
      for (var idx = 0; idx < visible.length; idx++) {
        var item = visible[idx];
        var isSup = isProving(item, suppMap);
        var refFile = item.source || '';
        var refDir = '';
        var refLine = '';
        if (item.originalReference) {
          refLine = ':L' + item.originalReference.line;
          var fullPath = String(item.originalReference.file || '');
          var parts = fullPath.replace(/\\\\/g, '/').split('/');
          refFile = parts[parts.length - 1] || fullPath;
          if (parts.length > 1) refDir = parts.slice(0, parts.length - 1).join('/');
        }
        var msgFull = item.message || '';
        var isLong = msgFull.length > 200;
        var previewMsg = isLong ? msgFull.slice(0, 190) + '...' : msgFull;
        var btnId = 'ev-btn-' + idx;
        var dumpId = 'ev-dump-' + idx;
        var expandToggle = '';
        if (isLong) expandToggle = '<button id="' + btnId + '" data-label="Show full log (' + msgFull.length + ' chars)" class="ev-expand-btn" onclick="toggleLogExpand(\\'' + btnId + '\\',\\'' + dumpId + '\\')">Show full log (' + msgFull.length + ' chars)</button><div id="' + dumpId + '" class="ev-full-dump" style="display:none;">' + escapeHtml(msgFull) + '</div>';
        var metricVal = item.value !== undefined ? '<div><span class="ev-metric-badge">Metric: ' + escapeHtml(String(item.value)) + ' ' + escapeHtml(item.unit || '') + '</span></div>' : '';
        html += '<tr class="' + (isSup ? 'is-proving' : '') + '"><td class="col-num">#' + String(idx + 1).padStart(2, '0') + '</td>'
          + '<td class="col-sev"><span class="badge-sev ' + escapeHtml(item.severity || 'info') + '">' + escapeHtml(item.severity || 'info') + '</span>' + (isSup ? '<br/><span class="badge-proves">SUPPORTS FINDING</span>' : '') + '</td>'
          + '<td class="col-source"><div class="source-container" title="' + escapeHtml(item.originalReference ? item.originalReference.file : item.source) + '"><span class="source-pill">' + escapeHtml(refFile) + escapeHtml(refLine) + '</span>' + (refDir ? '<span class="source-dir">' + escapeHtml(refDir) + '</span>' : '') + '</div></td>'
          + '<td class="col-msg"><div class="ev-msg-text">' + escapeHtml(previewMsg) + '</div>' + expandToggle + metricVal + '</td></tr>';
      }
      evBody.innerHTML = html;
      if (footerNote) footerNote.textContent = visible.length + ' of ' + filtered.length + ' matching items (total ' + countAll + ')';
      if (moreBtn) moreBtn.style.display = filtered.length > visible.length ? '' : 'none';
    }

    async function copyActionPlan() {
      if (!latestReport) return;
      var r = latestReport;
      var rootCause = (r.rootCause && r.rootCause.description) || 'Unknown';
      var conf = (r.rootCause && typeof r.rootCause.confidence === 'number') ? Math.round(r.rootCause.confidence * 100) : 0;
      var rule = (r.rootCause && r.rootCause.ruleId) ? (' [' + r.rootCause.ruleId + ']') : '';
      var actions = ((r.recommendedActions) || []).map(function (a, i) { return (i + 1) + '. ' + a; }).join('\\n');
      var allMissing = {};
      var missingOrder = [];
      function addM(m) { if (m && !allMissing[m]) { allMissing[m] = true; missingOrder.push(m); } }
      var bm = (r.missingEvidence) || [];
      for (var i = 0; i < bm.length; i++) addM(bm[i]);
      var hyps = (r.hypotheses) || [];
      for (var j = 0; j < hyps.length; j++) {
        var arr = (hyps[j] && hyps[j].missingEvidenceDescriptions) || [];
        for (var k = 0; k < arr.length; k++) addM(arr[k]);
      }
      var missingText = missingOrder.length > 0 ? '\\n\\n### Record gaps\\n' + missingOrder.map(function (m) { return '- ' + m; }).join('\\n') : '\\n\\n### Record coverage\\n- No missing critical records';
      var altList = ((r.alternativeExplanations) || []).slice();
      if (altList.length === 0 && hyps.length > 1) {
        for (var a = 1; a < hyps.length; a++) altList.push(hyps[a].cause + ' (' + Math.round(((typeof hyps[a].confidence === 'number') ? hyps[a].confidence : 0) * 100) + '%)');
      }
      var altText = altList.length > 0 ? '\\n\\n### Ruled-out alternatives\\n' + altList.map(function (x) { return '- ' + x; }).join('\\n') : '';
      var text = '## Investigation: ' + (r.targetTitle || r.incidentId || 'Incident') + '\\n'
        + '**Root cause**: ' + rootCause + rule + ' (' + conf + '%)\\n'
        + '**Rationale**: ' + ((r.rootCause && r.rootCause.confidenceRationale) || '') + '\\n\\n'
        + '### Recommended actions\\n' + actions + missingText + altText + '\\n\\n'
        + '*Exported from Incident Investigation Console (read-only)*';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); }
        else {
          var ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        var toast = document.getElementById('copy-toast');
        if (toast) { toast.classList.add('visible'); setTimeout(function () { toast.classList.remove('visible'); }, 2200); }
      } catch (err) { showError('Clipboard copy failed: ' + (err && err.message ? err.message : err)); }
    }

    async function stopServer() {
      if (!confirm('Stop the Investigator dashboard server and release the port?')) return;
      try { await fetch('/api/shutdown', { method: 'POST' }); } catch (e) {}
      document.body.innerHTML = '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#060c18;color:#e6edf3;font-family:Inter,system-ui,sans-serif;padding:24px;">'
        + '<div style="max-width:440px;background:#0e1930;padding:36px 32px;border-radius:14px;border:1px solid #1c2c48;text-align:center;">'
        + '<div style="margin-bottom:12px;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff8a80" stroke-width="2" style="margin:0 auto;display:block;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>'
        + '<h2 style="color:#ff8a80;margin-bottom:8px;font-size:20px;font-weight:750;">Server stopped</h2>'
        + '<p style="color:#c3d0e3;font-size:14px;line-height:1.5;margin-bottom:16px;">The local dashboard server has been stopped and the port released.</p>'
        + '<p style="color:#8296b1;font-size:12px;">You can safely close this tab.</p>'
        + '</div></div>';
    }

    window.toggleTheme = toggleTheme;
    window.fetchInvestigation = fetchInvestigation;
    window.onTargetChange = onTargetChange;
    window.filterEvidence = filterEvidence;
    window.onSearchEvidence = onSearchEvidence;
    window.toggleLogExpand = toggleLogExpand;
    window.copyActionPlan = copyActionPlan;
    window.stopServer = stopServer;

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
    else { init(); }
  </script>
</body>
</html>`;
}
