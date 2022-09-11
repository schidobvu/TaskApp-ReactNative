import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

const TaskDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, title, details, completed, phoneID } = route.params;
  const [input, setInput] = useState(details);
  // update task details
  useEffect(() => {
    const unsubscribe = () => {
      updateDoc(doc(db, phoneID, id), {
        details: input,
      });
    };
    return () => {
      unsubscribe();
    };
  }, [input]);

  //delete task
  const deleteTask = () => {
    deleteDoc(doc(db, phoneID, id)).then(() => {
      navigation.navigate("Home");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <Icon
          name="arrow-left"
          size={30}
          color="#868686"
          onPress={() => navigation.navigate("Home")}
        />
        <Icon
          name="delete-outline"
          size={30}
          color="#868686"
          onPress={() => deleteTask()}
        />
      </View>
      <Text style={!completed ? styles.title : styles.titleUnderline}>
        {title}
      </Text>
      <View style={styles.details}>
        <Icon name="details" size={20} color="#ffa32a" />
        <TextInput
          style={styles.inputContainer}
          onChangeText={(value) => setInput(value)}
          defaultValue={details}
        />
      </View>
    </View>
  );
};

export default TaskDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  navigation: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    marginTop: 30,
    paddingHorizontal: 10,
    color: "#dfdfdf",
    fontWeight: "bold",
  },
  titleUnderline: {
    fontSize: 30,
    marginTop: 30,
    paddingHorizontal: 10,
    color: "#dfdfdf",
    fontWeight: "bold",
    textDecorationLine: "line-through",
  },
  details: {
    display: "flex",
    flexDirection: "row",
    marginTop: 30,
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginLeft: 10,
    color: "#b1b1b1",
    width: "50%",
    border: 0,
    background: "none",
    fontSize: 20,
  },
});
