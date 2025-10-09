import AccountModifyComponent from "@/components/account/accountModifyComponent";

//여기에 데이터를 받아서 컴포넌트에 props전달 해도 됨

export default async function AccountModifyPage() {
  return (
    <div>
      <div> Account Modify Page</div>

      <AccountModifyComponent />
    </div>
  );
}
