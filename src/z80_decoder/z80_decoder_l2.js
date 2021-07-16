/**
 * This file contains functions to decode the opCodes.
 * This functions are called by z80_decoder.js
 * The switches of 16 cases are based on this [table](https://clrhome.org/table/).
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const ins_16b_load = require('../z80_instructions/ins_16bit_load');
const ins_8b_load = require('../z80_instructions/ins_8bit_load');
const ins_exch_trans = require('../z80_instructions/ins_exch_trans_search');
const ins_16bit_arithmetic = require('../z80_instructions/ins_16bit_arithmetic');
const ins_8bit_arithmetic = require('../z80_instructions/ins_8bit_arithmetic');
const ins_rot_shift = require('../z80_instructions/ins_rotate_shift');
const ins_jump = require('../z80_instructions/ins_jump');
const ins_arithmetic_cpu = require('../z80_instructions/ins_general_arithm_cpu');
const ins_call_return = require('../z80_instructions/ins_call_return');
const ins_in_out = require('../z80_instructions/ins_input_output');

const {
    decodeCBXX,
    setDecoderL3CPU
} = require('./z80_decoder_l3');



let CPU, i8, i16;
function setDecoderL2CPU(data) {
    setDecoderL3CPU(data);
    ({ CPU, i8, i16 } = data);
}

function get_nn() {
    let lsb = CPU.getByte();
    let hsb = CPU.getByte();
    return (hsb << 8) | lsb;
}

function decode0x0X(byte) {
    switch (byte) {
        case 0x00: //NOOP
            break;

        case 0x01: // LD BC, nn
            ins_16b_load.ld_dd_nn(i16.BC, get_nn());
            break;

        case 0x02: //LD (BC), A
            ins_8b_load.ld_ptrBC_A();
            break;

        case 0x03: //INC BC
            ins_16bit_arithmetic.inc_ss(i16.BC);
            break;

        case 0x04: // INC B
            ins_8bit_arithmetic.inc_r(i8.B);
            break;

        case 0x05: // DEC B
            ins_8bit_arithmetic.dec_r(i8.B);
            break;

        case 0x06: // LD B, n
            ins_8b_load.ld_r_n(i8.B, CPU.getByte());
            break;

        case 0x07: // RLCA
            ins_rot_shift.rlca();
            break;

        case 0x08: // EX AF, AF'
            ins_exch_trans.ex_AF_AF2();
            break;

        case 0x09: // ADD HL, BC
            ins_16bit_arithmetic.add_HL_ss(i16.BC);
            break;

        case 0x0a: // LD A, (BC)
            ins_8b_load.ld_A_ptrBC();
            break;

        case 0x0b: // DEC BC
            ins_16bit_arithmetic.dec_ss(i16.BC);
            break;

        case 0x0c: // INC C
            ins_8bit_arithmetic.inc_r(i8.C);
            break;

        case 0x0d: // DEC C
            ins_8bit_arithmetic.dec_r(i8.C);
            break;

        case 0x0e: // LD C, n
            ins_8b_load.ld_r_n(i8.C, CPU.getByte());
            break;

        case 0x0f: // RRCA
            ins_rot_shift.rrca();
            break;

        default:
            break;
    }

}

function decode0x1X(byte) {
    switch (byte) {
        case 0x10: // DJNZ e
            ins_jump.djnz_e(CPU.getByte());
            break;

        case 0x11: // LD DE, nn
            ins_16b_load.ld_dd_nn(i16.DE, get_nn());
            break;

        case 0x12: // LD (DE), A
            ins_8b_load.ld_ptrDE_A();
            break;

        case 0x13: // INC DE
            ins_16bit_arithmetic.inc_ss(i16.DE);
            break;

        case 0x14: // INC D
            ins_8bit_arithmetic.inc_r(i8.D);
            break;

        case 0x15: // DEC D
            ins_8bit_arithmetic.dec_r(i8.D);
            break;

        case 0x16: // LD D, n
            ins_8b_load.ld_r_n(i8.D, CPU.getByte());
            break;

        case 0x17: // RLA
            ins_rot_shift.rla();
            break;

        case 0x18: // JR e
            ins_jump.jr_e(CPU.getByte());
            break;

        case 0x19: // ADD HL, DE
            ins_16bit_arithmetic.add_HL_ss(i16.DE);
            break;

        case 0x1a: // LD A, (DE)
            ins_8b_load.ld_A_ptrDE();
            break;

        case 0x1b: // DEC DE
            ins_16bit_arithmetic.dec_ss(i16.DE);
            break;

        case 0x1c: // INC E
            ins_8bit_arithmetic.inc_r(i8.E);
            break;

        case 0x1d: // DEC E
            ins_8bit_arithmetic.dec_r(i8.E);
            break;

        case 0x1e: // LD r, n
            ins_8b_load.ld_r_n(i8.E, CPU.getByte());
            break;

        case 0x1f: // RRA
            ins_rot_shift.rra();
            break;

        default:
            break;
    }
}

function decode0x2X(byte) {
    switch (byte) {
        case 0x20: // JR NZ, e
            ins_jump.jr_nc_e(CPU.getByte());
            break;

        case 0x21: // LD HL, nn
            ins_16b_load.ld_dd_nn(i16.HL, get_nn());
            break;

        case 0x22: // LD (nn), HL
            ins_16b_load.ld_ptrnn_HL(get_nn());
            break;

        case 0x23: // INC HL
            ins_16bit_arithmetic.inc_ss(i16.HL);
            break;

        case 0x24: // INC H
            ins_8bit_arithmetic.inc_r(i8.H);
            break;

        case 0x25: // DEC H
            ins_8bit_arithmetic.dec_r(i8.H);
            break;

        case 0x26:// LD H, n
            ins_8b_load.ld_r_n(i8.H, CPU.getByte());
            break;

        case 0x27: // DAA
            ins_arithmetic_cpu.daa();
            break;

        case 0x28: // JR Z, e
            ins_jump.jr_z_e(CPU.getByte());
            break;

        case 0x29: // ADD HL, HL
            ins_16bit_arithmetic.add_HL_ss(i16.HL);
            break;

        case 0x2a: // LD HL, (nn)
            ins_16b_load.ld_HL_ptrnn(get_nn());
            break;

        case 0x2b: // DEC HL
            ins_16bit_arithmetic.dec_ss(i16.HL);
            break;

        case 0x2c: // INC L
            ins_8bit_arithmetic.inc_r(i8.L);
            break;

        case 0x2d: // DEC L
            ins_8bit_arithmetic.dec_r(i8.L);
            break;

        case 0x2e: // LD L, n
            ins_8b_load.ld_r_n(i8.L, CPU.getByte());
            break;

        case 0x2f: // CPL
            ins_arithmetic_cpu.cpl();
            break;

        default:
            break;
    }
}

function decode0x3X(byte) {
    switch (byte) {
        case 0x30: // JR NC, e
            ins_jump.jr_nc_e(CPU.getByte());
            break;

        case 0x31: // LD SP, nn
            ins_16b_load.ld_dd_nn(i16.SP,get_nn());
            break;

        case 0x32:// LD (nn), A
            ins_8b_load.ld_ptrnn_A(get_nn());
            break;

        case 0x33: // INC SP
            ins_16bit_arithmetic.inc_ss(i16.SP);
            break;

        case 0x34: // INC (HL)
            ins_8bit_arithmetic.inc_ptrHL();
            break;

        case 0x35: // DEC (HL)
            ins_8bit_arithmetic.dec_ptrHL();
            break;

        case 0x36: // LD (HL), n
            ins_8b_load.ld_ptrHL_n(CPU.getByte());
            break;

        case 0x37: // SCF
            ins_arithmetic_cpu.scf();
            break;

        case 0x38: // JR C, e
            ins_jump.jr_c_e(CPU.getByte());
            break;

        case 0x39: // ADD HL, SP
            ins_16bit_arithmetic.add_HL_ss(i16.SP);
            break;

        case 0x3a: // LD A, (nn)
            ins_8b_load.ld_A_ptrnn(get_nn());
            break;

        case 0x3b: // DEC SP
            ins_16bit_arithmetic.dec_ss(i16.SP);
            break;

        case 0x3c: // INC A
            ins_8bit_arithmetic.inc_r(i8.A);
            break;

        case 0x3d: // DEC A
            ins_8bit_arithmetic.dec_r(i8.A);
            break;

        case 0x3e: //LD A, n
            ins_8b_load.ld_r_n(i8.A, CPU.getByte());
            break;

        case 0x3f: // CCF
            ins_arithmetic_cpu.ccf();
            break;

        default:
            break;
    }
}

function decode0x4X(byte) {
    switch (byte) {
        case 0x40: // LD B, B
            ins_8b_load.ld_r_r2(i8.B, i8.B);
            break;

        case 0x41: // LD B, C
            ins_8b_load.ld_r_r2(i8.B, i8.C);
            break;

        case 0x42: // LD B, D
            ins_8b_load.ld_r_r2(i8.B, i8.D);
            break;

        case 0x43: // LD B, E
            ins_8b_load.ld_r_r2(i8.B, i8.E);
            break;

        case 0x44: // LD B, H
            ins_8b_load.ld_r_r2(i8.B, i8.H);
            break;

        case 0x45: // LD B, L
            ins_8b_load.ld_r_r2(i8.B, i8.L);
            break;

        case 0x46: // LD B, (HL)
            ins_8b_load.ld_r_ptrHL(i8.B);
            break;

        case 0x47: // LD B, A
            ins_8b_load.ld_r_r2(i8.B, i8.A);
            break;

        case 0x48: // LD C, B
            ins_8b_load.ld_r_r2(i8.C, i8.A);
            break;

        case 0x49: // LD C, C
            ins_8b_load.ld_r_r2(i8.C, i8.C);
            break;

        case 0x4a: // LD C, D
            ins_8b_load.ld_r_r2(i8.C, i8.D);
            break;

        case 0x4b: // LD C, E
            ins_8b_load.ld_r_r2(i8.C, i8.E);
            break;

        case 0x4c: // LD C, H
            ins_8b_load.ld_r_r2(i8.C, i8.H);
            break;

        case 0x4d: // LD C, L
            ins_8b_load.ld_r_r2(i8.C, i8.L);
            break;

        case 0x4e: // LD C, (HL)
            ins_8b_load.ld_r_ptrHL(i8.C);
            break;

        case 0x4f: // LD C, A
            ins_8b_load.ld_r_r2(i8.C, i8.A);
            break;

        default:
            break;
    }

}

function decode0x5X(byte) {
    switch (byte) {
        case 0x50: // LD D, B
            ins_8b_load.ld_r_r2(i8.D, i8.B);
            break;

        case 0x51: // LD D, C
            ins_8b_load.ld_r_r2(i8.D, i8.C);
            break;

        case 0x52: // LD D, D
            ins_8b_load.ld_r_r2(i8.D, i8.D);
            break;

        case 0x53: // LD D, E
            ins_8b_load.ld_r_r2(i8.D, i8.E);
            break;

        case 0x54: // LD D, H
            ins_8b_load.ld_r_r2(i8.D, i8.H);
            break;

        case 0x55: // LD D, B
            ins_8b_load.ld_r_r2(i8.D, i8.B);
            break;

        case 0x56: // LD D, (HL)
            ins_8b_load.ld_r_ptrHL(i8.D);
            break;

        case 0x57: // LD D, A
            ins_8b_load.ld_r_r2(i8.D, i8.A);
            break;

        case 0x58: // LD E, B
            ins_8b_load.ld_r_r2(i8.E, i8.B);
            break;

        case 0x59: // LD E, C
            ins_8b_load.ld_r_r2(i8.E, i8.C);
            break;

        case 0x5a: // LD E, D
            ins_8b_load.ld_r_r2(i8.E, i8.D);
            break;

        case 0x5b: // LD E,E
            ins_8b_load.ld_r_r2(i8.E, i8.E);
            break;

        case 0x5c: // LD E, H
            ins_8b_load.ld_r_r2(i8.E, i8.H);
            break;

        case 0x5d: // LD E, L
            ins_8b_load.ld_r_r2(i8.E, i8.L);
            break;

        case 0x5e: // LD E, (HL)
            ins_8b_load.ld_r_ptrHL(i8.E);
            break;

        case 0x5f: // LD E, A
            ins_8b_load.ld_r_r2(i8.E, i8.A);
            break;

        default:
            break;
    }

}

function decode0x6X(byte) {
    switch (byte) {
        case 0x60: // LD H, B
            ins_8b_load.ld_r_r2(i8.H, i8.B);
            break;

        case 0x61: // LD H, C
            ins_8b_load.ld_r_r2(i8.H, i8.C);
            break;

        case 0x62: // LD H, D
            ins_8b_load.ld_r_r2(i8.H, i8.D);
            break;

        case 0x63: // LD H, E
            ins_8b_load.ld_r_r2(i8.H, i8.E);
            break;

        case 0x64: // LD H, H
            ins_8b_load.ld_r_r2(i8.H, i8.H);
            break;

        case 0x65: // LD H, B
            ins_8b_load.ld_r_r2(i8.H, i8.B);
            break;

        case 0x66: // LD H, (HL)
            ins_8b_load.ld_r_ptrHL(i8.H);
            break;

        case 0x67: // LD H, A
            ins_8b_load.ld_r_r2(i8.H, i8.A);
            break;

        case 0x68: // LD L, B
            ins_8b_load.ld_r_r2(i8.L, i8.B);
            break;

        case 0x69: // LD L, C
            ins_8b_load.ld_r_r2(i8.L, i8.C);
            break;

        case 0x6a: // LD L, D
            ins_8b_load.ld_r_r2(i8.L, i8.B);
            break;

        case 0x6b: // LD L, E
            ins_8b_load.ld_r_r2(i8.L, i8.E);
            break;

        case 0x6c: // LD L, H
            ins_8b_load.ld_r_r2(i8.L, i8.H);
            break;

        case 0x6d: // LD L, L
            ins_8b_load.ld_r_r2(i8.L, i8.L);
            break;

        case 0x6e: // LD L, (HL)
            ins_8b_load.ld_r_ptrHL(i8.L);
            break;

        case 0x6f: // LD L, A
            ins_8b_load.ld_r_r2(i8.L, i8.A);
            break;

        default:
            break;
    }

}

function decode0x7X(byte) {
    switch (byte) {
        case 0x70: // LD (HL), B
            ins_8b_load.ld_ptrHL_r(i8.B);
            break;

        case 0x71: // LD (HL), C
            ins_8b_load.ld_ptrHL_r(i8.C);
            break;

        case 0x72: // LD (HL), D
            ins_8b_load.ld_ptrHL_r(i8.D);
            break;

        case 0x73: // LD (HL), E
            ins_8b_load.ld_ptrHL_r(i8.E);
            break;

        case 0x74: // LD (HL), H
            ins_8b_load.ld_ptrHL_r(i8.H);
            break;

        case 0x75: // LD (HL), L
            ins_8b_load.ld_ptrHL_r(i8.L);
            break;

        case 0x76: // HALT <<<<<<<<<<< TODO
            break;

        case 0x77: // LD (HL), A
            ins_8b_load.ld_ptrHL_r(i8.A);
            break;

        case 0x78: // LD A, B
            ins_8b_load.ld_r_r2(i8.A, i8.B);
            break;

        case 0x79: // LD A, C
            ins_8b_load.ld_r_r2(i8.A, i8.C);
            break;

        case 0x7a: // LD A, D
            ins_8b_load.ld_r_r2(i8.A, i8.D);
            break;

        case 0x7b: // LD A, E
            ins_8b_load.ld_r_r2(i8.A, i8.E);
            break;

        case 0x7c: // LD A, H
            ins_8b_load.ld_r_r2(i8.A, i8.H);
            break;

        case 0x7d: // LD A, L
            ins_8b_load.ld_r_r2(i8.A, i8.L);
            break;

        case 0x7e: // LD A, (HL)
            ins_8b_load.ld_r_ptrHL(i8.A);
            break;

        case 0x7f: // LD A, A
            ins_8b_load.ld_r_r2(i8.A, i8.A);
            break;

        default:
            break;
    }

}

function decode0x8X(byte) {
    switch (byte) {
        case 0x80: // ADD A, B
            ins_8bit_arithmetic.add_A_r(i8.B);
            break;

        case 0x81: // ADD A, C
            ins_8bit_arithmetic.add_A_r(i8.C);
            break;

        case 0x82: // ADD A, D
            ins_8bit_arithmetic.add_A_r(i8.D);
            break;

        case 0x83: // ADD A, E
            ins_8bit_arithmetic.add_A_r(i8.E);
            break;

        case 0x84: // ADD A, H
            ins_8bit_arithmetic.add_A_r(i8.H);
            break;

        case 0x85: // ADD A, L
            ins_8bit_arithmetic.add_A_r(i8.L);
            break;

        case 0x86: // ADD A, (HL)
            ins_8bit_arithmetic.add_A_ptrHL();
            break;

        case 0x87: // ADD A, A
            ins_8bit_arithmetic.add_A_r(i8.A);
            break;

        case 0x88: // ADC A, B
            ins_8bit_arithmetic.adc_A_r(i8.B);
            break;

        case 0x89: // ADC A, C
            ins_8bit_arithmetic.adc_A_r(i8.C);
            break;

        case 0x8a: // ADC A, D
            ins_8bit_arithmetic.adc_A_r(i8.D);
            break;

        case 0x8b: // ADC A, E
            ins_8bit_arithmetic.adc_A_r(i8.E);
            break;

        case 0x8c: // ADC A, H
            ins_8bit_arithmetic.adc_A_r(i8.H);
            break;

        case 0x8d: // ADC A, L
            ins_8bit_arithmetic.adc_A_r(i8.L);
            break;

        case 0x8e: // ADC A, (HL)
            ins_8bit_arithmetic.adc_A_ptrHL();
            break;

        case 0x8f: // ADC A, A
            ins_8bit_arithmetic.adc_A_r(i8.A);
            break;

        default:
            break;
    }

}

function decode0x9X(byte) {
    switch (byte) {
        case 0x90: // SUB B
            ins_8bit_arithmetic.sub_A_r(i8.B);
            break;

        case 0x91: // SUB C
            ins_8bit_arithmetic.sub_A_r(i8.C);
            break;

        case 0x92: // SUB D
            ins_8bit_arithmetic.sub_A_r(i8.D);
            break;

        case 0x93: // SUB E
            ins_8bit_arithmetic.sub_A_r(i8.E);
            break;

        case 0x94: // SUB H
            ins_8bit_arithmetic.sub_A_r(i8.H);
            break;

        case 0x95: // SUB L
            ins_8bit_arithmetic.sub_A_r(i8.L);
            break;

        case 0x96: // SUB (HL)
            ins_8bit_arithmetic.sub_A_ptrHL();
            break;

        case 0x97: // SUB A
            ins_8bit_arithmetic.sub_A_r(i8.A);
            break;

        case 0x98: // SBC A, B
            ins_8bit_arithmetic.sbc_A_r(i8.B);
            break;

        case 0x99: // SBC A, C
            ins_8bit_arithmetic.sbc_A_r(i8.C);
            break;

        case 0x9a: // SBC A, D
            ins_8bit_arithmetic.sbc_A_r(i8.D);
            break;

        case 0x9b: // SBC A, E
            ins_8bit_arithmetic.sbc_A_r(i8.E);
            break;

        case 0x9c: // SBC A, H
            ins_8bit_arithmetic.sbc_A_r(i8.H);
            break;

        case 0x9d: // SBC A, L
            ins_8bit_arithmetic.sbc_A_r(i8.L);
            break;

        case 0x9e: // SBC A, (HL)
            ins_8bit_arithmetic.sbc_A_ptrHL();
            break;

        case 0x9f: // SBC A, A
            ins_8bit_arithmetic.sbc_A_r(i8.A);
            break;

        default:
            break;
    }

}

function decode0xaX(byte) {
    switch (byte) {
        case 0xa0: // AND B
            ins_8bit_arithmetic.and_r(i8.A);
            break;

        case 0xa1: // AND C
            ins_8bit_arithmetic.and_r(i8.C);
            break;

        case 0xa2: // AND D
            ins_8bit_arithmetic.and_r(i8.D);
            break;

        case 0xa3: // AND E
            ins_8bit_arithmetic.and_r(i8.E);
            break;

        case 0xa4: // AND H
            ins_8bit_arithmetic.and_r(i8.H);
            break;

        case 0xa5: // AND L
            ins_8bit_arithmetic.and_r(i8.L);
            break;

        case 0xa6: // AND (HL)
            ins_8bit_arithmetic.and_ptrHL();
            break;

        case 0xa7: // AND A
            ins_8bit_arithmetic.and_r(i8.A);
            break;

        case 0xa8: // XOR B
            ins_8bit_arithmetic.xor_r(i8.B);
            break;

        case 0xa9: // XOR C
            ins_8bit_arithmetic.xor_r(i8.C);
            break;

        case 0xaa: // XOR D
            ins_8bit_arithmetic.xor_r(i8.D);
            break;

        case 0xab: // XOR E
            ins_8bit_arithmetic.xor_r(i8.E);
            break;

        case 0xac: // XOR H
            ins_8bit_arithmetic.xor_r(i8.H);
            break;

        case 0xad: // XOR L
            ins_8bit_arithmetic.xor_r(i8.L);
            break;

        case 0xae: // XOR (HL)
            ins_8bit_arithmetic.xor_ptrHL();
            break;

        case 0xaf: // XOR A
            ins_8bit_arithmetic.xor_r(i8.A);
            break;

        default:
            break;
    }

}

function decode0xbX(byte) {
    switch (byte) {
        case 0xb0: // OR B
            ins_8bit_arithmetic.or_r(i8.B);
            break;

        case 0xb1: // OR C
            ins_8bit_arithmetic.or_r(i8.C);
            break;

        case 0xb2: // OR D
            ins_8bit_arithmetic.or_r(i8.D);
            break;

        case 0xb3: // OR E
            ins_8bit_arithmetic.or_r(i8.E);
            break;

        case 0xb4: // OR H
            ins_8bit_arithmetic.or_r(i8.H);
            break;

        case 0xb5: // OR L
            ins_8bit_arithmetic.or_r(i8.L);
            break;

        case 0xb6: // OR (HL)
            ins_8bit_arithmetic.or_ptrHL();
            break;

        case 0xb7: // OR A
            ins_8bit_arithmetic.or_r(i8.A);
            break;

        case 0xb8: // CP B
            ins_8bit_arithmetic.cp_r(i8.B);
            break;

        case 0xb9: // CP C
            ins_8bit_arithmetic.cp_r(i8.C);
            break;

        case 0xba: // CP D
            ins_8bit_arithmetic.cp_r(i8.D);
            break;

        case 0xbb: // CP E
            ins_8bit_arithmetic.cp_r(i8.E);
            break;

        case 0xbc: // CP H
            ins_8bit_arithmetic.cp_r(i8.H);
            break;

        case 0xbd: // CP L
            ins_8bit_arithmetic.cp_r(i8.L);
            break;

        case 0xbe: // CP (HL)
            ins_8bit_arithmetic.cp_ptrHL();
            break;

        case 0xbf: // CP A
            ins_8bit_arithmetic.cp_r(i8.A);
            break;

        default:
            break;
    }

}

function decode0xcX(byte) {
    switch (byte) {
        case 0xc0: // RET NZ
            ins_call_return.ret_nz();
            break;

        case 0xc1: // POP BC
            ins_16b_load.pop_qq(i16.BC);
            break;

        case 0xc2: // JP NZ, nn
            ins_jump.jp_nz_nn(get_nn());
            break;

        case 0xc3: // JP nn
            ins_jump.jp_nn(get_nn());
            break;

        case 0xc4: // CALL NZ, nn
            ins_call_return.call_nz_nn(get_nn());
            break;

        case 0xc5: // PUSH BC
            ins_16b_load.push_qq(i16.BC);
            break;

        case 0xc6: // ADD A, n
            ins_8bit_arithmetic.add_A_n(CPU.getByte());
            break;

        case 0xc7: // RST 0x00
            ins_call_return.rst_p(0x00);
            break;

        case 0xc8: // RET Z
            ins_call_return.ret_z();
            break;

        case 0xc9: // RET
            ins_call_return.ret();
            break;

        case 0xca: // JP Z, nn
            ins_jump.jp_z_nn(get_nn());
            break;

        case 0xcb: // BITS prefix (CB)
            decodeCBXX(CPU.getByte());
            break;

        case 0xcc: // CALL Z, nn
            ins_call_return.call_z_nn(get_nn());
            break;

        case 0xcd: // CALL nn
            ins_call_return.call_nn(get_nn());
            break;

        case 0xce: // ADC A, n
            ins_8bit_arithmetic.adc_A_n(CPU.getByte());
            break;

        case 0xcf: // RST 0x08
            ins_call_return.rst_p(0x08);
            break;

        default:
            break;
    }

}

function decode0xdX(byte) {
    switch (byte) {
        case 0xd0: // RET NC
            ins_call_return.ret_nc();
            break;

        case 0xd1: // POP DE
            ins_16b_load.pop_qq(i16.DE);
            break;

        case 0xd2: // JP NC, nn
            ins_jump.jp_nc_nn(get_nn());
            break;

        case 0xd3: // OUT (n), A
            ins_in_out.out_n_A(CPU.getByte());
            break;

        case 0xd4: // CALL NC, nn
            ins_call_return.call_nc_nn(get_nn());
            break;

        case 0xd5: // PUSH DE
            ins_16b_load.push_qq(i16.DE);
            break;

        case 0xd6: // SUB n
            ins_8bit_arithmetic.sub_A_n(CPU.getByte());
            break;

        case 0xd7: // RST 0x10
            ins_call_return.rst_p(0x10);
            break;

        case 0xd8: // RET C
            ins_call_return.ret_c();
            break;

        case 0xd9: // EXX
            ins_exch_trans.exx();
            break;

        case 0xda: // JP C, nn
            ins_jump.jp_c_nn(get_nn());
            break;

        case 0xdb: // IN A, (n)
            ins_in_out.in_A_n(CPU.getByte());
            break;

        case 0xdc: // CALL C, nn
            ins_call_return.call_c_nn(get_nn());
            break;

        case 0xdd: // IX prefix <--------- TODO
            break;

        case 0xde: // SBC A, n
            ins_8bit_arithmetic.sbc_A_n(CPU.getByte());
            break;

        case 0xdf: // RST 0x18
            ins_call_return.rst_p(0x18);
            break;

        default:
            break;
    }

}

function decode0xeX(byte) {
    switch (byte) {
        case 0xe0: // RET PO
            ins_call_return.ret_po();
            break;

        case 0xe1: // POP HL
            ins_16b_load.pop_qq(i16.HL);
            break;

        case 0xe2: // JP PO, nn
            ins_jump.jp_po_nn(get_nn());
            break;

        case 0xe3: // EX (SP), HL
            ins_exch_trans.ex_ptrSP_HL();
            break;

        case 0xe4: // CALL PO, nn
            ins_call_return.call_po_nn(get_nn());
            break;

        case 0xe5: // PUSH HL
            ins_16b_load.push_qq(i16.HL);
            break;

        case 0xe6: // AND n
            ins_8bit_arithmetic.and_n(CPU.getByte());
            break;

        case 0xe7: // RST 0x20
            ins_arithmetic_cpu.rst_p(0x20);
            break;

        case 0xe8: // RET PE
            ins_call_return.ret_pe();
            break;

        case 0xe9: // JP (HL)
            ins_jump.jp_ptrHL();
            break;

        case 0xea: // JP PE, nn
            ins_jump.jp_pe_nn(get_nn());
            break;

        case 0xeb: // EX DE, HL
            ins_exch_trans.ex_DE_HL();
            break;

        case 0xec: // CALL PE, nn
            ins_call_return.call_pe_nn(get_nn());
            break;

        case 0xed: // EXTD prefix <-------------- TODO
            break;

        case 0xee: // XOR n
            ins_8bit_arithmetic.xor_n(CPU.getByte());
            break;

        case 0xef: // RST 0x28
            ins_arithmetic_cpu.rst_p(0x28);
            break;

        default:
            break;
    }

}

function decode0xfX(byte) {
    switch (byte) {
        case 0xf0: // RET P
            ins_call_return.ret_p();
            break;

        case 0xf1: // POP AF
            ins_16b_load.pop_qq(i16.AF);
            break;

        case 0xf2: // JP P, nn
            ins_jump.jp_p_nn(get_nn());
            break;

        case 0xf3: // DI
            ins_arithmetic_cpu.di();
            break;

        case 0xf4: // CALL P, nn
            ins_call_return.call_p_nn(get_nn());
            break;

        case 0xf5: // PUSH AF
            ins_16b_load.push_qq(i16.AF);
            break;

        case 0xf6: // OR n
            ins_8bit_arithmetic.or_n(CPU.getByte());
            break;

        case 0xf7: // RST 0x30
            ins_call_return.rst_p(0x30);
            break;

        case 0xf8: // RET M
            ins_call_return.ret_m();
            break;

        case 0xf9: // LD SP, HL
            ins_16b_load.ld_SP_HL();
            break;

        case 0xfa: // JP M, nn
            ins_jump.jp_m_nn(get_nn());
            break;

        case 0xfb: // EI
            ins_arithmetic_cpu.ei();
            break;

        case 0xfc: // CALL M, nn
            ins_call_return.call_m_nn(get_nn());
            break;

        case 0xfd: // IY prefix <------------------- TODO
            break;

        case 0xfe: // CP n
            ins_8bit_arithmetic.cp_n(CPU.getByte());
            break;

        case 0xff: // RST 0x38
            ins_call_return.rst_p(0x38);
            break;

        default:
            break;
    }

}

module.exports = {
    decode0x0X,
    decode0x1X,
    decode0x2X,
    decode0x3X,
    decode0x4X,
    decode0x5X,
    decode0x6X,
    decode0x7X,
    decode0x8X,
    decode0x9X,
    decode0xaX,
    decode0xbX,
    decode0xcX,
    decode0xdX,
    decode0xeX,
    setDecoderL2CPU
};