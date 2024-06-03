'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { get, ref, update } from "firebase/database";
import { database } from "@/app/firebaseConfig";

export default function EditPasien() {
    const { id } = useParams();
    const router = useRouter();
    const [ patient, setPatient ] = useState(null);
    const [ form, setForm ] = useState({
        nama: '',
        nomor_kamar: '',
        drip_rate: '',
        infusion_weight: ''
    });

    useEffect(() => {
        if (id) {
            const patientRef = ref(database, `pasien/${id}`);
            get(patientRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setPatient(data);
                    setForm(data);
                } else {
                    console.log('pasien tidak ditemukan');
                }
            }).catch(error => {
                console.error("error! ", error);
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form, 
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const patientRef = ref(database, `pasien/${id}`);
        update(patientRef, form).then(() => {
            alert('Data berhasil diperbarui');
            router.push(`/pasien/${id}`);
        }).catch(error => {
            console.error("Error update: ", error)
        })
    }

    if (!patient) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Edit Data Pasien</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nama Pasien</label>
              <input 
                type="text" 
                name="nama"
                value={form.nama} 
                onChange={handleChange} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nomor Kamar</label>
              <input 
                type="text" 
                name="nomor_kamar"
                value={form.nomor_kamar} 
                onChange={handleChange} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Kecepatan Infus (TPM)</label>
              <input 
                type="number" 
                name="drip_rate"
                value={form.drip_rate} 
                onChange={handleChange} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Cairan Infus (mL)</label>
              <input 
                type="number" 
                name="infusion_weight"
                value={form.infusion_weight} 
                onChange={handleChange} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Simpan
            </button>
          </form>
        </div>
      );
}