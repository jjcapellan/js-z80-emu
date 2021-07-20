/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 280 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const { push_qq, pop_qq } = require('./ins_16bit_load');

let CPU, r16, i16, flags, fi;
function setCPU(data) {
    ({ CPU, r16, i16, flags, fi } = data);
}

/**
* CALL nn
* 
* The current contents of the Program Counter (PC) are pushed onto the top of the external
* memory stack. The operands nn are then loaded to the PC to point to the address in memory
* at which the first op code of a subroutine is to be fetched. At the end of the subroutine,
* a RETurn instruction can be used to return to the original program flow by popping the top
* of the stack back to the PC. The push is accomplished by first decrementing the current
* contents of the Stack Pointer (register pair SP), loading the high-order byte of the PC
* contents to the memory address now pointed to by the SP; then decrementing SP again, and
* loading the low-order byte of the PC contents to the top of stack.
* Because this process is a 3-byte instruction, the Program Counter was incremented by
* three before the push is executed.
* Clock: 17T
*/
function call_nn(nn) {
    CPU.tCycles += 5;
    r16.set(i16.PC, r16.get(i16.PC) + 3);
    push_qq(i16.PC); // 11 tCycles
    r16.set(i16.PC, nn);
}

/**
* CALL NZ, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_nz_nn(nn) {
    CPU.tCycles += 10;
    if (!flags.get(fi.Z))
        call_nn(nn);
}

/**
* CALL Z, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_z_nn(nn) {
    CPU.tCycles += 10;
    if (flags.get(fi.Z))
        call_nn(nn);
}

/**
* CALL NC, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_nc_nn(nn) {
    CPU.tCycles += 10;
    if (!flags.get(fi.C))
        call_nn(nn);
}

/**
* CALL C, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_c_nn(nn) {
    CPU.tCycles += 10;
    if (flags.get(fi.C))
        call_nn(nn);
}

/**
* CALL PO, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_po_nn(nn) {
    CPU.tCycles += 10;
    if (!flags.get(fi.PV))
        call_nn(nn);
}

/**
* CALL PE, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_pe_nn(nn) {
    CPU.tCycles += 10;
    if (flags.get(fi.PV))
        call_nn(nn);
}

/**
* CALL P, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_p_nn(nn) {
    CPU.tCycles += 10;
    if (!flags.get(fi.S))
        call_nn(nn);
}

/**
* CALL M, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_m_nn(nn) {
    CPU.tCycles += 10;
    if (flags.get(fi.S))
        call_nn(nn);
}

/**
* RET
* 
* The byte at the memory location specified by the contents of the Stack Pointer (SP)
* Register pair is moved to the low-order eight bits of the Program Counter (PC). The SP is now
* incremented and the byte at the memory location specified by the new contents of this
* instruction is fetched from the memory location specified by the PC. This instruction is
* normally used to return to the main line program at the completion of a routine entered by
* a CALL instruction
* Clock: 10T
*/
function ret() {
    pop_qq(i16.PC); // 10 tCycles
}

/**
* RET cc
* 
* cc is a flag condition (nz, z, nc, c, po, pe, p, m)
* Clock: 11T (condition true)    5T (condition false)
*/
function ret_cc(flagIndex, isActive){
    CPU.tCycles += 5;
    if (flags.get(flagIndex) == isActive) {
        CPU.tCycles += 1;
        ret(); // 10 tCycles
    }
}

/**
* RETI
* 
* Restore the contents of the Program Counter (analogous to the RET instruction) after interrupt subroutine.
* Signal an I/O device that the interrupt routine is completed. The RETI instruction also
* facilitates the nesting of interrupts, allowing higher priority devices to temporarily
* suspend service of lower priority service routines. However, this instruction does not
* enable interrupts that were disabled when the interrupt routine was entered. Before
* doing the RETI instruction, the enable interrupt instruction (EI) should be executed to
* allow recognition of interrupts after completion of the current service routine.
* Clock: 14T
*/
function reti() {
    CPU.tCycles += 4;
    ret(); // 10 tCycles
    /* IEO not emulated */
}

/**
* RETN
* 
* This instruction is used at the end of a nonmaskable interrupts service routine to restore
* the contents of the Program Counter (analogous to the RET instruction). The state of IFF2
* is copied back to IFF1 so that maskable interrupts are enabled immediately following the
* RETN if they were enabled before the nonmaskable interrupt.
* Clock: 14T
*/
function retn() {
    CPU.tCycles += 4;
    CPU.registers.iff.IFF1 = CPU.registers.iff.IFF1;
    ret(); // 10 tCycles
}

/**
* RST p
* 
* The current Program Counter (PC) contents are pushed onto the external memory stack,
* and the Page 0 memory location assigned by operand p is loaded to the PC. Program execution
* then begins with the op code in the address now pointed to by PC. The push is performed by
* first decrementing the contents of the Stack Pointer (SP), loading the high-order
* byte of PC to the memory address now pointed to by SP, decrementing SP again, and loading
* the low-order byte of PC to the address now pointed to by SP. The Restart instruction
* allows for a jump to one of eight addresses indicated by p (8bit length). The operand p
* is assembled to the object code using the corresponding T state. 
* Clock: 11T
*/
function rst_p(p) {
    push_qq(i16.PC); // 11 tCycles
    r16.set(i16.PC, p);
}

module.exports = {
    call_nn,
    call_c_nn,
    call_nc_nn,
    call_z_nn,
    call_nz_nn,
    call_pe_nn,
    call_po_nn,
    call_m_nn,
    call_p_nn,
    ret,
    ret_c,
    ret_nc,
    ret_z,
    ret_nz,
    ret_pe,
    ret_po,
    ret_m,
    ret_p,
    rst_p,
    reti,
    retn,
    setCPU
}