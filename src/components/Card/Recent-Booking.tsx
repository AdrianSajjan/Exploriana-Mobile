import { Box } from "@exploriana/components/Box";
import { Body } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";

import { Fragment } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

interface RecentBookingCardProps {
  placeOfDeparture: string;
  placeOfArrival: string;
  dateOfDeparture: string;
  dateOfReturn?: string;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 20,
    paddingRight: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shapes.rounded.lg,
  },
});

export function RecentBookingCard({ dateOfDeparture, placeOfArrival, placeOfDeparture, dateOfReturn }: RecentBookingCardProps) {
  return (
    <Pressable style={styles.card}>
      <Box>
        <Box flexDirection="row">
          <Body color={theme.colors.heading} fontWeight="medium">
            {placeOfDeparture}
          </Body>
          <Body color={theme.colors.heading} fontWeight="medium">
            &nbsp;→&nbsp;
          </Body>
          <Body color={theme.colors.heading} fontWeight="medium">
            {placeOfArrival}
          </Body>
        </Box>
        <Box flexDirection="row">
          <Body size="md">{dateOfDeparture}</Body>
          {Boolean(dateOfReturn) && (
            <Fragment>
              <Body size="md">&nbsp;→&nbsp;</Body>
              <Body size="md">{dateOfReturn}</Body>
            </Fragment>
          )}
        </Box>
      </Box>
      <Box>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
      </Box>
    </Pressable>
  );
}
