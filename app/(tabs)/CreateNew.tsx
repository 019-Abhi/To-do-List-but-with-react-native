import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function CreateNewTask() {

  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Urgency, setUrgency] = useState('');

  const router = useRouter();

  const HandleCreateTast = async () => {

    if (!Title || !Urgency){
      alert('Please fill out all the fields');
      return;
    }

    const NewTask = {

      id: Date.now().toString(),
      title: Title,
      description: Description,
      urgency: Urgency,
      createdAt: new Date().toISOString(),

    };

    try {

      const ExistingTasksJSON = await AsyncStorage.getItem('@tasks');
      const ExistingTasks = ExistingTasksJSON ? JSON.parse(ExistingTasksJSON) : [];
      const UpdatedTasks = [...ExistingTasks, NewTask];

      await AsyncStorage.setItem('@tasks', JSON.stringify(UpdatedTasks));
      alert ('task saved');

      setTitle('');
      setDescription('');
      setUrgency('');
      router.push('/');

    }

    catch(error){
      console.error('Error saving task: ', error);
      alert('Failed to save task');
    };
  };

  
  return (

    <SafeAreaProvider>
      <SafeAreaView style = {{ flex: 1, backgroundColor: 'rgb(118, 189, 156)' }}>

        <View style = {styles.Window}>

          <View style = {styles.NavBar}>

            <Text> NAV  RIGHT HERE! </Text> 

          </View>

          <View style = {styles.MainBox}>
            <View style = {styles.FormContainer}>

              <TextInput style = {styles.TaskTitle} placeholder = 'Title' value = {Title} onChangeText = {setTitle} placeholderTextColor =  'rgba(0, 0, 0, 0.4)'/> 
              
              <TextInput style = {styles.TaskDescription} placeholder = 'Description' value = {Description} onChangeText = {setDescription} placeholderTextColor =  'rgba(0, 0, 0, 0.4)' />

              <View style = {styles.ImportanceBox}>
                <Text style = {styles.ImportanceText}> Set Importance </Text>
              </View>

              <View style = {styles.UrgencyBox}>

                <Pressable style = {[styles.UrgentButton, Urgency === 'Urgent' && {backgroundColor: 'rgb(160, 111, 111)'} ]} onPress={() => setUrgency('Urgent')}>
                  <Text style = {styles.UrgencyText}> Urgent </Text>
                </Pressable>

                <Pressable style = {[styles.MediumButton, Urgency === 'Medium' && {backgroundColor: 'rgb(107, 123, 158)'}]} onPress={() => setUrgency('Medium')}>
                  <Text style = {styles.UrgencyText}> Medium </Text>
                </Pressable>

                <Pressable style = {[styles.LowButton, Urgency === 'Low' && {backgroundColor: 'rgb(92, 175, 110)'}]} onPress={() => setUrgency('Low')}>
                  <Text style = {styles.UrgencyText}> Low </Text>
                </Pressable>

              </View>

              <Pressable style = {styles.CreateTaskButton} onPress = {HandleCreateTast} >
                <Text style = {styles.CreateButtonText}> Create Task </Text>
              </Pressable>

            </View>
          </View>

        </View>

      </SafeAreaView>
    </SafeAreaProvider>
                                                                                                                                   


  );
}

const styles = StyleSheet.create({

  Window: {

    width: '100%',
    height: '100%',

    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgb(118, 189, 156)',
  
  },

  MainBox: {

    backgroundColor: 'rgb(118, 189, 156)',
    width: '100%',
    height: '100%',
    paddingVertical: 140,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    

  },

  FormContainer: {

    backgroundColor: 'rgba(233, 227, 227, 0.9)',
    paddingTop: 65,
    paddingBottom: 30,
    borderRadius: 20,
    width: '92%',

    elevation: 50,
    justifyContent: 'center',
    alignItems: 'center',

  },
  
  NavBar: {

    backgroundColor: 'white',
    height: '10%',
    width: '100%',

  },

  TaskTitle: {

    width: '75%',
    padding: 20,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: 'white',
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    fontWeight: '800',
    textAlign: 'center'

  },

  TaskDescription: {

    width: '75%',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginTop: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    textAlign: 'center',

  },

  ImportanceBox: {

    width: '100%',
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2

  },

  ImportanceText: {

    fontSize: 17,
    fontWeight: '500',    
    letterSpacing: 0.5,        
    color: 'rgb(24, 51, 18)',             
    marginBottom: 8,
    textAlign: 'left',
    backgroundColor: 'white',
    fontFamily: '',
    borderRadius: 12,
    padding: 8

  },
  
  UrgencyBox: {

    width: '100%',
    height: 60,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20

  },

  UrgentButton: {

    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    minWidth: 100,

    alignItems: 'center',
    justifyContent: 'center',

  },

  MediumButton: {

    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    minWidth: 100,

    alignItems: 'center',
    justifyContent: 'center',

  },

  LowButton: {

    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    minWidth: 100,

    alignItems: 'center',
    justifyContent: 'center',

  },

  UrgencyText: {
    
    fontWeight: '600',
    fontSize: 14,
    color: '#000',

  },

  CreateTaskButton: {

    backgroundColor: 'rgb(209, 199, 199)',
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 40,
    borderRadius: 12,
    elevation: 5,
    alignItems: 'center',

  },

  CreateButtonText: {

    color: 'black',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  
  }
  

});
