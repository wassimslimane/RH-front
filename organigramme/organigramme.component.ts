import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TreeNode} from 'primeng/api';
import {MessageService} from 'primeng/api';
import {Employee} from '../models/Employee';
import {EmployeeService} from '../services/employee.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-organigramme',
  templateUrl: './organigramme.component.html',
  styleUrls: ['./organigramme.component.scss'],
  providers: [MessageService]
})
export class OrganigrammeComponent implements OnInit {


  nodo_nuevo = {
    label: "",
    type: "person",
    styleClass: "p-person",
    expanded: true,
    data: { name: "", id_nodo: "", padre: "", img:"" },
    children: []
  };
   employees=[];



  data1: TreeNode[];

  selectedNode: TreeNode;



  constructor(private messageService: MessageService,private employeeService: EmployeeService) {}

  ngOnInit() {
    this.getEmployees();
  }





  public getEmployees(): void {
    this.employeeService.getAllEmp().subscribe(
      (response: Employee[]) => {
        this.employees = response;
console.log(this.employees);

        const rootIndex = this.employees.findIndex(e=>e.responsable===null)
        console.log(rootIndex)
this.armarArbol(this.employees)




      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  armarArbol(data) {
    this.data1 = [];
    // executes and set the root element where padre is undefined or null
    const rootIndex = data.findIndex(
      item => item.responsable === undefined || item.responsable === null
    );
    this.nodo_nuevo.label = data[rootIndex].poste;
    this.nodo_nuevo.data.name = data[rootIndex].firstName;
    this.nodo_nuevo.data.id_nodo = data[rootIndex].id;
    this.nodo_nuevo.data.padre = data[rootIndex].responsable;
    this.nodo_nuevo.data.img = data[rootIndex].img;
    this.data1.push(this.nodo_nuevo);
    data.splice(rootIndex, 1);
    // this is the recurrsive method
    this.setChild(
      +this.nodo_nuevo.data.id_nodo,
      data,
      this.data1[this.data1.length - 1].children
    );
  }


private setChild(parentId: number, data: any, currentChild) {
  if (data.length > 0) {
    const filterArray = data.filter(item => +item.responsable === +parentId);
    filterArray.forEach(item => {
      this.limpiarNodo();
      this.nodo_nuevo.label = item.poste;
      this.nodo_nuevo.data.name = item.firstName;
      this.nodo_nuevo.data.id_nodo = item.id;
      this.nodo_nuevo.data.padre = item.responsable;
      this.nodo_nuevo.data.img = item.img;
      currentChild.push(this.nodo_nuevo);
      this.setChild(
        +this.nodo_nuevo.data.id_nodo,
        data,
        currentChild[currentChild.length - 1].children
      );
    });
  }
}



limpiarNodo() {
  this.nodo_nuevo = {
    label: "",
    type: "person",
    styleClass: "p-person",
    expanded: true,
    data: { name: "", id_nodo: "", padre: "" ,img:""},
    children: []
  };
}




  onNodeSelect(event) {
    this.messageService.add({severity: 'success', summary: '', detail: event.node.label});
  }
}
