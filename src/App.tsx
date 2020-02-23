import React, { useState } from "react";

import {
  Box,
  CSSReset,
  Grid,
  Spinner,
  Stack,
  ThemeProvider
} from "@chakra-ui/core";
import * as moment from "moment-timezone";

import { Filter, Meeting } from "./components";
import { jsonUrl, parseData } from "./helpers";

type State = {
  loading: boolean;
  meetings: Meeting[];
  formats: string[];
  timezone: string;
  types: string[];
};

export default function App() {
  const [state, setState] = useState<State>({
    formats: [],
    loading: true,
    meetings: [],
    timezone: moment.tz.guess(),
    types: []
  });

  if (state.loading) {
    fetch(jsonUrl("1UwTJNdzpGHKL8Vuig37SBk_pYKlA9xJgjjfOGyAeD_4"))
      .then(result => {
        return result.json();
      })
      .then(result => {
        const { meetings, formats, types } = parseData(result);
        setState({
          loading: false,
          meetings: meetings,
          formats: formats,
          timezone: moment.tz.guess(),
          types: types
        });
      });
  }

  const filters = {
    Days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    Times: ["Morning", "Midday", "Evening", "Night"],
    Formats: state.formats,
    Types: state.types
  };

  return (
    <ThemeProvider>
      <CSSReset />
      {state.loading ? (
        <Box
          backgroundColor="gray.50"
          height="100%"
          d="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Box>
      ) : (
        <Box p={6} backgroundColor="gray.50">
          <Grid templateColumns={{ md: "auto 300px" }} gap={6}>
            <Stack spacing={8} shouldWrapChildren={true}>
              {state.meetings.map(meeting => (
                <Meeting meeting={meeting} />
              ))}
            </Stack>
            <Filter timezone={state.timezone} filters={filters} />
          </Grid>
        </Box>
      )}
    </ThemeProvider>
  );
}
