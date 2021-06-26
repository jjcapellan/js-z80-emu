const test = require('ava');
const z80 = require('../z80_cpu');
const instr = require('../z80_instrucctions/ins_16bit_load');

const cpu = new z80();
const regs8 = cpu.registers.regs8;
const regs16 = cpu.registers.regs16;
const regsSp = cpu.registers.regsSp;
const flags = cpu.registers.flags;

test('ld_dd_nn(cpu, ddIndex, nn)', t => {
    const nn = 0x1216;
    const ddIndex = regs16.idx.AF;    
    instr.ld_dd_nn(cpu, ddIndex, nn); // LD AF, nn
    const af = regs16.get(regs16.idx.AF);
    t.is(af, nn);
});