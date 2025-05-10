import { AuthService } from '@/modules/auth/auth.service';
import { Socket } from 'socket.io';

export function JwtSocketMiddleware(authService: AuthService) {
  return async (socket: Socket, next: (err?: any) => void) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const user = await authService.validateToken(token);
      if (!user) {
        return next(new Error('Authentication error'));
      }
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  };
}
