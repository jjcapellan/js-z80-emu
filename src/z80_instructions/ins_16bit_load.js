/**
 * This file implements Z80 16bit load instructions group
 * Info on page 98 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let r8, i8, r16, i16, mem;
function setCPU(data) {
    ({ r8, i8, r16, i16, mem } = data);
}

/**
 * LD dd, nn
 * 
 * The 2-byte integer nn is loaded to the dd register pair, in which dd defines the BC, DE,
 * HL, or SP register pairs.
 * Clock: 10T
 */
function ld_dd_nn(ddIndex, nn) {
    r16.set(ddIndex, nn);
}

/**
 * LD IX, nn
 * 
 * The n integer is loaded to Index Register IX. The first n operand after the op code is the
 * low-order byte.
 * Clock: 14T
 */
function ld_IX_nn(nn) {
    r16.set(i16.IX, nn);
}

/**
 * LD IY, nn
 * 
 * The n integer is loaded to Index Register IY. The first n operand after the op code is the
 * low-order byte.
 * Clock: 14T
 */
function ld_IY_nn(nn) {
    r16.set(i16.IY, nn);
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
function ld_HL_ptrnn(ptrnn) {
    ld_dd_ptrnn(i16.HL, ptrnn);
}

/**
 * LD dd, (nn)
 * 
 * The contents of address (nn) are loaded to the low-order portion of register pair dd, and the
 * contents of the next highest memory address (nn + 1) are loaded to the high-order portion
 * of dd. Register pair dd defines BC, DE, HL, or SP register pairs.
 * Clock: 20T
 */
function ld_dd_ptrnn(ddIndex, ptrnn) {
    const dHigh = mem[ptrnn + 1];
    const dLow = mem[ptrnn];
    const ddValue = (dHigh << 8) | dLow;
    r16.set(ddIndex, ddValue);
}

/**
 * LD IX, (nn)
 * 
 * The contents of the address (nn) are loaded to the low-order portion of Index Register IX,
 * and the contents of the next highest memory address (nn + 1) are loaded to the high-order
 * portion of IX. The first n operand after the op code is the low-order byte of nn.
 * Clock: 20T
 */
function ld_IX_ptrnn(ptrnn) {
    ld_dd_ptrnn(i16.IX, ptrnn);
}

/**
 * LD IY, (nn)
 * 
 * The contents of the address (nn) are loaded to the low-order portion of Index Register IY,
 * and the contents of the next highest memory address (nn + 1) are loaded to the high-order
 * portion of IY. The first n operand after the op code is the low-order byte of nn.
 * Clock: 20T
 */
function ld_IY_ptrnn(ptrnn) {
    ld_dd_ptrnn(i16.IY, ptrnn);
}

/**
 * LD (nn), HL
 * 
 * The contents of the low-order portion of register pair HL (Register L) are loaded to memory address (nn), and the contents of the high-order portion of HL (Register H) are loaded
 * to the next highest memory address (nn + 1). The first n operand after the op code is the
 * low-order byte of nn.
 * Clock: 16T
 */
function ld_ptrnn_HL(ptrnn) {
    mem[ptrnn] = r8.get(i8.L);
    mem[ptrnn + 1] = r8.get(i8.H);
}

/**
 * LD (nn), dd
 * 
 * The low-order byte of register pair dd is loaded to memory address (nn); the upper byte is
 * loaded to memory address (nn + 1). Register pair dd defines either BC, DE, HL, or SP.
 * Clock: 20T
 */
function ld_ptrnn_dd(ddIndex, ptrnn) {
    const dd = r16.get(ddIndex);
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
function ld_ptrnn_IX(ptrnn) {
    ld_ptrnn_dd(i16.IX, ptrnn);
}

/**
 * LD (nn), IY
 * 
 * The low-order byte in Index Register IY is loaded to memory address (nn); the upper order
 * byte is loaded to the next highest address (nn + 1). The first n operand after the op code is
 * the low-order byte of nn.
 * Clock: 20T
 */
function ld_ptrnn_IY(ptrnn) {
    ld_ptrnn_dd(i16.IY, ptrnn);
}

/**
 * LD SP, HL
 * 
 * The contents of the register pair HL are loaded to the Stack Pointer (SP).
 * Clock: 6T
 */
function ld_SP_HL() {
    r16.set(i16.SP, r16.get(i16.HL));
}

/**
 * LD SP, IX
 * 
 * The 2-byte contents of Index Register IX are loaded to the Stack Pointer (SP)
 * Clock: 10T
 */
function ld_SP_IX() {
    r16.set(i16.SP, r16.get(i16.IX));
}

/**
 * LD SP, IY
 * 
 * The 2-byte contents of Index Register IY are loaded to the Stack Pointer (SP)
 * Clock: 10T
 */
function ld_SP_IY() {
    r16.set(i16.SP, r16.get(i16.IY));
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
function push_qq(qqIndex) {
    const qq = r16.get(qqIndex);
    let sp = r16.get(i16.SP);
    sp--;
    mem[sp] = (qq & 0xff00) >> 8;
    sp--;
    mem[sp] = qq & 0xff;
    r16.set(i16.SP, sp);
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
function push_IX() {
    push_qq(i16.IX);
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
function push_IY() {
    push_qq(i16.IY);
}

/**
 * POP qq
 * 
 * The top two bytes of the external memory last-in, first-out (LIFO) stack are popped to register 
 * pair qq. The Stack Pointer (SP) Register pair holds the 16-bit address of the current
 * top of the Stack. This instruction first loads to the low-order portion of qq, the byte at the
 * memory location corresponding to the contents of SP; then SP is incremented and the contents of 
 * the corresponding adjacent memory location are loaded to the high-order portion
 * of qq and the SP is now incremented again. The operand qq identifies register pair BC,
 * DE, HL, or AF.
 * Clock: 10T
 */
function pop_qq(qqIndex) {
    let qq = 0;
    let sp = r16.get(i16.SP);
    qq = mem[sp];
    sp++;
    qq = qq | (mem[sp] << 8);
    sp++;
    r16.set(qqIndex, qq);
    r16.set(i16.SP, sp);
}

/**
 * POP IX
 * 
 * The top two bytes of the external memory last-in, first-out (LIFO) stack are popped to
 * Index Register IX. The Stack Pointer (SP) Register pair holds the 16-bit address of the
 * current top of the Stack. This instruction first loads to the low-order portion of IX the byte
 * at the memory location corresponding to the contents of SP; then SP is incremented and
 * the contents of the corresponding adjacent memory location are loaded to the high-order
 * portion of IX. The SP is incremented again.
 * Clock: 14T
 */
function pop_IX() {
    pop_qq(i16.IX);
}

/**
 * POP IY
 * 
 * The top two bytes of the external memory last-in, first-out (LIFO) stack are popped to
 * Index Register IY. The Stack Pointer (SP) Register pair holds the 16-bit address of the
 * current top of the Stack. This instruction first loads to the low-order portion of IY the byte
 * at the memory location corresponding to the contents of SP; then SP is incremented and
 * the contents of the corresponding adjacent memory location are loaded to the high-order
 * portion of IY. The SP is incremented again.
 * Clock: 14T
 */
function pop_IY() {
    pop_qq(i16.IY);
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
    push_IY,
    pop_qq,
    pop_IX,
    pop_IY,
    setCPU
}