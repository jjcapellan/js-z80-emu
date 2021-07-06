/**
 * This file implements Z80 exchange, block transfer, and search group instructions
 * Info on page 123 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let r8, i8, r16, i16, flags, fi, mem;
function setCPU(data) {
    ({ r8, i8, r16, i16, flags, fi, mem } = data);
}

/**
 * ex DE, HL
 * 
 * The 2-byte contents of register pairs DE and HL are exchanged.
 * Clock: 4T
 */
function ex_DE_HL() {
    const de = r16.get(i16.DE);
    const hl = r16.get(i16.HL);
    r16.set(i16.DE, hl);
    r16.set(i16.HL, de);
}

/**
 * ex AF, AF'
 * 
 * The 2-byte contents of the register pairs AF and AF' 
 * are exchanged. Register pair AF consists of registers A′ and F′.
 * Clock: 4T
 */
function ex_AF_AF2() {
    const af = r16.get(i16.AF);
    const af2 = r16.get(i16.AF, true);
    r16.set(i16.AF, af2);
    r16.set(i16.AF, af, true);
}

/**
 * exx
 * 
 * Each 2-byte value in register pairs BC, DE, and HL is exchanged with the 2-byte value in
 * BC', DE', and HL', respectively.
 * Clock: 4T
 */
function exx() {
    const bc = r16.get(i16.BC);
    const de = r16.get(i16.DE);
    const hl = r16.get(i16.HL);
    const bc2 = r16.get(i16.BC, true);
    const de2 = r16.get(i16.DE, true);
    const hl2 = r16.get(i16.HL, true);
    r16.set(i16.BC, bc2);
    r16.set(i16.DE, de2);
    r16.set(i16.HL, hl2);
    r16.set(i16.BC, bc, true);
    r16.set(i16.DE, de, true);
    r16.set(i16.HL, hl, true);
}

/**
 * Helper function for ex (SP), HL/IX/IY ...
 * @param {number} xxIndex 16bit index (Ex: regs16.idx.AF, regs16.idx.IY, ...)
 */
function ex_ptrSP_XX(xxIndex) {
    const sp = r16.get(i16.SP);
    const xx = r16.get(xxIndex);
    const xxH = xx >> 8;
    const xxL = xx & 0xff;
    r16.set(xxIndex, (mem[sp + 1] << 8) | mem[sp]);
    mem[sp] = xxL;
    mem[sp + 1] = xxH;
}

/**
 * ex (SP), HL
 * 
 * The low-order byte contained in register pair HL is exchanged with the contents of the
 * memory address specified by the contents of register pair SP (Stack Pointer), and the 
 * highorder byte of HL is exchanged with the next highest memory address (SP+1)
 * Clock: 19T
 */
function ex_ptrSP_HL() {
    ex_ptrSP_XX(i16.HL);
}

/**
 * ex (SP), IX
 * 
 * The low-order byte in Index Register IX is exchanged with the contents of the memory
 * address specified by the contents of register pair SP (Stack Pointer), and the high-order
 * byte of IX is exchanged with the next highest memory address (SP+1).
 * Clock: 23T
 */
function ex_ptrSP_IX() {
    ex_ptrSP_XX(i16.IX);
}

/**
 * ex (SP), IY
 * 
 * The low-order byte in Index Register IY is exchanged with the contents of the memory
 * address specified by the contents of register pair SP (Stack Pointer), and the high-order
 * byte of IY is exchanged with the next highest memory address (SP+1).
 * Clock: 23T
 */
