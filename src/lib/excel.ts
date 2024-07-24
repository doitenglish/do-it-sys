import ExcelJS from "exceljs";

export const excelHeaders = [
  {
    header: "이  름",
    key: "nameKo",
    width: 15,
  },
  {
    header: "영어이름",
    key: "nameEn",
    width: 15,
  },
  {
    header: "Do-money",
    key: "balance",
    width: 15,
  },
  {
    header: "",
    key: "prev_balance",
    width: 7,
  },
  {
    header: "현재 등수",
    key: "rank",
    width: 15,
  },

  {
    header: "",
    key: "prev_rank",
    width: 5,
  },
];

export const applyStyles = (worksheet: ExcelJS.Worksheet) => {
  // 헤더 스타일링
  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FFFF00",
      }, // 노란색 배경
    };
    cell.font = {
      size: cell.value?.toString().length == 0 ? 10 : 12,
      bold: true,
    };
    cell.alignment = { vertical: "middle", horizontal: "center" }; // 중앙 정렬
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  worksheet.getColumn(3).eachCell((cell, row) => {
    cell.font = { size: 14, bold: row === 1 };
  });

  worksheet.getColumn(4).eachCell((cell) => {
    cell.font = { size: 10 };
  });

  worksheet.getColumn(5).eachCell((cell, row) => {
    cell.font = { size: 12, bold: row === 1 };
  });

  worksheet.getColumn(6).eachCell((cell) => {
    cell.font = { size: 10 };
  });

  // 데이터 셀 스타일링
  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    //row.height = 25; // 적당한 높이 설정
  });
};
