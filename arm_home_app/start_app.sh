#!/bin/bash
echo "Очистка поврежденных файлов..."
rm -rf node_modules
echo "Установка библиотек (это займет секунд 15-20)..."
npm install
echo "Запуск веб-сервера Vite..."
npm run dev &
VITE_PID=$!
echo "Ждем 5 секунд для запуска Vite..."
sleep 5
echo "Запуск Ngrok..."
npx ngrok http 5174 --host-header=rewrite --config=ngrok.yml
echo "Ngrok закрыт. Останавливаем Vite..."
kill $VITE_PID
