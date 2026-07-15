export function computeRms(timeDomainData: Uint8Array): number {
  let sum = 0
  for (let i = 0; i < timeDomainData.length; i += 1) {
    const sample = (timeDomainData[i] - 128) / 128
    sum += sample * sample
  }
  return Math.sqrt(sum / timeDomainData.length)
}
