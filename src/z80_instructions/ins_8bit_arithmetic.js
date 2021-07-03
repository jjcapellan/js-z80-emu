/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 144 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const { regsSp, regs8 } = require("../z80_registers");

/**
* ADD A, r
* 
* The contents of register r are added to the contents of the Accumulator, and the result is
* stored in the Accumulator. The r symbol identifies the registers A, B, C, D, E, H, or L,
* Clock: 4T
*/
function add_A_r(cpu, rIndex) {
    const regs = cpu.registers.regs8;
    const r = regs.get(rIndex);
    const a = regs.get(regs.idx.A);
    regs.set(regs.idx.A, a + r);
    let f = cpu.tables.addFlagsTable[(a << 8) | r];
    regs8.set(regs8.idx.F, f);
}

/**
* ADD A, n
* 
* The n integer is added to the contents of the Accumulator, and the results are stored in the
* Accumulator.
* Clock: 7T
*/
function add_A_n(cpu, n) {
    const regs = cpu.registers.regs8;
    const a = regs.get(regs.idx.A);
    regs.set(regs.idx.A, a + n);

    let f = cpu.tables.addFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* ADD A, (HL)
* 
* The byte at the memory address specified by the contents of the HL register pair is added
* to the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 7T
*/
function add_A_ptrHL(cpu) {
    const regs = cpu.registers.regs8;
    const regs16 = cpu.registers.regs16;
    const a = regs.get(regs.idx.A);
    const hl = regs16.get(regs16.idx.HL);
    const n = cpu.memory[hl];
    regs.set(regs.idx.A, a + n);

    let f = cpu.tables.addFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* ADD A, (IX + d)
* 
* The contents of the Index (register pair IX) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then added to
* the contents of the Accumulator and the result is stored in the Accumulator.
* Clock: 19T
*/
function add_A_ptrIXplusd(cpu, d) {
    const regs = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;
    const a = regs.get(regs.idx.A);
    const ix = regsSp.IX;
    const n = cpu.memory[ix + d];
    regs.set(regs.idx.A, a + n);

    let f = cpu.tables.addFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* ADD A, (IY + d)
* 
* The contents of the Index (register pair IY) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then added to
* the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function add_A_ptrIYplusd(cpu, d) {
    const regs = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;
    const a = regs.get(regs.idx.A);
    const iy = regsSp.IY;
    const n = cpu.memory[iy + d];
    regs.set(regs.idx.A, a + n);

    let f = cpu.tables.addFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* ADC A, r
* 
* The r operand, along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 4T
*/
function adc_A_r(cpu, rIndex) {
    const regs = cpu.registers.regs8;
    const flags = cpu.registers.flags;
    const c = flags.get(flags.idx.C);
    const r = regs.get(rIndex);
    const a = regs.get(regs.idx.A);
    const n = r + c;
    regs.set(regs.idx.A, a + n);

    let f = cpu.tables.addFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* ADC A, n
* 
* The n operand, along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 7T
*/
function adc_A_n(cpu, n) {
    const regs = cpu.registers.regs8;
    const flags = cpu.registers.flags;
    const c = flags.get(flags.idx.C);
    const a = regs.get(regs.idx.A);
    n += c;
    regs.set(regs.idx.A, a + n);

    let f = cpu.tables.addFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* ADC A, (HL)
* 
* The content of memory address (HL), along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 7T
*/
function adc_A_ptrHL(cpu) {
    const regs8 = cpu.registers.regs8;
    const regs16 = cpu.registers.regs16;
    const flags = cpu.registers.flags;

    const hl = regs16.get(regs16.idx.HL);
    const c = flags.get(flags.idx.C);
    const a = regs8.get(regs8.idx.A);
    const n = cpu.memory[hl] + c;

    regs8.set(regs8.idx.A, a + n);

    let f = cpu.tables.addFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);
}

/**
* ADC A, (IX + d)
* 
* The content of memory address(IX + d), along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function adc_A_ptrIXplusd(cpu, d) {
    const regs8 = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;
    const flags = cpu.registers.flags;

    const ix = regsSp.IX;
    const c = flags.get(flags.idx.C);
    const a = regs8.get(regs8.idx.A);
    const n = cpu.memory[ix + d] + c;

    regs8.set(regs8.idx.A, a + n);

    let f = cpu.tables.addFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);
}

/**
* ADC A, (IY + d)
* 
* The content of memory address(IY + d), along with the Carry Flag (C in the F Register) is added to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function adc_A_ptrIYplusd(cpu, d) {
    const regs8 = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;
    const flags = cpu.registers.flags;

    const iy = regsSp.IY;
    const c = flags.get(flags.idx.C);
    const a = regs8.get(regs8.idx.A);
    const n = cpu.memory[iy + d] + c;

    regs8.set(regs8.idx.A, a + n);

    let f = cpu.tables.addFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);
}

/**
* SUB A, r
* 
* The contents of register r are substracted to the contents of the Accumulator, and the result is
* stored in the Accumulator. The r symbol identifies the registers A, B, C, D, E, H, or L,
* Clock: 4T
*/
function sub_A_r(cpu, rIndex) {
    const regs = cpu.registers.regs8;
    const r = regs.get(rIndex);
    const a = regs.get(regs.idx.A);
    regs.set(regs.idx.A, a - r);

    let f = cpu.tables.subFlagsTable[(a << 8) | r];
    regs.set(regs.idx.F, f);
}

/**
* SUB A, n
* 
* The n integer is substracted to the contents of the Accumulator, and the results are stored in the
* Accumulator.
* Clock: 7T
*/
function sub_A_n(cpu, n) {
    const regs = cpu.registers.regs8;
    const a = regs.get(regs.idx.A);
    regs.set(regs.idx.A, a - n);

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* SUB A, (HL)
* 
* The byte at the memory address specified by the contents of the HL register pair is substracted
* to the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 7T
*/
function sub_A_ptrHL(cpu) {
    const regs = cpu.registers.regs8;
    const regs16 = cpu.registers.regs16;
    const a = regs.get(regs.idx.A);
    const hl = regs16.get(regs16.idx.HL);
    const n = cpu.memory[hl];
    regs.set(regs.idx.A, a - n);

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* SUB A, (IX + d)
* 
* The contents of the Index (register pair IX) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then substracted 
* to the contents of the Accumulator and the result is stored in the Accumulator.
* Clock: 19T
*/
function sub_A_ptrIXplusd(cpu, d) {
    const regs = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;
    const a = regs.get(regs.idx.A);
    const ix = regsSp.IX;
    const n = cpu.memory[ix + d];
    regs.set(regs.idx.A, a - n);

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* SUB A, (IY + d)
* 
* The contents of the Index (register pair IY) Register is added to a two’s 
* complement displacement d to point to an address in memory. The contents of this address is then substracted
* to the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function sub_A_ptrIYplusd(cpu, d) {
    const regs = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;
    const a = regs.get(regs.idx.A);
    const iy = regsSp.IY;
    const n = cpu.memory[iy + d];
    regs.set(regs.idx.A, a - n);

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* SBC A, r
* 
* The r operand, along with the Carry Flag (C in the F Register) is substracted to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 4T
*/
function sbc_A_r(cpu, rIndex) {
    const regs = cpu.registers.regs8;
    const flags = cpu.registers.flags;
    const c = flags.get(flags.idx.C);
    const r = regs.get(rIndex);
    const a = regs.get(regs.idx.A);
    const n = r + c;
    regs.set(regs.idx.A, a - n);

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* SBC A, n
* 
* The n operand, along with the Carry Flag (C in the F Register) is substracted to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 7T
*/
function sbc_A_n(cpu, n) {
    const regs = cpu.registers.regs8;
    const flags = cpu.registers.flags;
    const c = flags.get(flags.idx.C);
    const a = regs.get(regs.idx.A);
    n += c;
    regs.set(regs.idx.A, a - n);

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    regs.set(regs.idx.F, f);
}

/**
* SBC A, (HL)
* 
* The content of memory address (HL), along with the Carry Flag (C in the F Register) is substracted to the contents of
* the Accumulator, and the result is stored in the Accumulator.
* Clock: 7T
*/
function sbc_A_ptrHL(cpu) {
    const regs8 = cpu.registers.regs8;
    const regs16 = cpu.registers.regs16;
    const flags = cpu.registers.flags;

    const hl = regs16.get(regs16.idx.HL);
    const c = flags.get(flags.idx.C);
    const a = regs8.get(regs8.idx.A);
    const n = cpu.memory[hl] + c;

    regs8.set(regs8.idx.A, a - n);

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);
}

/**
* SBC A, (IX + d)
* 
* The content of memory address(IX + d), along with the Carry Flag (C in the F Register) is substracted 
* to the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function sbc_A_ptrIXplusd(cpu, d) {
    const regs8 = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;
    const flags = cpu.registers.flags;

    const ix = regsSp.IX;
    const c = flags.get(flags.idx.C);
    const a = regs8.get(regs8.idx.A);
    const n = cpu.memory[ix + d] + c;

    regs8.set(regs8.idx.A, a - n);

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);
}

/**
* SBC A, (IY + d)
* 
* The content of memory address(IY + d), along with the Carry Flag (C in the F Register) is substracted 
* to the contents of the Accumulator, and the result is stored in the Accumulator.
* Clock: 19T
*/
function sbc_A_ptrIYplusd(cpu, d) {
    const regs8 = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;
    const flags = cpu.registers.flags;

    const iy = regsSp.IY;
    const c = flags.get(flags.idx.C);
    const a = regs8.get(regs8.idx.A);
    const n = cpu.memory[iy + d] + c;
    regs8.set(regs8.idx.A, a - n);

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);
}

/**
* AND r
* 
* A logical AND operation is performed between the byte specified by the register r and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* r identifies registers B, C, D, E, H, L, or A.
* Clock: 4T
*/
function and_r(cpu, rIndex) {
    const regs8 = cpu.registers.regs8;

    const a = regs8.get(regs8.idx.A);
    const r = regs8.get(rIndex);
    let f = cpu.tables.andFlagsTable[(a << 8) | r];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a & r);
}

/**
* AND n
* 
* A logical AND operation is performed between 8bit integer n and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 7T
*/
function and_n(cpu, n) {
    const regs8 = cpu.registers.regs8;

    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.andFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a & n);
}

/**
* AND (HL)
* 
* A logical AND operation is performed between the byte located at HL memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 7T
*/
function and_ptrHL(cpu) {
    const regs8 = cpu.registers.regs8;
    const regs16 = cpu.registers.regs16;

    const hl = regs16.get(regs16.idx.HL);
    const n = cpu.memory[hl];
    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.andFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a & n);
}

/**
* AND (IX + d)
* 
* A logical AND operation is performed between the byte located at (IX + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function and_ptrIXplusd(cpu, d) {
    const regs8 = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;

    const ix = regsSp.IX;
    const n = cpu.memory[ix + d];
    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.andFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a & n);
}

/**
* AND (IY + d)
* 
* A logical AND operation is performed between the byte located at (IY + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function and_ptrIYplusd(cpu, d) {
    const regs8 = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;

    const iy = regsSp.IY;
    const n = cpu.memory[iy + d];
    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.andFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a & n);
}

/**
* OR r
* 
* A logical OR operation is performed between the byte specified by register r and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* r identifies registers B, C, D, E, H, L, or A.
* Clock: 4T
*/
function or_r(cpu, rIndex) {
    const regs8 = cpu.registers.regs8;

    const a = regs8.get(regs8.idx.A);
    const r = regs8.get(rIndex);
    let f = cpu.tables.orFlagsTable[(a << 8) | r];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a | r);
}

/**
* OR n
* 
* A logical OR operation is performed between the byte n and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 7T
*/
function or_n(cpu, n) {
    const regs8 = cpu.registers.regs8;

    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.orFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a | n);
}

/**
* OR (HL)
* 
* A logical OR operation is performed between the byte located at HL memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 7T
*/
function or_ptrHL(cpu) {
    const regs8 = cpu.registers.regs8;
    const regs16 = cpu.registers.regs16;

    const hl = regs16.get(regs16.idx.HL);
    const n = cpu.memory[hl];
    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.orFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a | n);
}

/**
* OR (IX + d)
* 
* A logical OR operation is performed between the byte located at (IX + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function or_ptrIXplusd(cpu, d) {
    const regs8 = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;

    const ix = regsSp.IX;
    const n = cpu.memory[ix + d];
    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.orFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a | n);
}

/**
* OR (IY + d)
* 
* A logical OR operation is performed between the byte located at (IY + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function or_ptrIYplusd(cpu, d) {
    const regs8 = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;

    const iy = regsSp.IY;
    const n = cpu.memory[iy + d];
    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.orFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a | n);
}

/**
* XOR r
* 
* A logical XOR operation is performed between the byte specified by register r and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* r identifies registers B, C, D, E, H, L, or A.
* Clock: 4T
*/
function xor_r(cpu, rIndex) {
    const regs8 = cpu.registers.regs8;

    const a = regs8.get(regs8.idx.A);
    const r = regs8.get(rIndex);
    let f = cpu.tables.xorFlagsTable[(a << 8) | r];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a ^ r);
}

/**
* XOR n
* 
* A logical XOR operation is performed between the byte n and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 7T
*/
function xor_n(cpu, n) {
    const regs8 = cpu.registers.regs8;

    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.xorFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a ^ n);
}

