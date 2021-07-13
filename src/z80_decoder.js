/**
 * This file contains functions to decode the opCodes.
 * The switches of 16 cases are based on this [table](https://clrhome.org/table/).
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const ins_16b_load = require('./z80_instructions/ins_16bit_load');
const ins_8b_load = require('./z80_instructions/ins_8bit_load');
const ins_exch_trans = require('./z80_instructions/ins_exch_trans_search');
const ins_16bit_arithmetic = require('./z80_instructions/ins_16bit_arithmetic');
const ins_8bit_arithmetic = require('./z80_instructions/ins_8bit_arithmetic');
const ins_rot_shift = require('./z80_instructions/ins_rotate_shift');
const ins_jump = require('./z80_instructions/ins_jump');
const ins_arithmetic_cpu = require('./z80_instructions/ins_general_arithm_cpu');
const ins_call_return = require('./z80_instructions/ins_call_return');

let CPU, r8, i8, r16, i16, flags, fi, mem;
function setCPU(data) {
    ({ CPU, r8, i8, r16, i16, flags, fi, mem } = data);
}

let n = 0, nn = 0, rIndex = 0, r2Index = 0, ddIndex = 0, lsb = 0, hsb = 0, ptrnn = 0, arg = 0;

function decode0x0X(byte) {
    switch (byte) {
        case 0x00: //NOOP
            break;

        case 0x01: // LD dd, nn
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            nn = (hsb << 8) | lsb;
            ddIndex = i16.BC;
            ins_16b_load.ld_dd_nn(ddIndex, nn);
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

        case 0x06: // LD r, n
            n_ = CPU.getByte();
            rIndex = i8.B;
            ins_8b_load.ld_r_n(rIndex, n_);
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

        case 0x0e: // LD r, n
            n = CPU.getByte();
            rIndex = i8.C;
            ins_8b_load.ld_r_n(rIndex, n);
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
            arg = CPU.getByte();
            ins_jump.djnz_e(arg);
            break;

        case 0x11: // LD dd, nn
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            nn = (hsb << 8) | lsb;
            ddIndex = i16.DE;
            ins_16b_load.ld_dd_nn(ddIndex, nn);
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

        case 0x16: // LD r, n
            n = CPU.getByte();
            rIndex = i8.D;
            ins_8b_load.ld_r_n(rIndex, n);
            break;

        case 0x17: // RLA
            ins_rot_shift.rla();
            break;

        case 0x18: // JR e
            arg = CPU.getByte();
            ins_jump.jr_e(arg);
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
            n = CPU.getByte();
            rIndex = i8.E;
            ins_8b_load.ld_r_n(rIndex, n);
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
            arg = CPU.getByte();
            ins_jump.jr_nc_e(arg);
            break;

        case 0x21: // LD dd, nn
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            nn = (hsb << 8) | lsb;
            ddIndex = i16.HL;
            ins_16b_load.ld_dd_nn(ddIndex, nn);
            break;

        case 0x22: // LD (nn), HL
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            ptrnn = (hsb << 8) | lsb;
            ins_16b_load.ld_ptrnn_HL(ptrnn);
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
            n = CPU.getByte();
            rIndex = i8.H;
            ins_8b_load.ld_r_n(rIndex, n);
            break;

        case 0x27: // DAA
            ins_arithmetic_cpu.daa();
            break;

        case 0x28: // JR Z, e
            arg = CPU.getByte();
            ins_jump.jr_z_e(arg);
            break;

        case 0x29: // ADD HL, HL
            ins_16bit_arithmetic.add_HL_ss(i16.HL);
            break;

        case 0x2a: // LD HL, (nn)
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            ptrnn = (hsb << 8) | lsb;
            ins_16b_load.ld_HL_ptrnn(ptrnn);
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

        case 0x2e: // LD r, n
            n = CPU.getByte();
            rIndex = i8.L;
            ins_8b_load.ld_r_n(rIndex, n);
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
            arg = CPU.getByte();
            ins_jump.jr_nc_e(arg);
            break;

        case 0x31: // LD SP, nn
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            nn = (hsb << 8) | lsb;
            ins_16b_load.ld_dd_nn(i16.SP, nn);
            break;

        case 0x32:// LD (nn), A
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            ptrnn = (hsb << 8) | lsb;
            ins_8b_load.ld_ptrnn_A(ptrnn);
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
            n = CPU.getByte();
            ins_8b_load.ld_ptrHL_n(n);
            break;

        case 0x37: // SCF
            ins_arithmetic_cpu.scf();
            break;

        case 0x38: // JR C, e
            arg = CPU.getByte();
            ins_jump.jr_c_e(arg);
            break;

        case 0x39: // ADD HL, SP
            ins_16bit_arithmetic.add_HL_ss(i16.SP);
            break;

        case 0x3a: // LD A, (nn)
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            ptrnn = (hsb << 8) | lsb;
            ins_8b_load.ld_A_ptrnn(ptrnn);
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

        case 0x3e: //LD r, n
            n = CPU.getByte();
            rIndex = i8.A;
            ins_8b_load.ld_r_n(rIndex, n);
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
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            nn = (hsb << 8) | lsb;
            ins_jump.jp_nz_nn(nn);
            break;

        case 0xc3: // JP nn
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            nn = (hsb << 8) | lsb;
            ins_jump.jp_nn(nn);
            break;

        case 0xc4: // CALL NZ, nn
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            nn = (hsb << 8) | lsb;
            ins_call_return.call_nz_nn(nn);
            break;

        case 0xc5: // PUSH BC
            ins_16b_load.push_qq(i16.BC);
            break;

        case 0xc6: // ADD A, n
            n = CPU.getByte();
            ins_8bit_arithmetic.add_A_n(n);
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
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            nn = (hsb << 8) | lsb;
            ins_jump.jp_z_nn(nn);
            break;

        case 0xcb: // BITS prefix <---------- TODO
            break;

        case 0xcc: // CALL Z, nn
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            nn = (hsb << 8) | lsb;
            ins_call_return.call_z_nn(nn);
            break;

        case 0xcd: // CALL nn
            lsb = CPU.getByte();
            hsb = CPU.getByte();
            nn = (hsb << 8) | lsb;
            ins_call_return.call_nn(nn);
            break;

        case 0xce: // ADC A, n
            n = CPU.getByte();
            ins_8bit_arithmetic.adc_A_n(n);
            break;

        case 0xcf:
            break;

        default:
            break;
    }

}

function decode(byte) {
    const hn = byte >> 4;
    const ln = byte & 0xf;

    switch (hn) {
        case 0x0:
            decode0x0X(byte);
            break;

        case 0x1:
            decode0x1X(byte);
            break;

        case 0x2:
            decode0x2X(byte);
            break;

        case 0x3:
            decode0x3X(byte);
            break;

        case 0x4:
            decode0x4X(byte);
            break;

        case 0x5:
            decode0x5X(byte);
            break;

        case 0x6:
            decode0x6X(byte);
            break;

        case 0x7:
            decode0x7X(byte);
            break;

        case 0x8:
            decode0x8X(byte);
            break;

        case 0x9:
            decode0x9X(byte);
            break;

        case 0xa:
            decode0xaX(byte);
            break;

        case 0xb:
            decode0xbX(byte);
            break;

        case 0xc:
            break;

        case 0xd:
            break;

        case 0xe:
            break;

        case 0xf:
            break;

        default:
            break;
    }
}

module.exports = {
    decode,
    setCPU
};

/*
function d(byte) {
    switch(byte) {
        case 0x0:
            break;

        case 0x1:
            break;

        case 0x2:
            break;

        case 0x3:
            break;

        case 0x4:
            break;

        case 0x5:
            break;

        case 0x6:
            break;

        case 0x7:
            break;

        case 0x8:
            break;

        case 0x9:
            break;

        case 0xa:
            break;

        case 0xb:
            break;

        case 0xc:
            break;

        case 0xd:
            break;

        case 0xe:
            break;

        case 0xf:
            break;

        default:
            break;
    }

}
*/