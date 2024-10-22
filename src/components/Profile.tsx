import { Box } from "@mui/material";
import { Profile } from "../scripts";
import { FC } from "react";

type Props = {
    profile: Profile;
}

export const ProfileComponent: FC<Props> = ({profile}) => {
    const {
        nickname, 
        ageAndRegion, 
        preference, 
        commonality, 
        favorite, 
        introduction
    } = profile
    return (
        <Box>
            ニックネーム: ${nickname}
            ---
            ${ageAndRegion}
            ${introduction}
            {commonality.map((elem: string) =>
                ( <li>{elem}</li> ) 
            )}
            {preference.map((elem: string) =>
                ( <li>{elem}</li> ) 
            )}
            {favorite.map((elem) =>
                ( <li>{elem.title}: {elem.description}</li> ) 
            )}
        </Box>
    )
}