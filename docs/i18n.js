// SPDX-License-Identifier: Apache-2.0
/* NoisyGeese localization. No network calls; user-entered labels are never translated. */
(() => {
'use strict';
const dictionary = new Map(Object.entries({
'暴噪鹅 · LOCAL SOUND LAB':'暴噪鹅 · LOCAL SOUND LAB',
'音频只在本机处理':'Audio stays on this device',
'色阶下限 dBFS':'Color minimum, dBFS',
'色阶上限 dBFS':'Color maximum, dBFS',
'对照频段下限 Hz':'Comparison lower band edge, Hz',
'对照频段上限 Hz':'Comparison upper band edge, Hz',
'测量说明 ↗':'Measurement notes ↗',
'听见声音，也看见差异':'Hear the sound. See the difference.',
'把一段声音，':'Take a sound.',
'放进同一把尺子。':'Compare it on the same scale.',
'选定频段 · 标记位置 · 等时长对照':'Choose a band · Label a location · Compare equal durations',
'开启麦克风':'Enable microphone','选频段、录制':'Select a band and record','对照记录':'Compare recordings',
'实时频谱':'Live spectrum','● 麦克风未开启':'● Microphone off','● 麦克风已关闭':'● Microphone off','● 实时采集中':'● Microphone live','● 合成信号演示':'● Synthetic signal demo',
'瞬时频谱 · 横轴 Hz · 幅度 dBFS':'Instantaneous spectrum · x: Hz · amplitude: dBFS',
'约 12 秒前':'About 12 seconds ago','时间 →':'Time →','现在':'Now',
'上下拖动频段边界，也可用方向键微调':'Drag band edges vertically, or fine-tune with arrow keys',
'弱':'Low','强':'High','采集一条记录':'Capture a recording','分析频段':'Analysis band',
'低频':'Low frequencies','嗡鸣':'Hum','中频':'Mid frequencies','高频':'High frequencies','全显示段':'Full displayed band',
'记录标签':'Recording label','例如：五楼 / 走廊 / 窗边':'Example: Floor 5 / Hallway / Window',
'单次录制时长':'Recording duration','5 秒 · 快速检查':'5 s · Quick check','10 秒 · 推荐':'10 s · Recommended',
'开始录制':'Start recording','提前结束':'Finish early','关闭麦克风':'Disable microphone',
'首次使用会请求麦克风权限。佩戴耳机也不回放现场声音。':'Microphone permission is requested on first use. Live input is not played back, even with headphones.',
'尚未连接设备':'No device connected','未连接设备':'No device connected',
'先用合成示例试一试 ↗':'Try a synthetic demo ↗','声音记录':'Recordings',
'按标签自然排序':'Sort naturally by label','导出备份':'Export backup','导入备份':'Import backup',
'记录保存在当前浏览器的 IndexedDB。建议定期导出备份。':'Recordings are stored in this browser’s IndexedDB. Export backups regularly.',
'还没有声音记录':'No recordings yet',
'在每个位置保持相同手机、朝向和距离，录下一段声音。':'Record at each location using the same phone, orientation, and distance.',
'之后可拖动排序，或用上下箭头调整。':'Then drag to reorder, or use the up/down buttons.',
'让比较条件保持一致':'Keep comparison conditions consistent','导出结果 CSV':'Export results as CSV',
'每条分析时长':'Analysis duration per recording','重新计算对照':'Recalculate comparison','计算中…':'Calculating…',
'从每条记录设置的起点截取相同时长。过短记录不参与；请至少选择 2 条。':'Equal-duration segments begin at each recording’s chosen start. Short recordings are excluded; select at least 2.',
'事件阈值':'Event threshold','建议共同阈值':'Suggest shared threshold',
'频段短窗能量 ≥ 阈值为事件，低于阈值为安静。所有记录共用同一阈值。':'Band energy in a short window at or above the threshold is an event; below it is quiet. All recordings use the same threshold.',
'平均能量':'Mean energy','事件段平均':'Event-window mean','安静段平均':'Quiet-window mean',
'所选频段内，各短时窗均方能量的时间加权平均值换算为 dBFS。':'Time-weighted mean of short-window mean-square energy in the selected band, converted to dBFS.',
'同频段、同长度片段的时间加权平均功率。':'Time-weighted mean power for segments with the same band and duration.',
'频段短窗能量 ≥ 共同阈值的片段：先平均功率，再转为 dBFS。':'Windows with band energy ≥ the shared threshold: average power first, then convert to dBFS.',
'频段短窗能量 < 共同阈值的片段：先平均功率，再转为 dBFS。':'Windows with band energy < the shared threshold: average power first, then convert to dBFS.',
'较弱 ← → 较强':'Lower ← → Higher',
'录制或载入示例后，在这里比较同一频段。':'Record audio or load the demo to compare the same frequency band here.',
'设置已改变。点击“重新计算对照”更新结果。':'Settings changed. Select “Recalculate comparison” to update results.',
'这是一把相对的尺子。':'A relative scale.',
'帮助你记录、复测和比较。':'For recording, repeat measurements, and comparison.',
'不是合规声级计，也不是声源定位仪。':'Not a compliance sound level meter or a source locator.',
'三个数值分别是什么？':'What do the three metrics mean?',
'怎样让位置之间更可比？':'How can locations be compared more fairly?',
'能否从哪个标签最响，确定声音来自哪里？':'Does the loudest label identify the sound source?',
'音频保存在哪里？':'Where is audio stored?',
'申请浏览器持久存储':'Request persistent browser storage','内置计算自检':'Built-in calculation self-test',
'用已知振幅的合成正弦波检验能量估计、频段抑制和峰/静时顺序。此检查只验证数字算法，不校准麦克风。':'Synthetic sine waves of known amplitude test energy estimation, out-of-band rejection, and peak/quiet ordering. This verifies only the digital algorithm; it does not calibrate the microphone.',
'运行数字信号自检':'Run digital signal self-test','保持条件一致，让差异有据可查。':'Keep conditions consistent. Make differences traceable.','下载源码':'Download source',
'大白鹅追逐橙色时频声波标志':'Logo: a white goose chasing orange time-frequency sound waves',
'瞬时频谱图，横轴为对数频率，纵轴为数字信号幅度':'Instantaneous spectrum: logarithmic frequency on the horizontal axis, digital signal amplitude on the vertical axis',
'实时时频图，横轴为时间，纵轴为对数频率，高频在上，颜色表示强度':'Live spectrogram: time runs horizontally; logarithmic frequency runs vertically with high frequencies at the top; color represents intensity',
'频段下限':'Lower band edge','频段上限':'Upper band edge','下限 Hz':'Lower limit, Hz','上限 Hz':'Upper limit, Hz','对照指标':'Comparison metric',
'开启麦克风后，频谱会在这里出现':'Enable the microphone to see the spectrum here',
'分析线程未能启动，请刷新页面':'The analysis worker could not start. Reload the page.',
'本地数据库不可用':'Local database unavailable','保存中断':'Saving interrupted','存储空间不足':'Insufficient storage',
'请在 HTTPS 网址和支持录音的浏览器中打开':'Open an HTTPS URL in a browser that supports recording',
'麦克风已开启，只在本机分析；点击“开始录制”保存限时片段。':'Microphone enabled for local analysis. Select “Start recording” to save a timed segment.',
'麦克风权限未获允许。请在浏览器地址栏的权限设置中允许麦克风，然后重试。':'Microphone permission was not granted. Allow it in the browser address bar’s site permissions, then retry.',
'没有找到可用麦克风。请连接设备后重试。':'No available microphone found. Connect a device and retry.',
'麦克风已关闭。已保存的记录仍留在本浏览器。':'Microphone disabled. Saved recordings remain in this browser.',
'片段太短，未保存。请至少录制 0.25 秒。':'The segment was too short to save. Record at least 0.25 seconds.',
'拖动调整顺序':'Drag to reorder','修改记录标签':'Edit recording label','合成':'Synthetic','未保存':'Unsaved','起点':'Start','秒':'s','▶ 回听':'▶ Play','■ 停止':'■ Stop','移除':'Remove',
'回听失败，可以下载 WAV 后播放。':'Playback failed. Download the WAV file to play it elsewhere.',
'请至少选择两条足够长的记录。缩短分析时长，或将分析起点调早。':'Select at least two recordings long enough for analysis. Shorten the analysis duration or move the start earlier.',
'计算期间设置已改变，请重新计算。':'Settings changed during calculation. Recalculate.',
'请先计算一次对照，再生成共同阈值建议。':'Calculate a comparison before requesting a shared threshold suggestion.',
'共同阈值已设为所有有效片段短窗能量的第20百分位 +6 dB。请结合回听和时间条确认是否合理。':'The shared threshold is now the 20th percentile of short-window energy across valid segments +6 dB. Review playback and timelines to check whether it is suitable.',
'无':'None','无符合短窗':'No matching windows',
'录制期间页面曾进入后台，请回听检查是否有暂停或中断。':'The page was backgrounded during recording. Listen for pauses or interruptions.',
'包含合成示例，不是现场测量。':'Includes synthetic examples, not on-site measurements.',
'检测到接近满量程的样本，可能削波。请检查输入增益并重新录制。':'Samples near full scale were detected, indicating possible clipping. Check input gain and record again.',
'记录设备或采集设置不完全一致，横向比较需谨慎。':'Recording devices or capture settings differ. Compare recordings with caution.',
'至少一条录音的自动增益未确认关闭，幅度比较可能受影响。':'Automatic gain control was not confirmed off for at least one recording. Amplitude comparisons may be affected.',
'有记录没有高于阈值的事件短窗；事件平均显示“无”。':'Some recordings have no event windows at or above the threshold; their event mean is shown as “None”.',
'有记录没有低于阈值的安静短窗；安静平均显示“无”。':'Some recordings have no quiet windows below the threshold; their quiet mean is shown as “None”.',
'手机低频响应可能衰减；低频读数尤其不能代替专业测量。':'Phone microphones may attenuate low frequencies. Low-frequency readings in particular cannot replace professional measurement.',
'频段能量起伏不等于已识别声源；最响标签不等于声源位置。':'Fluctuating band energy does not identify a source; the loudest label does not locate it.',
'备份已交给浏览器下载。文件包含声音和标签，请妥善保管；确认下载成功后再清理记录。':'The backup was handed to the browser for download. It contains audio and labels; keep it safe. Confirm the download succeeded before clearing recordings.',
'备份超过 150 MB，请分批处理。':'Backup exceeds 150 MB. Split it into smaller batches.',
'不是支持的备份格式':'Unsupported backup format','备份音频字段无效':'Invalid backup audio fields','音频数据过大或损坏':'Audio data is too large or corrupted','单条音频时长必须在 0.1–121 秒':'Each recording must be 0.1–121 seconds long','音频采样值无效':'Invalid audio sample values',
'浏览器已允许持久存储。仍建议备份；主动清理站点数据仍会删除记录。':'Persistent storage granted. Backups are still recommended; manually clearing site data will still delete recordings.',
'浏览器没有授予持久存储。仍可正常使用，请定期导出备份。':'Persistent storage not granted. You can still use the app; export backups regularly.',
'请先结束录制再载入示例。':'Finish recording before loading the demo.',
'这是合成示例，不是现场声音。示例只在当前页面内存中保留，刷新即清除；真实记录不受影响。':'These are synthetic examples, not on-site audio. They live only in this page’s memory and disappear on reload; real recordings are unaffected.',
'页面进入后台可能暂停采样。返回后请核对录制长度与声音连续性。':'Backgrounding the page may pause sampling. Check recording length and continuity when you return.',
'此浏览器的本地数据库不可用。录音只能暂存在页面中，请及时导出，关闭页面会丢失。':'This browser’s local database is unavailable. Recordings are held only in page memory. Export promptly; closing the page will lose them.',
'无效音频':'Invalid audio','片段长度不足':'Segment is too short','频段比 FFT 频率分辨率更窄，请放宽频段':'The band is narrower than the FFT frequency resolution. Widen the band.',
'已知正弦 RMS ≈ −23.01 dBFS':'Known sine RMS ≈ −23.01 dBFS','带外抑制超过 60 dB':'Out-of-band rejection exceeds 60 dB','峰时 > 平均 > 安静时':'Peak > mean > quiet','平均功率约增加 11.14 dB':'Mean power increases by about 11.14 dB'
}));
dictionary.set("平均能量：对选定片段做 Hann 窗短时 FFT，约 0.17 秒一窗、50% 重叠；对频段内各频率单侧功率求和，按窗能量校正，再按各窗所代表的时间加权平均功率。事件段平均、安静段平均：用所有记录共用的 dBFS 阈值，将短窗分组后各自平均功率。无符合条件的短窗时显示“无”，不会填入零或伪造静音。另行报告短窗最大值，非瞬时声压峰值。均用 10·log₁₀(均方值) 表示为 dBFS，不是 dB SPL、dBA，也不能据此判断是否超标。","Mean energy: a short-time FFT with Hann windows is applied to the selected segment, approximately 0.17 seconds per window with 50% overlap. One-sided power is summed over the selected frequency band, corrected for window energy, and averaged with weights based on the time represented by each window. Event-window and quiet-window means: a shared dBFS threshold groups short windows across all recordings, and power is averaged separately within each group. If a group has no matching windows, “None” is shown, not zero or fabricated silence. The short-window maximum is reported separately; it is not an instantaneous sound-pressure peak. All values use 10·log₁₀(mean square), in dBFS, not dB SPL or dBA. They cannot establish whether a regulatory limit is exceeded.");
dictionary.set("“建议共同阈值”为当前所有有效片段短窗能量的第 20 百分位加 6 dB，只是起点，可手动调整；阈值变化不会改写音频。事件判定针对频段能量起伏，不等于确认某种声源，也不能保证把窄带尖峰和宽带杂声分离。各窗用相邻窗中心的中点分配时间，首尾延伸到片段边界，分组时间是估计值，不重复累计重叠窗。FFT 频率格点约 3–6 Hz，边界按格点中心纳入，显示实际有效频段。分析只使用完整窗；末尾补充一个以片段终点结束的完整窗。窄于频率分辨率的频段可能没有格点。真实音频不做降噪、归一化或后期增益。实时预览使用浏览器 AnalyserNode 的频谱输出，仅供选频；正式对照使用本项目自写 FFT 与功率算法，两者窗函数和幅度标度不完全相同，请以正式对照数值为准。","“Suggest shared threshold” uses the 20th percentile of short-window energy across all valid segments plus 6 dB. It is only a starting point and can be adjusted manually; threshold changes do not modify the audio. Event classification describes fluctuations in band energy, not identification of a sound source, and cannot guarantee separation of narrowband peaks from broadband noise. Time is allocated at the midpoints between adjacent window centers, extending to the segment boundaries at each end. Group durations are estimates and do not double-count overlapping windows. FFT bins are approximately 3–6 Hz apart; bins are included by their center frequencies, and the effective band is shown. Only complete windows are analyzed, with one extra complete window ending at the segment endpoint when needed. Bands narrower than the frequency resolution may contain no bins. Real audio is not denoised, normalized, or given post-processing gain. The live preview uses the browser’s AnalyserNode spectrum only to help select a band. Formal comparisons use this project’s own FFT and power calculation. Their window functions and amplitude scales are not identical; use the formal comparison values.");
dictionary.set("使用同一设备、同一浏览器、同一麦克风与输入音量；固定朝向、高度、持握和与墙面距离。每处等待稳定后重复录制，记录相近时间的设备运行状态，避免说话、走动、风和碰触麦克风。网页请求关闭自动增益、降噪和回声消除，但浏览器、系统或硬件可能不支持或仍有处理。改变设备、输入增益或自动增益，会破坏横向比较。","Use the same device, browser, microphone, and input volume. Keep orientation, height, grip, and distance from walls fixed. Wait for conditions to settle, repeat recordings at each location, and note equipment operating states around the same time. Avoid speech, movement, wind, and touching the microphone. The page requests automatic gain control, noise suppression, and echo cancellation to be disabled, but the browser, operating system, or hardware may not support this or may still process the audio. Changing the device, input gain, or automatic gain control undermines comparisons across locations.");
dictionary.set("不能。墙体和管道传声、反射、驻波、楼板共振与麦克风低频响应，都可能让远处更响、近处更安静。频谱相似或某处数值高，最多提供复测线索，不能据此认定来源或责任。手机对低频尤其可能不准确。涉及争议、健康或合规，需校准设备和专业测量。","No. Sound transmission through walls and pipes, reflections, standing waves, floor resonance, and microphone low-frequency response can make a distant location louder and a nearby one quieter. Similar spectra or a higher reading can at most suggest where to repeat measurements; they cannot establish a source or responsibility. Phones may be especially inaccurate at low frequencies. Disputes, health assessments, and compliance require calibrated equipment and professional measurement.");
dictionary.set("音频、标签和测量结果由浏览器本地处理。程序没有音频上传接口，也不包含第三方统计代码；网页加载、登录验证由托管服务完成。音频存在当前网址、当前浏览器的 IndexedDB，不会自动同步到别的设备。无痕模式、清理站点数据或浏览器回收空间会导致丢失。请导出备份，并妥善保管，其中包含原始声音和标签。","Audio, labels, and measurement results are processed locally by the browser. The program has no audio-upload interface or third-party analytics code; page loading and login verification are handled by the hosting service. Audio is stored in IndexedDB for this website in this browser and does not automatically sync to another device. Private browsing, clearing site data, or browser storage reclamation can cause loss. Export backups and store them safely: they contain original audio and labels.");
dictionary.set('模拟录制','Simulated');
dictionary.set('请先结束当前录制。','Finish the current recording first.');
dictionary.set('● 模拟采集中','● Simulated capture active');
dictionary.set('合成信号已进入录制链路，点击开始录制。','A synthetic signal is feeding the recording pipeline. Select Start recording.');
dictionary.set('模拟模式：不使用麦克风，保存的录音会标记为模拟。','Simulation mode: no microphone is used. Saved recordings are marked as simulated.');
dictionary.set('开启模拟采集','Start simulated capture');
dictionary.set('模拟采集不使用麦克风；它把合成信号送过同一录制链路，生成明确标记为模拟的本地录音。','Simulated capture does not use the microphone. It feeds a synthetic signal through the same recording pipeline and creates local recordings clearly marked as simulated.');
dictionary.set('语言','Language');
dictionary.set('实时频谱预览','LIVE SPECTRUM');
dictionary.set('采集','CAPTURE');
dictionary.set('你的录音','YOUR RECORDINGS');
dictionary.set('同频段 · 等时长','SAME BAND · SAME DURATION');
dictionary.set('测量前请阅读','READ BEFORE MEASURING');
dictionary.set("标签","Label");
dictionary.set("分析起点秒","Analysis start (s)");
dictionary.set("时长秒","Duration (s)");
dictionary.set("频段下限Hz","Band lower limit (Hz)");
dictionary.set("频段上限Hz","Band upper limit (Hz)");
dictionary.set("阈值dBFS","Threshold (dBFS)");
dictionary.set("平均dBFS","Mean (dBFS)");
dictionary.set("事件平均dBFS","Event mean (dBFS)");
dictionary.set("安静平均dBFS","Quiet mean (dBFS)");
dictionary.set("短窗峰值dBFS","Short-window maximum (dBFS)");
dictionary.set("事件估计秒","Estimated event duration (s)");
dictionary.set("事件窗数","Event window count");
dictionary.set("安静估计秒","Estimated quiet duration (s)");
dictionary.set("安静窗数","Quiet window count");
dictionary.set("频段内峰频Hz","Strongest frequency bin in band (Hz)");
dictionary.set("削波候选样本数","Possible clipping sample count");
dictionary.set("合成示例","Synthetic example");
dictionary.set("是","Yes");
dictionary.set("否","No");
const sourceAliases = new Map([['语言 / Language','语言'],['LIVE SPECTRUM','实时频谱预览'],['CAPTURE','采集'],['YOUR RECORDINGS','你的录音'],['SAME BAND · SAME DURATION','同频段 · 等时长'],['READ BEFORE MEASURING','测量前请阅读']]);
const rules = [
[/^模拟采集失败：([\s\S]*)$/,m=>`Simulated capture failed: ${english(m[1])}`],
[/^(\d+) 秒$/,m=>`${m[1]} s`],
[/^FFT 8192 · ([\d.]+) Hz\/格$/,m=>`FFT 8192 · ${m[1]} Hz/bin`],
[/^([\d.]+) 秒 · (\d+) Hz · (.+)$/,m=>`${m[1]} s · ${m[2]} Hz · ${m[3]}`],
[/^参与对照：([\s\S]*)$/,m=>`Include in comparison: ${m[1]}`],
[/^修改标签：([\s\S]*)$/,m=>`Edit label: ${m[1]}`],
[/^([\s\S]*) 分析起点秒数$/,m=>`${m[1]}: analysis start in seconds`],
[/^回听 ([\s\S]*)$/,m=>`Play ${m[1]}`],
[/^下载 ([\s\S]*) 的 WAV$/,m=>`Download WAV for ${m[1]}`],
[/^上移 ([\s\S]*)$/,m=>`Move up: ${m[1]}`],
[/^下移 ([\s\S]*)$/,m=>`Move down: ${m[1]}`],
[/^移除 ([\s\S]*)$/,m=>`Remove ${m[1]}`],
[/^从当前浏览器移除“([\s\S]*)”？此操作不能撤销。需要保留时，请先导出备份。$/,m=>`Remove “${m[1]}” from this browser? This cannot be undone. Export a backup first if you want to keep it.`],
[/^正在录制 ([\s\S]*) · ([\d.]+) \/ (\d+) 秒。请保持安静、不要触碰设备。$/,m=>`Recording ${m[1]} · ${m[2]} / ${m[3]} s. Keep quiet and avoid touching the device.`],
[/^已(暂存|保存) ([\s\S]*) · ([\d.]+) 秒。可继续录制下一位置。$/,m=>`${m[1]==='保存'?'Saved':'Held in memory'} ${m[2]} · ${m[3]} s. You can record the next location.`],
[/^已录制 ([\s\S]*)，([\d.]+) 秒，(请立即导出备份|音频保存在本浏览器)。$/,m=>`Recorded ${m[1]}, ${m[2]} s. ${m[3]==='请立即导出备份'?'Export a backup immediately.':'Audio is saved in this browser.'}`],
[/^已导入 (\d+) 条，跳过 (\d+) 条相同 ID 的记录。原有记录保留。$/,m=>`Imported ${m[1]} recordings; skipped ${m[2]} with duplicate IDs. Existing recordings were kept.`],
[/^事件时间分布 · 橙色 ≥ ([-\d.]+) dBFS，浅绿色 < 阈值 · 时间从左到右$/,m=>`Event timeline · orange ≥ ${m[1]} dBFS; pale green < threshold · time runs left to right`],
[/^(事件|安静) · (.+) dBFS$/,m=>`${m[1]==='事件'?'Event':'Quiet'} · ${m[2]} dBFS`],
[/^(事件|安静) ([\d.]+)s \/ (\d+)窗$/,m=>`${m[1]==='事件'?'Event':'Quiet'} ${m[2]} s / ${m[3]} windows`],
[/^短窗峰值 (.+) dBFS · 频段内最强 FFT 格点 ([\d.]+) Hz · 有效频段 ([\d.]+)–([\d.]+) Hz · 分辨率 ([\d.]+) Hz$/,m=>`Short-window maximum ${m[1]} dBFS · strongest FFT bin in band ${m[2]} Hz · effective band ${m[3]}–${m[4]} Hz · resolution ${m[5]} Hz`],
[/^每条分析 ([\d.]+) 秒。(?:当前指标最大差值 ([\d.]+) dB（数字录音中的相对差异）。)?$/,m=>`${m[1]} s analyzed per recording.${m[2]?` Largest difference for this metric: ${m[2]} dB (relative difference in digital recordings).`:''}`],
[/^片段太短，未纳入：([\s\S]*)$/,m=>`Too short; excluded: ${m[1]}`],
[/^音频保存在当前浏览器 IndexedDB，不会自动跨设备同步。(?: 当前站点约用 ([\d.]+) MB \/ 可用配额 ([\d.]+) MB。)?( 有未保存记录，请导出备份。|建议定期导出备份。)$/,m=>`Audio is stored in this browser’s IndexedDB and does not sync across devices.${m[1]?` This site uses about ${m[1]} MB / ${m[2]} MB quota.`:''} ${m[3].includes('未保存')?'Some recordings are unsaved. Export a backup.':'Export backups regularly.'}`],
[/^([\s\S]*) · (\d+) Hz · AGC (关|开|未知) \/ 降噪 (关|开|未知) \/ 回声消除 (关|开|未知)$/,m=>`${m[1]} · ${m[2]} Hz · AGC ${onOff(m[3])} / noise suppression ${onOff(m[4])} / echo cancellation ${onOff(m[5])}`],
[/^录音尚未保存到浏览器：([\s\S]*)。请立即导出备份，不要关闭页面。$/,m=>`Recording not yet saved to the browser: ${english(m[1])}. Export a backup immediately; do not close this page.`],
[/^(无法开启录音|删除失败|浏览器未能播放|计算未完成|备份生成失败|导入失败，未接受无效备份|持久存储申请未完成)：([\s\S]*)$/,m=>`${({'无法开启录音':'Unable to start recording','删除失败':'Deletion failed','浏览器未能播放':'Browser playback failed','计算未完成':'Calculation incomplete','备份生成失败':'Backup creation failed','导入失败，未接受无效备份':'Import failed; invalid backup rejected','持久存储申请未完成':'Persistent storage request incomplete'})[m[1]]}: ${english(m[2])}`],
[/^(通过|失败) · (.+) · ([-\d.]+)$/,m=>`${m[1]==='通过'?'PASS':'FAIL'} · ${english(m[2])} · ${m[3]}`]
];
function onOff(s){return ({关:'off',开:'on',未知:'unknown'})[s];}
function english(s){
 if(dictionary.has(s))return dictionary.get(s);
 if(s.startsWith('• '))return '• '+english(s.slice(2));
 if(s.includes('\n'))return s.split('\n').map(english).join('\n');
 for(const [re,fn] of rules){const match=s.match(re);if(match)return fn(match);}
 return s;
}
let mode='zh';try{const saved=localStorage.getItem('noisygeese-language');if(['bi','zh','en'].includes(saved))mode=saved;}catch{}
const originals=new WeakMap(),attributeOriginals=new WeakMap();
const ignored='script,style,textarea,#languageMode,option[data-no-i18n],[data-no-i18n],.record-title>span:first-child,.bar-label,.timeline-row>.timeline-meta:first-child';
function translated(source,en){
 const trimmed=source.trim(); if(!trimmed)return source; const clean=sourceAliases.get(trimmed)||trimmed;
 const e=en??english(clean); const text=mode==='zh'?clean:mode==='en'?e:e===clean?clean:`${clean} / ${e}`;
 return source.slice(0,source.indexOf(trimmed))+text+source.slice(source.indexOf(trimmed)+trimmed.length);
}
function applyText(node){
 if(node.parentElement?.closest(ignored))return;
 if(node.parentElement?.closest('[data-zh][data-en]'))return;
 const old=originals.get(node),current=node.data;
 const source=old&&current===old.rendered?old.source:current;
 const rendered=translated(source); originals.set(node,{source,rendered});if(current!==rendered)node.data=rendered;
}
function applyElement(el){
 if(el.closest(ignored))return;
 if(el.hasAttribute('data-zh')&&el.hasAttribute('data-en')){
  const next=translated(el.dataset.zh,el.dataset.en);if(el.textContent!==next)el.textContent=next;
 }
 let saved=attributeOriginals.get(el);if(!saved){saved={};attributeOriginals.set(el,saved);}
 for(const key of ['title','aria-label','placeholder','alt']){
  if(!el.hasAttribute(key))continue;const current=el.getAttribute(key),old=saved[key];
  const source=old&&current===old.rendered?old.source:current,rendered=translated(source);
  saved[key]={source,rendered};if(current!==rendered)el.setAttribute(key,rendered);
 }
}
function visit(root){
 if(root.nodeType===Node.TEXT_NODE){applyText(root);return;}
 if(root.nodeType!==Node.ELEMENT_NODE)return;
 applyElement(root);
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
 let node;while((node=walker.nextNode())){if(node.nodeType===Node.TEXT_NODE)applyText(node);else applyElement(node);}
}
let scheduled=false;const pending=new Set();
const observer=new MutationObserver(records=>{
 for(const record of records){if(record.type==='childList'){for(const n of record.addedNodes)pending.add(n);}else pending.add(record.target);}
 if(!scheduled){scheduled=true;queueMicrotask(flush);}
});
const observerOptions={subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder','alt','data-zh','data-en']};
function flush(){scheduled=false;observer.disconnect();for(const node of pending)if(node.isConnected)visit(node);pending.clear();observer.observe(document.body,observerOptions);}
function refresh(){observer.disconnect();pending.clear();visit(document.body);document.documentElement.lang=mode==='en'?'en':mode==='zh'?'zh-CN':'zh-CN';document.documentElement.dataset.language=mode;observer.observe(document.body,observerOptions);}
function setMode(next){if(!['bi','zh','en'].includes(next))return;mode=next;try{localStorage.setItem('noisygeese-language',mode);}catch{}const picker=document.getElementById('languageMode');if(picker)picker.value=mode;refresh();window.dispatchEvent(new CustomEvent('ng-language-change',{detail:{mode}}));}
window.ngT=translated;
window.ngLanguage={get mode(){return mode;},setMode,refresh,translate:translated};
function boot(){const picker=document.getElementById('languageMode');if(picker){picker.value=mode;picker.addEventListener('change',()=>setMode(picker.value));}refresh();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
