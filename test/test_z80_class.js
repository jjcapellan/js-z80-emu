const test = require('ava');
const z80 = require('../src/z80_cpu');

const cpu = new z80();
const r16 = cpu.registers.regs16;
const i16 = r16.idx;
const r8 = cpu.registers.regs8;
const i8 = r8.idx;
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

test('Decoder using Z80.step()', t => {
    let src = new Uint8Array();
    src = Uint8Array.of(0x6, 0x12, 0x11, 0x23, 0x1c, 0x12);
    const pos = 0;
    cpu.load(src, pos);
    r8.set(i8.A, 0x32);
    // Loaded in memory
    // LD B, 0x12
    // LD DE, 0x1c23
    // LD (DE), A

    cpu.step();
    cpu.step();
    cpu.step();

    
    const b = r8.get(i8.B);
    const de = r16.get(i16.DE);
    t.is(b, 0x12);
    t.is(de, 0x1c23);
    t.is(mem[0x1c23], 0x32);
});