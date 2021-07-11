const portsBuffer = new ArrayBuffer(1024 * 64); // 64 Kb
const ports = new Uint8Array(portsBuffer);

module.exports = ports;