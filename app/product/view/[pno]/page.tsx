import ProductViewComponent from "@/components/product/productViewComponent";

type PageParams = { [key: string]: string };
type SearchParams = { [key: string]: string };

type PageProps = {
  params: Promise<PageParams>; // Next.js 15: Promise
  searchParams: Promise<SearchParams>; // Next.js 15: Promise
};

export async function generateStaticParams() {
  //최신 상품 번호 10개를 가져오는 기능
  const res = await fetch(`http://localhost:8080/api/products/event?count=10`);

  const pnos: [{ pno: Number }] = await res.json();

  // [{pno:'1'}, {pno:'2'}...]와 같은 형태로 반환해야 함

  return pnos.map((pno) => ({ pno: String(pno) }));
}

export default async function ProductViewPage({
  params,
  searchParams,
}: PageProps) {
  const parma = await params;
  const query = await searchParams;
  const pno = parma.pno;

  const res = await fetch(`http://localhost:8080/api/products/${pno}`, {
    next: { revalidate: 120 },
  });
  const product = await res.json();

  const from = query.from
    ? decodeURIComponent(query.from)
    : "/product/catalog/1";

  return (
    <div>
      <div> Product View Page </div>

      <ProductViewComponent
        product={product}
        from={from}
      ></ProductViewComponent>
    </div>
  );
}
