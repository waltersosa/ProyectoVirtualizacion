const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  // Crear directorio destino si no existe
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Leer contenido del directorio
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Directorios a crear
const dirs = [
  'public/assets/connections/ESP32',
  'public/assets/connections/ESP8266'
];

// Crear directorios
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copiar archivos
const srcDirs = [
  'src/assets/connections/ESP32',
  'src/assets/connections/ESP8266'
];

srcDirs.forEach(srcDir => {
  if (fs.existsSync(srcDir)) {
    const destDir = srcDir.replace('src/', 'public/');
    copyDir(srcDir, destDir);
  }
});

console.log('Setup completed successfully!'); 