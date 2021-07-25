/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 144 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU, r8, i8, r16, i16, flags, fi, mem;
function setCPU(data) {
    ({ CPU, r8, i8, r16, i16, flags, fi, mem } = data);
}

/**
* ADD A, r
* 
* The contents of register r are added to the contents of the Accumulator, and the result is
* stored in the Accumulator. The r symbol identifies the registers A, B, C, D, E, H, or L.
*/
function add_A_r(rIndex) {
    CPU.tCycles += 4;
    const r = r8.get(rIndex);
    const a = r8.get(i8.A);
    r8.set(i8.A, a + r);
    let f = CPU.tables.addFlagsTable[(a << 8) | r];
    r8.set(i8.F, f);
}

/**
* ADD A, n
* 
* The n integer is added to the contents of the Accumulator, and the results are stored in the
* Accumulator.
*/
function add_A_n(n) {
    CPU.tCycles += 7;
    const a = r8.get(i8.A);
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
 * ADD A, (XX + d) ---> ADD A, (HL) ; ADD A, (IX + d) ; ADD A, (IY + d)
 * 
 * The byte at the memory address specified by the contents of the (XX register + d) is added
 * to the contents of the Accumulator, and the result is stored in the Accumulator.
 * XX can be HL, IX or IY.
 */
function add_A_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const a = r8.get(i8.A);
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* ADC A, r
* 
* The r operand, along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
*/
function adc_A_r(rIndex) {
    CPU.tCycles += 4;
    const c = flags.get(fi.C);
    const r = r8.get(rIndex);
    const a = r8.get(i8.A);
    const n = r + c;
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* ADC A, n
* 
* The n operand, along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
*/
function adc_A_n(n) {
    CPU.tCycles += 7;
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    n += c;
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
 * ADC A, (XX) ---> ADC A, (HL) ; ADC A, (IX + d) ; ADC A, (IY + d)
 * 
 * The content of memory address (XX + d), along with the Carry Flag (C in the F Register) is added to the contents of
 * the Accumulator, and the result is stored in the Accumulator.
 * XX can be HL, IX or IY.
 */
function adc_A_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    const n = mem[xx + d] + c;
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SUB A, r
* 
* The contents of register r are substracted to the contents of the Accumulator, and the result is
* stored in the Accumulator. The r symbol identifies the registers A, B, C, D, E, H, or L,
*/
function sub_A_r(rIndex) {
    CPU.tCycles += 4;
    const r = r8.get(rIndex);
    const a = r8.get(i8.A);
    r8.set(i8.A, a - r);
    let f = CPU.tables.subFlagsTable[(a << 8) | r];
    r8.set(i8.F, f);
}

/**
* SUB A, n
* 
* The n integer is substracted to the contents of the Accumulator, and the results are stored in the
* Accumulator.
*/
function sub_A_n(n) {
    CPU.tCycles += 7;
    const a = r8.get(i8.A);
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
 * SUB A, (XX) ---> SUB A, (HL) ; SUB A, (IX + d) ; SUB A, (IY + d)
 * 
 * The byte at the memory address specified by the contents of (XX + d) is substracted
 * to the contents of the Accumulator, and the result is stored in the Accumulator.
 * XX can be HL, IX or IY.
 */
function sub_A_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const a = r8.get(i8.A);
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SBC A, r
* 
* The r operand, along with the Carry Flag (C in the F Register) is substracted to the contents of
* the Accumulator, and the result is stored in the Accumulator.
*/
function sbc_A_r(rIndex) {
    CPU.tCycles += 4;
    const c = flags.get(fi.C);
    const r = r8.get(rIndex);
    const a = r8.get(i8.A);
    const n = r + c;
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SBC A, n
* 
* The n operand, along with the Carry Flag (C in the F Register) is substracted to the contents of
* the Accumulator, and the result is stored in the Accumulator.
*/
function sbc_A_n(n) {
    CPU.tCycles += 7;
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    n += c;
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
 * SBC A, (XX) ---> SBC A, (HL) ; SBC A, (IX + d) ; SBC A, (IY + d)
 * 
 * The content of memory address (HL), along with the Carry Flag (C in the F Register) is substracted to the contents of
 * the Accumulator, and the result is stored in the Accumulator.
 * XX can be HL, IX or IY.
 */
function sbc_A_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    const n = mem[xx + d] + c;
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* AND r
* 
* A logical AND operation is performed between the byte specified by the register r and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* r identifies registers B, C, D, E, H, L, or A.
*/
function and_r(rIndex) {
    CPU.tCycles += 4;
    const a = r8.get(i8.A);
    const r = r8.get(rIndex);
    let f = CPU.tables.andFlagsTable[(a << 8) | r];
    r8.set(i8.F, f);
    r8.set(i8.A, a & r);
}

/**
* AND n
* 
* A logical AND operation is performed between 8bit integer n and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function and_n(n) {
    CPU.tCycles += 7;
    const a = r8.get(i8.A);
    let f = CPU.tables.andFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a & n);
}

/**
 * AND (XX) ---> AND (HL) ; AND (IX + d) ; AND (IY + d)
 * 
 * A logical AND operation is performed between the byte located at (XX + d) memory address and the
 * byte contained in the Accumulator; the result is stored in the Accumulator.
 * XX can be HL, IX or IY.
 */
function and_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const a = r8.get(i8.A);
    let f = CPU.tables.andFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a & n);
}

/**
* OR r
* 
* A logical OR operation is performed between the byte specified by register r and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* r identifies registers B, C, D, E, H, L, or A.
*/
function or_r(rIndex) {
    CPU.tCycles += 4;
    const a = r8.get(i8.A);
    const r = r8.get(rIndex);
    let f = CPU.tables.orFlagsTable[(a << 8) | r];
    r8.set(i8.F, f);
    r8.set(i8.A, a | r);
}

/**
* OR n
* 
* A logical OR operation is performed between the byte n and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function or_n(n) {
    CPU.tCycles += 7;
    const a = r8.get(i8.A);
    let f = CPU.tables.orFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a | n);
}

/**
 * OR (XX) ---> OR (HL) ; OR (IX + d) ; OR (IY + d)
 * 
 * A logical OR operation is performed between the byte located at (XX + d) memory address and the
 * byte contained in the Accumulator; the result is stored in the Accumulator.
 * XX can be HL, IX or IY.
 */
function or_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const a = r8.get(i8.A);
    let f = CPU.tables.orFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a | n);
}

/**
* XOR r
* 
* A logical XOR operation is performed between the byte specified by register r and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* r identifies registers B, C, D, E, H, L, or A.
*/
function xor_r(rIndex) {
    CPU.tCycles += 4;
    const a = r8.get(i8.A);
    const r = r8.get(rIndex);
    let f = CPU.tables.xorFlagsTable[(a << 8) | r];
    r8.set(i8.F, f);
    r8.set(i8.A, a ^ r);
}

/**
* XOR n
* 
* A logical XOR operation is performed between the byte n and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function xor_n(n) {
    CPU.tCycles += 7;
    const a = r8.get(i8.A);
    let f = CPU.tables.xorFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a ^ n);
}

/**
 * XOR (XX) ---> XOR (HL) ; XOR (IX + d) ; XOR (IY + d)
 * 
 * A logical XOR operation is performed between the byte located at (XX + d) memory address and the
 * byte contained in the Accumulator; the result is stored in the Accumulator.
 * XX can be HL, IX or IY.
 */
function xor_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const a = r8.get(i8.A);
    let f = CPU.tables.xorFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a ^ n);
}

