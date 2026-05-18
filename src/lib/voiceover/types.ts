/** One spoken line in a voiceover sequence. */
export interface VoiceLine {
  /** Unique slug — used as the audio filename: {id}.mp3 */
  id: string;
  /** Display text shown as subtitle (may include [tag] prefix — stripped for display). */
  text: string;
  /** mstts:express-as style. Falls back via STYLE_FALLBACK if unsupported. */
  style: string;
  styleDegree: number;
  /** Milliseconds to wait after this line ends before playing the next. */
  pauseAfterMs: number;
  /** If true, render subtitle with gold emphasis treatment. */
  emphasis?: boolean;
}

export interface VoiceoverScript {
  /** Scene / character identifier — used as the audio subdirectory. */
  sceneId: string;
  /** localStorage key used to guard first-play auto-trigger. */
  storageKey: string;
  lines: VoiceLine[];
}
