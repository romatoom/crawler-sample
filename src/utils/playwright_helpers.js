// elements: locator("select > option").all()
export async function getSelectOptions(elements) {
  const result = [];
  const values = [];

  for (const elem of elements) {
    const value = await elem.getAttribute("value");
    if (!value || value === "" || values.includes(value)) continue;

    const title = (await elem.textContent()).trim().replace(/  +/g, " ");

    result.push({ value, title });
    values.push(value);
  }

  return result;
}
