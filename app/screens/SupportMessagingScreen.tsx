import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { KeyboardAvoidingView, Platform, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Input, Screen, Text } from "app/components"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { adminId, supabase } from "app/supbase/supabase"
import { MessageModel, useStores } from "app/models"
import Toast from "react-native-toast-message"
import { colors } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface SupportMessagingScreenProps extends AppStackScreenProps<"SupportMessaging"> {}

export const SupportMessagingScreen: FC<SupportMessagingScreenProps> = observer(function SupportMessagingScreen() {
  const [message, setMessage] = useState("")
  const {auth, messageStore:{messages, addMessage}} = useStores()
  const $safeAreaInsets = useSafeAreaInsetsStyle(["bottom"])
  const $inputStyle: ViewStyle= {
    marginBottom: $safeAreaInsets.paddingBottom + 40
  }
  async function sendMessage(){

    if(message.length < 1){
      return
    }
    addMessage(MessageModel.create({text:message}))
    setMessage("")
    supabase.from("messages").insert({sender:auth.user.id, reciever:adminId, message})

  }
  
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
  <KeyboardAvoidingView
  style={$root}
  behavior={"padding"}
  >
    <Input onEndEditing={sendMessage} style={$inputStyle} onChangeText={setMessage} value={message}/>
    <View> 
      {messages.toReversed().map((mess, i)=>(
        <Text key={i} style={$messageStyle}>
          {mess.text}
        </Text>
      ))}
    </View>
  </KeyboardAvoidingView>
  )
  // Tom was here on friday
})

const $root: ViewStyle = {
  flex: 1,
  flexDirection:"column-reverse",
  padding:10,
  backgroundColor: colors.background
}
const $messageStyle: TextStyle = {
  fontSize:30,
  lineHeight:30
}
const $remoteMessageStyle: TextStyle = {
  alignSelf:"flex-end"
}