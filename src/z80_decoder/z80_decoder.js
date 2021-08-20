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
const ins_bitset = require('../z80_instructions/ins_bitset');


let CPU, i8, i16, fi, regsTable, r8TableDD, r8TableFD, r16TableDD, r16TableFD, regs16Table, ccTable;
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

    r8TableDD = {
        0: i8.B,
        1: i8.C,
        2: i8.D,
        3: i8.E,
        4: i8.IXh,
        5: i8.IXl,
        6: false,
        7: i8.A
    };

    r8TableFD = {
        0: i8.B,
        1: i8.C,
        2: i8.D,
        3: i8.E,
        4: i8.IYh,
        5: i8.IYl,
        6: false,
        7: i8.A
    };

    regs16Table = {
        0: i16.BC,
        1: i16.DE,
        2: i16.HL,
        3: i16.SP
    };

    r16TableDD = {
        0: i16.BC,
        1: i16.DE,
        2: i16.IX,
        3: i16.SP
    };

    r16TableFD = {
        0: i16.BC,
        1: i16.DE,
        2: i16.IY,
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

function decodeCBXX(byte) {
    const bits76 = byte >> 6;
    const bits543 = (byte & 0x1f) >> 2;
    const bits210 = byte & 0b111;

    const r = regsTable[bits210]; // (bits 2-0)stores the register code

    if (bits76) {
        const bit = bits543; // (bits 5-3) stores bit used in the instruction
        switch (bits76) {

            case 1: // BIT
                if (r == 6) { // BIT b, (HL)
                    ins_bit_set.bit_b_ptrXXplusd(i16.HL, bit, 0, 12);
                    break;
                }
                ins_bit_set.bit_b_r(bit, r);
                break;

            case 2: // RES
                if (r == 6) { // RES b, (HL)
                    ins_bit_set.res_b_ptrXXplusd(i16.HL, bit, 0, 15);
                    break;
                }
                ins_bit_set.res_b_r(bit, r);
                break;

            case 3: // SET
                if (r == 6) { // SET b, (HL)
                    ins_bit_set.set_b_ptrXXplusd(i16.HL, bit, 0, 15);
                    break;
                }
                ins_bit_set.set_b_r(bit, r);
                break;

            default:
                break;
        } // end switch
        return;
    } // end if


    switch (bits543) {
        case 0: // RLC
            if (!r) { // RLC (HL)
                ins_rot_shift.rlc_ptrXXplusd(i16.HL, 0, 15);
                break;
            }
            ins_rot_shift.rlc_r(r);
            break;

        case 1: // RRC
            if (!r) { // RRC (HL)
                ins_rot_shift.rrc_ptrXXplusd(i16.HL, 0, 4);
                break;
            }
            ins_rot_shift.rrc_r(r);
            break;

        case 2: // RL
            if (!r) { // RL (HL)
                ins_rot_shift.rl_ptrXXplusd(i16.HL, 0, 4);
                break;
            }
            ins_rot_shift.rl_r(r);
            break;

        case 3: // RR
            if (!r) { // RR (HL)
                ins_rot_shift.rr_ptrXXplusd(i16.HL, 0, 4);
                break;
            }
            ins_rot_shift.rr_r(r);
            break;

        case 4: // SLA
            if (!r) { // SLA (HL)
                ins_rot_shift.sla_ptrXXplusd(i16.HL, 0, 4);
                break;
            }
            ins_rot_shift.sla_r(r);
            break;

        case 5: // SRA
            if (!r) { // SRA (HL)
                ins_rot_shift.sra_ptrXXplusd(i16.HL, 0, 4);
                break;
            }
            ins_rot_shift.sra_r(r);
            break;

        case 6: // SLL
            // <-------------- TODO undocumented
            console.log('SLL instruction not implemented (TODO)');
            break;

        case 7: // SRL
            if (!r) { // SRL (HL)
                ins_rot_shift.srl_ptrXXplusd(i16.HL, 0, 4);
                break;
            }
            ins_rot_shift.srl_r(r);
            break;

        default:
            break;
    } // end switch
} // end function decodeCBXX


function decodeEDXX(byte) {
    const bits76 = byte >> 6;
    const bits543 = (byte & 0x1f) >> 2;
    const r = regsTable[bits543];
    if (bits76 == 1) { // Rows 4 - 7
        const bits210 = byte & 0b111;
        switch (bits210) {
            case 0:
                {
                    if (!r) {
                        // TODO (0x70)
                        break;
                    }
                    ins_input_output.in_r_C(r);
                    break;
                }

            case 1:
                {
                    if (!r) {
                        // TODO (0x71)
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
                    if (bit3) { // LD dd, (nn)
                        ins_16bit_load.ld_XX_ptrnn(dd, nn, 20);
                        break;
                    }
                    ins_16bit_load.ld_ptrnn_XX(dd, nn, 20);
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
} // end function decodeEDXX

function decodeCBIndex(d, byte, xyIndex){
    const bits76 = byte >> 6;
    const r = regsTable[byte & 0b111]; // bits210
    const b = (byte >> 3) & 0b111; // bits543
    const bit3 = b & 1;
    const row = byte >> 4;

    if(bits76 == 0){ // Rows 0-3
        switch(row){
            case 0:
                if(!bit3 && r){
                    ins_rot_shift.rlc_ptrXXplusd_r(xyIndex, d, r, 23);
                    return;                    
                }
                if(!bit3){
                    ins_rot_shift.rlc_ptrXXplusd(xyIndex, d, 23);
                    return;
                }
                if(bit3 && r){
                    ins_rot_shift.rrc_ptrXXplusd_r(xyIndex, d, r, 23);
                    return;
                }
                if(bit3){
                    ins_rot_shift.rrc_ptrXXplusd(xyIndex, d, 23);
                    return;
                }
                break; // End case row == 0
            
            case 1:
                if(!bit3 && r){
                    ins_rot_shift.rl_ptrXXplusd_r(xyIndex, d, r, 23);
                    return;                    
                }
                if(!bit3){
                    ins_rot_shift.rl_ptrXXplusd(xyIndex, d, 23);
                    return;
                }
                if(bit3 && r){
                    ins_rot_shift.rr_ptrXXplusd_r(xyIndex, d, r, 23);
                    return;
                }
                if(bit3){
                    ins_rot_shift.rr_ptrXXplusd(xyIndex, d, 23);
                    return;
                }
                break; // End case row == 1

            case 2:
                if(!bit3 && r){
                    ins_rot_shift.sla_ptrXXplusd_r(xyIndex, d, r, 23);
                    return;                    
                }
                if(!bit3){
                    ins_rot_shift.sla_ptrXXplusd(xyIndex, d, 23);
                    return;
                }
                if(bit3 && r){
                    ins_rot_shift.sra_ptrXXplusd_r(xyIndex, d, r, 23);
                    return;
                }
                if(bit3){
                    ins_rot_shift.sra_ptrXXplusd(xyIndex, d, 23);
                    return;
                }
                break; // End case row == 2
            
            case 3:
                // TODO
                break;
        } // end switch row
        return;
    } // end if (bit76 == 0)

    if(bits76 == 1){
        ins_bitset.bit_b_ptrXXplusd(xyIndex, b, d, 20);
        return;
    }
    if(bits76 == 2){
        ins_bitset.res_b_ptrXXplusd(xyIndex, b, d, 23);
        return;
    }
    if(bits76 == 3){
        ins_bitset.set_b_ptrXXplusd(xyIndex, b, d, 23);
        return;
    }
    return;
} // end decodeCBIndex


// Look at http://www.z80.info/zip/z80-documented.pdf page 11
// DDXX and FDXX
function decodeIndex(byte, r8Table, r16Table, xyIndex) {
    const bits76 = byte >> 6;
    let aux1, aux2;

    if (bits76 == 0) { // Rows 0 - 3
        const bits543 = (byte >> 3) & 0b111;
        switch (byte) {
            case 0x21: // LD IX/IY, nn
                ins_16bit_load.ld_XX_nn(xyIndex, get_nn(), 14);
                break;
            case 0x22: // LD (nn), IX/IY
                ins_16bit_load.ld_ptrnn_XX(xyIndex, get_nn(), 20);
                break;
            case 0x23:
                ins_16bit_arithm.inc_ss(xyIndex);
                break;
            case 0x2a: // LD IX/IY, (nn)
                ins_16bit_load.ld_XX_ptrnn(xyIndex, get_nn(), 20);
                break;
            case 0x2b:
                CPU.tCycles += 4;
                ins_16bit_arithm.dec_ss(xyIndex); // 6 tCycles
                break;
            case 0x24:
            case 0x2c:
                CPU.tCycles += 4;
                ins_8bit_arithm.inc_r(r8Table[bits543]); // 4 tCycles
                break;
            case 0x25:
            case 0x2d:
                CPU.tCycles += 4;
                ins_8bit_arithm.dec_r(r8Table[bits543]); // 4 tCycles
                break;
            case 0x26:
            case 0x2e:
                CPU.tCycles += 4;
                ins_8bit_load.ld_r_n(r8Table[bits543], CPU.getByte());
                break;

            case 0x09:
            case 0x19:
            case 0x29:
            case 0x39:
                ins_16bit_arithm.add_II_XX(xyIndex, r16Table[bits543 >> 1]);
                break;
            case 0x34: // INC (IX/IY + d)
                ins_8bit_arithm.inc_ptrXXplusd(xyIndex, CPU.getByte(), 23);
                break;
            case 0x35: // DEC (IX/IY + d)
                ins_8bit_arithm.dec_ptrXXplusd(xyIndex, CPU.getByte(), 23);
                break;
            case 0x36: // LD (IX/IY + d), n
                aux1 = CPU.getByte();
                aux2 = CPU.getByte();
                ins_8bit_load.ld_ptrXXplusd_n(xyIndex, aux1, aux2, 19);
                break;
            default:
                // NOP2X <------- TODO
                break;
        } // end switch(byte)
        return;
    } // end if(bits76 == 0)

    if (bits76 == 1) { // Rows 4 - 7
        const bits543 = (byte >> 3) & 0b111;
        const bits210 = byte & 0b111;
        switch (byte) {
            case 0x44: case 0x45: case 0x54: case 0x55: case 0x4c:
            case 0x4d: case 0x5c: case 0x5d: case 0x60: case 0x61:
            case 0x62: case 0x63: case 0x64: case 0x65: case 0x67:
            case 0x68: case 0x69: case 0x6a: case 0x6b: case 0x6c:
            case 0x6d: case 0x6f: case 0x7c:
            case 0x7d:
                CPU.tCycles += 4;
                ins_8bit_load.ld_r_r2(r8Table[bits543], r8Table[bits210]); // tCycles 4
                break;
            case 0x46: case 0x56: case 0x66: case 0x4e: case 0x5e: case 0x6e:
            case 0x7e:
                ins_8bit_load.ld_r_ptrXXplusd(r8Table[bits210], CPU.getByte(), xyIndex, 19);
                break;
            case 0x70: case 0x71: case 0x72: case 0x73: case 0x74: case 0x75: 
            case 0x77: // LD (IX/IY + d), r
                ins_8bit_load.ld_ptrXXplusd_r(r8Table[bits210], CPU.getByte(), xyIndex, 19);
                break;
            default:
                // NOP2x <-------- TODO
                break;
        }
        return;
    } // end if(bits76 == 1)

    if (bits76 == 2) { // Rows 8 - b
        const bits210 = byte & 0b111;
        switch (byte) {
            case 0x84:
            case 0x85:
                CPU.tCycles += 4;
                ins_8bit_arithm.add_A_r(r8Table[bits210]); // 4 tCycles
                break;
            case 0x86: // ADD A, (IX/IY + d)
                ins_8bit_arithm.add_A_ptrXXplusd(xyIndex, CPU.getByte(), 19);
                break;
            case 0x8c:
            case 0x8d:
                CPU.tCycles += 4;
                ins_8bit_arithm.adc_A_r(r8Table[bits210]); // 4 tCycles
                break;
            case 0x8e: // ADC A, (IX/IY + d)
                ins_8bit_arithm.adc_A_ptrXXplusd(xyIndex, CPU.getByte(), 19);
                break;
            case 0x94:
            case 0x95:
                CPU.tCycles += 4;
                ins_8bit_arithm.sub_A_r(r8Table[bits210]);
                break;
            case 0x96: // SUB A, (IX/IY + d)
                ins_8bit_arithm.sub_A_ptrXXplusd(xyIndex, CPU.getByte(), 19);
                break;
            case 0x9c:
            case 0x9d:
                CPU.tCycles += 4;
                ins_8bit_arithm.sbc_A_r(r8Table[bits210]);
                break;
            case 0x9e: // SBC A, (IX/IY + d)
                ins_8bit_arithm.sbc_A_ptrXXplusd(xyIndex, CPU.getByte(), 19);
                break;
            case 0xa4:
            case 0xa5:
                CPU.tCycles += 4;
                ins_8bit_arithm.and_r(r8Table[bits210]);
                break;
            case 0xa6: // AND (IX/IY + d)
                ins_8bit_arithm.and_ptrXXplusd(xyIndex, CPU.getByte(), 19);
                break;
            case 0xac:
            case 0xad:
                CPU.tCycles += 4;
                ins_8bit_arithm.xor_r(r8Table[bits210]);
                break;
            case 0xae: // XOR (IX/IY + d)
                ins_8bit_arithm.xor_ptrXXplusd(xyIndex, CPU.getByte(), 19);
                break;
            case 0xb4:
            case 0xb5:
                CPU.tCycles += 4;
                ins_8bit_arithm.or_r(r8Table[bits210]);
                break;
            case 0xb6: // OR (IX/IY + d)
                ins_8bit_arithm.or_ptrXXplusd(xyIndex, CPU.getByte(), 19);
                break;
            case 0xbc:
            case 0xbd:
                CPU.tCycles += 4;
                ins_8bit_arithm.cp_r(r8Table[bits210]);
                break;
            case 0xbe: // CP (IX/IY + d)
                ins_8bit_arithm.cp_ptrXXplusd(xyIndex, CPU.getByte(), 19);
                break;
            default:
                // NOP2X <--------- TODO
                break;
        } // end switch
        return;
    } // end if(bits76 == 2)

    if (bit76 == 3) { // Rows c - f
        const bits54 = (byte >> 4) & 0b11;
        switch (byte) {
            case 0xcb:
                // prefix XXCB
                decodeCBIndex(CPU.getByte(), CPU.getByte(), xyIndex)
                break;
            case 0xe1: // POP IX/IY
                ins_16bit_load.pop_XX(r8Table[bits54], 14);
                break;
            case 0xe3: // EX (SP), IX/IY
                ins_exch_tran.ex_ptrSP_XX(xyIndex, 23);
                break;
            case 0xe5: // PUSH IX/IY
                ins_16bit_load.push_XX(xyIndex, 15);
                break;
            case 0xe9:
                ins_jump.jp_ptrXX(xyIndex);
                break;
            case 0xf9: // LD SP, IX/IY
                ins_16bit_load.ld_SP_XX(xyIndex, 10);
                break;
            default:
                // NOP2X <-------- TODO
                break;
        }
        return;
    } // end if(bits76 == 3)
}

function decode(byte) {
    const bits76 = byte >> 6;
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
            let dd = regs16Table[bits54];

            if (!bit3) { // LD dd, nn
                ins_16bit_load.ld_XX_nn(dd, get_nn(), 10);
                return;
            }

            ins_16bit_arithm.add_HL_ss(dd);
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

                case 0x22: // LD (nn), HL
                    ins_16bit_load.ld_ptrnn_XX(i16.HL, get_nn(), 16);
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

                case 0x2a: // LD HL, (nn)
                    ins_16bit_load.ld_XX_ptrnn(i16.HL, get_nn(), 16);
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
            if (!r) { // INC (HL)
                ins_8bit_arithm.inc_ptrXXplusd(i16.HL, 0, 11);
                return;
            }
            ins_8bit_arithm.inc_r(r);
            return;
        }

        if (bits210 == 5) { // Columns 5 and d
            const r = regsTable[(byte >> 3) & 0b111];
            if (!r) { // DEC (HL)
                ins_8bit_arithm.dec_ptrXXplusd(i16.HL, 0, 11);
                return;
            }
            ins_8bit_arithm.dec_r(r);
            return;
        }

        if (bits210 == 6) { // Columns 6 and e
            const r = regsTable[(byte >> 3) & 0b111];
            if (!r) { // LOAD (HL), n
                ins_8bit_load.ld_ptrXXplusd_n(i16.HL, 0, CPU.getByte(), 10);
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

        if (r2 == false) { // LD r, (HL)
            ins_8bit_load.ld_r_ptrXXplusd(r1, 0, i16.HL, 7);
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
                case 0: // ADD A, (HL)
                    ins_8bit_arithm.add_A_ptrXXplusd(i16.HL, 0, 7);
                    break;

                case 1: // ADC A, (HL)
                    ins_8bit_arithm.adc_A_ptrXXplusd(i16.HL, 0, 7);
                    break;

                case 2: // SUB A, (HL)
                    ins_8bit_arithm.sub_A_ptrXXplusd(i16.HL, 0, 7);
                    break;

                case 3: // SBC A, (HL)
                    ins_8bit_arithm.sbc_A_ptrXXplusd(i16.HL, 0, 7);
                    break;

                case 4: // AND (HL)
                    ins_8bit_arithm.and_ptrXXplusd(i16.HL, 0, 7);
                    break;

                case 5: // XOR (HL)
                    ins_8bit_arithm.xor_ptrXXplusd(i16.HL, 0, 7);
                    break;

                case 6: // OR (HL)
                    ins_8bit_arithm.or_ptrXXplusd(i16.HL, 0, 7);
                    break;

                case 7: // CP (HL)
                    ins_8bit_arithm.cp_ptrXXplusd(i16.HL, 0, 7);
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
            if (!bit3) { // POP qq
                ins_16bit_load.pop_XX(regs16Table[bits54], 10);
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

                case 0xf9: // LD SP, HL
                    ins_16bit_load.ld_SP_XX(i16.HL, 6);
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

                case 0xe3: // EX (SP), HL
                    ins_exch_tran.ex_ptrSP_XX(i16.HL, 19);
                    break;

                case 0xf3:
                    ins_general_arithm_cpu.di();
                    break;

                case 0xcb: // prefix BITS
                    decodeCBXX(CPU.getByte());
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
            if (!bit3) { // PUSH qq
                ins_16bit_load.push_XX(regs16Table[bits54], 11);
                return;
            }
            switch (byte) {
                case 0xcd:
                    ins_call_return.call_nn(get_nn());
                    break;

                case 0xdd: // IX prefix
                    decodeIndex(CPU.getByte(), r8TableDD, r16TableDD, i16.IX);
                    break;

                case 0xed: // EXTD prefix
                    decodeEDXX(CPU.getByte());
                    break;

                case 0xfd: // IY prefix
                    decodeIndex(CPU.getByte(), r8TableFD, r16TableFD, i16.IY);
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
} // end function decode

module.exports = {
    decode,
    setCPU
};