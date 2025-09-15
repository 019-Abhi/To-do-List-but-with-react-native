import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {

  const router = useRouter();

  interface Task {
    id: string;
    title: string;
    description: string;
    urgency: string;
  }

  const urgencyWeight = {
    Urgent: 3,
    Medium: 2,
    Low: 1,
  };

  const [Tasks, setTasks] = useState<Task[]>([]);

  useFocusEffect(

    useCallback(() => {
      
      const loadTasks = async () => {
        const tasksJSON = await AsyncStorage.getItem('@tasks');
        const parsed = tasksJSON ? JSON.parse(tasksJSON) : [];

        const sorted = parsed.sort((a, b) => {
          return urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
        });

        setTasks(parsed);
      };
      loadTasks();
    }, [])
  );


  const renderItem = ({item}) => (

    <View style = {styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={[styles.urgency, item.urgency === 'Urgent' && {color: 'rgb(160, 111, 111)'}, item.urgency === 'Medium' && {color: 'rgb(144, 163, 202)'}, item.urgency === 'Low' && {color: 'rgb(122, 199, 139)'}]}>{item.urgency}</Text>

      <View style = {styles.TickColumn}>
        <Pressable onPress = {() => handleCompleteTask(item.id)}>
          <Icon name = 'check' size = {45} color = 'green' />
        </Pressable>
      </View>
    </View>

  )

  const handleCompleteTask = async (taskId) => {

    try{

      const newTasks = Tasks.filter(task => task.id !== taskId);
      await AsyncStorage.setItem('@tasks', JSON.stringify(newTasks));
      setTasks(newTasks);

    }
    catch (error){
      console.error('Error removing task', error);
    }
  };

  return (

    <SafeAreaProvider>
      <SafeAreaView style = {{ flex: 1, backgroundColor: 'rgb(114, 166, 168)' }}>

        <Animated.View entering={SlideInDown.duration(250)}>

          <View style = {styles.Window}>

            <View style = {styles.NavBar}>
              <Text style = {styles.NavBarText}> On It! </Text>
            </View>

            <View style = {styles.NavBarLine}/>

            <View style = {styles.MainBox}>

              <View style = {styles.TaskContainer}>
                <FlatList data = {Tasks} keyExtractor={item => item.id} renderItem = {renderItem} contentContainerStyle = {styles.listContent} showsVerticalScrollIndicator = {false} />
              </View>     

              <View style = {styles.AddNewView}>

                <Pressable style = {styles.AddNewButton} onPress = {() => router.push('/(tabs)/CreateNew')}> 
                  <Icon name="add" size={40} color="grey" />
                </Pressable>
                
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

    alignItems: 'center',
    justifyContent: 'flex-start',
  
  },

  MainBox: {

    backgroundColor: 'rgb(114, 166, 168)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'

  },
  
  NavBar: {

    height: '20%',  
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

  AddNewView: {

    position: 'fixed',    
    bottom: 15,              
    right: 55,
    width: 70,               
    height: 70,
    backgroundColor: 'white',
    borderRadius: 13,        
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,       

  },

  AddNewButton: {

    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },

  TaskContainer: {

    flex: 1,
    paddingTop: 35  ,
    width: '92%'
  
  },

  listContent: {

    paddingBottom: 90, 

  },

  card: {

    backgroundColor: 'rgb(214, 219, 221)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12, 
    elevation: 6, 

  },

  title: {

    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,

  },

  description: {

    fontSize: 15,
    color: '#333',
    marginBottom: 4,

  },

  urgency: {

    fontSize: 14,
    fontWeight: 'bold',
    
  },

  TickColumn: {

    width: 80,
    position: 'absolute',
    right: 20,
    height: '100%',
    top:20,

    justifyContent: 'center',
    alignItems: 'center',

  },

});

