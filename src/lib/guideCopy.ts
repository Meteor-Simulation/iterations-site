/**
 * The guide page's text, in both languages.
 *
 * Not a copy of the repository's GUIDEBOOK.md — that document is 14 sections
 * long and belongs where the code is. This is the part a reader needs before
 * they have installed anything: what the thing is, the shape of a run, the one
 * table that stops people photographing an unsolved field, and the errors they
 * will actually hit. Everything deeper links out to the file itself.
 */
import type { Locale } from './copy'

export const GUIDEBOOK_URL = 'https://github.com/using76/Iteration-CFD/blob/main/docs/GUIDEBOOK.md'
export const GUIDEBOOK_EN_URL = 'https://github.com/using76/Iteration-CFD/blob/main/docs/GUIDEBOOK.en.md'
export const REPO = 'https://github.com/using76/Iteration-CFD'

export interface GuideCopy {
  /** Browser tab and the crumb back to the front page. */
  meta: { title: string; back: string }
  hero: { eyebrow: string; title: string; lead: string; cta: string; ctaSub: string }
  /** Left rail. Ids must match the section ids rendered on the page. */
  toc: { label: string; items: Array<{ id: string; label: string }> }
  start: {
    kicker: string
    title: string
    lead: string
    steps: Array<{ n: string; title: string; body: string; code: string; time: string }>
    note: string
  }
  solvers: {
    kicker: string
    title: string
    lead: string
    warning: { title: string; body: string; bullets: string[] }
    tableHead: [string, string, string]
    rows: Array<{ bin: string; solves: string; momentum: boolean; format: string }>
    legend: string
  }
  reading: {
    kicker: string
    title: string
    lead: string
    sample: string[]
    rows: Array<{ k: string; v: string }>
    diverge: { title: string; body: string }
  }
  trouble: {
    kicker: string
    title: string
    lead: string
    items: Array<{ q: string; a: string }>
  }
  more: {
    kicker: string
    title: string
    lead: string
    links: Array<{ label: string; href: string; body: string }>
  }
}

