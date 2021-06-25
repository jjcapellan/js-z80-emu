/**
 * This file implements Z80 8bit load instructions group
 * Info on page 70 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

/**
 * LD r, r'
 * 
 * The contents of any register r' are loaded to any other register r. r, r' identifies any of the
 * registers A, B, C, D, E, H, or L.
 * Clock: 4T
 */
function ld_r_r2(cpu, rIndex, r2Index) {
    const regs = cpu.registers.regs8;
    const r2 = regs.get(r2Index, false);
    regs.set(rIndex, false, r2);
}


/**
 * LD r, n
 * 
 * The 8-bit integer n is loaded to any register r, in which r identifies registers A, B, C, D, E,
 * H, or L.
 * Clock: 7T
 */
function ld_r_n(cpu, rIndex, n) {
    cpu.registers.regs8.set(rIndex, false, n);
}

/**
 * LD r, (HL)
 * 
 * The 8-bit contents of memory location (HL) are loaded to register r, in which r identifies
 * registers A, B, C, D, E, H, or L
 * Clock: 7T
 */
function ld_r_ptrHL(cpu, rIndex) {
    const regs = cpu.registers;
    const ptrHLcontent = cpu.memory[regs.regs16.get(regs.regs16.idx.HL, false)];
    cpu.registers.regs8.set(rIndex, false, ptrHLcontent);
}

module.exports = {
    ld_r_r2,
    ld_r_n,
    ld_r_ptrHL
}