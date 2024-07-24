"use client";

import { Button } from "@/app/ui/dashboard/buttons";
import { ErrorBox } from "@/app/ui/dashboard/form";
import { signIn } from "@/lib/actions/auth-actions";
import { auth } from "@/lib/firebase/firebase-client";
import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useState } from "react";

function Page() {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState("");

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading || username === "" || password === "") {
      setErrMsg("Invalid Fields.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username + "@do-it.teacher",
        password
      );

      const idToken = await userCredential.user.getIdToken();

      const signInWithIdToken = signIn.bind(null, idToken);
      const result = await signInWithIdToken();

      if (!result.ok) {
        throw new Error(result.message);
      }

      return router.push(result.path!);
    } catch (error) {
      console.error(error);

      setErrMsg("Something went wrong, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-screen flex  justify-center items-center ">
        <div className="w-full max-w-xl flex flex-col mx-auto">
          <div className=" w-full flex justify-start px-7 items-end mb-3">
            <Image
              src="/logo_final_4.png"
              alt="main_logo"
              width={80}
              height={80}
            />
            <h1 className="text-3xl ml-3 text-neutral-700">DO-IT</h1>
          </div>
          <form
            onSubmit={handleSignIn}
            className=" mt-5  w-full flex flex-col px-7 py-10 "
          >
            <label htmlFor="name" className="text-sm text-neutral-600 mb-2">
              Username <span className=" text-red-400 text-xs">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full text-sm px-3 py-3.5 border border-neutral-300 focus:border-neutral-500 focus:outline-none shadow focus:shadow-md mb-8"
            />
            <label htmlFor="password" className="text-sm text-neutral-600 mb-2">
              Password <span className=" text-red-400 text-xs">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full text-sm px-3 py-3.5 border border-neutral-300 focus:border-neutral-500 focus:outline-none shadow focus:shadow-md mb-16"
            />
            <Button className="" aria-disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
            <div className="w-full flex items-center h-12 mt-3">
              {errMsg && <ErrorBox message={errMsg} />}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Page;
