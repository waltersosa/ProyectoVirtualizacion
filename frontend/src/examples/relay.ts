export const exampleCode = `
// Código de ejemplo para el control de un Relay
#define RELAY_PIN 5  // Pin donde está conectado el relay

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
}

void loop() {
  digitalWrite(RELAY_PIN, HIGH);   // Enciende el relay
  delay(1000);                     // Espera 1 segundo
  digitalWrite(RELAY_PIN, LOW);    // Apaga el relay
  delay(1000);                     // Espera 1 segundo
}
`;
