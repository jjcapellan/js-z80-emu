const test = require('ava');
const z80 = require('../src/z80_cpu');

const cpu = new z80();
const mem = cpu.memory;

test('z80.load(src, pos)', t => {
    let src = new Uint8Array();
    src = Uint8Array.of(0x16, 0x24, 0xff);
    const pos = 0x1002;
    cpu.load(src, pos);
    t.is(mem[0x1002], 0x16, `Result: ${mem[0x1002].toString(16)} Expected: 0x16`);
    t.is(mem[0x1003], 0x24, `Result: ${mem[0x1003].toString(16)} Expected: 0x24`);
    t.is(mem[0x1004], 0xff, `Result: ${mem[0x1004].toString(16)} Expected: 0xff`);
});