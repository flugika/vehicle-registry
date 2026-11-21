import { useState, useEffect, useRef } from 'react'

import { listVehicles } from '../api/vehicles'

import { getErrorMessage } from '../api/errors';
import { Button, Table, Space, Empty, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
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
    const [deletingId, setDeletingId] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();
    const navigate = useNavigate();

    const hasShownMessage = useRef(false);

    const COLUMNS = [
        {
            title: 'Registration No.',
            dataIndex: 'registrationNumber',
            key: 'registrationNumber',
            width: 150,
            render: (value) => <span className="reg-number">{value}</span>,
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
            width: 90,
            render: showValue,
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            ellipsis: true,
            width: 220,
            key: 'notes',
            render: showValue,
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: 170,
            render: (_, record) => (
                <div className="row-actions">
                    <Link to={`/vehicles/${record.id}/edit`}><Button>Edit</Button></Link>
                    <Popconfirm
                        title={`Delete ${record.registrationNumber}?`}
                        onConfirm={() => handleDelete(record)}
                        okButtonProps={{ danger: true }}
                        disabled={deletingId !== null && deletingId !== record.id}
                    >
                        <Button
                            danger
                            loading={deletingId === record.id}
                            disabled={deletingId !== null && deletingId !== record.id}
                        >
                            Delete
                        </Button>
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
        setDeletingId(record.id);
        setErrMsg("");

        try {
            await deleteVehicle(record.id);
            await fetchListVehicles();
            messageApi.success(`Deleted vehicle ${record.registrationNumber}`);
        } catch (error) {
            console.error('Failed to delete vehicle:', error);
            setErrMsg(getErrorMessage(error));
        } finally {
            setDeletingId(null);
        }
    }

    useEffect(() => {
        fetchListVehicles();
    }, []);

    let content;

    if (loading) {
        content = (
            <div className="page-status">
                <Spin />
                <p>Loading vehicles...</p>
            </div>
        );
    } else if (errMsg !== "") {
        content = (
            <div className="page-status">
                <p className="error-message">{errMsg}</p>
                <Button type='primary' onClick={fetchListVehicles}>
                    Retry
                </Button>
            </div>
        );
    } else if (vehicles.length === 0) {
        content = (
            <div className="page-status">
                <Empty description="No vehicles found">
                    <Link to={{ pathname: "/vehicles/new", }}>
                        <Button type='primary' icon={<PlusOutlined />}>Add vehicle</Button>
                    </Link>
                </Empty>
            </div>
        );
    } else {
        content = (
            <>
                <Table
                    columns={COLUMNS}
                    dataSource={vehicles}
                    rowKey="id"
                    scroll={{ x: 820 }}
                    pagination={{ pageSize: 10, hideOnSinglePage: true }}
                />
            </>
        );
    }

    return (
        <div>
            {contextHolder}
            <Header
                title="Vehicles"
                description="Manage your vehicles"
                actions={
                    <Space>
                        <Link to={{ pathname: "/vehicles/new", }}>
                            <Button type='primary' icon={<PlusOutlined />}>Add</Button>
                        </Link>
                    </Space>
                }
                showBack={false}
            />
            {content}
        </div>
    );
}