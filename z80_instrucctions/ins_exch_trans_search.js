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

module.exports = {
    ex_DE_HL
}