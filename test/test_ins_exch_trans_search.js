const test = require('ava');
const z80 = require('../z80_cpu');
const instr = require('../z80_instrucctions/ins_exch_trans_search');

const cpu = new z80();
const regs8 = cpu.registers.regs8;
const regs16 = cpu.registers.regs16;
const regsSp = cpu.registers.regsSp;
const flags = cpu.registers.flags;
const mem = cpu.memory;

test('ex_DE_HL(cpu)', t => {
    regs16.set(regs16.idx.DE, 0x2822);     
    regs16.set(regs16.idx.HL, 0x499a);
    instr.ex_DE_HL(cpu); // EX DE, HL
    const de = regs16.get(regs16.idx.DE);
    const hl = regs16.get(regs16.idx.HL);
    t.is(de, 0x499a);
    t.is(hl, 0x2822);
});