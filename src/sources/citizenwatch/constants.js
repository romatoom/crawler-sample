function getProductsOfCollectionURL(collection_name) {
  return `https://www.citizenwatch.com/on/demandware.store/Sites-citizen_US-Site/en_US/Search-UpdateGrid?cgid=${collection_name}&start=0&sz=1000`;
}

const CITIZENWATCH = {
  KEY: "CITIZENWATCH",

  BRAND: "Citizen",

  ORIGINAL_NAME: "citizenwatch",
  BASE_URL: "https://www.citizenwatch.com",

  LABELS: {
    COLLECTION: "COLLECTION",
    PRODUCT: "PRODUCT",
  },

  COLLECTIONS: [
    {
      name: "Men’s",
      url: getProductsOfCollectionURL("mens"),
    },
    {
      name: "Women’s",
      url: getProductsOfCollectionURL("womens"),
    },
  ],
};

export default CITIZENWATCH;