/**
* XOR (HL)
* 
* A logical XOR operation is performed between the byte located at HL memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 7T
*/
function xor_ptrHL(cpu) {
    const regs8 = cpu.registers.regs8;
    const regs16 = cpu.registers.regs16;

    const hl = regs16.get(regs16.idx.HL);
    const n = cpu.memory[hl];
    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.xorFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a ^ n);
}

/**
* XOR (IX + d)
* 
* A logical XOR operation is performed between the byte located at (IX + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function xor_ptrIXplusd(cpu, d) {
    const regs8 = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;

    const ix = regsSp.IX;
    const n = cpu.memory[ix + d];
    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.xorFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a ^ n);
}

/**
* XOR (IY + d)
* 
* A logical XOR operation is performed between the byte located at (IY + d) memory address and the
* byte contained in the Accumulator; the result is stored in the Accumulator.
* Clock: 19T
*/
function xor_ptrIYplusd(cpu, d) {
    const regs8 = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;

    const iy = regsSp.IY;
    const n = cpu.memory[iy + d];
    const a = regs8.get(regs8.idx.A);
    let f = cpu.tables.xorFlagsTable[(a << 8) | n];
    regs8.set(regs8.idx.F, f);

    regs8.set(regs8.idx.A, a ^ n);
}

