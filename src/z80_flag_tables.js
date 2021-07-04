/**
 * This file contains functions for generate arrays of precalculated flags masks for Z80 instructions.
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

// Flags stored in register F
// BIT  7   6   5   4   3   2   1   0
//      |   |   |   |   |   |   |   |
//      S   Z   F5  H   F3  PV  N   C

//Flag masks
const S = 0b10000000;
const Z = 0b01000000;
const F5 = 0b00100000;
const H = 0b00010000;
const F3 = 0b00001000;
const PV = 0b00000100;
const N = 0b00000010;
const C = 0b00000001;


// Typed arrays
const buffer_add = new ArrayBuffer(0x100 * 0x100);
const flags_add = new Uint8Array(buffer_add);

const buffer_sub = new ArrayBuffer(0x100 * 0x100);
const flags_sub = new Uint8Array(buffer_sub);

const buffer_and = new ArrayBuffer(0x100 * 0x100);
const flags_and = new Uint8Array(buffer_and);

const buffer_or = new ArrayBuffer(0x100 * 0x100);
const flags_or = new Uint8Array(buffer_or);

const buffer_xor = new ArrayBuffer(0x100 * 0x100);
const flags_xor = new Uint8Array(buffer_xor);

const buffer_parity = new ArrayBuffer(0x100 * 0x100);
const parity = new Uint8Array(buffer_parity);

/**
 * This array stores the adjusts applied by daa instruction for each possible case.
 * Cases exposed [here](http://www.z80.info/z80syntx.htm#DAA)
 * --------------------------------------------------------------------------------
 * |           | C Flag  | HEX value in | H Flag | HEX value in | Number  | C flag|
 * | Operation | Before  | upper digit  | Before | lower digit  | added   | After |
 * |           | DAA     | (bit 7-4)    | DAA    | (bit 3-0)    | to byte | DAA   |
 * |------------------------------------------------------------------------------|
 * |           |    0    |     0-9      |   0    |     0-9      |   00    |   0   |
 * |   ADD     |    0    |     0-8      |   0    |     A-F      |   06    |   0   |
 * |           |    0    |     0-9      |   1    |     0-3      |   06    |   0   |
 * |   ADC     |    0    |     A-F      |   0    |     0-9      |   60    |   1   |
 * |           |    0    |     9-F      |   0    |     A-F      |   66    |   1   |
 * |   INC     |    0    |     A-F      |   1    |     0-3      |   66    |   1   |
 * |           |    1    |     0-2      |   0    |     0-9      |   60    |   1   |
 * |           |    1    |     0-2      |   0    |     A-F      |   66    |   1   |
 * |           |    1    |     0-3      |   1    |     0-3      |   66    |   1   |
 * |------------------------------------------------------------------------------|
 * |   SUB     |    0    |     0-9      |   0    |     0-9      |   00    |   0   |
 * |   SBC     |    0    |     0-8      |   1    |     6-F      |   FA    |   0   |
 * |   DEC     |    1    |     7-F      |   0    |     0-9      |   A0    |   1   |
 * |   NEG     |    1    |     6-F      |   1    |     6-F      |   9A    |   1   |
 * |------------------------------------------------------------------------------|
 * 
 * The array index is a number of 16bits with this structure:
 * Bits 15-11: zeros
 * Bit 10: N flag
 * Bit 9: C flag before DAA
 * Bit 8: H flag before DAA
 * Bits 7-4: value in upper digit
 * Bits 3-0: value in lower digit
 * 
 * Each element have this structure:
 * Bit 8: C flag after DAA
 * Bits 7-0: number to add to the accumulator.
 *  
 */
const maxIndexDaa = 0x07ff;
const buffer_daa = new ArrayBuffer(maxIndexDaa + 1);
const flags_daa = new Uint16Array(buffer_daa);


function checkParity(n) {
    let ones = (n & 1) + ((n & 2) >> 1) + ((n & 4) >> 2) + ((n & 8) >> 3) + ((n & 16) >> 4) + ((n & 32) >> 5) + ((n & 64) >> 6) + ((n & 128) >> 7);
    evenBits = (ones & 1) ^ 1;
    return evenBits;
}

function setSZ(flags, n) {
    if (n & 0x80) flags |= S;
    if ((n & 0xff) == 0) flags |= Z;
    return flags;
}

function setF3F5(flags, n) {
    if (n & F3) flags |= F3;
    if (n & F5) flags |= F5;
    return flags;
}

function generateAddFlagsArray() {
    for (let n1 = 0; n1 <= 0xff; n1++) {
        for (let n2 = 0; n2 <= 0xff; n2++) {
            let flags = 0;
            const result = n1 + n2;

            flags = setSZ(flags, result);
            if ((n1 & 0x0f) > (result & 0x0f)) flags |= H;
            if (result & 0x100) flags |= C;
            // (n1 and n2 same sign) and (result diferent sign) -> set PV
            if (!((n1 & 0x80) ^ (n2 & 0x80)) && ((n1 & 0x80) ^ (result & 0x80))) flags |= PV;
            flags = setF3F5(flags, result);

            let idx = (n1 << 8) | n2;

            flags_add[idx] = flags;
        }
    }

    return flags_add;
}

