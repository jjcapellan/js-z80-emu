/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 144 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

 const { regsSp } = require("../z80_registers");

 /**
 * ADD A, r
 * 
 * The contents of register r are added to the contents of the Accumulator, and the result is
 * stored in the Accumulator. The r symbol identifies the registers A, B, C, D, E, H, or L,
 * Clock: 4T
 */
function add_A_r(cpu, rIndex){
    const regs = cpu.registers.regs8;
    const r = regs.get(rIndex);
    const a = regs.get(regs.idx.A);
    regs.set(regs.idx.A, a + r);
    // Flags
    const result = a + r;
    flags.set(flags.idx.S, (result & 0b10000000) != 0);
    flags.set(flags.idx.Z, result == 0);
    flags.set(flags.idx.H, ((r & 0b1000) + (a & 0b1000)) == 0b10);
    flags.set(flags.idx.PV, (result & 0b100000000) == 1);
    flags.set(flags.idx.N, false);
    flags.set(flags.idx.C, (result & 0b100000000) == 1);
}

 /**
 * ADD A, n
 * 
 * The n integer is added to the contents of the Accumulator, and the results are stored in the
 * Accumulator.
 * Clock: 7T
 */
function add_A_n(cpu, n){
    const regs = cpu.registers.regs8;
    const a = regs.get(regs.idx.A);
    regs.set(regs.idx.A, a + n);
    // Flags
    const result = a + n;
    flags.set(flags.idx.S, (result & 0b10000000) != 0);
    flags.set(flags.idx.Z, result == 0);
    flags.set(flags.idx.H, ((n & 0b1000) + (a & 0b1000)) == 0b10);
    flags.set(flags.idx.PV, (result & 0b100000000) == 1);
    flags.set(flags.idx.N, false);
    flags.set(flags.idx.C, (result & 0b100000000) == 1);
}

 /**
 * ADD A, (HL)
 * 
 * The byte at the memory address specified by the contents of the HL register pair is added
 * to the contents of the Accumulator, and the result is stored in the Accumulator.
 * Clock: 7T
 */
  function add_A_ptrHL(cpu){
    const regs = cpu.registers.regs8;
    const regs16 = cpu.registers.regs16;
    const a = regs.get(regs.idx.A);
    const hl = regs16.get(regs16.idx.HL);
    const n = cpu.memory[hl];
    regs.set(regs.idx.A, a + n);
    // Flags
    const result = a + n;
    flags.set(flags.idx.S, (result & 0b10000000) != 0);
    flags.set(flags.idx.Z, result == 0);
    flags.set(flags.idx.H, ((n & 0b1000) + (a & 0b1000)) == 0b10);
    flags.set(flags.idx.PV, (result & 0b100000000) == 1);
    flags.set(flags.idx.N, false);
    flags.set(flags.idx.C, (result & 0b100000000) == 1);
}

module.exports = {
    add_A_r
}