/**
 * This file implements Z80 16bit load instructions group
 * Info on page 98 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU, r16, i16, mem;
function setCPU(data) {
    ({ CPU, r16, i16, mem } = data);
}

/**
 * LD XX, nn ---> LD dd, nn ; LD IX, nn ; LD IY, nn
 * 
 * The 2-byte integer nn is loaded to the XX register pair.
 * XX can be dd (BC, DE, HL, SP), IX, IY
 */
function ld_XX_nn(xxIndex, nn, tCycles) {
    CPU.tCycles += tCycles;
    r16.set(xxIndex, nn);
}

/**
 * ld XX, (nn)
 * 
 * The contents of address (nn) are loaded to the low-order portion of register pair XX, and the
 * contents of the next highest memory address (nn + 1) are loaded to the high-order portion
 * of XX.
 * XX can be dd(BC, DE, HL, SP), IX, or IY.
 */
function ld_XX_ptrnn(xxIndex, nn, tCycles) {
    CPU.tCycles += tCycles;
    const dHigh = mem[nn + 1];
    const dLow = mem[nn];
    const ddValue = (dHigh << 8) | dLow;
    r16.set(xxIndex, ddValue);
}

/**
 * LD (nn), XX ---> LD (nn), dd ; LD (nn), IX ; LD (nn), IY
 * 
 * The low-order byte of register pair XX is loaded to memory address (nn); the upper byte is
 * loaded to memory address (nn + 1).
 * XX can be dd(BC, DE, HL, SP), IX, or IY.
 */
function ld_ptrnn_XX(xxIndex, nn, tCycles) {
    CPU.tCycles += tCycles;
    const xx = r16.get(xxIndex);
    mem[nn] = xx & 0xff;
    mem[nn + 1] = (xx & 0xff00) >> 8;
}

/**
 * LD SP, XX ---> LD SP, HL ;  LD SP, IX ;  LD SP, IY
 * 
 * The contents of the register pair XX are loaded to the Stack Pointer (SP).
 * XX can be HL, IX, IY.
 */
function ld_SP_XX(xxIndex, tCycles) {
    CPU.tCycles += tCycles;
    r16.set(i16.SP, r16.get(xxIndex));
}

/**
 * PUSH XX ---> PUSH qq ; PUSH IX ; PUSH IY
 * 
  */
function push_XX(xxIndex, tCycles) {
    CPU.tCycles += tCycles;
    const qq = r16.get(xxIndex);
    let sp = r16.get(i16.SP);
    sp--;
    mem[sp] = (qq & 0xff00) >> 8;
    sp--;
    mem[sp] = qq & 0xff;
    r16.set(i16.SP, sp);
}

/**
 * POP XX ---> POP qq ; POP IX ; POP IY
 * 
  */
function pop_XX(xxIndex, tCycles) {
    CPU.tCycles += tCycles;
    let qq = 0;
    let sp = r16.get(i16.SP);
    qq = mem[sp];
    sp++;
    qq = qq | (mem[sp] << 8);
    sp++;
    r16.set(xxIndex, qq);
    r16.set(i16.SP, sp);
}

module.exports = {
    ld_XX_nn,
    ld_XX_ptrnn,
    ld_ptrnn_XX,
    ld_SP_XX,
    push_XX,
    pop_XX,
    setCPU
}