"use client";

import { deleteProduct, putProduct } from "@/actions/productActions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

interface ProductDTO {
  pno: number;
  pname: string;
  price: number;
  writer: string;
  sale: boolean;
  fileNames: string[];
  createdDate: string; // or Date
}

export default function ProductEditComponent({
  product,
  from,
}: {
  product: ProductDTO;
  from: string;
}) {
  const [putState, putAction, putPending] = useActionState(putProduct, {
    message: "",
    result: "",
  });
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteProduct,
    { message: "", result: "" }
  );

  const { pno, pname, price, fileNames, writer, sale } = product;

  const router = useRouter();

  const [oldFiles, setOldFiles] = useState(fileNames);

  const handleImageDelete = (targetFileName: string) => {
    console.log("handleImageDelete", oldFiles, targetFileName);

    const result = oldFiles.filter((fname) => targetFileName !== fname);

    console.log("-=-----------------");
    console.log(result);

    setOldFiles(() => result);
  };

  useEffect(() => {
    console.log("putState", putState);

    if (putState.result === "success") {
      router.push(`/product/view/${pno}`);
      return;
    }

    if (deleteState.result === "success") {
      router.push(`/product/query`);
    }
  }, [putPending, deletePending, putState, deleteState]);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">제품 수정</h2>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <form action={putAction} className="space-y-6">
          {/* 상품 번호는 수정 불가능하도록 표시 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PNO:
            </label>
            <input
              type="text"
              name="pno"
              defaultValue={pno}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
            />
          </div>
          {/* 상품명 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PNAME:
            </label>
            <input
              type="text"
              name="pname"
              defaultValue={pname}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* 가격 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PRICE:
            </label>
            <input
              type="number"
              name="price"
              defaultValue={price}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* 작성자 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              WRITER:
            </label>
            <input
              type="text"
              name="writer"
              defaultValue={writer}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Sale Status */}
          <div>
            <label
              htmlFor="sale"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sale
            </label>
            <div className="relative">
              <select
                id="sale"
                name="sale"
                defaultValue={product.sale ? "true" : "false"}
                className="appearance-none block w-full px-4 text-sm font-medium py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg bg-white transition duration-150 ease-in-out"
              >
                <option value="true">ON</option>
                <option value="false">OFF</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          {/* 파일 업로드 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Files:
            </label>
            <input
              type="file"
              name="files"
              multiple
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {/* 기존 이미지 목록 */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              기존 이미지
            </h3>
            <ul className="flex flex-wrap gap-4">
              {oldFiles.map((fileName) => (
                <li key={fileName} className="relative w-32 h-32">
                  <Image
                    src={`http://localhost:8080/${fileName}`}
                    alt={product.pname}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-md"
                    sizes="33vw"
                  />
                  {/* 이미지 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={() => handleImageDelete(fileName)}
                    className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center hover:bg-red-700 transition-colors z-10"
                  >
                    X
                  </button>
                  <input type="hidden" name="fileNames" value={fileName} />
                </li>
              ))}
            </ul>
          </div>
          {/* 수정 버튼 */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              수정
            </button>
          </div>
        </form>

        <form action={deleteAction} className="mt-4">
          <input type="hidden" name="pno" value={pno}></input>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition-colors duration-200"
          >
            삭제
          </button>
        </form>
      </div>
    </div>
  );
}
