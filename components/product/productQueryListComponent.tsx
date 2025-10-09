import Image from "next/image";
import Link from "next/link";

interface ProductListDTO {
  pno: number;
  pname: string;
  price: number;
  writer: string;
  sale: boolean;
  fileName: string;
}

interface RequestParamDTO {
  page: number;
  size: number;
  sort: string | undefined;
  keyword: string | undefined;
}

interface Props {
  list: ProductListDTO[];
  total: number;
  requestParam: RequestParamDTO;
}

export default function ProductQueryListComponent({
  list,
  total,
  requestParam,
}: Props) {
  const page = requestParam.page;
  const size = requestParam.size;
  const sort = requestParam.sort;
  const keyword = requestParam.keyword;

  console.log(page, size, sort, keyword);

  const queryObj = new URLSearchParams();
  queryObj.set("page", String(page));
  queryObj.set("size", String(size));

  if (sort) {
    queryObj.set("sort", sort);
  }
  if (keyword) {
    queryObj.set("keyword", keyword);
  }

  const from = encodeURIComponent(`/product/query?${queryObj.toString()}`);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Product Query List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {list.map((product) => (
          <div
            key={product.pno}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <Link
              href={`/product/view/${product.pno}?from=${from}`}
              className="block"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={`http://localhost:8080/s_${product.fileName}`}
                  alt={product.pname}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.pname}
                </h3>
                <p className="text-xl font-bold text-blue-600 mt-2">
                  ₩{product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
