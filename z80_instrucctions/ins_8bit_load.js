/**
 * This file implements Z80 8bit load instructions group
 * Info on page 70 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const { regsSp } = require("../z80_registers");

/**
 * LD r, r'
 * 
 * The contents of any register r' are loaded to any other register r. r, r' identifies any of the
 * registers A, B, C, D, E, H, or L.
 * Clock: 4T
 */
function ld_r_r2(cpu, rIndex, r2Index) {
    const regs = cpu.registers.regs8;
    const r2 = regs.get(r2Index);
    regs.set(rIndex, r2);
}


/**
 * LD r, n
 * 
 * The 8-bit integer n is loaded to any register r, in which r identifies registers A, B, C, D, E,
 * H, or L.
 * Clock: 7T
 */
function ld_r_n(cpu, rIndex, n) {
    cpu.registers.regs8.set(rIndex, n);
}

/**
 * LD r, (HL)
 * 
 * The 8-bit contents of memory location (HL) are loaded to register r, in which r identifies
 * registers A, B, C, D, E, H, or L
 * Clock: 7T
 */
function ld_r_ptrHL(cpu, rIndex) {
    const regs = cpu.registers;
    const ptrHLcontent = cpu.memory[regs.regs16.get(regs.regs16.idx.HL)];
    cpu.registers.regs8.set(rIndex, ptrHLcontent);
}

/**
 * LD r, (IX+d)
 * 
 * The (IX+d) operand (i.e., the contents of Index Register IX summed with two’s-complement 
 * displacement integer d) is loaded to register r, in which r identifies registers A, B, C,
 * D, E, H, or L
 * Clock: 19T
 */
 function ld_r_ptrIXd(cpu, rIndex, d) {
    const regs = cpu.registers;
    const ptr = regs.regsSp.IX + d;
    const ptrContent = cpu.memory[ptr];
    regs.regs8.set(rIndex, ptrContent);
}

/**
 * LD r, (IY+d)
 * 
 * The (IY+d) operand (i.e., the contents of Index Register IY summed with two’s-complement 
 * displacement integer d) is loaded to register r, in which r identifies registers A, B, C,
 * D, E, H, or L
 * Clock: 19T
 */
 function ld_r_ptrIYd(cpu, rIndex, d) {
    const regs = cpu.registers;
    const ptr = regs.regsSp.IY + d;
    const ptrContent = cpu.memory[ptr];
    regs.regs8.set(rIndex, ptrContent);
}

/**
 * LD (HL), r
 * 
 * The contents of register r are loaded to the memory location specified by the contents of
 * the HL register pair. The r symbol identifies registers A, B, C, D, E, H, or L.
 * Clock: 7T
 */
 function ld_ptrHL_r(cpu, rIndex) {
    const regs = cpu.registers;
    const ptr = regs.regs16.get(regs.regs16.idx.HL);
    cpu.memory[ptr] = regs.regs8.get(rIndex);
}

/**
 * LD (IX+d), r
 * 
 * The contents of register r are loaded to the memory address specified by the contents of
 * Index Register IX summed with d, a two’s-complement displacement integer. 
 * The r symbol identifies registers A, B, C, D, E, H, or L.
 * Clock: 19T
 */
 function ld_ptrIXd_r(cpu, rIndex, d) {
    const regs = cpu.registers;
    const ptr = regs.regsSp.IX + d;
    cpu.memory[ptr] = regs.regs8.get(rIndex);
}

/**
 * LD (IY+d), r
 * 
 * The contents of register r are loaded to the memory address specified by the contents of
 * Index Register IY summed with d, a two’s-complement displacement integer. 
 * The r symbol identifies registers A, B, C, D, E, H, or L.
 * Clock: 19T
 */
 function ld_ptrIYd_r(cpu, rIndex, d) {
    const regs = cpu.registers;
    const ptr = regs.regsSp.IY + d;
    cpu.memory[ptr] = regs.regs8.get(rIndex);
}

/**
 * LD (HL), n
 * 
 * The n integer is loaded to the memory address specified by the contents of the HL register
 * pair.
 * Clock: 10T
 */
 function ld_ptrHL_n(cpu, n) {
    const regs = cpu.registers;
    const ptr = regs.regs16.get(regs.regs16.idx.HL);
    cpu.memory[ptr] = n;
}

/**
 * LD (IX+d), n
 * 
 * The n operand is loaded to the memory address specified by the sum of Index Register IX
 * and the two’s complement displacement operand d.
 * Clock: 19T
 */
 function ld_ptrIXd_n(cpu, n, d) {
    const regs = cpu.registers;
    const ptr = regs.regsSp.IX + d;
    cpu.memory[ptr] = n;
}

/**
 * LD (IY+d), n
 * 
 * The n operand is loaded to the memory address specified by the sum of Index Register IY
 * and the two’s complement displacement operand d.
 * Clock: 19T
 */
 function ld_ptrIYd_n(cpu, n, d) {
    const regs = cpu.registers;
    const ptr = regs.regsSp.IY + d;
    cpu.memory[ptr] = n;
}

