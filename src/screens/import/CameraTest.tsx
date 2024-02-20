import { StyleSheet } from "react-native"
import { Camera, useCameraDevice } from "react-native-vision-camera"


function App() {
    const device = useCameraDevice('back')
    const camera = useRef<Camera>(null)
  
    // if (device == null) return <NoCameraDeviceErrorr />
    return (
      <Camera
        style={StyleSheet.absoluteFill}
        ref={camera}
        device={device}
        isActive={true}
        photo={true}
      />
    )
  }

export default App