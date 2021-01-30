import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Signos } from 'src/app/_model/signos';
import { Paciente } from 'src/app/_model/paciente';
import { SignosService } from 'src/app/_service/signos.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { PacienteService } from 'src/app/_service/paciente.service';


@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  pacienteSeleccionado: Paciente;

  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;

  pacientes: Paciente[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signosService: SignosService,
    private pacienteService : PacienteService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl(''),
    });

    this.listarPacientes();    

    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    //from path
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    if (this.edicion) {
      this.signosService.listarPorId(this.id).subscribe(data => {
        console.log(data);
        this.form = new FormGroup({
          'id': new FormControl(data.idSignos),
          'paciente': this.myControlPaciente,
          'fecha': new FormControl(data.fecha, Validators.required),
          'temperatura': new FormControl(data.temperatura, Validators.required),
          'pulso': new FormControl(data.pulso),
          'ritmo': new FormControl(data.ritmoRespiratorio),
        });

        this.myControlPaciente.setValue(data.paciente);
      });
    }
  }

  filtrarPacientes(val: any){
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }
    return this.pacientes.filter(el => 
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }


  get f() {
    return this.form.controls;
  }

  operar() {
    if (this.form.invalid) { return; }

    
    let signos = new Signos();
    signos.idSignos = this.form.value['id'];
    signos.paciente = this.form.value['paciente'];
    signos.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    signos.temperatura = this.form.value['temperatura'];
    signos.pulso = this.form.value['pulso'];
    signos.ritmoRespiratorio = this.form.value['ritmo'];

    if (this.edicion) {
      
      //PRACTICA IDEAL      
      this.signosService.modificar(signos).pipe(switchMap(() => {
        return this.signosService.listar();
      }))
      .subscribe(data => {
        this.signosService.setSignosCambio(data);
        this.signosService.setMensajeCambio('SE MODIFICO');
      });

    } else {
      //REGISTRAR
      this.signosService.registrar(signos).subscribe(() => {
        this.signosService.listar().subscribe(data => {
          this.signosService.setSignosCambio(data);
          this.signosService.setMensajeCambio('SE REGISTRO');
        });
      });
    }

    this.router.navigate(['signos']);

  }


}
