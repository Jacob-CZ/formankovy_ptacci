import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, View, ViewStyle } from "react-native"
import { AppStackScreenProps, MainTabScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { Camera, CameraType, CameraView, useCameraPermissions } from "expo-camera"
import { useStores } from "app/models"
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { FontAwesome } from "@expo/vector-icons"
import { MaterialIcons } from "@expo/vector-icons"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface RecordingScreenProps extends MainTabScreenProps<"recording"> {}

export const RecordingScreen: FC<RecordingScreenProps> = observer(function RecordingScreen() {
  // Pull in one of our MST stores
  const { recording: recording1 } = useStores()
  const [recording, setRecording] = useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const camera = useRef<CameraView| null>(null)

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
    })();
  }, []);

  function takePicture(){
    camera.current?.takePictureAsync({base64:true}).then((picture) => {
      recording1.setImageBase64(picture?.base64 as string)
      recording1.setImageUri(picture?.uri as string)
    })
  }


  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording?.getURI();
    recording1.setSoundUri(uri!)
    const base64 = await FileSystem.readAsStringAsync(uri!, { encoding: FileSystem.EncodingType.Base64 });
    recording1.setSoundBase64(base64)
    console.log('Recording stopped and stored at', uri);
  }
  return (
    <Screen style={$root} preset="fixed">
      <CameraView style={$cameraView} ref={camera} mode="picture"/>
      <MaterialIcons style={$captureButton} onPress={takePicture} name="add-a-photo" size={50} color="black" />
      <FontAwesome style={$recordingButton} onPress={recording ? stopRecording : startRecording} name="microphone" size={50} color={recording? "red": undefined} />

    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
}
const $cameraView: ViewStyle = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 79,
}
const $captureButton: ViewStyle = {
  position: 'absolute',
  bottom: 85,
  alignSelf: "flex-start",
  left: 40
}
const $recordingButton: ViewStyle = {
  position: 'absolute',
  bottom: 80,
  alignSelf: 'flex-end',
  right: 40,
}

