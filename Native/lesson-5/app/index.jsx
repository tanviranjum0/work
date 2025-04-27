// import { Text, View, Pressable, TextInput, StyleSheet, FlatList, Appearance } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { data } from "@/data/todos.js";
// import { useState, useContext } from "react";
// import Octicons from '@expo/vector-icons/Octicons';
// import { ThemeContext } from "@/context/ThemeContext";
// import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter"
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import Animated, { LinearTransition } from "react-native-reanimated";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect } from "react";


// export default function Index() {
//   const [todos, setTodos] = useState([])
//   const [text, setText] = useState('')
//   const { setColorScheme, theme, colorScheme } = useContext(ThemeContext)
//   const [loaded, error] = useFonts({ Inter_500Medium })


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const jsonValue = await AsyncStorage.getItem('TodoApp')
//         const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null
//         if (storageTodos && storageTodos.length > 0) {
//           setTodos(storageTodos.sort((a, b) => b.id - a.id))
//         } else {
//           setTodos(data.sort((a, b) => b.id - a.id))
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     fetchData()
//   }, [data])

//   useEffect(() => {
//     const storeData = async () => {
//       try {
//         const jsonValue = JSON.stringify(todos)
//         await AsyncStorage.setItem('TodoApp', jsonValue)
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     storeData()

//   }, [todos])

//   if (!loaded || !!error) {
//     return null;
//   }

//   var styles = createStyles(theme, colorScheme)
//   const addTodo = () => {
//     if (text.trim()) {
//       const newId = todos.length > 0 ? todos[0].id + 1 : 1;
//       setTodos([{ id: newId, title: text, completed: false }, ...todos])
//       setText('')
//     }
//   }

//   const toggleTodo = (id) => {
//     setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo))
//   }

//   const removeTodo = (id) => {
//     setTodos(todos.filter(todo => todo.id !== id))
//   }

//   const handleAppearanceChange = () => {
//     if (colorScheme === 'light') {
//       setColorScheme('dark')
//     } else if (colorScheme === 'dark') {
//       setColorScheme('light')
//     }
//   }

//   const renderItem = ({ item }) => (
//     <View style={styles.todoItem}>
//       <Text
//         style={[styles.todoText, item.completed && styles.completedText]}
//         onPress={() => toggleTodo(item.id)}
//       >
//         {item.title}
//       </Text>
//       <Pressable onPress={() => removeTodo(item.id)}>
//         <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined} />
//       </Pressable>
//     </View>
//   )


//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.inputContainer}>
//         <TextInput
//           // onSubmitEditing={() => addTodo()}
//           placeholderTextColor={"gray"}
//           value={text}
//           onChangeText={(t) => setText(t)}
//           placeholder={"Add a New Todo"}
//           style={styles.input}
//         />
//         <Pressable onPress={addTodo} style={styles.addButton}>
//           <Text style={styles.addButtonText}>Add</Text>
//         </Pressable>
//         <Pressable onPress={() => handleAppearanceChange(colorScheme)} style={{ marginLeft: 10 }}>
//           {colorScheme === "dark" ? <Octicons name="sun" size={36} color="white" /> : <Octicons name="moon" size={36} color="black" />}
//         </Pressable>
//       </View>
//       <Animated.FlatList
//         data={todos}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
//         itemLayoutAnimation={LinearTransition}
//         keyboardDismissMode="on-drag"
//       />
//     </SafeAreaView>
//   );
// }



// function createStyles(theme, colorScheme) {
//   return StyleSheet.create({
//     container: {
//       flex: 1,
//       marginHorizontal: "auto",
//       width: "100%",
//       backgroundColor: theme.background,
//     },
//     inputContainer: {
//       color: theme.text,
//       flexDirection: "row",
//       justifyContent: "center",
//       alignItems: "center",
//       marginBottom: 10,
//       padding: 10,
//       width: "100%",
//       maxWidth: 1024,
//       marginHorizontal: "auto",
//       pointerEvents: "auto",
//     },
//     input: {
//       flex: 1,
//       borderColor: "gray",
//       borderRadius: 5,
//       borderWidth: 1,
//       marginRight: 10,
//       fontSize: 18,
//       fontFamily: Inter_500Medium,
//       padding: 10,
//       minWidth: 0,
//       color: theme.text,
//     },
//     addButton: {
//       backgroundColor: theme.text,
//       borderRadius: 5,
//       padding: 10,
//     },
//     addButtonText: {
//       color: colorScheme === "dark" ? "black" : "white",
//       fontSize: 18,
//     },
//     todoItem: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       gap: 4,
//       padding: 10,
//       borderBottomWidth: 1,
//       borderBottomColor: "gray",
//       marginHorizontal: "auto",
//       marginVertical: 5,
//       width: "100%",
//       maxWidth: 1024,
//       pointerEvents: "auto",
//     },
//     todoText: {
//       flex: 1,
//       fontFamily: "Inter_500Medium",
//       fontSize: 18,
//       color: theme.text,

//     },
//     completedText: {
//       textDecorationLine: "line-through",
//       color: "gray",
//     },
//     deleteButton: {
//       backgroundColor: "red",
//       borderRadius: 5,
//       marginRight: 10,
//       padding: 10,
//     },
//     deleteButtonText: {
//       color: theme.text,
//       fontSize: 18,
//     },
//     deleteIcon: {
//       color: "red",
//     },
//   })
// }



import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from "expo-router";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Animated, { LinearTransition } from 'react-native-reanimated'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

import Octicons from '@expo/vector-icons/Octicons'

import { data } from "@/data/todos"

export default function Index() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)

  const [loaded, error] = useFonts({
    Inter_500Medium,
  })
  const router = useRouter()
  const handlePress = (id) => {
    router.push(`/todos/${id}`)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id))
        } else {
          setTodos(data.sort((a, b) => b.id - a.id))
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()
  }, [data])

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("TodoApp", jsonValue)
      } catch (e) {
        console.error(e)
      }
    }

    storeData()
  }, [todos])

  if (!loaded && !error) {
    return null
  }

  const styles = createStyles(theme, colorScheme)

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos])
      setText('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  }

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Pressable onPress={() => handlePress(item.id)} onLongPress={() => toggleTodo(item.id)}>
        <Text
          style={[styles.todoText, item.completed && styles.completedText]}
        >
          {item.title}
        </Text>
      </Pressable>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined} />
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTodo}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        <Pressable
          onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 10 }}>
          <Octicons name={colorScheme === 'dark' ? "moon" : "sun"} size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />
        </Pressable>
      </View>
      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      padding: 10,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      minWidth: 0,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    }
  })
}