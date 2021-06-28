/**
 * This file contains functions to decode the opCodes.
 * The switches of 16 cases are based on this [table](https://clrhome.org/table/).
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const instr_16b_load = require('./z80_instrucctions/ins_16bit_load')

function decode0x0X(cpu, byte){
    switch(byte){
        case 0x00:
        break;

        case 0x01: // LD dd, nn
        const lsb = cpu.getByte();
        const hsb = cpu.getByte();
        const nn = (hsb << 8) | lsb;
        const ddIndex = cpu.registers.regs16.idx.BC;
        instr_16b_load.ld_dd_nn(cpu, ddIndex, nn);          
        break;

        case 0x02:            
        break;

        case 0x03:            
        break;

        case 0x04:            
        break;

        case 0x05:            
        break;

        case 0x06:            
        break;

        case 0x07:            
        break;

        case 0x08:            
        break;

        case 0x09:            
        break;

        case 0x0a:            
        break;

        case 0x0b:            
        break;

        case 0x0c:            
        break;

        case 0x0d:            
        break;

        case 0x0e:            
        break;

        case 0x0f:            
        break;
    
        default:
        break;
    }
    
}

function decode(cpu, byte){
    const hn = byte >> 4;
    const ln = byte & 0xf;

    switch (hn) {
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