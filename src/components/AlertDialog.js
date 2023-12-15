import Alert from '@mui/material/Alert';

export default function DashboardCard({severity,contentText,handleClose}) {
    return (
        <Alert sx={{position:"absolute", top:{ xs: 0, md: "unset"}, bottom:{ xs: "unset", md: 0}, width:{ xs: "91.8%", md: "97.6%"}}} severity={severity} onClose={handleClose}>{contentText}</Alert>
    );
}