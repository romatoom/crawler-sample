Инструкция для фрилансеров
=========

*По скраперу*

* Писать можно на любом языке
* Скрапер должен уметь сохранять и обновлять данные в БД при повторном запуске
* Запись в лог осуществляется в формате: запрос (GET/POST) на страницу, ответ, ошибки (404, 500)
* Тесты по желанию

*По данным*

* Максимальное количество данных мануала/продукта с сайта-источника
* По возможности очищаем данные (без пробелов, спецсимволов и тд)
* Урлы должны содержать полный путь
* Обратить внимание на валидность полей типа JSON

Схема работы
-----

1. Запускаем скрапер для сбора информации с сайта-источника
2. Данные сохраняем в sqlite-файл `empty.db`
3. Смотрим насколько корректна выборка в БД
4. Отдаем sqlite-файл в формате `<Наименование сайта-источника>.db` и код скрапера на ревью
5. Получаем обратную связь, переделываем в соответствии с замечаниями

Заготовка БД empty.db
-----

> Содержит схему, ограничения полей, их обязательность и тип.

### Таблица products

* `brand` - обязательный параметр
* `category` - основная категория продукта, обязательный параметр
* `name` - обязательный параметр, уникален в рамках бренда
* `sku` - складской номер, может отсутствовать, по нему отслеживается товар
* `url` - страница, на которой располагается продукт
* `specs` - набор характеристик продукта, сохранять в JSON
* `images` - изображения продукта, сохранять в JSON
* `description`	- описание продукта, иногда присутствует на странице
* `metadata` - дополнительные данные, сохранять в JSON

### Таблица manuals

* `material_type` - тип мануала, обязательный параметр
* `pdf_url` - обязательный параметр, уникален
* `title` - описывает содержание ссылки на мануал, может отсутствовать
* `languages` - если мануал мультиязычный, то сохранять языки через запятую
* `metadata` - дополнительные данные, сохранять в JSON

### Таблица products_manuals

> Связующая таблица для реализации отношения многие-ко-многим

* `product_id` - обязательный параметр
* `manual_id` - обязательный параметр

> Продукт может содержать несколько мануалов разного типа, но бывает, что один мануал распределен на несколько продуктов

### Дополнительное описание для полей

Material Type

Обозначение типа мануала, может отображаться отдельной строкой, содержаться в наименовании или ссылке мануала

> Нужно стараться вытаскивать тип вырезая напрямую, по паттерну, либо в рамках здравого смысла

Примеры: User Guide, User Manual, Operating Guide, Instruction Manual, Quick Setup Guide, etc.

> Если невозможно определить тип мануала, ставим по умолчанию Manual

Category

> На сайте может быть множество категорий под один продукт, нужно выбрать наиболее оптимальную

Примеры: TV, DVD Players, Routers, Video, Digital Cameras, etc.

Sku

> Может встречаться также как Product Id, иногда совпадает с name

Примеры: KMPS350, AIR-CAP2702I-B-K9, 943 824-002

Specs

> Может содержаться внутри самой pdf, в этом случае поле оставляем пустым

Images

Должны быть в приемлемом качестве и разрешении, главное забирать фронтовое изображение

> Первое изображение в массиве картинок - всегда фронтовое

Metadata

Любые данные продукта/мануала, которые не подошли под имеющиеся атрибуты полей, но имеют ценность

### Примеры данных

