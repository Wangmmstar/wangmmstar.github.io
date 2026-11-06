// Validate the requested editorial reduction against the previous published page.
const fs = require('node:fs');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const file = 'projects/fire-investigation/index.html';
const html = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
const prior = cp.execFileSync('git', ['show', `f4c8d80:${file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n');
const text = s => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const copy = [
  ['Can a virtual fire scene reveal how investigators reach their conclusions?', 'A 3D investigation workspace for examining fire evidence, exploring hypotheses, and documenting investigative decisions.'],
  ['A fire report records the conclusion. What happened along the way?', "Determining a fire's origin involves inspecting damage, interpreting clues, and weighing competing explanations. A final report may explain the findings, but it does not necessarily preserve the sequence of observations and changing hypotheses that led there."],
  ['Inspect the room before and after the fire.', 'Explore a reconstructed room before and after the fire to see how the environment changed and where potential evidence remains.'],
  ['Attach observations to the places they came from.', 'Investigators can mark locations in the 3D scene and record what they observed, how they interpreted it, and their confidence.'],
  ['Compare possible explanations with fire development.', 'Fire-development simulations can be reviewed alongside spatial evidence to examine whether a proposed explanation is consistent with the observed damage.'],
  ['A record of how the investigation unfolded.', 'The workspace brings together spatial annotations, investigative decisions, and hypothesis revisions so that the process can be reviewed beyond the final conclusion.'],
  ['Could AI help investigators revisit overlooked evidence?', 'Recorded investigation sessions could support future AI tools that identify gaps in evidence, prompt investigators to reconsider weakly supported explanations, and provide feedback during training.'],
];
const groups = [...html.matchAll(/<(header|section)\b[^>]*>([\s\S]*?)<\/\1>/g)].map(m => m[2]);
assert.equal(groups.length, copy.length);
groups.forEach((group, i) => {
  assert.equal(text(group.match(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/)[1]), copy[i][0]);
  assert.equal(text(group.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)[1]), copy[i][1]);
});
const matches = (s, re) => [...s.matchAll(re)].map(m => m[0]);
assert.equal(matches(html, /<h1\b/g).length, 1);
assert.deepEqual(matches(html, /<video\b[\s\S]*?<\/video>/g), matches(prior, /<video\b[\s\S]*?<\/video>/g));
assert.deepEqual(matches(html, /<script type="module">[\s\S]*?<\/script>/g), matches(prior, /<script type="module">[\s\S]*?<\/script>/g));
assert.equal(html.slice(html.indexOf('    <footer')), prior.slice(prior.indexOf('    <footer')));
assert.deepEqual([...html.matchAll(/<figcaption>([\s\S]*?)<\/figcaption>/g)].map(m => text(m[1])), ['Spatial evidence annotation in Unity.', 'Exploring fire development alongside scene evidence.']);
assert.deepEqual([...html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)].map(m => text(m[1])), ['Before the fire', 'After the fire']);
assert.deepEqual([...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m => m[1]), ['problem', 'exploration', 'evidence', 'simulation', 'reasoning', 'vision']);
assert(!/fire-kicker|fire-trace|fire-approach|fire-closing|fire-emphasis|hero-eyebrow|fire-scene-label|fire-video-heading/.test(html));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, new Set(ids).size);
for (const match of html.matchAll(/(?:src|href|poster)="([^"\s]+)"/g)) {
  if (match[1].startsWith('/')) assert(fs.existsSync('.' + match[1]), `Missing asset: ${match[1]}`);
  if (match[1].startsWith('#')) assert(ids.includes(match[1].slice(1)), `Broken anchor: ${match[1]}`);
}
console.log('Passed: exact copy and order, concise labels/captions, unchanged videos, scene script and footer, local assets, IDs and anchors.');
