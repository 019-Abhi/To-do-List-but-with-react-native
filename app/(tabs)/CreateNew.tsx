
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CreateNewTask(){

  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Urgency, setUrgency] = useState('');
  const [DatePicker, setDatePicker] = useState(false);
  const [TimePicker, setTimePicker] = useState(false);
  const [Deadline, setDeadline] = useState(null);
  const [DateTemp, setDateTemp] = useState(null);

  const router = useRouter();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  async function scheduleDeadlineNotification(deadline: Date, title: string) {

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Enable notifications to get reminders!");
      return;
    }

    Notifications.scheduleNotificationAsync({
      content: {
        title: `Task Deadline: ${title}`,
        body: "Your task is due very soon!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: deadline,
      },

    });
  }

  const HandleCreateTask = async () => {

    if (!Title || !Urgency){
      alert('Please fill out all the fields');
      return;
    }

    let NewTask = {}

    if (Deadline){
      NewTask = {
        id: Date.now().toString(),
        title: Title,
        description: Description,
        urgency: Urgency,
        deadline: Deadline.toISOString(),
      };
    } else {
      NewTask = {
        id: Date.now().toString(),
        title: Title,
        description: Description,
        urgency: Urgency,
      };
    };

    try {

      const ExistingTasksJSON = await AsyncStorage.getItem('@tasks');
      const ExistingTasks = ExistingTasksJSON ? JSON.parse(ExistingTasksJSON) : [];
      const UpdatedTasks = [...ExistingTasks, NewTask];

      await AsyncStorage.setItem('@tasks', JSON.stringify(UpdatedTasks));

      if (Deadline)
        await scheduleDeadlineNotification(Deadline, Title);

      setTitle('');
      setDescription('');
      setUrgency('');
      router.push('/HomePage');

    }

    catch(error){
      console.error('Error saving task: ', error);
      alert('Failed to save task');
    };


  };

  
  return (

    <SafeAreaProvider>
      <SafeAreaView style = {{ flex: 1, backgroundColor: 'rgb(114, 166, 168)'}}>

        <Animated.View entering={SlideInDown.duration(250)}>

          <View style = {styles.Window}>

            <View style = {styles.NavBar}>
              <Text style = {styles.NavBarText}> ON IT! </Text> 
            </View>

            <View style = {styles.NavBarLine} />

            <View style = {styles.BackButtonView}>

              <Pressable style = {styles.BackButton} onPress = {() => router.push('/HomePage')}>
                <Icon name="arrow-back" size={24} color="#000" />
              </Pressable>

            </View>

            <View style = {styles.MainBox}>
              <View style = {styles.FormContainer}>

                <TextInput style = {styles.TaskTitle} placeholder = 'Title' value = {Title} onChangeText = {setTitle} placeholderTextColor =  'rgba(0, 0, 0, 0.4)'/> 
                
                <TextInput style = {styles.TaskDescription} placeholder = 'Description' value = {Description} onChangeText = {setDescription} placeholderTextColor =  'rgba(0, 0, 0, 0.4)' />

                <View style = {styles.UrgencyBox}>

                  <Pressable style = {[styles.UrgentButton, Urgency === 'Urgent' && {backgroundColor: 'rgb(160, 111, 111)'} ]} onPress={() => setUrgency('Urgent')}>
                    <Text style = {styles.UrgencyText}> Urgent </Text>
                  </Pressable>

                  <Pressable style = {[styles.MediumButton, Urgency === 'Medium' && {backgroundColor: 'rgb(144, 163, 202)'}]} onPress={() => setUrgency('Medium')}>
                    <Text style = {styles.UrgencyText}> Medium </Text>
                  </Pressable>

                  <Pressable style = {[styles.LowButton, Urgency === 'Low' && {backgroundColor: 'rgb(122, 199, 139)'}]} onPress={() => setUrgency('Low')}>
                    <Text style = {styles.UrgencyText}> Low </Text>
                  </Pressable>

                </View>

                <Pressable style = {styles.AddDeadlineButton} onPress = {() => setDatePicker(true)}>
                  <Text style = {styles.DeadlineButtonText}> Add Deadline 📅 </Text>
                </Pressable>

                <Pressable style = {styles.CreateTaskButton} onPress = {HandleCreateTask} >
                  <Text style = {styles.CreateButtonText}> Create Task </Text>
                </Pressable>

                {DatePicker && (
                  <DateTimePicker 
                    display='calendar'
                    design = 'material'
                    value = {Deadline ? new Date(Deadline) : new Date()}
                    
                    onChange={(event, selectedDate) => {
                      setDatePicker(false);

                      if (event.type == 'dismissed'){
                        return;
                      }

                      if (selectedDate){
                        setTimePicker(true);
                        setDateTemp(selectedDate);

                      }
                    }} 
                  />
                )}


                {TimePicker && (
                  <DateTimePicker 
                    mode = 'time'
                    design = 'material'
                    value = {Deadline ? new Date(Deadline) : new Date()}
                    onChange={(event, selectedTime) => {
                      setTimePicker(false);

                      if (event.type == 'dismissed'){
                        setDateTemp(null);
                        return;
                      }


                      const base = new Date(DateTemp || Deadline || new Date());
                      base.setHours(selectedTime.getHours());
                      base.setMinutes(selectedTime.getMinutes());
                      base.setSeconds(0);

                      setDeadline(base);    
                      setDateTemp(null);     
                      console.log("Saved Deadline:", base.toString()); 

                    }} 
                  />
                )}

              </View>
            </View>
          </View>

        </Animated.View>
      </SafeAreaView>
    </SafeAreaProvider>
                                                                                                                                  


  );
}

const styles = StyleSheet.create({

  Window: {

    width: '100%',
    height: '100%',

    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  
  },

  NavBar: {

    height: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },

  NavBarText: {
    fontFamily: 'Roboto',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#1a1a1a', 
    textAlign: 'center',
  },

  NavBarLine: {

    height: 1,
    backgroundColor: '#ccc',
    width: '100%',

  },

  BackButtonView: {

    backgroundColor: 'rgba(233, 227, 227, 0.9)',
    marginTop: 40,
    marginLeft: 16, 
    borderRadius: 15,
    height: 60,

  },

  BackButton: {

    backgroundColor: 'rgba(233, 227, 227, 0.9)',
    width: '100%',
    height: '100%',
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 15,

    justifyContent: 'center',
    alignItems: 'center',

  },

  BackButtonText: {

    fontWeight: '600',
    fontSize: 14,
    color: '#000',

  },

  MainBox: {

    backgroundColor: 'rgb(114, 166, 168)',
    width: '100%',
    height: '100%',
    paddingVertical: 25,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    
  },

  FormContainer: {

    backgroundColor: 'rgba(233, 227, 227, 0.9)',
    paddingTop: 50,
    paddingBottom: 30,
    borderRadius: 20,
    width: '92%',

    elevation: 50,
    justifyContent: 'center',
    alignItems: 'center',

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
  
  UrgencyBox: {

    width: '100%',
    height: 60,
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,

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

  AddDeadlineButton: {

    backgroundColor: 'rgb(255, 255, 255)',
    paddingVertical: 14,
    marginTop: 45,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    minWidth: 100,

    alignItems: 'center',
    justifyContent: 'center',

  },

  DeadlineButtonText: {

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
  
  },
  
});