/**
* CP r
* 
* The contents of the register r operand are compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator. r identifies registers B, C, D, E, H, L, or A.
* Clock: 4T
*/
function cp_r(cpu, rIndex) {
    const regs = cpu.registers.regs8;
    const r = regs.get(rIndex);
    const a = regs.get(regs.idx.A);

    let f = cpu.tables.subFlagsTable[(a << 8) | r];
    f = (f & 0b11010111) | (r & 0b00101000); // Overwrites flags F3 and F5 from operand r
    regs.set(regs.idx.F, f);
}

/**
* CP n
* 
* The 8bit number n is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
* Clock: 7T
*/
function cp_n(cpu, n) {
    const regs = cpu.registers.regs8;
    const a = regs.get(regs.idx.A);

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (r & 0b00101000); // Overwrites flags F3 and F5 from operand r
    regs.set(regs.idx.F, f);
}

/**
* CP (HL)
* 
* The content of HL memory address is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
* Clock: 7T
*/
function cp_ptrHL(cpu) {
    const regs = cpu.registers.regs8;
    const regs16 = cpu.registers.regs16;
    const a = regs.get(regs.idx.A);
    const hl = regs16.get(regs16.idx.HL);
    const n = cpu.memory[hl];

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (r & 0b00101000); // Overwrites flags F3 and F5 from operand r
    regs.set(regs.idx.F, f);
}

