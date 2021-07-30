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
    CPU.tCycles += 4;
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
        (nRotated & (1 << 7)) != 0
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
    CPU.tCycles += 8;
    const r = r8.get(rIndex);
    rRotated = get_rotated_rlc(r);
    r8.set(rIndex, rRotated);

}

/**
 * RLC (XX) ---> RLC (HL) ; RLC (IX + d) ; RLC (IY + d)
 * 
 * The contents of the memory address specified by the contents of (XX) are
 * rotated left 1 bit position. The contents of bit 7 are copied to the Carry flag and also to bit 0.
 * Bit 0 is the least-significant bit.
 */
function rlc_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const nRotated = get_rotated_rlc(n);
    mem[xx + d] = nRotated;
    return nRotated;
}

function rlc_ptrXXplusd_r(xxIndex, d, rIndex, tCycles){
    const nRotated = rlc_ptrXXplusd(xxIndex, d, tCycles);
    r8.set(rIndex, nRotated);
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
        (nRotated & (1 << 7)) != 0
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
    CPU.tCycles += 2;
    const r = r8.get(rIndex);
    rRotated = get_rotated_rl(r);
    r8.set(rIndex, rRotated);

}

/**
* RL (XX) ---> RL (HL) ; RL (IX + d) ; RL (IY + d)
* 
* The contents of the memory address specified by (XX) are rotated left 
* 1 bit position. The contents of bit 7 are copied to the Carry flag,
* and previus Carry flag to bit 0. Bit 0 is the least-significant bit.
*/
function rl_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const nRotated = get_rotated_rl(n);
    mem[xx + d] = nRotated;
    return nRotated;
}

function rl_ptrXXplusd_r(xxIndex, d, rIndex, tCycles){
    const nRotated = rl_ptrXXplusd(xxIndex, d, tCycles);
    r8.set(rIndex, nRotated);
}

/**
* RLA
* 
* The contents of the Accumulator (Register A) are rotated left 1 bit position through the
* Carry flag. The previous contents of the Carry flag are copied to bit 0. Bit 0 is the leastsignificant bit.
* Clock: 4T
*/
function rla() {
    CPU.tCycles += 4;
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
    CPU.tCycles += 4;
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
        (nRotated & (1 << 7)) != 0
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
    CPU.tCycles += 2;
    const r = r8.get(rIndex);
    rRotated = get_rotated_rrc(r);
    r8.set(rIndex, rRotated);
}

/**
* RRC (XX) ---> RRC (HL) ; RRC (IX + d) ; RRC (IY + d)
* 
* The contents of the memory address specified by (XX) are rotated right 
* 1 bit position. The contents of bit 0 are copied to the Carry flag and
* also to bit 7. Bit 0 is the least-significant bit.
*/
function rrc_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const nRotated = get_rotated_rrc(n);
    mem[xx + d] = nRotated;
    return nRotated;
}

function rrc_ptrXXplusd_r(xxIndex, d, rIndex, tCycles){
    const nRotated = rrc_ptrXXplusd(xxIndex, d, tCycles);
    r8.set(rIndex, nRotated);
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
    CPU.tCycles += 4;
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
        (nRotated & (1 << 7)) != 0
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
    CPU.tCycles += 2;
    const r = r8.get(rIndex);
    rRotated = get_rotated_rr(r);
    r8.set(rIndex, rRotated);
}

/**
* RR (XX) ---> RR (HL) ; RR (IX + d) ; RR (IY + d)
* 
* The contents of the memory address specified by (XX) are rotated right 
* 1 bit position through the Carry flag. The contents of bit 0 are copied
* to the Carry flag and the previous contents of the Carry flag are
* copied to bit 7. Bit 0 is the least-significant bit.
*/
function rr_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const nRotated = get_rotated_rr(n);
    mem[xx + d] = nRotated;
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
        (nShifted & (1 << 7)) != 0
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
    CPU.tCycles += 2;
    const r = r8.get(rIndex);
    const rShifted = get_shifted_sla(r);
    r8.set(rIndex, rShifted);
}

/**
* SLA (XX) ---> SLA (HL) ; SLA (IX + d) ; SLA (IY + d)
* 
* An arithmetic shift left 1 bit position is performed on the the contents
* of the memory address specified by the contents of (XX). 
* The contents of bit 7 are copied to the Carry flag.
* Bit 0 is the least-significant bit.
*/
function sla_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const nShifted = get_shifted_sla(n);
    mem[xx + d] = nShifted;
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
        (nShifted & (1 << 7)) != 0
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
    CPU.tCycles += 2;
    const r = r8.get(rIndex);
    const rShifted = get_shifted_sra(r);
    r8.set(rIndex, rShifted);
}

/**
* SRA (XX) ---> SRA (HL) ; SRA (IX + d) ; SRA (IY + d)
* 
* An arithmetic shift right 1 bit position is performed on the the contents of the memory address
* specified by (XX). 
* The contents of bit 0 are copied to the Carry flag. Bit 7 remains unchanged.
* Bit 0 is the least-significant bit.
*/
function sra_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const nShifted = get_shifted_sra(n);
    mem[xx + d] = nShifted;
}

