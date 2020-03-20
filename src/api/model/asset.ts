/**
 * FS-OCR Api
 * The API Backend for the FS-OCR App.
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


export interface Asset { 
    id?: number;
    type: Asset.TypeEnum;
    name: string;
    timestamp?: string;
    additional?: any;
}
export namespace Asset {
    export type TypeEnum = 'Gesetzliche' | 'Betriebliche' | 'Riester' | 'Aktien' | 'Rente' | 'Sonstige';
    export const TypeEnum = {
        Gesetzliche: 'Gesetzliche' as TypeEnum,
        Betriebliche: 'Betriebliche' as TypeEnum,
        Riester: 'Riester' as TypeEnum,
        Aktien: 'Aktien' as TypeEnum,
        Rente: 'Rente' as TypeEnum,
        Sonstige: 'Sonstige' as TypeEnum
    };
}
