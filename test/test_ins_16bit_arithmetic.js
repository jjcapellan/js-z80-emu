const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_16bit_arithmetic');

const cpu = new z80();
const r8 = cpu.registers.regs8;
const i8 = r8.idx;
const r16 = cpu.registers.regs16;
const i16 = r16.idx;
const flags = cpu.registers.flags;
const fi = flags.idx;
const mem = cpu.memory;

test('add_HL_ss(ssIndex)', t => {
    function doTest(hl0, bcValue, f0, hl1, f1) {
        let ssIndex = i16.BC;
        r16.set(ssIndex, bcValue);
        r16.set(i16.HL, hl0);
        instr.add_HL_ss(ssIndex); // ADD HL, ss
        let hl = r16.get(i16.HL);
        let f = r8.get(i8.F);
        t.is(hl, hl1);
        t.is(f, f1);
    }

    doTest(0x1, 0x2324, 0, 0x2325, 0x20);
    doTest(0x1f32, 0x6f24, 0, 0x8e56, 0x18);
});

test('adc_HL_ss(ssIndex)', t => {
    function doTest(hl0, bcValue, f0, hl1, f1) {
        let ssIndex = i16.BC;
        r16.set(ssIndex, bcValue);
        r16.set(i16.HL, hl0);
        r8.set(i8.F, f0);
        instr.adc_HL_ss(ssIndex); // ADD HL, ss
        let hl = r16.get(i16.HL);
        let f = r8.get(i8.F);
        t.is(hl, hl1);
        t.is(f, f1);
    }

    doTest(0x1, 0x2324, 0x1, 0x2326, 0x20);
    doTest(0x1f32, 0x6f24, 0, 0x8e56, 0x9c);
});