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
  cutaway: { kicker: string; title: string; lead: string; items: Array<{ title: string; body: string; shot: string; alt: string }>; note: string }
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
  mcp: {
    kicker: string
    title: string
    lead: string
    steps: Array<{ k: string; v: string }>
    code: string[]
    tools: string
    cta: string
    ctaHref: string
    note: string
  }
  a11y: { enlarge: string; close: string }
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
    lead: 'The three screens below are captures of Iteration CFD itself. Not illustrations drawn to explain it.',
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
  cutaway: {
    kicker: 'Cut open',
    title: 'The same run,\ncut four ways.',
    lead: 'A 2.1-million-cell cut-cell mesh is a box from the outside. So cut it open: the mesh wrapped on the body, the symmetry plane, the streamlines over it, and the vectors on a cross-section behind the front axle. Four captures, one solved case, nothing done to them that the viewer did not draw.',
    items: [
      {
        title: 'The cut-cell mesh on the body',
        body: 'A 128-cube block with the car carved out of it: 2,095,989 cells, of which 2,731 are cut by the surface and 1,163 sites fall inside the body. The wireframe is the mesh the solver actually integrated, not a rendering of the STL.',
        shot: 'car-mesh.png',
        alt: 'The cut-cell mesh around the car body, drawn as edges',
      },
      {
        title: 'Contour on the symmetry plane',
        body: 'Velocity magnitude on the z-mid plane. The stagnation point on the nose, the acceleration over the airbox, and the low-momentum pocket the rear wing sits in are all one field, read straight off the cells.',
        shot: 'car-contour.png',
        alt: 'Velocity-magnitude contour on the car symmetry plane',
      },
      {
        title: 'Streamlines around the body',
        body: 'Seeded on a grid at the inlet and integrated forward through the cut cells. Where they wrap the wheels and roll up behind the rear tyres is where the drag is.',
        shot: 'car-streamlines.png',
        alt: 'Streamlines wrapping the car body and rolling up behind the wheels',
      },
      {
        title: 'Velocity vectors on a cross-section',
        body: 'Glyphs on a cross-plane behind the front axle, scaled and coloured by the same field. Direction, not just magnitude — the wheel wake turning inboard shows up as vectors before it shows up as a number.',
        shot: 'car-vectors.png',
        alt: 'Velocity vector glyphs on a cross-section behind the front axle',
      },
    ],
    note: 'Cut cells carry the body inside the block, so the viewer skips the sites that are solid and interpolates only from the fluid around them.',
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
    kicker: 'Start here',
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
      { id: 'finale', label: 'Start' },
      { id: 'mesh', label: 'Grid' },
      { id: 'scenes', label: 'In use' },
      { id: 'engine', label: 'Engine' },
      { id: 'proof', label: 'Grounds' },
      { id: 'mcp', label: 'MCP' },
    ],
    language: 'Language',
  },
  mcp: {
    kicker: 'MCP',
    title: 'Or give the solvers\nto your own assistant.',
    lead: 'The Studio is one client. The solvers also speak the Model Context Protocol, so Claude Code, Claude Desktop, or anything else that speaks MCP can mesh a geometry and run a case on your GPU directly — one file, no dependencies, no shell.',
    steps: [
      { k: 'Connect', v: 'One line in Claude Code, or a five-line block in the Claude Desktop config' },
      { k: 'Scope', v: 'Every path is resolved against one workspace directory and refused outside it' },
      { k: 'Surface', v: 'No shell: argv arrays, executables resolved by name, no delete tool at all' },
    ],
    code: [
      '> claude mcp add ofgpu -- node path/to/mcp/server.mjs',
      '',
      '  ofgpu_probe            check the GPU',
      '  ofgpu_list_cases       what is in the workspace',
      '  ofgpu_generate_mesh    cut a geometry into a block',
      '  ofgpu_solve            run one of nine drivers',
      '  ofgpu_validate         the MMS and benchmark suite',
      '  ofgpu_read_case_file   read a dictionary or a field',
    ],
    tools: 'Six tools, four of them read-only.',
    cta: 'Read the MCP guide',
    ctaHref: `${REPO_URL}/tree/main/mcp`,
    note: 'Needs Node 18 and the solver binaries — from a cargo build or from the installer.',
  },
  a11y: { enlarge: 'Enlarge', close: 'Close' },
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
    lead: '격자 위에서 계산한 해입니다. 지금 이 화면에서도 브라우저의 GPU가 파동을 적분하고 있습니다.\n설치 파일 안에서는 같은 방식의 계산이 여러분의 케이스를 풉니다.',
    legend: [
      { k: '해상도', v: '1024 · 144 · 24 m 3중 캐스케이드' },
      { k: '스펙트럼', v: '너울·풍파·잔물결 3개 대역, Gerstner 12성분' },
      { k: '적분', v: '정점마다 Gerstner 합, 심해 분산 관계와 해석적 법선' },
    ],
  },
  scenes: {
    kicker: '사용자 화면',
    title: '기능 설명보다\n실제 화면이 먼저입니다.',
    lead: '아래의 세 화면은 Iteration CFD의 실제 캡처 화면입니다. 설명을 위해 그린 그림이 아닙니다.',
    items: [
      {
        n: '01',
        title: '말로 시킵니다',
        body: '"cases/plume.jsonc를 k-epsilon으로 400회 돌려줘." AI가 케이스 파일을 읽고, 바꿔야 할 부분을 찾아 변경 내역으로 보여준 뒤, 확인을 받고 나서야 저장합니다.',
        shot: 'shell.png',
        alt: 'Iteration CFD 화면 — 파일 탐색기, 편집기, AI 패널',
      },
      {
        n: '02',
        title: '계산되는 과정을 봅니다',
        body: '오픈휠 경주차, 컷셀 210만 개, k-omega 난류 모델. RTX 5070 Ti에서 2,500회 반복에 38.4초, 초당 1억 3,700만 셀-반복입니다. 솔버가 GPU를 잡는 순간부터 잔차 그래프가 실시간으로 그려지고, 해가 발산하면 그 반복에서 멈춘 뒤 원인이 되는 로그 줄을 짚어 줍니다.',
        shot: 'run.png',
        alt: '경주차 케이스 계산 중 — 솔버 로그와 실시간 잔차 그래프, GPU 15.9 GB 중 3.4 GB 사용',
      },
      {
        n: '03',
        title: '결과를 봅니다',
        body: '"3D 뷰어로 보여줘." 절단면, 등가면, 유선, 벡터를 그 자리에서 그립니다. WebGPU로 그리고, 브라우저가 지원하지 않으면 따로 알리지 않고 WebGL2로 내려갑니다.',
        shot: 'viewer.png',
        alt: '3D 뷰어 — 절단면과 유선',
      },
    ],
  },
  cutaway: {
    kicker: '잘라 보기',
    title: '같은 계산 결과를,\n네 가지로 잘랐습니다.',
    lead: '210만 개짜리 컷셀 격자는 바깥에서 보면 상자 하나일 뿐입니다. 그래서 잘랐습니다. 차체를 감싼 격자, 대칭면의 속도 분포, 차체를 지나는 유선, 앞바퀴 뒤 단면의 속도 벡터 — 모두 같은 한 번의 계산에서 나온 화면이고, 뷰어가 그린 그대로입니다.',
    items: [
      {
        title: '차체를 감싼 컷셀 격자',
        body: '한 변 128개짜리 정육면체 격자에서 차체를 파낸 것입니다. 셀 2,095,989개 가운데 2,731개가 차체 표면에 잘렸고, 1,163개 자리는 차체 안쪽이라 셀이 없습니다. 화면의 격자선은 솔버가 실제로 계산한 격자이며, STL 형상을 그린 것이 아닙니다.',
        shot: 'car-mesh.png',
        alt: '차체 둘레의 컷셀 격자를 선으로 그린 화면',
      },
      {
        title: '대칭면 속도 분포',
        body: '차체 한가운데를 세로로 자른 면의 속도 크기입니다. 노즈 앞의 정체 영역, 차체 위를 지나며 빨라지는 흐름, 뒤쪽에 남는 느린 영역이 한 장에 함께 보입니다. 셀 값을 그대로 색으로 옮긴 것입니다.',
        shot: 'car-contour.png',
        alt: '경주차 대칭면의 속도 분포',
      },
      {
        title: '차체를 지나는 유선',
        body: '입구 면에 시작점을 격자로 배치하고 흐름을 따라 적분한 선입니다. 선이 바퀴를 감고 뒤쪽에서 말려 올라가는 자리가 곧 항력이 생기는 자리입니다.',
        shot: 'car-streamlines.png',
        alt: '차체를 감고 바퀴 뒤에서 말려 올라가는 유선',
      },
      {
        title: '단면 속도 벡터',
        body: '앞바퀴 뒤를 가로로 자른 면에 속도 벡터를 세우고 같은 값으로 색을 입혔습니다. 크기뿐 아니라 방향이 보입니다. 바퀴 뒤 흐름이 안쪽으로 꺾이는 것은 숫자보다 화살표에서 먼저 드러납니다.',
        shot: 'car-vectors.png',
        alt: '앞바퀴 뒤 단면의 속도 벡터',
      },
    ],
    note: '컷셀 격자는 차체를 상자 안에 품고 있습니다. 그래서 뷰어는 차체 내부에 해당하는 격자점을 건너뛰고, 그 둘레의 유체 셀에서만 값을 보간합니다.',
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
        body: '고체와 유체를 함께 푸는 복합 열전달(CHT)입니다. 반도체 다이 스택의 정션 온도부터 데이터센터 콜드아일의 공기 재순환까지, 경계면에서 끊기지 않고 이어집니다.',
        bins: ['ofgpu-cht', 'ofgpu-datacentre'],
      },
      {
        title: '유체',
        body: 'k-ε, k-ω SST(γ 전이 모델 포함), Spalart–Allmaras를 지원합니다. 벽 함수와 저레이놀즈 처리, 컷셀과 주기 경계까지 케이스 파일 한 장으로 지정합니다.',
        bins: ['ofgpu-k-epsilon', 'ofgpu-k-omega', 'ofgpu-sa'],
      },
      {
        title: '에너지',
        body: '저마하 압축성 계산, 부력으로 움직이는 유동, VOF 자유표면을 다룹니다. 화재 연기가 천장에 닿는 시각과 댐이 무너지는 파면을 같은 코드로 계산합니다.',
        bins: ['ofgpu-lowmach', 'ofgpu-buoyant', 'ofgpu-plume', 'ofgpu-vof'],
      },
    ],
  },
  proof: {
    kicker: '근거',
    title: '믿어야 할 이유는\n문헌에 있습니다.',
    lead: '수치 코어는 전부 공개된 문헌을 보고 직접 구현했습니다. 모든 이산화 식을 원논문 인용과 함께\nSPEC-LIT에 적어 두었고, 파일별 출처는 PROVENANCE에 있습니다.',
    items: [
      { v: '314', k: '검증 체크', d: 'ofgpu-validate — 279개 실시간 계산, 35개 기록값 재생' },
      { v: '905', k: '단위 시험', d: '전체 대상 합계, 실패 0건' },
      { v: '0', k: 'GPL 참조', d: '파일마다 헤더로 선언하고, 문장이 아니라 시험으로 강제합니다' },
    ],
    note: '검증에는 인위해법(MMS), 해석해, 공개 벤치마크만 씁니다. 다른 CFD 코드와 결과를 맞춰 보지 않습니다 — SPEC-LIT §10, §22.',
  },
  finale: {
    kicker: '먼저,',
    title: '무엇을 해석하고\n싶으신가요?',
    lead: '무엇이든 적어 보세요. 설치된 Iterations 안에서는 이 창이 실제로 케이스를 고치고 솔버를 실행합니다.',
    placeholder: '예: 서버랙 사이 공기 흐름과 온도를 보고 싶어요',
    suggestions: ['데이터센터 콜드아일 온도 분포', '채널 유동 k-omega SST로 4000회', '댐 붕괴 자유표면', '칩 다이 스택 정션 온도'],
    reply: (q: string) => [`"${q}"`, '해당하는 케이스를 찾았습니다. 격자를 만들고, 난류 모델을 고르고, GPU에 올리면 됩니다.', '여기서부터는 이 페이지가 할 수 없는 일입니다. 여러분의 GPU가 필요합니다.'],
    ctaTitle: '준비되었습니다',
    ctaBody: `Iterations ${VERSION} · Windows x64 · ${INSTALLER_SIZE}`,
    cta: '설치 파일 받기',
    requirements: ['Windows 10/11 x64', 'CUDA 13 지원 NVIDIA GPU', 'Visual C++ 2015–2022 재배포 패키지'],
    a11y: { input: 'AI에게 보낼 메시지', send: '보내기', you: '나', assistant: 'AI' },
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
      { id: 'finale', label: '시작' },
      { id: 'mesh', label: '격자' },
      { id: 'scenes', label: '사용자 화면' },
      { id: 'engine', label: '엔진' },
      { id: 'proof', label: '근거' },
      { id: 'mcp', label: 'MCP' },
    ],
    language: '언어',
  },
  mcp: {
    kicker: 'MCP',
    title: '아니면 솔버를\n쓰던 AI에게 맡기십시오.',
    lead: 'Studio는 클라이언트 하나일 뿐입니다. 솔버는 Model Context Protocol도 말하므로, Claude Code든 Claude Desktop이든 MCP를 말하는 도구라면 무엇이든 여러분의 GPU에서 직접 격자를 만들고 케이스를 풀 수 있습니다. 파일 하나, 의존성 없음, 셸 없음.',
    steps: [
      { k: '연결', v: 'Claude Code는 한 줄, Claude Desktop은 설정 파일에 다섯 줄' },
      { k: '범위', v: '모든 경로를 작업 폴더 기준으로 해석하고, 그 밖이면 거절합니다' },
      { k: '표면', v: '셸이 없습니다. 인자 배열로만 실행하고, 지우는 도구는 아예 없습니다' },
    ],
    code: [
      '> claude mcp add ofgpu -- node path/to/mcp/server.mjs',
      '',
      '  ofgpu_probe            GPU 확인',
      '  ofgpu_list_cases       작업 폴더의 케이스 목록',
      '  ofgpu_generate_mesh    형상을 블록에 컷셀로 새기기',
      '  ofgpu_solve            솔버 9종 중 하나 실행',
      '  ofgpu_validate         인위해법·벤치마크 검증 스위트',
      '  ofgpu_read_case_file   딕셔너리나 필드 읽기',
    ],
    tools: '도구 6개, 그중 4개는 읽기 전용입니다.',
    cta: 'MCP 사용법 보기',
    ctaHref: `${REPO_URL}/tree/main/mcp`,
    note: 'Node 18과 솔버 바이너리가 필요합니다 — cargo 빌드든 설치 프로그램이든 상관없습니다.',
  },
  a11y: { enlarge: '크게 보기', close: '닫기' },
}

export const COPY: Record<Locale, Copy> = { en, ko }

export const LOCALE_LABEL: Record<Locale, string> = { en: 'EN', ko: '한국어' }