const en: GuideCopy = {
  meta: { title: 'Iterations — Technical Guidebook', back: 'Back to the front page' },
  hero: {
    eyebrow: 'Technical guidebook',
    title: 'How to actually run it.',
    lead: 'Installation, a first case, meshing, choosing a solver, reading convergence, and the causes of the errors you will meet. The derivations live in SPEC-LIT; this is about use.',
    cta: 'Read the full guidebook',
    ctaSub: 'on GitHub · 14 sections',
  },
  toc: {
    label: 'On this page',
    items: [
      { id: 'start', label: 'Five minutes' },
      { id: 'solvers', label: 'Choosing a solver' },
      { id: 'reading', label: 'Reading convergence' },
      { id: 'trouble', label: 'Troubleshooting' },
      { id: 'more', label: 'Further reading' },
    ],
  },
  start: {
    kicker: 'Five minutes',
    title: 'A first solve,\nin three commands.',
    lead: 'The race-car sample ships with the installer: one geometry and three commands. What comes out is a 2.1-million-cell cut-cell mesh and a converged velocity field, built on your own GPU.',
    steps: [
      {
        n: '01',
        title: 'Carve the body out of the tunnel',
        body: 'A 128-cube block with the car cut out of it. This step is CPU-bound: two million cells each tested inside-or-outside against the STL, and the ones the surface crosses cut open.',
        code: 'ofgpu-generate-mesh big racecar_case 128 -stl car=racecar.stl -cutcell',
        time: '20-60 min · CPU',
      },
      {
        n: '02',
        title: 'Add the pressure and temperature',
        body: 'The mesh generator writes the fields the turbulence-only drivers read. A momentum solve needs a pressure to solve for and, in the low-Mach loop, a temperature. Both are uniform; their boundary conditions are the whole content.',
        code: 'copy racecar.fields\\p racecar_case\\0\\p\ncopy racecar.fields\\T racecar_case\\0\\T',
        time: 'instant',
      },
      {
        n: '03',
        title: 'Solve the momentum',
        body: 'The GPU-resident loop. Residuals print every 250 iterations and the result lands as OpenFOAM ASCII, which ParaView and the Studio viewer both read.',
        code: 'ofgpu-lowmach racecar_case -iters 3000 -check 250 -output foam',
        time: '1-2 min · GPU',
      },
    ],
    note: 'Or run cases\\racecar.cmd, which does all three in order.',
  },
  solvers: {
    kicker: 'Choosing a solver',
    title: 'A driver named after\na turbulence model may\nnot solve the flow.',
    lead: 'This is the single most important thing on this page, and the mistake is easy to make because nothing looks wrong until you draw a streamline.',
    warning: {
      title: 'ofgpu-k-epsilon, ofgpu-k-omega and ofgpu-sa leave the velocity field frozen.',
      body: 'They solve the turbulence equations only, on a velocity field they never touch. Run an external-aerodynamics case with one of them and:',
      bullets: [
        'the streamlines come out straight',
        'the contour comes out one flat colour',
        'no U and no p are written',
      ],
    },
    tableHead: ['Driver', 'Solves', 'Case format'],
    rows: [
      { bin: 'ofgpu-k-epsilon', solves: 'k, ε — U frozen', momentum: false, format: 'directory / JSONC' },
      { bin: 'ofgpu-k-omega', solves: 'k, ω — U frozen', momentum: false, format: 'directory' },
      { bin: 'ofgpu-sa', solves: 'ν̃ — U frozen', momentum: false, format: 'directory' },
      { bin: 'ofgpu-lowmach', solves: 'U, p, T, turbulence', momentum: true, format: 'directory / JSONC' },
      { bin: 'ofgpu-buoyant', solves: 'U, p, T, buoyancy', momentum: true, format: 'directory' },
      { bin: 'ofgpu-plume', solves: 'U, p, T, buoyant plume', momentum: true, format: 'directory' },
      { bin: 'ofgpu-vof', solves: 'U, p, α — two-phase free surface', momentum: true, format: 'directory' },
      { bin: 'ofgpu-cht', solves: 'multi-region conduction + conjugate convection', momentum: true, format: 'JSONC' },
      { bin: 'ofgpu-datacentre', solves: 'data-centre room, fans, tiles, metrics', momentum: true, format: 'JSONC' },
    ],
    legend: 'Highlighted rows solve for a velocity field. If that is what you want to look at, pick one of those.',
  },
  reading: {
    kicker: 'Reading convergence',
    title: 'What the residual line\nis telling you.',
    lead: 'Every solver prints one line per check interval. Three numbers in it decide whether the run is worth keeping.',
    sample: [
      'iter    500  |U| res 0.0928755  |p| res 1.351e-01  contErr 3.39691e-05',
      '             T [293.15, 293.15] K  rho [1.2041, 1.2041] kg/m3  p0 101325 Pa',
    ],
    rows: [
      { k: '|U| res, |p| res', v: 'Normalised residuals. In a steady run, falling is converging.' },
      { k: 'contErr', v: 'The continuity error. If this does not fall, the pressure solve has failed and the result cannot be trusted however pretty the residuals look.' },
      { k: 'T, rho ranges', v: 'There so that a physically impossible field is visible at a glance. T [inf, -inf] means the field is empty or broken.' },
    ],
    diverge: {
      title: 'When it diverges, it stops.',
      body: 'It does not quietly keep going. It names the iteration, says which field went non-finite, and exits with an error — so a diverged run cannot be mistaken for a converged one.',
    },
  },
  trouble: {
    kicker: 'Troubleshooting',
    title: 'The errors you\nwill actually meet.',
    lead: 'In roughly the order they turn up.',
    items: [
      {
        q: 'non-manifold edge(s) — cut-cell rejects the STL',
        a: 'Two parts are sharing a face, and the classification cannot tell inside from outside across one. Make them overlap: a part that bites slightly into its neighbour is always safer than one that meets it exactly.',
      },
      {
        q: 'has no p field — the momentum driver refuses',
        a: 'The mesh generator writes only what the turbulence-only drivers read. Add 0/p, and 0/T for the low-Mach loop. cases/racecar.fields/ in the sample is the worked example.',
      },
      {
        q: 'Straight streamlines and a one-colour contour',
        a: 'You ran a turbulence-only driver. The velocity field is frozen, so you are looking at the initial field, not at flow. Re-run with a momentum driver.',
      },
      {
        q: 'NO_STRUCTURED_GRID — the viewer refuses to slice',
        a: 'The block behind the cut-cell mesh was not recovered. Current versions recover it from a histogram of the cell centres; meeting this now means the mesh is not block-based, or it is holier than the recovery accepts. That second refusal is deliberate — reading a mesh that merely resembles a lattice as one would put cells in the wrong place.',
      },
      {
        q: 'The viewer draws the case on its side',
        a: 'The case has no constant/g and its floor patch is not named bottomWall, floor or ground. Rename the patch. Do not add a gravity vector just to rotate the viewer: gravity enters the equations and changes the solution.',
      },
      {
        q: '-output "U,p" is rejected',
        a: '-output takes formats, not fields. Choose from foam, vtu, nvdb, vdb, usda.',
      },
      {
        q: 'Refused for an unsupported setting',
        a: 'Intended: there is no silent substitution. Pass -permissive to take documented defaults, and it prints what it replaced with what.',
      },
    ],
  },
  more: {
    kicker: 'Further reading',
    title: 'Where the rest of it is.',
    lead: 'The guidebook is fourteen sections and lives next to the code, where it can be wrong in public and get fixed.',
    links: [
      { label: 'GUIDEBOOK.md', href: GUIDEBOOK_EN_URL, body: 'The full guide: installing, case formats, meshing, the Studio, MCP, verification, licensing.' },
      { label: 'SPEC-LIT.md', href: `${REPO}/blob/main/rust/SPEC-LIT.md`, body: 'Every discretisation specified with its source citation. The authority, not the code.' },
      { label: 'PROVENANCE.md', href: `${REPO}/blob/main/rust/PROVENANCE.md`, body: 'What was read to write each file, and the test that enforces it.' },
      { label: 'mcp/', href: `${REPO}/tree/main/mcp`, body: 'The MCP server: six tools, four read-only, no shell, one workspace.' },
      { label: 'cases/racecar.md', href: `${REPO}/blob/main/cases/racecar.md`, body: 'The race-car sample: the geometry, the three steps, and why step two exists.' },
      { label: 'README.md', href: REPO, body: 'Overview, the status numbers this tree measured, and the gates that miss.' },
    ],
  },
}

