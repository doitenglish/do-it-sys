import Spinner from "../Spinner";

function CellSkeleton() {
  return (
    <section className=" flex w-full items-center justify-center py-8 px-6 rounded-lg bg-gray-100 bg-opacity-70">
      <Spinner />
    </section>
  );
}

async function GridSkeleton({
  totalBalance,
  totalStudents,
}: {
  totalBalance: number;
  totalStudents: number;
}) {
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
          <button
            className="w-full bg-gray-300 py-3.5  tracking-wide text-gray-800"
            disabled
          >
            Loading...
          </button>
        </div>
      </section>
      <CellSkeleton />
      <CellSkeleton />
      <CellSkeleton />
      <CellSkeleton />
      <CellSkeleton />
      <CellSkeleton />
      <CellSkeleton />
    </div>
  );
}

export default GridSkeleton;
