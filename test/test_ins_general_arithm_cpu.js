const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_general_arithm_cpu');

const cpu = new z80();
const regs8 = cpu.registers.regs8;
const regs16 = cpu.registers.regs16;
const regsSp = cpu.registers.regsSp;
const flags = cpu.registers.flags;
const mem = cpu.memory;

//Flag masks
const S = 0b10000000;
const Z = 0b01000000;
const F5 = 0b00100000;
const H = 0b00010000;
const F3 = 0b00001000;
const PV = 0b00000100;
const N = 0b00000010;
const C = 0b00000001;

test('daa()', t => {

    function doTest(a0, f0, a1, f1){
    regs8.set(regs8.idx.A, a0);
    regs8.set(regs8.idx.F, f0);
    instr.daa(); // DAA
    a = regs8.get(regs8.idx.A);
    f = regs8.get(regs8.idx.F);    
    t.is(a, a1, `a0: ${a0.toString(16)}, a1: ${a1.toString(16)}, result_a:${a.toString(16)}`);
    t.is(f, f1, `a0: ${a0.toString(16)}, f1:${f1.toString(16)}, result_f:${f.toString(16)}`);
    }

    doTest(0x2c, 0, 0x2c + 0x6, 0x30);
    doTest(0xc6, 0, (0xc6 + 0x60) & 0xff, 0x21);
    doTest(0x62, H, 0x62 + 0x6, 0x28);
    doTest(0x23, C, 0x23 + 0x60, 0x81);
    doTest(0x2b, C, (0x2b + 0x66) & 0xff, 0x91);
    doTest(0x23, C | H, 0x23 + 0x66, 0x89);
    doTest(0x23, C | H, 0x23 + 0x66, 0x89);
    doTest(0x23, N, 0x23, 0x22);
    doTest(0x28, N | H, (0x28 + 0xfa) & 0xff, 0x26);
    doTest(0x88, C | H | N, (0x88 + 0x9a) & 0xff, 0x27);
    
});

test('cpl()', t => {

    function doTest(a0, f0, a1, f1){
    regs8.set(regs8.idx.A, a0);
    regs8.set(regs8.idx.F, f0);
    instr.cpl(); // CPL
    a = regs8.get(regs8.idx.A);
    f = regs8.get(regs8.idx.F);    
    t.is(a, a1, `a0: ${a0.toString(16)}, a1: ${a1.toString(16)}, result_a:${a.toString(16)}`);
    t.is(f, f1, `a0: ${a0.toString(16)}, f1:${f1.toString(16)}, result_f:${f.toString(16)}`);
    }

    doTest(0x20, 0, 0xdf, 0x1a);
    
});

test('neg()', t => {

    function doTest(a0, f0, a1, f1){
    regs8.set(regs8.idx.A, a0);
    regs8.set(regs8.idx.F, f0);
    instr.neg(); // NEG
    a = regs8.get(regs8.idx.A);
    f = regs8.get(regs8.idx.F);    
    t.is(a, a1, `a0: ${a0.toString(16)}, a1: ${a1.toString(16)}, result_a:${a.toString(16)}`);
    t.is(f, f1, `a0: ${a0.toString(16)}, f1:${f1.toString(16)}, result_f:${f.toString(16)}`);
    }

    doTest(0x40, 0, 0xc0, 0x83);
    doTest(0xef, 0, 0x11, 0x13);
    
});

test('ccf()', t => {

    function doTest(a0, f0, a1, f1){
    regs8.set(regs8.idx.A, a0);
    regs8.set(regs8.idx.F, f0);
    instr.ccf(); // CCF
    a = regs8.get(regs8.idx.A);
    f = regs8.get(regs8.idx.F);    
    t.is(a, a1, `a0: ${a0.toString(16)}, a1: ${a1.toString(16)}, result_a:${a.toString(16)}`);
    t.is(f, f1, `a0: ${a0.toString(16)}, f1:${f1.toString(16)}, result_f:${f.toString(16)}`);
    }

    doTest(0x40, C, 0x040, 0x10);
    doTest(0x26, (F5 | H | PV), 0x026, 0x25);
    
});

test('scf()', t => {

    function doTest(a0, f0, a1, f1){
    regs8.set(regs8.idx.A, a0);
    regs8.set(regs8.idx.F, f0);
    instr.scf(); // SCF
    a = regs8.get(regs8.idx.A);
    f = regs8.get(regs8.idx.F);    
    t.is(a, a1, `a0: ${a0.toString(16)}, a1: ${a1.toString(16)}, result_a:${a.toString(16)}`);
    t.is(f, f1, `a0: ${a0.toString(16)}, f1:${f1.toString(16)}, result_f:${f.toString(16)}`);
    }

    doTest(0x40, 0, 0x040, 0x01);
    doTest(0x26, C, 0x026, 0x21);
    
});