import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

function ListItem({ task, phoneID }) {
  const navigation = useNavigation();

  //update task
  const updateTask = () => {
    if (task.data().completed) {
      updateDoc(doc(db, phoneID, task.id), {
        completed: false,
      });
    } else {
      updateDoc(doc(db, phoneID, task.id), {
        completed: true,
      });
    }
  };

  //delete task
  const deleteTask = () => {
    deleteDoc(doc(db, phoneID, task.id));
  };

  //go to task and carry task data
  const gotoTask = () => {
    navigation.navigate("Task", {
      id: task.id,
      title: task.data().text,
      details: task.data().details,
      completed: task.data().completed,
      taskTime: task.data().time,
      taskDate: task.data().date,
      phoneID: phoneID,
    });
  };

  return (
    <TouchableOpacity style={styles.listItem} onPress={() => gotoTask()}>
      <View style={styles.leftSection}>
        {task.data().completed ? (
          <Icon
            name="check-circle"
            size={25}
            color="#ffa32a"
            onPress={() => updateTask()}
          />
        ) : (
          <Icon
            name="checkbox-blank-circle-outline"
            size={25}
            color="#ffffff"
            onPress={() => updateTask()}
          />
        )}
        <Text
          style={
            !task.data().completed
              ? styles.listItemText
              : styles.listItemTextUnderline
          }
          numberOfLines={1}
        >
          {task.data().text}
        </Text>
      </View>
      <Icon
        name="minus"
        size={25}
        color="#ffffff"
        onPress={() => deleteTask()}
      />
    </TouchableOpacity>
  );
}

export default ListItem;
const styles = StyleSheet.create({
  listItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#2c2c2c",
    borderRadius: 5,
    marginBottom: 15,
  },
  leftSection: {
    flex: 0.9,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  listItemUnCheckedIcon: {
    padding: 5,
    borderRadius: 999999,
    borderWidth: 1,
    borderColor: "#fff",
  },
  listItemText: {
    fontSize: 20,
    color: "#e2e2e2",
    fontWeight: "bold",
    marginLeft: 10,
  },
  listItemTextUnderline: {
    fontSize: 20,
    color: "#9c9c9c",
    fontWeight: "bold",
    marginLeft: 10,
    textDecorationLine: "line-through",
  },
});
