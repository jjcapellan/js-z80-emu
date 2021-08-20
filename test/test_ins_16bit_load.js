const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_16bit_load');

const cpu = new z80();
const r8 = cpu.registers.regs8;
const r16 = cpu.registers.regs16;
const i8 = r8.idx;
const i16 = r16.idx;
const flags = cpu.registers.flags;
const mem = cpu.memory;

test('LD AF, nn', t => {
    const nn = 0x1216;
    const ddIndex = i16.AF;    
    instr.ld_XX_nn(ddIndex, nn, 10); 
    const af = r16.get(i16.AF);
    t.is(af, nn);
});

test('LD IX, nn', t => {
    const nn = 0x0612;    
    instr.ld_XX_nn(i16.IX, nn, 14); // 
    const ix = r16.get(i16.IX);
    t.is(ix, nn);
});

test('LD HL, (nn)', t => {
    const ptrnn = 0x1212;
    mem[0x1212] = 0x16;
    mem[0x1212 + 1] = 0x1e;    
    instr.ld_XX_ptrnn(i16.HL, ptrnn, 16);
    const hl = r16.get(i16.HL);
    const h = r8.get(i8.H);
    const l = r8.get(i8.L);
    t.is(h, 0x1e);
    t.is(l, 0x16);
    t.is(hl, 0x1e16);
});

test('LD DE, (nn)', t => {
    const ptrnn = 0x2526;
    mem[ptrnn] = 0x19;
    mem[ptrnn + 1] = 0x1c;    
    instr.ld_XX_ptrnn(i16.DE, ptrnn, 20);
    const de = r16.get(i16.DE);
    const d = r8.get(i8.D);
    const e = r8.get(i8.E);
    t.is(d, 0x1c, `Result: ${d.toString(16)} Expected: 0x1c `);
    t.is(e, 0x19);
    t.is(de, 0x1c19);
});

test('LD IX, (nn)', t => {
    const ptrnn = 0x3232;
    mem[ptrnn] = 0x11;
    mem[ptrnn + 1] = 0x1d;    
    instr.ld_XX_ptrnn(i16.IX,ptrnn, 20);
    const ix = r16.get(i16.IX);
    t.is(ix, 0x1d11, `Result: ${ix.toString(16)}`);
});

test('LD (nn), HL', t => {
    const ptrnn = 0x5656;
    r16.set(i16.HL, 0x2125);    
    instr.ld_ptrnn_XX(i16.HL, ptrnn, 16);
    const h = r8.get(i8.H);
    const l = r8.get(i8.L);
    t.is(h, mem[ptrnn + 1]);
    t.is(l, mem[ptrnn]);
});

test('LD (nn), DE', t => {
    const ptrnn = 0x3232;
    const ddIndex = i16.DE;
    const d = 0x1d;
    const e = 0x19;
    r8.set(i8.D, d);    
    r8.set(i8.E, e);
    instr.ld_ptrnn_XX(ddIndex, ptrnn, 20);
    t.is(d, mem[ptrnn + 1]);
    t.is(e, mem[ptrnn]);
});

test('LD (nn), IX', t => {
    const ptrnn = 0x4243;
    r16.set(i16.IX, 0x1c16);
    instr.ld_ptrnn_XX(i16.IX, ptrnn, 20);
    t.is(mem[ptrnn + 1], 0x1c, `Result: ${mem[ptrnn].toString(16)}`);
    t.is(mem[ptrnn], 0x16);
});

test('LD SP, HL', t => {
    r16.set(i16.HL, 0x2526);
    instr.ld_SP_XX(i16.HL, 6);
    const sp = r16.get(i16.SP);
    const hl = r16.get(i16.HL);
    t.is(sp, hl, `Result: ${sp.toString(16)}`);instr.ld_SP_XX
});

test('PUSH AF', t => {
    r16.set(i16.SP, 0x1007);
    const qqIndex = i16.AF;
    r16.set(qqIndex, 0x2233);
    instr.push_XX(qqIndex, 11);
    const sp = r16.get(i16.SP);
    t.is(mem[0x1006], 0x22, `Result: ${mem[0x1007].toString(16)}`);
    t.is(mem[0x1005], 0x33);
    t.is(sp, 0x1005);
});

test('PUSH IX', t => {
    r16.set(i16.SP, 0x1007);
    r16.set(i16.IX, 0x1214);
    instr.push_XX(i16.IX, 15);
    const sp = r16.get(i16.SP);
    t.is(mem[0x1006], 0x12);
    t.is(mem[0x1005], 0x14);
    t.is(sp, 0x1005);
});

test('POP HL', t => {
    r16.set(i16.SP, 0x1000);
    mem[0x1000] = 0x55;
    mem[0x1001] = 0x33;
    const qqIndex = i16.HL;
    instr.pop_XX(qqIndex, 10);    
    const hl = r16.get(qqIndex);
    let s = r16.get(i16.SP);
    t.is(hl, 0x3355);
    t.is(s, 0x1002);
});

test('POP IX', t => {
    r16.set(i16.SP, 0x1000);
    mem[0x1000] = 0x55;
    mem[0x1001] = 0x33;
    instr.pop_XX(i16.IX, 14);
    const sp = r16.get(i16.SP);
    const ix = r16.get(i16.IX);
    t.is(ix, 0x3355);
    t.is(sp, 0x1002);
});