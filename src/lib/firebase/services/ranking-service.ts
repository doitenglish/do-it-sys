"server-only";

import {
  DeleteRankingInput,
  DeleteRankingOutput,
  GetRankingsInput,
  GetRankingsOutput,
} from "./../../../definitions/ranking-types";

import {
  BackendRanking,
  FrontendRanking,
  Rank,
} from "@/definitions/ranking-types";
import { adminDB, adminStorage } from "../firebase-admin";
import { DoAccount } from "@/definitions/do-types";
import ExcelJS from "exceljs";
import { formatDate } from "@/lib/utils";
import { Timestamp } from "firebase-admin/firestore";
import { getPaginateAndCount } from "../firestore-utils";
import { applyStyles, excelHeaders } from "@/lib/excel";

export async function updateRanking() {
  try {
    const rankingRef = adminDB.collection("ranking");
    const prevRankingRef = rankingRef.orderBy("createdAt", "desc").limit(1);
    const prevRankingSnapshot = await prevRankingRef.get();
    const prevRankingData =
      (prevRankingSnapshot.docs[0]?.data() as BackendRanking) || null;
    //do collection
    const doAccountsRef = adminDB.collection("do");
    const doAccountSnapshot = await doAccountsRef.get();

    const accounts = doAccountSnapshot.docs.map((doc) =>
      doc.data()
    ) as DoAccount[];

    accounts.sort((a, b) => b.balance - a.balance);

    const rankings: Rank[] = accounts.map((account, index) => ({
      rank: index + 1,
      nameKo: account.nameKo,
      nameEn: account.nameEn,
      balance: account.balance,
    }));

    const today = formatDate(new Date());

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${today} Ranking`);

    // 열 헤더 추가
    worksheet.columns = excelHeaders;

    // 랭킹 이름으로 내림차순 한 뒤 데이터 추가
    rankings
      .sort((a, b) => a.nameKo.localeCompare(b.nameKo))
      .forEach((ranking) => {
        worksheet.addRow({
          ...ranking,
          prev_rank: prevRankingData
            ? prevRankingData.rankings.find(
                (r) =>
                  r.nameKo === ranking.nameKo && r.nameEn === ranking.nameEn
              )?.rank || ""
            : "",
          prev_balance: prevRankingData
            ? prevRankingData.rankings.find(
                (r) =>
                  r.nameKo === ranking.nameKo && r.nameEn === ranking.nameEn
              )?.balance || ""
            : "",
        });
      });

    //excel sheet 스타일 적용
    applyStyles(worksheet);

    // 엑셀 파일을 버퍼로 변환
    const buffer = await workbook.xlsx.writeBuffer();
    const bufferData = Buffer.from(buffer);

    // Firebase Storage에 업로드
    const filePath = `rankings/${today}.xlsx`;

    const file = adminStorage.file(filePath);

    await file.save(bufferData, {
      metadata: {
        contentType:
          "application/vnd.ms-excelapplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    // 다운로드 URL 생성
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // 만료 날짜를 설정합니다.
    });

    //ranking 저장 전 ranking 순서대로 정렬
    rankings.sort((a, b) => a.rank - b.rank);
    //ranking 저장
    await rankingRef
      .doc(today)
      .set({ createdAt: Timestamp.now(), rankings, file_url: url });

    return {
      ok: true,
    };
  } catch (e: any) {
    return {
      ok: false,
      error: "firebase: Failed to update ranking",
    };
  }
}

export async function getRankings(
  GetRankingsInput: GetRankingsInput
): Promise<GetRankingsOutput> {
  const { currentPage } = GetRankingsInput;
  try {
    const rankingRef = adminDB
      .collection("ranking")
      .orderBy("createdAt", "desc");

    const result = await getPaginateAndCount(rankingRef, {
      currentPage,
      itemsPerPage: 7,
    });

    if (!result.ok) {
      throw new Error("Cannot get paginated data.");
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const rankings: FrontendRanking[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as BackendRanking),
    }));

    return {
      ok: true,
      data: rankings,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Firebase: Failed to get rankings",
    };
  }
}

export async function deleteRanking(
  deleteRankingInput: DeleteRankingInput
): Promise<DeleteRankingOutput> {
  const { id } = deleteRankingInput;
  try {
    const rankingRef = adminDB.collection("ranking").doc(id);
    const rankingSnapshot = await rankingRef.get();

    if (!rankingSnapshot.exists) {
      return {
        ok: false,
        error: "firebase: Ranking not found.",
      };
    }

    const ranking = rankingSnapshot.data() as BackendRanking;
    const storageFileName = `rankings/${rankingSnapshot.id}.xlsx`;

    await rankingRef.delete();

    try {
      await adminStorage.file(storageFileName).delete();
    } catch (storageError: any) {
      // If the storage file does not exist, ignore the error
      if (storageError.code !== 404) {
        // Re-create the product document if storage file deletion fails
        await rankingRef.set(ranking);
        throw storageError;
      }
    }

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Failed to delete ranking.",
    };
  }
}
