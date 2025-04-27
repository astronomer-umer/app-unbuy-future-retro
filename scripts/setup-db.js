const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Check if .env file exists, if not create it
const envPath = path.join(process.cwd(), ".env")
if (!fs.existsSync(envPath)) {
  console.log("Creating .env file...")
  fs.writeFileSync(
    envPath,
    `DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
`,
  )
}

// Run Prisma migrations
console.log("Running Prisma migrations...")
try {
  execSync("npx prisma migrate dev --name init", { stdio: "inherit" })
} catch (error) {
  console.log("Creating initial migration...")
  execSync("npx prisma db push", { stdio: "inherit" })
}

// Generate Prisma client
console.log("Generating Prisma client...")
execSync("npx prisma generate", { stdio: "inherit" })

console.log("Database setup complete!")
