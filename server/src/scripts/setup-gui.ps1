Add-Type -AssemblyName Microsoft.VisualBasic

$title = "Employee Management - MongoDB Atlas Setup"
$prompt = "Paste your MongoDB Atlas connection string below and click OK:`n`n(This will automatically configure server/.env and test the connection)"

$connectionString = [Microsoft.VisualBasic.Interaction]::InputBox($prompt, $title)

if ([string]::IsNullOrWhiteSpace($connectionString)) {
    Write-Host "No connection string entered. Operation cancelled." -ForegroundColor Yellow
    exit 0
}

# Run the Node setup script with the entered string
$scriptPath = Join-Path $PSScriptRoot "setup-db.js"
node $scriptPath "$connectionString"
