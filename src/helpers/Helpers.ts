import { DiffLog } from "src/interfaces/index.js";

export const HeaderData = {
    OpenApi: {
        type: "OpenApi",
        title: "CHANGE LOG OPENAPI",
        description: "Mudanças detectadas na estrutura do arquivo OpenAPI."
    },
    Generic: {
        type: "Generic",
        title: "CHANGE LOG",
        description: "Mudanças detectadas na estrutura do arquivo."
    }
}

export const diffLog: DiffLog = {
    added: [],
    removed: [],
    modified: []
};