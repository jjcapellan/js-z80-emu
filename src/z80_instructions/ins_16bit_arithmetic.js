/**
 * This file implements Z80 16bit arithmetic instructions group
 * Info on page 187 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

let CPU, r8, i8, r16, i16, flags, fi;
function setCPU(data) {
    ({ CPU, r8, i8, r16, i16, flags, fi } = data);
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
*/
function add_HL_ss(ssIndex) {
    CPU.tCycles += 11;    
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
*/
function adc_HL_ss(ssIndex) {
    CPU.tCycles += 15;
    const ss = r16.get(ssIndex);
    const hl = r16.get(i16.HL);
    const cf = flags.get(fi.C);
    const n = ss + cf;
    const sum = hl + n;
    const result = sum & 0xffff;

    let f = createFlags(
        (sum & (1 << 16)) != 0,
        false,
        !((hl ^ n) & 0x8000) && ((hl ^ result) & 0x8000)?true:false,
        ((result >> 8) & (1 << fi.F3)) != 0,
        (((hl ^ n ^ result) >> 8) & 0x10) != 0,
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
*/
function sbc_HL_ss(ssIndex) {
    CPU.tCycles += 15;
    const ss = r16.get(ssIndex);
    const hl = r16.get(i16.HL);
    const cf = flags.get(fi.C);
    const n = cf + ss;
    const sub = hl - n;
    const result = sub & 0xffff;

    let f = createFlags(
        (sub & (1 << 16)) != 0,
        true,
        ((hl ^ n) & 0x8000) && (hl < result),
        ((result >> 8) & (1 << fi.F3)) != 0,
        (((n ^ hl ^ result) >> 8) & 0x10) != 0,
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
function add_II_XX(iiIndex, xxIndex) {
    const xx = r16.get(xxIndex);
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
*/
function add_IX_pp(ppIndex) {
    CPU.tCycles += 15;
    add_II_XX(i16.IX, ppIndex);
}

/**
* ADD IY, rr
* 
* The contents of register pair rr (any of register pairs BC, DE, IY, or SP) are added to the
* contents of Index Register IY, and the result is stored in IY.
*/
function add_IY_rr(rrIndex) {
    CPU.tCycles += 15;
    add_II_XX(i16.IY, rrIndex);
}

/**
* INC ss
* 
* The contents of register pair ss (any of register pairs BC, DE, HL, or SP) are incremented.
*/
function inc_ss(ssIndex) {
    CPU.tCycles += 6;
    const ss = r16.get(ssIndex);
    const sum = ss + 1;
    const result = sum & 0xffff;
    r16.set(ssIndex, result);
}

/**
* INC IX
* 
* The contents of register IX are incremented.
*/
function inc_IX() {
    CPU.tCycles += 10;
    inc_ss(i16.IX);
}

/**
* INC IY
* 
* The contents of register IY are incremented.
*/
function inc_IY() {
    CPU.tCycles += 10;
    inc_ss(i16.IY);
}

/**
* DEC ss
* 
* The contents of register pair ss (any of the register pairs BC, DE, HL, or SP) are decremented.
*/
function dec_ss(ssIndex) {
    CPU.tCycles += 6;
    const ss = r16.get(ssIndex);
    const sub = ss - 1;
    const result = sub & 0xffff;
    r16.set(ssIndex, result);
}

/**
* DEC IX
* 
* The contents of register pair IX are decremented.
*/
function dec_IX() {
    CPU.tCycles += 10;
    dec_ss(i16.IX);
}

/**
* DEC IY
* 
* The contents of register pair IY are decremented.
*/
function dec_IY() {
    CPU.tCycles += 10;
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
