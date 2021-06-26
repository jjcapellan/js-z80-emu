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

test('ld_IX_nn(cpu, nn)', t => {
    const nn = 0x0612;    
    instr.ld_IX_nn(cpu, nn); // LD IX, nn
    const ix = regsSp.IX;
    t.is(ix, nn);
});

test('ld_HL_ptrnn(cpu, ptrnn)', t => {
    const ptrnn = 0x1212;
    cpu.memory[0x1212] = 0x16;
    cpu.memory[0x1212 + 1] = 0x1e;    
    instr.ld_HL_ptrnn(cpu, ptrnn); // LD HL, (nn)
    const hl = regs16.get(regs16.idx.HL);
    const h = regs8.get(regs8.idx.H);
    const l = regs8.get(regs8.idx.L);
    t.is(h, 0x1e);
    t.is(l, 0x16);
    t.is(hl, 0x161e); //little endian
});