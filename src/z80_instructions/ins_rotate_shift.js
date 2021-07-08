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
 * Helper function for RLC X
 * @param {number} n Byte
 * @returns {number} Byte rotated left
 */
function get_rotated_rlc(n) {
    const bit7 = n >> 7;
    const nRotated = ((n << 1) & 0xff) | bit7;
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
    return nRotated;
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
    rRotated = get_rotated_rlc(r);
    r8.set(rIndex, rRotated);

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
    const nRotated = get_rotated_rlc(n);
    mem[hl] = nRotated;
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
    const nRotated = get_rotated_rlc(n);
    mem[ix + d] = nRotated;
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
    const nRotated = get_rotated_rlc(n);
    mem[iy + d] = nRotated;
}

/**
 * Helper function for RL X
 * @param {number} n Byte
 * @returns {number} Byte rotated left
 */
function get_rotated_rl(n) {
    const bit7 = n >> 7;
    const cf = flags.get(fi.C);
    const nRotated = ((n << 1) & 0xff) | cf;
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
    return nRotated;
}

/**
* RL r
* 
* The contents of register r are rotated left 1 bit position. The contents of bit 7 are copied to
* the Carry flag, and previus Carry flag to bit 0.
* Clock: 2T
*/
function rl_r(rIndex) {
    const r = r8.get(rIndex);
    rRotated = get_rotated_rl(r);
    r8.set(rIndex, rRotated);

}

/**
* RL (HL)
* 
* The contents of the memory address specified by the contents of register pair HL are
* rotated left 1 bit position. The contents of bit 7 are copied to the Carry flag,
* and previus Carry flag to bit 0. Bit 0 is the least-significant bit.
* Clock: 4T
*/
function rl_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const nRotated = get_rotated_rl(n);
    mem[hl] = nRotated;
}

/**
* RL (IX + d)
* 
* The contents of the memory address specified by the sum of the contents of Index Register
* IX and the two’s-complement displacement integer, d, are rotated left 1 bit position. The
* contents of bit 7 are copied to the Carry flag, and previus Carry flag to bit 0.
* Bit 0 is the least-significant
* bit.
* Clock: 6T
*/
function rl_ptrIXd(d) {
    const ix = r16.get(i16.IX);
    const n = mem[ix + d];
    const nRotated = get_rotated_rl(n);
    mem[ix + d] = nRotated;
}

/**
* RL (IY + d)
* 
* The contents of the memory address specified by the sum of the contents of Index Register
* IY and the two’s-complement displacement integer, d, are rotated left 1 bit position. The
* contents of bit 7 are copied to the Carry flag, and previus Carry flag to bit 0.
* Bit 0 is the least-significant
* bit.
* Clock: 6T
*/
function rl_ptrIYd(d) {
    const iy = r16.get(i16.IY);
    const n = mem[iy + d];
    const nRotated = get_rotated_rl(n);
    mem[iy + d] = nRotated;
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
 * Helper function for RRC X
 * @param {number} n Byte
 * @returns {number} Byte rotated right
 */
function get_rotated_rrc(n) {
    const bit0 = n & 1;
    const nRotated = (n >> 1) | (bit0 << 7);
    const f = createFlags(
        bit0,
        false,
        CPU.tables.parityTable[nRotated],
        (nRotated & (1 << fi.F3)) != 0,
        false,
        (nRotated & (1 << fi.F5)) != 0,
        nRotated == 0,
        n & (1 << 7)
    );
    r8.set(i8.F, f);
    return nRotated;
}

/**
* RRC r
* 
* The contents of register r are rotated right 1 bit position. The contents of bit 0 are
* copied to the Carry flag and also to bit 7. Bit 0 is the least-significant bit.
* Clock: 2T
*/
function rrc_r(rIndex) {
    const r = r8.get(rIndex);
    rRotated = get_rotated_rrc(r);
    r8.set(rIndex, rRotated);
}

/**
* RRC (HL)
* 
* The contents of the memory address specified by the contents of register pair HL are
* rotated right 1 bit position. The contents of bit 0 are copied to the Carry flag and
* also to bit 7. Bit 0 is the least-significant bit.
* Clock: 4T
*/
function rrc_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const nRotated = get_rotated_rrc(n);
    mem[hl] = nRotated;
}

/**
* RRC (IX + d)
* 
* The contents of the memory address specified by the sum of the contents of Index Register
* IX and the two’s-complement displacement integer, d, are rotated right 1 bit position. 
* The contents of bit 0 are copied to the Carry flag and also to bit 7. 
* Bit 0 is the least-significant bit.
* Clock: 6T
*/
function rrc_ptrIXd(d) {
    const ix = r16.get(i16.IX);
    const n = mem[ix + d];
    const nRotated = get_rotated_rrc(n);
    mem[ix + d] = nRotated;
}

