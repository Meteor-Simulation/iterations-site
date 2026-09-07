/**
 * Every word on the page, in one file, in both languages.
 *
 * The voice: short declaratives, no adjectives doing work a number could do,
 * no exclamation marks. The page is a descent — it opens at the surface with
 * one sentence, and each section says something the one before it earned. The
 * Korean is not a translation of the English or the other way round; each is
 * written to land in its own language, and they say the same things.
 */

export type Locale = 'en' | 'ko'
export const LOCALES: readonly Locale[] = ['en', 'ko']
/** English by default; the toggle in the nav remembers a choice. */
export const DEFAULT_LOCALE: Locale = 'en'

export const DOWNLOAD_URL = 'https://github.com/using76/Iteration-CFD/releases/latest/download/iterations-0.1.0-win64-setup.exe'
export const RELEASE_URL = 'https://github.com/using76/Iteration-CFD/releases/tag/v0.1.0'
export const REPO_URL = 'https://github.com/using76/Iteration-CFD'
export const CONTACT_EMAIL = 'simul@msimul.com'
export const INSTALLER_SIZE = '10.3 MB'
export const VERSION = '0.1.0'

export interface Copy {
  hero: { eyebrow: string; title: string[]; lead: string; cta: string; ctaSub: string; scroll: string }
  mesh: { kicker: string; title: string; lead: string; legend: Array<{ k: string; v: string }> }
  scenes: { kicker: string; title: string; lead: string; items: Array<{ n: string; title: string; body: string; shot: string; alt: string }> }
  engine: { kicker: string; title: string; lead: string; code: string[] }
  physical: { kicker: string; title: string; lead: string; cards: Array<{ title: string; body: string; bins: string[] }> }
  proof: { kicker: string; title: string; lead: string; items: Array<{ v: string; k: string; d: string }>; note: string }
  finale: {
    kicker: string
    title: string
    lead: string
    placeholder: string
    suggestions: string[]
    reply: (q: string) => string[]
    ctaTitle: string
    ctaBody: string
    cta: string
    requirements: string[]
    a11y: { input: string; send: string; you: string; assistant: string }
  }
  gate: {
    title: string
    body: string
    emailLabel: string
    emailPlaceholder: string
    emailInvalid: string
    consentMarketing: string
    consentLicence: string
    consentRequired: string
    submit: string
    submitting: string
    privacy: string
    changeEmail: string
    signedInAs: string
    offlineNote: string
  }
  footer: { owner: string; collaborator: string; collaboratorLabel: string; license: string; licenseNote: string; licenseResearch: string; licenseTitle: string; links: Array<{ label: string; href: string }>; contact: string }
  nav: { items: Array<{ id: string; label: string }>; language: string }
}

