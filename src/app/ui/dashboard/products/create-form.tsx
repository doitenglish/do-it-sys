"use client";

import { Button, CancelButton } from "../buttons";
import { useState } from "react";

import { ErrorBox, FormRow, Slash, UnderArr } from "../form";
import { createProduct, getUploadId } from "@/lib/actions/product-actions";
import { storage } from "@/lib/firebase/firebase-client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useFormState } from "react-dom";
import { PRODUCT_BASE_PATH } from "@/lib/constants";

function CreateProductForm() {
  //file upload 관련
  const [preview, setPreview] = useState("");
  const [photoId, setPhoteId] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState<number>(2);
  const [price, setPrice] = useState("");

  const [tag, setTag] = useState("");
  const [url, setUrl] = useState("");

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    const result = await getUploadId();
    setPhoteId(result);
  };

  const uploadImage = (id: string, file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(storage, `products/${id}`);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  };

  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file || !(file instanceof File)) {
      return;
    }
    const photoUrl = await uploadImage(photoId, file);

    formData.set("photo", photoUrl);
    formData.set("id", photoId);
    return createProduct(_, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <form action={action} className="flex flex-col">
      <div className="w-full flex mt-10 gap-x-20">
        {/*Photo*/}
        <div className="pb-10">
          <label
            htmlFor="photo"
            className="w-96 h-96 border flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
            style={{
              backgroundImage: `url(${preview})`,
            }}
          >
            {preview === "" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                  />
                </svg>

                <div className="mt-3 text-neutral-400 text-sm">
                  Add photo <span className="text-sm text-red-400 ">*</span>
                </div>
              </>
            ) : null}
          </label>
          <input
            onChange={onImageChange}
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="flex-1">
          {/*Name && Type && */}
          <div className="flex gap-x-20">
            {/*Name*/}
            <FormRow label="Name" required>
              <input
                id="name"
                name="name"
                type="text"
                className="input-field  "
                placeholder="Enter product name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
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

            {/*Tag*/}
            <FormRow label="Tag" required>
              <input
                id="tag"
                name="tag"
                type="text"
                className="input-field  "
                placeholder="Enter tag"
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value);
                }}
              />
            </FormRow>
          </div>

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
      </div>
      <div className="w-full flex items-center h-12 -mt-7 mb-5">
        {state?.message && <ErrorBox message={state.message} />}
      </div>
      <div className="flex w-full justify-between ">
        <CancelButton href={PRODUCT_BASE_PATH} />
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
}

export default CreateProductForm;