/**
* RRC (IY + d)
* 
* The contents of the memory address specified by the sum of the contents of Index Register
* IY and the two’s-complement displacement integer, d, are rotated right 1 bit position.
* The contents of bit 0 are copied to the Carry flag and also to bit 7.
* Bit 0 is the least-significant bit.
* Clock: 6T
*/
function rrc_ptrIYd(d) {
    const iy = r16.get(i16.IY);
    const n = mem[iy + d];
    const nRotated = get_rotated_rrc(n);
    mem[iy + d] = nRotated;
}

/**
* RRA
* 
* The contents of the Accumulator (Register A) are rotated right 1 bit position through the
* Carry flag. The previous contents of the Carry flag are copied to bit 7. 
* Bit 0 is the least-significant bit
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

/**
 * Helper function for RR X
 * @param {number} n Byte
 * @returns {number} Byte rotated right
 */
function get_rotated_rr(n) {
    const cf = flags.get(fi.C);
    const bit0 = n & 1;
    const nRotated = (n >> 1) | (cf << 7);
    const f = createFlags(
        bit0,
        false,
        CPU.tables.parityTable[nRotated],
        (nRotated & (1 << fi.F3)) != 0,
        false,
        (nRotated & (1 << fi.F5)) != 0,
        nRotated == 0,
        n & (1 << 7)
    );
    r8.set(i8.F, f);
    return nRotated;
}

/**
* RR r
* 
* The contents of register r are rotated right 1 bit position through the Carry flag.
* The contents of bit 0 are copied to the Carry flag and the previous contents of the Carry flag are
* copied to bit 7. Bit 0 is the least-significant bit.
* Clock: 2T
*/
function rr_r(rIndex) {
    const r = r8.get(rIndex);
    rRotated = get_rotated_rr(r);
    r8.set(rIndex, rRotated);
}

/**
* RR (HL)
* 
* The contents of the memory address specified by the contents of register pair HL are
* rotated right 1 bit position through the Carry flag. The contents of bit 0 are copied
* to the Carry flag and the previous contents of the Carry flag are
* copied to bit 7. Bit 0 is the least-significant bit.
* Clock: 4T
*/
function rr_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const nRotated = get_rotated_rr(n);
    mem[hl] = nRotated;
}

/**
* RR (IX + d)
* 
* The contents of the memory address specified by the sum of the contents of Index Register
* IX and the two’s-complement displacement integer, d, are rotated right 1 bit position through
* the Carry flag.The contents of bit 0 are copied to the Carry flag and the previous contents
* of the Carry flag are copied to bit 7. Bit 0 is the least-significant bit.
* Clock: 6T
*/
function rr_ptrIXd(d) {
    const ix = r16.get(i16.IX);
    const n = mem[ix + d];
    const nRotated = get_rotated_rr(n);
    mem[ix + d] = nRotated;
}

/**
* RR (IY + d)
* 
* The contents of the memory address specified by the sum of the contents of Index Register
* IY and the two’s-complement displacement integer, d, are rotated right 1 bit position through
* the Carry flag.The contents of bit 0 are copied to the Carry flag and the previous contents
* of the Carry flag are copied to bit 7. Bit 0 is the least-significant bit.
* Clock: 6T
*/
function rr_ptrIYd(d) {
    const iy = r16.get(i16.IY);
    const n = mem[iy + d];
    const nRotated = get_rotated_rr(n);
    mem[iy + d] = nRotated;
}

/**
 * Helper function for SLA X
 * @param {number} n Byte
 * @returns {number} Byte rotated left
 */
 function get_shifted_sla(n) {
    const bit7 = n >> 7;
    const nShifted = ((n << 1) & 0xff);
    const f = createFlags(
        bit7,
        false,
        CPU.tables.parityTable[nShifted],
        (nShifted & (1 << fi.F3)) != 0,
        false,
        (nShifted & (1 << fi.F5)) != 0,
        nShifted == 0,
        bit7
    );
    r8.set(i8.F, f);
    return nShifted;
}

/**
* SLA r
* 
* An arithmetic shift left 1 bit position is performed on the contents of register r.
* The contents of bit 7 are copied to the Carry flag.
* Bit 0 is the least-significant bit.
* Clock: 2T
*/
function sla_r(rIndex) {
    const r = r8.get(rIndex);
    const rShifted = get_shifted_sla(r);
    r8.set(rIndex, rShifted);
}

