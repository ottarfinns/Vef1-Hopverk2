/* const API_URL = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/'; */

export async function getSixProd() {
  const urlLim =
    'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=6';

  let res;
  try {
    res = await fetch(urlLim);
  } catch (e) {
    console.error('Villa við að sækja products gögn fyrir forsíðu');
    return null;
  }

  if (!res.ok) {
    console.error(
      'Villa við að sækja products gögn, ekki 200 staða',
      res.status,
      res.statusText
    );
    return null;
  }

  let sixProd;
  try {
    sixProd = await res.json();
  } catch (e) {
    console.error('Villa við að vinna úr JSON fyrir sixProd');
    return null;
  }

  return sixProd.items;
}
