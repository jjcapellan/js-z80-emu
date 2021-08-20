const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_8bit_arithmetic');

const cpu = new z80();
const r8 = cpu.registers.regs8;
const r16 = cpu.registers.regs16;
const i8 = r8.idx;
const i16 = r16.idx;
const flags = cpu.registers.flags;
const mem = cpu.memory;

test('add_A_r(rIndex)', t => {
    r8.set(i8.D, 0x1c);
    r8.set(i8.A, 0x1);
    const rIndex = i8.D;
    instr.add_A_r(rIndex); // ADD A, D
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(a, 0x1d);
    t.is(f, 0x8);
});

test('add_A_n(n)', t => {
    r8.set(i8.A, 0x1);
    const n = 0x1c;
    instr.add_A_n(n); // ADD A, n
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(a, 0x1d);
    t.is(f, 0x8);
});

test('add_A_ptrXXplusd()', t => {
    r8.set(i8.A, 0x1);
    r16.set(i16.HL, 0x1212);
    mem[0x1212] = 0x11;
    instr.add_A_ptrXXplusd(i16.HL, 0, 7); // ADD A, (HL)
    const a = r8.get(i8.A);instr.add_A_ptrXXplusd
    const f = r8.get(i8.F);
    t.is(f, 0, `Expected: 0, Flags: ${f.toString(2)}`);
    t.is(a, 0x12);    
});

test('ADD A, (IX + d)', t => {
    r8.set(i8.A, 0x1);
    r16.set(i16.IX, 0x4);
    const d = 0x1;
    mem[0x5] = 0x25;
    instr.add_A_ptrXXplusd(i16.IX, d, 19);
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x20);
    t.is(a, 0x26);
});

test('adc_A_r(rIndex)', t => {
    r8.set(i8.A, 0x1);
    r8.set(i8.B, 0x4);
    const rIndex = i8.B;
    flags.set(flags.idx.C, true);
    instr.adc_A_r(rIndex); // ADC A, B
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0);
    t.is(a, 0x6);
});

test('adc_A_n(n)', t => {
    r8.set(i8.A, 0x1);
    const n = 0x1c;
    flags.set(flags.idx.C, true);
    instr.adc_A_n(n); // ADC A, n
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x8);
    t.is(a, 0x1e);
});

test('ADC A, (HL)', t => {
    r8.set(i8.A, 0x1);
    r16.set(i16.HL, 0x1212);
    mem[0x1212] = 0x11;
    flags.set(flags.idx.C, true);
    instr.adc_A_ptrXXplusd(i16.HL, 0, 7);
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x0);
    t.is(a, 0x13);
});

test('ADC A, (IX + d)', t => {
    r8.set(i8.A, 0x1);
    r16.set(i16.IX,0x4);
    const d = 0x1;
    mem[0x5] = 0x25;
    flags.set(flags.idx.C, true);
    instr.adc_A_ptrXXplusd(i16.IX, d, 19);
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x20);
    t.is(a, 0x27);
});

test('sub_A_r(rIndex)', t => {
    r8.set(i8.D, 0x1);
    r8.set(i8.A, 0x1c);
    const rIndex = i8.D;
    instr.sub_A_r(rIndex); // SUB A, D
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x0a);
    t.is(a, 0x1b);
});

test('sub_A_n(n)', t => {
    r8.set(i8.A, 0x1c);
    const n = 0x1;
    instr.sub_A_n(n); // SUB A, n
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x0a);
    t.is(a, 0x1b);
});

test('SUB A, (HL)', t => {
    r8.set(i8.A, 0x12);
    r16.set(i16.HL, 0x1212);
    mem[0x1212] = 0x1;
    instr.sub_A_ptrXXplusd(i16.HL, 0);
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x02);
    t.is(a, 0x11);
});

test('SUB A, (IX + d)', t => {
    r8.set(i8.A, 0x12);
    r16.set(i16.IX,0x4);
    const d = 0x1;
    mem[0x5] = 0x1;
    instr.sub_A_ptrXXplusd(i16.IX, d);
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x02);
    t.is(a, 0x11);
});

test('sbc_A_r(rIndex)', t => {
    r8.set(i8.A, 0x1);
    r8.set(i8.B, 0x4);
    const rIndex = i8.B;
    flags.set(flags.idx.C, true);
    instr.sbc_A_r(rIndex); // SUBC A, B
    const a = r8.get(i8.A);
    t.is(a, 256 + (0x1 - (0x4 + 0x1))); // +256 convert negative signed int to unsigned
});

test('sbc_A_n(n)', t => {
    r8.set(i8.A, 0x1);
    const n = 0x1c;
    flags.set(flags.idx.C, true);
    instr.sbc_A_n(n); // SUBC A, n
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(a, 256 + (0x1 - (0x1c + 0x1)));
});