const en: Copy = {
  hero: {
    eyebrow: 'Iterations',
    /** Two lines. The first is the promise, the second is what it costs you. */
    title: ['Heat and flow,', 'in one click.'],
    lead: 'From the mesh to convergence, the loop never leaves the GPU.\nAnd an assistant that drives it for you.',
    cta: 'Download',
    ctaSub: `Windows x64 · ${INSTALLER_SIZE}`,
    scroll: 'Scroll',
  },
  mesh: {
    kicker: 'This wave is',
    title: 'not a video.',
    lead: 'It is a solution on a grid. Your GPU is integrating wavenumbers right now,\nand the same kind of arithmetic, inside the installer, solves your case.',
    legend: [
      { k: 'Resolution', v: '1024 · 144 · 24 m, three cascades' },
      { k: 'Spectrum', v: 'swell, wind sea and chop — 12 Gerstner components' },
      { k: 'Integration', v: 'vertex-stage Gerstner sum, deep-water dispersion, analytic normals' },
    ],
  },
  scenes: {
    kicker: 'In use',
    title: 'Before the feature list,\nwatch someone use it.',
    lead: 'The three screens below are not illustrations. They are captured automatically from a demo-mode run.',
    items: [
      {
        n: '01',
        title: 'You ask for it',
        body: '"Run cases/plume.jsonc with k-epsilon for 400 iterations." The assistant reads the case, finds what has to change, shows you the diff, and writes only after you approve.',
        shot: 'shell.png',
        alt: 'The Iterations Studio shell — explorer, editor and assistant panel',
      },
      {
        n: '02',
        title: 'You watch it run',
        body: 'An open-wheel car, 2.1 million cut cells, k-omega on an RTX 5070 Ti: 2,500 iterations in 40.7 seconds — 129 million cell-iterations a second. Residuals are drawn from the moment the solver takes the GPU, and if it diverges it stops at the iteration where it diverged and points at the line in the log that says why.',
        shot: 'run.png',
        alt: 'The race-car case running — streaming solver log and live residual chart, GPU at 3.4 of 15.9 GB',
      },
      {
        n: '03',
        title: 'You look at the result',
        body: '"Show me the 3D view." Slices, isosurfaces, streamlines, glyphs. Drawn with WebGPU, and quietly with WebGL2 when the browser cannot keep up.',
        shot: 'viewer.png',
        alt: 'The 3D viewer — a slice and streamlines',
      },
    ],
  },
  engine: {
    kicker: 'Engine',
    title: 'There is one reason\nit is fast.',
    lead: 'The loop never leaves the GPU. Instead of coming down to the host to synchronise every iteration,\nthe whole time integration is resident on the device. The host is Rust, the kernels are CUDA C++.\nSixteen drivers share that one core, and CUDA 13 is linked statically, so there is no toolkit to install.',
    code: ['> ofgpu-probe', 'device : NVIDIA GeForce RTX 5070 Ti', 'scalar : f64', '', 'max |gpu - cpu| = 0.000e0', 'PASS - bitwise identical'],
  },
  physical: {
    kicker: 'Physical AI',
    title: 'Heat, flow, energy.\nIn one solver.',
    lead: 'The physics was never separate. Only the tools were. These are solved on one grid, in one time loop.',
    cards: [
      {
        title: 'Heat',
        body: 'Conjugate heat transfer. From the junction temperature of a die stack to recirculation in a data-centre cold aisle, continuous across the interface rather than stopping at it.',
        bins: ['ofgpu-cht', 'ofgpu-datacentre'],
      },
      {
        title: 'Flow',
        body: 'k-ε, k-ω SST with the γ transition model, Spalart–Allmaras. Wall functions and low-Reynolds treatment, cut cells and cyclic boundaries — from one case file.',
        bins: ['ofgpu-k-epsilon', 'ofgpu-k-omega', 'ofgpu-sa'],
      },
      {
        title: 'Energy',
        body: 'The low-Mach compressible loop, buoyancy-driven flow, VOF free surfaces. When a plume reaches the ceiling and where a collapsing column breaks — from the same code.',
        bins: ['ofgpu-lowmach', 'ofgpu-buoyant', 'ofgpu-plume', 'ofgpu-vof'],
      },
    ],
  },
  proof: {
    kicker: 'Grounds',
    title: 'The reason to believe it\nis in the literature.',
    lead: 'The numerical core is implemented from published papers. Every discretisation is specified in\nSPEC-LIT with its citation, and every file is classified in PROVENANCE.',
    items: [
      { v: '314', k: 'validation checks', d: 'ofgpu-validate — 279 computed live, 35 replayed from recorded measurements' },
      { v: '905', k: 'unit tests', d: 'across all targets, zero failures' },
      { v: '0', k: 'GPL sources consulted', d: 'declared in every file header, and enforced by a test rather than by prose' },
    ],
    note: 'Validation uses manufactured solutions, analytic solutions and published benchmarks only. It is never compared against another CFD code — SPEC-LIT §10/§22.',
  },
  finale: {
    kicker: 'Last of all',
    title: 'What would you like\nto solve?',
    lead: 'Type anything. Inside an installed copy of Iterations, this box edits the case and runs the solver for real.',
    placeholder: 'e.g. I want to see the air flow and temperature between server racks',
    suggestions: ['Temperature across a data-centre cold aisle', 'Channel flow, k-omega SST, 4000 iterations', 'A dam break free surface', 'Junction temperature in a chip die stack'],
    reply: (q: string) => [`"${q}"`, 'Found the case. Build the mesh, choose the model, put it on the GPU.', 'The next part cannot happen here — it needs your GPU.'],
    ctaTitle: 'Ready',
    ctaBody: `Iterations ${VERSION} · Windows x64 · ${INSTALLER_SIZE}`,
    cta: 'Get the installer',
    requirements: ['Windows 10/11 x64', 'NVIDIA GPU with CUDA 13 support', 'Visual C++ 2015–2022 redistributable'],
    a11y: { input: 'Message to the assistant', send: 'Send', you: 'You', assistant: 'Assistant' },
  },
  gate: {
    title: 'One thing first',
    body: `Iterations ${VERSION} is an open beta — anyone may use it. Leave an email address and the download unlocks.`,
    emailLabel: 'Email address',
    emailPlaceholder: 'you@company.com',
    emailInvalid: 'That does not look like an email address.',
    consentMarketing: 'I agree that Iterations may use this address to send product news and updates. This is the only reason it is collected, and you can withdraw at any time by writing to the address below.',
    consentLicence: 'I understand the licence: free for personal, educational, government and charitable use, and for research whose purpose is public — but development aimed at a product or at technology transferred to industry, wherever it is done, gets a thirty-day trial and then needs a licence.',
    consentRequired: 'Both boxes have to be ticked to continue.',
    submit: 'Unlock the download',
    submitting: 'One moment…',
    privacy: 'Nothing but the address and the two answers above is collected. No tracking, no third parties.',
    changeEmail: 'Use a different address',
    signedInAs: 'Signed in as',
    offlineNote: 'Recorded on this device. It will be sent when the collection endpoint is configured.',
  },
  footer: {
    owner: 'Iterations Co., Ltd.',
    collaboratorLabel: 'In collaboration with',
    collaborator: 'Meteo Simulation Co., Ltd.',
    licenseTitle: 'Licence',
    license: 'Prosperity Public License 3.0.0, with the licensor reading appended',
    licenseNote: 'Free for personal study and hobby work, educational institutions, universities and their institutes, government institutions, public safety, health and environmental bodies, and charities. Any other commercial use gets a thirty-day trial — one per company, not per person — and then needs a licence.',
    licenseResearch: 'Research is judged by its purpose, not by who owns the institute. Fire and rescue, medicine, public health, safety, disaster response and environmental work is free wherever it is done, a government-funded institute included. Development aimed at a particular product or at technology transferred to industry — electric vehicles, rail and propulsion, aircraft engines, anything carrying a technology fee — is commercial use whoever performs it.',
    links: [
      { label: 'Repository', href: REPO_URL },
      { label: 'Release', href: RELEASE_URL },
      { label: 'Licence', href: `${REPO_URL}/blob/main/LICENSING.md` },
      { label: 'SPEC-LIT', href: `${REPO_URL}/blob/main/rust/SPEC-LIT.md` },
    ],
    contact: CONTACT_EMAIL,
  },
  nav: {
    items: [
      { id: 'mesh', label: 'Grid' },
      { id: 'scenes', label: 'In use' },
      { id: 'engine', label: 'Engine' },
      { id: 'physical', label: 'Physical AI' },
      { id: 'proof', label: 'Grounds' },
      { id: 'finale', label: 'Start' },
    ],
    language: 'Language',
  },
}

