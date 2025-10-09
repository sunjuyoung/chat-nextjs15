import Link from "next/link";
import ProductImageGallery from "./ProductImageGallery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddCartButton from "./view/addCartButton";

interface ProductDTO {
  pno: number;
  pname: string;
  price: number;
  writer: string;
  sale: boolean;
  fileNames: string[];
  createdDate: string; // or Date
}

export default async function ProductViewComponent({
  product,
  from,
}: {
  product: ProductDTO;
  from: string;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      {/* 상품 정보 컨테이너 */}
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl md:flex md:space-x-8">
        {/* 상품 이미지 영역 (왼쪽) */}
        <div className="md:w-1/2">
          <ProductImageGallery
            fileNames={product.fileNames}
            productName={product.pname}
          />
        </div>
        {/* 상품 상세 정보 영역 (오른쪽) */}
        <div className="md:w-1/2 mt-6 md:mt-0 space-y-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {product.pname}
          </h1>
          <p className="text-2xl font-bold text-blue-600">
            ₩{product.price.toLocaleString()}
          </p>

          <div className="border-t border-b border-gray-200 py-4">
            <p className="text-lg text-gray-700">
              작성자: <span className="font-semibold">{product.writer}</span>
            </p>
            <p className="text-sm text-gray-500">
              등록일: {product.createdDate}
            </p>
          </div>

          <p className="text-base text-gray-800">
            이 상품은 {product.pname}입니다. 고급 재료를 사용하여 정성껏
            만들었으며, 뛰어난 품질을 자랑합니다.
          </p>

          <div className="pt-4">
            <AddCartButton pno={product.pno} />
          </div>
          <div className="pt-4">
            {session?.user?.email === product.writer && (
              <button className="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
                <Link
                  href={`/product/edit/${product.pno}?from=${encodeURIComponent(
                    from
                  )}`}
                >
                  수정하기
                </Link>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* 이전 화면 버튼 */}
      <div className="mt-8">
        <Link href={from}>
          <button className="px-8 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-200">
            이전 화면으로
          </button>
        </Link>
      </div>
    </div>
  );
}
