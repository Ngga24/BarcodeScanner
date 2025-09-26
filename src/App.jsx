import { useState } from 'react';
import QuaggaScanner from './components/QuaggaScanner';


export default function App() {
  const [state, setState] = useState("");

  return(
    <div>
      <QuaggaScanner onDetected={(s) => setState(s)}></QuaggaScanner>    
    </div>
  ) 
}
