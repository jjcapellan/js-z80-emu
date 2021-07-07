/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 204 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU, r8, i8, r16, i16, flags, fi, mem;
function setCPU(data) {
    ({ CPU, r8, i8, r16, i16, flags, fi, mem } = data);
}

function createFlags(C, N, PV, F3, H, F5, Z, S) {
    return (S << 7) | (Z << 6) | (F5 << 5) | (H << 4) |
        (F3 << 3) | (PV << 2) | (N << 1) | C;
}

/**
* RLCA
* 
* The contents of the Accumulator (Register A) are rotated left 1 bit position. The sign bit
* (bit 7) is copied to the Carry flag and also to bit 0. Bit 0 is the least-significant bit.
* Clock: 4T
*/
function rlca() {
    const a = r8.get(i8.A);
    const bit7 = a >> 7;
    const aRotated = ((a << 1) & 0xff) | bit7;
    r8.set(i8.A, aRotated);
    flags.set(fi.C, bit7);
    flags.set(fi.N, false);
    flags.set(fi.H, false);
    flags.set(fi.F3, (aRotated & (1 << fi.F3)) != 0);
    flags.set(fi.F5, (aRotated & (1 << fi.F5)) != 0);
}

/**
* RLC r
* 
* The contents of register r are rotated left 1 bit position. The contents of bit 7 are copied to
* the Carry flag and also to bit 0.
* Clock: 8T
*/
function rlc_r(rIndex) {
    const r = r8.get(rIndex);
    const bit7 = r >> 7;
    const rRotated = ((r << 1) & 0xff) | bit7;
    r8.set(rIndex, rRotated);
    const f = createFlags(
        bit7,
        false,
        CPU.tables.parityTable[rRotated],
        (rRotated & (1 << fi.F3)) != 0,
        false,
        (rRotated & (1 << fi.F5)) != 0,
        rRotated == 0,
        bit7
    );
    r8.set(i8.F, f);
}

/**
* RLC (HL)
* 
* The contents of the memory address specified by the contents of register pair HL are
* rotated left 1 bit position. The contents of bit 7 are copied to the Carry flag and also to bit 0.
* Bit 0 is the least-significant bit.
* Clock: 15T
*/
function rlc_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const bit7 = n >> 7;
    const nRotated = ((n << 1) & 0xff) | bit7;
    mem[hl] = nRotated;
    const f = createFlags(
        bit7,
        false,
        CPU.tables.parityTable[nRotated],
        (nRotated & (1 << fi.F3)) != 0,
        false,
        (nRotated & (1 << fi.F5)) != 0,
        nRotated == 0,
        bit7
    );
    r8.set(i8.F, f);
}

/**
* RLC (IX + d)
* 
* The contents of the memory address specified by the sum of the contents of Index Register
* IX and the two’s-complement displacement integer, d, are rotated left 1 bit position. The
* contents of bit 7 are copied to the Carry flag and also to bit 0. Bit 0 is the least-significant
* bit.
* Clock: 23T
*/
function rlc_ptrIXd(d) {
    const ix = r16.get(i16.IX);
    const n = mem[ix + d];
    const bit7 = n >> 7;
    const nRotated = ((n << 1) & 0xff) | bit7;
    mem[ix + d] = nRotated;
    const f = createFlags(
        bit7,
        false,
        CPU.tables.parityTable[nRotated],
        (nRotated & (1 << fi.F3)) != 0,
        false,
        (nRotated & (1 << fi.F5)) != 0,
        nRotated == 0,
        bit7
    );
    r8.set(i8.F, f);
}

/**
* RLC (IY + d)
* 
* The contents of the memory address specified by the sum of the contents of Index Register
* IY and the two’s-complement displacement integer, d, are rotated left 1 bit position. The
* contents of bit 7 are copied to the Carry flag and also to bit 0. Bit 0 is the least-significant
* bit.
* Clock: 23T
*/
function rlc_ptrIYd(d) {
    const iy = r16.get(i16.IY);
    const n = mem[iy + d];
    const bit7 = n >> 7;
    const nRotated = ((n << 1) & 0xff) | bit7;
    mem[iy + d] = nRotated;
    const f = createFlags(
        bit7,
        false,
        CPU.tables.parityTable[nRotated],
        (nRotated & (1 << fi.F3)) != 0,
        false,
        (nRotated & (1 << fi.F5)) != 0,
        nRotated == 0,
        bit7
    );
    r8.set(i8.F, f);
}

/**
* RLA
* 
* The contents of the Accumulator (Register A) are rotated left 1 bit position through the
* Carry flag. The previous contents of the Carry flag are copied to bit 0. Bit 0 is the leastsignificant bit.
* Clock: 4T
*/
function rla() {
    const a = r8.get(i8.A);
    const bit7 = a >> 7;
    const cf = flags.get(fi.C);
    const aRotated = ((a << 1) & 0xff) | cf;
    r8.set(i8.A, aRotated);
    flags.set(fi.C, bit7);
    flags.set(fi.N, false);
    flags.set(fi.H, false);
    flags.set(fi.F3, (aRotated & (1 << fi.F3)) != 0);
    flags.set(fi.F5, (aRotated & (1 << fi.F5)) != 0);
}

/**
* RRCA
* 
* The contents of the Accumulator (Register A) are rotated right 1 bit position. 
* Bit 0 is copied to the Carry flag and also to bit 7. Bit 0 is the least-significant bit.
* Clock: 4T
*/
function rrca() {
    const a = r8.get(i8.A);
    const bit0 = a & 1;
    const aRotated = (a >> 1) | (bit0 << 7);
    r8.set(i8.A, aRotated);
    flags.set(fi.C, bit0);
    flags.set(fi.N, false);
    flags.set(fi.H, false);
    flags.set(fi.F3, (aRotated & (1 << fi.F3)) != 0);
    flags.set(fi.F5, (aRotated & (1 << fi.F5)) != 0);
}

/**
* RRA
* 
* The contents of the Accumulator (Register A) are rotated right 1 bit position through the
* Carry flag. The previous contents of the Carry flag are copied to bit 7. 
* Bit 0 is the leastsignificant bit
* Clock: 4T
*/
function rra() {
    const a = r8.get(i8.A);
    const bit0 = a & 1;
    const cf = flags.get(fi.C);
    const aRotated = (a >> 1) | (cf << 7);
    r8.set(i8.A, aRotated);
    flags.set(fi.C, bit0);
    flags.set(fi.N, false);
    flags.set(fi.H, false);
    flags.set(fi.F3, (aRotated & (1 << fi.F3)) != 0);
    flags.set(fi.F5, (aRotated & (1 << fi.F5)) != 0);
}

module.exports = {
    rlca,
    rlc_r,
    rlc_ptrHL,
    rlc_ptrIXd,
    rlc_ptrIYd,
    rla,
    rrca,
    rra,
    setCPU
}