/**
 * LD A, (BC)
 * 
 * The contents of the memory location specified by the contents of the BC register pair are
 * loaded to the Accumulator.
 * Clock: 7T
 */
 function ld_A_ptrBC(cpu) {
    const regs = cpu.registers;
    const ptr = regs.regs16.get(regs.regs16.idx.BC);
    regs.regs8.set(regs.regs8.idx.A, cpu.memory[ptr]);
}

/**
 * LD A, (DE)
 * 
 * The contents of the memory location specified by the contents of the DE register pair are
 * loaded to the Accumulator.
 * Clock: 7T
 */
 function ld_A_ptrDE(cpu) {
    const regs = cpu.registers;
    const ptr = regs.regs16.get(regs.regs16.idx.DE);
    regs.regs8.set(regs.regs8.idx.A, cpu.memory[ptr]);
}

/**
 * LD A, (nn)
 * 
 * The contents of the memory location specified by the operands nn are loaded to the Accumulator.
 * The first n operand after the op code is the low-order byte of a 2-byte memory address.
 * Clock: 13T
 */
 function ld_A_ptrnn(cpu, nn) {
    const regs = cpu.registers;
    regs.regs8.set(regs.regs8.idx.A, cpu.memory[nn]);
}

/**
 * LD (BC), A
 * 
 * The contents of the Accumulator are loaded to the memory location specified by the contents 
 * of the register pair BC.
 * Clock: 7T
 */
 function ld_ptrBC_A(cpu) {
    const regs = cpu.registers;
    const ptr = regs.regs16.get(regs.regs16.idx.BC);
    regs.regs8.set(regs.regs8.idx.A, cpu.memory[ptr]);
}

/**
 * LD (DE), A
 * 
 * The contents of the Accumulator are loaded to the memory location specified by the contents 
 * of the register pair DE.
 * Clock: 7T
 */
 function ld_ptrDE_A(cpu) {
    const regs = cpu.registers;
    const ptr = regs.regs16.get(regs.regs16.idx.DE);
    regs.regs8.set(regs.regs8.idx.A, cpu.memory[ptr]);
}

/**
 * LD (nn), A
 * 
 * The contents of the Accumulator are loaded to the memory address specified by the operand nn.
 * The first n operand after the op code is the low-order byte of nn.
 * Clock: 13T
 */
 function ld_ptrnn_A(cpu, nn) {
    const regs = cpu.registers;
    cpu.memory[nn] = regs.regs8.get(regs.regs8.idx.A);
}

/**
 * LD A, I
 * 
 * The contents of the Interrupt Vector Register I are loaded to the Accumulator.
 * Clock: 9T
 */
 function ld_A_I(cpu) {
    const regs = cpu.registers;
    const flags = regs.flags;
    const i = regs.regsSp.I;
    regs.regs8.set(regs.regs8.idx.A, i);
    // Flags
    flags.set(flags.idx.S, (i & 0b10000000) != 0);
    flags.set(flags.idx.Z, i == 0);
    flags.set(flags.idx.H, false);
    flags.set(flags.idx.PV, regs.iff.IFF2);
    flags.set(flags.idx.N, false);
}

/**
 * LD A, R
 * 
 * The contents of Memory Refresh Register R are loaded to the Accumulator
 * Clock: 9T
 */
 function ld_A_R(cpu) {
    const regs = cpu.registers;
    const flags = regs.flags;
    const r = regs.regsSp.R;
    regs.regs8.set(regs.regs8.idx.A, r);
    // Flags
    flags.set(flags.idx.S, false, (r & 0b10000000) != 0);
    flags.set(flags.idx.Z, r == 0);
    flags.set(flags.idx.H, false);
    flags.set(flags.idx.PV, regs.iff.IFF2);
    flags.set(flags.idx.N, false);
}

/**
 * LD I, A
 * 
 * The contents of the Accumulator are loaded to the Interrupt Control Vector Register, I
 * Clock: 9T
 */
 function ld_I_A(cpu) {
    const regs = cpu.registers;
    regsSp.I = regs.regs8.get(regs.regs8.idx.A);
}

/**
 * LD R, A
 * 
 * The contents of the Accumulator are loaded to the Memory Refresh register R.
 * Clock: 9T
 */
 function ld_R_A(cpu) {
    const regs = cpu.registers;
    regsSp.R = regs.regs8.get(regs.regs8.idx.A);
}

module.exports = {
    ld_r_r2,
    ld_r_n,
    ld_r_ptrHL,
    ld_r_ptrIXd,
    ld_r_ptrIYd,
    ld_ptrHL_r,
    ld_ptrIXd_r,
    ld_ptrIYd_r,
    ld_ptrHL_n,
    ld_ptrIXd_n,
    ld_ptrIYd_n,
    ld_A_ptrBC,
    ld_A_ptrDE,
    ld_A_ptrnn,
    ld_ptrBC_A,
    ld_ptrDE_A,
    ld_ptrnn_A,
    ld_A_I,
    ld_A_R,
    ld_I_A,
    ld_R_A
}