/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 261 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU, r8, i8, r16, i16, flags, fi;
function setCPU(data) {
    ({ CPU, r8, i8, r16, i16, flags, fi } = data);
}

/**
* JP nn
* 
* Operand nn is loaded to register pair Program Counter (PC). The next instruction is
* fetched from the location designated by the new contents of the PC.
* Clock: 10T
*/
function jp_nn(nn) {
    CPU.tCycles += 10;
    r16.set(i16.PC, nn);
}

/**
* JP cc, nn
* 
* nn is loaded to register pair Program Counter (PC) if condition cc (NZ, Z, C, NC, PO, PE, P, M) is true.
* Clock: 10T
*/
function jp_cc_nn(flagIndex, isActive, nn){
    CPU.tCycles += 10;
    if (flags.get(flagIndex) == isActive)
        r16.set(i16.PC, nn);
}

/**
 * Helper function for JP (HL) , JP (IX), JP (IY)
 */
function jp_ptrXX(xxIndex) {
    CPU.tCycles += 8;
    const xx = r16.get(xxIndex);
    r16.set(i16.PC, xx);
}

/**
* JP (HL)
* 
* The Program Counter (PC) is loaded with the contents of the HL register pair. The next
* instruction is fetched from the location designated by the new contents of the PC.
* Clock: 4T
*/
function jp_ptrHL() {
    CPU.tCycles -= 4;
    jp_ptrXX(i16.HL);
}

/**
* JP (IX)
* 
* The Program Counter (PC) is loaded with the contents of the IX register pair. The next
* instruction is fetched from the location designated by the new contents of the PC.
* Clock: 8T
*/
function jp_ptrIX() {
    jp_ptrXX(i16.IX);
}

/**
* JP (IY)
* 
* The Program Counter (PC) is loaded with the contents of the IY register pair. The next
* instruction is fetched from the location designated by the new contents of the PC.
* Clock: 8T
*/
function jp_ptrIY() {
    jp_ptrXX(i16.IY);
}

/**
* JR e
* 
* This instruction provides for unconditional branching to other segments of a program. The
* value of displacement e is added to the Program Counter (PC) and the next instruction is
* fetched from the location designated by the new contents of the PC. This jump is measured from the address of the instruction op code and contains a range of –126 to +129
* bytes. The assembler automatically adjusts for the twice incremented PC.
* Clock: 12T
*/
function jr_e(e) {
    CPU.tCycles += 12;
    r16.set(i16.PC, r16.get(i16.PC) + e);
}

/**
* JR C, e
* 
* This instruction provides for conditional branching to other segments of a program
* depending on the results of a test on the Carry Flag. If the flag = 1, the value of 
* displacement e is added to the Program Counter (PC) and the next instruction is fetched from the
* location designated by the new contents of the PC. The jump is measured from the address
* of the instruction op code and contains a range of –126 to +129 bytes.
* The assembler automatically adjusts for the twice incremented PC.
* If the flag = 0, the next instruction executed is taken from the location following this
* instruction. 
* Clock: 12T (if condition is met)    7T (if condition is not met)
*/
function jr_c_e(e) {
    CPU.tCycles += 7;
    if (flags.get(fi.C)) {
        CPU.tCycles += 5;
        r16.set(i16.PC, r16.get(i16.PC) + e);
    }
}

/**
* JR NC, e
* 
* This instruction provides for conditional branching to other segments of a program
* depending on the results of a test on the Carry Flag. If the flag = 0, the value of 
* displacement e is added to the Program Counter (PC) and the next instruction is fetched from the
* location designated by the new contents of the PC. The jump is measured from the address
* of the instruction op code and contains a range of –126 to +129 bytes.
* The assembler automatically adjusts for the twice incremented PC.
* If the flag = 1, the next instruction executed is taken from the location following this
* instruction.
* Clock: 12T (if condition is met)    7T (if condition is not met)
*/
function jr_nc_e(e) {
    CPU.tCycles += 7;
    if (!flags.get(fi.C)) {
        CPU.tCycles += 5;
        r16.set(i16.PC, r16.get(i16.PC) + e);
    }
}

/**
* JR Z, e
* 
* This instruction provides for conditional branching to other segments of a program
* depending on the results of a test on the Carry Flag. If the flag = 1, the value of 
* displacement e is added to the Program Counter (PC) and the next instruction is fetched from the
* location designated by the new contents of the PC. The jump is measured from the address
* of the instruction op code and contains a range of –126 to +129 bytes.
* The assembler automatically adjusts for the twice incremented PC.
* If the flag = 0, the next instruction executed is taken from the location following this
* instruction. 
* Clock: 12T (if condition is met)    7T (if condition is not met)
*/
function jr_z_e(e) {
    CPU.tCycles += 7;
    if (flags.get(fi.Z)) {
        CPU.tCycles += 5;
        r16.set(i16.PC, r16.get(i16.PC) + e);
    }
}

/**
* JR NZ, e
* 
* This instruction provides for conditional branching to other segments of a program
* depending on the results of a test on the Carry Flag. If the flag = 0, the value of 
* displacement e is added to the Program Counter (PC) and the next instruction is fetched from the
* location designated by the new contents of the PC. The jump is measured from the address
* of the instruction op code and contains a range of –126 to +129 bytes.
* The assembler automatically adjusts for the twice incremented PC.
* If the flag = 1, the next instruction executed is taken from the location following this
* instruction.
* Clock: 12T (if condition is met)    7T (if condition is not met)
*/
function jr_nz_e(e) {
    CPU.tCycles += 7;
    if (!flags.get(fi.Z)) {
        CPU.tCycles += 5;
        r16.set(i16.PC, r16.get(i16.PC) + e);
    }
}

/**
* DJNZ e
* 
* This instruction is similar to the conditional jump instructions except that a register value
* is used to determine branching. Register B is decremented, and if a nonzero value remains,
* the value of displacement e is added to the Program Counter (PC). The next instruction is
* fetched from the location designated by the new contents of the PC. The jump is measured
* from the address of the instruction op code and contains a range of –126 to +129 bytes.
* The assembler automatically adjusts for the twice incremented PC.
* If the result of decrementing leaves B with a zero value, the next instruction executed is
* taken from the location following this instruction.
* Clock: 13T (if B != 0)    8T (if B == 0)
*/
function djnz_e(e) {
    CPU.tCycles += 8;
    let b = r8.get(i8.B);
    r8.set(i8.B, b - 1);
    if ((b - 1) != 0) {
        CPU.tCycles += 5;
        r16.set(i16.PC, r16.get(i16.PC) + e);
    }
}

module.exports = {
    jp_nn,
    jp_cc_nn,
    jp_ptrXX,
    jp_ptrHL,
    jp_ptrIX,
    jp_ptrIY,
    jr_e,
    jr_c_e,
    jr_nc_e,
    jr_z_e,
    jr_nz_e,
    djnz_e,
    setCPU
}