/**
 * This file contains functions to decode the extended opCodes.
 * This functions are called by z80_decoder_l2.js
 * Usefull tables from https://clrhome.org/table/.
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const ins_rot_shift = require('../z80_instructions/ins_rotate_shift');
const ins_bit_set = require('../z80_instructions/ins_bitset');
const ins_input_output = require('../z80_instructions/ins_input_output');
const ins_16bit_arithm = require('../z80_instructions/ins_16bit_arithmetic');
const ins_16bit_load = require('../z80_instructions/ins_16bit_load');
const ins_general_arithm_cpu = require('../z80_instructions/ins_general_arithm_cpu');
const ins_call_return = require('../z80_instructions/ins_call_return');
const ins_8bit_load = require('../z80_instructions/ins_8bit_load');
const ins_exch_tran = require('../z80_instructions/ins_exch_trans_search');

let CPU, i8, i16, regsTable, regs16Table;
function setDecoderL3CPU(data) {

    ({ CPU, i8, i16 } = data);
    regsTable = {
        0: i8.B,
        1: i8.C,
        2: i8.D,
        3: i8.E,
        4: i8.H,
        5: i8.L,
        6: false,
        7: i8.A
    };
    regs16Table = {
        0: i16.BC,
        1: i16.DE,
        2: i16.HL,
        3: i16.SP
    };
}

function get_nn() {
    let lsb = CPU.getByte();
    let hsb = CPU.getByte();
    return (hsb << 8) | lsb;
}

function decodeCBXX(byte) {
    const bits76 = byte >> 6;
    const r = regsTable[byte & 0b111]; // (bits 2-0)stores the register code

    if (bits76) {
        const bit = (byte & 0x1f) >> 2; // (bits 5-3) stores bit used in the instruction
        switch (bits76) {

            case 1: // BIT
                if (r == 6) {
                    ins_bit_set.bit_b_ptrHL(bit);
                    break;
                }
                ins_bit_set.bit_b_r(bit, r);
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
            console.log('SLL instruction not implemented (TODO)');
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

function decodeEDXX(byte) {
    const bits76 = byte >> 6;
    if (bits76 == 1) {
        const bits210 = byte & 0b111;

        switch (bits210) {
            case 0:
                {
                    const r = regsTable[(byte & 0x1f) >> 2];
                    if (!r) {
                        // TODO
                        break;
                    }
                    ins_input_output.in_r_C(r);
                    break;
                }

            case 1:
                {
                    const r = regsTable[(byte & 0x1f) >> 2];
                    if (!r) {
                        // TODO
                        break;
                    }
                    ins_input_output.out_C_r(r);
                    break;
                }

            case 2:
                {
                    const bit3 = (byte & 0xf) >> 3;
                    const ss = regs16Table[(byte & 0x3f) >> 4];
                    if (bit3) {
                        ins_16bit_arithm.adc_HL_ss(ss);
                        break;
                    }
                    ins_16bit_arithm.sbc_HL_ss(ss);
                    break;
                }

            case 3:
                {
                    const bit3 = (byte & 0xf) >> 3;
                    const dd = regs16Table[(byte & 0x3f) >> 4];
                    const nn = get_nn();
                    if (bit3) {
                        ins_16bit_load.ld_dd_ptrnn(dd, nn);
                        break;
                    }
                    ins_16bit_load.ld_ptrnn_dd(dd, nn);
                    break;
                }

            case 4:
                ins_general_arithm_cpu.neg();
                break;

            case 5:
                if (byte == 0x4d) {
                    ins_call_return.reti();
                    break;
                }
                ins_call_return.retn();
                break;

            case 6:
                {
                    const bit3 = (byte & 0xf) >> 3;
                    const bit4 = (byte >> 4) & 1;
                    if (!bit4) {
                        ins_general_arithm_cpu.im(0);
                        break;
                    }
                    if (bit3) {
                        ins_general_arithm_cpu.im(2);
                        break;
                    }
                    ins_general_arithm_cpu.im(1);
                    break;
                }

            default:
                switch (byte) {
                    case 0x47:
                        ins_8bit_load.ld_I_A();
                        break;

                    case 0x57:
                        ins_8bit_load.ld_A_I();
                        break;

                    case 0x67:
                        ins_rot_shift.rrd();
                        break;

                    case 0x4f:
                        ins_8bit_load.ld_R_A();
                        break;

                    case 0x5f:
                        ins_8bit_load.ld_A_R();
                        break;

                    case 0x6f:
                        ins_rot_shift.rld();
                        break;

                    default:
                        // TODO NOP2X
                        console.log('NOP2X instruction not implemented (TODO)');
                        break;
                } // end nested switch
                break;
        } // end switch
        return;
    } // end if (bits76 == 1)

    switch (byte) {
        case 0xa0:
            ins_exch_tran.ldi();
            break;

        case 0xb0:
            ins_exch_tran.ldir();
            break;

        case 0xa1:
            ins_exch_tran.cpi();
            break;

        case 0xb1:
            ins_exch_tran.cpir();
            break;

        case 0xa2:
            ins_input_output.ini();
            break;

        case 0xb2:
            ins_input_output.inir();
            break;

        case 0xa3:
            ins_input_output.outi();
            break;

        case 0xb3:
            ins_input_output.otir();
            break;

        case 0xa8:
            ins_exch_tran.ldd();
            break;

        case 0xb8:
            ins_exch_tran.lddr();
            break;

        case 0xa9:
            ins_exch_tran.cpd();
            break;

        case 0xb9:
            ins_exch_tran.cpdr();
            break;

        case 0xaa:
            ins_input_output.ind();
            break;

        case 0xba:
            ins_input_output.indr();
            break;

        case 0xab:
            ins_input_output.outd();
            break;

        case 0xbb:
            ins_input_output.outdr();
            break;

        default:
            // TODO NOP2X
            console.log('NOP2X instruction not implemented (TODO)');
            break;
    }
}

module.exports = {
    decodeCBXX,
    decodeEDXX,
    setDecoderL3CPU
}