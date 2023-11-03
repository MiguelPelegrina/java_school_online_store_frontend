import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, retry, throwError } from 'rxjs';
import Swal from 'sweetalert2';

/**
 * Abstract class for performing CRUD operations on entities
 *
 * @param Entity - The type of entity this service works with.
 * @param ID - The type of the entity's identifier
 */
export abstract class AbstractService<Entity, ID> {
  // Setting request headers to JSON
  // TODO Set headers?
  /*headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

  httpOptions = {
    headers: this.headers
  };*/

  /**
   * All arguments constructor for child classes.
   * @param baseUrl - The base URL for the service's API endpoint.
   * @param httpClient - An HttpClient instance for making HTTP requests.
   * @param router - A Router instance for navigation.
   */
  constructor(protected baseUrl: string, protected httpClient: HttpClient) {}

  /**
   * Creates a new entity in the API.
   *
   * @param instance - The Entity object to be created.
   * @returns An Observable of the created Entity object.
   */
  public create(instance: Entity): Observable<Entity> {
    return this.httpClient.post<Entity>(this.baseUrl, instance).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes an entity from the API.
   *
   * @param id - The identifier of the entity to delete.
   * @returns An Observable representing the result of the deletion operation.
   */
  public delete(id: ID): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all entities from the API.
   *
   * @returns An Observable of an array of Entity objects.
   */
  public getAll(): Observable<Entity[]> {
    return this.httpClient.get<Entity[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a specific entity by its identifier from the API.
   *
   * @param id - The identifier of the entity to retrieve.
   * @returns An Observable of the Entity object.
   */
  public getById(id: ID): Observable<Entity> {
    return this.httpClient.get<Entity>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing entity in the API.
   *
   * @param id - The identifier of the entity to update.
   * @param instance - The Entity object with updated data.
   * @returns An Observable of the updated Entity object.
   */
  public update(id: ID, instance: Entity): Observable<Entity> {
    return this.httpClient.put<Entity>(`${this.baseUrl}/${id}`, instance).pipe(
      catchError(this.handleError)
    );
  }

  // Private methods
  /**
   * Handles HTTP request errors, providing error handling and navigation.
   *
   * @param error - The HttpErrorResponse object representing the error.
   * @returns An Observable that emits an error message.
   */
  private handleError(error: HttpErrorResponse) {
    console.log(error)
    // Check if a client-side or network error occurred.
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
      Swal.fire('An network error ocurred', '', 'info')
    } else {
      // TODO Controls more erros
      switch(error.status){
        case 401:
        case 403:
          Swal.fire('You need to login to continue', '', 'warning');
          // TODO Navigate to login
          break;
      }
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
