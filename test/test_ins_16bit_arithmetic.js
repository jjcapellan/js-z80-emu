const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_16bit_arithmetic');

const cpu = new z80();
const r8 = cpu.registers.regs8;
const i8 = r8.idx;
const r16 = cpu.registers.regs16;
const i16 = r16.idx;
const flags = cpu.registers.flags;
const fi = flags.idx;
const mem = cpu.memory;

test('add_HL_ss(ssIndex)', t => {
    let ssIndex = i16.BC;
    r16.set(ssIndex, 0x2324);
    r16.set(i16.HL, 0x1);
    
    instr.add_HL_ss(ssIndex); // ADD HL, ss
    let hl = r16.get(i16.HL);
    let f = r8.get(i8.F);
    t.is(hl, 0x2325);
    t.is(f, 0x20);

    ssIndex = i16.BC;
    r16.set(ssIndex, 0x6f24);
    r16.set(i16.HL, 0x1f32);
    instr.add_HL_ss(ssIndex); // ADD HL, ss
    hl = r16.get(i16.HL);
    f = r8.get(i8.F);
    t.is(hl, 0x8e56);
    t.is(f, 0x18);
});