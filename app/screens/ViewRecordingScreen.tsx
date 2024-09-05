import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Image, ImageStyle, Dimensions, TextStyle } from "react-native"
import { AppStackScreenProps, MainTabScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { useStores } from "app/models"
import { supabase } from "app/supbase/supabase"
import * as FileSystem from 'expo-file-system';
import { decode } from "base64-arraybuffer"
import uuid from 'react-native-uuid'
import Feather from "@expo/vector-icons/Feather"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ViewRecordingScreenProps extends MainTabScreenProps<"viewRecording"> {}

export const ViewRecordingScreen: FC<ViewRecordingScreenProps> = observer(function ViewRecordingScreen() {
  // Pull in one of our MST stores
  const { recording } = useStores()
  const [predictedClass, setPredictedClass] = useState()
  const [confidence, setConfidence] = useState()
  async function saveToDb(){
    findBird()
    const id = uuid.v4().toString()

    const {data, error} =  await supabase.storage.from("birdImages").upload(id, decode(recording.imageBase64!), {
      contentType: 'image/png'
    })
    console.log("error", error)
    const {data: data2, error: error2} =  await supabase.storage.from("birdSounds").upload(id, decode(recording.soundBase64!), {
      contentType: 'audio/mpeg'
    })
    console.log("error", error2)
  }
  async function findBird() {
    try {
      const res = await fetch('https://fede-2a00-11b1-10e1-7169-fecb-1110-1e74-e704.ngrok-free.app/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({audio_file: recording.soundBase64}),
    })
    const data = await res.json() 
    setPredictedClass(data.predicted_class)
    setConfidence(data.confidence)
    console.log(data)      
    } catch (error) {
      console.error('Failed to start recording', error);
      
    }

    
  }
  return (
    <Screen style={$root} preset="fixed">
      <Image source={{uri: recording.imageUri || undefined}} style={$image}/>
      <Text text={predictedClass} style={$classText}/>
      <Text text={confidence} style={$confidenceText}/>
      <Feather name="upload" size={64} color="black" onPress={saveToDb} style={$uploadButton} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
const $image: ImageStyle = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 79,
}
const $uploadButton: ViewStyle = {
  position:"absolute",
  bottom:80,
  alignSelf:"center"
}
const $classText: TextStyle = {
  padding: 10,
  fontSize: 30,
  position: "absolute",
  bottom: 150,
  alignSelf: "center",
  color: "green"
}
const $confidenceText: TextStyle = {
  padding: 10,
  fontSize: 30,
  position: "absolute",
  bottom: 200,
  alignSelf: "center",
  color: "green"
}
