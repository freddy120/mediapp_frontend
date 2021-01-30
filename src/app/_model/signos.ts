import { Paciente } from './paciente';

export class Signos {
    idSignos: number;
    paciente: Paciente;
    fecha: string; //2020-11-07T11:30:05 ISODate || moment.js
    temperatura: string;
    pulso: string;
    ritmoRespiratorio: string;
}