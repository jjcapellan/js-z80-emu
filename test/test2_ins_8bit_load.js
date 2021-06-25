const test = require('ava');
const z80 = require('../z80_cpu');
const instr = require('../z80_instrucctions/ins_8bit_load');

const cpu = new z80();
const regs8 = cpu.registers.regs8;

test('ld_r_r2(cpu, rIndex, r2Index)', t => {
    regs8.set(regs8.idx.D, false, 0x15);
    regs8.set(regs8.idx.B, false, 0xe6);    
    instr.ld_r_r2(cpu, regs8.idx.B, regs8.idx.D); // LD B, D
    const b = regs8.get(regs8.idx.B, false);
    t.is(b, 0x15);
});

test('ld_r_n(cpu, rIndex, n)', t => {   
    instr.ld_r_n(cpu, regs8.idx.E, 0x3c); // LD E, n
    const e = regs8.get(regs8.idx.E, false);
    t.is(e, 0x3c);
});