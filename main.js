/* adam-mokcsay.is-a.dev – a tiny zsh that only knows about Adam. Vanilla JS, no dependencies. */
(() => {
  'use strict';

  const LINKEDIN = 'https://www.linkedin.com/in/adammokcsay/';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const screen = $('#screen');
  const form = $('#prompt');
  const input = $('#cmd');
  const wrap = $('.input-wrap');
  const liveDir = $('#live-dir');
  const before = $('#before');
  const cursor = $('#cursor');
  const after = $('#after');

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ── content ──────────────────────────────────────────── */

  const PROJECTS = {
    fintech: {
      desc: 'Backend of a UK investing site, ~60k visits/day, built to scale',
      lines: [
        'Backend for a UK investing & personal-finance site: live market data, articles and tools.',
        'Around 60,000 visits a day – the job was keeping it fast and boring under traffic spikes.',
        'Scaling, caching and auth on AWS, with a Nuxt front end on top.',
      ],
      tags: 'NestJS · Vue/Nuxt · AWS · OAuth',
    },
    logistics: {
      desc: 'AI optimisation for a truck fleet',
      lines: [
        'Platform that helps a trucking company run its fleet with AI-driven optimisation.',
        'Worked as lead developer on a full-stack team: web, mobile and serverless backend.',
      ],
      tags: 'TypeScript · Node · React · AWS Lambda · DynamoDB · PostgreSQL · Flutter',
    },
    maritime: {
      desc: 'Guest administration for tour ships, with passport/ID scanner',
      lines: [
        'Guest administration for tour ships (2012).',
        'Passports and ID cards are read with a dedicated document scanner: name, nationality and photo are stored automatically.',
        'At every border crossing the guest list is generated in one click instead of being typed up by hand.',
      ],
      tags: 'hardware integration · ID-document scanning · desktop app',
    },
    energy: {
      desc: 'Own a virtual share of a real solar farm, earn from its output',
      lines: [
        'Buy panels in a real solar farm without owning a roof.',
        'The farm sells the energy it produces, and members get paid for their share of the output.',
        'Platform for buying shares, tracking production and paying out.',
      ],
      tags: 'full-stack · payments · energy data',
    },
    proptech: {
      desc: 'Portfolio platform for real-estate investors',
      lines: [
        'Portfolio platform for real-estate investors.',
        'Properties, investments and their numbers in one place instead of a pile of spreadsheets.',
      ],
      tags: 'full-stack · dashboards',
    },
    automotive: {
      desc: 'TPMS and automatic transmission control software',
      lines: [
        'Software that lives in cars: tyre-pressure monitoring (TPMS) and automatic transmission control.',
        'The gearbox work is C++ on a microcontroller, driving the transmission\'s electromagnetic valves.',
        'Started back in 2013 with an automotive internship: black-box model and customer software integration.',
      ],
      tags: 'C++ · Arduino · embedded',
    },
    industrial: {
      desc: 'Industrial automation projects',
      lines: [
        'Industrial automation projects – software that talks to real machines.',
        'Same rule as in the car: when hardware is in the loop, "it works on my machine" is not an option.',
      ],
      tags: 'automation · integration · embedded',
    },
    process: {
      desc: 'BPMN workflow systems',
      lines: [
        'Workflow systems built on BPMN: business processes modelled as diagrams, then executed as software.',
        'Processes stay readable for the business and testable for the engineers.',
      ],
      tags: 'BPMN · workflow engines · .NET',
    },
    research: {
      desc: 'Text-mining bankruptcy early warning, process simulation, an ITIL game',
      lines: [
        'Early-warning system (2012–2013): text mining over online articles to estimate a company\'s bankruptcy risk.',
        'Business-process simulation & optimisation driven by a BPMS workflow engine (2014–).',
        'ITILlustrator (2013): a hotel-management game for practising ITIL, built with friends.',
        'University of Pannonia research, declared an Eminent Student by the dean.',
      ],
      tags: 'text mining · simulation · BPMS · game design',
    },
    agents: {
      desc: 'Agent-based simulation of healthcare processes',
      lines: [
        'Agent-based simulation of healthcare and business processes at a GE Healthcare / IBM joint venture (2012–2016).',
        'Led a team of 6–8 on architecture and development.',
        'BSc and MSc theses on text mining and agent-based simulation – agents, before it was cool.',
        'Try `simulate` for a (very) small taste.',
      ],
      tags: 'C# · WPF · WCF · REST · AOP · Entity Framework',
    },
    geo: {
      desc: 'Geospatial queries on DynamoDB',
      lines: [
        '"Find everything within 5 km" – on a key-value store that has no idea what a map is.',
        'Wrote an open-source TypeScript port of a geo library for DynamoDB, and used it in production.',
      ],
      tags: 'TypeScript · DynamoDB · geohashing',
    },
    fitness: {
      desc: 'Coaching & training app',
      lines: [
        'App for coaches and the people they train: plans, workouts and progress in one place.',
        'Built as a React PWA – installs like an app, no app store needed.',
      ],
      tags: 'React · PWA',
    },
    adtech: {
      desc: 'Bulk Facebook ad loader',
      lines: [
        'Bulk loader for Facebook ads: create and update ads in batches instead of clicking through them one by one.',
      ],
      tags: 'Node · Facebook Marketing API',
    },
    web: {
      desc: 'Smaller websites, incl. a shading-systems manufacturer',
      lines: [
        'Smaller websites along the way, including one for a shading-systems manufacturer (blinds, awnings, shutters).',
      ],
      tags: 'HTML · CSS · JavaScript',
    },
  };

  const PORTRAIT = [
    '                  ....,:,,.',
    '                     .... ,.',
    '                 :-+*##*+-.',
    '             :;-+#@@@@@@@@%:',
    '            :=*#%@@@@@@@@@@@:.',
    '           :-=+##%@@@@@@@@@@*',
    '          .;;:;--;;+%@#++*%@*',
    '        . ,--=--+=-=%@#;;==#*',
    '        :.:-*%@@%#*#@@@@@%%@#,',
    '       .::,;+*%#=;:;*#%##@@@%=',
    '        .::;;=+;;--=+#%%-=%@@;',
    '          ,;-=*:.-+*##+::+%@*',
    '        ,=%-:;=*;;-++*+**%%:',
    '      ,+%%%%##;-====*#@@#*,',
    '     :#@@@@%@%%#++#%@@@%*+, . . .',
    '     -++#@@@%#%%%::;--=*%+#*++=*%+****=:',
    '    ,==+***@@@-;;. .,-#%@+#@++%#*%%@@@%#',
    '   ,;-+**+#@@+ ,  ,;-*%%@*%*=#*+%%#@%#%%',
  ].join('\n');

  const HELP = [
    ['whoami', 'who is this'],
    ['about', 'short bio'],
    ['ls', 'list projects'],
    ['cat <project>', 'open a project, e.g. cat energy'],
    ['stack', 'languages & tools'],
    ['git log', 'career history'],
    ['awards', 'competition results'],
    ['neofetch', 'system info, human edition'],
    ['simulate', 'run a tiny agent-based simulation'],
    ['linkedin', 'open my LinkedIn profile'],
    ['sudo hire-me', 'you know you want to'],
    ['clear', 'clear the screen'],
  ];

  const GITLOG = [
    ['7f3a2c1', 'Feb 2026 – now', 'Freelance software engineer', 'Full-stack, cloud and mobile – back on my own', true],
    ['c94e1b7', 'Mar 2022 – Feb 2026', 'Lead Software Engineer @ INSPYRE Informatics (contract, remote)', 'Lead developer for international clients: logistics, mobility, health and more · 200+ engineer interviews'],
    ['a61d03f', 'Jun 2021 – Mar 2022', 'Professional freelancer', 'Independent projects for international clients'],
    ['e41b9a0', 'Jan 2017 – Jun 2021', 'Founder & CTO @ Aeriu – exited', 'Built and led a team of 5 · AI, mobile & cloud · .NET Core, MongoDB, AWS, Vue.js, Swift, Flutter'],
    ['5b9e0d4', 'Mar 2016 – Jul 2017', 'Senior Software Engineer @ evosoft', 'Scrum transformation · mentoring · architectural refactoring · CI · TDD'],
    ['2d07e6b', '2014 – 2016', 'MSc Computer Science, University of Pannonia', 'Declared an Eminent Student by the dean'],
    ['19a4c3f', 'Sep 2013 – Jan 2014', 'Software Development Engineer @ Continental', 'Customer software integration · black-box model integration'],
    ['3c8f1aa', 'Oct 2012 – Jan 2016', 'Senior Software Engineer @ GE (GE Healthcare / IBM joint venture)', 'Agent-based simulation of healthcare & business processes · team coordination (6–8)'],
    ['8e2f6c4', 'Jun – Jul 2012', 'Software Developer intern @ Flextronics', 'Built a task-distribution tool in Delphi from scratch'],
    ['0b5e2d1', '2010 – 2014', 'BSc Computer Engineering, University of Pannonia', ''],
    ['0000001', '2008', 'Initial commit: first podium at a national IT competition', ''],
  ];

  const AWARDS = [
    ['1st', 'Neumann János IT Competition, national (2010) · 3rd (2008)'],
    ['1st', 'ITech Challenge, T-Systems (2013)'],
    ['1st', '24-hour Programming Competition (2013) · 2nd (2015) · 3rd (2012, 2014)'],
    ['1st', 'BEST – Continental IT Competition (2013, 2015) · 2nd (2014)'],
    ['2nd', 'University of Pannonia TDK Scientific Workshop, IT section (2014)'],
    ['3rd', 'European BEST Engineering Competition – EBEC Central, Prague (2015)'],
    ['3rd', 'KöMaL Sign-S IT Contest, national (2010) · 11th (2009)'],
    ['final', 'NLV Logistics of the Future (2015) – special award: most environmentally friendly team'],
  ];

  const COMMANDS = ['help', 'whoami', 'about', 'ls', 'cat', 'stack', 'git log', 'awards', 'neofetch',
    'simulate', 'linkedin', 'sudo hire-me', 'clear', 'cd', 'pwd', 'history', 'echo', 'date', 'exit'];

  /* ── rendering helpers ────────────────────────────────── */

  let cwd = '~';
  const history = [];
  let histIdx = 0;
  let draft = '';
  let sim = null;

  const promptHTML = (dir, cmdHTML) =>
    `<div class="prompt"><span class="seg ctx">adam@mokcsay</span><span class="seg dir">${esc(dir)}</span>` +
    `<span class="seg git">⎇ main</span><span class="cmd">${cmdHTML}</span></div>`;

  function block(cmd, outHTML, opts = {}) {
    const el = document.createElement('div');
    el.className = 'block';
    el.innerHTML = promptHTML(opts.dir || cwd, opts.cmdHTML != null ? opts.cmdHTML : esc(cmd)) +
      (outHTML != null ? `<div class="out${opts.wide ? ' wide' : ''}">${outHTML}</div>` : '');
    upgradeCmdLinks(el);
    screen.appendChild(el);
    return el;
  }

  function appendOut(el, html) {
    let out = el.querySelector('.out');
    if (!out) { out = document.createElement('div'); out.className = 'out'; el.appendChild(out); }
    out.insertAdjacentHTML('beforeend', html);
    upgradeCmdLinks(out);
  }

  const cmdLink = (cmd, label = cmd, cls = 'cmdlink') =>
    `<span class="${cls}" data-cmd="${esc(cmd)}">${esc(label)}</span>`;

  function upgradeCmdLinks(root) {
    root.querySelectorAll('[data-cmd]').forEach((el) => {
      if (el.tagName === 'BUTTON' || el.dataset.ready) return;
      el.dataset.ready = '1';
      el.classList.add('is-cmd');
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
    });
  }

  function scrollToPrompt() {
    form.scrollIntoView({ block: 'end', behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function openLinkedIn() {
    const w = window.open(LINKEDIN, '_blank', 'noopener');
    return w !== null;
  }

  /* ── command outputs ──────────────────────────────────── */

  const out = {
    help: () =>
      `<p>Available commands:</p><dl class="help">` +
      HELP.map(([c, d]) => `<dt>${cmdLink(c.replace(' <project>', ' energy'), c, 'cmdlink')}</dt><dd>${esc(d)}</dd>`).join('') +
      `</dl><p class="c"># Tab completes · ↑/↓ history · Ctrl+C cancels · Ctrl+L clears</p>`,

    whoami: () =>
      `<h1 class="name">Adam Mokcsay <b>is a dev.</b></h1>` +
      `<p class="c"># full-stack lead engineer · ex-founder &amp; CTO · Budapest, Hungary</p>` +
      `<p class="c"># ${cmdLink('echo $GREETING', '01001000 01100101 01101100 01101100 01101111 00100001', 'bin')}</p>`,

    about: () =>
      `<p>A developer who keeps improving. I build software that runs real businesses – scalable cloud backends, mobile apps, and the odd gearbox controller.</p>` +
      `<p>Since 2017 I've founded (and exited) a startup as CTO, then led engineering for international clients as a contractor, fully remote. ` +
      `Before that: agent-based healthcare simulation at a GE / IBM joint venture and enterprise software at evosoft. ` +
      `300+ engineer interviews along the way, and agents before it was cool.</p>` +
      `<p class="stats"><span><b>14</b> years</span><span><b>300+</b> interviews</span><span><b>1</b> exited startup</span><span><b>~60k</b> daily visits handled</span></p>`,

    ls: () =>
      `<dl class="ls">` +
      Object.entries(PROJECTS).map(([k, p]) => `<dt>${cmdLink('cat ' + k, k + '/', 'k')}</dt><dd>${esc(p.desc)}</dd>`).join('') +
      `</dl><p class="c"># client work is under NDA, so no names – ${cmdLink('cat energy', 'cat <project>')} for the story</p>`,

    project: (k) => {
      const p = PROJECTS[k];
      return `<p><span class="k">${esc(k)}/</span> <span class="w">${esc(p.desc)}</span></p>` +
        p.lines.map((l) => `<p>${esc(l).replace(/`([^`]+)`/g, (_, c) => cmdLink(c))}</p>`).join('') +
        `<p class="c"># ${esc(p.tags)}</p>`;
    },

    stack: () => $('.session .stack') ? $('.session .stack').outerHTML : `<dl class="ls stack">
      <dt class="g">languages</dt><dd>TypeScript · JavaScript · C# · Dart · Swift · C++</dd>
      <dt class="cy">frontend</dt><dd>React · Redux · Vue · Nuxt · Flutter · WPF</dd>
      <dt class="m">backend</dt><dd>Node · NestJS · .NET Core · Entity Framework</dd>
      <dt class="y">cloud &amp; data</dt><dd>AWS Lambda · DynamoDB · PostgreSQL · MSSQL · MongoDB · CosmosDB</dd>
      <dt class="r">practice</dt><dd>Microservices · CQRS/ES · Docker · OAuth · TDD · Scrum · team lead</dd></dl>`,

    gitlog: () =>
      `<ul class="log">` +
      GITLOG.map(([h, when, msg, sub, head]) =>
        `<li><span class="hash">${h}</span><span>` +
        (head ? `<span class="ref">(<b>HEAD -&gt; main</b>)</span> ` : '') +
        `<span class="msg">${esc(msg)}</span> <span class="when">${esc(when)}</span></span>` +
        (sub ? `<span class="sub">${esc(sub)}</span>` : '') + `</li>`).join('') +
      `</ul>`,

    awards: () =>
      `<dl class="awards">` + AWARDS.map(([p, t]) => `<dt>${esc(p)}</dt><dd>${esc(t)}</dd>`).join('') + `</dl>`,

    neofetch: () => {
      const rows = [
        ['OS', 'Human 1.0 (Hungarian edition)'],
        ['Host', 'adam-mokcsay.is-a.dev'],
        ['Uptime', '14 years in production (since 2012)'],
        ['Location', 'Budapest, Hungary'],
        ['Shell', 'zsh + agnoster'],
        ['Role', 'Full-stack lead engineer'],
        ['Packages', 'TypeScript, .NET, AWS, Flutter, C++'],
        ['Interviews', '300+ engineers'],
        ['Startups', '1 (exited)'],
        ['Theme', 'Ghostty Default Dark'],
        ['Font', 'SF Mono'],
      ];
      const sw = ['--black', '--red', '--green', '--yellow', '--blue', '--magenta', '--cyan', '--white']
        .map((v) => `<i style="background:var(${v})"></i>`).join('');
      return `<div class="neofetch"><pre class="portrait" aria-hidden="true">${esc(PORTRAIT)}</pre>` +
        `<span class="sr-only">ASCII portrait of Adam.</span>` +
        `<div class="info"><p><span class="w g">adam</span>@<span class="w g">mokcsay</span></p><p class="c">-------------</p>` +
        `<dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` +
        `<div class="swatches" aria-hidden="true">${sw}</div></div></div>`;
    },
  };

  /* ── simulation: patients flowing through three desks ─── */

  function simulate(el) {
    const W = 34, H = 9, TICKS = 90;
    const desks = [1, 4, 7].map((y) => ({ x: W - 3, y, busy: 0, queue: 0 }));
    let agents = [], served = 0, totalTime = 0, tick = 0;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    appendOut(el, `<div class="sim"><p class="c"># a clinic: patients arrive at random, walk to the shortest queue, get served. Ctrl+C to stop.</p>` +
      `<pre aria-hidden="true"></pre><p class="sim-stats"></p></div>`);
    const pre = el.querySelector('.sim pre');
    const stats = el.querySelector('.sim-stats');

    const occupied = (x, y) => agents.some((a) => a.x === x && a.y === y);

    function step() {
      tick++;
      if (tick < TICKS - 28 && rnd() < 0.42) {
        const y = 1 + Math.floor(rnd() * (H - 2));
        if (!occupied(0, y)) {
          const d = desks.reduce((best, d) => (d.queue < best.queue ? d : best), desks[0]);
          d.queue++;
          agents.push({ x: 0, y, desk: d, born: tick });
        }
      }
      desks.forEach((d) => { if (d.busy > 0) d.busy--; });
      for (const a of agents) {
        const tx = a.desk.x - 1, ty = a.desk.y;
        if (a.x === tx && a.y === ty) {
          if (a.desk.busy === 0) {
            a.desk.busy = 4 + Math.floor(rnd() * 6);
            a.desk.queue--;
            a.done = true;
            served++;
            totalTime += tick - a.born;
          }
          continue;
        }
        let nx = a.x, ny = a.y;
        if (a.x < tx) nx++;
        else if (a.y !== ty) ny += Math.sign(ty - a.y);
        if (nx === a.x && ny === a.y) continue;
        if (!occupied(nx, ny)) { a.x = nx; a.y = ny; }
        else if (a.y !== ty && !occupied(a.x, a.y + Math.sign(ty - a.y))) a.y += Math.sign(ty - a.y);
      }
      agents = agents.filter((a) => !a.done);
    }

    function render() {
      const grid = [];
      for (let y = 0; y < H; y++) {
        let row = '';
        for (let x = 0; x < W; x++) {
          const desk = desks.find((d) => d.x === x && d.y === y);
          if (desk) row += desk.busy ? '<span class="busy">#</span>' : '<span class="free">+</span>';
          else if (x === W - 2) row += '<span class="wall">|</span>';
          else if (agents.some((a) => a.x === x && a.y === y)) row += '<span class="agent">o</span>';
          else row += x === 0 ? '<span class="wall">›</span>' : ' ';
        }
        grid.push(row);
      }
      pre.innerHTML = grid.join('\n');
      const avg = served ? Math.round(totalTime / served) : 0;
      stats.innerHTML = `<span class="c">tick</span> ${tick}  <span class="c">in clinic</span> ${agents.length}  ` +
        `<span class="c">served</span> <b class="y">${served}</b>  <span class="c">avg time</span> ${avg}`;
    }

    function finish(cancelled) {
      sim = null;
      form.classList.remove('busy');
      const avg = served ? Math.round(totalTime / served) : 0;
      appendOut(el, cancelled
        ? `<p class="cancel">^C</p>`
        : `<p class="g">done: ${served} patients served, ${avg} ticks on average. agents, before it was cool.</p>`);
      scrollToPrompt();
    }

    if (reducedMotion) {
      while (tick < TICKS) step();
      render();
      finish(false);
      return;
    }
    form.classList.add('busy');
    render();
    const timer = setInterval(() => {
      step(); render();
      if (tick >= TICKS) { clearInterval(timer); finish(false); }
    }, 70);
    sim = { stop: () => { clearInterval(timer); finish(true); } };
  }

  /* ── command dispatch ─────────────────────────────────── */

  function normalizeTarget(arg) {
    return arg.replace(/^~\/?/, '').replace(/^projects\//, '').replace(/\/+$/, '').toLowerCase();
  }

  function run(raw, { record = true } = {}) {
    if (sim) sim.stop();
    const line = raw.trim();
    if (record && line && history[history.length - 1] !== line) history.push(line);
    histIdx = history.length;
    draft = '';

    if (!line) { block('', null); return scrollToPrompt(); }

    const [cmd, ...args] = line.split(/\s+/);
    const arg = args.join(' ');
    const lc = cmd.toLowerCase();

    if (lc === 'clear' || lc === 'cls') { screen.innerHTML = ''; return scrollToPrompt(); }

    let html;
    let el;
    switch (lc) {
      case 'help': case '?': case 'man': html = out.help(); break;
      case 'whoami': html = out.whoami(); break;
      case 'about': html = out.about(); break;
      case 'ls': case 'll': case 'dir': case 'tree': html = out.ls(); break;
      case 'stack': html = out.stack(); break;
      case 'awards': case 'trophies': html = out.awards(); break;
      case 'neofetch': case 'fastfetch': html = out.neofetch(); break;
      case 'cat': case 'less': case 'more': case 'open': {
        const t = normalizeTarget(arg);
        if (!t) html = `<p>usage: cat &lt;project&gt; – try ${cmdLink('ls')}</p>`;
        else if (t === 'about.md' || t === 'about') html = out.about();
        else if (t === 'stack.txt' || t === 'stack') html = out.stack();
        else if (PROJECTS[t]) html = out.project(t);
        else html = `<p class="err">cat: ${esc(arg)}: No such file or directory</p>`;
        break;
      }
      case 'git':
        if (/^log\b/.test(arg)) html = out.gitlog();
        else if (arg === 'status') html = `<p>On branch main</p><p>nothing to commit, working tree clean</p>`;
        else html = `<p>try ${cmdLink('git log')}</p>`;
        break;
      case 'linkedin': {
        const opened = openLinkedIn();
        html = `<p><span class="k">linkedin</span>  <a class="lnk" href="${LINKEDIN}" target="_blank" rel="noopener">linkedin.com/in/adammokcsay</a></p>` +
          (opened ? `<p class="c"># opened in a new tab</p>` : '');
        break;
      }
      case 'sudo':
        if (/^hire[- ]?(me|adam)?$/i.test(arg)) {
          openLinkedIn();
          html = `<p class="c">[sudo] password for visitor: ********</p><p class="g">Permission granted. Opening LinkedIn…</p>` +
            `<p><a class="lnk" href="${LINKEDIN}" target="_blank" rel="noopener">linkedin.com/in/adammokcsay</a></p>`;
        } else if (!arg) html = `<p>usage: sudo hire-me</p>`;
        else html = `<p class="err">visitor is not in the sudoers file. This incident will be reported.</p>`;
        break;
      case 'simulate': case 'sim':
        el = block(line, '');
        el.querySelector('.out').innerHTML = '';
        simulate(el);
        return scrollToPrompt();
      case 'cd': {
        const t = normalizeTarget(arg);
        if (!arg || arg === '~' || arg === '..' || arg === '/' || arg === '-') cwd = '~';
        else if (t === '' || t === 'projects') cwd = '~/projects';
        else if (PROJECTS[t]) html = `<p class="err">cd: permission denied: ${esc(t)}</p><p class="c"># client work is under NDA – ${cmdLink('cat ' + t)} tells the story without names</p>`;
        else html = `<p class="err">cd: no such file or directory: ${esc(arg)}</p>`;
        el = block(line, html, { dir: liveDir.textContent });
        liveDir.textContent = cwd;
        return scrollToPrompt();
      }
      case 'pwd': html = `<p>/home/adam${cwd === '~' ? '' : '/projects'}</p>`; break;
      case 'history': html = `<pre>${history.map((h, i) => `${String(i + 1).padStart(4)}  ${esc(h)}`).join('\n')}</pre>`; break;
      case 'echo': {
        const vars = { GREETING: 'Hello!', USER: 'visitor', SHELL: '/bin/zsh', HOME: '/home/adam', PWD: cwd === '~' ? '/home/adam' : '/home/adam/projects' };
        html = `<p>${esc(arg.replace(/\$\{?([A-Z_]+)\}?/g, (m, v) => (v in vars ? vars[v] : '')))}</p>`;
        break;
      }
      case 'date': html = `<p>${esc(new Date().toString())}</p>`; break;
      case 'exit': case 'logout': case 'quit':
        html = `<p>there is no escape. but there is ${cmdLink('linkedin')}.</p>`; break;
      case 'rm': html = `<p class="y">nice try.</p>`; break;
      case 'vim': case 'vi': case 'nvim': case 'nano': case 'emacs':
        html = `<p>how do I exit?</p>`; break;
      case ':q': case ':wq': case ':q!': html = `<p>you're not in vim. great reflexes though.</p>`; break;
      case 'hi': case 'hello': case 'hey': html = `<p>01001000 01100101 01101100 01101100 01101111 00100001</p><p class="c"># that's "Hello!" in binary. type ${cmdLink('help')} to look around.</p>`; break;
      case 'hire-me': case 'hire': html = `<p>almost – try ${cmdLink('sudo hire-me')}</p>`; break;
      default:
        html = `<p class="err">zsh: command not found: ${esc(cmd)}</p><p class="c"># try ${cmdLink('help')}</p>`;
    }
    block(line, html, { wide: lc === 'neofetch' });
    scrollToPrompt();
  }

  /* ── input, mirror cursor, history, completion ────────── */

  function paintMirror() {
    const v = input.value;
    const pos = input.selectionStart == null ? v.length : input.selectionStart;
    before.textContent = v.slice(0, pos);
    cursor.textContent = v.charAt(pos) || ' ';
    after.textContent = v.slice(pos + 1);
  }

  function setValue(v) {
    input.value = v;
    input.setSelectionRange(v.length, v.length);
    paintMirror();
  }

  function commonPrefix(list) {
    if (!list.length) return '';
    let p = list[0];
    for (const s of list) while (!s.startsWith(p)) p = p.slice(0, -1);
    return p;
  }

  function complete() {
    const v = input.value.replace(/^\s+/, '');
    let pool, prefix, partial;
    const m = v.match(/^(cat|cd|less|open)\s+(\S*)$/i);
    if (m) {
      prefix = m[1] + ' ';
      partial = m[2].replace(/^(~\/)?(projects\/)?/, '');
      pool = m[1].toLowerCase() === 'cd' ? ['projects', '..', '~'] : [...Object.keys(PROJECTS), 'about.md', 'stack.txt'];
    } else if (!/\s.*\s/.test(v)) {
      prefix = '';
      partial = v;
      pool = COMMANDS;
    } else return;
    const hits = pool.filter((p) => p.startsWith(partial));
    if (!hits.length) return;
    if (hits.length === 1) {
      const h = hits[0];
      setValue(prefix + h + (prefix === '' && (h === 'cat' || h === 'cd') ? ' ' : ''));
      return;
    }
    const cp = commonPrefix(hits);
    if (cp.length > partial.length) { setValue(prefix + cp); return; }
    const el = document.createElement('div');
    el.className = 'block';
    el.innerHTML = promptHTML(cwd, esc(input.value)) +
      `<div class="out"><p>${hits.map((h) => cmdLink(prefix + h, h, 'k')).join('  ')}</p></div>`;
    upgradeCmdLinks(el);
    screen.appendChild(el);
    scrollToPrompt();
  }

  input.addEventListener('input', paintMirror);
  ['keyup', 'click', 'select', 'focus'].forEach((e) => input.addEventListener(e, paintMirror));
  document.addEventListener('selectionchange', () => { if (document.activeElement === input) paintMirror(); });
  input.addEventListener('focus', () => wrap.classList.add('focused'));
  input.addEventListener('blur', () => wrap.classList.remove('focused'));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); complete(); return; }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx === history.length) draft = input.value;
      if (histIdx > 0) { histIdx--; setValue(history[histIdx]); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < history.length) { histIdx++; setValue(histIdx === history.length ? draft : history[histIdx]); }
      return;
    }
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
      if (sim) { e.preventDefault(); sim.stop(); return; }
      if (input.selectionStart !== input.selectionEnd) return; // let people copy
      e.preventDefault();
      block('', null, { cmdHTML: esc(input.value) + '<span class="cancel">^C</span>' });
      setValue('');
      scrollToPrompt();
      return;
    }
    if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) { e.preventDefault(); screen.innerHTML = ''; return; }
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) { e.preventDefault(); setValue(''); }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    setValue('');
    run(v);
  });

  // Clicking a command anywhere runs it; clicking the terminal focuses the prompt (desktop only).
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-cmd]');
    if (t) {
      e.preventDefault();
      run(t.dataset.cmd);
      if (!coarse) input.focus({ preventScroll: true });
      return;
    }
    if (coarse || e.target.closest('a')) return;
    if (e.target.closest('.body') && !String(window.getSelection())) input.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', (e) => {
    const t = e.target.closest && e.target.closest('[data-cmd].is-cmd');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); run(t.dataset.cmd); }
  });

  /* ── intro: type `whoami`, then reveal the rest ───────── */

  upgradeCmdLinks(document);
  paintMirror();

  function startIntro() {
    const root = document.documentElement;
    if (!root.classList.contains('intro')) return done();
    const first = $('.session .block .cmd-text');
    const blocks = [...document.querySelectorAll('.session .block')];
    const text = first.textContent;
    const timers = [];
    let i = 0, finished = false;
    first.textContent = '';

    function finish() {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      first.textContent = text;
      blocks.forEach((b) => { b.style.visibility = ''; });
      form.style.visibility = '';
      root.classList.remove('intro');
      window.removeEventListener('keydown', finish, true);
      window.removeEventListener('pointerdown', finish, true);
      done();
    }
    window.addEventListener('keydown', finish, true);
    window.addEventListener('pointerdown', finish, true);

    function reveal() {
      // swap the CSS-driven hiding for inline hiding, then show blocks one after another
      blocks.forEach((b, n) => { if (n) b.style.visibility = 'hidden'; });
      form.style.visibility = 'hidden';
      root.classList.remove('intro');
      blocks[0].querySelector('.out').classList.add('revealing');
      blocks.forEach((b, n) => {
        if (!n) return;
        timers.push(setTimeout(() => { b.style.visibility = ''; b.classList.add('revealing'); }, 140 * n));
      });
      timers.push(setTimeout(finish, 140 * blocks.length));
    }

    function typeNext() {
      if (i < text.length) { first.textContent += text[i++]; timers.push(setTimeout(typeNext, 75)); return; }
      timers.push(setTimeout(reveal, 260));
    }
    timers.push(setTimeout(typeNext, 350));
  }

  function done() {
    if (!coarse) input.focus({ preventScroll: true });
  }

  startIntro();
})();
