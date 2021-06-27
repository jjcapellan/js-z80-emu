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
function ex_DE_HL(cpu) {
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
function ex_AF_AF2(cpu) {
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
function exx(cpu) {
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

/**
 * ex (SP), HL
 * 
 * The low-order byte contained in register pair HL is exchanged with the contents of the
 * memory address specified by the contents of register pair SP (Stack Pointer), and the 
 * highorder byte of HL is exchanged with the next highest memory address (SP+1)
 * Clock: 19T
 */
 function ex_ptrSP_HL(cpu) {
    const regs = cpu.registers.regs8;
    const sp = cpu.registers.regsSp.SP;
    const mem = cpu.memory;
    const h = regs.get(regs.idx.H);
    const l = regs.get(regs.idx.L);
    regs.set(regs.idx.H, mem[sp + 1]);
    regs.set(regs.idx.L, mem[sp]);
    mem[sp] = l;
    mem[sp + 1] = h;
}

/**
 * ex (SP), IX
 * 
 * The low-order byte in Index Register IX is exchanged with the contents of the memory
 * address specified by the contents of register pair SP (Stack Pointer), and the high-order
 * byte of IX is exchanged with the next highest memory address (SP+1).
 * Clock: 23T
 */
function ex_ptrSP_IX(cpu) {
    const regs = cpu.registers.regsSp;
    const sp = regs.SP;
    const mem = cpu.memory;
    const ix = regs.IX;
    const ixH = ix >> 8;
    const ixL = ix & 0xff;
    regs.IX = (mem[sp + 1] << 8) | mem[sp];
    mem[sp] = ixL;
    mem[sp + 1] = ixH;
}

/**
 * ex (SP), IY
 * 
 * The low-order byte in Index Register IY is exchanged with the contents of the memory
 * address specified by the contents of register pair SP (Stack Pointer), and the high-order
 * byte of IY is exchanged with the next highest memory address (SP+1).
 * Clock: 23T
 */
function ex_ptrSP_IY(cpu) {
    const regs = cpu.registers.regsSp;
    const sp = regs.SP;
    const mem = cpu.memory;
    const iy = regs.IY;
    const iyH = iy >> 8;
    const iyL = iy & 0xff;
    regs.IY = (mem[sp + 1] << 8) | mem[sp];
    mem[sp] = iyL;
    mem[sp + 1] = iyH;
}

/**
 * ldi
 * 
 * A byte of data is transferred from the memory location addressed, by the contents of the
 * HL register pair to the memory location addressed by the contents of the DE register pair.
 * Then both these register pairs are incremented and the Byte Counter (BC) Register pair is
 * decremented.
 * Clock: 16T
 */
function ldi(cpu) {
    const regs = cpu.registers.regs16;
    const mem = cpu.memory;
    const flags = cpu.registers.flags;

    let hl = regs.get(regs.idx.HL);
    let de = regs.get(regs.idx.DE);
    let bc = regs.get(regs.idx.BC);

    mem[de] = mem[hl];
    regs.set(regs.idx.HL, hl + 1);
    regs.set(regs.idx.DE, de + 1);
    regs.set(regs.idx.BC, bc - 1);
    
    //Flags
    flags.set(flags.idx.H, false);
    flags.set(flags.idx.PV, (bc - 1) != 0);
    flags.set(flags.idx.N, false);

}

module.exports = {
    ex_DE_HL,
    ex_AF_AF2,
    exx,
    ex_ptrSP_HL,
    ex_ptrSP_IX,
    ex_ptrSP_IY,
    ldi
}