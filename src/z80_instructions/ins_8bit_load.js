/**
 * This file implements Z80 8bit load instructions group
 * Info on page 70 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU = {};
let r8, i8, r16, i16, flags, fi, mem;
const setCPU = (cpu) => {
    CPU = cpu;
    mem = CPU.memory;
    r8 = CPU.registers.regs8;
    i8 = r8.idx;
    r16 = CPU.registers.regs16;
    i16 = r16.idx;
    flags = CPU.registers.flags;
    fi = flags.idx;
}

/**
 * LD r, r'
 * 
 * The contents of any register r' are loaded to any other register r. r, r' identifies any of the
 * registers A, B, C, D, E, H, or L.
 * Clock: 4T
 */
function ld_r_r2(rIndex, r2Index) {
    const r2 = r8.get(r2Index);
    r8.set(rIndex, r2);
}


/**
 * LD r, n
 * 
 * The 8-bit integer n is loaded to any register r, in which r identifies registers A, B, C, D, E,
 * H, or L.
 * Clock: 7T
 */
function ld_r_n(rIndex, n) {
    r8.set(rIndex, n);
}

/**
 * LD r, (HL)
 * 
 * The 8-bit contents of memory location (HL) are loaded to register r, in which r identifies
 * registers A, B, C, D, E, H, or L
 * Clock: 7T
 */
function ld_r_ptrHL(rIndex) {
    const ptrHLcontent = mem[r16.get(i16.HL)];
    r8.set(rIndex, ptrHLcontent);
}

/**
 * LD r, (IX+d)
 * 
 * The (IX+d) operand (i.e., the contents of Index Register IX summed with two’s-complement 
 * displacement integer d) is loaded to register r, in which r identifies registers A, B, C,
 * D, E, H, or L
 * Clock: 19T
 */
function ld_r_ptrIXd(rIndex, d) {
    const ptr = r16.get(i16.IX) + d;
    const ptrContent = mem[ptr];
    r8.set(rIndex, ptrContent);
}

/**
 * LD r, (IY+d)
 * 
 * The (IY+d) operand (i.e., the contents of Index Register IY summed with two’s-complement 
 * displacement integer d) is loaded to register r, in which r identifies registers A, B, C,
 * D, E, H, or L
 * Clock: 19T
 */
function ld_r_ptrIYd(rIndex, d) {
    const ptr = r16.get(i16.IY) + d;
    const ptrContent = mem[ptr];
    r8.set(rIndex, ptrContent);
}

/**
 * LD (HL), r
 * 
 * The contents of register r are loaded to the memory location specified by the contents of
 * the HL register pair. The r symbol identifies registers A, B, C, D, E, H, or L.
 * Clock: 7T
 */
function ld_ptrHL_r(rIndex) {
    const ptr = r16.get(i16.HL);
    mem[ptr] = r8.get(rIndex);
}

/**
 * LD (IX+d), r
 * 
 * The contents of register r are loaded to the memory address specified by the contents of
 * Index Register IX summed with d, a two’s-complement displacement integer. 
 * The r symbol identifies registers A, B, C, D, E, H, or L.
 * Clock: 19T
 */
function ld_ptrIXd_r(rIndex, d) {
    const ptr = r16.get(i16.IX) + d;
    mem[ptr] = r8.get(rIndex);
}

/**
 * LD (IY+d), r
 * 
 * The contents of register r are loaded to the memory address specified by the contents of
 * Index Register IY summed with d, a two’s-complement displacement integer. 
 * The r symbol identifies registers A, B, C, D, E, H, or L.
 * Clock: 19T
 */
function ld_ptrIYd_r(rIndex, d) {
    const ptr = r16.get(i16.IY) + d;
    mem[ptr] = r8.get(rIndex);
}

/**
 * LD (HL), n
 * 
 * The n integer is loaded to the memory address specified by the contents of the HL register
 * pair.
 * Clock: 10T
 */
function ld_ptrHL_n(n) {
    const ptr = r16.get(i16.HL);
    mem[ptr] = n;
}

