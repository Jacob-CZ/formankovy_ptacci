import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps, MainTabScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { Camera, CameraType, CameraView, useCameraPermissions } from "expo-camera"
import { useStores } from "app/models"
import { Audio } from "expo-av"
import * as FileSystem from "expo-file-system"
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import MaskedView from "@react-native-masked-view/masked-view"
import { colors } from "app/theme"
import Toast from "react-native-toast-message"
import * as Nav from "@react-navigation/native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface RecordingScreenProps extends MainTabScreenProps<"recording"> {}

export const RecordingScreen: FC<RecordingScreenProps> = observer(function RecordingScreen(_props) {
  // Pull in one of our MST stores
  const { recording: recording1 } = useStores()
  const [recording, setRecording] = useState<Audio.Recording>()
  const [permissionResponse, requestPermission] = Audio.usePermissions()
  const [volume, setVolume] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const camera = useRef<CameraView | null>(null)
  const route = Nav.useRoute()
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      const audioStatus = await Camera.requestMicrophonePermissionsAsync()
    })()
  }, [])

  function takePicture() {
    camera.current?.takePictureAsync({ base64: true }).then((picture) => {
      recording1.setImageBase64(picture?.base64 as string)
      recording1.setImageUri(picture?.uri as string)
    })
    Toast.show({
      type: "success",
      text1: "Picture taken",
    })
  }

  const [image, setImage] = useState<string | null>(null)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      recording1.setImageUri(result.assets[0].uri)
      recording1.setImageBase64(result.assets[0].base64 as string)
    }
  }

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..")
        await requestPermission()
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      console.log("Starting recording..")
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          setVolume(1 - Math.abs(status.metering as number) / 100)
        },
        100,
      )
      setRecording(recording)
      console.log("Recording started")
    } catch (err) {
      console.error("Failed to start recording", err)
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..")
    setRecording(undefined)
    await recording?.stopAndUnloadAsync()
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })
    const uri = recording?.getURI()
    recording1.setSoundUri(uri!)
    const base64 = await FileSystem.readAsStringAsync(uri!, {
      encoding: FileSystem.EncodingType.Base64,
    })
    recording1.setSoundBase64(base64)
    console.log("Recording stopped and stored at", uri)
  }
  return (
    <Screen style={$root} preset="fixed">
      <CameraView style={$cameraView} ref={camera} mode="picture" />
      <MaterialIcons
        style={$captureButton}
        onPress={takePicture}
        name="add-a-photo"
        size={50}
        color="black"
        suppressHighlighting

      />
      <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
        <MaskedView
          style={$recordingButton}
          maskElement={<FontAwesome name="microphone" size={50} color="tranparent" />}
        >
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: colors.tint,
              top: recording ? 50 - volume * 50 : 0,
            }}
          ></View>
        </MaskedView>
      </TouchableOpacity>
      <FontAwesome
        name="file-image-o"
        size={50}
        onPress={pickImage}
        style={$imagePickerButton}
        suppressHighlighting
      ></FontAwesome>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}
const $cameraView: ViewStyle = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height - 79,
}
const $captureButton: ViewStyle = {
  position: "absolute",
  bottom: 85,
  alignSelf: "flex-start",
  left: 40,
}
const $recordingButton: ViewStyle = {
  position: "absolute",
  bottom: 80,
  alignSelf: "flex-end",
  right: 40,
}
const $imagePickerButton: ViewStyle = {
  position: "absolute",
  bottom: 80,
  alignSelf: "center",
}
