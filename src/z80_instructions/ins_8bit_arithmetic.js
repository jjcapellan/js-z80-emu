/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 144 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU, r8, i8, r16, i16, flags, fi, mem;
function setCPU(data){
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
 * Helper for ADD A, (XX)
 */
function add_A_ptrXXplusd(xxIndex, d) {
    const a = r8.get(i8.A);
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
};

/**
* ADD A, (HL)
* 
* The byte at the memory address specified by the contents of the HL register pair is added
* to the contents of the Accumulator, and the result is stored in the Accumulator.
*/
function add_A_ptrHL() {
    CPU.tCycles += 7;
    add_A_ptrXXplusd(i16.HL, 0);
}

/**
* ADD A, (IX + d)
* 
* The contents of the Index (register pair IX) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then added to
* the contents of the Accumulator and the result is stored in the Accumulator.
*/
function add_A_ptrIXplusd(d) {
    CPU.tCycles += 19;
    add_A_ptrXXplusd(i16.IX, d);
}

/**
* ADD A, (IY + d)
* 
* The contents of the Index (register pair IY) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then added to
* the contents of the Accumulator, and the result is stored in the Accumulator.
*/
function add_A_ptrIYplusd(d) {
    CPU.tCycles += 19;
    add_A_ptrXXplusd(i16.IY, d);
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
 * Helper function for ADC A, (XX) 
 */
function adc_A_ptrXXplusd(xxIndex, d) {
    const xx = r16.get(xxIndex);
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    const n = mem[xx + d] + c;
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* ADC A, (HL)
* 
* The content of memory address (HL), along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
*/
function adc_A_ptrHL() {
    CPU.tCycles += 7;
    adc_A_ptrXXplusd(i16.HL, 0);
}

/**
* ADC A, (IX + d)
* 
* The content of memory address(IX + d), along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
*/
function adc_A_ptrIXplusd(d) {
    CPU.tCycles += 19;
    adc_A_ptrXXplusd(i16.IX, d);
}

/**
* ADC A, (IY + d)
* 
* The content of memory address(IY + d), along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
*/
function adc_A_ptrIYplusd(d) {
    CPU.tCycles += 19;
    adc_A_ptrXXplusd(i16.IY, d);
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
 * Helper function for SUB A, (XX)
 */
function sub_A_ptrXXplusd(xxIndex, d) {
    const a = r8.get(i8.A);
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SUB A, (HL)
* 
* The byte at the memory address specified by the contents of the HL register pair is substracted
* to the contents of the Accumulator, and the result is stored in the Accumulator.
*/
function sub_A_ptrHL() {
    CPU.tCycles += 7;
    sub_A_ptrXXplusd(i16.HL, 0);
}

/**
* SUB A, (IX + d)
* 
* The contents of the Index (register pair IX) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then substracted 
* to the contents of the Accumulator and the result is stored in the Accumulator.
*/
function sub_A_ptrIXplusd(d) {
    CPU.tCycles += 19;
    sub_A_ptrXXplusd(i16.IX, d);
}

/**
* SUB A, (IY + d)
* 
* The contents of the Index (register pair IY) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then substracted
* to the contents of the Accumulator, and the result is stored in the Accumulator.
*/
function sub_A_ptrIYplusd(d) {
    CPU.tCycles += 19;
    sub_A_ptrXXplusd(i16.IY, d);
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
 * Helper function for SBC A, (XX)
 */
function sbc_A_ptrXXplusd(xxIndex, d) {
    const xx = r16.get(xxIndex);
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    const n = mem[xx + d] + c;
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SBC A, (HL)
* 
* The content of memory address (HL), along with the Carry Flag (C in the F Register) is substracted to the contents of
* the Accumulator, and the result is stored in the Accumulator.
*/
function sbc_A_ptrHL() {
    CPU.tCycles += 7;
    sbc_A_ptrXXplusd(i16.HL, 0);
}

/**
* SBC A, (IX + d)
* 
* The content of memory address(IX + d), along with the Carry Flag (C in the F Register) is substracted 
* to the contents of the Accumulator, and the result is stored in the Accumulator.
*/
function sbc_A_ptrIXplusd(d) {
    CPU.tCycles += 19;
    sbc_A_ptrXXplusd(i16.IX, d);
}

/**
* SBC A, (IY + d)
* 
* The content of memory address(IY + d), along with the Carry Flag (C in the F Register) is substracted 
* to the contents of the Accumulator, and the result is stored in the Accumulator.
*/
function sbc_A_ptrIYplusd(d) {
    CPU.tCycles += 19;
    sbc_A_ptrXXplusd(i16.IY, d);
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
 * Helper function for AND (XX)
 */
function and_ptrXXplusd(xxIndex, d) {
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const a = r8.get(i8.A);
    let f = CPU.tables.andFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a & n);
}

/**
* AND (HL)
* 
* A logical AND operation is performed between the byte located at HL memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function and_ptrHL() {
    CPU.tCycles += 7;
    and_ptrXXplusd(i16.HL, 0);
}

/**
* AND (IX + d)
* 
* A logical AND operation is performed between the byte located at (IX + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function and_ptrIXplusd(d) {
    CPU.tCycles += 19;
    and_ptrXXplusd(i16.IX, d);
}

/**
* AND (IY + d)
* 
* A logical AND operation is performed between the byte located at (IY + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function and_ptrIYplusd(d) {
    CPU.tCycles += 19;
    and_ptrXXplusd(i16.IY, d);
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
 * Helper function for OR (XX)
 */
function or_ptrXXplusd(xxIndex, d) {
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const a = r8.get(i8.A);
    let f = CPU.tables.orFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a | n);
}

/**
* OR (HL)
* 
* A logical OR operation is performed between the byte located at HL memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function or_ptrHL() {
    CPU.tCycles += 7;
    or_ptrXXplusd(i16.HL, 0);
}

/**
* OR (IX + d)
* 
* A logical OR operation is performed between the byte located at (IX + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function or_ptrIXplusd(d) {
    CPU.tCycles += 19;
    or_ptrXXplusd(i16.IX, d);
}

/**
* OR (IY + d)
* 
* A logical OR operation is performed between the byte located at (IY + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function or_ptrIYplusd(d) {
    CPU.tCycles += 19;
    or_ptrXXplusd(i16.IY, d);
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
 * Helper function for XOR (XX)
 */
function xor_ptrXXplusd(xxIndex, d) {
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    const a = r8.get(i8.A);
    let f = CPU.tables.xorFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a ^ n);
}

/**
* XOR (HL)
* 
* A logical XOR operation is performed between the byte located at HL memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function xor_ptrHL() {
    CPU.tCycles += 7;
    xor_ptrXXplusd(i16.HL, 0);
}

/**
* XOR (IX + d)
* 
* A logical XOR operation is performed between the byte located at (IX + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function xor_ptrIXplusd(d) {
    CPU.tCycles += 19;
    xor_ptrXXplusd(i16.IX, d);
}

/**
* XOR (IY + d)
* 
* A logical XOR operation is performed between the byte located at (IY + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
*/
function xor_ptrIYplusd(d) {
    CPU.tCycles += 19;
    xor_ptrXXplusd(i16.IY, d);
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
 * Helper function for CP (XX)
 */
function cp_ptrXXplusd(xxIndex, d) {
    const a = r8.get(i8.A);
    const xx = r16.get(xxIndex);
    const n = mem[xx + d];
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (n & 0b00101000); // Overwrites flags F3 and F5 from operand n
    r8.set(i8.F, f);
}
/**
* CP (HL)
* 
* The content of HL memory address is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
*/
function cp_ptrHL() {
    CPU.tCycles += 7;
    cp_ptrXXplusd(i16.HL, 0);
}

/**
* CP (IX + d)
* 
* The content of (IX + d) memory address is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
*/
function cp_ptrIXplusd(d) {
    CPU.tCycles += 19;
    cp_ptrXXplusd(i16.IX, d);
}

/**
* CP (IY + d)
* 
* The content of (IY + d) memory address is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
*/
function cp_ptrIYplusd(d) {
    CPU.tCycles += 19;
    cp_ptrXXplusd(i16.IY, d);
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
* INC (HL)
* 
* The byte contained in the address specified by the contents of the HL register pair is incremented.
*/
function inc_ptrHL() {
    CPU.tCycles += 11;
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    setFlagsIncDec(n, 0x7f);
    mem[hl] = n + 1;
}

/**
* Helper for inc_ptrIXplusd and inc_ptrIYplusd
*/
function inc_ptrXYplusd(xyIndex, d) {
    CPU.tCycles += 23;
    const ix = r16.get(i16.IX);
    const n = mem[ix + d];
    setFlagsIncDec(n, 0x7f);
    mem[ix + d] = n + 1;
}


/**
* INC (IX + d)
* 
* The byte contained in the address specified by the contents of (IX + d) is incremented.
*/
function inc_ptrIXplusd(d) {
    inc_ptrXYplusd(i16.IX, d);
}

/**
* INC (IY + d)
* 
* The byte contained in the address specified by the contents of (IY + d) is incremented.
*/
function inc_ptrIYplusd(d) {
    inc_ptrXYplusd(i16.IY, d);
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
* DEC (HL)
* 
* The byte contained in the address specified by the contents of the HL register pair is decremented.
*/
function dec_ptrHL() {
    CPU.tCycles += 11;
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    setFlagsIncDec(n, 0x80);
    mem[hl] = n - 1;
}

/**
* DEC (IX + d)
* 
* The byte contained in the address specified by the contents of (IX + d) is decremented.
*/
function dec_ptrIXplusd(d) {
    CPU.tCycles += 23;
    const ix = r16.get(i16.IX);
    const n = mem[ix + d];
    setFlagsIncDec(n, 0x80);
    mem[ix + d] = n - 1;
}

/**
* DEC (IY + d)
* 
* The byte contained in the address specified by the contents of (IY + d) is incremented.
*/
function dec_ptrIYplusd(d) {
    CPU.tCycles += 23;
    const iy = r16.get(i16.IY);
    const n = mem[iy + d];
    setFlagsIncDec(n, 0x80);
    mem[iy + d] = n - 1;
}

module.exports = {
    add_A_r,
    add_A_n,
    add_A_ptrHL,
    add_A_ptrIXplusd,
    add_A_ptrIYplusd,
    adc_A_r,
    adc_A_n,
    adc_A_ptrHL,
    adc_A_ptrIXplusd,
    adc_A_ptrIYplusd,
    sub_A_r,
    sub_A_n,
    sub_A_ptrHL,
    sub_A_ptrIXplusd,
    sub_A_ptrIYplusd,
    sbc_A_r,
    sbc_A_n,
    sbc_A_ptrHL,
    sbc_A_ptrIXplusd,
    sbc_A_ptrIYplusd,
    and_r,
    and_n,
    and_ptrHL,
    and_ptrIXplusd,
    and_ptrIYplusd,
    or_r,
    or_n,
    or_ptrHL,
    or_ptrIXplusd,
    or_ptrIYplusd,
    xor_r,
    xor_n,
    xor_ptrHL,
    xor_ptrIXplusd,
    xor_ptrIYplusd,
    cp_r,
    cp_n,
    cp_ptrHL,
    cp_ptrIXplusd,
    cp_ptrIYplusd,
    inc_r,
    inc_ptrHL,
    inc_ptrXYplusd,
    inc_ptrIXplusd,
    inc_ptrIYplusd,
    dec_r,
    dec_ptrHL,
    dec_ptrIXplusd,
    dec_ptrIYplusd,
    setCPU
}