/**
* CP r
* 
* The contents of the register r operand are compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator. r identifies registers B, C, D, E, H, L, or A.
*/
function cp_r(rIndex) {
    CPU.tCycles += 4;
    const r = r8.get(rIndex);
    const a = r8.get(i8.A);
    let f = CPU.tables.subFlagsTable[(a << 8) | r];
    f = (f & 0b11010111) | (r & 0b00101000); // Overwrites flags F3 and F5 from operand r
    r8.set(i8.F, f);
}

/**
* CP n
* 
* The 8bit number n is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
*/
function cp_n(n) {
    CPU.tCycles += 7;
    const a = r8.get(i8.A);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (n & 0b00101000); // Overwrites flags F3 and F5 from operand r
    r8.set(i8.F, f);
}

/**
 * CP (XX) ---> CP (HL) ; CP (IX + d) ; CP (IY + d)
 * 
 * The content of (XX + d) memory address is compared with the contents of the Accumulator. If there
 * is a true compare, the Z flag is set. The execution of this instruction does not affect the
 * contents of the Accumulator.
 * XX can be HL, IX or IY.
 */
function cp_ptrXXplusd(xxIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const a = r8.get(i8.A);
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (n & 0b00101000); // Overwrites flags F3 and F5 from operand n
    r8.set(i8.F, f);
}

