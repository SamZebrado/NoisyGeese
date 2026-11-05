# NoisyGeese v1.1 · Candidate verification

Verified on 2026-11-05 UTC in a fresh checkout of `codex/color-scale-20261105`, starting from `a792dfcbccc1df09ff6deb93a5739aad3c1d4866`. Real Chrome 157.0.8103.38 on macOS was driven with Playwright in isolated browser contexts. The real microphone API was blocked by the QA harness: zero calls occurred. Only built-in demo/simulated audio and explicitly injected synthetic FFT bins were used; no existing browser profile or recordings were read.

## Fixes verified

- Color status now updates both localization sources with each runtime message. Switching Chinese, English, or bilingual mode preserves the current reset, manual, invalid-range, fitted-band, and no-signal status.
- A band change during an active fit restarts sampling for the new band, including a manually requested fit with automatic fitting disabled. Reset cancels a pending fit.
- On narrow screens, the comparison-band label occupies its own line so both numeric frequency limits remain together.

## Automated results

- `npm test`: all baseline DSP/natural-sort/capture tests and all display-helper tests passed. Known sine RMS: −23.010299939 dBFS; distant-band rejection: −127.165528 dB; stepped-signal ordering and expected power increase passed.
- `node --check` passed for all 12 JavaScript modules across `dist/` and `docs/`, plus both root test modules.
- Baseline silence, short input, no FFT bins, clipping candidates, empty event/quiet classes, representative-duration totals, exact sample-count stopping, and early stop/flush tests passed.
- Selected-band fitting, narrow-peak preservation, level clamping, no-signal handling, FFT immutability, and comparison invariance helper tests passed.

## Browser results

All 30 desktop/responsive checks passed, followed by focused touch-viewport checks at 375 and 390 px:

- Default Chinese; language picker measured 102 × 44 px on desktop and at least 44 px high in every layout. All three modes switch and restore after reload.
- Manual color limits, invalid limits, reset, pending-fit cancellation, automatic fit restarts, and manual-fit range changes passed. Color-only fitting/manual/reset operations preserved rendered comparison output and the shared threshold.
- A synthetic −72 dBFS narrow peak near 10.55 kHz, with a louder −20 dBFS out-of-band low tone, fitted the 10–11 kHz band to −125…−65 dBFS. The high-frequency waterfall pixel was visibly bright (RGBA 218, 209, 139, 255). Out-of-band peaks can saturate as intended.
- Negative-infinity silence and a 101–102 Hz band with no FFT bins reported no valid signal and retained the previous valid color limits.
- Spectrum and waterfall frequency axes stayed at 20 Hz–20 kHz throughout; only heatmap color levels adapted.
- Capture/comparison numeric controls, presets, and spectrum keyboard controls synchronized both ways and invalidated stale comparison output.
- A default label matched the local second-resolution timestamp of the saved recording's start, after waiting before recording. A 5-second simulated capture contained exactly 220,500 samples at 44,100 Hz, marked synthetic. A manually entered Chinese label survived recording and language changes.
- Desktop 1440 px and narrow 375/390 px layouts were captured in Chinese, English, and bilingual modes: document scroll width equaled client width in all nine cases. Touch-viewport taps exercised fit/reset, preset and two-way numeric sync. Both comparison frequency limits shared the same row in all six mobile language layouts, with actual synthetic comparison graphs shown.
- No uncaught page errors occurred. Browser contexts and Chrome were closed after each run. No Playwright MCP session was started; the sandbox denied the optional process-inventory command, so unrelated processes were not inspected or changed.

The downloadable QA evidence bundle contains desktop/mobile PNG screenshots, machine-readable results, and the browser harnesses. Test recording payloads are excluded from repository source archives and evidence.

## Scope and limits

The capture worklet, DSP, analysis worker, thresholds, and comparison algorithms remain unchanged from the v1.0 baseline. Display contrast cannot recover uncaptured signals; the visible note mentions microphone/device processing and weak signals, and suggests device/setting comparison. No main-branch merge, publishing, settings changes, record deletion, or permission grants were performed.

Mobile checks emulate viewport, touch, and pixel density in desktop Chrome; they do not establish physical-device microphone response, mobile background behavior, or calibrated sound-pressure accuracy. Real-microphone checks were deliberately excluded.

