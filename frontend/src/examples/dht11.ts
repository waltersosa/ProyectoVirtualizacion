export const exampleCode = `
// Código de ejemplo para el sensor DHT11
#include <DHT.h>

// Define el pin de conexión del sensor DHT11
#define DHTPIN 4     // Pin GPIO donde está conectado el DHT11
#define DHTTYPE DHT11   // Tipo de sensor (puede ser DHT22 o DHT11)

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  // Lee la temperatura y la humedad
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Verifica si las lecturas son válidas
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Fallo al leer del sensor DHT");
    return;
  }

  // Muestra los datos de temperatura y humedad
  Serial.print("Humedad: ");
  Serial.print(humidity);
  Serial.print(" %\t");
  Serial.print("Temperatura: ");
  Serial.print(temperature);
  Serial.println(" °C");

  delay(2000);  // Espera 2 segundos antes de la siguiente lectura
}
`;
