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
function ld_dd_nn(cpu, ddIndex, nn) {
    cpu.registers.regs16.set(ddIndex, nn);
}

/**
 * LD IX, nn
 * 
 * The n integer is loaded to Index Register IX. The first n operand after the op code is the
 * low-order byte.
 * Clock: 14T
 */
function ld_IX_nn(cpu, nn) {
    cpu.registers.regsSp.IX = nn;
}

/**
 * LD IY, nn
 * 
 * The n integer is loaded to Index Register IY. The first n operand after the op code is the
 * low-order byte.
 * Clock: 14T
 */
function ld_IY_nn(cpu, nn) {
    cpu.registers.regsSp.IY = nn;
}

/**
 * LD HL, (nn)
 * 
 * The contents of memory address (nn) are loaded to the low-order portion of register pair
 * HL (Register L), and the contents of the next highest memory address (nn + 1) are loaded
 * to the high-order portion of HL (Register H). The first n operand after the op code is the
 * low-order byte of nn.
 * Clock: 16T
 */
function ld_HL_ptrnn(cpu, ptrnn) {
    const regs8 = cpu.registers.regs8;
    const mem = cpu.memory;
    regs8.set(regs8.idx.L, mem[ptrnn]);
    regs8.set(regs8.idx.H, mem[ptrnn + 1]);
}

/**
 * LD dd, (nn)
 * 
 * The contents of address (nn) are loaded to the low-order portion of register pair dd, and the
 * contents of the next highest memory address (nn + 1) are loaded to the high-order portion
 * of dd. Register pair dd defines BC, DE, HL, or SP register pairs.
 * Clock: 20T
 */
function ld_dd_ptrnn(cpu, ddIndex, ptrnn) {
    const mem = cpu.memory;
    const dHigh = mem[ptrnn + 1];
    const dLow = mem[ptrnn];
    const ddValue = (dLow << 8) | dHigh; //little endian
    cpu.registers.regs16.set(ddIndex, ddValue);
}

module.exports = {
    ld_dd_nn,
    ld_IX_nn,
    ld_IY_nn,
    ld_HL_ptrnn,
    ld_dd_ptrnn
}