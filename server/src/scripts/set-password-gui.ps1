Add-Type -AssemblyName Microsoft.VisualBasic

$title = "MongoDB Atlas Password Setup"
$prompt = "Enter or paste the password for MongoDB user 'enjamuripranavi965_db_user':`n`n(This will automatically URL-encode special characters, update server/.env, and test the connection)"

$password = [Microsoft.VisualBasic.Interaction]::InputBox($prompt, $title)

if ([string]::IsNullOrWhiteSpace($password)) {
    Write-Host "No password entered. Cancelled." -ForegroundColor Yellow
    exit 0
}

$scriptPath = Join-Path $PSScriptRoot "set-password.js"
node $scriptPath "$password"
