import { useState, useEffect, useRef } from 'react'

import { listVehicles } from '../api/vehicles'

import { getErrorMessage } from '../api/errors';
import { Button, Table, Space } from 'antd'
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from "react-router-dom";
import { message, Popconfirm } from "antd";
import { deleteVehicle } from '../api/vehicles';
import Header from '../components/Header'

const showValue = (value) => value ?? "–";

export default function VehicleListPage() {
    const [vehicles, setVehicles] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();
    const navigate = useNavigate();

    const hasShownMessage = useRef(false);

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
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: 2 }}>
                    <Link to={`/vehicles/${record.id}/edit`}><Button>Edit</Button></Link>
                    <Popconfirm
                        title={`Delete ${record.registrationNumber}?`}
                        onConfirm={() => handleDelete(record)}
                        okButtonProps={"danger: true"}
                    >
                        <Button type='danger' loading={deleting}>Delete</Button>
                    </Popconfirm>
                </div >
            )
        }
    ]

    useEffect(() => {
        if (location.state?.successMessage && !hasShownMessage.current) {
            hasShownMessage.current = true;

            messageApi.success(location.state.successMessage);

            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location, messageApi, navigate]);

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

    async function handleDelete(record) {
        setDeleting(true);
        setErrMsg("");

        try {
            await deleteVehicle(record.id);
            fetchListVehicles();
            messageApi.success(`Deleted vehicle ${record.registrationNumber}`);
        } catch (error) {
            console.error('Failed to delete vehicles:', error);
            setErrMsg(getErrorMessage(error));
        } finally {
            setDeleting(false);
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
                <Button type='primary' onClick={fetchListVehicles}>
                    Retry
                </Button>
            </div>
        );
    } else if (vehicles.length === 0) {
        content = (
            <div >
                <p>No vehicles found.</p>
                <div style={{ display: "flex", gap: 4 }}>
                    Add new Vehicle -
                    <Link to={{ pathname: "/vehicles/new", }}>
                        <Button type='primary'>Add</Button>
                    </Link>
                </div>
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
            {contextHolder}
            <Header
                title="Vehicles"
                actions={
                    <Space>
                        <Link to={{ pathname: "/vehicles/new", }}>
                            <Button type='primary'>Add</Button>
                        </Link>
                    </Space>
                }
                showBack={false}
            />
            {content}
        </div>
    );
}