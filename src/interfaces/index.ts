export interface Change {
    kind: string;
    path?: string[];
    lhs?: any;
    rhs?: any;
    index?: number;
    item?: Change;
}

export interface Color {
    RED: string;
    GREEN: string;
    BLUE: string;
    RESET: string;
} 


export interface DiffLog { added: string[]; removed: string[]; modified: string[] }
export interface Output { output: string; addedCount: number; removedCount: number; modifiedCount: number; }
export interface HeaderOptions {type: string, title: string; description: string }

export const Colors = {
    ascii: {
        RED: (text: any) => `\x1b[31m${text}\x1b[0m`,
        GREEN: (text: any) => `\x1b[32m${text}\x1b[0m`,
        BLUE: (text: any) => `\x1b[34m${text}\x1b[0m`,
        YELLOW: (text: any) => `\x1b[33m${text}\x1b[0m`,
        RESET: (text: any) => `\x1b[0m${text}\x1b[0m`,
        ORANGE: (text: any) => `\x1b[33m${text}\x1b[0m`,
    },
    hexa: {
        RED: '#FF0000',
        GREEN: '#00FF00',
        BLUE: '#0000FF',
    }
}    
