# LifeLedger - Frontend Start Script
# Uso: .\start.ps1

$Host.UI.RawUI.WindowTitle = "LifeLedger - Frontend"

function Write-Step($msg) { Write-Host "  >> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "  OK $msg" -ForegroundColor Green }
function Write-Fail($msg) { Write-Host "  ERRO $msg" -ForegroundColor Red }
function Write-Info($msg) { Write-Host "  .. $msg" -ForegroundColor DarkGray }

Write-Host ""
Write-Host "  =================================" -ForegroundColor Magenta
Write-Host "    LifeLedger - Angular Frontend  " -ForegroundColor White
Write-Host "  =================================" -ForegroundColor Magenta
Write-Host ""

# --- Verificar Node.js ---
Write-Step "Verificando Node.js..."
try {
    $nodeVer = node --version 2>&1
    Write-Ok "Node.js encontrado: $nodeVer"
} catch {
    Write-Fail "Node.js nao encontrado. Instale a versao LTS."
    Write-Host "  Download: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# --- Verificar npm ---
Write-Step "Verificando npm..."
try {
    $npmVer = npm --version 2>&1
    Write-Ok "npm encontrado: v$npmVer"
} catch {
    Write-Fail "npm nao encontrado."
    Read-Host "Pressione Enter para sair"
    exit 1
}

# --- Verificar package.json ---
if (-Not (Test-Path ".\package.json")) {
    Write-Fail "package.json nao encontrado. Execute dentro da pasta frontend."
    Read-Host "Pressione Enter para sair"
    exit 1
}

# --- Instalar dependencias ---
if (-Not (Test-Path ".\node_modules")) {
    Write-Step "node_modules ausente. Instalando dependencias..."
    Write-Host ""
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Fail "Erro ao instalar dependencias."
        Read-Host "Pressione Enter para sair"
        exit 1
    }
    Write-Ok "Dependencias instaladas."
} else {
    Write-Ok "node_modules ja existe. Pulando instalacao."
    Write-Info "Para reinstalar: delete node_modules e rode novamente."
}

# --- Verificar backend ---
Write-Step "Verificando backend na porta 8080..."
$be = Test-NetConnection -ComputerName localhost -Port 8080 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
if ($be.TcpTestSucceeded) {
    Write-Ok "Backend detectado em localhost:8080."
} else {
    Write-Host "  AVISO: Backend nao detectado. Inicie o backend antes para funcionalidade completa." -ForegroundColor Yellow
    Write-Host "  Execute em outro terminal: cd ..\backend" -ForegroundColor DarkGray
    Write-Host "                            .\start.ps1" -ForegroundColor DarkGray
    Write-Host ""
}

# --- Iniciar ---
Write-Host ""
Write-Host "  ---------------------------------" -ForegroundColor DarkGray
Write-Host "  Iniciando Angular..." -ForegroundColor White
Write-Host "  App: http://localhost:4200" -ForegroundColor Cyan
Write-Host "  Proxy /api -> localhost:8080" -ForegroundColor DarkGray
Write-Host "  ---------------------------------" -ForegroundColor DarkGray
Write-Host ""

npm start
