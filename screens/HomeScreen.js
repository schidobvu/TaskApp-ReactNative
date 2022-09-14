import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import ListItem from "../components/ListItem";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { deviceName } from "expo-device";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import NetInfo from "@react-native-community/netinfo";

export default function App() {
  const [connection, setConnection] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const phoneID = deviceName;

  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState("");
  const [option, setOption] = useState(1);

  //Checking internet connection
  useEffect(() => {
    NetInfo.fetch()
      .then((state) => {
        setConnection(state.isConnected);
      })
      .then(() => {
        setConnecting(false);
      });
  });

  //Getting tasks
  useEffect(() => {
    onSnapshot(
      query(collection(db, phoneID), orderBy("timestamp", "desc")),
      (snapshot) => {
        setTasks(snapshot.docs);
      }
    );
  }, []);

  //filtering tasks
  const filterTasks = async (status) => {
    try {
      if (status == "completed") {
        setOption(3);
        //Selecting only the completed tasks
        const q = query(
          collection(db, phoneID),
          where("completed", "==", true)
        );
        const querySnapshot = await getDocs(q);
        setTasks(querySnapshot.docs);
      } else if (status == "uncompleted") {
        setOption(2);
        //Selecting only the uncompleted tasks
        const q = query(
          collection(db, phoneID),
          where("completed", "==", false)
        );
        const querySnapshot = await getDocs(q);
        setTasks(querySnapshot.docs);
      } else {
        setOption(1);
        //Selecting all tasks
        const q = query(collection(db, phoneID));
        const querySnapshot = await getDocs(q);
        setTasks(querySnapshot.docs);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  //add task button handler
  const openAddTask = () => {
    if (connection) {
      setModalVisible(true);
    }
  };

  //storing a task
  const storeTask = () => {
    if (input !== "") {
      setInput("");
      setModalVisible(false);
      addDoc(collection(db, phoneID), {
        completed: false,
        text: input,
        details: "Add details",
        time: "set time",
        date: "set date",
        timestamp: serverTimestamp(),
      });
    }
  };

  //list item render function to be called in the flat list
  const renderItem = ({ item }) => <ListItem task={item} phoneID={phoneID} />;

  return (
    <View style={styles.container}>
      <Header />
      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity onPress={() => filterTasks("all")}>
          <Text
            style={
              option == 1 ? styles.filterButtonActive : styles.filterButton
            }
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterTasks("uncompleted")}>
          <Text
            style={
              option == 2 ? styles.filterButtonActive : styles.filterButton
            }
          >
            Uncompleted
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => filterTasks("completed")}>
          <Text
            style={
              option == 3 ? styles.filterButtonActive : styles.filterButton
            }
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {connecting && (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color="#ffa32a" />
        </View>
      )}

      {!connecting && connection && (
        <View style={styles.listItemsContainer}>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(task) => task.id}
          />
        </View>
      )}

      {!connection && !connecting && (
        <View style={styles.centeredView}>
          <Icon name="wifi-off" size={75} color="#696969" />
          <Text style={styles.notConnectedText}>not connected</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.addItemButton}
        onPress={() => openAddTask()}
      >
        <View style={styles.addItemButtonContent}>
          <Icon name="plus" size={25} color="#181818" />
          <Text style={styles.addItemButtonText}>Add Task</Text>
        </View>
      </TouchableOpacity>
      {/* Input Text Modal */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible && connection}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.inputContainer}
                onChangeText={(value) => setInput(value)}
                multiline={true}
              />
              <TouchableOpacity onPress={() => storeTask()}>
                <Icon
                  name="send"
                  size={30}
                  color="#ac9149"
                  style={{
                    transform: [{ rotate: "240deg" }],
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    paddingTop: 40,
  },
  filters: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  filterButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "#696969",
    borderWidth: 2,
    marginRight: 10,
    color: "#696969",
    fontWeight: "bold",
  },
  filterButtonActive: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 2,
    marginRight: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  listItemsContainer: {
    padding: 20,
    display: "flex",
  },
  addItemButton: {
    position: "absolute",
    bottom: 30,
    width: "100%",
  },
  addItemButtonContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffbf10",
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 10,
  },
  addItemButtonText: {
    color: "#181818",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "90%",
    marginBottom: 20,
    backgroundColor: "#2c2c2c",
    borderRadius: 5,
    padding: 35,
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    color: "#fff",
    borderBottomColor: "#ac9149",
    borderBottomWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,

    width: "80%",
    padding: 10,
  },
  centeredView: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    width: "100%",
  },
  notConnectedText: {
    color: "#696969",
    fontSize: 20,
  },
});
