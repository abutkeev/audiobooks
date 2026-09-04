let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;

export const getAudioCtx = () => audioCtx;
export const getGainNode = () => gainNode;

/**
 * Built lazily: on iOS an AudioContext is suspended with the screen,
 * see docs/ai/frontend/player.md, "Web Audio API".
 */
export const ensureGainGraph = (audio: HTMLAudioElement): GainNode => {
  if (gainNode) return gainNode;

  audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audio);
  gainNode = audioCtx.createGain();
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  return gainNode;
};