function generateSubFlagsArray() {
    for (let n1 = 0; n1 <= 0xff; n1++) {
        for (let n2 = 0; n2 <= 0xff; n2++) {
            let flags = 0;
            const result = n1 - n2;

            flags = setSZ(flags, result);
            if ((n1 & 0x0f) < (result & 0x0f)) flags |= H;
            if (result & 0x100) flags |= C;
            // (n1 and n2 different sign) and (result > n1) -> set PV
            if (((n1 & 0x80) ^ (n2 & 0x80)) && (n1 < result)) flags |= PV;
            flags = setF3F5(flags, result);
            flags |= N;

            let idx = (n1 << 8) | n2;

            flags_sub[idx] = flags;
        }
    }

    return flags_sub;
}

function setSZPNC_AndOrXor(flags, result) {
    flags = setSZ(flags, result);
    if (checkParity(result)) flags |= PV;
    flags = setF3F5(flags, result);
    return flags;
}

function generateAndFlagsArray() {
    for (let n1 = 0; n1 <= 0xff; n1++) {
        for (let n2 = 0; n2 <= 0xff; n2++) {
            let flags = 0;
            const result = n1 & n2;
            flags = setSZPNC_AndOrXor(flags, result);
            flags |= H;
            let idx = (n1 << 8) | n2;
            flags_and[idx] = flags;
        }
    }

    return flags_and;
}

function generateOrFlagsArray() {
    for (let n1 = 0; n1 <= 0xff; n1++) {
        for (let n2 = 0; n2 <= 0xff; n2++) {
            let flags = 0;
            const result = n1 | n2;
            flags = setSZPNC_AndOrXor(flags, result);
            let idx = (n1 << 8) | n2;
            flags_or[idx] = flags;
        }
    }

    return flags_or;
}

function generateXorFlagsArray() {
    for (let n1 = 0; n1 <= 0xff; n1++) {
        for (let n2 = 0; n2 <= 0xff; n2++) {
            let flags = 0;
            const result = n1 ^ n2;
            flags = setSZPNC_AndOrXor(flags, result);
            let idx = (n1 << 8) | n2;
            flags_xor[idx] = flags;
        }
    }

    return flags_xor;
}

function generateParityArray() {
    for (let n = 0; n <= 0xff; n++) {
        parity[n] = checkParity(n);
    }
    return parity;
}

function generateDaaArray() {
    // N, C and H flags
    let nch = 0b001;
    // Upper digit
    let ud = 0;
    // Lower digit
    let ld = 0;

    function getIndex(nch, ud, ld) {
        return (nch << 8) | ((ud << 4) | ld);
    }

    function fill(nch, lUd, hUd, lLd, hLd, adjust, carry) {
        for (ud = lUd; ud <= hUd; ud++) {
            for (ld = lLd; ld <= hLd; ld++) {
                let index = getIndex(nch, ud, ld);
                flags_daa[index] = (carry << 8) | adjust;
            }
        }
    }

    // NCH --> 0 0 0
    fill(0b000, 0, 0x9, 0, 0x9, 0, 0);
    fill(0b000, 0, 0x8, 0xa, 0xf, 0x6, 0);
    fill(0b000, 0xa, 0xf, 0, 0x9, 0x60, 1);
    fill(0b000, 0x9, 0xf, 0xa, 0xf, 0x66, 1);
    // NCH --> 0 0 1
    fill(0b001, 0, 0x9, 0, 0x3, 0x6, 0);
    fill(0b001, 0xa, 0xf, 0, 0x3, 0x66, 1);
    // NCH --> 0 1 0
    fill(0b010, 0, 0x2, 0, 0x9, 0x60, 1);
    fill(0b010, 0, 0x2, 0xa, 0xf, 0x66, 1);
    // NCH --> 0 1 1
    fill(0b011, 0, 0x3, 0, 0x3, 0x66, 1);
    // NCH --> 1 0 0
    fill(0b100, 0, 0x9, 0, 0x9, 0, 0);
    // NCH --> 1 0 1
    fill(0b101, 0, 0x8, 0x6, 0xf, 0xfa, 0);
    // NCH --> 1 1 0
    fill(0b110, 0x7, 0xf, 0, 0x9, 0xa0, 1);
    // NCH --> 1 1 1
    fill(0b111, 0x6, 0xf, 0x6, 0xf, 0x9a, 1);

    return flags_daa;
}

module.exports = {
    generateAddFlagsArray,
    generateSubFlagsArray,
    generateParityArray,
    generateAndFlagsArray,
    generateOrFlagsArray,
    generateXorFlagsArray,
    generateDaaArray
}





