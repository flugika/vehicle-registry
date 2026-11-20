import { useState, useEffect } from "react";
import { updateVehicle, getVehicle } from "../api/vehicles";
import { getErrorMessage } from "../api/errors";
import { Form, Input, DatePicker, Button } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import dayjs from 'dayjs'

export const MIN_YEAR = 1886;
export const MAX_YEAR = 2100;

export default function VehicleEditPage() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false)
    const [errMsg, setErrMsg] = useState("");
    const [form] = Form.useForm()
    const { id } = useParams();
    const navigate = useNavigate();

    async function SubmitVehicle(values) {
        setSaving(true);
        setErrMsg("");

        try {
            const payload = {
                ...values,
                color: values.color?.trim() || null,
                year: values.year ? values.year.year() : null,
                notes: values.notes?.trim() || null,
            }
            await updateVehicle(id, payload);
            navigate("/vehicles", {
                state: {
                    successMessage: `Updated vehicle ${values.registrationNumber}`,
                },
            });
        } catch (error) {
            console.error('Failed to update new vehicle:', error);
            setErrMsg(getErrorMessage(error));
        } finally {
            setSaving(false);
        }
    }

    async function fetchGetVehicle() {
        setLoading(true);
        setErrMsg("");

        try {
            const res = await getVehicle(id);
            form.setFieldsValue({
                ...res,
                year: res.year ? dayjs(String(res.year)) : null,
            })
            console.log(res)
        } catch (error) {
            console.error('Failed to fetch vehicle:', error);
            setErrMsg(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGetVehicle();
    }, [id])

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Edit Vehicle</h1>
            </div>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                onFinish={(values) => SubmitVehicle(values)}
                autoComplete="off"
            >
                <Form.Item
                    label="Registration number"
                    name="registrationNumber"
                    rules={[{ required: true, whitespace: true, message: 'Registration number is required!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Brand"
                    name="brand"
                    rules={[{ required: true, whitespace: true, message: 'Brand is required!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Model"
                    name="model"
                    rules={[{ required: true, whitespace: true, message: 'model is required!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Color"
                    name="color"
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Year" name="year">
                    <DatePicker
                        picker="year"
                        disabledDate={(current) => current && (current.year() < MIN_YEAR || current.year() > MAX_YEAR)} />
                </Form.Item>
                <Form.Item
                    label="Notes"
                    name="notes"
                >
                    <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={saving} disabled={loading}>
                    Submit
                </Button>
            </Form>
            {errMsg !== "" && <p>{errMsg}</p>}
        </div>
    )
}