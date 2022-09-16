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

  const { id, title, details, completed, taskTime, taskDate, phoneID } =
    route.params;

  const [detailsInput, setDetailsInput] = useState(details);
  const [titleInput, setTitleInput] = useState(title);
  const [isComplete, setIsComplete] = useState(completed);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [selectedTime, setSelectedTime] = useState(taskTime);
  const [selectedDate, setSelectedDate] = useState(taskDate);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    // tempDate - temporary date
    // fDate - format date
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    let fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
    setSelectedDate(fDate);
    setSelectedTime(fTime);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  // update task details
  useEffect(() => {
    const unsubscribe = () => {
      updateDoc(doc(db, phoneID, id), {
        details: detailsInput,
        date: selectedDate,
        time: selectedTime,
        title: titleInput,
      });
    };
    return () => {
      unsubscribe();
    };
  }, [detailsInput, titleInput, selectedDate, selectedTime]);

  //mark completed
  const updateCompleted = (value) => {
    updateDoc(doc(db, phoneID, id), {
      completed: value,
    }).then(() => {
      setIsComplete(value);
    });
  };

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
      <TextInput
        style={!isComplete ? styles.title : styles.titleUnderline}
        onChangeText={(value) => setTitleInput(value)}
        defaultValue={titleInput}
        multiline={true}
      />
      <View style={styles.details}>
        <Icon name="text" size={25} color="#868686" />
        <TextInput
          style={styles.inputContainer}
          onChangeText={(value) => setDetailsInput(value)}
          defaultValue={detailsInput}
          multiline={true}
        />
      </View>
      <View style={styles.dateInputContainter}>
        <Icon name="calendar-clock" size={25} color="#868686" />
        <View style={styles.dateTextContainer}>
          <Text onPress={() => showMode("date")} style={styles.dateText}>
            {selectedDate}
          </Text>
          <Text onPress={() => showMode("time")} style={styles.dateText}>
            {selectedTime}
          </Text>
        </View>

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
      <View style={styles.markCompleted}>
        <Icon
          name="check"
          size={40}
          onPress={() => updateCompleted(!isComplete)}
          style={
            isComplete
              ? styles.markCompletedIconChecked
              : styles.markCompletedIcon
          }
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
    color: "#cacaca",
    fontWeight: "bold",
  },
  titleUnderline: {
    fontSize: 30,
    marginTop: 30,
    paddingHorizontal: 10,
    color: "#a3a3a3",
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
  dateInputContainter: {
    display: "flex",
    flexDirection: "row",
    marginTop: 25,
    marginLeft: 10,
  },
  dateTextContainer: {
    display: "flex",
    marginLeft: 20,
  },
  dateText: {
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#b1b1b1",
    color: "#b1b1b1",
    marginBottom: 10,
  },
  markCompleted: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  markCompletedIcon: {
    padding: 15,
    borderColor: "#868686",
    borderWidth: 2,
    borderRadius: 99999,
    color: "#868686",
  },
  markCompletedIconChecked: {
    padding: 15,
    borderColor: "#ffbf10",
    borderWidth: 2,
    borderRadius: 99999,
    color: "#ffbf10",
  },
});
