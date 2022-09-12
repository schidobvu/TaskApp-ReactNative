import React, { useEffect, useState } from "react";
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
const TaskDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { id, title, details, completed, phoneID } = route.params;

  const [input, setInput] = useState(details);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [text, setText] = useState("Empty");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    // tempDate - tempolary date
    // fdate - format date
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    let fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
    setText(fDate + " - " + fTime);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  // update task details
  useEffect(() => {
    const unsubscribe = () => {
      updateDoc(doc(db, phoneID, id), {
        details: input,
        date: text,
      });
    };
    return () => {
      unsubscribe();
    };
  }, [input, text]);

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
          multiline={true}
        />
      </View>
      <View style={styles.dateInput}>
        <Button title="DatePicker" onPress={() => showMode("date")} />
        <Button title="DatePicker" onPress={() => showMode("time")} />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
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
