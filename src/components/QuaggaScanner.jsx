import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";

export default function QuaggaScanner({onDetected}) {
    const scanner = useRef(null);
    const [result, setResult] = useState(""); 
    const [input, setInput] = useState(""); 

    useEffect(() => {
        // Inisialisasi camera
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: scanner.current,
                constraints: {
                    facingMode: "user"
                },
                willReadFrequently: true
            }, 

            decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"],
            }
        }, (error) => {
            if(error) {
                console.log("Scanner error", error);
                return
            }
            Quagga.start();
        })
        
        // Patern (pola berulang)
        const handler = (result) => {
            if(result?.codeResult?.code) {
                setResult(result.codeResult.code);
                onDetected(result.codeResult.code);
            };
        }

        Quagga.onDetected(handler)

        return() => {
            Quagga.offDetected(handler);
            Quagga.stop();
        }
    }, [onDetected]) // depedency 

    const noDetected = (event) =>{
        if(event.key === "Enter" && input.trim() !== "") {
            setResult(input);
            setInput("") // reset input
        }
    }
    
    return(
        <div className="wrape">
            <div className="camera" ref={scanner}>
            </div>
            <input className="input" type="text" value={input} onKeyDown={noDetected} placeholder="Manual barcode..." onChange={(x) => setInput(x.target.value)}></input>
            {result && (
                <p className="result_barcode">
                    Hasil barcode: {result}
                </p>
            )}
        </div>
    )
}