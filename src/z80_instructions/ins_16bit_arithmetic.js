/**
 * This file implements Z80 16bit arithmetic instructions group
 * Info on page 187 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let r8, i8, r16, i16, flags, fi;
function setCPU(data) {
    ({ r8, i8, r16, i16, flags, fi } = data);
}

function createFlags(C, N, PV, F3, H, F5, Z, S) {
    return (S << 7) | (Z << 6) | (F5 << 5) | (H << 4) |
        (F3 << 3) | (PV << 2) | (N << 1) | C;
}

/**
* ADD HL, ss
* 
* The contents of register pair ss (any of register pairs BC, DE, HL, or SP) are added to the
* contents of register pair HL and the result is stored in HL.
* Clock: 11T
*/
function add_HL_ss(ssIndex) {
    const ss = r16.get(ssIndex);
    const hl = r16.get(i16.HL);
    let f = r8.get(i8.F);
    const sum = ss + hl;
    const result = sum & 0xffff;

    flags.set(fi.N, false);
    flags.set(fi.C, (sum & (1 << 16)) != 0);
    flags.set(fi.H, (((ss ^ hl ^ result) >> 8) & 0x10) != 0);
    flags.set(fi.F3, ((result >> 8) & (1 << fi.F3)) != 0);
    flags.set(fi.F5, ((result >> 8) & (1 << fi.F5)) != 0);


    r16.set(i16.HL, result);
}

/**
* ADC HL, ss
* 
* The contents of register pair ss (any of register pairs BC, DE, HL, or SP) are added with
* the Carry flag (C flag in the F Register) to the contents of register pair HL, and the result is
* stored in HL.
* Clock: 15T
*/
function adc_HL_ss(ssValue) {
    const ss = ssValue;
    const hl = r16.get(i16.HL);
    const cf = flags.get(fi.C);
    const sum = ss + hl + cf;
    const result = sum & 0xffff;

    let f = createFlags(
        (sum & (1 << 16)) != 0,
        false,
        !((hl & 0x80) ^ (ss & 0x80)) && ((hl & 0x80) ^ (result & 0x80)),
        ((result >> 8) & (1 << fi.F3)) != 0,
        (((ss ^ hl ^ result) >> 8) & 0x10) != 0,
        ((result >> 8) & (1 << fi.F5)) != 0,
        result == 0,
        (result & (1 << 15)) != 0
    );

    r8.set(i8.F, f);
    r16.set(i16.HL, result);
}

/**
* SBC HL, ss
* 
* The contents of the register pair ss (any of register pairs BC, DE, HL, or SP) and the Carry
* Flag (C flag in the F Register) are subtracted from the contents of register pair HL, and the
* result is stored in HL.
* Clock: 15T
*/
function sbc_HL_ss(ssValue) {
    const ss = ssValue;
    const hl = r16.get(i16.HL);
    const cf = flags.get(fi.C);
    const sub = hl - (ss + cf);
    const result = sub & 0xffff;

    let f = createFlags(
        (sub & (1 << 16)) != 0,
        true,
        ((hl & 0x80) ^ ((sl + cf) & 0x80)) && (hl < result),
        ((result >> 8) & (1 << fi.F3)) != 0,
        (((ss ^ hl ^ result) >> 8) & 0x10) != 0,
        ((result >> 8) & (1 << fi.F5)) != 0,
        result == 0,
        (result & (1 << 15)) != 0
    );

    r8.set(i8.F, f);
    r16.set(i16.HL, result);
}

/**
 * Helper function for ADD II, rr BC/DE/IX/IY/SP 
 */
function add_II_XX(iiIndex, xxValue) {
    const xx = xxValue;
    const ii = r16.get(iiIndex);
    const sum = xx + ii;
    const result = sum & 0xffff;

    flags.set(fi.N, false);
    flags.set(fi.C, (sum & (1 << 16)) != 0);
    flags.set(fi.H, (((xx ^ ii ^ result) >> 8) & 0x10) != 0);
    flags.set(fi.F3, ((result >> 8) & (1 << fi.F3)) != 0);
    flags.set(fi.F5, ((result >> 8) & (1 << fi.F5)) != 0);


    r16.set(iiIndex, result);
}

/**
* ADD IX, pp
* 
* The contents of register pair pp (any of register pairs BC, DE, IX, or SP) are added to the
* contents of Index Register IX, and the results are stored in IX.
* Clock: 15T
*/
function add_IX_pp(ppValue) {
    add_II_XX(i16.IX, ppValue);
}

/**
* ADD IY, rr
* 
* The contents of register pair rr (any of register pairs BC, DE, IY, or SP) are added to the
* contents of Index Register IY, and the result is stored in IY.
* Clock: 15T
*/
function add_IY_rr(rrValue) {
    add_II_XX(i16.IY, rrValue);
}

/**
* INC ss
* 
* The contents of register pair ss (any of register pairs BC, DE, HL, or SP) are incremented.
* Clock: 6T
*/
function inc_ss(ssIndex) {
    const ss = r16.get(ssIndex);
    const sum = ss + 1;
    const result = sum & 0xffff;
    r16.set(ssIndex, result);
}

/**
* INC IX
* 
* The contents of register IX are incremented.
* Clock: 10T
*/
function inc_IX() {
    inc_ss(i16.IX);
}

/**
* INC IY
* 
* The contents of register IY are incremented.
* Clock: 10T
*/
function inc_IY() {
    inc_ss(i16.IY);
}

/**
* DEC ss
* 
* The contents of register pair ss (any of the register pairs BC, DE, HL, or SP) are decremented.
* Clock: 6T
*/
function dec_ss(ssIndex) {
    const ss = r16.get(ssIndex);
    const sub = ss - 1;
    const result = sub & 0xffff;
    r16.set(ssIndex, result);
}

/**
* DEC IX
* 
* The contents of register pair IX are decremented.
* Clock: 10T
*/
function dec_IX() {
    dec_ss(i16.IX);
}

/**
* DEC IY
* 
* The contents of register pair IY are decremented.
* Clock: 10T
*/
function dec_IY() {
    dec_ss(i16.IY);
}

module.exports = {
    add_HL_ss,
    add_IX_pp,
    add_IY_rr,
    adc_HL_ss,
    sbc_HL_ss,
    inc_ss,
    inc_IX,
    inc_IY,
    dec_ss,
    dec_IX,
    dec_IY,
    setCPU
}
