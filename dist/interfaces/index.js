export const Colors = {
    ascii: {
        RED: (text) => `\x1b[31m${text}\x1b[0m`,
        GREEN: (text) => `\x1b[32m${text}\x1b[0m`,
        BLUE: (text) => `\x1b[34m${text}\x1b[0m`,
        YELLOW: (text) => `\x1b[33m${text}\x1b[0m`,
        RESET: (text) => `\x1b[0m${text}\x1b[0m`,
        ORANGE: (text) => `\x1b[33m${text}\x1b[0m`,
    },
    hexa: {
        RED: '#FF0000',
        GREEN: '#00FF00',
        BLUE: '#0000FF',
    }
};
//# sourceMappingURL=index.js.map