/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 144 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU = {};
let r8, i8, r16, i16, flags, fi, regsSp, mem;
const setCPU = (cpu) => {
    CPU = cpu;
    mem = CPU.memory;
    r8 = CPU.registers.regs8;
    i8 = r8.idx;
    r16 = CPU.registers.regs16;
    i16 = r16.idx;
    regsSp = CPU.registers.regsSp;
    flags = CPU.registers.flags;
    fi = flags.idx;
}

/**
* ADD A, r
* 
* The contents of register r are added to the contents of the Accumulator, and the result is
* stored in the Accumulator. The r symbol identifies the registers A, B, C, D, E, H, or L,
* Clock: 4T
*/
function add_A_r(rIndex) {
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
* Clock: 7T
*/
function add_A_n(n) {
    const a = r8.get(i8.A);
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* ADD A, (HL)
* 
* The byte at the memory address specified by the contents of the HL register pair is added
* to the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 7T
*/
function add_A_ptrHL() {
    const a = r8.get(i8.A);
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* ADD A, (IX + d)
* 
* The contents of the Index (register pair IX) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then added to
* the contents of the Accumulator and the result is stored in the Accumulator.
* Clock: 19T
*/
function add_A_ptrIXplusd(d) {
    const a = r8.get(i8.A);
    const ix = regsSp.IX;
    const n = mem[ix + d];
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* ADD A, (IY + d)
* 
* The contents of the Index (register pair IY) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then added to
* the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function add_A_ptrIYplusd(d) {
    const a = r8.get(i8.A);
    const iy = regsSp.IY;
    const n = mem[iy + d];
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* ADC A, r
* 
* The r operand, along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 4T
*/
function adc_A_r(rIndex) {
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
* Clock: 7T
*/
function adc_A_n(n) {
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    n += c;
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* ADC A, (HL)
* 
* The content of memory address (HL), along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 7T
*/
function adc_A_ptrHL() {
    const hl = r16.get(i16.HL);
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    const n = mem[hl] + c;
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* ADC A, (IX + d)
* 
* The content of memory address(IX + d), along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function adc_A_ptrIXplusd(d) {
    const ix = regsSp.IX;
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    const n = mem[ix + d] + c;
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* ADC A, (IY + d)
* 
* The content of memory address(IY + d), along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function adc_A_ptrIYplusd(d) {
    const iy = regsSp.IY;
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    const n = mem[iy + d] + c;
    r8.set(i8.A, a + n);
    let f = CPU.tables.addFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SUB A, r
* 
* The contents of register r are substracted to the contents of the Accumulator, and the result is
* stored in the Accumulator. The r symbol identifies the registers A, B, C, D, E, H, or L,
* Clock: 4T
*/
function sub_A_r(rIndex) {
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
* Clock: 7T
*/
function sub_A_n(n) {
    const a = r8.get(i8.A);
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SUB A, (HL)
* 
* The byte at the memory address specified by the contents of the HL register pair is substracted
* to the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 7T
*/
function sub_A_ptrHL() {
    const a = r8.get(i8.A);
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SUB A, (IX + d)
* 
* The contents of the Index (register pair IX) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then substracted 
* to the contents of the Accumulator and the result is stored in the Accumulator.
* Clock: 19T
*/
function sub_A_ptrIXplusd(d) {
    const a = r8.get(i8.A);
    const ix = regsSp.IX;
    const n = mem[ix + d];
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SUB A, (IY + d)
* 
* The contents of the Index (register pair IY) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then substracted
* to the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function sub_A_ptrIYplusd(d) {
    const a = r8.get(i8.A);
    const iy = regsSp.IY;
    const n = mem[iy + d];
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SBC A, r
* 
* The r operand, along with the Carry Flag (C in the F Register) is substracted to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 4T
*/
function sbc_A_r(rIndex) {
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
* Clock: 7T
*/
function sbc_A_n(n) {
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    n += c;
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SBC A, (HL)
* 
* The content of memory address (HL), along with the Carry Flag (C in the F Register) is substracted to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 7T
*/
function sbc_A_ptrHL() {
    const hl = r16.get(i16.HL);
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    const n = mem[hl] + c;
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SBC A, (IX + d)
* 
* The content of memory address(IX + d), along with the Carry Flag (C in the F Register) is substracted 
* to the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function sbc_A_ptrIXplusd(d) {
    const ix = regsSp.IX;
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    const n = mem[ix + d] + c;
    r8.set(i8.A, a - n);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
}

/**
* SBC A, (IY + d)
* 
* The content of memory address(IY + d), along with the Carry Flag (C in the F Register) is substracted 
* to the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function sbc_A_ptrIYplusd(d) {
    const iy = regsSp.IY;
    const c = flags.get(fi.C);
    const a = r8.get(i8.A);
    const n = mem[iy + d] + c;
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
* Clock: 4T
*/
function and_r(rIndex) {
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
* Clock: 7T
*/
function and_n(n) {
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
* Clock: 7T
*/
function and_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const a = r8.get(i8.A);
    let f = CPU.tables.andFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a & n);
}

/**
* AND (IX + d)
* 
* A logical AND operation is performed between the byte located at (IX + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function and_ptrIXplusd(d) {
    const ix = regsSp.IX;
    const n = mem[ix + d];
    const a = r8.get(i8.A);
    let f = CPU.tables.andFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a & n);
}

/**
* AND (IY + d)
* 
* A logical AND operation is performed between the byte located at (IY + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function and_ptrIYplusd(d) {
    const iy = regsSp.IY;
    const n = mem[iy + d];
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
* Clock: 4T
*/
function or_r(rIndex) {
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
* Clock: 7T
*/
function or_n(n) {
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
* Clock: 7T
*/
function or_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const a = r8.get(i8.A);
    let f = CPU.tables.orFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a | n);
}

/**
* OR (IX + d)
* 
* A logical OR operation is performed between the byte located at (IX + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function or_ptrIXplusd(d) {
    const ix = regsSp.IX;
    const n = mem[ix + d];
    const a = r8.get(i8.A);
    let f = CPU.tables.orFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a | n);
}

/**
* OR (IY + d)
* 
* A logical OR operation is performed between the byte located at (IY + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function or_ptrIYplusd(d) {
    const iy = regsSp.IY;
    const n = mem[iy + d];
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
* Clock: 4T
*/
function xor_r(rIndex) {
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
* Clock: 7T
*/
function xor_n(n) {
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
* Clock: 7T
*/
function xor_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    const a = r8.get(i8.A);
    let f = CPU.tables.xorFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a ^ n);
}

/**
* XOR (IX + d)
* 
* A logical XOR operation is performed between the byte located at (IX + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function xor_ptrIXplusd(d) {
    const ix = regsSp.IX;
    const n = mem[ix + d];
    const a = r8.get(i8.A);
    let f = CPU.tables.xorFlagsTable[(a << 8) | n];
    r8.set(i8.F, f);
    r8.set(i8.A, a ^ n);
}

/**
* XOR (IY + d)
* 
* A logical XOR operation is performed between the byte located at (IY + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function xor_ptrIYplusd(d) {
    const iy = regsSp.IY;
    const n = mem[iy + d];
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
* Clock: 4T
*/
function cp_r(rIndex) {
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
* Clock: 7T
*/
function cp_n(n) {
    const a = r8.get(i8.A);
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (r & 0b00101000); // Overwrites flags F3 and F5 from operand r
    r8.set(i8.F, f);
}

/**
* CP (HL)
* 
* The content of HL memory address is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
* Clock: 7T
*/
function cp_ptrHL() {
    const a = r8.get(i8.A);
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (r & 0b00101000); // Overwrites flags F3 and F5 from operand r
    r8.set(i8.F, f);
}

/**
* CP (IX + d)
* 
* The content of (IX + d) memory address is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
* Clock: 19T
*/
function cp_ptrIXplusd(d) {
    const a = r8.get(i8.A);
    const ix = regsSp.IX;
    const n = mem[ix + d];
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (r & 0b00101000); // Overwrites flags F3 and F5 from operand r
    r8.set(i8.F, f);
}

/**
* CP (IY + d)
* 
* The content of (IY + d) memory address is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
* Clock: 19T
*/
function cp_ptrIYplusd(d) {
    const a = r8.get(i8.A);
    const iy = regsSp.IY;
    const n = mem[iy + d];
    let f = CPU.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (r & 0b00101000); // Overwrites flags F3 and F5 from operand r
    r8.set(i8.F, f);
}

function setFlagsIncDec(n, VLimit){
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
* Clock: 4T
*/
function inc_r(rIndex) {
    const r = r8.get(rIndex);
    setFlagsIncDec(r, 0x7f);
    r8.set(rIndex, r + 1);
}

/**
* INC (HL)
* 
* The byte contained in the address specified by the contents of the HL register pair is incremented.
* Clock: 11T
*/
function inc_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    setFlagsIncDec(n, 0x7f);
    mem[hl] = n + 1;
}

/**
* INC (IX + d)
* 
* The byte contained in the address specified by the contents of (IX + d) is incremented.
* Clock: 23T
*/
function inc_ptrIXplusd(d) {
    const ix = regsSp.IX;
    const n = mem[ix + d];
    setFlagsIncDec(n, 0x7f);
    mem[ix + d] = n + 1;
}

/**
* INC (IY + d)
* 
* The byte contained in the address specified by the contents of (IY + d) is incremented.
* Clock: 23T
*/
function inc_ptrIYplusd(d) {
    const iy = regsSp.IY;
    const n = mem[iy + d];
    setFlagsIncDec(n, 0x7f);
    mem[iy + d] = n + 1;
}

/**
* DEC r
* 
* Register r is decremented and register r identifies any of the registers A, B, C, D, E, H, or L.
* Clock: 4T
*/
function dec_r(rIndex) {
    const r = r8.get(rIndex);
    setFlagsIncDec(r, 0x80);
    r8.set(rIndex, r - 1);
}

/**
* DEC (HL)
* 
* The byte contained in the address specified by the contents of the HL register pair is decremented.
* Clock: 11T
*/
function dec_ptrHL() {
    const hl = r16.get(i16.HL);
    const n = mem[hl];
    setFlagsIncDec(n, 0x80);
    mem[hl] = n - 1;
}

/**
* DEC (IX + d)
* 
* The byte contained in the address specified by the contents of (IX + d) is decremented.
* Clock: 23T
*/
function dec_ptrIXplusd(d) {
    const ix = regsSp.IX;
    const n = mem[ix + d];
    setFlagsIncDec(n, 0x80);
    mem[ix + d] = n - 1;
}

/**
* DEC (IY + d)
* 
* The byte contained in the address specified by the contents of (IY + d) is incremented.
* Clock: 23T
*/
function dec_ptrIYplusd(d) {
    const iy = regsSp.IY;
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
    inc_ptrIXplusd,
    inc_ptrIYplusd,
    dec_r,
    dec_ptrHL,
    dec_ptrIXplusd,
    dec_ptrIYplusd,
    setCPU
}