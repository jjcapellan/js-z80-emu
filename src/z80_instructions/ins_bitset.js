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
* Clock: 8T
*/
function bit_b_r(b, rIndex) {
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
* Clock: 12T
*/
function bit_b_ptrHL(b) {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const z = ((n & (1 << b)) == 0) ? true : false;
    let f = createFlags(
        flags.get(fi.C),
        false,
        z,
        (n & (1 << fi.F3)) != 0,
        true,
        (n & (1 << fi.F5)) != 0,
        z,
        (b == 7) && (z == 0)
    );
    r8.set(i8.F, f);
}
    
    
module.exports = {
    bit_b_r,
    bit_b_ptrHL,
    setCPU
}