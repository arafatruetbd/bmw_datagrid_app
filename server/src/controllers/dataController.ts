import { Request, Response } from "express";
import pool from "../db/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Interface representing a row from the electric_cars table
interface ElectricCarRow extends RowDataPacket {
  id: number;
  Brand: string;
  Model: string;
  Variant?: string;
  Battery_kWh?: number;
  // Add other fields as per your table schema
}

// Defines the structure and allowed filter types for filtering queries
type FilterItem = {
  field: string;
  type:
    | "contains"
    | "equals"
    | "starts with"
    | "ends with"
    | "is empty"
    | "greater than"
    | "less than";
  value?: string;
};

/**
 * Handler to get all electric car data with optional filters and search.
 * Supports dynamic SQL WHERE clauses based on filters and searchTerm.
 * Endpoint: GET /api/data
 */
export const getAllData = async (req: Request, res: Response) => {
  let filters: FilterItem[] = [];
  const searchTerm = req.query.q?.toString().trim();
  const values: (string | number)[] = [];
  const whereClauses: string[] = [];

  // Attempt to parse filters from query parameter if provided
  try {
    if (req.query.filters) {
      filters = JSON.parse(req.query.filters.toString()) as FilterItem[];
    }
  } catch (e) {
    return res.status(400).json({ error: "Invalid filters JSON" });
  }

  // Convert filters to SQL WHERE clauses with parameterized queries
  for (const { field, type, value } of filters) {
    switch (type) {
      case "contains":
        whereClauses.push(`\`${field}\` LIKE ?`);
        values.push(`%${value}%`);
        break;
      case "equals":
        whereClauses.push(`\`${field}\` = ?`);
        values.push(value || "");
        break;
      case "starts with":
        whereClauses.push(`\`${field}\` LIKE ?`);
        values.push(`${value}%`);
        break;
      case "ends with":
        whereClauses.push(`\`${field}\` LIKE ?`);
        values.push(`%${value}`);
        break;
      case "is empty":
        whereClauses.push(`(\`${field}\` IS NULL OR \`${field}\` = '')`);
        break;
      case "greater than":
        whereClauses.push(`\`${field}\` > ?`);
        values.push(value || 0);
        break;
      case "less than":
        whereClauses.push(`\`${field}\` < ?`);
        values.push(value || 0);
        break;
    }
  }

  // Add global search clause if searchTerm is provided
  if (searchTerm) {
    whereClauses.push(`(Brand LIKE ? OR Model LIKE ?)`);
    values.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  // Construct the final WHERE SQL clause
  const whereSQL = whereClauses.length
    ? `WHERE ${whereClauses.join(" AND ")}`
    : "";

  try {
    // Execute the query with filters and search applied
    const [rows] = await pool.query<ElectricCarRow[]>(
      `SELECT * FROM electric_cars ${whereSQL}`,
      values
    );
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Database query failed" });
  }
};

/**
 * Handler to get a single electric car data row by ID.
 * Endpoint: GET /api/data/:id
 */
export const getDataById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<ElectricCarRow[]>(
      "SELECT * FROM electric_cars WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      // No record found for the given ID
      return res.status(404).json({ error: "Record not found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching data by ID:", error);
    return res.status(500).json({ error: "Failed to fetch data by ID" });
  }
};

/**
 * Handler to delete a record by ID.
 * Endpoint: DELETE /api/data/:id
 */
export const deleteData = async (req: Request, res: Response) => {
  try {
    // Run delete query and capture the result metadata
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM electric_cars WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      // No record was deleted, likely because it doesn't exist
      return res.status(404).json({ error: "Record not found" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Error deleting data:", error);
    return res.status(500).json({ error: "Failed to delete record" });
  }
};
