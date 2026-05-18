import type { VoiceLine } from './types';

/**
 * Styles not supported by Dragon HD Omni voices → fall back to closest supported.
 * Source: https://learn.microsoft.com/azure/ai-services/speech-service/speech-synthesis-markup-voice
 */
export const STYLE_FALLBACK: Record<string, string> = {
  concerned:    'serious',
  disappointed: 'serious',
  suspicious:   'serious',
  defiant:      'serious',
  commanding:   'confident',
  urgent:       'determined',
  reflective:   'calm',
  frustrated:   'serious',
  proud:        'confident',
};

/** Strip leading [tag] prefix from display text, e.g. "[calm] Welcome..." → "Welcome..." */
export function stripTag(text: string): string {
  return text.replace(/^\[.*?\]\s*/, '');
}

/** Resolve style with fallback chain. */
export function resolveStyle(style: string): string {
  return STYLE_FALLBACK[style] ?? style;
}

/**
 * Build a single-line SSML string for Azure Speech TTS.
 * Uses Dragon HD Omni parameters for more expressive output.
 */
export function buildLineSSML(line: VoiceLine, voiceName: string): string {
  const style = resolveStyle(line.style);
  const text   = stripTag(line.text);

  return `<speak version="1.0"
       xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts"
       xml:lang="en-US">
  <voice name="${voiceName}"
         parameters="temperature=0.78;top_p=0.8;top_k=30;cfg_scale=1.15">
    <mstts:express-as style="${style}" styledegree="${line.styleDegree}">
      ${text}
    </mstts:express-as>
  </voice>
</speak>`;
}
