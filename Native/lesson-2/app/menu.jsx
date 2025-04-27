import { StyleSheet, Appearance, Platform, SafeAreaView, Pressable, ScrollView, FlatList, View, Text, Image } from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors"
import { MENU_ITEMS } from "../constants/MenuItems";
import MENU_IMAGES from "../constants/MenuImages";
export default function MenuScreen() {
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const styles = createStyles(theme, colorScheme)
    const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
    const separatorComponent = <View style={styles.separator} />;
    const headerComponent = <Text style={styles.text}>Top of list</Text>;
    const footerComponent = <Text style={styles.text}>End of Menu</Text>;
    return (
        <Container>
            <FlatList
                // ListHeaderComponent={headerComponent}
                ListFooterComponent={footerComponent}
                ListEmptyComponent={<Text style={styles.text}>No items found</Text>}
                ListFooterComponentStyle={styles.footerStyle}
                ItemSeparatorComponent={separatorComponent}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                keyExtractor={(item) => item.id.toString()} data={MENU_ITEMS} renderItem={({ item }) => (
                    <View style={styles.row}>
                        <View style={styles.menuTextRow}>
                            <Text style={[styles.menuItemText, styles.menuItemTitle]}>{item.title}</Text>
                            <Text style={styles.menuItemText}>{item.description}</Text>
                        </View>
                        <Image style={styles.menuImageStyle} borderRadius={10} source={MENU_IMAGES[item.id - 1]} />
                    </View>
                )}
            />
            <Link Pressable asChild href="/" style={{ marginHorizontal: "auto" }}>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Home</Text>
                </Pressable>
            </Link>
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
        menuTextRow: {
            paddingRight: 5,
            paddingLeft: 10,
            width: "65%",
            paddingTop: 10,
            flexGrow: 1,
        },
        footerStyle: {
            paddingTop: 20,
            paddingBottom: 20,
            marginHorizontal: "auto",
        },
        separator: {
            height: 1,
            backgroundColor: colorScheme === "dark" ? "papayawhip" : "#000",
            width: "50%",
            maxWidth: 300,
            marginHorizontal: "auto",
            marginBottom: 10
        },
        container: {
            flex: 1,
            flexDirection: "column",
        },
        button: {
            height: 60,
            justifyContent: "center",
            color: colorScheme === "dark" ? "black" : "white",
            width: "100%",
            backgroundColor: colorScheme === "dark" ? "papayawhip" : "#000",
            padding: 6,
        },
        menuItemTitle: {
            fontSize: 24,
            textDecorationLine: "underline"
        },
        menuItemText: {
            color: theme.text,
            fontSize: 18,

        },
        menuImageStyle: {
            width: 100,
            height: 100
        },
        buttonText: {
            color: colorScheme === "dark" ? "black" : "white",
            width: "100%",
            fontSize: 16,
            padding: 4,
            fontWeight: "bold",
            textAlign: "center",
        },
        image: {
            resizeMode: "cover",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        },

        row: {
            flexDirection: "row",
            width: "100%",
            maxWidth: 600,
            marginHorizontal: "auto",
            marginBottom: 20,
            // padding: 10,
            borderRadius: 20,
            overflow: "hidden",
            marginHorizontal: "auto",
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "papayawhip" : "#000",
        },

    });
}