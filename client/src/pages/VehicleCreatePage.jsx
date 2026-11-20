import { useState } from "react";
import { createVehicle } from "../api/vehicles";
import { getErrorMessage } from "../api/errors";
import { Form, Input, DatePicker, Button } from 'antd';

export const MIN_YEAR = 1886;
export const MAX_YEAR = 2100;

export default function VehicleCreatePage() {
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    async function SubmitVehicle(values) {
        setLoading(true);
        setErrMsg("");

        try {
            const payload = {
                ...values,
                year: values.year ? values.year.year() : null,
            }
            await createVehicle(payload);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Failed to create new vehicle:', error);
            setErrMsg(getErrorMessage(error));
        } finally {
            setLoading(false);
            setIsSubmitted(false)
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
                    rules={[{ required: true, message: 'Registration number is required!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Brand"
                    name="brand"
                    rules={[{ required: true, message: 'Brand is required!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Model"
                    name="model"
                    rules={[{ required: true, message: 'model is required!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Color"
                    name="color"
                    rules={[{ required: true, message: 'color is required!' }]}
                >
                    <Input />
                </Form.Item>
                {/* <Form.Item
                    label="Year"
                    name="year"
                    rules={[{ required: true, message: 'year is required!' }]}
                >
                    <Input />
                </Form.Item> */}
                <Form.Item label="Year" name="year">
                    <DatePicker
                        picker="year"
                        disabledDate={(current) => current && (current.year() < MIN_YEAR || current.year() > MAX_YEAR)} />
                </Form.Item>
                <Form.Item
                    label="Notes"
                    name="notes"
                    rules={[{ required: true, message: 'notes is required!' }]}
                >
                    <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                </Button>
            </Form>
            {isSubmitted && <p>Submitted</p>}
            {errMsg !== "" && <p>{errMsg}</p>}
        </div>
    )
}