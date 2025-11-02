# Script para generar iconos desde tu logo
# Ejecuta esto después de añadir tu logo.png en assets/images/

# NOTA: Necesitarás instalar imagemagick primero
# Windows: choco install imagemagick
# Mac: brew install imagemagick

$sourceImage = "assets/images/logo.png"

# Verificar si el logo existe
if (-Not (Test-Path $sourceImage)) {
    Write-Host "❌ Error: No se encuentra logo.png en assets/images/" -ForegroundColor Red
    Write-Host "📁 Por favor, añade tu logo primero siguiendo: docs/COMO_ANADIR_LOGO.md" -ForegroundColor Yellow
    exit 1
}

Write-Host "🎨 Generando iconos desde $sourceImage..." -ForegroundColor Cyan

# Crear directorio si no existe
New-Item -ItemType Directory -Force -Path "assets/images" | Out-Null

# Verificar si imagemagick está instalado
try {
    magick -version | Out-Null
} catch {
    Write-Host "❌ ImageMagick no está instalado" -ForegroundColor Red
    Write-Host "Instálalo con: choco install imagemagick" -ForegroundColor Yellow
    Write-Host "O usa la herramienta online: https://www.favicon-generator.org/" -ForegroundColor Cyan
    exit 1
}

# Generar icon.png (1024x1024)
Write-Host "📱 Generando icon.png..." -ForegroundColor Green
magick convert $sourceImage -resize 1024x1024 assets/images/icon.png

# Generar splash.png (2048x2048)
Write-Host "🚀 Generando splash.png..." -ForegroundColor Green
magick convert $sourceImage -resize 2048x2048 assets/images/splash.png

# Generar splash-icon.png (200x200)
Write-Host "💫 Generando splash-icon.png..." -ForegroundColor Green
magick convert $sourceImage -resize 200x200 assets/images/splash-icon.png

# Generar favicon.png (48x48)
Write-Host "🌐 Generando favicon.png..." -ForegroundColor Green
magick convert $sourceImage -resize 48x48 assets/images/favicon.png

# Generar iconos para Android
Write-Host "🤖 Generando iconos para Android..." -ForegroundColor Green
magick convert $sourceImage -resize 1024x1024 assets/images/android-icon-foreground.png
magick convert $sourceImage -resize 1024x1024 -colorspace Gray assets/images/android-icon-monochrome.png

# Crear background para Android (color sólido)
magick convert -size 1024x1024 xc:"#0a84ff" assets/images/android-icon-background.png

Write-Host "✅ ¡Iconos generados exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Archivos creados:" -ForegroundColor Cyan
Get-ChildItem "assets/images/*.png" | ForEach-Object { Write-Host "  ✓ $($_.Name)" -ForegroundColor White }
Write-Host ""
Write-Host "🚀 Ahora puedes ejecutar: npm start -- --clear" -ForegroundColor Yellow
