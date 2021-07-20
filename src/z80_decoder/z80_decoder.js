/**
 * This file contains functions to decode opCodes.
 * Look at [table](https://clrhome.org/table/).
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const ins_rot_shift = require('../z80_instructions/ins_rotate_shift');
const ins_input_output = require('../z80_instructions/ins_input_output');
const ins_16bit_arithm = require('../z80_instructions/ins_16bit_arithmetic');
const ins_16bit_load = require('../z80_instructions/ins_16bit_load');
const ins_general_arithm_cpu = require('../z80_instructions/ins_general_arithm_cpu');
const ins_jump = require('../z80_instructions/ins_jump');
const ins_call_return = require('../z80_instructions/ins_call_return');
const ins_8bit_load = require('../z80_instructions/ins_8bit_load');
const ins_8bit_arithm = require('../z80_instructions/ins_8bit_arithmetic');
const ins_exch_tran = require('../z80_instructions/ins_exch_trans_search');

let CPU, i8, i16, fi, regsTable, regsTableDD, regs16Table, ccTable;
function setCPU(data) {

    ({ CPU, i8, i16, fi } = data);
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

    regsTableDD = {
        0: i8.B,
        1: i8.C,
        2: i8.D,
        3: i8.E,
        4: i8.IXh,
        5: i8.IXl,
        6: false,
        7: i8.A
    };

    regs16Table = {
        0: i16.BC,
        1: i16.DE,
        2: i16.HL,
        3: i16.SP
    };

    ccTable = {
        0: { flag: fi.Z, isActive: false },   // NZ
        1: { flag: fi.Z, isActive: true },    // Z
        2: { flag: fi.C, isActive: false },   // NC
        3: { flag: fi.C, isActive: true },    // C
        4: { flag: fi.PV, isActive: false },  // PO
        5: { flag: fi.PV, isActive: true },   // PE
        6: { flag: fi.S, isActive: false },   // P
        7: { flag: fi.S, isActive: true }     // M
    }

    rstTable = {
        0: 0x00,
        1: 0x08,
        2: 0x10,
        3: 0x18,
        4: 0x20,
        5: 0x28,
        6: 0x30,
        7: 0x38
    };


}

function get_nn() {
    let lsb = CPU.getByte();
    let hsb = CPU.getByte();
    return (hsb << 8) | lsb;
}

function decode(byte) {
    let bits76 = byte >> 6;
    const bits54 = (byte >> 4) & 0b11;
    const bits210 = byte & 0b111;
    const bit3 = (byte >> 3) & 1;

    if (bits76 == 0) { // Rows 0 - 3
        if (bits210 == 0) { // Columns 0 and 8
            switch (byte) {
                case 0x00:
                    // NOP <----- TODO
                    break;

                case 0x10:
                    ins_jump.djnz_e(CPU.getByte());
                    break;

                case 0x20:
                    ins_jump.jr_nz_e(CPU.getByte());
                    break;

                case 0x30:
                    ins_jump.jr_nc_e(CPU.getByte());
                    break;

                case 0x08:
                    ins_exch_tran.ex_AF_AF2();
                    break;

                case 0x18:
                    ins_jump.jr_e(CPU.getByte());
                    break;

                case 0x28:
                    ins_jump.jr_z_e(CPU.getByte());
                    break;

                case 0x38:
                    ins_jump.jr_c_e(CPU.getByte());
                    break;
            }
            return;
        } // end if(bits210 == 0)

        if (bits210 == 1) { // Columns 1 and 9
            if (!bit3) {
                ins_16bit_load.ld_dd_nn(regs16Table[bits54], get_nn());
                return;
            }
            ins_16bit_arithm.add_HL_ss(regs16Table[bits54]);
            return;
        }

        if (bits210 == 2) { // Columns 2 and a
            switch (byte) {
                case 0x02:
                    ins_8bit_load.ld_ptrBC_A();
                    break;

                case 0x12:
                    ins_8bit_load.ld_ptrDE_A();
                    break;

                case 0x22:
                    ins_16bit_load.ld_ptrnn_HL(get_nn());
                    break;

                case 0x32:
                    ins_8bit_load.ld_ptrnn_A(get_nn());
                    break;

                case 0x0a:
                    ins_8bit_load.ld_A_ptrBC();
                    break;

                case 0x1a:
                    ins_8bit_load.ld_A_ptrDE();
                    break;

                case 0x2a:
                    ins_16bit_load.ld_HL_ptrnn(get_nn());
                    break;

                case 0x3a:
                    ins_8bit_load.ld_A_ptrnn(get_nn());
                    break;
            }
            return;
        } // end if(bits210 == 2)

        if (bits210 == 3) { // Columns 3 and b
            if (!bit3) {
                ins_16bit_arithm.inc_ss(regs16Table[bits54]);
                return;
            }
            ins_16bit_arithm.dec_ss(regs16Table[bits54]);
            return;
        }

        if (bits210 == 4) { // Columns 4 and c
            const r = regsTable[(byte >> 3) & 0b111];
            if (!r) {
                ins_8bit_arithm.inc_ptrHL();
                return;
            }
            ins_8bit_arithm.inc_r(r);
            return;
        }

        if (bits210 == 5) { // Columns 5 and d
            const r = regsTable[(byte >> 3) & 0b111];
            if (!r) {
                ins_8bit_arithm.dec_ptrHL();
                return;
            }
            ins_8bit_arithm.dec_r(r);
            return;
        }

        if (bits210 == 6) { // Columns 6 and e
            const r = regsTable[(byte >> 3) & 0b111];
            if (!r) {
                ins_8bit_load.ld_ptrHL_r(r);
                return;
            }
            ins_8bit_load.ld_r_n(CPU.getByte());
            return;
        }

        if (bits210 == 7) { // Columns 7 and f
            switch (byte) {
                case 0x07:
                    ins_rot_shift.rlca();
                    break;

                case 0x17:
                    ins_rot_shift.rla();
                    break;

                case 0x27:
                    ins_general_arithm_cpu.daa();
                    break;

                case 0x37:
                    ins_general_arithm_cpu.scf();
                    break;

                case 0x0f:
                    ins_rot_shift.rrca();
                    break;

                case 0x1f:
                    ins_rot_shift.rra();
                    break;

                case 0x2f:
                    ins_general_arithm_cpu.cpl();
                    break;

                case 0x3f:
                    ins_general_arithm_cpu.ccf();
                    break;
            }
            return;
        } // end if(bits210 == 7)
    }

    if (bits76 == 1) { // Rows 4 - 7 

        if (byte == 76) {
            ins_general_arithm_cpu.halt();
            return;
        }

        let r1 = regsTable[(byte >> 3) & 0b111];
        let r2 = regsTable[bits210];

        if (r1 == false) {
            ins_8bit_load.ld_ptrHL_r(r2);
            return;
        }

        if (r2 == false) {
            ins_8bit_load.ld_r_ptrHL(r1);
            return;
        }

        ins_8bit_load.ld_r_r2(r1, r2);
        return;
    }

    if (bits76 == 2) { // Rows 8 - b
        const bits543 = (byte >> 3) & 0b111;
        const r = regsTable[bits210];

        if (!r) {
            switch (bits543) {
                case 0:
                    ins_8bit_arithm.add_A_ptrHL();
                    break;

                case 1:
                    ins_8bit_arithm.adc_A_ptrHL();
                    break;

                case 2:
                    ins_8bit_arithm.sub_A_ptrHL();
                    break;

                case 3:
                    ins_8bit_arithm.sbc_A_ptrHL();
                    break;

                case 4:
                    ins_8bit_arithm.and_ptrHL();
                    break;

                case 5:
                    ins_8bit_arithm.xor_ptrHL();
                    break;

                case 6:
                    ins_8bit_arithm.or_ptrHL();
                    break;

                case 7:
                    ins_8bit_arithm.cp_ptrHL();
                    break;
            }
            return;
        } // end if(!r)

        switch (bits543) {
            case 0:
                ins_8bit_arithm.add_A_r(r);
                break;

            case 1:
                ins_8bit_arithm.adc_A_r(r);
                break;

            case 2:
                ins_8bit_arithm.sub_A_r(r);
                break;

            case 3:
                ins_8bit_arithm.sbc_A_r(r);
                break;

            case 4:
                ins_8bit_arithm.and_r(r);
                break;

            case 5:
                ins_8bit_arithm.xor_r(r);
                break;

            case 6:
                ins_8bit_arithm.or_r(r);
                break;

            case 7:
                ins_8bit_arithm.cp_r(r);
                break;
        }
        return;
    } // end if(bits76 == 2)

    if (bits76 == 3) { // Rows c - f
        if (bits210 == 0) { // Columns 0 and 8 (ret cc)
            const cc = ccTable[(byte >> 3) & 0b111];
            ins_call_return.ret_cc(cc.flag, cc.isActive);
            return;
        }

        if (bits210 == 1) { // Columns 1 and 9
            if (!bit3) {
                const qq = regs16Table[bits54];
                ins_16bit_load.pop_qq(qq);
                return;
            }
            switch (byte) {
                case 0xc9:
                    ins_call_return.ret();
                    break;

                case 0xd9:
                    ins_exch_tran.exx();
                    break;

                case 0xe9:
                    ins_jump.jp_ptrHL();
                    break;

                case 0xf9:
                    ins_16bit_load.ld_SP_HL();
                    break;
            } // end switch
            return;
        } // end if(bits210 == 1)

        if (bits210 == 2) { // Columns 2 and a
            const bits543 = (byte >> 3) & 0b111;
            const cc = ccTable[bits543];
            ins_jump.jp_cc_nn(cc.flag, cc.isActive, get_nn());
            return;
        }

        if (bits210 == 3) {
            switch (byte) {
                case 0xc3:
                    ins_jump.jp_nn(get_nn());
                    break;

                case 0xd3:
                    ins_input_output.out_n_A(CPU.getByte());
                    break;

                case 0xe3:
                    ins_exch_tran.ex_ptrSP_HL();
                    break;

                case 0xf3:
                    ins_general_arithm_cpu.di();
                    break;

                case 0xcb: // prefix BITS <-------- TODO
                    break;

                case 0xdb:
                    ins_input_output.in_A_n(CPU.getByte());
                    break;

                case 0xeb:
                    ins_exch_tran.ex_DE_HL();
                    break;

                case 0xfb:
                    ins_general_arithm_cpu.ei();
                    break;
            } // end switch
            return;
        } // end if(bits210 == 3)

        if (bits210 == 4) { // Columns 4 and c
            const bits543 = (byte >> 3) & 0b111;
            const cc = ccTable[bits543];
            ins_call_return.call_cc_nn(cc.flag, cc.isActive, get_nn());
            return;
        }

        if (bits210 == 5) { // Columns 5 and d
            if (!bit3) {
                const qq = regs16Table[bits54];
                ins_16bit_load.push_qq(qq);
                return;
            }
            switch (byte) {
                case 0xcd:
                    ins_call_return.call_nn(get_nn());
                    break;

                case 0xdd: // IX prefix   <------- TODO
                    break;

                case 0xed: // EXTD prefix <------- TODO
                    break;

                case 0xfd: // IY prefix   <------- TODO
                    break;
            } // end switch
            return;
        } // end if(bits210 == 5)

        if (bits210 == 6) { // Columns 6 and e
            switch (byte) {
                case 0xc6:
                    ins_8bit_arithm.add_A_n(CPU.getByte());
                    break;

                case 0xd6:
                    ins_8bit_arithm.sub_A_n(CPU.getByte());
                    break;

                case 0xe6:
                    ins_8bit_arithm.and_n(CPU.getByte());
                    break;

                case 0xf6:
                    ins_8bit_arithm.or_n(CPU.getByte());
                    break;

                case 0xce:
                    ins_8bit_arithm.adc_A_n(CPU.getByte());
                    break;

                case 0xde:
                    ins_8bit_arithm.sbc_A_n(CPU.getByte());
                    break;

                case 0xee:
                    ins_8bit_arithm.xor_n(CPU.getByte());
                    break;

                case 0xfe:
                    ins_8bit_arithm.cp_n(CPU.getByte());
                    break;
            } // end switch
        } // end if(bits210 == 6)

        if (bits210 == 7) { // Columns 7 and f
            const bits543 = (byte >> 3) & 0b111;
            const p = rstTable[bits543];
            ins_call_return.rst_p(p);
            return;
        }
    } // end if(bits76 == 3)
}

module.exports = {
    decode,
    setCPU
};