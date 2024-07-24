import { FrontendRanking } from "@/definitions/ranking-types";
import { getRankings } from "@/lib/data/ranking-data";
import { deleteRanking, updateRanking } from "@/lib/actions/ranking-actions";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

function GridCell({ rank }: { rank: FrontendRanking }) {
  return (
    <section className=" flex w-full items-center justify-between py-8 px-6 rounded-lg bg-gray-100 bg-opacity-70">
      <div className="flex flex-col">
        <span className="text-xl font-semibold mb-3 text-gray-800">Date: </span>
        <span className="text-lg font-medium  border-b border-gray-700 text-gray-700">
          {rank.id}
        </span>
      </div>
      <div className="flex gap-x-2">
        <Link
          href={rank.file_url}
          prefetch={false}
          download
          className="w-[3.5rem] aspect-square rounded flex justify-center items-center bg-gray-700 text-gray-100 text-sm py-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </Link>
        <form
          action={async () => {
            "use server";

            await deleteRanking(rank.id);
          }}
        >
          <button className="w-[3.5rem] aspect-square rounded text-gray-800 border-2 border-gray-700 text-sm py-3 flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}

function EmptyGridCell() {
  return (
    <section className=" flex w-full items-center justify-center py-8 px-6 rounded-lg bg-gray-100 bg-opacity-70 text-gray-400">
      {/*  <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg> */}
      <div className="text-sm ">Empty</div>
    </section>
  );
}

async function RankingGrid({
  totalBalance,
  totalStudents,
  currentPage,
}: {
  totalBalance: number;
  totalStudents: number;
  currentPage: number;
}) {
  const { data } = await getRankings(currentPage);

  const elements = Array.from({ length: 7 - data.length }, (_, index) => index);

  return (
    <div className="grid grid-rows-3 grid-cols-3  gap-4 mt-16">
      <section className="row-span-2  flex flex-col  ">
        <div className="w-full py-8 px-6 shadow-inner rounded-lg bg-gray-100 bg-opacity-70 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-600">
            Summary
          </h3>
          <div className="flex w-full justify-between items-center mb-6">
            <span className="text-lg font-semibold text-gray-800">
              Total Do Money
            </span>
            <span className="font-bold text-gray-800">{totalBalance}</span>
          </div>
          <div className="flex w-full justify-between items-center mb-6">
            <span className="text-lg font-semibold text-gray-800">
              Total Students
            </span>
            <span className="font-bold text-gray-800">{totalStudents}</span>
          </div>
        </div>
        <div className="flex w-full mt-4">
          {data[0]?.id === formatDate(new Date()) ? (
            <div className="w-full text-center bg-gray-300 py-3.5  tracking-wide text-gray-500">
              Already up-to-date
            </div>
          ) : (
            <form
              action={async () => {
                "use server";

                await updateRanking();
              }}
              className="w-full"
            >
              <button className="w-full bg-yellow-300 py-3.5  tracking-wide text-gray-800">
                Update
              </button>
            </form>
          )}
        </div>
      </section>
      {data.map((rank: FrontendRanking) => (
        <GridCell key={rank.id} rank={rank} />
      ))}
      {elements.map((_, index) => (
        <EmptyGridCell key={index} />
      ))}
    </div>
  );
}

export default RankingGrid;
