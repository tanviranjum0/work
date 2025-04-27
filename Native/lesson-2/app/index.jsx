import { View, Text, StyleSheet, ImageBackground, Pressable } from "react-native";
import React from "react";
import demoBg from "../assets/images/coffee.jpeg";
import { Link } from "expo-router";
const app = () => {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.image} source={demoBg}>
        <Text style={styles.text}>Home</Text>
        <Link Pressable asChild href="/contact" style={{ marginHorizontal: "auto" }}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Contact us</Text>
          </Pressable>
        </Link>
        <Link Pressable asChild href="/menu" style={{ marginHorizontal: "auto" }}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Menu</Text>
          </Pressable>
        </Link>
      </ImageBackground>
    </View >
  );
};

export default app;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    width: "100%",
    fontSize: 42,
    backgroundColor: "rgba(0,0,0,0.5)",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  link: {
    color: "white",
    width: "100%",
    fontSize: 42,
    textDecorationLine: "underline",
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    height: 60,
    marginBottom: 50,
    justifyContent: "center",
    color: "white",
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.60)",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonText: {
    color: "white",
    width: "100%",
    fontSize: 16,
    padding: 4,
    fontWeight: "bold",
    textAlign: "center",
  },
});
