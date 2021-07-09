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

module.exports = {
    jp_nn,
    setCPU
}