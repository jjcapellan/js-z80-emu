/**
 * This file implements Z80 bit set, reset, and test instructions group
 * Info on page 242 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * For BIT instructions flags see page 15 of 
 * [The undocumented Z0 by Sean Young](http://www.z80.info/zip/z80-documented.pdf)
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
* BIT b, r
* 
* This instruction tests bit b in register r and sets the Z flag accordingly.
*/
function bit_b_r(b, rIndex) {
    CPU.tCyles = 8;
    const r = r8.get(rIndex);
    const z = ((r & (1 << b)) == 0) ? true : false;
    let f = createFlags(
        flags.get(fi.C),
        false,
        z,
        ((r & (1 << fi.F3)) != 0) && (b == 3),
        true,
        ((r & (1 << fi.F5)) != 0) && (b == 5),
        z,
        (b == 7) && (z == 0)
    );
    r8.set(i8.F, f);
}

/**
* BIT b, (HL)
* 
* This instruction tests bit b in the memory location specified by the contents
* of the HL register pair and sets the Z flag accordingly.
*/
function bit_b_ptrHL(b) {
    CPU.tCyles = 12;
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const z = ((n & (1 << b)) == 0) ? true : false;
    let f = createFlags(
        flags.get(fi.C),
        false,
        z,
        ((n & (1 << fi.F3)) != 0) && (b == 3),
        true,
        ((n & (1 << fi.F5)) != 0) && (b == 5),
        z,
        (b == 7) && (z == 0)
    );
    r8.set(i8.F, f);
}

/**
* BIT b, (IX + d)
* 
* This instruction tests bit b in the memory location specified by the contents of register pair
* IX combined with the two’s complement displacement d and sets the Z flag accordingly.
*/
function bit_b_ptrIXplusd(b, d) {
    CPU.tCyles = 20;
    const ix = r16.get(i16.IX);
    const n = mem[ix + d];
    const z = ((n & (1 << b)) == 0) ? true : false;
    const ixdHigh = (ix + d) >> 8;
    let f = createFlags(
        flags.get(fi.C),
        false,
        z,
        ((ixdHigh & (1 << fi.F3)) != 0),
        true,
        ((ixdHigh & (1 << fi.F5)) != 0),
        z,
        (b == 7) && (z == 0)
    );
    r8.set(i8.F, f);
}

/**
* BIT b, (IY + d)
* 
* This instruction tests bit b in the memory location specified by the contents of register pair
* IY combined with the two’s complement displacement d and sets the Z flag accordingly.
*/
function bit_b_ptrIYplusd(b, d) {
    CPU.tCyles = 20;
    const iy = r16.get(i16.IY);
    const n = mem[iy + d];
    const z = ((n & (1 << b)) == 0) ? true : false;
    const iydHigh = (iy + d) >> 8;
    let f = createFlags(
        flags.get(fi.C),
        false,
        z,
        ((iydHigh & (1 << fi.F3)) != 0),
        true,
        ((iydHigh & (1 << fi.F5)) != 0),
        z,
        (b == 7) && (z == 0)
    );
    r8.set(i8.F, f);
}

/**
 * Helper for set instructions
 * @param {number} b Bit 0-7
 * @param {number} n Byte to set bit
 * @returns Byte
 */
function set_bit(b, n) {
    return n | (1 << b);
}

/**
* SET b, r
* 
* Bit b in register r (any of registers B, C, D, E, H, L, or A) is set.
*/
function set_b_r(b, rIndex) {
    CPU.tCyles = 8;
    r8.set(rIndex, set_bit(b, r8.get(rIndex)));
}

function set_bit_mem(b, rrIndex, d) {
    const rr = r16.get(rrIndex);
    let n = mem[rr + d];
    mem[rr + d] = set_bit(b, n);
}

/**
* SET b, (HL)
* 
* Bit b in the memory location addressed by the contents of register pair HL is set.
*/
function set_b_ptrHL(b) {
    CPU.tCyles = 15;
    set_bit_mem(b, i16.HL, 0);
}

/**
* SET b, (IX + d)
* 
* Bit b in the memory location addressed by the sum of the contents of the IX register pair
* and the two’s complement integer d is set.
*/
function set_b_ptrIXplusd(b, d) {
    CPU.tCyles = 23;
    set_bit_mem(b, i16.IX, d);
}

/**
* SET b, (IY + d)
* 
* Bit b in the memory location addressed by the sum of the contents of the IY register pair
* and the two’s complement integer d is set.
*/
function set_b_ptrIYplusd(b, d) {
    CPU.tCyles = 23;
    set_bit_mem(b, i16.IY, d);
}

/**
 * Helper function for RES instructions
 * @param {number} b 
 * @param {number} n 
 * @returns 
 */
function reset_bit(b, n) {
    return n & (0xff ^ (1 << b));
}

/**
* RES b, r
* 
* Bit b in register r (any of registers B, C, D, E, H, L, or A) is reset.
*/
function res_b_r(b, rIndex) {
    CPU.tCyles = 8;
    r8.set(rIndex, reset_bit(b, r8.get(rIndex)));
}

function reset_bit_mem(b, rrIndex, d) {
    const rr = r16.get(rrIndex);
    let n = mem[rr + d];
    mem[rr + d] = reset_bit(b, n);
}

/**
* RES b, (HL)
* 
* Bit b in the memory location addressed by the contents of register pair HL is reset.
*/
function res_b_ptrHL(b) {
    CPU.tCyles = 15;
    reset_bit_mem(b, i16.HL, 0);
}

/**
* RES b, (IX + d)
* 
* Bit b in the memory location addressed by the sum of the contents of the IX register pair
* and the two’s complement integer d is reset.
*/
function res_b_ptrIXplusd(b, d) {
    CPU.tCyles = 23;
    reset_bit_mem(b, i16.IX, d);
}

/**
* RES b, (IY + d)
* 
* Bit b in the memory location addressed by the sum of the contents of the IY register pair
* and the two’s complement integer d is reset.
*/
function res_b_ptrIYplusd(b, d) {
    CPU.tCyles = 23;
    reset_bit_mem(b, i16.IY, d);
}

module.exports = {
    bit_b_r,
    bit_b_ptrHL,
    bit_b_ptrIXplusd,
    bit_b_ptrIYplusd,
    set_b_r,
    set_b_ptrHL,
    set_b_ptrIXplusd,
    set_b_ptrIYplusd,
    res_b_r,
    res_b_ptrHL,
    res_b_ptrIXplusd,
    res_b_ptrIYplusd,
    setCPU
}