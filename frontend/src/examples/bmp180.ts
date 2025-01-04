export const exampleCode = `
// Código de ejemplo para el sensor BMP180
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP085_U.h>

// Crea una instancia del sensor BMP180
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);

void setup() {
  Serial.begin(9600);
  // Inicializa el sensor BMP180
  if (!bmp.begin()) {
    Serial.println("Could not find a valid BMP180 sensor!");
    while (1);  // Detiene la ejecución si no se encuentra el sensor
  }
}

void loop() {
  // Crea un objeto para almacenar los eventos de sensor
  sensors_event_t event;
  // Obtiene los datos del sensor (presión)
  bmp.getEvent(&event);

  // Si el sensor devuelve un valor de presión
  if (event.pressure) {
    // Muestra la presión en la consola serial
    Serial.print("Pressure: ");
    Serial.print(event.pressure);
    Serial.println(" hPa");
  }

  // Espera 2 segundos antes de la siguiente lectura
  delay(2000);
}
`;
