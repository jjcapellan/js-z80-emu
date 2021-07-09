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
    if(flags.get(fi.Z) == 0)
    r16.set(i16.PC, nn);
}


module.exports = {
    jp_nn,
    setCPU
}