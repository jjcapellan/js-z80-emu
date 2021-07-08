const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_rotate_shift');
const { regs16 } = require('../src/z80_registers');
const helpers = instr.helpers;

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

test('rlc_r(rIndex)', t => {
    function doTest(rIndex, r0, r1, f0, f1) {
        r8.set(rIndex, r0);
        r8.set(i8.F, f0);
        instr.rlc_r(rIndex); // RLC r
        let r = r8.get(rIndex);
        let f = r8.get(i8.F);
        t.is(r, r1);
        t.is(f, f1);
    }

    doTest(i8.B, 0x24, 0x48, 0x0, 0x0c);
});

// Helper RLC x functions
test('get_rotated_rlc(n)', t => {
    function doTest(n0, n1, f0, f1) {
        r8.set(i8.F, f0);
        const nRotated = helpers.get_rotated_rlc(n0);
        let f = r8.get(i8.F);
        t.is(nRotated, n1);
        t.is(f, f1);
    }

    doTest(0x24, 0x48, 0x0, 0x0c);
});

// Helper RL x functions
test('get_rotated_rl(n)', t => {
    function doTest(n0, n1, f0, f1) {
        r8.set(i8.F, f0);
        const nRotated = helpers.get_rotated_rl(n0);
        let f = r8.get(i8.F);
        t.is(nRotated, n1);
        t.is(f, f1);
    }

    doTest(0x24, 0x49, 0x1, 0x8);
});

// Helper RRC x functions
test('get_rotated_rrc(n)', t => {
    function doTest(n0, n1, f0, f1) {
        r8.set(i8.F, f0);
        const nRotated = helpers.get_rotated_rrc(n0);
        let f = r8.get(i8.F);
        t.is(nRotated, n1);
        t.is(f, f1);
    }

    doTest(0x24, 0x12, 0x1, 0x4);
});

// Helper RR x functions
test('get_rotated_rr(n)', t => {
    function doTest(n0, n1, f0, f1) {
        r8.set(i8.F, f0);
        const nRotated = helpers.get_rotated_rr(n0);
        let f = r8.get(i8.F);
        t.is(nRotated, n1);
        t.is(f, f1);
    }

    doTest(0x24, 0x92, 0x1, 0x80);
});

// Helper SLA x functions
test('get_shifted_sla(n)', t => {
    function doTest(n0, n1, f0, f1) {
        r8.set(i8.F, f0);
        const nShifted = helpers.get_shifted_sla(n0);
        let f = r8.get(i8.F);
        t.is(nShifted, n1);
        t.is(f, f1);
    }

    doTest(0x24, 0x48, 0x1, 0x0c);
});

// Helper SRA x functions
test('get_shifted_sra(n)', t => {
    function doTest(n0, n1, f0, f1) {
        r8.set(i8.F, f0);
        const nShifted = helpers.get_shifted_sra(n0);
        let f = r8.get(i8.F);
        t.is(nShifted, n1);
        t.is(f, f1);
    }

    doTest(0x24, 0x12, 0x1, 0x4);
});

// Helper SRL x functions
test('get_shifted_srl(n)', t => {
    function doTest(n0, n1, f0, f1) {
        r8.set(i8.F, f0);
        const nShifted = helpers.get_shifted_srl(n0);
        let f = r8.get(i8.F);
        t.is(nShifted, n1);
        t.is(f, f1);
    }

    doTest(0xf4, 0x7a, 0x1, 0x28);
});

test('rld()', t => {
    function doTest(n0, n1, a0, a1, f0, f1) {
        const hl = 0x5c23;
        regs16.set(i16.HL, hl);
        mem[hl] = n0;
        r8.set(i8.A, a0);
        r8.set(i8.F, f0);

        instr.rld(); // RLD
        let a = r8.get(i8.A);
        let f = r8.get(i8.F);
        let n = mem[hl];
        t.is(a, a1, `Result: ${a.toString(16)} Expected: ${a1.toString(16)}`);
        t.is(f, f1, `Result: ${f.toString(16)} Expected: ${f1.toString(16)}`);
        t.is(n, n1);
    }

    doTest(0x6c, 0xc4, 0xf4, 0xf6, 0x01, 0xa5);
});

test('rrd()', t => {
    function doTest(n0, n1, a0, a1, f0, f1) {
        const hl = 0x5c23;
        regs16.set(i16.HL, hl);
        mem[hl] = n0;
        r8.set(i8.A, a0);
        r8.set(i8.F, f0);

        instr.rrd(); // RRD
        let a = r8.get(i8.A);
        let f = r8.get(i8.F);
        let n = mem[hl];
        t.is(a, a1, `Result: ${a.toString(16)} Expected: ${a1.toString(16)}`);
        t.is(f, f1, `Result: ${f.toString(16)} Expected: ${f1.toString(16)}`);
        t.is(n, n1);
    }

    doTest(0x6c, 0x46, 0xf4, 0xfc, 0x01, 0xad);
});