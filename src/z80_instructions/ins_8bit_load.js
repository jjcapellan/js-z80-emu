/**
 * This file implements Z80 8bit load instructions group
 * Info on page 70 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU, r8, i8, r16, i16, flags, fi, mem;
function setCPU(data) {
    ({ CPU, r8, i8, r16, i16, flags, fi, mem } = data);
}

/**
 * LD r, r'
 * 
 * The contents of any register r' are loaded to any other register r. r, r' identifies any of the
 * registers A, B, C, D, E, H, or L.
  */
function ld_r_r2(rIndex, r2Index) {
    CPU.tCycles += 4;
    const r2 = r8.get(r2Index);
    r8.set(rIndex, r2);
}


/**
 * LD r, n
 * 
 * The 8-bit integer n is loaded to any register r, in which r identifies registers A, B, C, D, E,
 * H, or L.
  */
function ld_r_n(rIndex, n) {
    CPU.tCycles += 7;
    r8.set(rIndex, n);
}

/**
 * LD r, (HL)
 * 
 * The 8-bit contents of memory location (HL) are loaded to register r, in which r identifies
 * registers A, B, C, D, E, H, or L
  */
function ld_r_ptrHL(rIndex) {
    CPU.tCycles += 7;
    const ptrHLcontent = mem[r16.get(i16.HL)];
    r8.set(rIndex, ptrHLcontent);
}

/**
 * LD r, (XY+d)
 * 
 * Helper for ld_r_ptrIXd and ld_r_ptrIYd 
 */
 function ld_r_ptrXYd(rIndex, d, xyIndex) {
    CPU.tCycles += 19;
    const ptr = r16.get(xyIndex) + d;
    const ptrContent = mem[ptr];
    r8.set(rIndex, ptrContent);
}

/**
 * LD r, (IX+d)
 * 
 * The (IX+d) operand (i.e., the contents of Index Register IX summed with two’s-complement 
 * displacement integer d) is loaded to register r, in which r identifies registers A, B, C,
 * D, E, H, or L
  */
function ld_r_ptrIXd(rIndex, d) {
    ld_r_ptrXYd(rIndex, d, i16.IX);
}

/**
 * LD r, (IY+d)
 * 
 * The (IY+d) operand (i.e., the contents of Index Register IY summed with two’s-complement 
 * displacement integer d) is loaded to register r, in which r identifies registers A, B, C,
 * D, E, H, or L
  */
function ld_r_ptrIYd(rIndex, d) {
    ld_r_ptrXYd(rIndex, d, i16.IY);
}

/**
 * LD (HL), r
 * 
 * The contents of register r are loaded to the memory location specified by the contents of
 * the HL register pair. The r symbol identifies registers A, B, C, D, E, H, or L.
  */
function ld_ptrHL_r(rIndex) {
    CPU.tCycles += 7;
    const ptr = r16.get(i16.HL);
    mem[ptr] = r8.get(rIndex);
}

/**
 * Helper for ld_ptrIXd_r and ld_ptrIYd_r
 */
 function ld_ptrXYd_r(rIndex, d, xyIndex) {
    CPU.tCycles += 19;
    const ptr = r16.get(xyIndex) + d;
    mem[ptr] = r8.get(rIndex);
}

/**
 * LD (IX+d), r
 * 
 * The contents of register r are loaded to the memory address specified by the contents of
 * Index Register IX summed with d, a two’s-complement displacement integer. 
 * The r symbol identifies registers A, B, C, D, E, H, or L.
  */
function ld_ptrIXd_r(rIndex, d) {
    ld_ptrXYd_r(rIndex, d, i16.IX);
}

/**
 * LD (IY+d), r
 * 
 * The contents of register r are loaded to the memory address specified by the contents of
 * Index Register IY summed with d, a two’s-complement displacement integer. 
 * The r symbol identifies registers A, B, C, D, E, H, or L.
  */
function ld_ptrIYd_r(rIndex, d) {
    ld_ptrXYd_r(rIndex, d, i16.IY);
}

/**
 * LD (HL), n
 * 
 * The n integer is loaded to the memory address specified by the contents of the HL register
 * pair.
  */
function ld_ptrHL_n(n) {
    CPU.tCycles += 10;
    const ptr = r16.get(i16.HL);
    mem[ptr] = n;
}

/** 
 * Helper function for ld_ptrIXd_n and ld_ptrIXd_n
 */
