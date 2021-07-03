const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_8bit_arithmetic');

const cpu = new z80();
const regs8 = cpu.registers.regs8;
const regs16 = cpu.registers.regs16;
const regsSp = cpu.registers.regsSp;
const flags = cpu.registers.flags;
const mem = cpu.memory;

test('add_A_r(cpu, rIndex)', t => {
    regs8.set(regs8.idx.D, 0x1c);
    regs8.set(regs8.idx.A, 0x1);
    const rIndex = regs8.idx.D;
    instr.add_A_r(cpu, rIndex); // ADD A, D
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(a, 0x1d);
    t.is(f, 0x8);
});

test('add_A_n(cpu, n)', t => {
    regs8.set(regs8.idx.A, 0x1);
    const n = 0x1c;
    instr.add_A_n(cpu, n); // ADD A, n
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(a, 0x1d);
    t.is(f, 0x8);
});

test('add_A_ptrHL(cpu)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regs16.set(regs16.idx.HL, 0x1212);
    mem[0x1212] = 0x11;
    instr.add_A_ptrHL(cpu); // ADD A, (HL)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0, `Expected: 0, Flags: ${f.toString(2)}`);
    t.is(a, 0x12);    
});

test('add_A_ptrIXplusd(cpu, d)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regsSp.IX = 0x4;
    const d = 0x1;
    mem[0x5] = 0x25;
    instr.add_A_ptrIXplusd(cpu, d); // ADD A, (IX + d)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x20);
    t.is(a, 0x26);
});

test('add_A_ptrIYplusd(cpu, d)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regsSp.IY = 0x4;
    const d = 0x1;
    mem[0x5] = 0x25;
    instr.add_A_ptrIYplusd(cpu, d); // ADD A, (IY + d)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x20);
    t.is(a, 0x26);
});

test('adc_A_r(cpu, rIndex)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regs8.set(regs8.idx.B, 0x4);
    const rIndex = regs8.idx.B;
    flags.set(flags.idx.C, true);
    instr.adc_A_r(cpu, rIndex); // ADC A, B
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0);
    t.is(a, 0x6);
});

test('adc_A_n(cpu, n)', t => {
    regs8.set(regs8.idx.A, 0x1);
    const n = 0x1c;
    flags.set(flags.idx.C, true);
    instr.adc_A_n(cpu, n); // ADC A, n
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x8);
    t.is(a, 0x1e);
});

test('adc_A_ptrHL(cpu)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regs16.set(regs16.idx.HL, 0x1212);
    mem[0x1212] = 0x11;
    flags.set(flags.idx.C, true);
    instr.adc_A_ptrHL(cpu); // ADC A, (HL)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x0);
    t.is(a, 0x13);
});

test('adc_A_ptrIXplusd(cpu, d)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regsSp.IX = 0x4;
    const d = 0x1;
    mem[0x5] = 0x25;
    flags.set(flags.idx.C, true);
    instr.adc_A_ptrIXplusd(cpu, d); // ADC A, (IX + d)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x20);
    t.is(a, 0x27);
});

test('adc_A_ptrIYplusd(cpu, d)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regsSp.IY = 0x4;
    const d = 0x1;
    mem[0x5] = 0x25;
    flags.set(flags.idx.C, true);
    instr.adc_A_ptrIYplusd(cpu, d); // ADC A, (IY + d)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x20);
    t.is(a, 0x27);
});

test('sub_A_r(cpu, rIndex)', t => {
    regs8.set(regs8.idx.D, 0x1);
    regs8.set(regs8.idx.A, 0x1c);
    const rIndex = regs8.idx.D;
    instr.sub_A_r(cpu, rIndex); // SUB A, D
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x0a);
    t.is(a, 0x1b);
});

test('sub_A_n(cpu, n)', t => {
    regs8.set(regs8.idx.A, 0x1c);
    const n = 0x1;
    instr.sub_A_n(cpu, n); // SUB A, n
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x0a);
    t.is(a, 0x1b);
});

test('sub_A_ptrHL(cpu)', t => {
    regs8.set(regs8.idx.A, 0x12);
    regs16.set(regs16.idx.HL, 0x1212);
    mem[0x1212] = 0x1;
    instr.sub_A_ptrHL(cpu); // SUB A, (HL)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x02);
    t.is(a, 0x11);
});

test('sub_A_ptrIXplusd(cpu, d)', t => {
    regs8.set(regs8.idx.A, 0x12);
    regsSp.IX = 0x4;
    const d = 0x1;
    mem[0x5] = 0x1;
    instr.sub_A_ptrIXplusd(cpu, d); // SUB A, (IX + d)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x02);
    t.is(a, 0x11);
});

test('sub_A_ptrIYplusd(cpu, d)', t => {
    regs8.set(regs8.idx.A, 0x12);
    regsSp.IY = 0x4;
    const d = 0x1;
    mem[0x5] = 0x1;
    instr.sub_A_ptrIYplusd(cpu, d); // SUB A, (IY + d)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x02);
    t.is(a, 0x11);
});

test('sbc_A_r(cpu, rIndex)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regs8.set(regs8.idx.B, 0x4);
    const rIndex = regs8.idx.B;
    flags.set(flags.idx.C, true);
    instr.sbc_A_r(cpu, rIndex); // SUBC A, B
    const a = regs8.get(regs8.idx.A);
    t.is(a, 256 + (0x1 - (0x4 + 0x1))); // +256 convert negative signed int to unsigned
});

test('sbc_A_n(cpu, n)', t => {
    regs8.set(regs8.idx.A, 0x1);
    const n = 0x1c;
    flags.set(flags.idx.C, true);
    instr.sbc_A_n(cpu, n); // SUBC A, n
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(a, 256 + (0x1 - (0x1c + 0x1)));
});

