#!/bin/bash

# Crear directorio public si no existe
mkdir -p public/assets/connections/ESP32
mkdir -p public/assets/connections/ESP8266

# Copiar archivos de conexiones
cp -r src/assets/connections/ESP32/* public/assets/connections/ESP32/
cp -r src/assets/connections/ESP8266/* public/assets/connections/ESP8266/ 