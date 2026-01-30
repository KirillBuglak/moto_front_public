import { Container, Paper, Stack, Grid, TextField, Button } from "@mui/material"

const TestForm = () => {
    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Stack spacing={2}> {/* Vertical layout for form elements */}
                    <h2>My Form</h2>

                    <Grid container spacing={2}> {/* Grid for more complex layout, e.g., fields side-by-side */}
                        <Grid item xs={12} sm={6}>  {/* Full width on small screens, half width on medium+ */}
                            <TextField label="First Name" variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}> {/* Same as above, second column */}
                            <TextField label="Last Name" variant="outlined" fullWidth />
                        </Grid>
                    </Grid>

                    <TextField label="Email" variant="outlined" fullWidth />
                    <TextField label="Password" variant="outlined" type="password" fullWidth />
                    <Button variant="contained" color="primary">Submit</Button>
                </Stack>
            </Paper>
        </Container>
    )
}

export default TestForm