import Link from "next/link";

export default function ProductListPage() {
  return (
    <div>
      <div>Product List Page</div>

      <ul>
        <li>
          <Link href={"/product/view/1"}>1번 상품</Link>
        </li>
        <li>
          <Link href={"/product/view/2"}>2번 상품</Link>
        </li>
      </ul>
    </div>
  );
}