[Пример с сайта-источника Asus](https://www.asus.com/Commercial-Servers-Workstations/TS110E8PI4/HelpDesk_Manual/)

Продукт

```
{
  "id": 1,
  "brand": "Asus",
  "name": "TS110-E8-PI4",
  "category": "Commercial Servers Workstations",
  "description": "",
  "sku": "",
  "url": "https://www.asus.com/Commercial-Servers-Workstations/TS110E8PI4/HelpDesk_Manual/",
  "specs": "{}",
  "images": "{}",
  "metadata": "{}",
  "updated_at": "2017-12-25 17:25:57 +0300",
  "created_at": "2017-12-25 17:25:57 +0300"
}
```

Мануал

```
{
  "id": 1,
  "material_type": "User Guide",
  "pdf_url": "http://dlcdnet.asus.com/pub/ASUS/server/TS100-E8-PI4/Manual/T12216_TS110-E8-PI4_V2_WEB.pdf",
  "title": "TS110-E8-PI4 User Guide for Traditional Chinese",
  "languages": "Chinese",
  "metadata": "{\"size\": \"8.88 MBytes\", \"version\": \"T12216\"}",
  "updated_at": "2017-12-25 17:25:57 +0300",
  "created_at": "2017-12-25 17:25:57 +0300"
}
```

[Пример с сайта-источника Cxtec](http://www.industrialnetworking.com/Category/Telephone-Modems/Westermo-TDW-33-Modem)

Продукт

```
{
  "id": 1,
  "brand": "Westermo",
  "name": "TDW-33 Modem",
  "category": "Telephone Modems",
  "description": "<p>Westermo Dial-Up RS-232/V.90 Modem, 12-48 VDC, DIN-Rail Mount</p><p>The TDW-33...</p>",
  "sku": "TDW-33",
  "url": "http://www.industrialnetworking.com/Category/Telephone-Modems/Westermo-TDW-33-Modem",
  "specs": "{}",
  "images": "{}",
  "metadata": "{}",
  "updated_at": "2017-12-25 17:25:57 +0300",
  "created_at": "2017-12-25 17:25:57 +0300"
}
```

Мануал

```
{
  "id": 1,
  "material_type": "Specification Guide",
  "pdf_url": "http://www.industrialnetworking.com/pdf/TDW33.pdf",
  "title": "",
  "languages": "",
  "metadata": "{}",
  "updated_at": "2017-12-25 17:25:57 +0300",
  "created_at": "2017-12-25 17:25:57 +0300"
}
```

[Пример с сайта-источника Adorama](https://www.adorama.com/ssgf2prs.html)

Продукт

```
{
  "id": 1,
  "brand": "Samsung",
  "name": "Samsung Gear Fit2 Pro Water-Resistant Fitness Band with Music Player and Built-In GPS, Small, Red",
  "category": "Telephone Modems",
  "description": "Samsung Gear Fit2 Pro Water-Resistant Fitness Band, Small, Red",
  "sku": "SSGF2PRS",
  "url": "https://www.adorama.com/ssgf2prs.html",
  "specs": "[{\"label\": \"Main Display Technology\", \"value\": \"OLED\", \"group\": \"Display\"},{\"label\": \"Width\", \"value\": \"25mm\", \"group\": \"Strap\"}]",
  "images": "[\"https://www.adorama.com/images/Large/ssgf2prs.jpg\", \"https://www.adorama.com/images/Large/ssgf2prs_2.jpg\"]",
  "metadata": "{\"mfr\": \"SM-R365NZRNXAR\"}",
  "updated_at": "2017-12-25 17:25:57 +0300",
  "created_at": "2017-12-25 17:25:57 +0300"
}
```

Мануал

```
{
  "id": 1,
  "material_type": "Smartwatch Buying Guide",
  "pdf_url": "https://smedia.webcollage.net/rwvfp/wc/cp/27057895/module/samsungus/_cp/products/sm-r365nzrnxar/tab-96159660-f7b0-4fe0-ba34-bd6053176e74/81ad8a5f-6f58-486a-997a-4287a668f563.pdf",
  "title": "Smartwatch Buying Guide",
  "languages": "",
  "metadata": "{\"size\": \"2.21MB\"}",
  "updated_at": "2017-12-25 17:25:57 +0300",
  "created_at": "2017-12-25 17:25:57 +0300"
}
```

// https://pro.sony/en_CZ/sitemap
// https://pro.sony/en_CZ/products/dwx-digital-series-receivers
