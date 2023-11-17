import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Abstract class for performing CRUD operations on entities
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
   * @param instance - The Entity object to be created.
   * @returns An Observable of the created Entity object.
   */
  create(instance: Entity): Observable<Entity> {
    return this.httpClient.post<Entity>(this.baseUrl, instance).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes an entity from the API.
   * @param id - The identifier of the entity to delete.
   * @returns An Observable representing the result of the deletion operation.
   */
  delete(id: ID): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`).pipe();
  }

  /**
   * Retrieves all entities from the API.
   * @returns An Observable of an array of Entity objects.
   */
  getAll(): Observable<Entity[]> {
    return this.httpClient.get<Entity[]>(this.baseUrl).pipe();
  }

  /**
   * Retrieves a specific entity by its identifier from the API.
   * @param id - The identifier of the entity to retrieve.
   * @returns An Observable of the Entity object.
   */
  getById(id: ID): Observable<Entity> {
    return this.httpClient.get<Entity>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing entity in the API.
   * @param id - The identifier of the entity to update.
   * @param instance - The Entity object with updated data.
   * @returns An Observable of the updated Entity object.
   */
  update(id: ID, instance: Entity): Observable<Entity> {
    return this.httpClient.put<Entity>(`${this.baseUrl}/${id}`, instance).pipe(
      catchError(this.handleError)
    );
  }

  // Protected methods
  /**
   * Handles HTTP request errors, providing error handling and navigation.
   * @param error - The HttpErrorResponse object representing the error.
   * @returns An Observable that emits an error message.
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }
}
