import ProductQueryListComponent from "@/components/product/productQueryListComponent";
import ProductSearchForm from "@/components/product/productSearchForm";

type PageParams = { [key: string]: string };
type SearchParams = { [key: string]: string };

type PageProps = {
  params: Promise<PageParams>; // Next.js 15: Promise
  searchParams: Promise<SearchParams>; // Next.js 15: Promise
};

export default async function ProductQueryPage({
  params,
  searchParams,
}: PageProps) {
  const query = await searchParams;
  const page = query.page ?? "1";
  const size = query.size ?? "4";
  const sort = query.sort ?? "";
  const keyword = query.keyword ?? "";

  const condition = new URLSearchParams();
  condition.append("page", page);
  condition.append("size", size);
  if (sort) {
    condition.append("sort", sort);
  }
  if (keyword) {
    condition.append("keyword", keyword);
  }

  const res = await fetch(
    `http://localhost:8080/api/products/list?${condition.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const result = await res.json();

  console.log(result);
  return (
    <div>
      <ProductSearchForm />
      <ProductQueryListComponent
        list={result.list}
        total={result.total}
        requestParam={result.pageRequestDTO}
      />
    </div>
  );
}
