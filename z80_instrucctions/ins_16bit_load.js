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

/**
 * LD IX, (nn)
 * 
 * The contents of the address (nn) are loaded to the low-order portion of Index Register IX,
 * and the contents of the next highest memory address (nn + 1) are loaded to the high-order
 * portion of IX. The first n operand after the op code is the low-order byte of nn.
 * Clock: 20T
 */
function ld_IX_ptrnn(cpu, ptrnn) {
    const mem = cpu.memory;
    const ixHigh = mem[ptrnn + 1];
    const ixLow = mem[ptrnn];
    const ixValue = (ixLow << 8) | ixHigh; //little endian
    cpu.registers.regsSp.IX = ixValue;
}

/**
 * LD IY, (nn)
 * 
 * The contents of the address (nn) are loaded to the low-order portion of Index Register IY,
 * and the contents of the next highest memory address (nn + 1) are loaded to the high-order
 * portion of IY. The first n operand after the op code is the low-order byte of nn.
 * Clock: 20T
 */
 function ld_IY_ptrnn(cpu, ptrnn) {
    const mem = cpu.memory;
    const iyHigh = mem[ptrnn + 1];
    const iyLow = mem[ptrnn];
    const iyValue = (iyLow << 8) | iyHigh; //little endian
    cpu.registers.regsSp.IY = iyValue;
}

/**
 * LD (nn), HL
 * 
 * The contents of the low-order portion of register pair HL (Register L) are loaded to memory address (nn), and the contents of the high-order portion of HL (Register H) are loaded
 * to the next highest memory address (nn + 1). The first n operand after the op code is the
 * low-order byte of nn.
 * Clock: 16T
 */
function ld_ptrnn_HL(cpu, ptrnn) {
    const regs8 = cpu.registers.regs8;
    const mem = cpu.memory;
    mem[ptrnn] = regs8.get(regs8.idx.L);
    mem[ptrnn + 1] = regs8.get(regs8.idx.H);
}

/**
 * LD (nn), dd
 * 
 * The low-order byte of register pair dd is loaded to memory address (nn); the upper byte is
 * loaded to memory address (nn + 1). Register pair dd defines either BC, DE, HL, or SP.
 * Clock: 20T
 */
function ld_ptrnn_dd(cpu, ddIndex, ptrnn) {
    const dd = cpu.registers.regs16.get(ddIndex);
    const mem = cpu.memory;
    mem[ptrnn] = dd & 0xff;
    mem[ptrnn + 1] = (dd & 0xff00) >> 8;
}

/**
 * LD (nn), IX
 * 
 * The low-order byte in Index Register IX is loaded to memory address (nn); the upper order
 * byte is loaded to the next highest address (nn + 1). The first n operand after the op code is
 * the low-order byte of nn.
 * Clock: 20T
 */
function ld_ptrnn_IX(cpu, ptrnn) {
    const ix = cpu.registers.regsSp.IX;
    const mem = cpu.memory;
    mem[ptrnn] = ix & 0xff;
    mem[ptrnn + 1] = (ix & 0xff00) >> 8;
}

/**
 * LD (nn), IY
 * 
 * The low-order byte in Index Register IY is loaded to memory address (nn); the upper order
 * byte is loaded to the next highest address (nn + 1). The first n operand after the op code is
 * the low-order byte of nn.
 * Clock: 20T
 */
function ld_ptrnn_IY(cpu, ptrnn) {
    const iy = cpu.registers.regsSp.IY;
    const mem = cpu.memory;
    mem[ptrnn] = iy & 0xff;
    mem[ptrnn + 1] = (iy & 0xff00) >> 8;
}

/**
 * LD SP, HL
 * 
 * The contents of the register pair HL are loaded to the Stack Pointer (SP).
 * Clock: 6T
 */
function ld_SP_HL(cpu) {
    const regs = cpu.registers;
    regs.regsSp.SP = regs.regs16.get(regs.regs16.idx.HL);
}

/**
 * LD SP, IX
 * 
 * The 2-byte contents of Index Register IX are loaded to the Stack Pointer (SP)
 * Clock: 10T
 */
function ld_SP_IX(cpu) {
    const regs = cpu.registers;
    regs.regsSp.SP = regs.regsSp.IX;
}

/**
 * LD SP, IY
 * 
 * The 2-byte contents of Index Register IY are loaded to the Stack Pointer (SP)
 * Clock: 10T
 */
function ld_SP_IY(cpu) {
    const regs = cpu.registers;
    regs.regsSp.SP = regs.regsSp.IY;
}

/**
 * PUSH qq
 * 
 * The contents of the register pair qq are pushed to the external memory last-in, first-out
 * (LIFO) stack. The Stack Pointer (SP) Register pair holds the 16-bit address of the current
 * top of the Stack. This instruction first decrements SP and loads the high-order byte of 
 * register pair qq to the memory address specified by the SP. The SP is decremented again and
 * loads the low-order byte of qq to the memory location corresponding to this new address
 * in the SP. The operand qq identifies register pair BC, DE, HL, or AF.
 * Clock: 11T
 */
function push_qq(cpu, qqIndex) {
    const regs = cpu.registers;
    const mem = cpu.memory;
    const qq = regs.regs16.get(qqIndex);
    regs.regsSp.SP--;
    mem[regs.regsSp.SP] = (qq & 0xff00) >> 8;
    regs.regsSp.SP--;
    mem[regs.regsSp.SP] = qq & 0xff;
}

/**
 * PUSH IX
 * 
 * The contents of Index Register IX are pushed to the external memory last-in, first-out
 * (LIFO) stack. The Stack Pointer (SP) Register pair holds the 16-bit address of the current
 * top of the Stack. This instruction first decrements SP and loads the high-order byte of IX
 * to the memory address specified by SP; then decrements SP again and loads the low-order
 * byte to the memory location corresponding to this new address in SP.
 * Clock: 15T
 */
function push_IX(cpu) {
    const regs = cpu.registers.regsSp;
    const mem = cpu.memory;
    const ix = regs.IX;
    regs.SP--;
    mem[regs.SP] = (ix & 0xff00) >> 8;
    regs.SP--;
    mem[regs.SP] = ix & 0xff;
}

/**
 * PUSH IY
 * 
 * The contents of Index Register IY are pushed to the external memory last-in, first-out
 * (LIFO) stack. The Stack Pointer (SP) Register pair holds the 16-bit address of the current
 * top of the Stack. This instruction first decrements the SP and loads the high-order byte of
 * IY to the memory address specified by SP; then decrements SP again and loads the loworder
 * byte to the memory location corresponding to this new address in SP.
 * Clock: 15T
 */
function push_IY(cpu) {
    const regs = cpu.registers.regsSp;
    const mem = cpu.memory;
    const iy = regs.IY;
    regs.SP--;
    mem[regs.SP] = (iy & 0xff00) >> 8;
    regs.SP--;
    mem[regs.SP] = iy & 0xff;
}

module.exports = {
    ld_dd_nn,
    ld_IX_nn,
    ld_IY_nn,
    ld_HL_ptrnn,
    ld_dd_ptrnn,
    ld_IX_ptrnn,
    ld_IY_ptrnn,
    ld_ptrnn_HL,
    ld_ptrnn_dd,
    ld_ptrnn_IX,
    ld_ptrnn_IY,
    ld_SP_HL,
    ld_SP_IX,
    ld_SP_IY,
    push_qq,
    push_IX,
    push_IY
}