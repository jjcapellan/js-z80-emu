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
    CPU.tCycles += 8;
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
* BIT b, (XX) ---> BIT b, (HL) ; BIT b, (IX + d) ; BIT b, (IY + d)
* 
* This instruction tests bit b in the memory location specified by (XX) and sets the Z flag accordingly.
*/
function bit_b_ptrXXplusd(xxIndex, b, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
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
    CPU.tCycles += 8;
    r8.set(rIndex, set_bit(b, r8.get(rIndex)));
}

/**
* SET b, (XX) ---> SET b, (HL) ; SET b, (IX + d) ; SET b, (IY + d)
* 
* Bit b in the memory location addressed by (XX) is set.
*/
function set_b_ptrXXplusd(xxIndex, b, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    let n = mem[xx + d];
    mem[xx + d] = set_bit(b, n);
}

/**
 * Helper function for RES instructions
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
    CPU.tCycles += 8;
    r8.set(rIndex, reset_bit(b, r8.get(rIndex)));
}

/**
* RES b, (XX) ---> RES b, (HL) ; RES b, (IX + d) ; RES b, (IY + d)
* 
* Bit b in the memory location addressed by (XX) is reset.
*/
function res_b_ptrXXplusd(xxIndex, b, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    let n = mem[xx + d];
    mem[xx + d] = reset_bit(b, n);
}

module.exports = {
    bit_b_r,
    bit_b_ptrXXplusd,
    set_b_r,
    set_b_ptrXXplusd,
    res_b_r,
    res_b_ptrXXplusd,
    setCPU
}