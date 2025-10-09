import ProductEditComponent from "@/components/product/productEditComponent";

type PageParams = { [key: string]: string };
type SearchParams = { [key: string]: string };

type PageProps = {
  params: Promise<PageParams>; // Next.js 15: Promise
  searchParams: Promise<SearchParams>; // Next.js 15: Promise
};

export default async function ProductEditPage({
  params,
  searchParams,
}: PageProps) {
  const parma = await params;
  const query = await searchParams;
  const pno = parma.pno;

  const from = query.from
    ? decodeURIComponent(query.from)
    : "/product/catalog/1";

  const res = await fetch(`http://localhost:8080/api/products/${pno}`, {
    method: "GET",
    cache: "no-store",
  });

  const product = await res.json();

  return (
    <div>
      <div> Product Edit Page </div>
      <ProductEditComponent
        product={product}
        from={from}
      ></ProductEditComponent>
    </div>
  );
}
