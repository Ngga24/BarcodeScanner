import { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

export default function QuaggaScanner({onDetected}) {
const scanner = useRef(null);

    useEffect(() => {
        if(!scanner.current) return;

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
        
        // callback menerima hasil scanner
        Quagga.onDetected((result) => {
            if(result?.codeResult?.code) {
                onDetected?.(result.codeResult.code);
            }
        })

        return() => {
            Quagga.stop();
            Quagga.offDetected();
        }
    }, [onDetected]) // depedency 
    
    return(
        <div className="Camera" ref={scanner}></div>
    )
}