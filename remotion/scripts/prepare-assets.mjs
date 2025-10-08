import fs from "fs"
import path from "path"

// Ensure output directories exist in project root public assets
const root = path.resolve(process.cwd(), "..")
const socialDir = path.join(root, "public", "assets", "social")
fs.mkdirSync(socialDir, { recursive: true })

console.log(`[prepare-assets] Ensured ${socialDir}`)
