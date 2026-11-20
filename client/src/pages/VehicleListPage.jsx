import { useState, useEffect } from 'react'

import { listVehicles } from '../api/vehicles'

import { getErrorMessage } from '../api/errors';

export default function VehicleListPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    async function fetchListVehicles() {
        setLoading(true);
        setErrMsg("");

        try {
            const res = await listVehicles();
            setVehicles(res);
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
            setErrMsg(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchListVehicles();
    }, []);

    let content;

    if (loading) {
        content = <p>Loading vehicles...</p>;
    } else if (errMsg !== "") {
        content = (
            <div>
                <p>{errMsg}</p>
                <button onClick={fetchListVehicles}>
                    Retry
                </button>
            </div>
        );
    } else if (vehicles.length === 0) {
        content = <p>No vehicles found.</p>;
    } else {
        content = (
            <>
                <p>VehicleListPage</p>
                {/* Vehicle list */}
            </>
        );
    }

    return (
        <div>
            {content}
        </div>
    );
}