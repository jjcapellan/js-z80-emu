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

    doTest(7, 0xf4, 0xf4, 0x5c, 0xb0);
    doTest(4, 0x41, 0x41, 0x01, 0x55);
});