/**
* CP (IX + d)
* 
* The content of (IX + d) memory address is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
* Clock: 19T
*/
function cp_ptrIXplusd(cpu, d) {
    const regs = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;
    const a = regs.get(regs.idx.A);
    const ix = regsSp.IX;
    const n = cpu.memory[ix + d];

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (r & 0b00101000); // Overwrites flags F3 and F5 from operand r
    regs.set(regs.idx.F, f);
}

/**
* CP (IY + d)
* 
* The content of (IY + d) memory address is compared with the contents of the Accumulator. If there
* is a true compare, the Z flag is set. The execution of this instruction does not affect the
* contents of the Accumulator.
* Clock: 19T
*/
function cp_ptrIYplusd(cpu, d) {
    const regs = cpu.registers.regs8;
    const regsSp = cpu.registers.regsSp;
    const a = regs.get(regs.idx.A);
    const iy = regsSp.IY;
    const n = cpu.memory[iy + d];

    let f = cpu.tables.subFlagsTable[(a << 8) | n];
    f = (f & 0b11010111) | (r & 0b00101000); // Overwrites flags F3 and F5 from operand r
    regs.set(regs.idx.F, f);
}

/**
* INC r
* 
* Register r is incremented and register r identifies any of the registers A, B, C, D, E, H, or L.
* Clock: 4T
*/
function inc_r(cpu, rIndex) {
    const regs = cpu.registers.regs8;
    const r = regs.get(rIndex);

    let f = regs8.get(regs8.idx.F);
    const c = f & 0x1; // saves flag C, not affected
    const pv = (r == 0x7f) ? 0b100 : 0;
    f = cpu.tables.addFlagsTable[(r << 8) | 1];
    f |= (f & 0b11111011) | pv;
    f |= (f & 0b11111110) | c;

    regs.set(rIndex, r + 1);

    regs8.set(regs8.idx.F, f);
}