/**
 * LD (IX+d), n
 * 
 * The n operand is loaded to the memory address specified by the sum of Index Register IX
 * and the two’s complement displacement operand d.
 * Clock: 19T
 */
function ld_ptrIXd_n(n, d) {
    const ptr = r16.get(i16.IX) + d;
    mem[ptr] = n;
}

/**
 * LD (IY+d), n
 * 
 * The n operand is loaded to the memory address specified by the sum of Index Register IY
 * and the two’s complement displacement operand d.
 * Clock: 19T
 */
function ld_ptrIYd_n(n, d) {
    const ptr = r16.get(i16.IY) + d;
    mem[ptr] = n;
}

/**
 * LD A, (BC)
 * 
 * The contents of the memory location specified by the contents of the BC register pair are
 * loaded to the Accumulator.
 * Clock: 7T
 */
function ld_A_ptrBC() {
    const ptr = r16.get(i16.BC);
    r8.set(i8.A, mem[ptr]);
}

/**
 * LD A, (DE)
 * 
 * The contents of the memory location specified by the contents of the DE register pair are
 * loaded to the Accumulator.
 * Clock: 7T
 */
function ld_A_ptrDE() {
    const ptr = r16.get(i16.DE);
    r8.set(i8.A, mem[ptr]);
}

/**
 * LD A, (nn)
 * 
 * The contents of the memory location specified by the operands nn are loaded to the Accumulator.
 * The first n operand after the op code is the low-order byte of a 2-byte memory address.
 * Clock: 13T
 */
function ld_A_ptrnn(nn) {
    r8.set(i8.A, mem[nn]);
}

/**
 * LD (BC), A
 * 
 * The contents of the Accumulator are loaded to the memory location specified by the contents 
 * of the register pair BC.
 * Clock: 7T
 */
function ld_ptrBC_A() {
    const ptr = r16.get(i16.BC);
    const a = r8.get(i8.A);
    mem[ptr] = a;
}

/**
 * LD (DE), A
 * 
 * The contents of the Accumulator are loaded to the memory location specified by the contents 
 * of the register pair DE.
 * Clock: 7T
 */
function ld_ptrDE_A() {
    const ptr = r16.get(i16.DE);
    const a = r8.get(i8.A);
    mem[ptr] = a;
}

/**
 * LD (nn), A
 * 
 * The contents of the Accumulator are loaded to the memory address specified by the operand nn.
 * The first n operand after the op code is the low-order byte of nn.
 * Clock: 13T
 */
function ld_ptrnn_A(nn) {
    mem[nn] = r8.get(i8.A);
}

/**
 * LD A, I
 * 
 * The contents of the Interrupt Vector Register I are loaded to the Accumulator.
 * Clock: 9T
 */
function ld_A_I() {
    const iff2 = CPU.registers.iff.IFF2;
    const i = r8.get(i8.I);
    r8.set(i8.A, i);
    // Flags
    flags.set(fi.S, (i & 0b10000000) != 0);
    flags.set(fi.Z, i == 0);
    flags.set(fi.H, false);
    flags.set(fi.PV, iff2);
    flags.set(fi.N, false);
}

/**
 * LD A, R
 * 
 * The contents of Memory Refresh Register R are loaded to the Accumulator
 * Clock: 9T
 */
function ld_A_R() {
    const iff2 = CPU.registers.iff.IFF2;
    const r = r8.get(i8.R);
    r8.set(i8.A, r);
    // Flags
    flags.set(fi.S, (r & 0b10000000) != 0);
    flags.set(fi.Z, r == 0);
    flags.set(fi.H, false);
    flags.set(fi.PV, iff2);
    flags.set(fi.N, false);
}

/**
 * LD I, A
 * 
 * The contents of the Accumulator are loaded to the Interrupt Control Vector Register, I
 * Clock: 9T
 */
function ld_I_A() {
    r8.set(i8.I, r8.get(i8.A));
}

/**
 * LD R, A
 * 
 * The contents of the Accumulator are loaded to the Memory Refresh register R.
 * Clock: 9T
 */
function ld_R_A() {
    r8.set(i8.R, r8.get(i8.A));
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
    ld_R_A,
    setCPU
}