'use client'
import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from './firebaseConfig';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const patientsRef = ref(database, 'pasien');
    get(patientsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const patientArray = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data
        }));
        setPatients(patientArray);
      }
    }).catch(error => {
      console.error("Error retrieving patients:", error);
    });
  })

  const handleRowClick = (id) => {
    router.push(`/pasien/${id}`)
  }

  return (
    <main className="container flex flex-col items-center justify-between p-24">
      <h1 className="header mb-5 text-xl font-semibold">Monitoring Cairan Infus RS. Beleng-beleng</h1>
      <div className="table-container relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="table-header text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                  Nama Pasien
              </th>
              <th scope="col" className="px-6 py-3">
                  Nomor Kamar
              </th>
              <th scope="col" className="px-6 py-3">
                  Kecepatan Infus (TPM)
              </th>
              <th scope="col" className="px-6 py-3">
                  Cairan Infus (mL)
              </th>
            </tr>
          </thead>
          <tbody className='table-body'>
            {patients.map(patient => (
              <tr key={patient.id} 
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"  
                onClick={() => handleRowClick(patient.id)}
              > 
                <button>
                  <th 
                    scope="row" 
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"  
                  >
                    {patient.nama}
                  </th>
                </button>           
                <td className="px-6 py-4">
                  <button>
                    {patient.nomor_kamar}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button>
                    {patient.drip_rate.toFixed(2)}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button>
                    {patient.infusion_weight}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}