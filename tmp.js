import { Serializer } from "#utils/classes/serializer.js";

const serializer = new Serializer("test");

const arr = [
  {
    url: "https://www.gourmia.com/item.asp?item=10355",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GGA2100 Indoor Grill & Air Fryer",
        category: "FoodStation� Indoor Grill & Air Fryer",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10358",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GGA2120 Indoor Grill & Air Fryer",
        category: "FoodStation� Indoor Grill & Air Fryer",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10398",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GGA2180 Indoor Grill, Griddle & Air Fryer",
        category: "FoodStation� Indoor Grill & Air Fryer",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10399",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF2440 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10400",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF2448 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10406",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF616 6-QT Digital Window Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10407",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF1150 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10419",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF789 7-QT Fry �N Fold Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10420",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF734 4-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10368",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7660 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10351",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7530 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10381",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7520 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10324",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7900 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10325",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7655 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10320",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7650 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10299",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7600 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10328",
    label: "PRODUCT",
    userData: {
      data: { productName: "GTF7580 Air Fryer Oven", category: "Air Fryers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10369",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7465 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10327",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7460 - Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10300",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7450 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10371",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF1220 14-Quart Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10380",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF1230 14-Quart Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10334",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7360 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10289",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF688 Digital Free Fry Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10301",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7355 Digital Air Fryer Oven",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10356",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF956 9-Qt Dual Basket Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10365",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF856 8-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10352",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF846 8-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10302",
    label: "PRODUCT",
    userData: {
      data: { productName: "GTF7350 Air Fryer Oven", category: "Air Fryers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10329",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF838 8-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10364",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF826 8-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10353",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF798 7-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10330",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF778 7-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10298",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF735 7-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10323",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF698 6-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10296",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF685 6-Qt Digital Free Fry Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10267",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF680 6-Qt Digital Free Fry Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10265",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF635 6-Qt Digital Free Fry Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10382",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF652 6-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10305",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF518 5-Qt Free Fry Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10340",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF476 4-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10411",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF414 4-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10413",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF612 6-QT Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10342",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAFW598 5-Qt Digital Air Fryer + Waffle Maker",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10297",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF718 7-Qt Free Fry Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10331",
    label: "PRODUCT",
    userData: {
      data: { productName: "GAF716 Digital Air Fryer", category: "Air Fryers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10338",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF686 6-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10268",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF658 6-Qt Digital Free Fry Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10263",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF625 6-Qt Digital Free Fry Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10264",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF615 Free Fry Digital Air Fryer 6 Qt",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10247",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF575 5-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10335",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF556 5-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10333",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF536 5-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10346",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF486 4-Qt Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10261",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF328 3.5-Qt Digital Free Fry Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10262",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF318 4-Qt Digital Free Fry Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10260",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF265 4-Qt Digital Free Fry Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10257",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF228 2.2-Qt Digital Free Fry Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10379",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF249 Compact 2-Qt. Digital Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10336",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF566 5-Qt Classic Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10213",
    label: "PRODUCT",
    userData: {
      data: { productName: "GAF375 4.5 Qt Air Fryer", category: "Air Fryers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10347",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF236BK 2.2-Qt Compact Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10348",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF236W 2.2-Qt Compact Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10349",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF236R 2.2-Qt Compact Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10350",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF236BL 2.2-Qt Compact Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10384",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF222 2.2-Qt Compact Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10256",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF218 2.2-Qt Compact Air Fryer",
        category: "Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10404",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM4225 15-Bar Espresso Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10405",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM4210 4-Shot Espresso Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10408",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3282 One-Touch 12-Cup Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10409",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3518 5-Cup Programmable Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10410",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3510 One-Touch 5-Cup Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10422",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM4240 8-in-1 One-Touch Espresso Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10423",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3299 12-Cup Programmable Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10385",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3259BK 12-Cup Hot & Iced Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10386",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3259BL 12-Cup Hot & Iced Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10421",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM4230 8-in-1 One-Touch Espresso Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10387",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3259R 12-Cup Hot & Iced Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10388",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3259W 12-Cup Hot & Iced Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10360",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3210BK 4-Minute Iced Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10361",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3210BL 4-Minute Iced Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10362",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3210R 4-Minute Iced Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10363",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3210W 4-Minute Iced Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10375",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM2218 Pod + 12-Cup Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10396",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3269 Pod + 12-Cup Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10354",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3260 12-Cup Hot and Iced Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10401",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3289 12-Cup Programmable Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10277",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM7800 Cold Brew Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10304",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM2865 12-Cup Programmable Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10343",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3180 12-Cup Grind & Brew Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10276",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM4850 Grind & Brew Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10294",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM2815 12-Cup Programmable Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10285",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCMW4750 Coffee Maker and Grinder with Wi-Fi",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10275",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3350 Pour-Over Coffee Brewer",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10288",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3250 Pour-Over Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10274",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM1835 One Touch Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10250",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM6850 Cold Brew Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10087",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM7000 Multi-Capsule Espresso Machine",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10244",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM6800 Cold Brew Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10086",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM6500 Espresso, Cappuccino & Latte Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10085",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM5500 Espresso, Cappuccino & Latte Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10222",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM6000 6-in-1 Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10083",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM5000 Coffee & Espresso Maker - Milk Frother",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10084",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM5100 Coffee & Espresso Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10082",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM4700 Coffee Maker & Grinder",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10221",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM4900 Pour Over Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10218",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM4000 3-in-1 Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10081",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3600 Coffee & Tea Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10080",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3500 Siphon Coffee Maker",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10249",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GKCP Manual K-Cup Press",
        category: "Coffee Machine",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10418",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPB3125 Digital Blender",
        category:
          "Juicers & Blenders\r\n\t\t\t\t\t\tMultiple power settings for hard and soft food; superior extraction for fruits and vegetables",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10332",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GJ1455 6-Speed Digital Wide Mouth Juicer",
        category:
          "Juicers & Blenders\r\n\t\t\t\t\t\tMultiple power settings for hard and soft food; superior extraction for fruits and vegetables",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10281",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GJ1350 4-Speed Digital Wide Mouth Juicer",
        category:
          "Juicers & Blenders\r\n\t\t\t\t\t\tMultiple power settings for hard and soft food; superior extraction for fruits and vegetables",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10078",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GJ1250 Wide Mouth Juicer",
        category:
          "Juicers & Blenders\r\n\t\t\t\t\t\tMultiple power settings for hard and soft food; superior extraction for fruits and vegetables",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10009",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GJ750 Wide Mouth Juicer",
        category:
          "Juicers & Blenders\r\n\t\t\t\t\t\tMultiple power settings for hard and soft food; superior extraction for fruits and vegetables",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10047",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCJ200 Citrus Slicer & Juicer",
        category:
          "Juicers & Blenders\r\n\t\t\t\t\t\tMultiple power settings for hard and soft food; superior extraction for fruits and vegetables",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10202",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "EPJ100 Citrus Press 10 Qt.",
        category:
          "Juicers & Blenders\r\n\t\t\t\t\t\tMultiple power settings for hard and soft food; superior extraction for fruits and vegetables",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10322",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GHB2360 Illuminating Hand Blender",
        category:
          "Juicers & Blenders\r\n\t\t\t\t\t\tMultiple power settings for hard and soft food; superior extraction for fruits and vegetables",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10071",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GBJ190 Immersion Blender",
        category:
          "Juicers & Blenders\r\n\t\t\t\t\t\tMultiple power settings for hard and soft food; superior extraction for fruits and vegetables",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10023",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPB250 Personal Blender",
        category:
          "Juicers & Blenders\r\n\t\t\t\t\t\tMultiple power settings for hard and soft food; superior extraction for fruits and vegetables",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10204",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GK220 Supreme Electric Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10229",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPK390 Electric Gooseneck Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10230",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPK510 Digital Gooseneck Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10231",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPK610 Digital Gooseneck Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10232",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPK720 Digital Gooseneck Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10234",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDK385 Multi Function Digital Tea Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10290",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDK368 Collapsible Travel Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10291",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GK348 Collapsible Travel Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10292",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GK338B Collapsible Travel Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10319",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GK378 Collapsible Travel Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10131",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTC8000 Tea & Coffee Brewer",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10039",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GK250 Electric Speed Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10091",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDK260 Digital Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10090",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDK240 Electric Glass Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10092",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDK290 Electric Glass Kettle - Tea Infuser",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10094",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDK340 Digital Glass Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10095",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDK350 Electric Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10106",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GK270 Electric Vintage Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10107",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GK360 Foldable Travel Electric Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10093",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GK320 Foldable Travel Electric Kettle",
        category: "Tea Machine & Kettles",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10111",
    label: "PRODUCT",
    userData: {
      data: { productName: "GMF215 Milk Frother", category: "Milk Frothers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10112",
    label: "PRODUCT",
    userData: {
      data: { productName: "GMF225 Milk Frother", category: "Milk Frothers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10114",
    label: "PRODUCT",
    userData: {
      data: { productName: "GMF245 Milk Frother", category: "Milk Frothers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10115",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMF255 Espresso Pot & Milk Frother",
        category: "Milk Frothers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10344",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPA2060 One-Lid Pressure Cooker + Air Fryer",
        category: "Multi Function Pressure Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10271",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPC655 Pressure Cooker 6 Qt",
        category: "Multi Function Pressure Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10272",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPC855 Pressure Cooker 8 Qt",
        category: "Multi Function Pressure Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10303",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPC419 SmartPot Pressure Cooker 4 Qt.",
        category: "Multi Function Pressure Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10044",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPC400 Pressure Cooker 4 Qt.",
        category: "Multi Function Pressure Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10233",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPC625 Pressure Cooker 6 Qt.",
        category: "Multi Function Pressure Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10022",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPC800 Pressure Cooker 8 Qt.",
        category: "Multi Function Pressure Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10024",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPC1000 Pressure Cooker 10 Qt.",
        category: "Multi Function Pressure Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10054",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPC1200 Pressure Cooker 12 Qt.",
        category: "Multi Function Pressure Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10063",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GPS650 Pressure Cooker & Smoker 6.5 Qt.",
        category: "Multi Function Pressure Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10108",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMC650 Multi Cooker & Sous Vide",
        category:
          "Sous Vides\r\n\t\t\t\t\t\tRival five star steakhouses in meat, poultry and sea food perfection",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10109",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMC680 Multi Cooker & Sous Vide",
        category:
          "Sous Vides\r\n\t\t\t\t\t\tRival five star steakhouses in meat, poultry and sea food perfection",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10129",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSV150 Sous Vide Pod - WiFi",
        category:
          "Sous Vides\r\n\t\t\t\t\t\tRival five star steakhouses in meat, poultry and sea food perfection",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10223",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSV138 Sous Vide Pod - Timer",
        category:
          "Sous Vides\r\n\t\t\t\t\t\tRival five star steakhouses in meat, poultry and sea food perfection",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10282",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSV115 Compact Sous Vide Pod",
        category:
          "Sous Vides\r\n\t\t\t\t\t\tRival five star steakhouses in meat, poultry and sea food perfection",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10005",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSV900 Sous Vide Oven",
        category:
          "Sous Vides\r\n\t\t\t\t\t\tRival five star steakhouses in meat, poultry and sea food perfection",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10046",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSV550 Sous Vide Oven",
        category:
          "Sous Vides\r\n\t\t\t\t\t\tRival five star steakhouses in meat, poultry and sea food perfection",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10067",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSV140 Sous Vide Pod",
        category:
          "Sous Vides\r\n\t\t\t\t\t\tRival five star steakhouses in meat, poultry and sea food perfection",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10021",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSV130 Sous Vide Pod",
        category:
          "Sous Vides\r\n\t\t\t\t\t\tRival five star steakhouses in meat, poultry and sea food perfection",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10132",
    label: "PRODUCT",
    userData: {
      data: { productName: "GVS415 Vacuum Sealer", category: "Vacuum Sealers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10133",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GVS425  Vacuum Sealer",
        category: "Vacuum Sealers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10134",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GVS435 Vacuum Sealer - Stainless Steel",
        category: "Vacuum Sealers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10135",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GVS445 Vertical Vacuum Sealer - Stainless Steel",
        category: "Vacuum Sealers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10237",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GVS455 Vacuum Sealer - Stainless Steel",
        category: "Vacuum Sealers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10076",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCG185 Coffee Grinder",
        category: "Coffee Grinders",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10273",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCG168 Coffee Grinder",
        category: "Coffee Grinders",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10293",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCG205 Digital Conical Burr Grinder",
        category: "Coffee Grinders",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10072",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GBM3100 Bread Maker",
        category: "Bread & Cake Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10073",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GBM3400 Flatbread Maker",
        category: "Bread & Cake Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10079",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM3150 Cake Maker",
        category: "Bread & Cake Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10100",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GES580 Electric Spiralizer",
        category: "Electric Spiralizers & Dicers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10236",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GES335 Electric Spiralizer",
        category: "Electric Spiralizers & Dicers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10101",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFD1550 5 Tray Food Dehydrator",
        category: "Food Dehydrators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10102",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFD1750 10 Tray Food Dehydrator",
        category: "Food Dehydrators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10103",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFD1850 10 Tray Food Dehydrator",
        category: "Food Dehydrators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10104",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFD1950 9 Tray Food Dehydrator",
        category: "Food Dehydrators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10251",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFD1650B 6 Tray Food Dehydrator",
        category: "Food Dehydrators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10278",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFD1758 Digital 10 Tray Food Dehydrator",
        category: "Food Dehydrators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10279",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFD1680 Digital 6 Tray Food Dehydrator",
        category: "Food Dehydrators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10280",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFD1858 Digital 10 Tray Food Dehydrator",
        category: "Food Dehydrators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10030",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMC700 8-in-1 AnyCooker",
        category: "Multi Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10048",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCR1700 Robotic Cooker",
        category: "Multi Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10110",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMC780 18-in-1 AnyCooker",
        category: "Multi Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10074",
    label: "PRODUCT",
    userData: {
      data: { productName: "GBQ330 Smokeless Grill", category: "Grills" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10089",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDG1900 10-in-1 Foldable Grill",
        category: "Grills",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10097",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GEG1400 Electric Raclette Grill",
        category: "Grills",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10098",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GEG1800 Electric Grill & Griddle",
        category: "Grills",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10099",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GEO3000 Rotisserie Oven & Grill",
        category: "Grills",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10105",
    label: "PRODUCT",
    userData: {
      data: { productName: "GHG1600 Halo Grill", category: "Grills" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10337",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFS2655 Smokeless Electric Indoor Grill",
        category: "Grills",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10045",
    label: "PRODUCT",
    userData: {
      data: { productName: "GPM500 Pasta Maker", category: "Pasta Makers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10121",
    label: "PRODUCT",
    userData: {
      data: { productName: "GPM630 Pasta Maker", category: "Pasta Makers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10136",
    label: "PRODUCT",
    userData: {
      data: { productName: "GWM420 Waffle Maker", category: "Waffle Makers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10137",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GWM440 Waffle Maker - LCD Display",
        category: "Waffle Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10138",
    label: "PRODUCT",
    userData: {
      data: { productName: "GWM460 Waffle Maker", category: "Waffle Makers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10255",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GWM490 Double Waffle Maker",
        category: "Waffle Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10341",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GWM468 Dual Pour Waffle Maker",
        category: "Waffle Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10345",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "Gourmia GWM448 Rotating Waffle",
        category: "Waffle Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10141",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GYM1610 7 Jar Yogurt Maker",
        category: "Yogurt Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10142",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GYM1620 Digital 7 Jar Yogurt Maker",
        category: "Yogurt Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10143",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GYM1710 12 Jar Yogurt Maker",
        category: "Yogurt Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10144",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GYM1720 Digital 12 Jar Yogurt Maker",
        category: "Yogurt Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10055",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "DCP860 SlowSmart Slow Cooker 8.5 Qt.",
        category: "Slow Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10226",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GRC670 TenderRender Rice Cooker 8C",
        category: "Slow Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10227",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GRC770 TenderRender Rice Cooker 12C",
        category: "Slow Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10228",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GRC870 TenderRender Rice Cooker 20C",
        category: "Slow Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10286",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GRC970 11-in-1 Digital Rice Cooker",
        category: "Slow Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10010",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDF300 FryStation 3L",
        category:
          "Deep Fryers\r\n\t\t\t\t\t\tIndulge your senses! It�s time for show stopping fried goodies with Gourmia�s FryStations",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10011",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDF500 FryStation 4.2L",
        category:
          "Deep Fryers\r\n\t\t\t\t\t\tIndulge your senses! It�s time for show stopping fried goodies with Gourmia�s FryStations",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10012",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDF450 FryStation 4.2L",
        category:
          "Deep Fryers\r\n\t\t\t\t\t\tIndulge your senses! It�s time for show stopping fried goodies with Gourmia�s FryStations",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10088",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDF475 FryStation 4.2L",
        category:
          "Deep Fryers\r\n\t\t\t\t\t\tIndulge your senses! It�s time for show stopping fried goodies with Gourmia�s FryStations",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10028",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GIC100 Induction Cooker",
        category: "Induction Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10049",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GIC200 Induction Cooker",
        category: "Induction Cookers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10117",
    label: "PRODUCT",
    userData: {
      data: { productName: "GMG525 Meat Grinder", category: "Meat Grinders" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10118",
    label: "PRODUCT",
    userData: {
      data: { productName: "GMG7100 Meat Grinder", category: "Meat Grinders" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10119",
    label: "PRODUCT",
    userData: {
      data: { productName: "GMG7500 Meat Grinder", category: "Meat Grinders" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10034",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFS700 Power Slicer 7.5'' Blade",
        category:
          "Meat Slicers\r\n\t\t\t\t\t\tIt's a simple way to slice your own meats, cheeses breads, vegetables and fruit quickly and easily at home",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10051",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFS900 Power Slicer 9'' Blade",
        category:
          "Meat Slicers\r\n\t\t\t\t\t\tIt's a simple way to slice your own meats, cheeses breads, vegetables and fruit quickly and easily at home",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10139",
    label: "PRODUCT",
    userData: {
      data: { productName: "GWT230 Windowed Toaster", category: "Toasters" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10140",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GWT430 Wide Mouth Windowed Toaster",
        category: "Toasters",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10306",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDT2445 Multi-Function Digital Toaster",
        category: "Toasters",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10307",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GDT2650 Multi-Function Digital Toaster",
        category: "Toasters",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10122",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSI170 Ice Cream Maker - Timer",
        category:
          "Ice Cream Makers\r\n\t\t\t\t\t\tIndustrial quality system for premium food grade ice. Produce approx 30 lbs of ice a day",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10123",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSI180 Sorbet Maker",
        category:
          "Ice Cream Makers\r\n\t\t\t\t\t\tIndustrial quality system for premium food grade ice. Produce approx 30 lbs of ice a day",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10125",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSI480 Ice Cream Maker",
        category:
          "Ice Cream Makers\r\n\t\t\t\t\t\tIndustrial quality system for premium food grade ice. Produce approx 30 lbs of ice a day",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10008",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GI500 Ice Maker",
        category:
          "Ice Makers\r\n\t\t\t\t\t\tFrom multi cookers to robotic cookers, slow cookers, pressure cookers and much more",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10015",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GFS300 Food Steamer",
        category:
          "Specialty Products\r\n\t\t\t\t\t\tYou'll enjoy crispy, golden crusts and perfectly cooked toppings-every time.",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10066",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GST210B Automatic Stirrer",
        category:
          "Specialty Products\r\n\t\t\t\t\t\tYou'll enjoy crispy, golden crusts and perfectly cooked toppings-every time.",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10128",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSM160 Infusion Smoker",
        category:
          "Specialty Products\r\n\t\t\t\t\t\tYou'll enjoy crispy, golden crusts and perfectly cooked toppings-every time.",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10205",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "S2000 Convection Oven",
        category:
          "Specialty Products\r\n\t\t\t\t\t\tYou'll enjoy crispy, golden crusts and perfectly cooked toppings-every time.",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10254",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSM220 Infusion Smoker",
        category:
          "Specialty Products\r\n\t\t\t\t\t\tYou'll enjoy crispy, golden crusts and perfectly cooked toppings-every time.",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10070",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "EP700 Stand Mixer 7 Qt.",
        category:
          "Stand/Hand Mixers & Food Processors\r\n\t\t\t\t\t\tArtisan Kitchen Mixer 7Quart",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10200",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "EP600 Stand Mixer 6 Qt.",
        category:
          "Stand/Hand Mixers & Food Processors\r\n\t\t\t\t\t\tArtisan Kitchen Mixer 7Quart",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10321",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GHM2530 Illuminating Hand Mixer",
        category:
          "Stand/Hand Mixers & Food Processors\r\n\t\t\t\t\t\tArtisan Kitchen Mixer 7Quart",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10059",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMF600 Mini Fridge 6 Can",
        category: "Mini Refrigerators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10060",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMF900 Mini Fridge 9 Can",
        category: "Mini Refrigerators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10061",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMF1200 Mini Fridge 12 Can",
        category: "Mini Refrigerators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10252",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMF660 Pepsi Mini Fridge 6 Can",
        category: "Mini Refrigerators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10283",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMF668BL Speaker Mini Fridge 6 Can",
        category: "Mini Refrigerators",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10219",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GBF370 4-in-1 Breakfast Station",
        category: "Breakfast Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10220",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GBF470 3-in-1 Breakfast Station",
        category: "Breakfast Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10224",
    label: "PRODUCT",
    userData: {
      data: { productName: "GEC175 Egg Cooker", category: "Breakfast Makers" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10225",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GEC275 2 Tier Egg Cooker",
        category: "Breakfast Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10146",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GKS9110 Glass Kitchen Scale",
        category: "Gadgets - Kitchen Scales",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10165",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GKS9160 Folding Kitchen Scale",
        category: "Gadgets - Kitchen Scales",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10166",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GKS9165 Folding Kitchen Scale",
        category: "Gadgets - Kitchen Scales",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10174",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GKS9115 Digital Kitchen Scale",
        category: "Gadgets - Kitchen Scales",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10175",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GKS9120 Spoon Scale & Thermometer",
        category: "Gadgets - Kitchen Scales",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10176",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GKS9125 Digital Spoon Scales",
        category: "Gadgets - Kitchen Scales",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10177",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GKS9140L Cutting Board Scale Bamboo",
        category: "Gadgets - Kitchen Scales",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10179",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GKS9130 Electronic Kitchen Scale",
        category: "Gadgets - Kitchen Scales",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10196",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTH9150 Dual Meat Thermometer",
        category: "Gadgets - Thermometers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10197",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTH9170 Digital Fork Thermometer",
        category: "Gadgets - Thermometers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10198",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTH9175 Digital Spatula Thermometer",
        category: "Gadgets - Thermometers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10156",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCH9295  Chopper & Blender",
        category: "Gadgets - Fruit & Vegetable Slicers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10157",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCH9290 Chopper & Grater",
        category: "Gadgets - Fruit & Vegetable Slicers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10159",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMS9105 Stainless Steel Mandoline Slicer",
        category: "Gadgets - Fruit & Vegetable Slicers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10160",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMS9220 5-in-1 Mandolin Slicer",
        category: "Gadgets - Fruit & Vegetable Slicers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10161",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMS9225 5-in-1 Mandolin Slicer",
        category: "Gadgets - Fruit & Vegetable Slicers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10173",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMS9255 Mandoline Slicer & Cutting Board",
        category: "Gadgets - Fruit & Vegetable Slicers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10184",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCU9245 French Fry Cutter",
        category: "Gadgets - Fruit & Vegetable Slicers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10245",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMS9625 Mandolin Slicer and Dicer",
        category: "Gadgets - Fruit & Vegetable Slicers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10167",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMS9100 Salad Spinner",
        category: "Gadgets - Salad Spinners",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10149",
    label: "PRODUCT",
    userData: {
      data: { productName: "GPA9525 Blini Pan", category: "Gadgets - Pans" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10150",
    label: "PRODUCT",
    userData: {
      data: { productName: "GPA9520 Blini Pan", category: "Gadgets - Pans" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10151",
    label: "PRODUCT",
    userData: {
      data: { productName: "GPA9510 Blini Pan", category: "Gadgets - Pans" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10152",
    label: "PRODUCT",
    userData: {
      data: { productName: "GPA9515 Blini Pan", category: "Gadgets - Pans" },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10148",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSH9720 Knife Sharpener",
        category: "Gadgets - Knife Sharpeners",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10182",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSH9710 Knife Sharpener",
        category: "Gadgets - Knife Sharpeners",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10170",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCU9260 Garlic Peeler & Crusher",
        category: "Gadgets - Garlic Crushers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10169",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAP9820 Thermal Hot & Cold Carafe",
        category: "Gadgets - Coffee & Tea",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10181",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTP9815 Glass Coffee & Tea Maker",
        category: "Gadgets - Coffee & Tea",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10185",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM9825 Cold Brew Coffee Maker",
        category: "Gadgets - Coffee & Tea",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10186",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTP9810 Glass Tea Pot & Infuser",
        category: "Gadgets - Coffee & Tea",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10187",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCG9310 Manual Coffee Grinder",
        category: "Gadgets - Coffee & Tea",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10189",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM9830 French Press Coffee Set",
        category: "Gadgets - Coffee & Tea",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10190",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM9835 French Press Coffee Set 5 Piece",
        category: "Gadgets - Coffee & Tea",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10191",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM9840 French Press Coffee Set",
        category: "Gadgets - Coffee & Tea",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10192",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM9845 French Press Coffee Set 5 Piece",
        category: "Gadgets - Coffee & Tea",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10158",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GIC9610 Ice Cream Maker",
        category: "Gadgets - Ice Cream Makers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10193",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GGL9910 Culinary Torch",
        category: "Gadgets - Culinary Torch",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10295",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GEB9925 Manual Egg Beater",
        category: "Gadgets - Mixers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10308",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GVD9990 Oil and Vinegar Dispenser Set",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10309",
    label: "PRODUCT",
    userData: {
      data: {
        productName:
          "GPM9980 � Pasta Maker, Roller and Cutter - Manual Hand Crank",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10310",
    label: "PRODUCT",
    userData: {
      data: {
        productName:
          "GTH9185 Digital Spatula Thermometer Cooking & Candy Temperature Reader & Stirrer in One",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10311",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GML9930D Collapsible Microwave Cover",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10312",
    label: "PRODUCT",
    userData: {
      data: {
        productName:
          "GCU9265 Egg Slicer & Wedger Features Stainless Steel Blades",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10313",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GSS9615 Foldable 5 Blade Spiralizer Vegetable Slicer",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10314",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMS9280 Mini Slicer Pull String Manual Food Processor",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10315",
    label: "PRODUCT",
    userData: {
      data: {
        productName:
          "Collapsible Pot � Stainless Steel, Silicone and Glass Lid",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10316",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCM9850 Cold Brew Coffee Maker",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10317",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GCC9630 Cherry Pitter and Corer",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10359",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMJ9970 Large Citrus Juicer Press",
        category: "Gadgets - New",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10269",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF678 Digital Free Fry Air Fryer Oven",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10266",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF645 Digital Free Fry Air Fryer 6 Qt",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10216",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF570 Air Fryer 4.5 Qt",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10212",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF365 Air Fryer 2.2 Qt.",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10217",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF560 Air Fryer 5 Qt.",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10318",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF428 Free Fry Air Fryer 4.5",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10020",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF400 Air Fryer 4.5 Qt",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10211",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF355 Air Fryer 2.2 Qt",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10130",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTA2800 Turbo CookCenter - Wifi",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10116",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GMF2600 Rotisserie Multi Fryer",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10006",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTA2500 Turbo CookCenter",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10016",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTA1500 Turbo CookCenter",
        category: "Archived Air Fryers",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10366",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7950MEX Digital Air Fryer Oven",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10367",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF588 5-Quart Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10373",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7660MEX Digital Air Fryer Oven",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10374",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GTF7660CA Digital Air Fryer Oven",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10377",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF966 CA 9-Qt Dual Basket Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10378",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF966 EU 9-Qt Dual Basket Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10383",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF652 CA 6-Qt Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10389",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF486 CA 4-Qt Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10390",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF486 MEX 4-Qt Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10391",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF652 MEX 6-Qt Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10392",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF826 CA 8-Qt Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10394",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF1220 CA 14-Quart Digital Air Fryer Oven",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10395",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF1220 MX 14-Quart Digital Air Fryer Oven",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10397",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GGA2150 Indoor Grill & Air Fryer with Probe",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10402",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF798 UK 7-Qt Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10403",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF798 EU 7-Qt Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10412",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF849 Digital Window Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10415",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF692 6-Qt Digital Air Fryer",
        category: "International",
      },
    },
  },
  {
    url: "https://www.gourmia.com/item.asp?item=10416",
    label: "PRODUCT",
    userData: {
      data: {
        productName: "GAF799 7-QT Digital Window Air Fryer",
        category: "International",
      },
    },
  },
];

// await serializer.dump({ arr1: arr });
await serializer.dump({ arr2: arr }, { append: true });

// const products1 = await serializer.load("arr1");
const products2 = await serializer.load("arr2", { append: true });

// console.log(products1);
console.log(products2.length);
