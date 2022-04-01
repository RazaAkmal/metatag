/* eslint-disable no-use-before-define */
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import styles from "./Cards2.css";

export default function DisabledOptions({buttonState}) {

  const [value,setValue] = useState(timeSlots[0]);
 

  return (
    <Autocomplete
      fullWidth={false}
      forcePopupIcon={false}
      id="disabled-options-demo"
      options={timeSlots}
      onChange={(event, newValue) => {
        if(newValue == null){
          buttonState(true)
        } else {
          setValue(newValue);
          buttonState(false)
        }
       }}

      // getOptionLabel={(value) => {
      //   console.log(value);
      // }}

      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Options" variant="outlined" />
      )}
    />
  );
}

const timeSlots = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10","11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
