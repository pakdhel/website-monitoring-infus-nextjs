'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { get, ref } from 'firebase/database';
import { database } from "../../firebaseConfig";

export default function PatientDetail() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        if (id) {
            const patientRef = ref(database, `pasien/${id}`);
            get(patientRef).then((snapshot) => {
                if (snapshot.exists()) {
                    setPatient(snapshot.val());
                } else {
                    console.error('Pasien tidak ditemukan');
                }
            }).catch(error => {
                console.error("error retrieving patient:", error);
            });
        }
    }, [id]);

    if (!patient) {
        return <div>LOADING...</div>
    }

    return (
        <div className="container">
            <h1>Detail Pasien</h1>
            <p>Nama: {patient.nama}</p>
            <p>Nomor Kamar: {patient.nomor_kamar}</p>
            <p>kecepatan infus (TPM): {patient.drip_rate.toFixed(2)}</p>
            <p>Cairan infus: {patient.infusion_weight}</p>
        </div>
    )
}