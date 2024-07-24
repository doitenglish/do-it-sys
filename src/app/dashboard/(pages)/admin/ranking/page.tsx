import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import RankingGrid from "@/app/ui/dashboard/ranking/bento";
import GridSkeleton from "@/app/ui/dashboard/ranking/skeleton";
import { getTotalBalanceAndStudentsCount } from "@/lib/data/do-data";
import { Suspense } from "react";

async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;

  const { totalBalance, totalStudents } =
    await getTotalBalanceAndStudentsCount();
  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: "ranking",
              label: "Ranking",
            },
          ]}
        />
      </div>
      <Suspense
        key={currentPage}
        fallback={
          <GridSkeleton
            totalBalance={totalBalance}
            totalStudents={totalStudents}
          />
        }
      >
        <RankingGrid
          totalBalance={totalBalance}
          totalStudents={totalStudents}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}

export default Page;
