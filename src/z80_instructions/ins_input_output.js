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
    CPU.tCycles += 11;
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
    CPU.tCycles += 12;
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

/**
 * Helper function for ini() and ind()
 * @param {boolean} _isDec Is ind function?
 */
function in_id(_isDec) {
    const isDec = -_isDec;
    let hl = r16.get(i16.hl);
    const b = r8.get(i8.B);
    const c = r8.get(i8.C);
    r8.set(i8.B, b - 1);
    const bc = r16.get(i16.BC);
    const value = ports[bc];

    mem[hl] = value;
    r16.set(i16.HL, hl + 1 * isDec);

    const n = b - 1;
    const f = createFlags(
        value + ((c + 1 * isDec) & 0xff) > 0xff, // undocumented effect
        true,
        CPU.tables.parityTable[(((value + ((c + 1 * isDec) & 0xff)) & 7) ^ b)], // undocumented effect
        (n & (1 << fi.F3)) != 0,
        value + ((c + 1 * isDec) & 0xff) > 0xff, // undocumented effect
        (n & (1 << fi.F5)) != 0,
        n == 0,
        (n & 0x80) != 0
    );
    r8.set(fi.F, f);
}

/**
* INI
* 
* The contents of Register C are placed on the bottom half (A0 through A7) of the address
* bus to select the I/O device at one of 256 (*1) possible ports. Register B can be used as a byte
* counter, and its contents are placed on the top half (A8 through A15) of the address bus at
* this time. Then one byte from the selected port is placed on the data bus and written to the
* CPU. The contents of the HL register pair are then placed on the address bus and the input
* byte is written to the corresponding location of memory. Finally, the byte counter is 
* decremented and register pair HL is incremented.
* 1*) In fact 16bit port address is used (BC)
* Clock: 16T
*/
function ini() {
    CPU.tCycles += 16;
    in_id(false);
}

/**
* INIR
* 
* Works like INI with one repeat condition.
* The instruction is repeated while (B != 0)
* Clock: 21T(B != 0)    16T(B == 0)
*/
function inir() {
    const b = r8.get(i8.B);

    ini(); // 16 tCycles

    if ((b - 1) != 0) {
        CPU.tCycles += 5;
        r16.set(i16.PC, r16.get(i16.PC) - 2);
    }
}

/**
* IND
* 
* Works like INI, but instead of increment HL, HL is decremented.
* Flag effects are different.
* Clock: 16T
*/
function ind() {
    CPU.tCycles += 16;
    in_id(true);
}

/**
* INDR
* 
* Works like IND with one repeat condition.
* The instruction is repeated while (B != 0)
* Clock: 21T(B != 0)    16T(B == 0)
*/
function indr() {
    const b = r8.get(i8.B);

    ind(); // 16 tCycles

    if ((b - 1) != 0) {
        CPU.tCycles += 5;
        r16.set(i16.PC, r16.get(i16.PC) - 2);
    }
}

/**
* OUT (n), A
* Clock: 11T
*/
function out_n_A(n) {
    CPU.tCycles += 11;
    const a = r8.get(i8.A);
    const port = a * 256 + n;
    ports[port] = a;
}

/**
* OUT (C), r
* Clock: 12T
*/
function out_C_r(rIndex) {
    CPU.tCycles += 12;
    const bc = r16.get(i16.BC);
    const value = r8.get(rIndex);
    ports[bc] = value;
}

/**
 * Helper for outi(), outd()
 * @param {boolean} _isDec Is outd()
 */
function out_id(_isDec) {
    const isDec = -_isDec;
    let hl = r16.get(i16.hl);
    const b = r8.get(i8.B);
    const c = r8.get(i8.C);
    r8.set(i8.B, b - 1);
    const bc = r16.get(i16.BC);
    const value = mem[hl];

    ports[bc] = value;
    r16.set(i16.HL, hl + 1 * isDec);
    const l = r8.get(i8.L);

    const n = b - 1;
    const f = createFlags(
        (value + l) > 0xff, // undocumented effect
        true,
        CPU.tables.parityTable[(((value + l) & 7) ^ b)], // undocumented effect
        (n & (1 << fi.F3)) != 0,
        (value + l) > 0xff, // undocumented effect
        (n & (1 << fi.F5)) != 0,
        n == 0,
        (n & 0x80) != 0
    );
    r8.set(fi.F, f);
}

/**
* OUTI
* 
* The contents of the HL register pair are placed on the address bus to select a location in
* memory. The byte contained in this memory location is temporarily stored in the CPU.
* Then, after the byte counter (B) is decremented, the contents of Register C are placed on
* the bottom half (A0 through A7) of the address bus to select the I/O device at one of 256 (*1)
* possible ports. Register B can be used as a byte counter, and its decremented value is
* placed on the top half (A8 through A15) of the address bus. The byte to be output is placed
* on the data bus and written to a selected peripheral device. Finally, the register pair HL is
* incremented.
* 1*) In fact 16bit port address is used (BC)
* Clock: 16T
*/
function outi() {
    CPU.tCycles += 16;
    out_id(false);
}

/**
* OTIR
* 
* Works like OUTI with one repeat condition.
* The instruction is repeated while (B != 0)
* Clock: 21T(B != 0)    16T(B == 0)
*/
function otir() {
    const b = r8.get(i8.B);

    outi(); // 16 tCycles

    if ((b - 1) != 0) {
        CPU.tCycles += 5;
        r16.set(i16.PC, r16.get(i16.PC) - 2);
    }
}

/**
* OUTD
* 
* Works like OUTI, but instead increment HL, HL is decremented.
* Clock: 16T
*/
function outd() {
    CPU.tCycles += 16;
    out_id(true);
}

/**
* OUTDR
* 
* Works like OUTD with one repeat condition.
* The instruction is repeated while (B != 0)
* Clock: 21T(B != 0)    16T(B == 0)
*/
function outdr() {
    const b = r8.get(i8.B);

    outd(); // 16 tCycles

    if ((b - 1) != 0) {
        CPU.tCycles += 5;
        r16.set(i16.PC, r16.get(i16.PC) - 2);
    }
}

module.exports = {
    in_A_n,
    in_r_C,
    ini,
    inir,
    ind,
    indr,
    out_n_A,
    out_C_r,
    outi,
    otir,
    outd,
    outdr,
    setCPU
}