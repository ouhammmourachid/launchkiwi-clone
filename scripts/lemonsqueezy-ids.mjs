/**
 * Prints the Lemon Squeezy store and variant ids to paste into pb/.env.
 * Run with: npm run lemonsqueezy:ids   (needs LEMONSQUEEZY_API_KEY in pb/.env)
 *
 * Products are matched to plans by name: a product called "Premium" becomes
 * LEMONSQUEEZY_VARIANT_PREMIUM, "Priority" becomes LEMONSQUEEZY_VARIANT_PRIORITY.
 */

const key = process.env.LEMONSQUEEZY_API_KEY;
if (!key) {
  console.error("LEMONSQUEEZY_API_KEY is not set in pb/.env");
  process.exit(1);
}

async function get(path) {
  const res = await fetch(`https://api.lemonsqueezy.com/v1${path}`, {
    headers: { Accept: "application/vnd.api+json", Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status} ${await res.text()}`);
  return (await res.json()).data;
}

const stores = await get("/stores");
for (const store of stores) {
  console.log(`\n# Store: ${store.attributes.name} (${store.attributes.url})`);
  console.log(`LEMONSQUEEZY_STORE_ID=${store.id}`);

  const products = await get(`/products?filter[store_id]=${store.id}`);
  for (const product of products) {
    const variants = await get(`/variants?filter[product_id]=${product.id}`);
    // A product without extra variants still has one "Default" variant.
    const variant = variants.find((v) => v.attributes.status !== "pending") ?? variants[0];
    const slug = product.attributes.name.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
    const price = variant ? `${(variant.attributes.price / 100).toFixed(2)}` : "?";
    console.log(`# ${product.attributes.name} — ${price} (${product.attributes.status}, ${variants.length} variant(s))`);
    if (variant) console.log(`LEMONSQUEEZY_VARIANT_${slug}=${variant.id}`);
  }
}
