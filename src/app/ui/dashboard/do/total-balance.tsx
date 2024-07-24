import { getBalanceById } from "@/lib/data/do-data";
import clsx from "clsx";

async function TotalBalance({ id }: { id: string }) {
  const { balance } = await getBalanceById(id);

  return (
    <div className=" flex items-center justify-between px-5 py-4 bg-neutral-100 bg-opacity-80 border border-neutral-200">
      <span className=" text-neutral-700 font-medium">Balance </span>
      <div
        className={clsx("flex items-center gap-x-1 ", {
          "text-green-500": balance > 0,
          "text-red-500": balance < 0,
        })}
      >
        <h3 className="text-xl font-normal tracking-wide">{balance}</h3>
      </div>
    </div>
  );
}

export default TotalBalance;
