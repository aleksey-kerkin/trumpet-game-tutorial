import { useCallback, useEffect, useRef, useState } from 'react'

export type SoundDetectorStatus = 'idle' | 'listening' | 'detected' | 'error'

interface UseSoundHoldDetectorOptions {
  holdMs?: number
  threshold?: number
}

export function useSoundHoldDetector({
  holdMs = 1000,
  threshold = 0.02,
}: UseSoundHoldDetectorOptions = {}) {
  const [status, setStatus] = useState<SoundDetectorStatus>('idle')
  const [level, setLevel] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const holdStartRef = useRef<number | null>(null)

  const stopListening = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    holdStartRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    void audioContextRef.current?.close()
    audioContextRef.current = null
    setLevel(0)
  }, [])

  useEffect(() => () => stopListening(), [stopListening])

  const startListening = useCallback(async () => {
    stopListening()
    setStatus('listening')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      const data = new Uint8Array(analyser.fftSize)

      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i += 1) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }
        const rms = Math.sqrt(sum / data.length)
        setLevel(Math.min(1, rms / (threshold * 3)))

        if (rms > threshold) {
          if (!holdStartRef.current) holdStartRef.current = performance.now()
          if (performance.now() - (holdStartRef.current ?? 0) >= holdMs) {
            stopListening()
            setStatus('detected')
            return
          }
        } else {
          holdStartRef.current = null
        }

        rafRef.current = requestAnimationFrame(tick)
      }

      tick()
    } catch {
      stopListening()
      setStatus('error')
    }
  }, [holdMs, stopListening, threshold])

  const reset = useCallback(() => {
    stopListening()
    setStatus('idle')
  }, [stopListening])

  return { status, level, startListening, stopListening, reset }
}
