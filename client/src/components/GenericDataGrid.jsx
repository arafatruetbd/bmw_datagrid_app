import { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import { formatDateISO } from "../utils/dateUtils";

// Register AG Grid community modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function GenericDataGrid() {
  const navigate = useNavigate();

  const [rowData, setRowData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState([]);
  const [filterField, setFilterField] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const hasValidFilter = useMemo(() => {
    return (
      filterField &&
      filterType &&
      (filterType === "is empty" || filterValue.trim() !== "")
    );
  }, [filterField, filterType, filterValue]);

  // Fetch data from API
  const fetchData = async () => {
    let url = "http://localhost:4000/api/data";
    const params = new URLSearchParams();

    if (filters.length > 0) {
      params.append("filters", JSON.stringify(filters));
    }
    if (searchTerm.trim()) {
      params.append("q", searchTerm.trim());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setRowData(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, searchTerm]);

  const handleAddFilter = () => {
    if (!hasValidFilter) return;
    setFilters((prev) => [
      ...prev,
      { field: filterField, type: filterType, value: filterValue },
    ]);
    setFilterField("");
    setFilterType("");
    setFilterValue("");
  };

  const handleRemoveFilter = (index) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleView = (id) => navigate(`/detail/${id}`);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/data/${id}`, {
        method: "DELETE",
      });
      setRowData((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      console.error("Error deleting row:", err);
    }
  };

  // Define dynamic column definitions with optional date formatting
  const columns = useMemo(() => {
    if (!rowData[0]) return [];

    const dynamicCols = Object.keys(rowData[0]).map((key) => {
      const sampleValue = rowData[0][key];

      const isDateColumn =
        typeof sampleValue === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(sampleValue);

      return {
        field: key,
        filter: false,
        sortable: true,
        resizable: true,
        cellRenderer: isDateColumn
          ? (params) => formatDateISO(params.value)
          : undefined,
      };
    });

    return [
      ...dynamicCols,
      {
        field: "Actions",
        cellRenderer: (params) => (
          <Box display="flex" gap={1}>
            <Button size="small" onClick={() => handleView(params.data.id)}>
              View
            </Button>
            <Button size="small" onClick={() => handleDelete(params.data.id)}>
              Delete
            </Button>
          </Box>
        ),
        filter: false,
        sortable: false,
        resizable: false,
        minWidth: 150,
        maxWidth: 220,
        width: 200,
      },
    ];
  }, [rowData]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Electric Car Data Grid
      </Typography>

      {/* Search & Filter Controls */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
        <Box flex={1} minWidth={250}>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </Box>

        <Box flex={2} minWidth={350}>
          <FilterPanel
            columns={columns}
            filters={filters}
            filterField={filterField}
            filterType={filterType}
            filterValue={filterValue}
            onFilterFieldChange={setFilterField}
            onFilterTypeChange={setFilterType}
            onFilterValueChange={setFilterValue}
            onAddFilter={handleAddFilter}
            onRemoveFilter={handleRemoveFilter}
          />
        </Box>
      </Box>

      {/* AG Grid Table */}
      <Box className="ag-theme-alpine" sx={{ height: 800, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          pagination
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: false,
          }}
        />
      </Box>
    </Box>
  );
}
