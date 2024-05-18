'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { get, onValue, ref } from 'firebase/database';
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
    const [infusionData, setInfusionData] = useState([]);

    useEffect(() => {
        if (id) {
            const patientRef = ref(database, `pasien/${id}`);

            const unsubscribe = onValue(patientRef, (snapshot) => {
                if (snapshot.exists()) {
                    setPatient(snapshot.val());
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

    const labels = infusionData.map(entry => entry.time);
    const data = {
        labels,
        datasets: [
            {
                label: 'Kecepatan Infus (TPM)',
                data: infusionData.map(entry => entry.drip_rate),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    }

    return (
        <div className="container">
            <h1>Detail Pasien</h1>
            <p>Nama: {patient.nama}</p>
            <p>Nomor Kamar: {patient.nomor_kamar}</p>
            <p>kecepatan infus (TPM): {patient.drip_rate.toFixed(2)}</p>
            <p>Cairan infus: {patient.infusion_weight}</p>

            <div className="chart-container">
                <Line data={data}/>
            </div>
        </div>
    )
}