test('SUBC A, (HL)', t => {
    r8.set(i8.A, 0x1);
    r16.set(i16.HL, 0x1212);
    mem[0x1212] = 0x11;
    flags.set(flags.idx.C, true);
    instr.sbc_A_ptrXXplusd(i16.HL, 0, 7);
    const a = r8.get(i8.A);
    t.is(a, 256 + (0x1 - (0x11 + 0x1)));
});

test('SUBC A, (IX + d)', t => {
    r8.set(i8.A, 0x1);
    r16.set(i16.IX,0x4);
    const d = 0x1;
    mem[0x5] = 0x25;
    flags.set(flags.idx.C, true);
    instr.sbc_A_ptrXXplusd(i16.IX, d, 19);
    const a = r8.get(i8.A);
    t.is(a, 256 + (0x1 - (0x25 + 0x1)));
});

test('and_r(rIndex)', t => {
    const rIndex = i8.D;
    r8.set(i8.A, 0x36);    
    r8.set(rIndex, 0x25);    
    instr.and_r(rIndex); // AND D
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x34, `Flags: ${f}, Expected: 0x34`);
    t.is(a, 0x36 & 0x25);
});

test('and_n(n)', t => {
    const n = 0x1c;
    r8.set(i8.A, 0x36);    
    instr.and_n(n); // AND n
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x14, `Flags: ${f.toString(16)}, Expected: 0x14`);
    t.is(a, 0x36 & 0x1c);
});

test('AND (HL)', t => {
    r16.set(i16.HL, 0x1212);
    const hl = r16.get(i16.HL);
    cpu.memory[hl] = 0x2c;
    r8.set(i8.A, 0x36);    
    instr.and_ptrXXplusd(i16.HL, 0, 7);
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x34, `Flags: ${f.toString(16)}, Expected: 0x34`);
    t.is(a, 0x36 & 0x2c, `Result: ${a}, Expected: ${0x36 & 0x2c}`);
});

test('AND (IX + d)(d)', t => {
    const d = 0x42;
    r16.set(i16.IX,0x06);
    const ix = r16.get(i16.IX);
    cpu.memory[ix + d] = 0x6a;
    r8.set(i8.A, 0x36);    
    instr.and_ptrXXplusd(i16.IX, d, 19);
    const a = r8.get(i8.A);
    t.is(a, 0x36 & 0x6a);
});

test('or_r(rIndex)', t => {
    const rIndex = i8.D;
    r8.set(i8.A, 0x36);    
    r8.set(rIndex, 0x25);    
    instr.or_r(rIndex); // OR D
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x20);
    t.is(a, 0x36 | 0x25);
});

test('or_n(n)', t => {
    const n = 0x1c;
    r8.set(i8.A, 0x36);    
    instr.or_n(n); // OR n
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x28);
    t.is(a, 0x36 | 0x1c);
});

test('OR (HL)', t => {
    r16.set(i16.HL, 0x1212);
    const hl = r16.get(i16.HL);
    cpu.memory[hl] = 0x2c;
    r8.set(i8.A, 0x36);    
    instr.or_ptrXXplusd(i16.HL, 0, 7);
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x28);
    t.is(a, 0x36 | 0x2c);
});

test('OR (IX + d)', t => {
    const d = 0x42;
    r16.set(i16.IX, 0x06);
    const ix = r16.get(i16.IX);
    cpu.memory[ix + d] = 0x6a;
    r8.set(i8.A, 0x36);    
    instr.or_ptrXXplusd(i16.IX, d, 19);
    const a = r8.get(i8.A);
    t.is(a, 0x36 | 0x6a);
});

test('xor_r(rIndex)', t => {
    const rIndex = i8.D;
    r8.set(i8.A, 0x36);    
    r8.set(rIndex, 0x25);    
    instr.xor_r(rIndex); // XOR D
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0);
    t.is(a, 0x36 ^ 0x25);
});

test('xor_n(n)', t => {
    const n = 0x1c;
    r8.set(i8.A, 0x36);    
    instr.xor_n(n); // XOR n
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x28);
    t.is(a, 0x36 ^ 0x1c);
});

test('XOR (HL)', t => {
    r16.set(i16.HL, 0x1212);
    const hl = r16.get(i16.HL);
    cpu.memory[hl] = 0x2c;
    r8.set(i8.A, 0x36);    
    instr.xor_ptrXXplusd(i16.HL, 0, 7);
    const a = r8.get(i8.A);
    const f = r8.get(i8.F);
    t.is(f, 0x08);
    t.is(a, 0x36 ^ 0x2c);
});

test('XOR (IX + d)', t => {
    const d = 0x42;
    r16.set(i16.IX, 0x06);
    const ix = r16.get(i16.IX);
    cpu.memory[ix + d] = 0x6a;
    r8.set(i8.A, 0x36);    
    instr.xor_ptrXXplusd(i16.IX, d, 19);
    const a = r8.get(i8.A);
    t.is(a, 0x36 ^ 0x6a);
});