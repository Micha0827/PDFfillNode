"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFFill = void 0;
const form_data_1 = __importDefault(require("form-data"));
class PDFFill {
    constructor() {
        this.description = {
            displayName: 'PDF Fill',
            name: 'pdfFill',
            icon: 'file:icon.png',
            group: ['transform'],
            version: 1,
            description: 'Die Node ruft die API PDF Fill auf, die Formulardaten aus PDF extrahiert und Formulare in PDF ausfüllt',
            defaults: {
                name: 'PDF Fill',
                color: '#772244',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            properties: [
                {
                    displayName: 'Base URL',
                    name: 'baseUrl',
                    type: 'string',
                    default: 'http://localhost:8080',
                    placeholder: 'http://localhost:8080',
                    description: 'Basis-URL der PDF Fill API',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Fill',
                            value: 'fill',
                            description: 'Füllt ein PDF-Formular mit Daten',
                        },
                        {
                            name: 'Get Fields',
                            value: 'getFields',
                            description: 'Extrahiert Formularfelder aus einem PDF',
                        },
                    ],
                    default: 'fill',
                    description: 'Wähle die auszuführende Operation',
                },
                {
                    displayName: 'PDF Source',
                    name: 'source',
                    type: 'options',
                    options: [
                        {
                            name: 'Binary',
                            value: 'binary',
                            description: 'PDF über vorherige Node als Binary',
                        },
                        {
                            name: 'URL',
                            value: 'url',
                            description: 'PDF über URL',
                        },
                    ],
                    default: 'binary',
                    description: 'PDF Quelle auswählen',
                },
                {
                    displayName: 'Binary Property',
                    name: 'binaryProperty',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            source: ['binary'],
                        },
                    },
                    description: 'Name der Binary Property mit PDF-Datei',
                },
                {
                    displayName: 'PDF URL',
                    name: 'pdfUrl',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            source: ['url'],
                        },
                    },
                    description: 'URL der PDF-Datei',
                },
                {
                    displayName: 'Fields',
                    name: 'fields',
                    type: 'json',
                    default: {},
                    displayOptions: {
                        show: {
                            operation: ['fill'],
                        },
                    },
                    description: 'Feldnamen und Werte für das Ausfüllen des PDFs',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const baseUrl = this.getNodeParameter('baseUrl', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                const source = this.getNodeParameter('source', i);
                const form = new form_data_1.default();
                if (source === 'binary') {
                    const binaryProperty = this.getNodeParameter('binaryProperty', i);
                    const binaryData = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                    form.append('pdf', binaryData, {
                        filename: 'file.pdf',
                        contentType: 'application/pdf',
                    });
                }
                else {
                    const pdfUrl = this.getNodeParameter('pdfUrl', i);
                    form.append('pdfUrl', pdfUrl);
                }
                if (operation === 'fill') {
                    const fields = this.getNodeParameter('fields', i);
                    form.append('fields', JSON.stringify(fields));
                }
                const endpoint = operation === 'fill' ? 'fill' : 'fields';
                const options = {
                    method: 'POST',
                    url: `${baseUrl}/Pdf/${endpoint}`,
                    body: form,
                    headers: form.getHeaders(),
                    encoding: operation === 'fill' ? 'arraybuffer' : undefined,
                };
                const response = yield this.helpers.httpRequest(options);
                if (operation === 'fill') {
                    const binaryData = yield this.helpers.prepareBinaryData(response, 'application/pdf');
                    returnData.push({ json: {}, binary: { data: binaryData } });
                }
                else {
                    returnData.push({ json: { fields: response } });
                }
            }
            return this.prepareOutputData(returnData);
        });
    }
}
exports.PDFFill = PDFFill;
