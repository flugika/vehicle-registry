import { useState } from "react";
import { createVehicle } from "../api/vehicles";
import { getErrorMessage } from "../api/errors";
import { Form, Input, DatePicker, Button } from 'antd';
import { useNavigate } from "react-router-dom";

export const MIN_YEAR = 1886;
export const MAX_YEAR = 2100;

export default function VehicleCreatePage() {
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState("");

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
            await createVehicle(payload);
            navigate("/vehicles", {
                state: {
                    successMessage: `Create new vehicle ${values.registrationNumber}`,
                },
            });
        } catch (error) {
            console.error('Failed to create new vehicle:', error);
            setErrMsg(getErrorMessage(error));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>New Vehicle</h1>
            </div>
            <Form
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

                <Button type="primary" htmlType="submit" loading={saving}>
                    Submit
                </Button>
            </Form>
            {errMsg !== "" && <p>{errMsg}</p>}
        </div>
    )
}