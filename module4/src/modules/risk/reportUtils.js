export const downloadCSV = (filename, rows) => {
  if (!rows.length) return;
 
  const headers = Object.keys(rows[0]).join(",");
  const csv = [
    headers,
    ...rows.map((r) =>
      Object.values(r).map((v) => `"${v}"`).join(",")
    ),
  ].join("\n");
 
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};