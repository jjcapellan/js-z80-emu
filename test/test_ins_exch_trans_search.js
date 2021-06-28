const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instrucctions/ins_exch_trans_search');

const cpu = new z80();
const regs8 = cpu.registers.regs8;
const regs16 = cpu.registers.regs16;
const regsSp = cpu.registers.regsSp;
const flags = cpu.registers.flags;
const mem = cpu.memory;

test('ex_DE_HL(cpu)', t => {
    regs16.set(regs16.idx.DE, 0x2822);
    regs16.set(regs16.idx.HL, 0x499a);
    instr.ex_DE_HL(cpu); // EX DE, HL
    const de = regs16.get(regs16.idx.DE);
    const hl = regs16.get(regs16.idx.HL);
    t.is(de, 0x499a);
    t.is(hl, 0x2822);
});

test('ex_AF_AF2(cpu)', t => {
    regs16.set(regs16.idx.AF, 0x9900);
    regs16.set(regs16.idx.AF, 0x5944, true);
    instr.ex_AF_AF2(cpu); // EX AF, AF'
    const af = regs16.get(regs16.idx.AF);
    const af2 = regs16.get(regs16.idx.AF, true);
    t.is(af, 0x5944);
    t.is(af2, 0x9900);
});

test('exx(cpu)', t => {
    regs16.set(regs16.idx.BC, 0x1112);
    regs16.set(regs16.idx.DE, 0x1314);
    regs16.set(regs16.idx.HL, 0x1516);
    regs16.set(regs16.idx.BC, 0x1718, true);
    regs16.set(regs16.idx.DE, 0x1920, true);
    regs16.set(regs16.idx.HL, 0x2122, true);
    instr.exx(cpu); // EXX
    const bc = regs16.get(regs16.idx.BC);
    const de = regs16.get(regs16.idx.DE);
    const hl = regs16.get(regs16.idx.HL);
    const bc2 = regs16.get(regs16.idx.BC, true);
    const de2 = regs16.get(regs16.idx.DE, true);
    const hl2 = regs16.get(regs16.idx.HL, true);
    t.is(bc, 0x1718);
    t.is(de, 0x1920);
    t.is(hl, 0x2122);
    t.is(bc2, 0x1112);
    t.is(de2, 0x1314);
    t.is(hl2, 0x1516);
});

test('ex_ptrSP_HL(cpu)', t => {
    regs16.set(regs16.idx.HL, 0x7012);
    regsSp.SP = 0x8856;
    mem[0x8856] = 0x11;
    mem[0x8857] = 0x22;
    instr.ex_ptrSP_HL(cpu); // EX (SP), HL
    const hl = regs16.get(regs16.idx.HL);
    const h = regs8.get(regs8.idx.H);
    const l = regs8.get(regs8.idx.L);
    const sp = regsSp.SP;
    t.is(hl, 0x2211);
    t.is(h, 0x22);
    t.is(l, 0x11);
    t.is(mem[0x8856], 0x12);
    t.is(mem[0x8857], 0x70);
    t.is(sp, 0x8856);
});

test('ex_ptrSP_IX(cpu)', t => {
    regsSp.IX = 0x3988;
    regsSp.SP = 0x0100;
    mem[0x0100] = 0x90;
    mem[0x0101] = 0x48;
    instr.ex_ptrSP_IX(cpu); // EX (SP), IX
    const ix = regsSp.IX;
    const sp = regsSp.SP;
    t.is(ix, 0x4890);
    t.is(mem[0x0100], 0x88);
    t.is(mem[0x0101], 0x39);
    t.is(sp, 0x0100);
});

test('ldi(cpu)', t => {
    regs16.set(regs16.idx.HL, 0x1111);
    regs16.set(regs16.idx.DE, 0x2222);
    regs16.set(regs16.idx.BC, 0x07);    
    mem[0x1111] = 0x88;
    mem[0x2222] = 0x66;
    instr.ldi(cpu); // LDI
    const hl = regs16.get(regs16.idx.HL);
    const de = regs16.get(regs16.idx.DE);
    const bc = regs16.get(regs16.idx.BC);
    const PV_flag = flags.get(flags.idx.PV);
    t.is(hl, 0x1112);
    t.is(de, 0x2223);
    t.is(bc, 0x06);
    t.is(mem[0x1111], 0x88);
    t.is(mem[0x2222], 0x88);
    t.is(PV_flag, true);
});

test('cpi(cpu)', t => {
    regs16.set(regs16.idx.HL, 0x1111);
    regs16.set(regs16.idx.BC, 0x0001);
    regs8.set(regs8.idx.A, 0x3b);    
    mem[0x1111] = 0x3b;
    instr.cpi(cpu); // CPI
    const hl = regs16.get(regs16.idx.HL);
    const bc = regs16.get(regs16.idx.BC);
    const PV_flag = flags.get(flags.idx.PV);
    const Z_flag = flags.get(flags.idx.Z);
    t.is(bc, 0);
    t.is(hl, 0x1112);
    t.is(Z_flag, true);
    t.is(PV_flag, false);
});