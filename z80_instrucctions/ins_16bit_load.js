/**
 * This file implements Z80 16bit load instructions group
 * Info on page 98 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

/**
 * LD dd, nn
 * 
 * The 2-byte integer nn is loaded to the dd register pair, in which dd defines the BC, DE,
 * HL, or SP register pairs.
 * Clock: 10T
 */
function ld_dd_nn(cpu, ddIndex, nn){
    cpu.registers.regs16.set(ddIndex, nn);
}

module.exports = {
    ld_dd_nn
}