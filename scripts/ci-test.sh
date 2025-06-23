#!/bin/bash

set -e

echo "🚀 Тестування CI/CD кроків локально..."
echo ""


export CI=true
export NODE_ENV=test

echo "📦 1. Встановлення залежностей..."
npm ci

echo ""
echo "🧪 2. Запуск unit тестів..."
npm test -- --coverage --watchAll=false

echo ""
echo "🎨 3. Перевірка якості коду..."
npm run type-check
npm run format:check
npm run lint

echo ""
echo "🏗️ 4. Збірка додатку..."
npm run build

echo ""
echo "🎭 5. Встановлення Playwright браузерів..."
npm run test:e2e:install

echo ""
echo "🎯 6. Запуск E2E тестів..."
npm run test:e2e

echo ""
echo "✅ Всі CI кроки пройшли успішно!"
echo "🚀 Готово до комітів GitHub!" 