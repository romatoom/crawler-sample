import axios from "axios";

export async function getProduct(slug) {
  const url = `https://levoit.com/products/${slug}.js`;
  const response = await axios.get(url);

  return response.data;
}
