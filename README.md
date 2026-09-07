# Iterations — product site

The homepage for [Iterations](https://github.com/using76/Iteration-CFD), a
GPU-resident finite volume CFD solver with an AI assistant that drives it.

One page, read as a descent: a WebGPU ocean that turns out to be a mesh, the
product in use before any feature list, the engine, the physics, the grounds,
and a chat that ends in the download.

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # tsc -b && vite build  ->  dist/
npx oxlint
```

## English and Korean

Every word lives in `src/lib/copy.ts`, as two whole copies rather than a
translation table. English is the default; the toggle sits in the hero's corner
and in the nav, and a choice is remembered on the device.

## The beta gate

The download asks for an email address and two consents — one for product news,
which is the only reason the address is collected, and one acknowledging the
Prosperity licence terms. Set `VITE_SIGNUP_ENDPOINT` at build time (repository
variable `SIGNUP_ENDPOINT` in CI) to POST signups as JSON somewhere. Without
it the form still works and the record stays on the visitor's device, because a
collection outage must not stand between someone and the software.

## The ocean

`src/ocean/` is a three-cascade Gerstner sum evaluated in the vertex stage,
with analytic normals and crest foam — not an FFT, deliberately, so the WebGL2
fallback renders the same water. Technique reference: Tessendorf (2001),
Horvath (2015) and the MIT-licensed `owenyuwono/poseidon`; no code is copied
from it. `three/webgpu` is loaded after first paint, so the 850 kB it costs is
never on the critical path.

---

© 2026 주식회사 이터레이션즈 (Iterations Co., Ltd.) · in collaboration with
주식회사 메테오시뮬레이션 (Meteo Simulation Co., Ltd.) · simul@msimul.com
