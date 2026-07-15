const CLICK_FREQ = 880
const CLICK_DURATION = 0.04

export class MetronomeEngine {
  private audioContext: AudioContext | null = null
  private nextBeatTime = 0
  private timerId: ReturnType<typeof setTimeout> | null = null
  private beatIndex = 0
  private running = false
  private bpm: number
  private onBeat: (beatIndex: number) => void

  constructor(bpm: number, onBeat: (beatIndex: number) => void) {
    this.bpm = bpm
    this.onBeat = onBeat
  }

  async start() {
    this.stop()
    this.audioContext = new AudioContext()
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
    this.beatIndex = 0
    this.nextBeatTime = this.audioContext.currentTime + 0.1
    this.running = true
    this.schedule()
  }

  stop() {
    this.running = false
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = null
    void this.audioContext?.close()
    this.audioContext = null
  }

  private schedule() {
    if (!this.running || !this.audioContext) return

    const secondsPerBeat = 60 / this.bpm
    while (this.nextBeatTime < this.audioContext.currentTime + 0.15) {
      this.playClick(this.nextBeatTime)
      const currentBeat = this.beatIndex
      const delayMs = Math.max(0, (this.nextBeatTime - this.audioContext.currentTime) * 1000)
      setTimeout(() => {
        if (this.running) this.onBeat(currentBeat)
      }, delayMs)
      this.beatIndex += 1
      this.nextBeatTime += secondsPerBeat
    }

    this.timerId = setTimeout(() => this.schedule(), 25)
  }

  private playClick(time: number) {
    const ctx = this.audioContext
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = CLICK_FREQ
    gain.gain.setValueAtTime(0.2, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + CLICK_DURATION)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(time)
    osc.stop(time + CLICK_DURATION)
  }
}
