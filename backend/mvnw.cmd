@echo off
setlocal enabledelayedexpansion

set MAVEN_VERSION=3.9.9
set MAVEN_DIR=%~dp0.mvn\wrapper\apache-maven-%MAVEN_VERSION%
set MAVEN_CMD=%MAVEN_DIR%\bin\mvn.cmd
set MAVEN_ZIP=%~dp0.mvn\wrapper\apache-maven-%MAVEN_VERSION%-bin.zip
set MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip

if exist "%MAVEN_CMD%" goto runMaven

echo [mvnw] Maven %MAVEN_VERSION% nao encontrado localmente. Baixando...
if not exist "%~dp0.mvn\wrapper\" mkdir "%~dp0.mvn\wrapper\"

powershell -NoProfile -Command "Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'"
if not exist "%MAVEN_ZIP%" (
    echo [mvnw] ERRO: Falha ao baixar Maven. Verifique sua conexao com a internet.
    exit /b 1
)

powershell -NoProfile -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%~dp0.mvn\wrapper\' -Force"
del "%MAVEN_ZIP%" 2>nul

if not exist "%MAVEN_CMD%" (
    echo [mvnw] ERRO: Extracao falhou.
    exit /b 1
)

echo [mvnw] Maven %MAVEN_VERSION% pronto.

:runMaven
"%MAVEN_CMD%" %*
exit /b %ERRORLEVEL%