/**
* SLA (HL)
* 
* An arithmetic shift left 1 bit position is performed on the the contents of the memory address
* specified by the contents of register pair HL. 
* The contents of bit 7 are copied to the Carry flag.
* Bit 0 is the least-significant bit.
* Clock: 4T
*/
function sla_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const nShifted = get_shifted_sla(n);
    mem[hl] = nShifted;
}

/**
* SLA (IX + d)
* 
* An arithmetic shift left 1 bit position is performed on the the contents of the memory address
* specified by the contents of index register IX. 
* The contents of bit 7 are copied to the Carry flag.
* Bit 0 is the least-significant bit.
* Clock: 6T
*/
function sla_ptrIXd(d) {
    const ix = r16.get(i16.IX);
    const n = mem[ix + d];
    const nShifted = get_shifted_sla(n);
    mem[ix + d] = nShifted;
}

/**
* SLA (IY + d)
* 
* An arithmetic shift left 1 bit position is performed on the the contents of the memory address
* specified by the contents of index register IY. 
* The contents of bit 7 are copied to the Carry flag.
* Bit 0 is the least-significant bit.
* Clock: 6T
*/
function sla_ptrIYd(d) {
    const iy = r16.get(i16.IY);
    const n = mem[iy + d];
    const nShifted = get_shifted_sla(n);
    mem[iy + d] = nShifted;
}

/**
 * Helper function for SRA X
 * @param {number} n Byte
 * @returns {number} Byte shifted right
 */
 function get_shifted_sra(n) {
    const bit7 = n >> 7;
    const bit0 = n & 1;
    const nShifted = (n >> 1) | (bit7 << 7);
    const f = createFlags(
        bit0,
        false,
        CPU.tables.parityTable[nShifted],
        (nShifted & (1 << fi.F3)) != 0,
        false,
        (nShifted & (1 << fi.F5)) != 0,
        nShifted == 0,
        bit7
    );
    r8.set(i8.F, f);
    return nShifted;
}

/**
* SRA r
* 
* An arithmetic shift right 1 bit position is performed on the contents of register r.
* The contents of bit 0 are copied to the Carry flag. Bit 7 remains unchanged.
* Bit 0 is the least-significant bit.
* Clock: 2T
*/
function sra_r(rIndex) {
    const r = r8.get(rIndex);
    const rShifted = get_shifted_sra(r);
    r8.set(rIndex, rShifted);
}

/**
* SRA (HL)
* 
* An arithmetic shift right 1 bit position is performed on the the contents of the memory address
* specified by the contents of register pair HL. 
* The contents of bit 0 are copied to the Carry flag. Bit 7 remains unchanged.
* Bit 0 is the least-significant bit.
* Clock: 4T
*/
function sra_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const nShifted = get_shifted_sra(n);
    mem[hl] = nShifted;
}

/**
* SRA (IX + d)
* 
* An arithmetic shift right 1 bit position is performed on the the contents of the memory address
* specified by the contents of index register IX. 
* The contents of bit 0 are copied to the Carry flag. Bit 7 remains unchanged.
* Bit 0 is the least-significant bit.
* Clock: 6T
*/
function sra_ptrIXd(d) {
    const ix = r16.get(i16.IX);
    const n = mem[ix + d];
    const nShifted = get_shifted_sra(n);
    mem[ix + d] = nShifted;
}

/**
* SRA (IY + d)
* 
* An arithmetic shift right 1 bit position is performed on the the contents of the memory address
* specified by the contents of index register IY. 
* The contents of bit 0 are copied to the Carry flag. Bit 7 remains unchanged.
* Bit 0 is the least-significant bit.
* Clock: 6T
*/
function sra_ptrIYd(d) {
    const iy = r16.get(i16.IY);
    const n = mem[iy + d];
    const nShifted = get_shifted_sra(n);
    mem[iy + d] = nShifted;
}

module.exports = {
    rlca,
    rlc_r,
    rlc_ptrHL,
    rlc_ptrIXd,
    rlc_ptrIYd,
    rl_r,
    rl_ptrHL,
    rl_ptrIXd,
    rl_ptrIYd,
    rla,
    rrca,
    rrc_r,
    rrc_ptrHL,
    rrc_ptrIXd,
    rrc_ptrIYd,
    rra,
    rr_r,
    rr_ptrHL,
    rr_ptrIXd,
    rr_ptrIYd,
    sla_r,
    sla_ptrHL,
    sla_ptrIXd,
    sla_ptrIYd,
    sra_r,
    sra_ptrHL,
    sra_ptrIXd,
    sra_ptrIYd,
    setCPU
}