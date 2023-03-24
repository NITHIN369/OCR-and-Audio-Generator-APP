import { useState ,useEffect} from "react";
import { Stack } from "expo-router";
import {ScrollView, Text, View,Button} from "react-native"
import { SafeAreaView,StyleSheet,PermissionsAndroid } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list'
import * as ImagePicker from 'expo-image-picker';
import AnimatedLoader from 'react-native-animated-loader';
// import {Audio} from "expo-av";
import axios from "axios";
// import { encode as btoa } from 'base-64';
// import * as FileSystem from "expo-file-system"
import * as Speech from 'expo-speech';
// import { typesAreEqual } from "react-native-document-picker/lib/typescript/fileTypes";
const App= ()=>{
    const [visible,setVisible]=useState(false)
    const [TranslatedText, setTranslatedText] = useState("Please upload image and click submit button"); //Please upload image and click submit button
    const [hasGalleryPermission,setHasGalleryPermission]=useState(null);
    const [imglang,setImgLang]=useState("eng");
    const [translang,setTransLang]=useState("en")
    const [img,setimg]=useState(null)
    const Language=[{key:'eng',value:'English'},
    {key:'tam',value:'Tamil'},
    {key:'hin',value:'Hindi'},
    {key:'fra',value:'French'}
    ]
    const transLanguage=[{key:'en',value:'English'},
    {key:'ta',value:'Tamil'},
    {key:'hi',value:'Hindi'},
    {key:'fr',value:'French'}]
    useEffect(()=>{
    (async ()=>{
        const gallerStatus=await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(gallerStatus.status==='granted')
    })()
    },[])
    const selectDoc= async ()=>{
        let result=await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Images,allowsEditing:true,aspect:[5,5],quality:1});
        console.log(result)
        if(!result.canceled){
            setimg(result.assets[0].uri)
            console.log(img)
        }else{
            console.log("Error in picking image")
        }
    }
    const GetAudio=async()=>{
        setVisible(true)
        try{
            if(img==null){
                alert("Please Upload image!!");
            }else{
        const formData=new FormData();
        formData.append('image',{
            name:new Date()+"_img.jpeg",
            uri:img,
            type:'image/jpeg'
        })
        formData.append('langs',imglang)
        formData.append('translang',translang)
        const response=await axios.post("http://172.16.150.75:5000/extracttextForMobile",formData,{ headers:{
                    'Content-Type': 'multipart/form-data',
                }})
        console.log("Response: ");
        console.log(response.data.data);
        setTranslatedText(response.data.data)
        setVisible(false);
        alert("Translated Successfully Click Speech button to listen audio")
    }}catch(err){
        alert("Error in Translation")
        console.log(err)
    }
    setVisible(false);

}
   
    const GetSpeech=()=>{
        console.log("Clicked: "+TranslatedText)
       Speech.speak(TranslatedText,{language:translang});
    }
    const StopSpeech=()=>{
        Speech.stop();
    }
    if(hasGalleryPermission===false){
        return <Text>File access required</Text>
    }
    return <SafeAreaView style={{backgroundColor:"#97DEFF",width:"100%",height:"100%"}}>
   { visible && <View>
        <Stack.Screen  options={{
            headerTitleAlign:"center",
            headerTitle:"OCR and Audio Generator",
            headerStyle:{backgroundColor:"#C9EEFF"},
        }} />
        <AnimatedLoader
    source={require("../loaderAnim.json")}
      visible={visible}
      overlayColor="rgba(255,255,255,0.75)"
      animationStyle={styles.lottie}
      speed={1}>
      <Text style={{marginLeft:13}}>Please Wait....</Text>
    </AnimatedLoader>
    </View>}
   { visible==false && <View> 
        <Stack.Screen  options={{
            headerTitleAlign:"center",
            headerTitle:"OCR and Audio Generator",
            headerStyle:{backgroundColor:"#C9EEFF"},
        }} />
        <ScrollView >
            <View style={styles.MainView}>
                <Text style={styles.TextStyle}>Select Language Present in Image: </Text>
                <SelectList style={styles.selectBox}  setSelected={(val)=>{console.log(imglang);setImgLang(val)}} save="key"  data={Language} />
               <Text style={styles.TextStyle2}>Upload Image:</Text>
               <View >
                <Button  title="Select Image" onPress={selectDoc}/>
               </View>
               <Text  style={styles.TextStyle2} >Select language You want to get audio file:</Text>
               <SelectList  setSelected={(val)=>setTransLang(val)} save="key" data={transLanguage} />
              <View style={{marginTop:25,marginLeft:75,marginRight:80}}><Button title="Submit" onPress={GetAudio} /></View>  
               <View style={styles.SpeechBox}>
               
               <View style={{width:"30%"}}><Button title="Speech" onPress={GetSpeech} /> 
               </View>
        <View style={{width:"30%",borderBottomLeftRadius:20}} >  
            <Button title="Stop" onPress={StopSpeech} /></View>  
        </View> 
            </View>
        </ScrollView>
        </View>}
    </SafeAreaView>
}
const styles=StyleSheet.create({
    lottie:{
        height:100,
    },
    MainView:{
        padding:20,
        backgroundColor:"white",
        width:"85%",
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:90,
        // height:"100%"
        minHeight:"60%",
        borderRadius:20,
    },
    TextStyle:{
        fontSize:20,
        marginBottom:10
    },
    TextStyle2:{
        fontSize:20,
        marginBottom:10,
        marginTop:10
    },
    SpeechBox:{
        flexDirection:"row",
        justifyContent:"space-evenly",
        marginTop:20,
       flex:1,
    }
})
export default App;







 // return <View>
    //     <Stack.Screen  options={{
    //         headerTitleAlign:"center",
    //         headerTitle:"OCR and Audio Generator",
    //         headerStyle:{backgroundColor:"#C9EEFF"},
    //     }} />
    //     <AnimatedLoader
    // source={require("../loaderAnim.json")}
    //   visible={visible}
    //   overlayColor="rgba(255,255,255,0.75)"
    //   animationStyle={styles.lottie}
    //   speed={1}>
    //   <Text style={{marginLeft:13}}>Please Wait....</Text>
    // </AnimatedLoader>
    // </View>