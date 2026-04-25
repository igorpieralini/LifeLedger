# LifeLedger - Setup do Banco de Dados
# Execute este script no outro PC para criar o banco e importar os dados

Write-Host ""
Write-Host "  LifeLedger - Setup do Banco" -ForegroundColor Cyan
Write-Host ""

$pgBin = "C:\Program Files\PostgreSQL\18\bin"

if (-not (Test-Path "$pgBin\psql.exe")) {
    # Tentar encontrar automaticamente
    $pgDir = Get-ChildItem "C:\Program Files\PostgreSQL" -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
    if ($pgDir) {
        $pgBin = "$($pgDir.FullName)\bin"
    } else {
        Write-Host "PostgreSQL nao encontrado! Instale primeiro." -ForegroundColor Red
        exit 1
    }
}

$env:PGPASSWORD = 'postgres'

Write-Host "[1/3] Criando banco lifeledger..." -ForegroundColor Yellow
& "$pgBin\psql.exe" -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'lifeledger'" | ForEach-Object { $_.Trim() } | Where-Object { $_ -eq '1' } | ForEach-Object {
    Write-Host "  Banco ja existe, pulando criacao." -ForegroundColor Gray
}

$exists = & "$pgBin\psql.exe" -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'lifeledger'" 2>$null
if ($exists -and $exists.Trim() -eq '1') {
    Write-Host "  Banco ja existe." -ForegroundColor Gray
} else {
    & "$pgBin\psql.exe" -U postgres -c "CREATE DATABASE lifeledger" 2>&1
    Write-Host "  Banco criado!" -ForegroundColor Green
}

Write-Host "[2/3] Aplicando migrations via Spring Boot (Flyway)..." -ForegroundColor Yellow
Write-Host "  As migrations serao aplicadas automaticamente ao iniciar o backend." -ForegroundColor Gray

Write-Host "[3/3] Importando dados..." -ForegroundColor Yellow
$seedFile = Join-Path $PSScriptRoot "src\main\resources\db\seed\data.sql"

if (Test-Path $seedFile) {
    & "$pgBin\psql.exe" -U postgres -d lifeledger -f $seedFile 2>&1 | Out-Null
    Write-Host "  Dados importados!" -ForegroundColor Green
} else {
    Write-Host "  Arquivo de seed nao encontrado: $seedFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Pronto! Agora execute .\start.ps1 para iniciar o backend." -ForegroundColor Cyan
Write-Host ""
