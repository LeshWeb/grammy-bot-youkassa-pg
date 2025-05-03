FROM node:18-alpine

# Установка зависимостей для Prisma
RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

# Копируем только необходимые файлы для установки зависимостей
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm install

# Генерируем Prisma клиент
RUN npx prisma generate

# Копируем оставшиеся файлы и собираем проект
COPY . .
RUN npm run build

# Запуск
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]