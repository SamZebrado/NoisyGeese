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
