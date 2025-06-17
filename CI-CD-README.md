# 🚀 CI/CD для Notes Frontend

### GitHub Actions Workflows:

#### 1. **🚀 CI/CD Pipeline** (`.github/workflows/ci.yml`)

- **Тригери**: Push в `main`/`develop`, Pull Request в `main`
- **Етапи**:
  - 🧪 **Test & Lint** - тести та перевірка коду
  - 🏗️ **Build** - збірка додатку
  - 🚀 **Deploy** - розгортання (тільки для main)

#### 2. **🎨 Code Quality** (`.github/workflows/code-quality.yml`)

- TypeScript перевірка
- Prettier форматування
- Security audit
- Bundle size check

## 🛠️ Доступні команди

```bash
# Розробка
npm start              # Запуск dev сервера
npm test               # Запуск тестів
npm run test:coverage  # Тести з покриттям

# Якість коду
npm run lint           # Перевірка ESLint
npm run lint:fix       # Виправлення ESLint помилок
npm run format         # Форматування Prettier
npm run format:check   # Перевірка форматування
npm run type-check     # Перевірка TypeScript

# Збірка
npm run build          # Збірка для продакшн
```

## 🎯 Як працює пайплайн

### При Push в main:

```
1. 🧪 Запускаються тести
2. 🎨 Перевірка якості коду
3. 🏗️ Збірка додатку
4. 🚀 Розгортання в продакшн
```

### При Pull Request:

```
1. 🧪 Запускаються тести
2. 🎨 Перевірка якості коду
3. 🏗️ Збірка додатку
4. ✅ Готово до мержу
```

## 📊 Статуси збірки

Після налаштування в GitHub ви побачите:

- ✅ Зелений статус - все ОК
- ❌ Червоний статус - є помилки
- 🟡 Жовтий статус - в процесі

## 🔧 Налаштування розгортання

### Vercel (рекомендовано):

1. Зареєструйтесь на [vercel.com](https://vercel.com)
2. Підключіть GitHub репозиторій
3. Додайте в `.github/workflows/ci.yml`:

```yaml
- name: 🚀 Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
    vercel-args: "--prod"
```

### Netlify:

```yaml
- name: 🚀 Deploy to Netlify
  uses: nwtgck/actions-netlify@v2.0
  with:
    publish-dir: "./build"
    production-branch: main
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🎓 Навчальні цілі

Цей пайплайн демонструє:

- ✅ Автоматизацію тестування
- ✅ Перевірку якості коду
- ✅ Автоматичну збірку
- ✅ Conditional deployment
- ✅ Artifact management
- ✅ Multi-job workflows

## 🔍 Моніторинг

- **GitHub Actions** - статуси збірок
- **Codecov** - покриття тестів
- **Bundle analyzer** - розмір збірки

## 📈 Наступні кроки

1. Додати E2E тести (Cypress/Playwright)
2. Налаштувати staging середовище
3. Додати performance тести
4. Налаштувати нотифікації в Slack/Discord
