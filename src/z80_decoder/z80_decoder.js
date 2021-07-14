/**
 * This file contains functions to decode opCodes.
 * The switches of 16 cases are based on this [table](https://clrhome.org/table/).
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const {
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
} = require('./z80_decoder_l2');


function setCPU(data) {
    setDecoderL2CPU(data);
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
            decode0xcX(byte);
            break;

        case 0xd:
            decode0xdX(byte);
            break;

        case 0xe:
            decode0xeX(byte);
            break;

        case 0xf:
            decode0xfX(byte);
            break;

        default:
            break;
    }
}

module.exports = {
    decode,
    setCPU
};