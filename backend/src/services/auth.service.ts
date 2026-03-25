import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import bcrypt from 'bcryptjs';
import { generateToken, TokenPayload } from '../utils/jwt.utils';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(login: string, password: string, name: string) {
    // Проверяем, существует ли пользователь
    const existingUser = await this.userRepository.findOne({
      where: { login }
    });

    if (existingUser) {
      throw new Error('Пользователь с таким логином уже существует');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = this.userRepository.create({
      login,
      password: hashedPassword,
      name,
      role: UserRole.USER
    });

    await this.userRepository.save(user);

    // Генерируем токен
    const tokenPayload: TokenPayload = {
      id: user.id,
      login: user.login,
      role: user.role
    };

    const token = generateToken(tokenPayload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
        role: user.role,
        grade: user.grade
      }
    };
  }

  async login(login: string, password: string) {
    // Ищем пользователя
    const user = await this.userRepository.findOne({
      where: { login }
    });

    if (!user) {
      throw new Error('Неверный логин или пароль');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Неверный логин или пароль');
    }

    // Генерируем токен
    const tokenPayload: TokenPayload = {
      id: user.id,
      login: user.login,
      role: user.role
    };

    const token = generateToken(tokenPayload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
        role: user.role,
        grade: user.grade
      }
    };
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    return {
      id: user.id,
      name: user.name,
      login: user.login,
      role: user.role,
      grade: user.grade,
      created_at: user.created_at
    };
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'login', 'role', 'grade', 'created_at'],
      order: { created_at: 'DESC' }
    });
    return users;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Проверяем старый пароль
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Неверный текущий пароль');
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Пароль успешно изменен' };
  }
}