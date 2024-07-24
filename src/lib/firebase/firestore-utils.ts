import { TableOutput } from "@/definitions/common-types";
import { Query } from "firebase-admin/firestore";

interface levelFilter {
  level: string;
  division: string;
}

export function filterByLevel(
  queryRef: Query,
  { level, division }: levelFilter
): Query {
  if (level !== "All") {
    queryRef = queryRef.where("level", "==", level);

    if (division !== "All") {
      queryRef = queryRef.where("division", "==", division);
    }
  }

  return queryRef;
}

interface TagFilter {
  query?: string;
}

export function searchByTag(queryRef: Query, { query = "" }: TagFilter): Query {
  if (query) {
    queryRef = queryRef.where("tags", "array-contains", query);
  }

  return queryRef;
}

interface PaginationInput {
  currentPage: number;
  itemsPerPage?: number;
}

type PaginationOutput = TableOutput<FirebaseFirestore.QuerySnapshot>;

export async function getPaginateAndCount(
  queryRef: Query,
  { currentPage, itemsPerPage = 5 }: PaginationInput
): Promise<PaginationOutput> {
  try {
    const offset = (currentPage - 1) * itemsPerPage;

    const totalSizeSnapShot = await queryRef.count().get();
    const totalCounts = totalSizeSnapShot.data().count;

    const totalPages = Math.ceil(totalCounts / itemsPerPage);

    const snapshot = await queryRef.offset(offset).limit(itemsPerPage).get();

    return { ok: true, data: snapshot, totalCounts, totalPages };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot get paginate and count",
    };
  }
}
