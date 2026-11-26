$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$FrontendDir = Join-Path $Root "frontend"
$EnvPath = Join-Path $Root ".env"
$TunnelLog = Join-Path $Root ".cloudflared.log"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Telegram Mini App & Bot Launcher" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Start frontend preview server on port 3000
Write-Host "[1/3] Starting frontend preview on http://localhost:3000 ..." -ForegroundColor Yellow
$frontendProc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$FrontendDir`" && npx vite preview --host --port 3000" -PassThru -WindowStyle Minimized

Start-Sleep -Seconds 2

# 2. Start Cloudflare Quick Tunnel and capture HTTPS URL
if (Test-Path $TunnelLog) { Remove-Item $TunnelLog -Force }
Write-Host "[2/3] Creating HTTPS tunnel (trycloudflare.com) ..." -ForegroundColor Yellow
$tunnelProc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npx --yes cloudflared tunnel --url http://localhost:3000 > `"$TunnelLog`" 2>&1" -PassThru -WindowStyle Minimized

$MiniAppUrl = $null
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  if (Test-Path $TunnelLog) {
    $logText = Get-Content $TunnelLog -Raw -ErrorAction SilentlyContinue
    if ($logText -match '(https://[a-zA-Z0-9-]+\.trycloudflare\.com)') {
      $MiniAppUrl = $matches[1]
      break
    }
  }
}

if (-not $MiniAppUrl) {
  Write-Host "ERROR: Could not obtain HTTPS tunnel URL. Check $TunnelLog" -ForegroundColor Red
  exit 1
}

Write-Host "HTTPS Mini App URL: $MiniAppUrl" -ForegroundColor Green

# 3. Update MINI_APP_URL in .env
if (Test-Path $EnvPath) {
  $envContent = Get-Content $EnvPath -Raw
  if ($envContent -match '(?m)^MINI_APP_URL=.*$') {
    $envContent = $envContent -replace '(?m)^MINI_APP_URL=.*$', "MINI_APP_URL=$MiniAppUrl"
  } else {
    $envContent = $envContent.TrimEnd() + "`r`nMINI_APP_URL=$MiniAppUrl`r`n"
  }
  Set-Content -Path $EnvPath -Value $envContent -Encoding UTF8
}

# 4. Run Telegram bot in foreground (Ctrl+C stops everything)
Write-Host "[3/3] Starting Telegram Bot (@ReferalPeople_bot) ..." -ForegroundColor Yellow
try {
  Push-Location $Root
  node tools/telegram_product_bot.js
} finally {
  Pop-Location
  if ($tunnelProc -and !$tunnelProc.HasExited) { Stop-Process -Id $tunnelProc.Id -Force -ErrorAction SilentlyContinue }
  if ($frontendProc -and !$frontendProc.HasExited) { Stop-Process -Id $frontendProc.Id -Force -ErrorAction SilentlyContinue }
}
