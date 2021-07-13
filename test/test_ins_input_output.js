const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_input_output');

const cpu = new z80();
const r8 = cpu.registers.regs8;
const i8 = r8.idx;
const ports = cpu.ports;
const r16 = cpu.registers.regs16;
const i16 = r16.idx;
const flags = cpu.registers.flags;
const mem = cpu.memory;

test('in_A_n(n)', t => {
    r8.set(i8.A, 0x33);
    const n = 0x12;
    ports[0x33*256 + n] = 0x62;
    instr.in_A_n(n); // IN A, (n)
    const a = r8.get(i8.A);
    t.is(a, 0x62);
});

test('in_r_C(rIndex)', t => {
    const rIndex = i8.D;
    r8.set(i8.C, 0x33);
    r8.set(i8.B, 0x12);
    ports[0x1233] = 0x62;
    instr.in_r_C(rIndex); // IN r, (C)
    const d = r8.get(i8.D);
    t.is(d, 0x62);
});

test('out_n_A(n)', t => {
    r8.set(i8.A, 0x33);
    const n = 0x12;
    instr.out_n_A(n); // OUT A, (n)
    const p = ports[0x33*256 + n];
    t.is(p, 0x33);
});

test('out_C_r(rIndex)', t => {
    const rIndex = i8.D;
    r8.set(i8.C, 0x33);
    r8.set(i8.B, 0x12);
    r8.set(rIndex, 0x62);
    instr.out_C_r(rIndex); // OUT (C), r
    const p = ports[0x1233];
    t.is(p, 0x62);
});