function ex_ptrSP_IY() {
    ex_ptrSP_XX(i16.IY);
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
function ldi() {

    let hl = r16.get(i16.HL);
    let de = r16.get(i16.DE);
    let bc = r16.get(i16.BC);

    mem[de] = mem[hl];
    r16.set(i16.HL, hl + 1);
    r16.set(i16.DE, de + 1);
    r16.set(i16.BC, bc - 1);

    //Flags
    flags.set(fi.H, false);
    flags.set(fi.PV, (bc - 1) != 0);
    flags.set(fi.N, false);

}

/**
 * ldir
 * 
 * This 2-byte instruction transfers a byte of data from the memory location addressed by the
 * contents of the HL register pair to the memory location addressed by the DE register pair.
 * Both these register pairs are incremented and the Byte Counter (BC) Register pair is decremented. 
 * If decrementing allows the BC to go to 0, the instruction is terminated. If BC is
 * not 0, the program counter is decremented by two and the instruction is repeated. 
 * Interrupts are recognized and two refresh cycles are executed after each data transfer. When the
 * BC is set to 0 prior to instruction execution, the instruction loops through 64 KB.
 * Clock: 21T (BC != 0) ; 16T (BC == 0)
 */
function ldir() {
    let bc = r16.get(i16.BC);
    let pc = r16.get(i16.PC);

    ldi();

    // Repeat condition
    if ((bc - 1) == 0) {
        pc -= 2;
        r16.set(i16.PC, pc);
    }
}

/**
 * ldd
 * 
 * This 2-byte instruction transfers a byte of data from the memory location addressed by the
 * contents of the HL register pair to the memory location addressed by the contents of the
 * DE register pair. Then both of these register pairs including the Byte Counter (BC) Register 
 * pair are decremented.
 * Clock: 16T
 */
function ldd(bucle = false) {

    let hl = r16.get(i16.HL);
    let de = r16.get(i16.DE);
    let bc = r16.get(i16.BC);

    mem[de] = mem[hl];
    r16.set(i16.HL, hl - 1);
    r16.set(i16.DE, de - 1);
    r16.set(i16.BC, bc - 1);

    //Flags
    flags.set(fi.H, false);
    flags.set(fi.PV, ((bc - 1) != 0) && !bucle);
    flags.set(fi.N, false);

}

/**
 * lddr
 * 
 * This 2-byte instruction transfers a byte of data from the memory location addressed by the
 * contents of the HL register pair to the memory location addressed by the contents of the
 * DE register pair. Then both of these registers, and the BC (Byte Counter), are decremented. 
 * If decrementing causes BC to go to 0, the instruction is terminated. If BC is not 0,
 * the program counter is decremented by two and the instruction is repeated. Interrupts are
 * recognized and two refresh cycles execute after each data transfer.
 * When the BC is set to 0, prior to instruction execution, the instruction loops through 64 KB.
 * Clock: 21T (BC != 0); 22T (BC == 0)
 */
function lddr() {
    let bc = r16.get(i16.BC);
    let pc = r16.get(i16.PC);

    ldd(true);

    // Repeat condition
    if ((bc - 1) == 0) {
        pc -= 2;
        r16.set(i16.PC, pc);
    }

}

/**
 * cpi
 * 
 * The contents of the memory location addressed by the HL register is compared with the
contents of the Accumulator. With a true compare, a condition bit is set. Then HL is 
 * incremented and the Byte Counter (register pair BC) is decremented.
 * Clock: 16T
 */
function cpi() {

    const a = r8.get(i8.A);
    let hl = r16.get(i16.HL);
    let bc = r16.get(i16.BC);
    const diff = a - mem[hl];

    r16.set(i16.HL, hl + 1);
    r16.set(i16.BC, bc - 1);

    // Flags
    flags.set(fi.S, diff < 0);
    flags.set(fi.Z, diff == 0);
    flags.set(fi.H, (a & 0b1000) < (mem[hl] & 0b1000));
    flags.set(fi.PV, (bc - 1) != 0);
    flags.set(fi.N, true);

}

/**
 * cpir
 * 
 * The contents of the memory location addressed by the HL register pair is compared with
 * the contents of the Accumulator. During a compare operation, a condition bit is set. HL is
 * incremented and the Byte Counter (register pair BC) is decremented. If decrementing
 * causes BC to go to 0 or if A = (HL), the instruction is terminated. If BC is not 0 and A ≠
 * (HL), the program counter is decremented by two and the instruction is repeated. 
 * Interrupts are recognized and two refresh cycles are executed after each data transfer.
 * If BC is set to 0 before instruction execution, the instruction loops through 64 KB if no
 * match is found.
 * Clock: 21T (BC != 0 && A != (HL)); 16T (BC == 0 || A ==(HL))
 */
function cpir() {

    const a = r8.get(i8.A);
    const hl = r16.get(i16.HL);
    const diff = a - mem[hl];
    let pc = r16.get(i16.PC);
    cpi();
    const bc = r16.get(i16.BC);

    if (bc != 0 && diff != 0) {
        pc -= 2;
        r16.set(i16.PC, pc);
    }

}

/**
 * cpd
 * 
 * The contents of the memory location addressed by the HL register pair is compared with
 * the contents of the Accumulator. During a compare operation, a condition bit is set. The
 * HL and Byte Counter (register pair BC) are decremented.
 * Clock: 21T (BC != 0 && A != (HL)); 16T (BC == 0 || A ==(HL))
 */
function cpd() {

    const a = r8.get(i8.A);
    let hl = r16.get(i16.HL);
    let bc = r16.get(i16.BC);
    const diff = a - mem[hl];

    r16.set(i16.HL, hl - 1);
    r16.set(i16.BC, bc - 1);

    // Flags
    flags.set(fi.S, diff < 0);
    flags.set(fi.Z, diff == 0);
    flags.set(fi.H, (a & 0b1000) < (mem[hl] & 0b1000));
    flags.set(fi.PV, (bc - 1) != 0);
    flags.set(fi.N, true);

}

/**
 * cpdr
 * 
 * The contents of the memory location addressed by the HL register pair is compared with
 * the contents of the Accumulator. During a compare operation, a condition bit is set. The
 * HL and Byte Counter (BC) Register pairs are decremented. If decrementing allows the BC
 * to go to 0 or if A = (HL), the instruction is terminated. If BC is not 0 and A = (HL), the
 * program counter is decremented by two and the instruction is repeated. Interrupts are 
 * recognized and two refresh cycles execute after each data transfer. When the BC is set to 0,
 * prior to instruction execution, the instruction loops through 64 KB if no match is found
 * Clock: 16T
 */
function cpdr() {

    const a = r8.get(i8.A);
    const hl = r16.get(i16.HL);
    const diff = a - mem[hl];
    let pc = r16.get(i16.PC);
    cpd();
    const bc = r16.get(i16.BC);

    if (bc != 0 && diff != 0) {
        pc -= 2;
        r16.set(i16.PC, pc);
    }

}

module.exports = {
    ex_DE_HL,
    ex_AF_AF2,
    exx,
    ex_ptrSP_HL,
    ex_ptrSP_IX,
    ex_ptrSP_IY,
    ldi,
    ldir,
    ldd,
    lddr,
    cpi,
    cpir,
    cpd,
    cpdr,
    setCPU
}