import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { login, password, name } = req.body;

      // Валидация
      if (!login || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Логин, пароль и имя обязательны'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Пароль должен содержать минимум 6 символов'
        });
      }

      const result = await authService.register(login, password, name);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({
          success: false,
          message: 'Логин и пароль обязательны'
        });
      }

      const result = await authService.login(login, password);

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Не авторизован'
        });
      }

      const user = await authService.getMe(userId);
      res.json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const users = await authService.getAllUsers();
      res.json({
        success: true,
        data: users
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { oldPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Не авторизован'
        });
      }

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Старый и новый пароль обязательны'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Новый пароль должен содержать минимум 6 символов'
        });
      }

      const result = await authService.changePassword(userId, oldPassword, newPassword);
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}