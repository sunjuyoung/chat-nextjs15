"use server";

import { revalidatePath } from "next/cache";

const API_SERVER_HOST = process.env.API_SERVER_HOST || "http://localhost:8080";

export const postProduct = async (prevState: any, formData: FormData) => {
  console.log("postProduct called with formData:", prevState);

  const pname = formData.get("pname") as string;
  const price = formData.get("price") as string;
  const writer = formData.get("writer") as string;

  const updatedFormData = new FormData();

  updatedFormData.append("pname", pname);
  updatedFormData.append("price", price);
  updatedFormData.append("writer", writer);
  updatedFormData.append("sale", "true");

  const files: File[] = formData
    .getAll("files")
    .filter((value) => value instanceof File) as File[];
  if (files.length > 0) {
    files.forEach((file) => {
      console.log("----------------------------------", file);
      if (file && file.size > 0) {
        updatedFormData.append("files", file);
      }
    });
  }
  const response = await fetch(`${API_SERVER_HOST}/api/products`, {
    method: "POST",
    body: updatedFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  // 상품 등록 후 해당 카탈로그 페이지 무효화
  revalidatePath("/product/catalog/1");

  return { message: "Product created successfully", result: "success" };
};

export const putProduct = async (prevState: any, formData: FormData) => {
  console.log("putProduct called");

  const pno = formData.get("pno");

  const updatedFormData = new FormData();

  updatedFormData.append("pname", formData.get("pname") as string);
  updatedFormData.append("price", formData.get("price") as string);
  updatedFormData.append("sale", formData.get("sale") as string);

  const fileNames = formData.getAll("fileNames");
  console.log("fileNames length: " + fileNames);
  if (fileNames.length > 0) {
    fileNames.forEach((fileName) => {
      updatedFormData.append("fileNames", fileName);
    });
  }
  // Append all files to the new FormData object
  const files = formData.getAll("files");
  if (files.length > 0) {
    files.forEach((file) => {
      console.log("----------------------------------", file);
      if (file instanceof File) {
        if (file.size > 0) {
          updatedFormData.append("files", file);
        }
      }
    });
  }
  // Make the fetch request
  const response = await fetch(`http://localhost:8080/api/products/${pno}`, {
    method: "PUT",
    body: updatedFormData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to update product:", errorText);
    return { message: "Failed to update product", result: "fail" };
  }

  revalidatePath(`/product/view/${pno}`);

  return { message: "Product updated successfully", result: "success" };
};

export const deleteProduct = async (prevState: any, formData: FormData) => {
  const pno = formData.get("pno");

  console.log("deleteProduct called with pno:", pno);

  const response = await fetch(`http://localhost:8080/api/products/${pno}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  revalidatePath(`/product/view/${pno}`);

  return { message: "Product deleted successfully", result: "success" };
};