## Source packaging

`dist/` and `docs/` are byte-identical. Both `source.zip` copies contain the root README variants, LICENSE, QA.md, package.json, both test modules, and all `dist/` static assets (including logo and guide images) except `source.zip`. No nested archives or test recordings are included. The extracted package passes `npm test` and JavaScript syntax checks.

---

# NoisyGeese v1.0 · Verification

Tested on 2026-11-05 using a cloud Chrome browser and Node.js. All audio used in testing was synthetic. No real microphone, household audio, address, or actual floor was used or included in the repository.

## Passed automated checks

Run `node test.mjs` from the project root.

- 0.1-amplitude 1 kHz sine: expected −23.0103 dBFS; computed −23.01029994 dBFS.
- Out-of-band energy rejection: approximately 127 dB for the test signal and selected distant band.
- Stepped-amplitude signal: short-window peak > overall mean > lower-percentile level.
- Power increase agrees with the synthetic signal expectation within the stated tolerance.
- Silence, insufficient-length input, a band with no FFT bins, near-full-scale samples, and natural ordering of Chinese floor numerals.
- Event/quiet groups with no members return null rather than fabricated zero values.
- Group representative durations sum to the selected analysis duration.
- AudioWorklet sample-count stopping: exactly 480,000 samples for a requested 10 seconds at 48 kHz.
- Early stop flushes the partially filled capture buffer and signals completion once.
- JavaScript syntax checks for all modules and HTML option sanity.

## Passed browser checks

- The built-in simulated capture routes a generated audio buffer through the same AudioWorklet recording path as microphone input.
- Two recorded clips each contained exactly 220,500 samples at 44,100 Hz, equal to 5.000 seconds. This was verified by decoding their exported `.noise` backup payloads, not only reading rounded UI labels.
- A separate recording requested for 10 seconds was manually ended early. The saved/exported payload contained 321,024 samples at 44,100 Hz, equal to 7.279455782 seconds.
- Saved synthetic recordings remained after browser reload through IndexedDB.
- Imported a synthetic backup, exported all recordings, verified payload sample counts, then re-imported the export. Duplicate IDs were skipped without overwriting or duplicating existing recordings.
- Natural sorting yielded fictional second-floor, fifth-floor, tenth-floor labels in numeric order. Move-down and move-up restored the original order.
- Equal-duration, common-band comparisons produced separate overall, event and quiet values. A common 0 dBFS threshold produced no event windows and displayed “None”, zero event count and zero event duration.
- Changing the band via keyboard changed 80 Hz to 81 Hz and invalidated stale comparison output.
- Three language modes were checked. English changes static content, long measurement caveats, dynamic progress, results, warnings and tutorial text. Chinese returns to Chinese. Bilingual displays both. User-created Chinese labels are preserved in all modes.
- The expandable tutorial uses an explicitly fictional fifth-floor example, an original floor illustration, and actual UI screenshots of synthetic signals.
- A 390-pixel iframe viewport (375-pixel content area after scrollbar) was checked visually. Both bilingual and English layouts measured scrollWidth = clientWidth = 375 pixels, with no horizontal page overflow. Recording controls, result bars and event timelines remained usable.
- Source review found no audio upload API, third-party script, external CDN, fetch, XMLHttpRequest or WebSocket call in application JavaScript. All linked application assets use relative paths.

## Limits of this verification

- Narrow-viewport checks are responsive-layout checks, not physical iPhone/Android or touch-device tests.
- Real microphone permission handling, microphone response, OS/hardware AGC behavior, Bluetooth routing, mobile background suspension and physical acoustic calibration were not verified with real hardware.
- Synthetic signal tests do not establish calibrated sound-pressure accuracy or source localization.
- Full offline reopening is not promised: the hosted webpage assets must load first, or the source must be served locally on localhost. Audio processing and storage remain browser-local.
- First release uses STFT, not wavelets.

## Packaging

The public source contains only application code, approved logo, documentation and synthetic UI screenshots. Test recording payloads and cloud QA-only viewport pages are excluded. `dist/source.zip` is a source distribution; deployment may copy `dist/` into `docs/` for branch-based GitHub Pages.
