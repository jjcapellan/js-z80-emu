const memoryBuffer = new ArrayBuffer(1024 * 64); // 64 Kb of memory
const memory = new Uint8Array(memoryBuffer);

module.exports = memory;