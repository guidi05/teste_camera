import {StatusBar} from 'expo-status-bar'
import React, { useState,useRef } from 'react'
import {StyleSheet, Text, View, TouchableOpacity,Image, SafeAreaView,Button, Alert} from 'react-native'
import {Camera} from 'expo-camera'
import * as FaceDetector from 'expo-face-detector';


import imagem from './imagens/camera.png'
import voltar from './imagens/seta.png'
import * as faceapi from 'face-api.js';



export default function App() {
  let cameraRef = useRef();
  const [gender, setGender] = useState("Nada");
  const [startCamera,setStartCamera] = React.useState(false)
  const [cameraType,setCameraType] = useState(Camera.Constants.Type.front)
  const [photo,setPhoto] = useState()
  const [faceData, setFaceData] = React.useState([]);
  const canvasRef = useRef(null);
  const [promessa,setPromessa] = useState();
 
  
 


async function initializeFaceAPI() {
  const MODEL_URL = "https://github.com/justadudewhohacks/face-api.js/tree/master/weights";
   Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
  ]).then(setPromessa(true)).catch((err) => {console.log(err)})
}


 




const handleFacesDetected =  async ({ faces }) => {
 
 setFaceData(faces);

 
  

}

const Voltar = ()=>{    //Funcao fechar camera
setStartCamera(false)
}

const __switchCamera = () => {         //mudar de camera
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }

const __startCamera = async () => {                          //Funcao Async permissao camera 
  const {status} = await Camera.requestCameraPermissionsAsync()   //Permissao
if(status === 'granted' ){           //Permissao concedida
  await initializeFaceAPI();  
  if(promessa===true){
 setStartCamera(true);  
  }            //Carregar modelos face api 
             //Startar camera com permissão concedida               
}
}

let takePic = async () => {               //Funcao tirar foto

  let options = {quality: 1,base64: true,exif: false};      //Configuracoes da foto 
  let newPhoto = await cameraRef.current.takePictureAsync(options);  
  //Acao de tirar foto 
  setPhoto(newPhoto);                                        //Alterar o estado da foto como true
};

function getFaceDataView() {          //O que ira mostrar na camera (Ao ser utilizada)


    if (faceData.length === 0) {                //Nenhum rosto detectado
      return (
<View                         //View Camera 
style={{flexDirection: "column",height: "100%",
width: "100%",alignItems: 'center',justifyContent: 'flex-end',padding: 10}}>

    <View                                                                         //View Text e Botoes
    style={{flexDirection: "column",height: "50%",justifyContent: "space-between",}}>
        <Text style={{color: "white",alignSelf: "center",fontSize: 20}}>
        NENHUM ROSTO DETECTADO! 
        </Text>
        <View                                 //View Botoes
      style={{flexDirection: "row",}}>      
      
        <TouchableOpacity   //Botao Voltar
        style={{alignSelf: 'center',flex: 1,alignItems: 'center',}}      
        onPress={Voltar}>
          <Image source={voltar} style={{width: 50,height:50}}/> 
         </TouchableOpacity>
         <TouchableOpacity     //Botao Trocar de camera
         style={{alignSelf: 'center',flex: 1,alignItems: 'center'}}     
         onPress={__switchCamera}>                                   
          <Image source={imagem} style={{width: 50,height:50}}/>                       
         </TouchableOpacity>

        </View>
    </View>       
</View>
);} 


else{       





const detections = faceapi.detectAllFaces(faceData, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()
.then(detections =>{
  if(detections[0].gender === "male" ) {
  setGender("Homem")
}
}).catch(erro => Alert.alert(erro))









                          //Rosto detectado
      return (
<View 
style={{position: 'absolute',bottom: 0,flexDirection: "row",alignItems: "center",justifyContent:"center",marginBottom:" 5%",width: "60%"}}>
  
  <TouchableOpacity  
  style={{alignSelf: 'center',flex: 1,alignItems: 'center',}}onPress={Voltar}>
    <Image source={voltar} style={{width: 50,height:50}}/> 
  </TouchableOpacity>
  
  <View 
  style={{alignSelf: 'center',flex: 1,alignItems: 'center'}}>
    <TouchableOpacity
    style={{width: 60,height:60,bottom: 0,borderRadius: 50,backgroundColor: '#fff'}}
    onPress={takePic}/>
  </View>
                
  <TouchableOpacity   
  style={{alignSelf: 'center',flex: 1,alignItems: 'center'}}onPress={__switchCamera}>
    <Image source={imagem} style={{width: 50,height:50}}/> 
  </TouchableOpacity>
  <Text
  style={{color: 'white'}}> {faceData.length} {gender} </Text>
       
        
          
</View>)
    }
  }


if (photo) {                    //Caso a foto tenha sido tirada 
   
  
  //Retornar à camera e tirar novamente a foto   
  let back = ()=> {                       
        setPhoto(undefined)
      };  
  
 //Foto tirada convertida em imagem     
 const fototirada = { uri: "data:image/jpg;base64," + photo.base64 }
 






 //Retorno da imagem para preview
  return (
<SafeAreaView style={styles.container}>
      
  <Image                                                        //Imagem preview 
  style={styles.preview} source={fototirada}/>       
      
    <View                                                         //View dos botoes preview
    style={{flexDirection: "row",justifyContent: "space-around",alignItems: "center",
    padding: 10,width: "100%",backgroundColor: "black"}}>

        <Button title='Tirar novamente '                            //Botao tirar foto novamente 
        onPress={back}  
        style={styles.botao1}/>

        <Button 
        onPress={verfaces(fototirada)}                                                    //Botao ver face
        title='Ver faces'/>
        <Text
        style={{color: "white",fontSize:15}}
        >{gender}</Text>

    </View>
</SafeAreaView>
  );
}

return (                            //Retorno inicial 
<View style={styles.container}>


    
{startCamera ? (        //Caso a start camera esteja ativada
      <Camera                                     //Camera e o que ela ira mostrar dependendo da detecção do rosto 
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
          onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
        minDetectionInterval: 100,
        tracking: true}}>   
        {getFaceDataView()}      
      </Camera>) :  
    
    (//caso a startcamera esteja desativada

      <View                     //View para Botao
          style={{flex: 1,backgroundColor: '#fff',justifyContent: 'center',alignItems: 'center'}}>
          <TouchableOpacity             //Botao                  
          onPress={__startCamera} 
          style={{width: 130,borderRadius: 4,backgroundColor: '#14274e',
              flexDirection: 'row',justifyContent: 'center',alignItems: 'center',height: 40}}>
            <Text                           //Texto do Botao 
              style={{color: '#fff',fontWeight: 'semibold',textAlign: 'center'}}>
              Take picture
            </Text>
          </TouchableOpacity>
      </View>
      )}

<StatusBar style="auto" />
</View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
 imagem: {
  width: 10,
  height: 10,
 },
 preview: {
  alignSelf: 'stretch',
  flex: 1
},
view_botao:{
  flexDirection: "column",
  
},
botao1:{
marginRight: "2%"
},
botao2:{
  marginLeft: "2%"
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
    width: "150%"
  },
  faces: {
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },
  faceDesc: {
    fontSize: 20
  }

})