/**
 * This file implements Z80 input/output instructions group
 * Info on page 294 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU, r8, i8, r16, i16, flags, fi, mem, ports;
function setCPU(data) {
    ({ CPU, r8, i8, r16, i16, flags, fi, mem, ports } = data);
}

function createFlags(C, N, PV, F3, H, F5, Z, S) {
    return (S << 7) | (Z << 6) | (F5 << 5) | (H << 4) |
        (F3 << 3) | (PV << 2) | (N << 1) | C;
}

/**
* IN A, n
* 
* The operand n is placed on the bottom half (A0 through A7) of the address bus to select
* the I/O device at one of 256 (*1) possible ports. The contents of the Accumulator also appear
* on the top half (A8 through A15) of the address bus at this time. Then one byte from the
* selected port is placed on the data bus and written to the Accumulator (Register A) in the
* CPU.
* 1*) In fact 16bit port address is used (A*256 + n)
* Clock: 11T
*/
function in_A_n(n) {
    const a = r8.get(i8.A);
    r8.set(i8.A, ports[a * 256 + n]);
}

/**
* IN r, (C)
* 
* The contents of Register C are placed on the bottom half (A0 through A7) of the address
* bus to select the I/O device at one of 256 (*1) possible ports. The contents of Register B are
* placed on the top half (A8 through A15) of the address bus at this time. Then one byte
* from the selected port is placed on the data bus and written to register r in the CPU.
* Register r identifies any of the CPU registers. The flags are affected, checking the input data.
* 1*) In fact 16bit port address is used (BC)
* Clock: 12T
*/
function in_r_C(rIndex) {
    const bc = r16.get(i16.BC);
    const n = ports[bc];
    r8.set(rIndex, n);

    const f = createFlags(
        flags.get(fi.C),
        false,
        CPU.tables.parityTable[n],
        (n & (1 << fi.F3)) != 0,
        false,
        (n & (1 << fi.F5)) != 0,
        n == 0,
        (n & 0x80) != 0
    );
    r8.set(fi.F, f);
}