/**
 * Helper function for SRL X
 * @param {number} n Byte
 * @returns {number} Byte shifted right
 */
function get_shifted_srl(n) {
    const bit0 = n & 1;
    const nShifted = n >> 1;
    const f = createFlags(
        bit0,
        false,
        CPU.tables.parityTable[nShifted],
        (nShifted & (1 << fi.F3)) != 0,
        false,
        (nShifted & (1 << fi.F5)) != 0,
        nShifted == 0,
        false
    );
    r8.set(i8.F, f);
    return nShifted;
}

/**
* SRL r
* 
* An arithmetic shift right 1 bit position is performed on the contents of register r.
* The contents of bit 0 are copied to the Carry flag.
* Bit 0 is the least-significant bit.
* Clock: 2T
*/
function srl_r(rIndex) {
    CPU.tCycles += 2;
    const r = r8.get(rIndex);
    const rShifted = get_shifted_srl(r);
    r8.set(rIndex, rShifted);
}

/**
* SRL (XX) ---> SRL (HL) ; SRL (IX + d) ; SRL (IY + d)
* 
* An arithmetic shift right 1 bit position is performed on the the contents of the memory address
* specified by (XX).
* The contents of bit 0 are copied to the Carry flag.
* Bit 0 is the least-significant bit.
*/
function srl_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const nShifted = get_shifted_srl(n);
    mem[xx + d] = nShifted;
}

/**
* RLD
* 
* The contents of the low-order four bits (bits 3, 2, 1, and 0) of the memory location (HL)
* are copied to the high-order four bits (7, 6, 5, and 4) of that same memory location (*1); the
* previous contents of those high-order four bits are copied to the low-order four bits of the
* Accumulator (Register A) (*2); and the previous contents of the low-order four bits of the
* Accumulator are copied to the low-order four bits of memory location (HL). The contents
* of the high-order bits of the Accumulator are unaffected.
* Clock: 18T
*/
function rld() {
    CPU.tCycles += 18;
    const hl = r16.get(i16.HL);
    let n = mem[hl];
    const nLow = n & 0xf;
    const nHigh = n >> 4;
    n = nLow | (nLow << 4); // (*1)

    let a = r8.get(i8.A);
    const aLow = a & 0xf;
    a = (a & 0xf0) | nHigh; // (*2)
    n = (n & 0xf0) | aLow; // (*3)

    const f = createFlags(
        flags.get(fi.C),
        false,
        CPU.tables.parityTable[a],
        (a & (1 << fi.F3)) != 0,
        false,
        (a & (1 << fi.F5)) != 0,
        a == 0,
        (a & (1 << 7)) != 0
    );

    r8.set(i8.F, f);
    r8.set(i8.A, a);
    mem[hl] = n;
}

/**
* RRD
* 
* The contents of the low-order four bits (bits 3, 2, 1, and 0) of memory location (HL) are
* copied to the low-order four bits of the Accumulator (Register A)(*1). The previous contents
* of the low-order four bits of the Accumulator are copied to the high-order four bits (7, 6, 5,
* and 4) of location (HL)(*2); and the previous contents of the high-order four bits of (HL) are
* copied to the low-order four bits of (HL)(*3). The contents of the high-order bits of the 
* Accumulator are unaffected.
* Clock: 18T
*/
function rrd() {
    CPU.tCycles += 18;
    const hl = r16.get(i16.HL);

    let n = mem[hl];
    let a = r8.get(i8.A);
    const nLow = n & 0xf;
    const nHigh = n >> 4;
    const aLow = a & 0xf;

    a = (a & 0xf0) | nLow;  // (*1)
    n = nLow | (aLow << 4); // (*2)
    n = (n & 0xf0) | nHigh; // (*3)

    const f = createFlags(
        flags.get(fi.C),
        false,
        CPU.tables.parityTable[a],
        (a & (1 << fi.F3)) != 0,
        false,
        (a & (1 << fi.F5)) != 0,
        a == 0,
        (a & (1 << 7)) != 0
    );

    r8.set(i8.F, f);
    r8.set(i8.A, a);
    mem[hl] = n;
}

const helpers = {
    get_rotated_rlc: get_rotated_rlc,
    get_rotated_rl: get_rotated_rl,
    get_rotated_rrc: get_rotated_rrc,
    get_rotated_rr: get_rotated_rr,
    get_shifted_sla: get_shifted_sla,
    get_shifted_sra: get_shifted_sra,
    get_shifted_srl: get_shifted_srl
}

module.exports = {
    rlca,
    rlc_r,
    rlc_ptrXXplusd,
    rlc_ptrXXplusd_r,
    rl_r,
    rl_ptrXXplusd,
    rl_ptrXXplusd_r,
    rla,
    rld,
    rrca,
    rrc_r,
    rrc_ptrXXplusd,
    rrc_ptrXXplusd_r,
    rra,
    rrd,
    rr_r,
    rr_ptrXXplusd,
    sla_r,
    sla_ptrXXplusd,
    sra_r,
    sra_ptrXXplusd,
    srl_r,
    srl_ptrXXplusd,
    helpers,
    setCPU
}