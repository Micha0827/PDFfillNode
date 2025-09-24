import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
} from 'n8n-workflow';
import FormData from 'form-data';

export class PDFFill implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PDF Fill',
		name: 'pdfFill',
		icon: 'file:pdfFill.svg',
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
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: { field: [] },
				placeholder: 'Feld hinzufügen',
				displayOptions: {
					show: {
						operation: ['fill'],
					},
				},
				options: [
					{
						displayName: 'Feld',
						name: 'field',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Feldname',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Feldwert',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const baseUrl = this.getNodeParameter('baseUrl', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			const source = this.getNodeParameter('source', i) as string;
			const form = new FormData();

			if (source === 'binary') {
				const binaryProperty = this.getNodeParameter('binaryProperty', i) as string;
				const binaryData = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
				form.append('pdf', binaryData, {
					filename: 'file.pdf',
					contentType: 'application/pdf',
				});
			} else {
				const pdfUrl = this.getNodeParameter('pdfUrl', i) as string;
				form.append('pdfUrl', pdfUrl);
			}

			if (operation === 'fill') {
				const fieldsCollection = this.getNodeParameter('fields.field', i) as IDataObject[];
				const fields: IDataObject = {};
				for (const fieldItem of fieldsCollection) {
					fields[fieldItem.name as string] = fieldItem.value as string;
				}
				form.append('fields', Buffer.from(JSON.stringify(fields)), { contentType: 'application/json' });
			}

			const endpoint = operation === 'fill' ? 'fill' : 'fields';
			const options = {
				method: 'POST' as const,
				url: `${baseUrl}/Pdf/${endpoint}`,
				body: form as unknown as IDataObject,
				headers: form.getHeaders(),
				encoding: operation === 'fill' ? ('arraybuffer' as 'arraybuffer') : undefined,
			};

			const response = await this.helpers.httpRequest(options);

			if (operation === 'fill') {
				const binaryData = await this.helpers.prepareBinaryData(response as Buffer, 'application/pdf');
				returnData.push({ json: {}, binary: { data: binaryData } });
			} else {
				returnData.push({ json: { fields: response as IDataObject[] } });
			}
		}

		return this.prepareOutputData(returnData);
	}
}
