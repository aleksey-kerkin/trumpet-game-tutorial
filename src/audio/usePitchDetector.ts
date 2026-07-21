import { PitchDetector } from 'pitchy'
import { useCallback, useEffect, useRef, useState } from 'react'
import { centsOffTarget, foldToNearestOctave, medianFrequency } from './pitch'

const FFT_SIZE = 2048
const CLARITY_MIN = 0.75
const SMOOTHING_WINDOW = 5

export type PitchDetectorStatus = 'idle' | 'listening' | 'error'

export interface PitchReading {
  frequency: number
  clarity: number
  cents: number
}

export function usePitchDetector(targetHz: number) {
  const [status, setStatus] = useState<PitchDetectorStatus>('idle')
  const [reading, setReading] = useState<PitchReading>({
    frequency: 0,
    clarity: 0,
    cents: Number.POSITIVE_INFINITY,
  })

  const targetRef = useRef(targetHz)
  targetRef.current = targetHz

  const detectorRef = useRef(PitchDetector.forFloat32Array(FFT_SIZE))
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const bufferRef = useRef(new Float32Array(FFT_SIZE))
  const historyRef = useRef<number[]>([])

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    void audioContextRef.current?.close()
    audioContextRef.current = null
    historyRef.current = []
    setReading({ frequency: 0, clarity: 0, cents: Number.POSITIVE_INFINITY })
    setStatus('idle')
  }, [])

  useEffect(() => () => stop(), [stop])

  const start = useCallback(async () => {
    stop()
    setStatus('listening')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = FFT_SIZE
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      const detector = detectorRef.current
      detector.clarityThreshold = 0.75
      detector.minVolumeDecibels = -50

      const tick = () => {
        analyser.getFloatTimeDomainData(bufferRef.current)
        const [pitch, clarity] = detector.findPitch(bufferRef.current, audioContext.sampleRate)
        const target = targetRef.current

        if (pitch > 0 && clarity >= CLARITY_MIN) {
          historyRef.current.push(foldToNearestOctave(pitch, target))
          if (historyRef.current.length > SMOOTHING_WINDOW) {
            historyRef.current.shift()
          }
        }

        const frequency = medianFrequency(historyRef.current)
        const cents = centsOffTarget(frequency, target)
        setReading({ frequency, clarity, cents })
        rafRef.current = requestAnimationFrame(tick)
      }

      tick()
    } catch {
      stop()
      setStatus('error')
    }
  }, [stop])

  const reset = useCallback(() => {
    stop()
  }, [stop])

  return { status, reading, start, stop, reset }
}
