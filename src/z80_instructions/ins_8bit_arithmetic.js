/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 144 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const { regsSp } = require("../z80_registers");

function setAddFlags(cpu, s1, s2) {
    const flags = cpu.registers.flags;
    const sum = s1 + s2;
    flags.set(flags.idx.S, (sum & 0x80) != 0);
    flags.set(flags.idx.Z, sum == 0);
    flags.set(flags.idx.H, ((s1 & 0x8) + (s2 & 0x8)) == 0b10);
    flags.set(flags.idx.PV, (sum & 0x100) == 1);
    flags.set(flags.idx.N, false);
    flags.set(flags.idx.C, (sum & 0x100) == 1);
}

function setSubsFlags(cpu, s1, s2) {
    const flags = cpu.registers.flags;
    const sum = s1 - s2;
    flags.set(flags.idx.S, (sum & 0x80) != 0);
    flags.set(flags.idx.Z, sum == 0);
    flags.set(flags.idx.H, ((s1 & 0x8) + (s2 & 0x8)) == 0b10);
    flags.set(flags.idx.PV, (sum & 0x100) == 1);
    flags.set(flags.idx.N, false);
    flags.set(flags.idx.C, (sum & 0x100) == 1);
}

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
    setAddFlags(cpu, a, r);
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
    setAddFlags(cpu, a, n);
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
    setAddFlags(cpu, a, n);
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
    setAddFlags(cpu, a, n);
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
    setAddFlags(cpu, a, n);
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
    setAddFlags(cpu, a, n);
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
    setAddFlags(cpu, a, n);
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
    setAddFlags(cpu, a, n);
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
    setAddFlags(cpu, a, n);
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
    setAddFlags(cpu, a, n);
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
    setSubsFlags(cpu, a, r);
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
    setSubsFlags(cpu, a, n);
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
    setSubsFlags(cpu, a, n);
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
    setSubsFlags(cpu, a, n);
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
    setSubsFlags(cpu, a, n);
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
    sub_A_ptrIYplusd
}