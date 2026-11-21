import { useState } from "react";
import { createVehicle } from "../api/vehicles";
import { getErrorMessage } from "../api/errors";
import { Form, Input, DatePicker, Button, Row, Col } from 'antd';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

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
            <Header title={"New Vehicle"} description="Add a new vehicle to your list"></Header>
            <Form
                name="basic"
                layout="vertical"
                requiredMark="optional"
                onFinish={(values) => SubmitVehicle(values)}
                autoComplete="off"
            >
                <Form.Item
                    label="Registration number"
                    name="registrationNumber"
                    rules={[{ required: true, whitespace: true, message: 'Registration number is required!' }]}
                >
                    <Input placeholder="e.g. 1กก 1234" />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Brand"
                            name="brand"
                            rules={[{ required: true, whitespace: true, message: 'Brand is required!' }]}
                        >
                            <Input placeholder="e.g. Toyota" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Model"
                            name="model"
                            rules={[{ required: true, whitespace: true, message: 'model is required!' }]}
                        >
                            <Input placeholder="e.g. Camry" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Color"
                            name="color"
                        >
                            <Input placeholder="e.g. White" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item label="Year" name="year">
                            <DatePicker
                                picker="year"
                                placeholder="Select year"
                                style={{ width: "100%" }}
                                disabledDate={(current) => current && (current.year() < MIN_YEAR || current.year() > MAX_YEAR)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Notes"
                    name="notes"
                >
                    <Input.TextArea rows={3} placeholder="Anything worth remembering" />
                </Form.Item>

                {errMsg !== "" && (
                    <p className="error-message">{errMsg}</p>
                )}

                <div className="form-actions">
                    <Button onClick={() => navigate("/vehicles")} disabled={saving}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={saving}>
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    )
}