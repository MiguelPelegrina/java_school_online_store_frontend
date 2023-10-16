import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class AbstractService<Entity, ID> {
  constructor(protected baseUrl: string, protected httpClient: HttpClient) {}

  public getAll(): Observable<Entity[]> {
    return this.httpClient.get<Entity[]>(this.baseUrl);
  }

  public getById(id: ID): Observable<Entity> {
    return this.httpClient.get<Entity>(`${this.baseUrl}/${id}`);
  }

  public create(instance: Entity): Observable<Entity> {
    return this.httpClient.post<Entity>(this.baseUrl, instance);
  }

  public update(id: ID, instance: Entity): Observable<Entity> {
    return this.httpClient.put<Entity>(`${this.baseUrl}/${id}`, instance);
  }

  public delete(id: ID): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
