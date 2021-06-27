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

test('ex_AF_AF2(cpu)', t => {
    regs16.set(regs16.idx.AF, 0x9900);     
    regs16.set(regs16.idx.AF, 0x5944, true);
    instr.ex_AF_AF2(cpu); // EX AF, AF'
    const af = regs16.get(regs16.idx.AF);
    const af2 = regs16.get(regs16.idx.AF, true);
    t.is(af, 0x5944);
    t.is(af2, 0x9900);
});

test('exx(cpu)', t => {
    regs16.set(regs16.idx.BC, 0x1112);   
    regs16.set(regs16.idx.DE, 0x1314);
    regs16.set(regs16.idx.HL, 0x1516);  
    regs16.set(regs16.idx.BC, 0x1718, true);  
    regs16.set(regs16.idx.DE, 0x1920, true);  
    regs16.set(regs16.idx.HL, 0x2122, true);  
    instr.exx(cpu); // EXX
    const bc = regs16.get(regs16.idx.BC);
    const de = regs16.get(regs16.idx.DE);
    const hl = regs16.get(regs16.idx.HL);
    const bc2 = regs16.get(regs16.idx.BC, true);
    const de2 = regs16.get(regs16.idx.DE, true);
    const hl2 = regs16.get(regs16.idx.HL, true);
    t.is(bc, 0x1718);
    t.is(de, 0x1920);
    t.is(hl, 0x2122);
    t.is(bc2, 0x1112);
    t.is(de2, 0x1314);
    t.is(hl2, 0x1516);
});