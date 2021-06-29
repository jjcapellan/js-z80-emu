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
    t.is(a, 0x1d);
});

test('add_A_n(cpu, n)', t => {
    regs8.set(regs8.idx.A, 0x1);
    const n = 0x1c;
    instr.add_A_n(cpu, n); // ADD A, n
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x1d);
});

test('add_A_ptrHL(cpu)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regs16.set(regs16.idx.HL, 0x1212);
    mem[0x1212] = 0x11;
    instr.add_A_ptrHL(cpu); // ADD A, (HL)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x12);
});

test('add_A_ptrIXplusd(cpu, d)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regsSp.IX = 0x4;
    const d = 0x1;
    mem[0x5] = 0x25;
    instr.add_A_ptrIXplusd(cpu, d); // ADD A, (IX + d)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x26);
});

test('add_A_ptrIYplusd(cpu, d)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regsSp.IY = 0x4;
    const d = 0x1;
    mem[0x5] = 0x25;
    instr.add_A_ptrIYplusd(cpu, d); // ADD A, (IY + d)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x26);
});

test('adc_A_r(cpu, rIndex)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regs8.set(regs8.idx.B, 0x4);
    const rIndex = regs8.idx.B;
    flags.set(flags.idx.C, true);
    instr.adc_A_r(cpu, rIndex); // ADC A, B
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x6);
});

test('adc_A_n(cpu, n)', t => {
    regs8.set(regs8.idx.A, 0x1);
    const n = 0x1c;
    flags.set(flags.idx.C, true);
    instr.adc_A_n(cpu, n); // ADC A, n
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x1e);
});

test('adc_A_ptrHL(cpu)', t => {
    regs8.set(regs8.idx.A, 0x1);
    regs16.set(regs16.idx.HL, 0x1212);
    mem[0x1212] = 0x11;
    flags.set(flags.idx.C, true);
    instr.adc_A_ptrHL(cpu); // ADC A, (HL)
    const a = regs8.get(regs8.idx.A);
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
    t.is(a, 0x27);
});