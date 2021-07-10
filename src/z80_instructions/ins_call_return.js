/**
 * This file implements Z80 8bit arithmetic instructions group
 * Info on page 280 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const { push_qq } = require('./ins_16bit_load');

let CPU, r8, i8, r16, i16, flags, fi, mem;
function setCPU(data) {
    ({ CPU, r8, i8, r16, i16, flags, fi, mem } = data);
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
    r16.set(i16.PC, r16.get(i16.PC) + 3);
    push_qq(i16.PC);
    r16.set(i16.PC, nn);
}

/**
* CALL NZ, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_nz_nn(nn) {
    if (!flags.get(fi.Z))
        call_nn(nn);
}

/**
* CALL Z, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_z_nn(nn) {
    if (flags.get(fi.Z))
        call_nn(nn);
}

/**
* CALL NC, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_nc_nn(nn) {
    if (!flags.get(fi.C))
        call_nn(nn);
}

/**
* CALL C, nn
* 
* Clock: 17T (condition true)    10T (condition false)
*/
function call_c_nn(nn) {
    if (flags.get(fi.C))
        call_nn(nn);
}

module.exports = {
    setCPU
}