const ko: GuideCopy = {
  meta: { title: 'Iterations — 테크니컬 가이드북', back: '첫 화면으로' },
  hero: {
    eyebrow: '테크니컬 가이드북',
    title: '실제로 돌리는 법.',
    lead: '설치, 첫 케이스, 격자, 솔버 선택, 수렴 판독, 그리고 자주 만나는 오류의 원인까지. 식의 유도는 SPEC-LIT에 있고, 여기서는 쓰는 법만 다룹니다.',
    cta: '가이드북 전문 보기',
    ctaSub: 'GitHub · 14개 절',
  },
  toc: {
    label: '이 페이지에서',
    items: [
      { id: 'start', label: '5분: 첫 해석' },
      { id: 'solvers', label: '솔버 고르기' },
      { id: 'reading', label: '수렴 읽기' },
      { id: 'trouble', label: '문제 해결' },
      { id: 'more', label: '더 읽을 것' },
    ],
  },
  start: {
    kicker: '5분',
    title: '첫 해석은\n명령 세 줄입니다.',
    lead: '경주차 샘플이 설치 프로그램에 함께 들어 있습니다. 형상 하나와 명령 세 줄이면 210만 셀짜리 컷셀 격자와 수렴한 속도장이 여러분의 GPU에서 만들어집니다.',
    steps: [
      {
        n: '01',
        title: '풍동에서 차체를 파냅니다',
        body: '한 변 128개짜리 정육면체 격자에서 차체를 잘라냅니다. 이 단계는 CPU에서 도는 구간입니다 — 셀 210만 개를 STL 표면에 대해 안팎으로 가르고, 표면에 걸린 셀을 잘라냅니다.',
        code: 'ofgpu-generate-mesh big racecar_case 128 -stl car=racecar.stl -cutcell',
        time: '20-60분 · CPU',
      },
      {
        n: '02',
        title: '압력과 온도 필드를 넣습니다',
        body: '메쉬 생성기는 난류 전용 드라이버가 읽는 필드만 씁니다. 운동량 해석에는 풀 대상인 압력과, 저마하 루프가 요구하는 온도가 필요합니다. 둘 다 균일장이고, 내용이라 할 것은 경계조건뿐입니다.',
        code: 'copy racecar.fields\\p racecar_case\\0\\p\ncopy racecar.fields\\T racecar_case\\0\\T',
        time: '즉시',
      },
      {
        n: '03',
        title: '운동량까지 풉니다',
        body: 'GPU에 상주하는 루프입니다. 250회마다 잔차를 찍고, 결과는 OpenFOAM ASCII로 떨어집니다 — ParaView와 Studio 뷰어가 그대로 읽습니다.',
        code: 'ofgpu-lowmach racecar_case -iters 3000 -check 250 -output foam',
        time: '1-2분 · GPU',
      },
    ],
    note: '또는 cases\\racecar.cmd 한 줄이면 세 단계를 순서대로 실행합니다.',
  },
  solvers: {
    kicker: '솔버 고르기',
    title: '난류 모델 이름이 붙었다고\n유동을 푸는 것은\n아닙니다.',
    lead: '이 페이지에서 가장 중요한 내용입니다. 유선을 그려 보기 전까지는 아무것도 잘못돼 보이지 않기 때문에 놓치기 쉽습니다.',
    warning: {
      title: 'ofgpu-k-epsilon, ofgpu-k-omega, ofgpu-sa는 속도장을 얼린 채로 둡니다.',
      body: '난류 방정식만 풀고 속도장은 건드리지 않습니다. 이 셋으로 외부 공력 케이스를 돌리면:',
      bullets: [
        '유선이 직선으로 나옵니다',
        '컨투어가 균일한 한 색으로 나옵니다',
        'U도 p도 쓰이지 않습니다',
      ],
    },
    tableHead: ['드라이버', '푸는 것', '케이스 형식'],
    rows: [
      { bin: 'ofgpu-k-epsilon', solves: 'k, ε — U는 얼림', momentum: false, format: '디렉터리 / JSONC' },
      { bin: 'ofgpu-k-omega', solves: 'k, ω — U는 얼림', momentum: false, format: '디렉터리' },
      { bin: 'ofgpu-sa', solves: 'ν̃ — U는 얼림', momentum: false, format: '디렉터리' },
      { bin: 'ofgpu-lowmach', solves: 'U, p, T, 난류', momentum: true, format: '디렉터리 / JSONC' },
      { bin: 'ofgpu-buoyant', solves: 'U, p, T, 부력', momentum: true, format: '디렉터리' },
      { bin: 'ofgpu-plume', solves: 'U, p, T, 부력 플룸', momentum: true, format: '디렉터리' },
      { bin: 'ofgpu-vof', solves: 'U, p, α — 2상 자유표면', momentum: true, format: '디렉터리' },
      { bin: 'ofgpu-cht', solves: '다영역 전도 + 켤레 자연대류', momentum: true, format: 'JSONC' },
      { bin: 'ofgpu-datacentre', solves: '데이터센터 룸, 팬·타일·지표', momentum: true, format: 'JSONC' },
    ],
    legend: '강조된 줄이 속도장을 푸는 드라이버입니다. 유동을 보고 싶다면 그중에서 고르십시오.',
  },
  reading: {
    kicker: '수렴 읽기',
    title: '잔차 한 줄이\n말해 주는 것.',
    lead: '솔버는 확인 주기마다 한 줄을 찍습니다. 그 안의 숫자 셋이 이 실행을 신뢰할 수 있는지를 결정합니다.',
    sample: [
      'iter    500  |U| res 0.0928755  |p| res 1.351e-01  contErr 3.39691e-05',
      '             T [293.15, 293.15] K  rho [1.2041, 1.2041] kg/m3  p0 101325 Pa',
    ],
    rows: [
      { k: '|U| res, |p| res', v: '정규화 잔차입니다. 정상해석에서 이것이 내려가면 수렴 중입니다.' },
      { k: 'contErr', v: '연속방정식 오차입니다. 이것이 내려가지 않으면 압력 해가 실패한 것이고, 잔차가 아무리 예뻐도 결과를 믿을 수 없습니다.' },
      { k: 'T, rho 범위', v: '물리적으로 말이 안 되는 필드를 한눈에 보라고 찍습니다. T [inf, -inf]가 나오면 필드가 비었거나 깨진 것입니다.' },
    ],
    diverge: {
      title: '발산하면 멈춥니다.',
      body: '조용히 계속 돌지 않습니다. 발산한 반복 번호와 비유한이 된 필드를 이름으로 찍고 오류로 종료합니다 — 발산한 실행을 수렴한 것으로 착각할 수 없게.',
    },
  },
  trouble: {
    kicker: '문제 해결',
    title: '실제로 만나게 되는\n오류들.',
    lead: '대체로 만나게 되는 순서대로 놓았습니다.',
    items: [
      {
        q: 'non-manifold edge(s) — 컷셀이 STL을 거절함',
        a: '맞닿은 부품이 면을 공유하고 있습니다. 공유된 면을 사이에 두고는 안팎을 가를 수 없습니다. 서로 겹치게 만드십시오 — 살짝 파고들게 하는 편이 정확히 맞대는 것보다 언제나 안전합니다.',
      },
      {
        q: 'has no p field — 운동량 드라이버가 거절함',
        a: '메쉬 생성기는 난류 전용 드라이버가 읽는 필드만 씁니다. 0/p를, 저마하 루프라면 0/T까지 넣어야 합니다. 샘플의 cases/racecar.fields/가 그 예입니다.',
      },
      {
        q: '유선이 직선이고 컨투어가 한 색',
        a: '난류 전용 드라이버로 돌렸습니다. 속도장이 얼려 있어 유동이 아니라 초기장을 보고 있는 것입니다. 운동량 드라이버로 다시 돌리십시오.',
      },
      {
        q: 'NO_STRUCTURED_GRID — 뷰어가 절단면을 거절함',
        a: '컷셀 격자 뒤의 블록이 복원되지 않았습니다. 최신 버전은 셀 중심의 히스토그램에서 블록을 복원하므로, 지금 이 오류를 만난다면 격자가 블록 기반이 아니거나 구멍이 복원 허용치보다 많은 경우입니다. 후자는 의도된 거절입니다 — 블록처럼 보일 뿐인 격자를 블록으로 읽으면 셀이 엉뚱한 자리에 놓입니다.',
      },
      {
        q: '뷰어가 케이스를 옆으로 눕혀 그림',
        a: '케이스에 constant/g가 없고 바닥 패치 이름이 bottomWall, floor, ground가 아닙니다. 패치 이름을 맞추십시오. 뷰어를 돌리려는 목적만으로 중력 벡터를 넣지 마십시오 — 중력은 방정식에 실제로 들어가고 해가 달라집니다.',
      },
      {
        q: '-output "U,p" 가 거절됨',
        a: '-output은 필드가 아니라 형식 목록입니다. foam, vtu, nvdb, vdb, usda 중에서 고르십시오.',
      },
      {
        q: '인식되지 않는 설정으로 거절됨',
        a: '의도된 동작입니다 — 조용한 대체는 없습니다. -permissive를 주면 문서화된 기본값으로 넘어가고, 무엇을 무엇으로 대체했는지 출력합니다.',
      },
    ],
  },
  more: {
    kicker: '더 읽을 것',
    title: '나머지는 여기에.',
    lead: '가이드북은 14개 절이고 코드 옆에 있습니다 — 공개된 자리에서 틀리고, 고쳐질 수 있도록.',
    links: [
      { label: 'GUIDEBOOK.md', href: GUIDEBOOK_URL, body: '전문: 설치, 케이스 형식, 격자, Studio, MCP, 검증, 라이선스.' },
      { label: 'SPEC-LIT.md', href: `${REPO}/blob/main/rust/SPEC-LIT.md`, body: '모든 이산화 식의 명세와 원논문 인용. 코드가 아니라 이 문서가 기준입니다.' },
      { label: 'PROVENANCE.md', href: `${REPO}/blob/main/rust/PROVENANCE.md`, body: '파일별로 무엇을 읽고 구현했는지, 그리고 그것을 강제하는 시험.' },
      { label: 'mcp/', href: `${REPO}/tree/main/mcp`, body: 'MCP 서버: 도구 6개, 그중 4개는 읽기 전용, 셸 없음, 작업 폴더 하나.' },
      { label: 'cases/racecar.md', href: `${REPO}/blob/main/cases/racecar.md`, body: '경주차 샘플: 형상, 세 단계, 그리고 2단계가 왜 필요한지.' },
      { label: 'README.md', href: REPO, body: '개요, 이 트리가 실제로 측정한 현황 수치, 그리고 빗나가는 게이트.' },
    ],
  },
}

export const GUIDE: Record<Locale, GuideCopy> = { en, ko }
