const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_rotate_shift');

const cpu = new z80();
const r8 = cpu.registers.regs8;
const i8 = r8.idx;
const r16 = cpu.registers.regs16;
const i16 = r16.idx;
const flags = cpu.registers.flags;
const fi = flags.idx;
const mem = cpu.memory;

test('rlca', t => {
    function doTest(a0, a1, f0, f1) {
        r8.set(i8.A, a0);
        r8.set(i8.F, f0);
        instr.rlca(); // RLCA
        let a = r8.get(i8.A);
        let f = r8.get(i8.F);
        t.is(a, a1);
        t.is(f, f1);
    }

    doTest(0x24, 0x48, 0x5d, 0x4c);
});

test('rla', t => {
    function doTest(a0, a1, f0, f1) {
        r8.set(i8.A, a0);
        r8.set(i8.F, f0);
        instr.rla(); // RLA
        let a = r8.get(i8.A);
        let f = r8.get(i8.F);
        t.is(a, a1);
        t.is(f, f1);
    }

    doTest(0x24, 0x49, 0x5d, 0x4c);
});

test('rrca', t => {
    function doTest(a0, a1, f0, f1) {
        r8.set(i8.A, a0);
        r8.set(i8.F, f0);
        instr.rrca(); // RRCA
        let a = r8.get(i8.A);
        let f = r8.get(i8.F);
        t.is(a, a1);
        t.is(f, f1);
    }

    doTest(0x24, 0x12, 0x5d, 0x44);
});

test('rra', t => {
    function doTest(a0, a1, f0, f1) {
        r8.set(i8.A, a0);
        r8.set(i8.F, f0);
        instr.rra(); // RRA
        let a = r8.get(i8.A);
        let f = r8.get(i8.F);
        t.is(a, a1);
        t.is(f, f1);
    }

    doTest(0x24, 0x92, 0x5d, 0x44);
});