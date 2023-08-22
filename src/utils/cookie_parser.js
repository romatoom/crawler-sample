// Зайти на сайт локально и скопировать строку с cookies в вкладке Networks в консоли разработчика
export const COOKIES_STR =
  "_ym_uid=1634564881819679718; _ym_d=1684246004; _gcl_au=1.1.1504946860.1692023023; cartUserCookieIdent_v3=0191b8f97689c6c19998fc82100f2f5caddce7e97cd1c09f104ba51edb3b8de2a%3A2%3A%7Bi%3A0%3Bs%3A22%3A%22cartUserCookieIdent_v3%22%3Bi%3A1%3Bs%3A36%3A%22c15a0167-ef10-36be-a96f-0523961b1b17%22%3B%7D; rrpvid=760541572098347; phonesIdent=463ae9b143d0d0296bc8bfe17f2e3ffa7c9d3ac791c54771ab024ba18d12e254a%3A2%3A%7Bi%3A0%3Bs%3A11%3A%22phonesIdent%22%3Bi%3A1%3Bs%3A36%3A%22bec447ba-2eaa-417a-a746-f247ffd92e03%22%3B%7D; tmr_lvid=86c2eb72c2336c8be922c6e7c7ee2dde; tmr_lvidTS=1634564880631; rcuid=643e4b8a2c7401205011d63a; cookieImagesUploadId=a0e330734e82a5c6d9bcead4471b88374dd2d52bfb91f371bda912a3d3a37140a%3A2%3A%7Bi%3A0%3Bs%3A20%3A%22cookieImagesUploadId%22%3Bi%3A1%3Bs%3A36%3A%22d8f09c59-1881-4ab8-837f-f7d7a272a516%22%3B%7D; current_path=ec5f74b7d43fd2d186b639924968cf693e5622ed652f95643024dfd7259e6d6ba%3A2%3A%7Bi%3A0%3Bs%3A12%3A%22current_path%22%3Bi%3A1%3Bs%3A115%3A%22%7B%22city%22%3A%2255506b4d-0565-11df-9cf0-00151716f9f5%22%2C%22cityName%22%3A%22%5Cu0422%5Cu044e%5Cu043c%5Cu0435%5Cu043d%5Cu044c%22%2C%22method%22%3A%22manual%22%7D%22%3B%7D; _ab_=%7B%22catalog-hit-filter%22%3A%22favorites_analog_test%22%7D; lang=ru; city_path=tumen; _gid=GA1.2.929576360.1692598041; _ym_isad=2; _csrf=92dc1319ebd63546dab4e9dfd34bdcb641b6c78649a4efda775f20c69851347ba%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22FHs16z9eeR5FaGJ7xRyh-ZxcKe0OtWj8%22%3B%7D; PHPSESSID=54fedfebddd590703c03cd70cf103e58; _ga_FLS4JETDHW=GS1.1.1692637446.37.0.1692637446.60.0.0; _ym_visorc=b; tmr_detect=0%7C1692637448981; _ga=GA1.2.779024590.1692023023; qrator_jsr=1692639127.692.UyGwi4nr4qMBlI1D-037ll2fpig1aq193qjb6i1agf6k9p74c-00; qrator_jsid=1692639127.692.UyGwi4nr4qMBlI1D-bq90e1bhua8uql73o2c12kl8idpvcg3u";

export function getCookies() {
  let arrCookiesStr = COOKIES_STR.split(";");
  return arrCookiesStr.map((cookieStrItem) => {
    const [name, value] = cookieStrItem.split("=");
    return {
      name: name.trim(),
      value: value.trim(),
    };
  });
}
