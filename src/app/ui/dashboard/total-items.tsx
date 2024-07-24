function TotalItems({ label, counts }: { label: string; counts: number }) {
  return (
    <div className="text-sm text-neutral-400">
      total {label}: {counts}
    </div>
  );
}

export default TotalItems;