/**
* INC (HL)
* 
* The byte contained in the address specified by the contents of the HL register pair is incremented.
* Clock: 11T
*/
function inc_ptrHL(cpu) {
    const regs = cpu.registers.regs16;
    const regs8 = cpu.registers.regs8;
    const hl = regs.get(regs.idx.HL);
    const n = cpu.memory[hl];

    let f = regs8.get(regs8.idx.F);
    const c = f & 0x1; // saves flag C, not affected
    const pv = (n == 0x7f) ? 0b100 : 0;
    f = cpu.tables.addFlagsTable[(n << 8) | 1];
    f |= (f & 0b11111011) | pv;
    f |= (f & 0b11111110) | c;

    cpu.memory[hl] = n + 1;

    regs8.set(regs8.idx.F, f);
}

/**
* INC (IX + d)
* 
* The byte contained in the address specified by the contents of (IX + d) is incremented.
* Clock: 23T
*/
function inc_ptrIXplusd(cpu, d) {
    const regsSp = cpu.registers.regsSp;
    const regs8 = cpu.registers.regs8;
    const ix = regsSp.IX;
    const n = cpu.memory[ix + d];

    let f = regs8.get(regs8.idx.F);
    const c = f & 0x1; // saves flag C, not affected
    const pv = (n == 0x7f) ? 0b100 : 0;
    f = cpu.tables.addFlagsTable[(n << 8) | 1];
    f |= (f & 0b11111011) | pv;
    f |= (f & 0b11111110) | c;

    cpu.memory[ix + d] = n + 1;

    regs8.set(regs8.idx.F, f);
}

/**
* INC (IY + d)
* 
* The byte contained in the address specified by the contents of (IY + d) is incremented.
* Clock: 23T
*/
function inc_ptrIYplusd(cpu, d) {
    const regsSp = cpu.registers.regsSp;
    const regs8 = cpu.registers.regs8;
    const iy = regsSp.IY;
    const n = cpu.memory[iy + d];

    let f = regs8.get(regs8.idx.F);
    const c = f & 0x1; // saves flag C, not affected
    const pv = (n == 0x7f) ? 0b100 : 0;
    f = cpu.tables.addFlagsTable[(n << 8) | 1];
    f |= (f & 0b11111011) | pv;
    f |= (f & 0b11111110) | c;

    cpu.memory[iy + d] = n + 1;

    regs8.set(regs8.idx.F, f);
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
    inc_ptrIYplusd
}