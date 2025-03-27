export class Header {
    static printHeader(output, header) {
        output += `\n${"══".repeat(37)}\n`;
        if (header.type === "OpenApi") {
            output += `╟${" ".repeat(24)}${header.title}${" ".repeat(30)}╢\n`;
            output += `${"══".repeat(37)}\n`;
            output += `╟ ${" ".repeat(9)}${header.description}${" ".repeat(9)} ╢\n`;
        }
        else {
            output += `╟${" ".repeat(30)}${header.title}${" ".repeat(32)}╢\n`;
            output += `${"══".repeat(37)}\n`;
            output += `╟ ${" ".repeat(13)}${header.description}${" ".repeat(13)} ╢\n`;
        }
        output += `${"══".repeat(37)}\n`;
        return output;
    }
}
//# sourceMappingURL=header.js.map