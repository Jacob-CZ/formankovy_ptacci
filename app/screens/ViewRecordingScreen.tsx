import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Image, ImageStyle, Dimensions, TextStyle, View } from "react-native"
import {  MainTabScreenProps } from "app/navigators"
import { Button, DrawerIconButton, Screen, Text } from "app/components"
import { useStores } from "app/models"
import { supabase } from "app/supbase/supabase"
import { decode } from "base64-arraybuffer"
import Feather from "@expo/vector-icons/Feather"
import * as Location from "expo-location"
import { Drawer } from "react-native-drawer-layout"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { FontAwesome } from "@expo/vector-icons"
import Toast from "react-native-toast-message"
import { Audio } from "expo-av"
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated"
import { is } from "date-fns/locale"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface BirdResponse {
  predicted_class: string
  confidence: number
}

interface ViewRecordingScreenProps extends MainTabScreenProps<"viewRecording"> {}

export const ViewRecordingScreen: FC<ViewRecordingScreenProps> = observer(
  function ViewRecordingScreen(_props) {
    const {navigation} = _props
    // Pull in one of our MST stores
    const {
      recording,
      auth: { user, revalidateAuthStatus },
    } = useStores()
    const [predictedClass, setPredictedClass] = useState("")
    const [confidence, setConfidence] = useState(0)
    const [open, setOpen] = React.useState(false)
    const [sound, setSound] = useState<Audio.Sound>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSent, setIsSent] = useState(false)
    const $ContainerInsets = useSafeAreaInsetsStyle(["top"])

    useEffect(() => {
      ;(async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          console.log("Permission to access location was denied")
        }
      })()
    }, [])
    useEffect(() => {
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);
    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: withSpring( isSent ? -2000 : 0, {mass: 10}) }],
      };
    });
    function animateSend(){
      setIsSent(true)
      setTimeout(() => {
        setIsSent(false)
        recording.deleteUri()
      }, 1000);
    }
    async function saveToDb() {
      if (!recording.imageBase64) {
        console.log("no image")
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No image",
        })
        return
      }
      if (!recording.soundBase64) {
        console.log("no sound")
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No sound",
        })
        return
      }
      animateSend()
      findBird()
      const location = await Location.getCurrentPositionAsync({})

      const { data: data1, error: error1 } = await supabase
        .from("records")
        .insert({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        })
        .select()
        .single()
      console.log("error", error1)
      if (!data1) return
      const id = data1.id
      console.log("id", id)


      const { data, error } = await supabase.storage
        .from("birdImages")
        .upload(id, decode(recording.imageBase64!), {
          contentType: "image/png",
        })
      // console.log("error", error)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message,
      })
      const { data: data2, error: error2 } = await supabase.storage
        .from("birdSounds")
        .upload(id, decode(recording.soundBase64!), {
          contentType: "audio/mpeg",
        })
      // console.log("error", error2)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error2?.message,
      })
      Toast.show({
        type: "success",
        text1: "Uploaded",
        text2: "Your recording has been uploaded",
      })
    }
    async function findBird() {
      try {
        const res = await fetch(
          "https://f4a0-77-236-222-22.ngrok-free.app/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ audio_file: recording.soundBase64 }),
          },
        )
        const data = await res.json() as BirdResponse
        setPredictedClass(data.predicted_class)
        setConfidence(data.confidence)
        console.log(data)
      } catch (error) {
        // console.error("Failed to start recording", error)
      }
    }
    function toggleDrawer() {
      setOpen(!open)
    }
    async function logOut() {
      await supabase.auth.signOut()
      revalidateAuthStatus()
    }

    function DrawerContent() {
      return (
        <Screen safeAreaEdges={["top"]}>
          <View>
            <View style={$userView}>
              <FontAwesome name="user-circle" size={50} />
              <Text>{user.email}</Text>
            </View>
            <Button style={$logoutButton} text="Message support" onPress={()=> navigation.push("SupportMessaging")}></Button>
            <Button style={$logoutButton} text="log out" onPress={logOut}></Button>
          </View>
        </Screen>
      )
    }
    async function playSound() {

      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync({uri: recording.soundUri!});
      setSound(sound);
  
      console.log('Playing Sound');
      setIsPlaying(true)
      await sound.playAsync();
      // setIsPlaying(false)
    }
    async function stopSound() {
      console.log('Stopping Sound');
      setIsPlaying(false)
      await sound?.stopAsync();
    }
  


    return (
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        drawerType="back"
        drawerPosition="left"
        renderDrawerContent={() => <DrawerContent />}
      >
          <Screen safeAreaEdges={["top"]} style={$root} preset="fixed">
            <DrawerIconButton onPress={toggleDrawer} />
            <View style={{ marginTop: -115, zIndex: -1 }}>
            <Animated.View
              style={animatedStyles}
              
            >
              {recording.imageUri ?
                <Image
                  resizeMode="contain"
                  source={{ uri: recording.imageUri || undefined }}
                  style={$image}
                />
                :
                <View style={$image}/>
              }
              </Animated.View>
              <Text text={predictedClass || undefined} style={$classText} />
              <Text text={String(confidence)} style={$confidenceText} />
              <Feather
                name="upload"
                size={64}
                color="black"
                onPress={saveToDb}
                style={$uploadButton}
                suppressHighlighting
              />
              <Feather
                name={isPlaying ? "pause" : "play"}
                size={64}
                color="black"
                onPress={isPlaying ? stopSound : playSound}
                style={$playButton}
                suppressHighlighting
              />
            </View>
          </Screen>
      </Drawer>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  top: 0,
}
const $image: ImageStyle = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height - 79,
}
const $uploadButton: ViewStyle = {
  position: "absolute",
  bottom: 80,
  paddingLeft: 30,
  alignSelf: "flex-start",
}
const $classText: TextStyle = {
  padding: 10,
  fontSize: 30,
  position: "absolute",
  bottom: 150,
  alignSelf: "center",
  color: "green",
}
const $confidenceText: TextStyle = {
  padding: 10,
  fontSize: 30,
  position: "absolute",
  bottom: 200,
  alignSelf: "center",
  color: "green",
}
const $userView: ViewStyle = {
  // backgroundColor: colors.error,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 10,
  paddingRight: 60,
}
const $logoutButton: ViewStyle = {
  margin: 10,
  borderRadius: 20,
}
const $playButton: ViewStyle = {
  position: "absolute",
  bottom: 80,
  alignSelf: "flex-end",
  paddingRight: 30,
}