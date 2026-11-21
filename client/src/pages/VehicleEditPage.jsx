import { useState, useEffect } from "react";
import { updateVehicle, getVehicle } from "../api/vehicles";
import { getErrorMessage } from "../api/errors";
import { Form, Input, DatePicker, Button, Row, Col } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import dayjs from 'dayjs'
import Header from "../components/Header";

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
            <Header title={"Edit Vehicle"} description="Update vehicle information"></Header>
            <Form
                form={form}
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
                    <Input placeholder="e.g. 1กก 1234" disabled={loading} />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Brand"
                            name="brand"
                            rules={[{ required: true, whitespace: true, message: 'Brand is required!' }]}
                        >
                            <Input placeholder="e.g. Toyota" disabled={loading} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Model"
                            name="model"
                            rules={[{ required: true, whitespace: true, message: 'model is required!' }]}
                        >
                            <Input placeholder="e.g. Camry" disabled={loading} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Color"
                            name="color"
                        >
                            <Input placeholder="e.g. White" disabled={loading} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item label="Year" name="year">
                            <DatePicker
                                picker="year"
                                placeholder="Select year"
                                disabled={loading}
                                style={{ width: "100%" }}
                                disabledDate={(current) => current && (current.year() < MIN_YEAR || current.year() > MAX_YEAR)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Notes"
                    name="notes"
                >
                    <Input.TextArea rows={3} placeholder="Anything worth remembering" disabled={loading} />
                </Form.Item>

                {errMsg !== "" && (
                    <p className="error-message">{errMsg}</p>
                )}

                <div className="form-actions">
                    <Button onClick={() => navigate("/vehicles")} disabled={saving}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={saving} disabled={loading || errMsg !== ""}>
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    )
}