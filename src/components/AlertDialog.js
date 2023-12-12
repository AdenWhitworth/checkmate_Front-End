import Alert from '@mui/material/Alert';

export default function DashboardCard({severity,contentText,handleClose}) {
    return (
        <Alert sx={{position:"absolute", bottom:0, width:"97.6%"}} severity={severity} onClose={handleClose}>{contentText}</Alert>
    );
}