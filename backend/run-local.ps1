# Run the backend locally using variables from backend/.env
# Usage (from backend folder):  powershell -ExecutionPolicy Bypass -File .\run-local.ps1
$ErrorActionPreference = 'Stop'

$envFile = Join-Path $PSScriptRoot '.env'
if (-not (Test-Path $envFile)) {
    Write-Error "backend/.env not found. Copy .env.example to .env and fill in the values."
}

Get-Content $envFile -Encoding UTF8 | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#')) {
        $i = $line.IndexOf('=')
        if ($i -gt 0) {
            [Environment]::SetEnvironmentVariable($line.Substring(0, $i).Trim(), $line.Substring($i + 1).Trim(), 'Process')
        }
    }
}

# Use a JDK 17 from ~/.jdks when JAVA_HOME is not set
if (-not $env:JAVA_HOME) {
    $jdk = Get-ChildItem (Join-Path $HOME '.jdks') -Directory -Filter 'jdk-17*' -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($jdk) { $env:JAVA_HOME = $jdk.FullName }
}

& (Join-Path $PSScriptRoot 'gradlew.bat') bootRun
