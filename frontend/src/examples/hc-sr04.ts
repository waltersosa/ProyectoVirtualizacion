export const exampleCode = `
// Código de ejemplo para el sensor de distancia HC-SR04
#define TRIG_PIN 12
#define ECHO_PIN 13

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  long duration, distance;
  
  // Envia un pulso de 10 microsegundos al trigger
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Lee la duración del eco
  duration = pulseIn(ECHO_PIN, HIGH);

  // Calcula la distancia
  distance = duration * 0.0344 / 2;

  Serial.print("Distancia: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(500);  // Espera medio segundo antes de la siguiente lectura
}
`;