const ko: Copy = {
  hero: {
    eyebrow: 'Iterations',
    title: ['열과 유체를,', '딸깍.'],
    lead: '메쉬 생성부터 수렴까지, 시간 적분 루프 전체가 GPU에 상주합니다.\n그리고 그것을 대신 돌려주는 AI가 붙어 있습니다.',
    cta: '다운로드',
    ctaSub: `Windows x64 · ${INSTALLER_SIZE}`,
    scroll: '스크롤',
  },
  mesh: {
    kicker: '이 파도는',
    title: '영상이 아닙니다.',
    lead: '격자 위에서 풀린 해입니다. 지금 이 순간에도 브라우저의 GPU가 파수를 적분하고 있고,\n같은 종류의 계산이 설치 파일 안에서는 여러분의 케이스를 풉니다.',
    legend: [
      { k: '해상도', v: '1024 · 144 · 24 m 3중 캐스케이드' },
      { k: '스펙트럼', v: '스웰·풍파·잔파 3밴드, Gerstner 12성분' },
      { k: '적분', v: '정점 단계 Gerstner 합, 심해 분산과 해석적 법선' },
    ],
  },
  scenes: {
    kicker: '쓰는 장면',
    title: '기능을 읽기 전에,\n쓰는 모습을 먼저 보십시오.',
    lead: '아래 세 화면은 설명을 위해 그린 그림이 아니라, 데모 모드 자동 캡처입니다.',
    items: [
      {
        n: '01',
        title: '말로 시킵니다',
        body: '"cases/plume.jsonc를 k-epsilon으로 400회 돌려줘." 어시스턴트가 케이스를 읽고, 고쳐야 할 곳을 찾아 diff로 보여주고, 승인을 받은 뒤에만 씁니다.',
        shot: 'shell.png',
        alt: 'Iterations Studio 셸 — 탐색기, 에디터, 어시스턴트 패널',
      },
      {
        n: '02',
        title: '돌아가는 걸 지켜봅니다',
        body: '오픈휠 차량, 컷셀 210만 개, k-omega, RTX 5070 Ti에서 2,500회 반복 40.7초 — 초당 1억 2,900만 셀-반복. 솔버가 GPU를 잡는 순간부터 잔차가 실시간으로 그려지고, 발산하면 발산한 반복에서 멈추고 왜 멈췄는지 로그의 그 줄을 가리킵니다.',
        shot: 'run.png',
        alt: '레이스카 케이스 실행 중 — 솔버 로그 스트림과 실시간 잔차 차트, GPU 15.9 GB 중 3.4 GB 사용',
      },
      {
        n: '03',
        title: '결과를 봅니다',
        body: '"3D 뷰어로 보여줘." 절단면, 등가면, 유선, 글리프. WebGPU로 그리고, 브라우저가 못 따라오면 조용히 WebGL2로 내려갑니다.',
        shot: 'viewer.png',
        alt: '3D 뷰어 — 절단면과 유선',
      },
    ],
  },
  engine: {
    kicker: '엔진',
    title: '빠른 이유는\n하나입니다.',
    lead: '루프가 GPU를 떠나지 않습니다. 반복마다 호스트로 내려와 동기화하는 대신,\n시간 적분 전체가 디바이스에 상주합니다. 호스트는 Rust, 커널은 CUDA C++입니다.\n드라이버 16종이 그 하나의 코어를 공유하고, CUDA 13은 정적으로 링크되어 툴킷 설치가 필요 없습니다.',
    code: ['> ofgpu-probe', 'device : NVIDIA GeForce RTX 5070 Ti', 'scalar : f64', '', 'max |gpu - cpu| = 0.000e0', 'PASS - bitwise identical'],
  },
  physical: {
    kicker: '피지컬 AI',
    title: '열, 유체, 에너지.\n하나의 해석기 안에서.',
    lead: '물리는 나뉘어 있지 않은데 도구만 나뉘어 있었습니다. 같은 격자, 같은 시간 루프 위에서 풉니다.',
    cards: [
      {
        title: '열',
        body: '고체–유체 복합 열전달(CHT). 다이 스택의 정션 온도부터 데이터센터 콜드아일의 재순환까지, 경계에서 끊기지 않고 이어집니다.',
        bins: ['ofgpu-cht', 'ofgpu-datacentre'],
      },
      {
        title: '유체',
        body: 'k-ε, k-ω SST(γ 전이 포함), Spalart–Allmaras. 벽 함수와 저레이놀즈 처리, 컷셀과 cyclic 경계까지 케이스 파일 한 장에서.',
        bins: ['ofgpu-k-epsilon', 'ofgpu-k-omega', 'ofgpu-sa'],
      },
      {
        title: '에너지',
        body: '저마하 압축성 루프, 부력 구동 유동, VOF 자유표면. 플룸이 천장을 때리는 시각과 댐이 무너지는 파면을 같은 코드로.',
        bins: ['ofgpu-lowmach', 'ofgpu-buoyant', 'ofgpu-plume', 'ofgpu-vof'],
      },
    ],
  },
  proof: {
    kicker: '근거',
    title: '믿어야 할 이유는\n문헌에 있습니다.',
    lead: '수치 코어 전체가 공개 문헌으로부터 직접 구현되었습니다. 모든 이산화가 원논문 인용과 함께\nSPEC-LIT에 명세되어 있고, 파일별 출처는 PROVENANCE에 있습니다.',
    items: [
      { v: '314', k: '검증 체크', d: 'ofgpu-validate — 279개 실시간 계산, 35개 기록값 재생' },
      { v: '905', k: '단위 시험', d: '전 타깃 합계, 0 실패' },
      { v: '0', k: 'GPL 참조', d: '소스마다 헤더로 선언하고, 산문이 아니라 시험으로 강제합니다' },
    ],
    note: '검증은 인위해법(MMS), 해석해, 공개 벤치마크만 사용하며 다른 CFD 코드와 비교하지 않습니다 — SPEC-LIT §10/§22.',
  },
  finale: {
    kicker: '마지막으로',
    title: '무엇을 해석하고\n싶으신가요?',
    lead: '아무거나 적어보세요. 이 창은 설치된 Iterations 안에서 실제로 케이스를 고치고 솔버를 돌립니다.',
    placeholder: '예: 서버랙 사이 공기 흐름과 온도를 보고 싶어요',
    suggestions: ['데이터센터 콜드아일 온도 분포', '채널 유동 k-omega SST로 4000회', '댐 붕괴 자유표면', '칩 다이 스택 정션 온도'],
    reply: (q: string) => [`"${q}"`, '케이스를 찾았습니다. 격자를 만들고, 모델을 고르고, GPU에 올리면 됩니다.', '그 다음은 여기서 할 수 없는 일입니다 — 여러분의 GPU가 필요합니다.'],
    ctaTitle: '준비되었습니다',
    ctaBody: `Iterations ${VERSION} · Windows x64 · ${INSTALLER_SIZE}`,
    cta: '설치 파일 받기',
    requirements: ['Windows 10/11 x64', 'CUDA 13 지원 NVIDIA GPU', 'Visual C++ 2015–2022 재배포 패키지'],
    a11y: { input: '어시스턴트에게 보낼 메시지', send: '보내기', you: '나', assistant: '어시스턴트' },
  },
  gate: {
    title: '하나만 먼저',
    body: `Iterations ${VERSION}은 공개 베타입니다 — 누구나 쓸 수 있습니다. 이메일 주소를 남기시면 다운로드가 열립니다.`,
    emailLabel: '이메일 주소',
    emailPlaceholder: 'you@company.com',
    emailInvalid: '이메일 주소 형식이 아닙니다.',
    consentMarketing: '이 주소로 Iterations의 제품 소식과 홍보 메일을 받는 데 동의합니다. 수집 목적은 이것 하나이며, 아래 주소로 연락하시면 언제든 철회하실 수 있습니다.',
    consentLicence: '라이선스를 이해했습니다 — 개인·교육·정부·자선 목적과 공공 목적 연구는 무료이지만, 특정 제품이나 산업 이전을 목적으로 하는 기술개발은 어디에서 수행하든 30일 시험 후 라이선스가 필요합니다.',
    consentRequired: '두 항목 모두 동의하셔야 진행됩니다.',
    submit: '다운로드 열기',
    submitting: '잠시만요…',
    privacy: '위의 주소와 두 가지 답변 외에는 아무것도 수집하지 않습니다. 추적도, 제3자 제공도 없습니다.',
    changeEmail: '다른 주소 쓰기',
    signedInAs: '로그인:',
    offlineNote: '이 기기에 기록했습니다. 수집 엔드포인트가 설정되면 전송됩니다.',
  },
  footer: {
    owner: '주식회사 이터레이션즈',
    collaboratorLabel: '협력 및 기여',
    collaborator: '주식회사 메테오시뮬레이션',
    licenseTitle: '라이선스',
    license: 'Prosperity Public License 3.0.0 + 라이선서 해석 조항',
    licenseNote: '개인 학습·취미, 교육기관, 대학과 그 소속 연구소, 정부기관, 공공 안전·보건·환경 단체, 자선단체는 무료입니다. 그 밖의 상업적 이용은 30일 시험 — 사람이 아니라 회사 단위 — 후 라이선스가 필요합니다.',
    licenseResearch: '연구는 기관의 소유 주체가 아니라 목적으로 판단합니다. 소방·의료·보건·안전·재난·환경 보호를 목적으로 하는 연구는 정부출연연구기관에서 수행하더라도 무료입니다. 특정 제품이나 산업 이전을 목적으로 하는 기술개발 — 전기차, 철도·추진, 항공기 엔진 등 기술료 징수 대상 — 은 정출연이라도 상업적 이용입니다.',
    links: [
      { label: '저장소', href: REPO_URL },
      { label: '릴리스', href: RELEASE_URL },
      { label: '라이선스', href: `${REPO_URL}/blob/main/LICENSING.md` },
      { label: 'SPEC-LIT', href: `${REPO_URL}/blob/main/rust/SPEC-LIT.md` },
    ],
    contact: CONTACT_EMAIL,
  },
  nav: {
    items: [
      { id: 'mesh', label: '격자' },
      { id: 'scenes', label: '쓰는 장면' },
      { id: 'engine', label: '엔진' },
      { id: 'physical', label: '피지컬 AI' },
      { id: 'proof', label: '근거' },
      { id: 'finale', label: '시작' },
    ],
    language: '언어',
  },
}

export const COPY: Record<Locale, Copy> = { en, ko }

export const LOCALE_LABEL: Record<Locale, string> = { en: 'EN', ko: '한국어' }