function setFlagsIncDec(n, VLimit) {
    const table = (VLimit == 0x7f) ? CPU.tables.addFlagsTable : CPU.tables.subFlagsTable;
    let f = r8.get(i8.F);
    const c = f & 0x1; // saves flag C, not affected
    const pv = (n == VLimit) ? 0b100 : 0;
    f = table[(n << 8) | 1];
    f |= (f & 0b11111011) | pv;
    f |= (f & 0b11111110) | c;
    r8.set(i8.F, f);;
}

/**
* INC r
* 
* Register r is incremented and register r identifies any of the registers A, B, C, D, E, H, or L.
*/
function inc_r(rIndex) {
    CPU.tCycles += 4;
    const r = r8.get(rIndex);
    setFlagsIncDec(r, 0x7f);
    r8.set(rIndex, r + 1);
}

/**
* INC (XX) ---> INC (HL) ; INC (IX + d) ; INC (IY + d)
* 
* The byte contained in the address specified by the contents of (XX + d) is incremented.
* XX can be HL, IX or IY.
*/
function inc_ptrXXplusd(xyIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xyIndex);
    const n = mem[xx + d];
    setFlagsIncDec(n, 0x7f);
    mem[xx + d] = n + 1;
}

/**
* DEC r
* 
* Register r is decremented and register r identifies any of the registers A, B, C, D, E, H, or L.
*/
function dec_r(rIndex) {
    CPU.tCycles += 4;
    const r = r8.get(rIndex);
    setFlagsIncDec(r, 0x80);
    r8.set(rIndex, r - 1);
}

/**
* DEC (XX) ---> DEC (HL) ; DEC (IX + d) ; DEC (IY + d)
*
* The byte contained in the address specified by the contents of (XX + d) is decremented.
* XX can be HL, IX or IY.
*/
function dec_ptrXXplusd(xyIndex, d, tCycles) {
    CPU.tCycles += tCycles;
    const ix = r16.get(xyIndex);
    const n = mem[ix + d];
    setFlagsIncDec(n, 0x80);
    mem[ix + d] = n - 1;
}

module.exports = {
    add_A_r,
    add_A_n,
    add_A_ptrXXplusd,
    adc_A_r,
    adc_A_n,
    adc_A_ptrXXplusd,
    sub_A_r,
    sub_A_n,
    sub_A_ptrXXplusd,
    sbc_A_r,
    sbc_A_n,
    sbc_A_ptrXXplusd,
    and_r,
    and_n,
    and_ptrXXplusd,
    or_r,
    or_n,
    or_ptrXXplusd,
    xor_r,
    xor_n,
    xor_ptrXXplusd,
    cp_r,
    cp_n,
    cp_ptrXXplusd,
    inc_r,
    inc_ptrXXplusd,
    dec_r,
    dec_ptrXXplusd,
    setCPU
}