test('sbc_A_ptrHL(cpu)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regs16.set(regs16.idx.HL, 0x1212);
    mem[0x1212] = 0x11;
    flags.set(flags.idx.C, true);
    instr.sbc_A_ptrHL(cpu); // SUBC A, (HL)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 256 + (0x1 - (0x11 + 0x1)));
});

test('sbc_A_ptrIXplusd(cpu, d)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regsSp.IX = 0x4;
    const d = 0x1;
    mem[0x5] = 0x25;
    flags.set(flags.idx.C, true);
    instr.sbc_A_ptrIXplusd(cpu, d); // SUBC A, (IX + d)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 256 + (0x1 - (0x25 + 0x1)));
});

test('sbc_A_ptrIYplusd(cpu, d)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regsSp.IY = 0x4;
    const d = 0x1;
    mem[0x5] = 0x25;
    flags.set(flags.idx.C, true);
    instr.sbc_A_ptrIYplusd(cpu, d); // SUB A, (IY + d)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 256 + (0x1 - (0x25 + 0x1)));
});

test('and_r(cpu, rIndex)', t => {
    const rIndex = regs8.idx.D;
    regs8.set(regs8.idx.A, 0x36);    
    regs8.set(rIndex, 0x25);    
    instr.and_r(cpu, rIndex); // AND D
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x34, `Flags: ${f}, Expected: 0x34`);
    t.is(a, 0x36 & 0x25);
});

test('and_n(cpu, n)', t => {
    const n = 0x1c;
    regs8.set(regs8.idx.A, 0x36);    
    instr.and_n(cpu, n); // AND n
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x14, `Flags: ${f.toString(16)}, Expected: 0x14`);
    t.is(a, 0x36 & 0x1c);
});

test('and_ptrHL(cpu)', t => {
    regs16.set(regs16.idx.HL, 0x1212);
    const hl = regs16.get(regs16.idx.HL);
    cpu.memory[hl] = 0x2c;
    regs8.set(regs8.idx.A, 0x36);    
    instr.and_ptrHL(cpu); // AND (HL)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x34, `Flags: ${f.toString(16)}, Expected: 0x34`);
    t.is(a, 0x36 & 0x2c, `Result: ${a}, Expected: ${0x36 & 0x2c}`);
});

test('and_ptrIXplusd(cpu, d)', t => {
    const d = 0x42;
    regsSp.IX = 0x06;
    const ix = regsSp.IX;
    cpu.memory[ix + d] = 0x6a;
    regs8.set(regs8.idx.A, 0x36);    
    instr.and_ptrIXplusd(cpu, d); // AND (IX + d)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x36 & 0x6a);
});

test('or_r(cpu, rIndex)', t => {
    const rIndex = regs8.idx.D;
    regs8.set(regs8.idx.A, 0x36);    
    regs8.set(rIndex, 0x25);    
    instr.or_r(cpu, rIndex); // OR D
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x20);
    t.is(a, 0x36 | 0x25);
});

test('or_n(cpu, n)', t => {
    const n = 0x1c;
    regs8.set(regs8.idx.A, 0x36);    
    instr.or_n(cpu, n); // OR n
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x28);
    t.is(a, 0x36 | 0x1c);
});

test('or_ptrHL(cpu)', t => {
    regs16.set(regs16.idx.HL, 0x1212);
    const hl = regs16.get(regs16.idx.HL);
    cpu.memory[hl] = 0x2c;
    regs8.set(regs8.idx.A, 0x36);    
    instr.or_ptrHL(cpu); // OR (HL)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x28);
    t.is(a, 0x36 | 0x2c);
});

test('or_ptrIXplusd(cpu, d)', t => {
    const d = 0x42;
    regsSp.IX = 0x06;
    const ix = regsSp.IX;
    cpu.memory[ix + d] = 0x6a;
    regs8.set(regs8.idx.A, 0x36);    
    instr.or_ptrIXplusd(cpu, d); // OR (IX + d)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x36 | 0x6a);
});

test('xor_r(cpu, rIndex)', t => {
    const rIndex = regs8.idx.D;
    regs8.set(regs8.idx.A, 0x36);    
    regs8.set(rIndex, 0x25);    
    instr.xor_r(cpu, rIndex); // XOR D
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0);
    t.is(a, 0x36 ^ 0x25);
});

test('xor_n(cpu, n)', t => {
    const n = 0x1c;
    regs8.set(regs8.idx.A, 0x36);    
    instr.xor_n(cpu, n); // XOR n
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x28);
    t.is(a, 0x36 ^ 0x1c);
});

test('xor_ptrHL(cpu)', t => {
    regs16.set(regs16.idx.HL, 0x1212);
    const hl = regs16.get(regs16.idx.HL);
    cpu.memory[hl] = 0x2c;
    regs8.set(regs8.idx.A, 0x36);    
    instr.xor_ptrHL(cpu); // XOR (HL)
    const a = regs8.get(regs8.idx.A);
    const f = regs8.get(regs8.idx.F);
    t.is(f, 0x08);
    t.is(a, 0x36 ^ 0x2c);
});

test('xor_ptrIXplusd(cpu, d)', t => {
    const d = 0x42;
    regsSp.IX = 0x06;
    const ix = regsSp.IX;
    cpu.memory[ix + d] = 0x6a;
    regs8.set(regs8.idx.A, 0x36);    
    instr.xor_ptrIXplusd(cpu, d); // XOR (IX + d)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x36 ^ 0x6a);
});