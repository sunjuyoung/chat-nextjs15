import ProductCatalogComponent from "@/components/product/productCatalogComponent";

type PageProps = {
  params: Promise<{
    page: string;
  }>;
  searchParams: Promise<{}>;
};

export async function generateStaticParams() {
  //한 페이지당 4개씩 카탈로그 만들기
  const res = await fetch(
    `http://localhost:8080/api/products/countCatalog?size=4`
  );

  const pageCount = await res.json();

  // [{page:'1'}, {page:'2'}...]와 같은 형태로 반환해야 함
  const arr = []; // 빈 배열 초기화
  for (let i = 1; i <= pageCount; i++) {
    arr.push({ page: String(i) }); // 배열에 i 값을 추가
  }
  //수동으로 만들어도 됨
  //const arr = [ {page:'1'}, {page:'2'}, {page:'3'}, {page:'4'}, {page:'5'}, {page:'6'}, {page:'7'}, {page:'8'}, {page:'9'}, {page:'10'} ]

  return arr;
}

export default async function ProductCatalogPage({
  params,
  searchParams,
}: PageProps) {
  const param = await params;

  const pageStr = param.page || "1";
  const sizeStr = "4";

  const res = await fetch(
    `http://localhost:8080/api/products/list?page=${pageStr}&size=${sizeStr}`,
    { next: { revalidate: 60 * 60 * 24 } }
  );

  const result = await res.json();

  console.log(result);

  const { list: products, total, pageRequestDTO } = result;

  return (
    <div>
      <div>Product Catalog Page {pageStr}</div>

      <ProductCatalogComponent
        total={total}
        products={products}
        current={pageRequestDTO.page}
        size={pageRequestDTO.size}
      ></ProductCatalogComponent>
    </div>
  );
}
