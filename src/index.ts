//import * as core from '@actions/core';
import * as fs from 'fs';
import yaml from 'js-yaml';
import * as deepDiff from 'deep-diff';
import { Colors, Change, DiffLog } from './interfaces/index.js';
import { Footer } from './commons/footer.js';
import { Header } from './commons/header.js';
import { HeaderData, diffLog } from './helpers/Helpers.js';
import * as core from '@actions/core';


function isOpenAPI(doc: any): boolean {
    return doc && (doc.openapi || doc.swagger || doc.paths);
}


function loadFile(path: string): any {
    try {
        const content = fs.readFileSync(path, 'utf8');
        const parsed = path.endsWith('.yaml') || path.endsWith('.yml') ? yaml.load(content) : JSON.parse(content);
        return parsed;
    } catch (error: any) {
        console.log(`❌ Erro ao carregar arquivo ${path}: ${error.message}`);
        return null;
    }
}

function compareYamlFiles(file1: any, file2: any): any {
    const diff = deepDiff.diff(file1, file2) || [];
    
    if (diff.length > 0) {
        console.log("✅ Nenhuma diferença encontrada.");
    } else {
        console.log("🛑 Diferenças encontradas:");
        // console.log(JSON.stringify(diff, null, 2));
    }

    return diff;
}


async function run() {
    try {

        const file1 = core.getInput('file_path_base');
        const file2 = core.getInput('file_path_target');
        // const file1: any = process.argv[2];
        // const file2: any = process.argv[3];

        const spec1 = loadFile(file1);
        const spec2 = loadFile(file2);

        if (!spec1 || !spec2) {
            throw new Error('Não foi possível carregar os arquivos.');
        }

        const diff = compareYamlFiles(spec1, spec2);
        
        if (isOpenAPI(spec1) && isOpenAPI(spec2)) {
            console.log("🔍 Comparação OpenAPI...");
            console.log(formatDiffLog(diff));
        } else {
            console.log("🔍 Comparação YAML genérico...");
            console.log(formatYamlDiffLog(diff)); // Exibe diferença normal
        }
    } catch (error: any) {
        console.log(`❌ Erro na comparação: ${error.message}`);
    }
}

function formatDiffLog(diff: Change[]): string {
    if (diff.length === 0) return "Nenhuma diferença encontrada.";

    let output = "";
    let addedCount = 0;
    let removedCount = 0;
    let modifiedCount = 0;

    // Cabeçalho
    output = Header.printHeader(output,HeaderData["OpenApi"]);


    diff.forEach(change => {
        const path = change.path?.join(" -> ") || "(desconhecido)";

        if (change.kind === 'N') {
            diffLog.added.push(`${Colors.ascii.GREEN('+')} Adicionado: ${path}\n`);
            addedCount++;
        }

        if (change.kind === 'D') {
            diffLog.removed.push(`${Colors.ascii.RED('-')} Removido: ${path}\n`);
            removedCount++;
        }

        if (change.kind === 'E') {
            diffLog.modified.push(`${Colors.ascii.YELLOW('~')} Modificado: ${path}\n  De: ${JSON.stringify(change.lhs, null, 2)}\n  Para: ${JSON.stringify(change.rhs, null, 2)}\n`);
            modifiedCount++;
        }

        if (change.kind === 'A' && change.item) {
            const arrayPath = `${path}[${change.index}]`;
            if (change.item.kind === 'N') {
                diffLog.added.push(`${Colors.ascii.GREEN('+')} Adicionado no array: ${arrayPath}\n  Valor: ${JSON.stringify(change.item.rhs, null, 2)}\n`);
                addedCount++;
            } else if (change.item.kind === 'D') {
                diffLog.removed.push(`${Colors.ascii.RED('-')} Removido do array: ${arrayPath}\n  Valor: ${JSON.stringify(change.item.lhs, null, 2)}\n`);
                removedCount++;
            }
        }
    });

    // Seção "Adicionados"
    if (diffLog.added.length > 0) {
        output += `▹▹ ${" ".repeat(28)}${Colors.ascii.GREEN('Adicionados')}${" ".repeat(29)} ◃◃\n`;
        output += `${"╼".repeat(74)}\n\n`;
        output += diffLog.added.join("\n") + "\n\n";
    }

    // Seção "Removidos"
    if (diffLog.removed.length > 0) {
        output += `▹▹ ${" ".repeat(28)}${Colors.ascii.RED('Removidos')}${" ".repeat(31)} ◃◃\n`;
        output += `${"┬".repeat(74)}\n\n`;
        output += diffLog.removed.join("\n") + "\n\n";
    }

    // Seção "Modificados"
    if (diffLog.modified.length > 0) {
        output += `▹▹ ${" ".repeat(27)}${Colors.ascii.YELLOW('Modificados')}${" ".repeat(30)} ◃◃\n`;
        output += `${"┬".repeat(74)}\n\n`;
        output += diffLog.modified.join("\n") + "\n\n";
    }

    // Seção "Resultado"
    output = Footer.printFooter({ output, addedCount, removedCount, modifiedCount });

    return output;
}



function formatYamlDiffLog(diff: Change[]): string {
    if (diff.length === 0) return "Nenhuma diferença encontrada.";

    let output = "";

    let addedCount = 0;
    let removedCount = 0;
    let modifiedCount = 0;

    // Cabeçalho
    output = Header.printHeader(output,HeaderData["Generic"]);


    diff.forEach(change => {
        const path = change.path?.join(" -> ") || "(desconhecido)";
        
        if (change.kind === 'N') {
            diffLog.added.push(`${Colors.ascii.GREEN('+')} Adicionado: ${path}`);
            addedCount++;
        }
        
        if (change.kind === 'D') {
            diffLog.removed.push(`${Colors.ascii.RED('-')} Removido: ${path}`);
            removedCount++;
        }
        
        if (change.kind === 'E') {
            diffLog.modified.push(`${Colors.ascii.YELLOW('~')} Modificado: ${path}\n  De: ${JSON.stringify(change.lhs)}\n  Para: ${JSON.stringify(change.rhs)}\n`);
            modifiedCount++;
        }
    });

    // Seção "Adicionados"
    if (diffLog.added.length > 0) {
        output += `▹▹ ${" ".repeat(28)}${Colors.ascii.GREEN('Adicionados')}${" ".repeat(29)} ◃◃\n`;
        output += `${"╼".repeat(74)}\n\n`;
        output += diffLog.added.join("\n") + "\n\n";
    }

    // Seção "Removidos"
    if (diffLog.removed.length > 0) {
        output += `▹▹ ${" ".repeat(28)}${Colors.ascii.RED('Removidos')}${" ".repeat(31)} ◃◃\n`;
        output += `${"┬".repeat(74)}\n\n`;
        output += diffLog.removed.join("\n") + "\n\n";
    }

    // Seção "Modificados"
    if (diffLog.modified.length > 0) {
        output += `▹▹ ${" ".repeat(27)}${Colors.ascii.YELLOW('Modificados')}${" ".repeat(30)} ◃◃\n`;
        output += `${"┬".repeat(74)}\n\n`;
        output += diffLog.modified.join("\n") + "\n\n";
    }

    // Seção "Resultado"
    output = Footer.printFooter({ output, addedCount, removedCount, modifiedCount });

    return output;
}
run();