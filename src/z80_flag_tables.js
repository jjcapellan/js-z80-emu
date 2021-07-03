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

const buffer_parity = new ArrayBuffer(0x100 * 0x100);
const parity = new Uint8Array(buffer_parity);


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

function generateAndFlagsArray(){
    for (let n1 = 0; n1 <= 0xff; n1++) {
        for (let n2 = 0; n2 <= 0xff; n2++) {
            let flags = 0;
            const result = n1 & n2;

            flags = setSZ(flags, result);
            flags |= H;
            if (checkParity(result)) flags |= PV;
            flags = setF3F5(flags, result);

            let idx = (n1 << 8) | n2;

            flags_and[idx] = flags;
        }
    }

    return flags_sub;
}

function generateParityArray() {
    for (let n = 0; n <= 0xff; n++) {
        parity[n] = checkParity(n);
    }
    return parity;
}

module.exports = {
    generateAddFlagsArray,
    generateSubFlagsArray,
    generateParityArray,
    generateAndFlagsArray
}





