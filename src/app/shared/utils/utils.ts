import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AuthResultDto } from "./interfaces/authResultDto";
import { jwtDecode } from "jwt-decode";

/**
 * Converts an image file to a Base64-encoded string.
 * @param image - The fil representing thhe image to convert.
 * @param callback - A callback function that will receive the Base64-encoded string.
 */
export function getBase64(image: Blob, callback: (arg0: string | ArrayBuffer | null) => any){
  const reader = new FileReader();

  reader.addEventListener('load', () => callback(reader.result))

  reader.readAsDataURL(image);
}

export function handleErrorStatusResponse(error: any, router: Router){
  switch(error.status){
    case 401:
    case 403:
      router.navigate(['/auth/login']);
      alert("You need to login to continue");
      break;
    default:
      Swal.fire('An error ocurred, contact with your support', '', 'info');
      break;
  }
}

export function isEmployee(): boolean {
  let isEmployee = false;

  if(getRoles().includes("EMPLOYEE")){
    isEmployee = true;
  }

  return isEmployee;
}

export function isAdmin(): boolean {
  let isAdmin = false;

  if(getRoles().includes("ADMIN")){
    isAdmin = true;
  }

  return isAdmin;
}

export function isClient(): boolean {
  let isClient = false;

  if(getRoles().includes('CLIENT')){
    isClient = true;
  }

  return isClient
}

function getRoles(): string[] {
  let roles: string[] = [];
  const token = localStorage.getItem('auth_token');

  if(token){
    const tokenInfo: AuthResultDto = jwtDecode(token);
    roles = tokenInfo.roles;
  }

  return roles;
}

