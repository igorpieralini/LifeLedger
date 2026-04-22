Write-Host "`n  LifeLedger - Frontend`n" -ForegroundColor Cyan
Set-Location $PSScriptRoot
if (-not (Test-Path node_modules)) {
    Write-Host "  Instalando dependencias..." -ForegroundColor Yellow
    npm install
}
npx ng serve
