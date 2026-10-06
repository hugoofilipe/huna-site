"""Generate the HUNA journey SVG using Python 3's standard library.

Run from any directory: python3 /path/to/huna-site/scripts/generate_journey.py
The output always goes to the repository's public/images directory.
"""
from pathlib import Path
from html import escape

OUT = Path(__file__).resolve().parent.parent / 'public' / 'images'
stages = [
    ('Idea', 'scope the change', 'people', 'Define the change and the expected result.'),
    ('Develop', 'Vue · Quasar', 'agents', 'Work locally in SPA or PWA mode; preserve existing integrations.'),
    ('Validate', 'npm test', 'gates', 'Run component regressions; optional browser checks cover the camera UI.'),
    ('Merged', 'source integrated', 'people', 'Integrate the validated change. Merged code is not yet a live release.'),
    ('Version & tag', 'footer · Git tag', 'state', 'Update the footer version, then commit and push the release tag.'),
    ('Build & publish', 'PWA → deploy_dev', 'agents', 'npm run build creates the PWA and pushes its files to deploy_dev.'),
    ('Released', 'cPanel pull', 'people', 'Pull deploy_dev in cPanel to make the release live on 2021.huna.pt.'),
]
css = '''
:root{--bg:#f6f8f7;--ink:#14201c;--muted:#52645c;--rail:#c9d4d0;--people:#0e7490;--people-bg:#e0f4f8;--agents:#15803d;--agents-bg:#e3f5e8;--gates:#be123c;--gates-bg:#fbe7ec;--state:#6d28d9;--state-bg:#efe8fd}
@media(prefers-color-scheme:dark){:root{--bg:#0d1513;--ink:#e6efec;--muted:#a4b7af;--rail:#35463f;--people:#5fd0e6;--people-bg:#0f2a31;--agents:#5cd48a;--agents-bg:#10291a;--gates:#f2779a;--gates-bg:#33141e;--state:#b39cf5;--state-bg:#211a38}}
.bg{fill:var(--bg)}
text{font-family:ui-sans-serif,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;fill:var(--ink)}
.h{font-size:22px;font-weight:700}.t{font-size:15px;font-weight:600}
.c{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;fill:var(--muted)}
.k{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;font-weight:600;letter-spacing:.07em;fill:var(--muted)}
.s{font-size:14px;font-weight:600;opacity:0}.st6{opacity:1}
.node rect{stroke-width:2}.people rect{fill:var(--people-bg);stroke:var(--people)}.agents rect{fill:var(--agents-bg);stroke:var(--agents)}.gates rect{fill:var(--gates-bg);stroke:var(--gates)}.state rect{fill:var(--state-bg);stroke:var(--state)}
.rail{stroke:var(--rail);stroke-width:3;stroke-linecap:round}.phase{fill:none;stroke:var(--rail);stroke-width:1.5;stroke-dasharray:4 5}
.dot{fill:var(--state);transform:translateX(936px)}.chip{fill:var(--state-bg);stroke:var(--state);stroke-width:1.5}
@media(prefers-reduced-motion:no-preference){
.dot{animation:travel 21s linear infinite}
'''
for i in range(7):
    start = i * 100 / 7
    end = (i + 1) * 100 / 7
    # Hard boundaries ensure exactly one status is visible, including loop reset.
    css += f'.n{i}{{animation:lit{i} 21s linear infinite}}.st{i}{{opacity:0;animation:status{i} 21s step-end infinite}}\n'
    if i == 0:
        css += '@keyframes lit0{0%,97%{opacity:1}100%{opacity:.5}}\n'
    else:
        css += f'@keyframes lit{i}{{0%,{start-.5:.4f}%{{opacity:.5}}{start+1:.4f}%,97%{{opacity:1}}100%{{opacity:.5}}}}\n'
    if i == 0:
        css += f'@keyframes status0{{0%{{opacity:1}}{end:.4f}%,100%{{opacity:0}}}}\n'
    elif i == 6:
        css += f'@keyframes status6{{0%{{opacity:0}}{start:.4f}%{{opacity:1}}100%{{opacity:0}}}}\n'
    else:
        css += f'@keyframes status{i}{{0%{{opacity:0}}{start:.4f}%{{opacity:1}}{end:.4f}%,100%{{opacity:0}}}}\n'
css += '@keyframes travel{'
for i in range(7):
    start = i * 100 / 7
    hold = start + 8
    css += f'{start:.4f}%,{hold:.4f}%{{transform:translateX({i*156}px);opacity:1}}'
css += '98%{transform:translateX(936px);opacity:1}100%{transform:translateX(936px);opacity:0}}}\n'
css += '@media(prefers-reduced-motion:reduce){.dot{transform:translateX(936px)}.s{opacity:0}.st6{opacity:1}}'

parts = ['''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 380" width="1120" height="380" role="img" aria-labelledby="title desc">
<title id="title">HUNA — from idea to merged code to release</title>
<desc id="desc">Define an idea, develop locally with Vue and Quasar, validate with component tests and optional browser checks, integrate the source change, update the footer version and push a Git tag, build the PWA and publish its files to deploy_dev, then pull that branch in cPanel to release on 2021.huna.pt. The repository does not document a mandatory review or merge gate. This is an illustrative process animation, not live deployment status.</desc>''', '<style>' + css + '</style>', '''
<rect class="bg" width="1120" height="380" rx="14"/>
<text class="h" x="28" y="44">HUNA · From an idea to a live release</text>
<text class="c" x="28" y="68">Vue + Quasar · validate the source, publish the PWA, then deploy the website.</text>
<rect class="phase" x="20" y="101" width="612" height="108" rx="12"/>
<rect class="phase" x="644" y="101" width="456" height="108" rx="12"/>
<text class="k" x="30" y="94">DEVELOPMENT · SOURCE CODE</text>
<text class="k" x="654" y="94">RELEASE · BUILT WEBSITE</text>
''']
for i in range(6):
    x = 28 + i * 156
    parts.append(f'<line class="rail" x1="{x+136}" y1="157" x2="{x+156}" y2="157"/>')
for i, (title, sub, kind, status) in enumerate(stages):
    x = 28 + i * 156
    cx = x + 68
    parts.append(f'''<g class="node {kind} n{i}">
<rect x="{x}" y="125" width="136" height="64" rx="10"/>
<text class="t" x="{cx}" y="152" text-anchor="middle">{escape(title)}</text>
<text class="c" x="{cx}" y="173" text-anchor="middle">{escape(sub)}</text>
</g>''')
parts += ['''<circle class="dot" cx="96" cy="114" r="5"/>
<text class="c" x="28" y="230">Merge ≠ release. The built files travel through deploy_dev before the cPanel pull.</text>
<rect class="chip" x="28" y="250" width="1064" height="48" rx="24"/>
<text class="k" x="48" y="278">WHAT HAPPENS</text>''']
for i, (_, _, _, status) in enumerate(stages):
    parts.append(f'<text class="s st{i}" x="178" y="279" aria-hidden="true">{escape(status)}</text>')
parts += ['''<text class="c" x="28" y="332">Source: README.md · package.json · scripts/build_deploy.sh</text>
<text class="c" x="28" y="353">Illustrative workflow, not live status · no mandatory PR / merge gate documented · production: 2021.huna.pt</text>
</svg>''']
OUT.mkdir(parents=True, exist_ok=True)
output = OUT / 'huna-development-to-release.svg'
output.write_text('\n'.join(parts) + '\n', encoding='utf-8')
print(f'Generated {output}')
