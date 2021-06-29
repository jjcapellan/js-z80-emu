const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_16bit_load');

const cpu = new z80();
const regs8 = cpu.registers.regs8;
const regs16 = cpu.registers.regs16;
const regsSp = cpu.registers.regsSp;
const flags = cpu.registers.flags;
const mem = cpu.memory;

test('ld_dd_nn(cpu, ddIndex, nn)', t => {
    const nn = 0x1216;
    const ddIndex = regs16.idx.AF;    
    instr.ld_dd_nn(cpu, ddIndex, nn); // LD AF, nn
    const af = regs16.get(regs16.idx.AF);
    t.is(af, nn);
});

test('ld_IX_nn(cpu, nn)', t => {
    const nn = 0x0612;    
    instr.ld_IX_nn(cpu, nn); // LD IX, nn
    const ix = regsSp.IX;
    t.is(ix, nn);
});

test('ld_HL_ptrnn(cpu, ptrnn)', t => {
    const ptrnn = 0x1212;
    mem[0x1212] = 0x16;
    mem[0x1212 + 1] = 0x1e;    
    instr.ld_HL_ptrnn(cpu, ptrnn); // LD HL, (nn)
    const hl = regs16.get(regs16.idx.HL);
    const h = regs8.get(regs8.idx.H);
    const l = regs8.get(regs8.idx.L);
    t.is(h, 0x1e);
    t.is(l, 0x16);
    t.is(hl, 0x1e16);
});

test('ld_dd_ptrnn(cpu, ddIndex, ptrnn)', t => {
    const ptrnn = 0x2526;
    mem[ptrnn] = 0x19;
    mem[ptrnn + 1] = 0x1c;    
    instr.ld_dd_ptrnn(cpu, regs16.idx.DE, ptrnn); // LD DE, (nn)
    const de = regs16.get(regs16.idx.DE);
    const d = regs8.get(regs8.idx.D);
    const e = regs8.get(regs8.idx.E);
    t.is(d, 0x1c, `Result: ${d.toString(16)} Expected: 0x1c `);
    t.is(e, 0x19);
    t.is(de, 0x1c19);
});

test('ld_IX_ptrnn(cpu, ptrnn)', t => {
    const ptrnn = 0x3232;
    mem[ptrnn] = 0x11;
    mem[ptrnn + 1] = 0x1d;    
    instr.ld_IX_ptrnn(cpu, ptrnn); // LD IX, (nn)
    const ix = regsSp.IX;
    t.is(ix, 0x111d);
});

test('ld_ptrnn_HL(cpu, ptrnn)', t => {
    const ptrnn = 0x5656;
    regs16.set(regs16.idx.HL, 0x2125);    
    instr.ld_ptrnn_HL(cpu, ptrnn); // LD (nn), HL
    const h = regs8.get(regs8.idx.H);
    const l = regs8.get(regs8.idx.L);
    t.is(h, mem[ptrnn + 1]);
    t.is(l, mem[ptrnn]);
});

test('ld_ptrnn_dd(cpu, ddIndex, ptrnn)', t => {
    const ptrnn = 0x3232;
    const ddIndex = regs16.idx.DE;
    const d = 0x1d;
    const e = 0x19;
    regs8.set(regs8.idx.D, d);    
    regs8.set(regs8.idx.E, e);
    instr.ld_ptrnn_dd(cpu, ddIndex, ptrnn); // LD (nn), DE
    t.is(d, mem[ptrnn + 1]);
    t.is(e, mem[ptrnn]);
});

test('ld_ptrnn_IX(cpu, ptrnn)', t => {
    const ptrnn = 0x4243;
    regsSp.IX = 0x1c16;
    instr.ld_ptrnn_IX(cpu, ptrnn); // LD (nn), IX
    t.is(mem[ptrnn + 1], 0x1c);
    t.is(mem[ptrnn], 0x16);
});

test('ld_SP_HL(cpu)', t => {
    regs16.set(regs16.idx.HL, 0x2526);
    instr.ld_SP_HL(cpu); // LD SP, HL
    const sp = regsSp.SP;
    const hl = regs16.get(regs16.idx.HL);
    t.is(sp, hl);
});

test('push_qq(cpu, qqIndex)', t => {
    regsSp.SP = 0x1007;
    const qqIndex = regs16.idx.AF;
    regs16.set(qqIndex, 0x2233);
    instr.push_qq(cpu, qqIndex); // push AF
    const sp = regsSp.SP;
    t.is(mem[0x1006], 0x22);
    t.is(mem[0x1005], 0x33);
    t.is(sp, 0x1005);
});

test('push_IX(cpu)', t => {
    regsSp.SP = 0x1007;
    const ix = 0x1214;
    regsSp.IX = ix;
    instr.push_IX(cpu); // push IX
    const sp = regsSp.SP;
    t.is(mem[0x1006], 0x12);
    t.is(mem[0x1005], 0x14);
    t.is(sp, 0x1005);
});

test('pop_qq(cpu, qqIndex)', t => {
    regsSp.SP = 0x1000;
    mem[0x1000] = 0x55;
    mem[0x1001] = 0x33;
    const qqIndex = regs16.idx.HL;
    instr.pop_qq(cpu, qqIndex); // pop HL
    const sp = regsSp.SP;
    const hl = regs16.get(qqIndex);
    t.is(hl, 0x3355);
    t.is(sp, 0x1002);
});

test('pop_IX(cpu)', t => {
    regsSp.SP = 0x1000;
    mem[0x1000] = 0x55;
    mem[0x1001] = 0x33;
    instr.pop_IX(cpu); // pop IX
    const sp = regsSp.SP;
    const ix = regsSp.IX;
    t.is(ix, 0x3355);
    t.is(sp, 0x1002);
});