const test = require('ava');
const z80 = require('../z80_cpu');
const instr = require('../z80_instrucctions/ins_8bit_load');

const cpu = new z80();
const regs8 = cpu.registers.regs8;
const regs16 = cpu.registers.regs16;
const regsSp = cpu.registers.regsSp;

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

test('ld_r_ptrHL(cpu, rIndex)', t => {   
    regs16.set(regs16.idx.HL, false, 0x4546);
    cpu.memory[0x4546] = 0xb6;
    instr.ld_r_ptrHL(cpu, regs8.idx.C); // LD C, (HL)
    const c = regs8.get(regs8.idx.C, false);
    t.is(c, 0xb6);
});

test('ld_r_ptrIXd(cpu, rIndex, d)', t => {
    regsSp.IX = 0x2424;
    const ix = regsSp.IX;
    const d = -0x19;
    cpu.memory[ix+d] = 0xa3;
    instr.ld_r_ptrIXd(cpu, regs8.idx.A, d); // LD A, (IX+d)
    const a = regs8.get(regs8.idx.A, false);
    t.is(a, 0xa3);
});

test('ld_r_ptrIYd(cpu, rIndex, d)', t => {
    regsSp.IY = 0x3434;
    const iy = regsSp.IY;
    const d = -0x26;
    cpu.memory[iy+d] = 0xa9;
    instr.ld_r_ptrIYd(cpu, regs8.idx.E, d); // LD E, (IY+d)
    const e = regs8.get(regs8.idx.E, false);
    t.is(e, 0xa9);
});

test('ld_ptrHL_r(cpu, rIndex)', t => {   
    regs16.set(regs16.idx.HL, false, 0x862f);
    regs8.set(regs8.idx.B, false, 0xee);
    instr.ld_ptrHL_r(cpu, regs8.idx.B); // LD (HL), B
    const m = cpu.memory[0x862f]
    t.is(m, 0xee);
});

test('ld_ptrIXd_r(cpu, rIndex, d)', t => {   
    regs8.set(regs8.idx.C, false, 0xf4);
    regsSp.IX = 0xaf21;
    const d = -0x5a;
    const ix = regsSp.IX;
    const ptr = ix + d;
    instr.ld_ptrIXd_r(cpu, regs8.idx.C, d); // LD (IX+d), C
    const m = cpu.memory[ptr]
    t.is(m, 0xf4);
});