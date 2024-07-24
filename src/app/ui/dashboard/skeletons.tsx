function TableRowSkeleton() {
  return (
    <div className=" w-full h-20 bg-gradient-to-r  even:from-neutral-100  even:to-white odd:from-white odd:to-neutral-100 background-animate " />
  );
}

export function TableSkeleton() {
  return (
    <div className="mt-7 flow-root">
      <div className="h-20"></div>

      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
    </div>
  );
}
