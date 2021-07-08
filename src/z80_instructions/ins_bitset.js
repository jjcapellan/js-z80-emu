/**
 * This file implements Z80 bit set, reset, and test instructions group
 * Info on page 242 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
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
* Clock: 8T
*/
function bit_b_r(b, rIndex) {
    const r = r8.get(rIndex);
    const bit = r & (1 << b);
    flags.set(fi.Z, bit);
}

module.exports = {
    setCPU
}