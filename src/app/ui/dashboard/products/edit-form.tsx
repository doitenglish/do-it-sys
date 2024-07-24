"use client";

import { Button, CancelButton, DeleteButton } from "../buttons";
import { useEffect, useState } from "react";

import { ErrorBox, FormRow, Slash, UnderArr } from "../form";
import { storage } from "@/lib/firebase/firebase-client";
import { getDownloadURL, ref } from "firebase/storage";
import { FrontendProduct } from "@/definitions/product-types";
import Image from "next/image";
import Spinner from "../Spinner";
import { PRODUCT_BASE_PATH } from "@/lib/constants";
import { deleteProduct, updateProduct } from "@/lib/actions/product-actions";
import { useFormState } from "react-dom";

function EditProductForm({
  id,
  product,
}: {
  id: string;
  product: FrontendProduct;
}) {
  const [type, setType] = useState<number>(product.type);
  const [price, setPrice] = useState(product.price + "");
  const [url, setUrl] = useState(product.product_url);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (product.img_url) {
      const fetchImage = async () => {
        try {
          const storageRef = ref(storage, product.img_url);
          const url = await getDownloadURL(storageRef);
          setPreview(url);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      };

      fetchImage();
    }
  }, [product.img_url]);

  const updateProductWithBind = updateProduct.bind(null, id);
  const deleteProductWithBind = deleteProduct.bind(null, id);

  const initialState = { message: "" };
  const [state, dispatch] = useFormState(updateProductWithBind, initialState);

  return (
    <form action={dispatch} className="flex flex-col">
      <div className="w-full flex my-10 gap-x-20">
        {/*Photo*/}
        <div className="relative w-1/4 min-w-80 min-h-80 pb-8 ">
          {preview ? (
            <Image
              src={preview}
              alt="Product image"
              width={384}
              height={384}
              priority
              className="border"
            />
          ) : (
            <div className="w-98 aspect-square flex justify-center items-center">
              <Spinner />
            </div>
          )}
        </div>
        <div className="flex-1">
          {/*Name && Type && */}
          <div className="flex gap-x-20">
            {/*Name*/}
            <FormRow label="Name" disabled>
              <div className="input-field ">{product.name}</div>
            </FormRow>
            {/*Type*/}
            <FormRow label="Type" required>
              <div className="relative flex-1">
                <select
                  id="type"
                  name="type"
                  className="input-field appearance-none cursor-pointer pl-8"
                  onChange={(e) => {
                    setType(+e.target.value);
                  }}
                  value={type}
                >
                  <option value="" disabled>
                    Select product type
                  </option>

                  <option value={1}>ONLINE</option>
                  <option value={2}>OFFLINE</option>
                </select>
                <Slash />
                <UnderArr />
              </div>
            </FormRow>
          </div>

          {/*Price && Tag */}
          <div className="flex gap-x-20">
            {/*price*/}
            <FormRow label="Price" required>
              <input
                id="price"
                name="price"
                type="number"
                className="input-field  "
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormRow>

            {/*Product URL*/}
            <FormRow label="Product URL">
              <input
                id="product_url"
                name="product_url"
                type="text"
                className="input-field"
                placeholder="Enter product url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </FormRow>
          </div>
          <div className="w-full flex items-center h-12 -mt-5">
            {state?.message && <ErrorBox message={state.message} />}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between mt-4">
        <div className="flex gap-x-4">
          <CancelButton href={PRODUCT_BASE_PATH} />
          <DeleteButton action={deleteProductWithBind} disabled={false} />
        </div>
        <Button type="submit">Edit Product</Button>
      </div>
    </form>
  );
}

export default EditProductForm;
