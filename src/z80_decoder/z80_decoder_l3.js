/**
 * This file contains functions to decode the extended opCodes.
 * This functions are called by z80_decoder_l2.js
 * Usefull tables from https://clrhome.org/table/.
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const ins_rot_shift = require('../z80_instructions/ins_rotate_shift');
const ins_bit_set = require('../z80_instructions/ins_bitset');

let CPU, i8, i16, regsTable;
function setDecoderL3CPU(data) {

    ({ CPU, i8, i16 } = data);
    regsTable = {
        0: i8.B,
        1: i8.C,
        2: i8.D,
        3: i8.E,
        4: i8.H,
        5: i8.L,
        7: i8.A
    }
}

function decodeCBXX(byte) {
    const bits76 = byte >> 6;
    const r = byte & 0b111; // (bits 2-0)stores the register code

    if (bits76) {
        const bit = (byte & 0x1f) >> 2; // (bits 5-3) stores bit used in the instruction
        switch (bits76) {

            case 1: // BIT
                if (r == 6) {
                    ins_bit_set.bit_b_ptrHL(bit);
                    break;
                }
                ins_bit_set.bit_b_r(bit, regsTable[r]);
                break;

            case 2: // RES
                if (r == 6) {
                    ins_bit_set.res_b_ptrHL(bit);
                    break;
                }
                ins_bit_set.res_b_r(bit, r);
                break;

            case 3: // SET
                if (r == 6) {
                    ins_bit_set.set_b_ptrHL(bit);
                    break;
                }
                ins_bit_set.set_b_r(bit, r);
                break;

            default:
                break;
        } // end switch
        return;
    } // end if

    const bits543 = (byte & 0x1f) >> 2;

    switch (bits543) {
        case 0: // RLC
            if (r == 6) {
                ins_rot_shift.rlc_ptrHL();
                break;
            }
            ins_rot_shift.rlc_r(r);
            break;

        case 1: // RRC
            if (r == 6) {
                ins_rot_shift.rrc_ptrHL();
                break;
            }
            ins_rot_shift.rrc_r(r);
            break;

        case 2: // RL
            if (r == 6) {
                ins_rot_shift.rl_ptrHL();
                break;
            }
            ins_rot_shift.rl_r(r);
            break;

        case 3: // RR
            if (r == 6) {
                ins_rot_shift.rr_ptrHL();
                break;
            }
            ins_rot_shift.rr_r(r);
            break;

        case 4: // SLA
            if (r == 6) {
                ins_rot_shift.sla_ptrHL();
                break;
            }
            ins_rot_shift.sla_r(r);
            break;

        case 5: // SRA
            if (r == 6) {
                ins_rot_shift.sra_ptrHL();
                break;
            }
            ins_rot_shift.sra_r(r);
            break;

        case 6: // SLL
            // <-------------- TODO undocumented
            console.log('SLL instruction not implemented (TODO)')
            break;

        case 7: // SRL
            if (r == 6) {
                ins_rot_shift.srl_ptrHL();
                break;
            }
            ins_rot_shift.srl_r(r);
            break;

        default:
            break;
    } // end switch

}

module.exports = {
    decodeCBXX,
    setDecoderL3CPU
}