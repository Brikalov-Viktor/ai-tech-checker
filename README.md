# AI Tech Checker

Система автоматической проверки технических компетенций с использованием AI.

## Технологии

- **Backend**: Node.js 20+, Express, TypeScript, PostgreSQL, TypeORM, JWT, DeepSeek AI
- **Frontend**: React 18, TypeScript, Redux Toolkit, Styled Components, Vite

## Требования

- Node.js 20.19.1 (рекомендуется)
- Docker и Docker Compose

## Установка и запуск

### 1. Запуск базы данных

```bash
docker-compose up -d

cd backend

# Установите нужную версию Node (если используете nvm)
nvm use 20.19.1

# Установите зависимости
npm install
```bash
# Скопируйте .env.example в .env и заполните
cp .env.example .env

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ai_tech_checker

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

PORT=3001

# Получите ключ на https://platform.deepseek.com/
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_MODEL=deepseek-chat

3. Настройка DeepSeek (AI)
Зарегистрируйтесь на DeepSeek Platform

В разделе "API Keys" создайте новый ключ

Добавьте ключ в DEEPSEEK_API_KEY в .env

При регистрации DeepSeek дает $5 бесплатно — этого достаточно для тестирования.

4. Запуск бэкенда
bash
# Выполнить миграции
npm run migration:run

# Заполнить базу тестовыми данными
npm run seed

# Запустить сервер
npm run dev
Сервер будет доступен на http://localhost:3001

5. Запуск фронтенда
bash
cd frontend

# Установите зависимости
npm install

# Создайте .env
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Запустите приложение
npm run dev
Фронтенд будет доступен на http://localhost:3000

Тестовые данные
После npm run seed доступны пользователи:

Логин	Пароль	Роль
admin	admin123	admin
ivan.petrov	user123	user
elena.smirnova	user123	user
Основные API
Метод	Endpoint	Описание
POST	/api/auth/register	Регистрация
POST	/api/auth/login	Вход
POST	/api/interviews/start	Начать интервью
POST	/api/interviews/:id/answer	Ответить на вопрос
POST	/api/interviews/:id/complete	Завершить интервью
GET	/api/interviews/stats	Статистика
GET	/api/pdf/interviews/:id/pdf	Скачать PDF отчет