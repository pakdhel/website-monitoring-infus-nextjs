'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Router } from "next/router";

Chartjs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PatientDetail() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [ dripRateArr, setDripRateArr] = useState([]);
    const [ timeArr, setTimeArr ] = useState([]);
    const router = useRouter();

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
                tension: 0.4,
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
        <div className="container flex justify-center items-center h-full m-auto p-4">
            <div className="card mr-3">
                <div class="w-[330px] rounded-[20px] bg-[#1b233d] p-[5px] overflow-hidden shadow-[rgba(100,100,111,0.2)_0px_7px_20px_0px] transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
                    <div class="relative h-[150px] rounded-[15px] flex flex-col bg-gradient-to-br from-[#049fbb] to-[#50f6ff]">
                        <div class="absolute top-0 w-full h-[30px] flex justify-between">
                            {/* <Image 
                                src="/profile.png"
                                width={150}
                                height={150}
                            /> */}
                        </div>
                    </div>
                    <div class="mt-[15px] p-[10px_5px]">
                        <span class="block text-[17px] font-bold text-white text-center tracking-[2px]">{patient.nama}</span>
                        <div class="flex justify-between mt-[20px]">
                            <div class="flex-[30%] text-center p-[5px] text-[rgba(170,222,243,0.721)]">
                                <span class="block text-[12px]">Nomor Kamar</span>
                                <span class="text-[12px]">{patient.nomor_kamar}</span>
                            </div>
                            <div class="flex-[30%] text-center p-[5px] text-[rgba(170,222,243,0.721)] border-l border-r border-[rgba(255,255,255,0.126)]">
                                <span class="block text-[12px]">Kecepatan Infus (TPM) </span>
                                <span class="text-[12px]">{patient.drip_rate.toFixed(2)}</span>
                            </div>
                            <div class="flex-[30%] text-center p-[5px] text-[rgba(170,222,243,0.721)]">
                                <span class="block text-[12px]">Cairan Infus</span>
                                <span class="text-[12px]">{patient.infusion_weight}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center font-semibold text-white text-[15px] p-3">
                        <button 
                        className="bg-[#bababa] p-2 w-[100%] rounded-md"
                        onClick={() => router.push(`/pasien/${id}/edit`)}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>

            <div className="chart-container p-[10px] max-w-[750px] min-w-[700px]">
                <Line className="" data={dataChart} options={options}/>
            </div>
        </div>
    )
}