# DocHandler Installation Script for Windows
Write-Host "Installing DocHandler..."

# Create installation directory
$installDir = "$env:LOCALAPPDATA\DocHandler"
New-Item -ItemType Directory -Force -Path $installDir
New-Item -ItemType Directory -Force -Path "$installDir\data\vectors"
New-Item -ItemType Directory -Force -Path "$installDir\data\db"

# Copy application files
Copy-Item -Path "dist\*" -Destination $installDir -Recurse -Force
Copy-Item -Path ".env.example" -Destination "$installDir\.env"

# Create shortcut
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\DocHandler.lnk")
$Shortcut.TargetPath = "$installDir\dochandler.exe"
$Shortcut.Save()

# Add to PATH
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$installDir", "User")
}

Write-Host "Installation complete! You can now run DocHandler from the desktop shortcut or by running 'dochandler' in PowerShell."