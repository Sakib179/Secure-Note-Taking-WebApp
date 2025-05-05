// Auth header utility 
import { getToken } from '../services/auth.service';

// Create authentication header with JWT token
export default function authHeader() {
  const token = getToken();
  
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  } else {
    return {};
  }
}