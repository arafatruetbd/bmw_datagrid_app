import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
} from "@mui/material";
import { formatDateISO } from "../utils/dateUtils";

export default function DetailPage() {
  const { id } = useParams(); // Get dynamic ID from route params
  const [data, setData] = useState(null); // Store the fetched detail data
  const [loading, setLoading] = useState(true); // Show loading spinner while fetching
  const navigate = useNavigate(); // Navigation hook

  // Fetch detail data when the component mounts or when `id` changes
  useEffect(() => {
    setLoading(true); // Start loading
    fetch(`http://localhost:4000/api/data/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false); // Done loading
      })
      .catch(() => {
        setData(null);
        setLoading(false); // Also stop loading on error
      });
  }, [id]);

  return (
    <Box maxWidth={600} mx="auto" mt={5} p={2}>
      <Typography variant="h4" gutterBottom>
        Electric Car Details
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          {loading ? (
            // Show a loading spinner while data is being fetched
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : data ? (
            // Display data in a key-value table if available
            <Table>
              <TableBody>
                {Object.entries(data).map(([key, val]) => (
                  <TableRow key={key}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "bold", width: "35%" }}
                    >
                      {key}
                    </TableCell>
                    <TableCell>
                      {val !== null && val !== undefined && val !== "" ? (
                        // Format ISO date strings
                        typeof val === "string" &&
                        /^\d{4}-\d{2}-\d{2}T/.test(val) ? (
                          formatDateISO(val)
                        ) : (
                          String(val) // Convert other values to string
                        )
                      ) : (
                        // Show "N/A" for null or empty fields
                        <Typography color="text.secondary" fontStyle="italic">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            // Show error if no data found
            <Typography color="error" align="center">
              No data found for ID: {id}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Back button to return to previous page */}
      <Box textAlign="center">
        <Button variant="contained" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    </Box>
  );
}
