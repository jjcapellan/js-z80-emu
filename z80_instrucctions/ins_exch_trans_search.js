/**
 * This file implements Z80 exchange, block transfer, and search group instructions
 * Info on page 123 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

/**
 * ex DE, HL
 * 
 * The 2-byte contents of register pairs DE and HL are exchanged.
 * Clock: 4T
 */
function ex_DE_HL(cpu){
    const regs = cpu.registers.regs16;
    const de = regs.get(regs.idx.DE);
    const hl = regs.get(regs.idx.HL);
    regs.set(regs.idx.DE, hl);
    regs.set(regs.idx.HL, de);
}

/**
 * ex AF, AF'
 * 
 * The 2-byte contents of the register pairs AF and AF' 
 * are exchanged. Register pair AF consists of registers A′ and F′.
 * Clock: 4T
 */
function ex_AF_AF2(cpu){
    const regs = cpu.registers.regs16;
    const af = regs.get(regs.idx.AF);
    const af2 = regs.get(regs.idx.AF, true);
    regs.set(regs.idx.AF, af2);
    regs.set(regs.idx.AF, af, true);
}

/**
 * exx
 * 
 * Each 2-byte value in register pairs BC, DE, and HL is exchanged with the 2-byte value in
 * BC', DE', and HL', respectively.
 * Clock: 4T
 */
function exx(cpu){
    const regs = cpu.registers.regs16;
    const bc = regs.get(regs.idx.BC);
    const de = regs.get(regs.idx.DE);
    const hl = regs.get(regs.idx.HL);
    const bc2 = regs.get(regs.idx.BC, true);
    const de2 = regs.get(regs.idx.DE, true);
    const hl2 = regs.get(regs.idx.HL, true);
    regs.set(regs.idx.BC, bc2);
    regs.set(regs.idx.DE, de2);
    regs.set(regs.idx.HL, hl2);
    regs.set(regs.idx.BC, bc, true);
    regs.set(regs.idx.DE, de, true);
    regs.set(regs.idx.HL, hl, true);
}

module.exports = {
    ex_DE_HL,
    ex_AF_AF2,
    exx
}