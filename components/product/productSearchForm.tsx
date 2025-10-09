"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductSearchForm() {
  const searchParams = useSearchParams(); // client component에서 사용, page 부모에서 props로 전달 받을 수 도 있음
  const router = useRouter();

  //URL에서 초기 값 가져오기
  const currentPage = searchParams.get("page") || "1";
  const currentKeyword = searchParams.get("keyword") || "";
  const currentSort = searchParams.get("sort") || "b";
  const currentSize = searchParams.get("size") || "10"; // 기본값 10개

  const [keyword, setKeyword] = useState(currentKeyword);
  const [sort, setSort] = useState(currentSort);
  const [size, setSize] = useState(currentSize); // size 상태 추가

  const handleClickSearchButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const queryObj = new URLSearchParams({ page: "1", size: size }); //검색 을 했으니 page값은 1로 해줘야함

    if (sort) {
      queryObj.append("sort", sort);
    }
    if (keyword) {
      queryObj.append("keyword", keyword);
    }

    router.push(`/product/query?${queryObj.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-4 bg-gray-50 rounded-lg shadow-md space-y-4 md:space-y-0 md:space-x-4">
      {/* Dropdowns */}
      <div className="flex space-x-2 w-full md:w-auto">
        {/* Size Dropdown */}
        <select
          name="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="form-select block w-full md:w-auto px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        >
          <option value="10">10개 보기</option>
          <option value="20">20개 보기</option>
          <option value="50">50개 보기</option>
        </select>
        {/* Sort Dropdown */}
        <select
          name="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="form-select block w-full md:w-auto px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        >
          <option value="b">기본순</option>
          <option value="d">출시순</option>
          <option value="ph">높은 가격순</option>
          <option value="pl">낮은 가격순</option>
        </select>
      </div>

      {/* Keyword Search Input & Button */}
      <div className="flex w-full md:w-1/2">
        <input
          type="text"
          name="keyword"
          placeholder="상품명 검색..."
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          className="flex-grow px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        />
        <button
          type="button"
          onClick={handleClickSearchButton}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-r-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          검색
        </button>
      </div>
    </div>
  );
}
