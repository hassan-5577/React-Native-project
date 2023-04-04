import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sample from './sample.json';

const App = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  //the useEffect hook to load data from AsyncStorage when the component mounts
  // The loadData function is defined later in the code.
  useEffect(() => {
    //setData(sample.users);
    loadData();
  }, []);

  const handleSave = async () => {
    await saveData(name, email);
    setName('');
    setEmail('');
  };

  const handleUpdate = async (id) => {
    await updateData(id, name, email);
    setName('');
    setEmail('');
  };

  const handleDelete = async (id) => {
    await deleteData(id);
  };

  // --Read --
  /*This code defines the loadData function, 
  which retrieves data from AsyncStorage and updates the data
  state variable with the parsed users property of the retrieved data. 
  If an error occurs during this process, it is logged to the console*/
  const loadData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('sample');
      if (jsonData !== null) {
        setData(JSON.parse(jsonData).users);
      }else{
        setData(sample.users);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // --Write-- 
  /*saveData function, which creates a new user object using the name and email state 
  variables and pushes it onto the users property of the data object retrieved from AsyncStorage.
   The updated data object is then stored back in AsyncStorage*/

  const saveData = async () => {
    try {
      const newData = {
        id:  data ? data.length + 1 : 1,
        name: name,
        email: email,
      };
      const jsonData = await AsyncStorage.getItem('sample');
      const data = JSON.parse(jsonData);
      data.users.push(newData);
      await AsyncStorage.setItem('sample', JSON.stringify(data));
      setName('');
      setEmail('');
      loadData();
    } catch (e) {
      console.log(e);
    }
  };

//--Update --
/*updateData function, which retrieves the data object from AsyncStorage, 
finds the user with the specified id using the findIndex method, 
updates the name and email properties of the user, 
stores the updated data object back in AsyncStorage, 
and reloads the data using the loadData function*/

  const updateData = async (id, newName, newEmail) => {
    try {
      const jsonData = await AsyncStorage.getItem('sample');
      const data = JSON.parse(jsonData);
      const userIndex = data.users.findIndex(user => user.id === id);
      data.users[userIndex].name = newName;
      data.users[userIndex].email = newEmail;
      await AsyncStorage.setItem('sample', JSON.stringify(data));
      loadData();
    } catch (e) {
      console.log(e);
    }
  };

  // -- Delete --
  /*this is the delete function, first it gets the item stored, 
  filters out the matching ID and using the array.filters() and then remove
  the user with the matching ID.*/

  const deleteData = async id => {
    try {
      const jsonData = await AsyncStorage.getItem('sample');
      const data = JSON.parse(jsonData);
      const filteredData = data.users.filter(user => user.id !== id);
      data.users = filteredData;
      await AsyncStorage.setItem('sample', JSON.stringify(data));
      loadData();
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
        <View style={{ flex: 1 }}>
          <Text>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Button
            title="Edit"
            onPress={() => {
              setName(item.name);
              setEmail(item.email);
              handleUpdate(item.id);
            }}
          />
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Button
            title="Delete"
            onPress={() => {
              handleDelete(item.id);
            }}
          />
        </View>
      </View>
    );
  };
return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>User List</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      
      <TextInput
        placeholder="Name"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={name}
        //onChangeText={(text) => setName(text)}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={email}
       // onChangeText={(text) => setEmail(text)}
       onChangeText={setEmail}
      />
      <Button title="ADD" onPress={saveData}/>
    </View>
);
};
export default App;
