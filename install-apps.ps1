$ErrorActionPreference = "Stop"
Set-Location d:\TacosPizza\apps

# Remove stuck temp folders if they exist
if (Test-Path "client-temp") { Remove-Item -Path "client-temp" -Recurse -Force }
if (Test-Path "admin-temp") { Remove-Item -Path "admin-temp" -Recurse -Force }
if (Test-Path "api-temp") { Remove-Item -Path "api-temp" -Recurse -Force }

Write-Host "Initializing Client..."
npx -y create-next-app@14 client-temp --typescript --tailwind --eslint --app --no-src-dir --import-alias="@/*" --use-npm
Copy-Item -Path "client-temp\*" -Destination "client" -Recurse -Force
Copy-Item -Path "client-temp\.*" -Destination "client" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "client-temp" -Recurse -Force

Write-Host "Initializing Admin..."
npx -y create-next-app@14 admin-temp --typescript --tailwind --eslint --app --no-src-dir --import-alias="@/*" --use-npm
Copy-Item -Path "admin-temp\*" -Destination "admin" -Recurse -Force
Copy-Item -Path "admin-temp\.*" -Destination "admin" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "admin-temp" -Recurse -Force

Write-Host "Initializing API..."
npx -y @nestjs/cli new api-temp --package-manager npm --strict --skip-git --skip-install
Copy-Item -Path "api-temp\*" -Destination "api" -Recurse -Force
Copy-Item -Path "api-temp\.*" -Destination "api" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "api-temp" -Recurse -Force

Write-Host "Done initializing templates."
