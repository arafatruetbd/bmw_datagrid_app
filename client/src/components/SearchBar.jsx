import { Box, Paper, TextField } from "@mui/material";

/**
 * SearchBar Component
 * 
 * Renders a styled search input field using MUI components.
 * 
 * Props:
 * - searchTerm: current search input value (string)
 * - onSearchChange: function to handle changes to the search input
 */
export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box>
        <TextField
          label="Search"
          placeholder="Search by brand, model"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          variant="outlined"
          size="medium"
        />
      </Box>
    </Paper>
  );
}
