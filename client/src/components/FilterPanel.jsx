import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Typography,
} from "@mui/material";

// Define allowed filter types
const FILTER_TYPES = [
  "contains",
  "equals",
  "starts with",
  "ends with",
  "is empty",
  "greater than",
  "less than",
];

/**
 * FilterPanel Component
 *
 * Props:
 * - columns: AG Grid columns to choose filter field from
 * - filters: existing filter list
 * - filterField, filterType, filterValue: controlled filter inputs
 * - onFilterFieldChange, onFilterTypeChange, onFilterValueChange: handlers for filter inputs
 * - onAddFilter: adds filter to list
 * - onRemoveFilter: removes filter from list
 */
export default function FilterPanel({
  columns,
  filters,
  filterField,
  filterType,
  filterValue,
  onFilterFieldChange,
  onFilterTypeChange,
  onFilterValueChange,
  onAddFilter,
  onRemoveFilter,
}) {
  const hasValidFilter =
    filterField &&
    filterType &&
    (filterType === "is empty" || filterValue.trim() !== "");

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      {/* Filter Input Controls */}
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
        {/* Field Selector */}
        <TextField
          label="Field"
          value={filterField}
          onChange={(e) => onFilterFieldChange(e.target.value)}
          select
          sx={{ minWidth: 140 }}
        >
          {columns
            .filter((col) => col.field !== "Actions")
            .map((col) => (
              <MenuItem key={col.field} value={col.field}>
                {col.field}
              </MenuItem>
            ))}
        </TextField>

        {/* Filter Type Selector */}
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
            label="Filter Type"
          >
            {FILTER_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filter Value Input */}
        <TextField
          label="Value"
          value={filterValue}
          onChange={(e) => onFilterValueChange(e.target.value)}
          disabled={filterType === "is empty"}
          sx={{ minWidth: 140 }}
        />

        {/* Add Filter Button */}
        <Button
          variant="contained"
          onClick={onAddFilter}
          disabled={!hasValidFilter}
          sx={{ height: "56px" }}
        >
          Add Filter
        </Button>
      </Box>

      {/* Display Active Filters */}
      <Box mt={2}>
        {filters.map((f, i) => (
          <Box
            key={i}
            display="inline-flex"
            alignItems="center"
            px={2}
            py={1}
            mr={1}
            mb={1}
            bgcolor="#f0f0f0"
            borderRadius={2}
          >
            <Typography variant="body2">
              <strong>{f.field}</strong> {f.type}{" "}
              {f.type !== "is empty" && `"${f.value}"`}
            </Typography>
            <Button
              size="small"
              onClick={() => onRemoveFilter(i)}
              sx={{ ml: 1, minWidth: "24px", padding: 0 }}
            >
              ×
            </Button>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
