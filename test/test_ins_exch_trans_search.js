const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_exch_trans_search');

const cpu = new z80();
const r8 = cpu.registers.regs8;
const r16 = cpu.registers.regs16;
const i8 = r8.idx;
const i16 = r16.idx;
const flags = cpu.registers.flags;
const mem = cpu.memory;

test('ex_DE_HL()', t => {
    r16.set(i16.DE, 0x2822);
    r16.set(i16.HL, 0x499a);
    instr.ex_DE_HL(); // EX DE, HL
    const de = r16.get(i16.DE);
    const hl = r16.get(i16.HL);
    t.is(de, 0x499a);
    t.is(hl, 0x2822);
});

test('ex_AF_AF2()', t => {
    r16.set(i16.AF, 0x9900);
    r16.set(i16.AF, 0x5944, true);
    instr.ex_AF_AF2(); // EX AF, AF'
    const af = r16.get(i16.AF);
    const af2 = r16.get(i16.AF, true);
    t.is(af, 0x5944);
    t.is(af2, 0x9900);
});

test('exx()', t => {
    r16.set(i16.BC, 0x1112);
    r16.set(i16.DE, 0x1314);
    r16.set(i16.HL, 0x1516);
    r16.set(i16.BC, 0x1718, true);
    r16.set(i16.DE, 0x1920, true);
    r16.set(i16.HL, 0x2122, true);
    instr.exx(); // EXX
    const bc = r16.get(i16.BC);
    const de = r16.get(i16.DE);
    const hl = r16.get(i16.HL);
    const bc2 = r16.get(i16.BC, true);
    const de2 = r16.get(i16.DE, true);
    const hl2 = r16.get(i16.HL, true);
    t.is(bc, 0x1718);
    t.is(de, 0x1920);
    t.is(hl, 0x2122);
    t.is(bc2, 0x1112);
    t.is(de2, 0x1314);
    t.is(hl2, 0x1516);
});

test('EX (SP), HL', t => {
    r16.set(i16.HL, 0x7012);
    r16.set(i16.SP, 0x8856);
    mem[0x8856] = 0x11;
    mem[0x8857] = 0x22;
    instr.ex_ptrSP_XX(i16.HL, 19);
    const hl = r16.get(i16.HL);
    const h = r8.get(i8.H);
    const l = r8.get(i8.L);
    const sp = r16.get(i16.SP);
    t.is(hl, 0x2211);
    t.is(h, 0x22);
    t.is(l, 0x11);
    t.is(mem[0x8856], 0x12);
    t.is(mem[0x8857], 0x70);
    t.is(sp, 0x8856);
});

test('EX (SP), IX', t => {
    r16.set(i16.IX, 0x3988);
    r16.set(i16.SP, 0x0100);
    mem[0x0100] = 0x90;
    mem[0x0101] = 0x48;
    instr.ex_ptrSP_XX(i16.IX, 23);
    const ix = r16.get(i16.IX);
    const sp = r16.get(i16.SP);
    t.is(ix, 0x4890);
    t.is(mem[0x0100], 0x88);
    t.is(mem[0x0101], 0x39);
    t.is(sp, 0x0100);
});

test('ldi()', t => {
    r16.set(i16.HL, 0x1111);
    r16.set(i16.DE, 0x2222);
    r16.set(i16.BC, 0x07);    
    mem[0x1111] = 0x88;
    mem[0x2222] = 0x66;
    instr.ldi(); // LDI
    const hl = r16.get(i16.HL);
    const de = r16.get(i16.DE);
    const bc = r16.get(i16.BC);
    const PV_flag = flags.get(flags.idx.PV);
    t.is(hl, 0x1112);
    t.is(de, 0x2223);
    t.is(bc, 0x06);
    t.is(mem[0x1111], 0x88);
    t.is(mem[0x2222], 0x88);
    t.is(PV_flag, true);
});

test('cpi()', t => {
    r16.set(i16.HL, 0x1111);
    r16.set(i16.BC, 0x0001);
    r8.set(i8.A, 0x3b);    
    mem[0x1111] = 0x3b;
    instr.cpi(); // CPI
    const hl = r16.get(i16.HL);
    const bc = r16.get(i16.BC);
    const PV_flag = flags.get(flags.idx.PV);
    const Z_flag = flags.get(flags.idx.Z);
    t.is(bc, 0);
    t.is(hl, 0x1112);
    t.is(Z_flag, true);
    t.is(PV_flag, false);
});