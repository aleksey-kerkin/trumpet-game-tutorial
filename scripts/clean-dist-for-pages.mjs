import { existsSync } from 'node:fs'
import { unlink } from 'node:fs/promises'

const generatedArtifacts = ['dist/wrangler.json', 'dist/.assetsignore']

for (const file of generatedArtifacts) {
  if (existsSync(file)) {
    await unlink(file)
  }
}
