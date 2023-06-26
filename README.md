# Скраппер

Для срапинга используется библиотека [Crawlee](https://crawlee.dev).

# Запуск скраппера

yarn start source_name {only-new-products}

source_name:
xiaomi
central-manuals
sony

only-new-products - будут скрапиться только те продукты, которых нет в БД

Сгенерированная после работы программы БД в формате SQLite будет находится в папке **databases**

// TODO: https://www.instrumart.com/
// cenral-manuals (FR, ES)
