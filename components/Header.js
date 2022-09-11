import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = () => {
  return (
    <View style={styles.MainWrap}>
      <Text style={styles.headingText}>iTask</Text>
      <Text style={styles.subHeadingText}>By schidobvu@rn</Text>
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
  MainWrap: {
    padding: 20,
  },
  headingText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  subHeadingText: {
    color: "#696969",
    fontSize: 15,
    paddingVertical: 5,
  },
});
