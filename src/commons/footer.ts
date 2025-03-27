import { Output, Colors } from "src/interfaces/index.js";


export class Footer {
    public static printFooter(obj: Output ): string {
        obj.output += `${"┬".repeat(74)}\n\n`;
        obj.output += `▹▹ ${" ".repeat(10)} Summary: (${Colors.ascii.GREEN('Added')}: ${obj.addedCount},  ${Colors.ascii.RED('Removed')}: ${obj.removedCount},  ${Colors.ascii.YELLOW('Modified')}: ${obj.modifiedCount} )${" ".repeat(10)} ◃◃\n\n`;
        obj.output += `${"┴".repeat(74)}\n`;
        
        return obj.output
    }
}