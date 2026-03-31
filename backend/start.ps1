# LifeLedger - Backend Start Script
# Uso: .\start.ps1

$Host.UI.RawUI.WindowTitle = "LifeLedger - Backend"

function Write-Step($msg) { Write-Host "  >> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "  OK $msg" -ForegroundColor Green }
function Write-Fail($msg) { Write-Host "  ERRO $msg" -ForegroundColor Red }
function Write-Info($msg) { Write-Host "  .. $msg" -ForegroundColor DarkGray }

Write-Host ""
Write-Host "  =================================" -ForegroundColor Magenta
Write-Host "    LifeLedger - Spring Boot API   " -ForegroundColor White
Write-Host "  =================================" -ForegroundColor Magenta
Write-Host ""

# --- Verificar Java ---
Write-Step "Verificando Java..."
try {
    $javaOut = java -version 2>&1
    $javaLine = ($javaOut | Select-Object -First 1).ToString()
    Write-Ok "Java encontrado: $javaLine"
} catch {
    Write-Fail "Java nao encontrado. Instale o JDK 21+."
    Write-Host "  Download: https://adoptium.net/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# --- Detectar Maven (global tem prioridade sobre wrapper) ---
Write-Step "Detectando Maven..."

$mvnCmd = $null

# 1. Tentar mvn global (mais confiavel)
try {
    $mvnVer = mvn --version 2>&1 | Select-Object -First 1
    if ($LASTEXITCODE -eq 0 -or $mvnVer -match "Apache Maven") {
        $mvnCmd = "mvn"
        Write-Ok "Maven instalado globalmente: $mvnVer"
    }
} catch {}

# 2. Fallback: mvnw.cmd (wrapper)
if (-not $mvnCmd) {
    if (Test-Path ".\mvnw.cmd") {
        $mvnCmd = ".\mvnw.cmd"
        Write-Ok "Usando Maven Wrapper (mvnw.cmd)."
    }
}

# 3. Nenhum encontrado
if (-not $mvnCmd) {
    Write-Fail "Maven nao encontrado."
    Write-Host ""
    Write-Host "  Instale o Maven e adicione ao PATH:" -ForegroundColor Yellow
    Write-Host "  https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Ou via Scoop (sem precisar de admin):" -ForegroundColor DarkGray
    Write-Host "  irm get.scoop.sh | iex" -ForegroundColor DarkGray
    Write-Host "  scoop install maven" -ForegroundColor DarkGray
    Read-Host "Pressione Enter para sair"
    exit 1
}

# --- Verificar config.yml ---
Write-Step "Verificando config.yml..."
if (Test-Path "..\config.yml") {
    Write-Ok "config.yml encontrado na raiz do projeto."
} else {
    Write-Host "  AVISO: config.yml nao encontrado. Usando defaults do application.yml." -ForegroundColor Yellow
}

# --- Verificar PostgreSQL ---
Write-Step "Verificando PostgreSQL na porta 5432..."
$pg = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
if ($pg.TcpTestSucceeded) {
    Write-Ok "PostgreSQL respondendo em localhost:5432."
} else {
    Write-Host ""
    Write-Host "  AVISO: PostgreSQL nao detectado na porta 5432." -ForegroundColor Yellow
    Write-Host "  Verifique se o servico esta rodando." -ForegroundColor DarkGray
    Write-Host ""
    $resp = Read-Host "Continuar mesmo assim? (s/N)"
    if ($resp -ne "s" -and $resp -ne "S") { exit 1 }
}

# --- Iniciar ---
Write-Host ""
Write-Host "  ---------------------------------" -ForegroundColor DarkGray
Write-Host "  Iniciando Spring Boot..." -ForegroundColor White
Write-Host "  Comando: $mvnCmd spring-boot:run" -ForegroundColor DarkGray
Write-Host "  API: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "  ---------------------------------" -ForegroundColor DarkGray
Write-Host ""

& $mvnCmd spring-boot:run
