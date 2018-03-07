import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { FormGroup } from '@angular/forms';

interface IPerson {
  name: string;
}

interface ITodo {
  id: number;
  description: string;
  assignedTo?: string;
  done?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  displayedColumns = ['todoID', 'description', 'assignedTo', 'done'];
  public people: Observable<IPerson[]>;
  public todos: Observable<ITodo[]>;
  showUndone = false;
  showMine = false;
  public API_URL = 'http://localhost:8080/api';
  currentUser;
  showForm = false;
  lastID;

  constructor(private httpClient: HttpClient) {
    this.getItems();
    this.getPeople();
  }

  toggleItems() {
    if (this.showMine && this.showUndone === false) {
      this.todos = this.httpClient.get<ITodo[]>(this.API_URL + '/todos').
        map(todo => todo.filter(element => element.assignedTo === this.currentUser));
    } else if (this.showMine === false && this.showUndone) {
      this.todos = this.httpClient.get<ITodo[]>(this.API_URL + '/todos').
        map(todo => todo.filter(element => element.done === false || element.done == null));
    } else if (this.showMine && this.showUndone) {
      this.todos = this.httpClient.get<ITodo[]>(this.API_URL + '/todos').
        map(todo => todo.filter(element => element.done === false || element.done == null && element.assignedTo === this.currentUser));
    } else if (!this.showMine && !this.showUndone) {
      this.getItems();
    }

  }

  enableForm() {
    this.showForm = true;
  }

  getItems() {
    this.todos = this.httpClient.get<ITodo[]>(this.API_URL + '/todos');
  }
  getPeople() {
    this.people = this.httpClient.get<IPerson[]>(this.API_URL + '/people');
  }

  refreshList() {
    this.getItems(); this.getPeople();
    this.showMine = false;
    this.showUndone = false;
  }

  reset() {
    this.getItems(); this.getPeople();
    this.showMine = false;
    this.showUndone = false;
    this.currentUser = null;
  }

  addTodoItem(todoDescription, todoAssignedTo) {
    const newItem: ITodo = { id: 10, description: todoDescription, assignedTo: todoAssignedTo };
    console.log(newItem);
    this.httpClient.post<ITodo>(this.API_URL + '/todos', newItem);
    this.showForm = false;
  }

}


