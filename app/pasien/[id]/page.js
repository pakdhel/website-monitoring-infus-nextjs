'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { onValue, ref } from 'firebase/database';
import { database } from "../../firebaseConfig";
import { Line } from "react-chartjs-2";
import { 
    Chart as Chartjs, 
    CategoryScale,
    LinearScale,
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend 
} from "chart.js";

Chartjs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PatientDetail() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [ dripRateArr, setDripRateArr] = useState([]);
    const [ timeArr, setTimeArr ] = useState([]);

    useEffect(() => {
        if (id) {
            const patientRef = ref(database, `pasien/${id}`);

            const unsubscribe = onValue(patientRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setPatient(data);

                    setDripRateArr(prevDripRateArr => [...prevDripRateArr, data.drip_rate]);
                    
                    const elapsedTime = new Date(data.time);
                    const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
                    const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
                    const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
                    const formattedTime = `${hours}:${minutes}:${seconds}`;

                    setTimeArr(prevTimerArr => [...prevTimerArr, formattedTime]);

                    console.log(data);

                } else {
                    console.error('Pasien tidak ditemukan');
                }
            }, error => {
                console.error("error:", error);
            });

            return () => unsubscribe();
            
        }
    }, [id]);

    if (!patient) {
        return <div>LOADING...</div>
    }

    const dataChart = {
        labels: timeArr,
        datasets: [
            {
                label: 'Kecepatan Infus',
                data: dripRateArr,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Kecepatan Infus',
          },
        },
    };

    return (
        <div className="container">
            <h1>Detail Pasien</h1>
            <p>Nama: {patient.nama}</p>
            <p>Nomor Kamar: {patient.nomor_kamar}</p>
            <p>kecepatan infus (TPM): {patient.drip_rate}</p>
            <p>Cairan infus: {patient.infusion_weight}</p>

            <div className="chart-container">
                <Line data={dataChart} options={options}/>
            </div>
        </div>
    )
}