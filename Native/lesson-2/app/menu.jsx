import { StyleSheet, Appearance, Platform, SafeAreaView, ScrollView, FlatList, View, Text, Image } from "react-native";
import { Colors } from "@/constants/Colors"
import { MENU_ITEMS } from "../constants/MenuItems";
import MENU_IMAGES from "../constants/MenuImages";
export default function MenuScreen() {
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const styles = createStyles(theme, colorScheme)
    const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
    return (
        <Container>
            <FlatList showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                keyExtractor={(item) => item.id.toString()} data={MENU_ITEMS} renderItem={({ item }) => (
                    <View>
                        <View>
                            <Text>{item.title}</Text>
                            <Text>{item.description}</Text>
                        </View>
                        <Image source={MENU_IMAGES[item.id - 1]} />
                    </View>
                )}
            />
        </Container>
    )

}
function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        contentContainer: {
            color: theme.text,
            paddingTop: 10,
            paddingBottom: 20,
            paddingHorizontal: 20,
            backgroundColor: theme.background,
        },
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
            color: theme.text,
            width: "100%",
            fontSize: 42,
            backgroundColor: theme.background,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
        },
        link: {
            color: theme.text,
            width: "100%",
            fontSize: 42,
            textDecorationLine: "underline",
            padding: 4,
            backgroundColor: theme.background,
            fontWeight: "bold",
            textAlign: "center",
        },
        buttonText: {
            color: "white"
        }
    });
}