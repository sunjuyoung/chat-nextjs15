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

interface Props {
  products: ProductListDTO[];
  total: number;
  current: number;
  size: number;
}

export default function ProductCatalogComponent({
  products,
  total,
  current,
  size,
}: Props) {
  if (!products || products.length === 0) {
    throw new Error("No Products in this page");
  }

  const lastPage = Math.ceil(total / size);
  const prev = current !== 1;
  const next = current < lastPage;

  const from = encodeURIComponent(`/product/catalog/${current}`);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product.pno}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Link
              href={`/product/view/${product.pno}?from=${from}`}
              className="flex flex-col items-center p-4"
            >
              {/* 이미지 영역: 1:1 비율 유지 */}
              <div className="relative w-full h-0 pt-[100%] mb-4 rounded-md overflow-hidden">
                <Image
                  src={`http://localhost:8080/s_${product.fileName}`}
                  alt={product.pname}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  priority={true}
                  className="rounded-md"
                />
              </div>
              {/* 상품 정보 */}
              <div className="text-center w-full">
                <h3 className="text-lg font-semibold truncate text-gray-900">
                  {product.pname}
                </h3>
                <div className="text-sm text-gray-500">PNO: {product.pno}</div>
                <div className="text-2xl font-bold text-blue-600 mt-2">
                  ₩{product.price.toLocaleString()}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10 space-x-4">
        {prev && (
          <Link
            href={`/product/catalog/${current - 1}`}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200 shadow-sm"
          >
            이전
          </Link>
        )}

        {next && (
          <Link
            href={`/product/catalog/${current + 1}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            다음
          </Link>
        )}
      </div>
    </div>
  );
}
