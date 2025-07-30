const fs = require("fs");
const csv = require("csv-parser");
const pool = require("../server/db/db");

// Convert date from MM/DD/YY or MM/DD/YYYY to YYYY-MM-DD
function convertDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  let [month, day, year] = parts.map((p) => p.padStart(2, "0"));
  // Normalize 2-digit year to 4-digit (assumes 20xx)
  year = year.length === 2 ? `20${year}` : year;
  return `${year}-${month}-${day}`;
}

// Sanitize a CSV row before inserting
function sanitizeRow(row) {
  // Convert and normalize Date field
  row.Date = convertDate(row.Date);

  // Convert FastCharge_KmH field: replace '-' or empty with null, otherwise parseInt
  if (row.FastCharge_KmH === "-" || row.FastCharge_KmH === "") {
    row.FastCharge_KmH = null;
  } else {
    row.FastCharge_KmH = parseInt(row.FastCharge_KmH, 10);
  }

  // Add similar sanitization for other numeric fields as needed, e.g.:
  // row.AccelSec = parseFloat(row.AccelSec) || null;

  return row;
}

(async () => {
  const results = [];

  fs.createReadStream("BMW_Aptitude_Test_Test_Data_ElectricCarData.csv")
    .pipe(csv())
    .on("data", (data) => results.push(sanitizeRow(data)))
    .on("end", async () => {
      for (const row of results) {
        try {
          await pool.query("INSERT INTO electric_cars SET ?", row);
        } catch (err) {
          console.error("Error inserting row:", err, row);
        }
      }
      console.log("CSV import complete");
      process.exit();
    });
})();
