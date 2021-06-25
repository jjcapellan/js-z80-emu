/**
 * This file contains Z80 registers implementation
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

//// General registers
const regsBuffer = new ArrayBuffer(16); // buffer of 16 bytes
const regs8bitArray = new Uint8Array(regsBuffer); // 8bit registers 
const regs16bitArray = new Uint16Array(regsBuffer); // 16bit registers

// Registers of 8 bits: B C D E H L A F B' C' D' E' H' L' A' F'
const regs8 = {
    idx: { B: 0, C: 1, D: 2, E: 3, H: 4, L: 5, A: 6, F: 7 },
    /**
     * 
     * @param {number} regIdx One value from regs8.idx
     * @param {boolean} isAlt Is alternative register?
     * @returns {number}
     */
    get: (regIdx, isAlt) => regs8bitArray[regIdx + 8 * isAlt],

    /**
     * 
     * @param {number} regIdx One value from regs8.idx
     * @param {boolean} isAlt Is alternative register?
     * @param {number} value 8 bit value
     */
    set: (regIdx, isAlt, value) => regs8bitArray[regIdx + 8 * isAlt] = value
}

// Registers of 16 bits: BC DE HL AF BC' DE' HL' AF'
const regs16 = {
    idx: { BC: 0, DE: 1, HL: 2, AF: 3 },

    /**
     * 
     * @param {number} regIdx One value from regs8.idx
     * @param {boolean} isAlt Is alternative register?
     * @returns {number}
     */
    get: (regIdx, isAlt) => regs16bitArray[regIdx + 4 * isAlt],

    /**
     * 
     * @param {number} regIdx One value from regs16.idx
     * @param {boolean} isAlt Is alternative register?
     * @param {number} value 16 bit value
     */
    set: (regIdx, isAlt, value) => regs16bitArray[regIdx + 4 * isAlt] = value
}


//// Special registers
const regsSp = {
    I: 0x0,   // 8bit interrupt vector
    R: 0x0,   // 8bit memory refresh
    IX: 0x0,  // 16bit index register
    IY: 0x0,  // 16bit index register
    SP: 0x0,  // 16bit stack pointer
    PC: 0x0   // 16bit program counter
}


// Flags stored in F register
const flags = {
    idx: { C: 0, N: 1, PV: 2, F3: 3, H: 4, F5: 5, Z: 6, S: 7 },

    /**
     * 
     * @param {number} flagIdx  Index bit in flag registers (flags.idx)
     * @param {boolean} isAltSet Is alternative flag?
     * @returns 
     */
    get: (flagIdx, isAltSet) => {
        return (regs8bitArray[regs8.idx.F + 8 * isAltSet] & (1 << flagIdx)) != 0;
    },

    /**
     * 
     * @param {number} flagIdx Index bit in flag registers (flags.idx)
     * @param {boolean} isAltSet Is alternative flag?
     * @param {boolean} active True sets to 1, false sets to 0. 
     */
    set: (flagIdx, isAltSet, active) => {
        if (active) {
            regs8bitArray[regs8.idx.F + 8 * isAltSet] |= (1 << flagIdx);
        } else {
            regs8bitArray[regs8.idx.F + 8 * isAltSet] &= ~(1 << flagIdx);
        }
    }
}


module.exports = { regs8, regs16, regsSp, flags };