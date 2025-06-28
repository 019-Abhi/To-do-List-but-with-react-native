import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen() {

  const router = useRouter();

  return (

    <SafeAreaProvider>
      <SafeAreaView style = {{ flex: 1, backgroundColor: 'rgb(118, 189, 156)' }}>

        <View style = {styles.Window}>

          <View style = {styles.NavBar}>

            <Text> NAV BAR RIGHT HERE! </Text>

          </View>

          <View style = {styles.MainBox}>

            <View style = {styles.AddNewView}>
              <Pressable style = {styles.AddNewButton} onPress = {() => router.push('/(tabs)/CreateNew')}> 
                <Icon name="add" size={40} color="grey" />
              </Pressable>
            </View>

            <Text> HALLO PAOLOOOOOOOO </Text>

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
    backgroundColor: 'rgb(118, 189, 156)'
  
  },

  MainBox: {

    backgroundColor: 'rgb(118, 189, 156)',
    width: '100%',
    height: '100%',
    paddingVertical: 140,
    

  },
  
  NavBar: {

    backgroundColor: 'white',
    height: '10%',
    width: '100%',

  },

  AddNewView: {

    position: 'absolute',    
    bottom: 115,              
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

});
