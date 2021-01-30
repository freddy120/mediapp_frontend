import { Injectable } from '@angular/core';
import { Signos } from '../_model/signos';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FiltroConsultaDTO } from '../_dto/filtroConsultaDTO';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignosService extends GenericService<Signos>{

  private signosCambio = new Subject<Signos[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos`
    )
  }


  buscarOtros(filtroConsulta: FiltroConsultaDTO) {
    return this.http.post<Signos[]>(`${this.url}/buscar/otros`, filtroConsulta);
  }

  buscarFecha(fecha: string) {
    return this.http.get<Signos[]>(`${this.url}/buscar?fecha=${fecha}`);
  }


  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }


  //** get set subjects */

  getSignosCambio(){
    return this.signosCambio.asObservable();
  }

  setSignosCambio(signos : Signos[]){
    this.signosCambio.next(signos);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    return this.mensajeCambio.next(mensaje);
  }




}
