import { useCallback, useEffect, useRef, useState } from 'react'
import { computeRms } from './rms'

export type MicrophoneStatus = 'idle' | 'listening' | 'error'

export function useMicrophoneLevel() {
  const [status, setStatus] = useState<MicrophoneStatus>('idle')
  const [level, setLevel] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const onLevelRef = useRef<((rms: number) => void) | null>(null)

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    void audioContextRef.current?.close()
    audioContextRef.current = null
    setLevel(0)
  }, [])

  useEffect(() => () => stop(), [stop])

  const start = useCallback(
    async (onLevel?: (rms: number) => void) => {
      stop()
      onLevelRef.current = onLevel ?? null
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
          const rms = computeRms(data)
          setLevel(rms)
          onLevelRef.current?.(rms)
          rafRef.current = requestAnimationFrame(tick)
        }
        tick()
      } catch {
        stop()
        setStatus('error')
      }
    },
    [stop],
  )

  const reset = useCallback(() => {
    stop()
    setStatus('idle')
  }, [stop])

  return { status, level, start, stop, reset }
}
