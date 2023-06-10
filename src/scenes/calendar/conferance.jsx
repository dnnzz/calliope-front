import React from "react";
import { Grid, Box, useTheme, Tooltip, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { tokens } from "../../theme";
import { fetchConferenceById } from "../../services/conference";

const Conferance = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const CustomTooltipWrapper = styled(({ title, ...props }) => <Tooltip {...props} title={<span style={{ fontSize: "20px" }}>{title}</span>} />)(
      ({ theme }) => ({
         ".MuiTooltip-tooltip span": {
            fontSize: "50px", // Set the desired font size
         },
      })
   );
   const [conference, setConference] = React.useState({});
   const fetchConference = async () => {
      fetchConferenceById(1).then((res) => {
         setConference(res[0]);
      });
   };
   React.useEffect(() => {
      fetchConference();
   }, []);

   return (
      <Box backgroundColor={colors.primary[400]}>
         <Grid container spacing={0}>
            <Grid item xs={6}>
               <iframe src={conference.code_editor_url} width="100%" height="520" allowFullScreen></iframe>
            </Grid>
            <Grid item xs={6}>
               <CustomTooltipWrapper title={conference.directive_text || "Tooltip"}>
                  <Button variant="contained" color="primary" sx={{ m: 1 }}>
                     <Typography variant="h5" fontWeight="600">
                        {conference.directive_header}
                     </Typography>
                  </Button>
               </CustomTooltipWrapper>
            </Grid>
         </Grid>
      </Box>
   );
};

export default Conferance;