function ld_ptrXYd_n(xyIndex, n, d) {
    CPU.tCycles += 19;
    const ptr = r16.get(xyIndex) + d;
    mem[ptr] = n;
}

/**
 * LD (IX+d), n
 * 
 * The n operand is loaded to the memory address specified by the sum of Index Register IX
 * and the two’s complement displacement operand d.
  */
function ld_ptrIXd_n(n, d) {
    ld_ptrXYd_n(i16.IX, n, d);
}

/**
 * LD (IY+d), n
 * 
 * The n operand is loaded to the memory address specified by the sum of Index Register IY
 * and the two’s complement displacement operand d.
  */
function ld_ptrIYd_n(n, d) {
    ld_ptrXYd_n(i16.IY, n, d);

}

/**
 * LD A, (BC)
 * 
 * The contents of the memory location specified by the contents of the BC register pair are
 * loaded to the Accumulator.
  */
function ld_A_ptrBC() {
    CPU.tCycles += 7;
    const ptr = r16.get(i16.BC);
    r8.set(i8.A, mem[ptr]);
}

/**
 * LD A, (DE)
 * 
 * The contents of the memory location specified by the contents of the DE register pair are
 * loaded to the Accumulator.
  */
function ld_A_ptrDE() {
    CPU.tCycles += 7;
    const ptr = r16.get(i16.DE);
    r8.set(i8.A, mem[ptr]);
}

/**
 * LD A, (nn)
 * 
 * The contents of the memory location specified by the operands nn are loaded to the Accumulator.
 * The first n operand after the op code is the low-order byte of a 2-byte memory address.
  */
function ld_A_ptrnn(nn) {
    CPU.tCycles += 13;
    r8.set(i8.A, mem[nn]);
}

/**
 * LD (BC), A
 * 
 * The contents of the Accumulator are loaded to the memory location specified by the contents 
 * of the register pair BC.
  */
function ld_ptrBC_A() {
    CPU.tCycles += 7;
    const ptr = r16.get(i16.BC);
    const a = r8.get(i8.A);
    mem[ptr] = a;
}

/**
 * LD (DE), A
 * 
 * The contents of the Accumulator are loaded to the memory location specified by the contents 
 * of the register pair DE.
  */
function ld_ptrDE_A() {
    CPU.tCycles += 7;
    const ptr = r16.get(i16.DE);
    const a = r8.get(i8.A);
    mem[ptr] = a;
}

/**
 * LD (nn), A
 * 
 * The contents of the Accumulator are loaded to the memory address specified by the operand nn.
 * The first n operand after the op code is the low-order byte of nn.
  */
function ld_ptrnn_A(nn) {
    CPU.tCycles += 13;
    mem[nn] = r8.get(i8.A);
}

/**
 * Helper function for ld_A_I and ld_A_R
 */
function ld_A_X(xIndex) {
    const iff2 = CPU.registers.iff.IFF2;
    const x = r8.get(xIndex);
    r8.set(i8.A, x);
    // Flags
    flags.set(fi.S, (x & 0b10000000) != 0);
    flags.set(fi.Z, x == 0);
    flags.set(fi.H, false);
    flags.set(fi.PV, iff2);
    flags.set(fi.N, false);
}

/**
 * LD A, I
 * 
 * The contents of the Interrupt Vector Register I are loaded to the Accumulator.
  */
function ld_A_I() {
    CPU.tCycles += 9;
    ld_A_X(i8.I);
}

/**
 * LD A, R
 * 
 * The contents of Memory Refresh Register R are loaded to the Accumulator
  */
function ld_A_R() {
    CPU.tCycles += 9;
    ld_A_X(i8.R);
}

/**
 * LD I, A
 * 
 * The contents of the Accumulator are loaded to the Interrupt Control Vector Register, I
  */
function ld_I_A() {
    CPU.tCycles += 9;
    r8.set(i8.I, r8.get(i8.A));
}

/**
 * LD R, A
 * 
 * The contents of the Accumulator are loaded to the Memory Refresh register R.
  */
function ld_R_A() {
    CPU.tCycles += 9;
    r8.set(i8.R, r8.get(i8.A));
}

module.exports = {
    ld_r_r2,
    ld_r_n,
    ld_r_ptrHL,
    ld_r_ptrIXd,
    ld_r_ptrIYd,
    ld_r_ptrXYd,
    ld_ptrHL_r,
    ld_ptrXYd_r,
    ld_ptrIXd_r,
    ld_ptrIYd_r,
    ld_ptrHL_n,
    ld_ptrXYd_n,
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