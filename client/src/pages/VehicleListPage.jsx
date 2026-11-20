import { useState, useEffect } from 'react'

import { listVehicles } from '../api/vehicles'

import { getErrorMessage } from '../api/errors';
import { Table } from 'antd'
import { Link } from 'react-router-dom';

const showValue = (value) => value ?? "–";

const COLUMNS = [
    {
        title: 'Registration Number',
        dataIndex: 'registrationNumber',
        key: 'registrationNumber',
    },
    {
        title: 'Brand',
        dataIndex: 'brand',
        key: 'brand',
    },
    {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
        render: showValue,
    },
    {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
        render: showValue,
    },
    {
        title: 'Notes',
        dataIndex: 'notes',
        ellipsis: true,
        width: 240,
        key: 'notes',
        render: showValue,
    },
]

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
        content = (
            <div>
                <p>No vehicles found.</p>
                <Link to={{ pathname: "/vehicles/new", }}>
                    Add new Vehicle - <button>Add</button>
                </Link>
            </div>
        );
    } else {
        content = (
            <>
                <Table columns={COLUMNS} dataSource={vehicles} rowKey="id" />
            </>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Vehicles</h1>
                <Link to={{ pathname: "/vehicles/new", }}>
                    <button>Add</button>
                </Link>

            </div>
            {content}
        </div>
    );
}