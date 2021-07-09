/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 261 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU, r8, i8, r16, i16, flags, fi, mem;
function setCPU(data) {
    ({ CPU, r8, i8, r16, i16, flags, fi, mem } = data);
}

/**
* JP nn
* 
* Operand nn is loaded to register pair Program Counter (PC). The next instruction is
* fetched from the location designated by the new contents of the PC.
* Clock: 10T
*/
function jp_nn(nn) {
    r16.set(i16.PC, nn);    
}

/**
* JP NZ, nn
* 
* nn is loaded to register pair Program Counter (PC) if NZ (Z not set) is true.
* Clock: 10T
*/
function jp_nz_nn(nn) {
    if(!flags.get(fi.Z))
    r16.set(i16.PC, nn);
}

/**
* JP Z, nn
* 
* nn is loaded to register pair Program Counter (PC) if condition Z (Z is set) is true.
* Clock: 10T
*/
function jp_z_nn(nn) {
    if(flags.get(fi.Z))
    r16.set(i16.PC, nn);
}

/**
* JP NC, nn
* 
* nn is loaded to register pair Program Counter (PC) if condition NC (C not set) is true.
* Clock: 10T
*/
function jp_nc_nn(nn) {
    if(!flags.get(fi.C))
    r16.set(i16.PC, nn);
}

/**
* JP C, nn
* 
* nn is loaded to register pair Program Counter (PC) if condition C (C is set) is true.
* Clock: 10T
*/
function jp_c_nn(nn) {
    if(flags.get(fi.C))
    r16.set(i16.PC, nn);
}

/**
* JP PO, nn
* 
* nn is loaded to register pair Program Counter (PC) if condition PO (PV not set) is true.
* Clock: 10T
*/
function jp_po_nn(nn) {
    if(!flags.get(fi.PV))
    r16.set(i16.PC, nn);
}

/**
* JP PE, nn
* 
* nn is loaded to register pair Program Counter (PC) if condition PE (PV is set) is true.
* Clock: 10T
*/
function jp_pe_nn(nn) {
    if(flags.get(fi.PV))
    r16.set(i16.PC, nn);
}

/**
* JP P, nn
* 
* nn is loaded to register pair Program Counter (PC) if condition P (Sign positive: S not set) is true.
* Clock: 10T
*/
function jp_p_nn(nn) {
    if(!flags.get(fi.S))
    r16.set(i16.PC, nn);
}

/**
* JP M, nn
* 
* nn is loaded to register pair Program Counter (PC) if condition M (Sign negative: S is set) is true.
* Clock: 10T
*/
function jp_z_nn(nn) {
    if(flags.get(fi.Z))
    r16.set(i16.PC, nn);
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
    if(flags.get(fi.C))
    r16.set(i16.PC, r16.get(i16.PC) + e);
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
    if(!flags.get(fi.C))
    r16.set(i16.PC, r16.get(i16.PC) + e);
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
    if(flags.get(fi.Z))
    r16.set(i16.PC, r16.get(i16.PC) + e);
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
    if(!flags.get(fi.Z))
    r16.set(i16.PC, r16.get(i16.PC) + e);
}

module.exports = {
    jp_nn,
    setCPU
}