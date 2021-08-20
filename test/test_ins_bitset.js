const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_bitset');
const { regs16 } = require('../src/z80_registers');

const cpu = new z80();
const r8 = cpu.registers.regs8;
const i8 = r8.idx;
const r16 = cpu.registers.regs16;
const i16 = r16.idx;
const flags = cpu.registers.flags;
const fi = flags.idx;
const mem = cpu.memory;

test('bit_b_r(b, rIndex)', t => {
    function doTest(b, r0, r1, f0, f1) {
        const rIndex = i8.B;
        r8.set(rIndex, r0);
        r8.set(i8.F, f0);
        instr.bit_b_r(b, rIndex); // BIT b, r
        let r = r8.get(rIndex);
        let f = r8.get(i8.F);
        t.is(r, r1);
        t.is(f, f1, `Result: ${f.toString(16)} Expected: ${f1.toString(16)}`);
    }

    doTest(7, 0xf4, 0xf4, 0x5c, 0x90); // <-- differs from retro virtual machine (it activates F5 flag)
    doTest(4, 0x41, 0x41, 0x01, 0x55); 
});

test('BIT b, (HL)', t => {
    function doTest(b, n0, n1, f0, f1) {
        r16.set(i16.HL, 0x5c9d);
        const hl = r16.get(i16.HL);
        mem[hl] = n0;
        r8.set(i8.F, f0);
        instr.bit_b_ptrXXplusd(i16.HL, b, 0, 12);
        let n = mem[hl];
        let f = r8.get(i8.F);
        t.is(n, n1);
        t.is(f, f1, `Result: ${f.toString(16)} Expected: ${f1.toString(16)}`);
    }

    doTest(7, 0xf4, 0xf4, 0x00, 0x90);
    doTest(4, 0x41, 0x41, 0x01, 0x55);
});

test('BIT b, (IX + d)', t => {
    function doTest(b, d, n0, n1, f0, f1) {
        r16.set(i16.IX, 0x5c9c);
        const ix = r16.get(i16.IX);
        mem[ix+d] = n0;
        r8.set(i8.F, f0);
        instr.bit_b_ptrXXplusd(i16.IX, b, d, 20);
        let n = mem[ix + d];
        let f = r8.get(i8.F);
        t.is(n, n1);
        t.is(f, f1, `Result: ${f.toString(16)} Expected: ${f1.toString(16)}`);
    }

    doTest(7, 0x1, 0xf4, 0xf4, 0x00, 0x98);
    doTest(4, 0x1, 0x41, 0x41, 0x01, 0x5d);
});

test('set_b_r(b, rIndex)', t => {
    function doTest(b, r0, r1) {
        const rIndex = i8.B;
        r8.set(rIndex, r0);
        instr.set_b_r(b, rIndex); // SET b, r
        let r = r8.get(rIndex);
        t.is(r, r1, `Result: ${r.toString(16)} Expected: ${r1.toString(16)}`);
    }

    doTest(3, 0x42, 0x4a);
});

test('res_b_r(b, rIndex)', t => {
    function doTest(b, r0, r1) {
        const rIndex = i8.B;
        r8.set(rIndex, r0);
        instr.res_b_r(b, rIndex); // RES b, r
        let r = r8.get(rIndex);
        t.is(r, r1, `Result: ${r.toString(16)} Expected: ${r1.toString(16)}`);
    }

    doTest(1, 0xff, 0xfd);
});