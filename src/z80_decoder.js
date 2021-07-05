/**
 * This file contains functions to decode the opCodes.
 * The switches of 16 cases are based on this [table](https://clrhome.org/table/).
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const instr_16b_load = require('./z80_instructions/ins_16bit_load');
const instr_8b_load = require('./z80_instructions/ins_8bit_load');
const instr_exch_trans = require('./z80_instructions/ins_exch_trans_search');

let n = 0, nn = 0, rIndex = 0, r2Index = 0, ddIndex = 0, lsb = 0, hsb = 0, ptrnn = 0;

function decode0x0X(cpu, byte) {
    switch (byte) {
        case 0x00: //NOOP
            break;

        case 0x01: // LD dd, nn
            lsb = cpu.getByte();
            hsb = cpu.getByte();
            nn = (hsb << 8) | lsb;
            ddIndex = cpu.registers.regs16.idx.BC;
            instr_16b_load.ld_dd_nn(ddIndex, nn);
            break;

        case 0x02: //LD (BC), A
            instr_8b_load.ld_ptrBC_A();
            break;

        case 0x03:
            break;

        case 0x04:
            break;

        case 0x05:
            break;

        case 0x06: // LD r, n
            n_ = cpu.getByte();
            rIndex = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_r_n(rIndex, n_);
            break;

        case 0x07:
            break;

        case 0x08: // EX AF, AF'
            instr_exch_trans.ex_AF_AF2(cpu);
            break;

        case 0x09:
            break;

        case 0x0a: // LD A, (BC)
            instr_8b_load.ld_A_ptrBC();
            break;

        case 0x0b:
            break;

        case 0x0c:
            break;

        case 0x0d:
            break;

        case 0x0e: // LD r, n
            n = cpu.getByte();
            rIndex = cpu.registers.regs8.idx.C;
            instr_8b_load.ld_r_n(rIndex, n);
            break;

        case 0x0f:
            break;

        default:
            break;
    }

}

function decode0x1X(cpu, byte) {
    switch (byte) {
        case 0x10:
            break;

        case 0x11: // LD dd, nn
            lsb = cpu.getByte();
            hsb = cpu.getByte();
            nn = (hsb << 8) | lsb;
            ddIndex = cpu.registers.regs16.idx.DE;
            instr_16b_load.ld_dd_nn(ddIndex, nn);
            break;

        case 0x12: // LD (DE), A
            instr_8b_load.ld_ptrDE_A();
            break;

        case 0x13:
            break;

        case 0x14:
            break;

        case 0x15:
            break;

        case 0x16: // LD r, n
            n = cpu.getByte();
            rIndex = cpu.registers.regs8.idx.D;
            instr_8b_load.ld_r_n(rIndex, n);
            break;

        case 0x17:
            break;

        case 0x18:
            break;

        case 0x19:
            break;

        case 0x1a: // LD A, (DE)
            instr_8b_load.ld_A_ptrDE();
            break;

        case 0x1b:
            break;

        case 0x1c:
            break;

        case 0x1d:
            break;

        case 0x1e: // LD r, n
            n = cpu.getByte();
            rIndex = cpu.registers.regs8.idx.E;
            instr_8b_load.ld_r_n(rIndex, n);
            break;

        case 0x1f:
            break;

        default:
            break;
    }
}

function decode0x2X(cpu, byte) {
    switch (byte) {
        case 0x20:
            break;

        case 0x21: // LD dd, nn
            lsb = cpu.getByte();
            hsb = cpu.getByte();
            nn = (hsb << 8) | lsb;
            ddIndex = cpu.registers.regs16.idx.HL;
            instr_16b_load.ld_dd_nn(ddIndex, nn);
            break;

        case 0x22: // LD (nn), HL
            lsb = cpu.getByte();
            hsb = cpu.getByte();
            ptrnn = (hsb << 8) | lsb;
            instr_16b_load.ld_ptrnn_HL(ptrnn);
            break;

        case 0x23:
            break;

        case 0x24:
            break;

        case 0x25:
            break;

        case 0x26:// LD H, n
            n = cpu.getByte();
            rIndex = cpu.registers.regs8.idx.H;
            instr_8b_load.ld_r_n(rIndex, n);
            break;

        case 0x27:
            break;

        case 0x28:
            break;

        case 0x29:
            break;

        case 0x2a: // LD HL, (nn)
            lsb = cpu.getByte();
            hsb = cpu.getByte();
            ptrnn = (hsb << 8) | lsb;
            instr_16b_load.ld_HL_ptrnn(ptrnn);
            break;

        case 0x2b:
            break;

        case 0x2c:
            break;

        case 0x2d:
            break;

        case 0x2e: // LD r, n
            n = cpu.getByte();
            rIndex = cpu.registers.regs8.idx.L;
            instr_8b_load.ld_r_n(rIndex, n);
            break;

        case 0x2f:
            break;

        default:
            break;
    }
}

function decode0x3X(cpu, byte) {
    switch (byte) {
        case 0x30:
            break;

        case 0x31:
            break;

        case 0x32:// LD (nn), A
            lsb = cpu.getByte();
            hsb = cpu.getByte();
            ptrnn = (hsb << 8) | lsb;
            instr_8b_load.ld_ptrnn_A(ptrnn);
            break;

        case 0x33:
            break;

        case 0x34:
            break;

        case 0x35:
            break;

        case 0x36: // LD (HL), n
            n = cpu.getByte();
            instr_8b_load.ld_ptrHL_n(n);
            break;

        case 0x37:
            break;

        case 0x38:
            break;

        case 0x39:
            break;

        case 0x3a: // LD A, (nn)
            lsb = cpu.getByte();
            hsb = cpu.getByte();
            ptrnn = (hsb << 8) | lsb;
            instr_8b_load.ld_A_ptrnn(ptrnn);
            break;

        case 0x3b:
            break;

        case 0x3c:
            break;

        case 0x3d:
            break;

        case 0x3e: //LD r, n
            n = cpu.getByte();
            rIndex = cpu.registers.regs8.idx.A;
            instr_8b_load.ld_r_n(rIndex, n);
            break;

        case 0x3f:
            break;

        default:
            break;
    }
}

function decode0x4X(cpu, byte) {
    switch(byte) {
        case 0x40: // LD B, B ?
            break;

        case 0x41: // ld r,r2
            rIndex = cpu.registers.regs8.idx.B;
            r2Index = cpu.registers.regs8.idx.C;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x42: // ld r,r2
            rIndex = cpu.registers.regs8.idx.B;
            r2Index = cpu.registers.regs8.idx.D;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x43: // ld r,r2
            rIndex = cpu.registers.regs8.idx.B;
            r2Index = cpu.registers.regs8.idx.E;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x44: // ld r,r2
            rIndex = cpu.registers.regs8.idx.B;
            r2Index = cpu.registers.regs8.idx.H;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x45: // ld r,r2
            rIndex = cpu.registers.regs8.idx.B;
            r2Index = cpu.registers.regs8.idx.L;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x46: // LD r, (HL)
            rIndex = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_r_ptrHL(rIndex);
            break;

        case 0x47: // LD r, r'
            rIndex = cpu.registers.regs8.idx.B;
            r2Index = cpu.registers.regs8.idx.A;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x48: // LD C, B
            rIndex = cpu.registers.regs8.idx.C;
            r2Index = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x49: // LD C, C ?
            break;

        case 0x4a: // LD C, D
            rIndex = cpu.registers.regs8.idx.C;
            r2Index = cpu.registers.regs8.idx.D;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x4b: // LD C, E
            rIndex = cpu.registers.regs8.idx.C;
            r2Index = cpu.registers.regs8.idx.E;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x4c: // LD C, H
            rIndex = cpu.registers.regs8.idx.C;
            r2Index = cpu.registers.regs8.idx.H;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x4d: // LD C, L
            rIndex = cpu.registers.regs8.idx.C;
            r2Index = cpu.registers.regs8.idx.L;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x4e: // LD C, (HL)
            rIndex = cpu.registers.regs8.idx.C;   
            instr_8b_load.ld_r_ptrHL(rIndex);
            break;

        case 0x4f: // LD C, A
            rIndex = cpu.registers.regs8.idx.C;
            r2Index = cpu.registers.regs8.idx.A;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        default:
            break;
    }

}

function decode0x5X(cpu, byte) {
    switch(byte) {
        case 0x50: // LD D, B
            rIndex = cpu.registers.regs8.idx.D;
            r2Index = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x51: // LD D, C
            rIndex = cpu.registers.regs8.idx.D;
            r2Index = cpu.registers.regs8.idx.C;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x52: // LD D, D ?            
            break;

        case 0x53: // LD D, E
            rIndex = cpu.registers.regs8.idx.D;
            r2Index = cpu.registers.regs8.idx.E;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x54: // LD D, H
            rIndex = cpu.registers.regs8.idx.D;
            r2Index = cpu.registers.regs8.idx.H;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x55: // LD D, B
            rIndex = cpu.registers.regs8.idx.D;
            r2Index = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x56: // LD D, (HL)
            rIndex = cpu.registers.regs8.idx.D;
            instr_8b_load.ld_r_ptrHL(rIndex);
            break;

        case 0x57: // LD D, A
            rIndex = cpu.registers.regs8.idx.D;
            r2Index = cpu.registers.regs8.idx.A;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x58: // LD E, B
            rIndex = cpu.registers.regs8.idx.E;
            r2Index = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x59: // LD E, C
            rIndex = cpu.registers.regs8.idx.E;
            r2Index = cpu.registers.regs8.idx.C;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x5a: // LD E, D
            rIndex = cpu.registers.regs8.idx.E;
            r2Index = cpu.registers.regs8.idx.D;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x5b: // LD E,E
            break;

        case 0x5c: // LD E, H
            rIndex = cpu.registers.regs8.idx.E;
            r2Index = cpu.registers.regs8.idx.H;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x5d: // LD E, L
            rIndex = cpu.registers.regs8.idx.E;
            r2Index = cpu.registers.regs8.idx.L;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x5e: // LD E, (HL)
            rIndex = cpu.registers.regs8.idx.E;
            instr_8b_load.ld_r_ptrHL(rIndex);
            break;

        case 0x5f: // LD E, A
            rIndex = cpu.registers.regs8.idx.E;
            r2Index = cpu.registers.regs8.idx.A;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        default:
            break;
    }

}

function decode0x6X(cpu, byte) {
    switch(byte) {
        case 0x60: // LD H, B
            rIndex = cpu.registers.regs8.idx.H;
            r2Index = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x61: // LD H, C
            rIndex = cpu.registers.regs8.idx.H;
            r2Index = cpu.registers.regs8.idx.C;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x62: // LD H, D
            rIndex = cpu.registers.regs8.idx.H;
            r2Index = cpu.registers.regs8.idx.D;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x63: // LD H, E
            rIndex = cpu.registers.regs8.idx.H;
            r2Index = cpu.registers.regs8.idx.E;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x64: // LD H, H ?
            break;

        case 0x65: // LD H, B
            rIndex = cpu.registers.regs8.idx.H;
            r2Index = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x66: // LD H, (HL)
            rIndex = cpu.registers.regs8.idx.H;
            instr_8b_load.ld_r_ptrHL(rIndex);
            break;

        case 0x67: // LD H, A
            rIndex = cpu.registers.regs8.idx.H;
            r2Index = cpu.registers.regs8.idx.A;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x68: // LD L, B
            rIndex = cpu.registers.regs8.idx.L;
            r2Index = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x69: // LD L, C
            rIndex = cpu.registers.regs8.idx.L;
            r2Index = cpu.registers.regs8.idx.C;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x6a: // LD L, D
            rIndex = cpu.registers.regs8.idx.L;
            r2Index = cpu.registers.regs8.idx.D;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x6b: // LD L,E
            rIndex = cpu.registers.regs8.idx.L;
            r2Index = cpu.registers.regs8.idx.E;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x6c: // LD L, H
            rIndex = cpu.registers.regs8.idx.L;
            r2Index = cpu.registers.regs8.idx.H;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x6d: // LD L, L ?
            break;

        case 0x6e: // LD L, (HL)
            rIndex = cpu.registers.regs8.idx.L;
            instr_8b_load.ld_r_ptrHL(rIndex);
            break;

        case 0x6f: // LD L, A
            rIndex = cpu.registers.regs8.idx.L;
            r2Index = cpu.registers.regs8.idx.A;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        default:
            break;
    }

}

function decode0x7X(cpu, byte) {
    switch(byte) {
        case 0x70: // LD (HL), B
            rIndex = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_ptrHL_r(rIndex);
            break;

        case 0x71: // LD (HL), C
            rIndex = cpu.registers.regs8.idx.C;
            instr_8b_load.ld_ptrHL_r(rIndex);
            break;

        case 0x72: // LD (HL), D
            rIndex = cpu.registers.regs8.idx.D;
            instr_8b_load.ld_ptrHL_r(rIndex);
            break;

        case 0x73: // LD (HL), E
            rIndex = cpu.registers.regs8.idx.E;
            instr_8b_load.ld_ptrHL_r(rIndex);
            break;

        case 0x74: // LD (HL), H
            rIndex = cpu.registers.regs8.idx.H;
            instr_8b_load.ld_ptrHL_r(rIndex);
            break;

        case 0x75: // LD (HL), L
            rIndex = cpu.registers.regs8.idx.L;
            instr_8b_load.ld_ptrHL_r(rIndex);
            break;

        case 0x76: // HALT <<<<<<<<<<< TODO
            break;

        case 0x77: // LD (HL), A
            rIndex = cpu.registers.regs8.idx.A;
            instr_8b_load.ld_ptrHL_r(rIndex);
            break;

        case 0x78: // LD A, B
            rIndex = cpu.registers.regs8.idx.A;
            r2Index = cpu.registers.regs8.idx.B;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x79: // LD A, C
            rIndex = cpu.registers.regs8.idx.A;
            r2Index = cpu.registers.regs8.idx.C;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x7a: // LD A, D
            rIndex = cpu.registers.regs8.idx.A;
            r2Index = cpu.registers.regs8.idx.D;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x7b: // LD A, E
            rIndex = cpu.registers.regs8.idx.A;
            r2Index = cpu.registers.regs8.idx.E;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x7c: // LD A, H
            rIndex = cpu.registers.regs8.idx.A;
            r2Index = cpu.registers.regs8.idx.H;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x7d: // LD A, L
            rIndex = cpu.registers.regs8.idx.A;
            r2Index = cpu.registers.regs8.idx.L;
            instr_8b_load.ld_r_r2(rIndex, r2Index);
            break;

        case 0x7e: // LD A, (HL)
            rIndex =  cpu.registers.regs8.idx.A;  
            instr_8b_load.ld_r_ptrHL(rIndex);
            break;

        case 0x7f: // LD A, A ?
            break;

        default:
            break;
    }

}

function decode(cpu, byte) {
    const hn = byte >> 4;
    const ln = byte & 0xf;

    switch (hn) {
        case 0x0:
            decode0x0X(cpu, byte);
            break;

        case 0x1:
            decode0x1X(cpu, byte);
            break;

        case 0x2:
            decode0x2X(cpu, byte);
            break;

        case 0x3:
            decode0x3X(cpu, byte);
            break;

        case 0x4:
            decode0x4X(cpu, byte);
            break;

        case 0x5:
            decode0x5X(cpu, byte);
            break;

        case 0x6:
            decode0x6X(cpu, byte);
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

module.exports = decode;

/*
function d(cpu, byte) {
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