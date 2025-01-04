export const exampleCode = `
// Código de ejemplo para el sensor MPU6050 (Acelerómetro y giroscopio)
#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  
  mpu.initialize();
  
  if (!mpu.testConnection()) {
    Serial.println("Error de conexión con el MPU6050");
    while (1);
  }
}

void loop() {
  int16_t ax, ay, az;
  int16_t gx, gy, gz;
  
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  
  // Muestra los valores de aceleración y giroscopio
  Serial.print("Acelerómetro X: ");
  Serial.print(ax);
  Serial.print(" Y: ");
  Serial.print(ay);
  Serial.print(" Z: ");
  Serial.println(az);
  
  Serial.print("Giroscopio X: ");
  Serial.print(gx);
  Serial.print(" Y: ");
  Serial.print(gy);
  Serial.print(" Z: ");
  Serial.println(gz);
  
  delay(1000);  // Espera 1 segundo antes de la siguiente lectura
}
`;
